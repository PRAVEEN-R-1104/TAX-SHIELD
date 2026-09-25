import os
import re
from typing import Union
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import google.generativeai as genai

from app.models import UserFinancialProfile, TaxQuery, AIResponse, TaxAnalysisRequest
from app.rule_engine import TaxRuleEngine
from app.temporal_rag import get_temporal_evidence

load_dotenv()

app = FastAPI(
    title="TAX-SHIELD API",
    description="Temporal-RAG Powered Tax Advisory & Deterministic Liability Engine",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client if API key is present
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

rule_engine = TaxRuleEngine()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "TAX-SHIELD Backend",
        "version": "1.0.0"
    }

@app.post("/api/v1/analyze-tax", response_model=AIResponse)
def analyze_tax(payload: TaxAnalysisRequest):
    """
    Main Tax Shield Endpoint:
    1. Accepts TaxQuery and UserFinancialProfile
    2. Retrieves temporal evidence for the specified tax year
    3. Calculates exact deterministic tax liability using TaxRuleEngine
    4. Generates AI response using Gemini LLM constrained strictly by temporal context
    """
    query = payload.query
    profile = payload.profile

    # Determine assessment year (fallback to profile tax year if needed)
    year = query.assessment_year or profile.tax_year

    # 1. Fetch temporal evidence (filtered strictly by valid_from_year <= year <= valid_to_year)
    evidence_chunks = get_temporal_evidence(query.question, year)

    # 2. Calculate deterministic liability
    calculated_liability = rule_engine.calculate_liability(
        income=profile.income,
        deductions=profile.deductions,
        year=year
    )

    # 3. Build system prompt for LLM grounding
    system_prompt = "Answer ONLY using provided temporal context. Do not calculate math yourself; use provided rule engine results."
    
    context_str = "\n".join([f"- {chunk}" for chunk in evidence_chunks])

    user_prompt = f"""
System Instruction: {system_prompt}

User Question: {query.question}
Target Assessment Year: {year}

User Financial Profile:
- Gross Income: ₹{profile.income:,.2f}
- Deductions: ₹{profile.deductions:,.2f}
- Employment Type: {profile.employment_type}

Deterministic Rule Engine Tax Liability Result: ₹{calculated_liability:,.2f}

Temporal Tax Law Context (Valid for Year {year}):
{context_str}

Please generate structured, actionable, and clear tax advice for the user based strictly on the above context and rule engine liability.
"""

    advice_text = ""
    confidence_score = 0.95
    cited_sources = [chunk.split("]")[0].replace("[", "") for chunk in evidence_chunks if "]" in chunk]

    # 4. Generate AI advisory using Gemini LLM if API Key exists
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(user_prompt)
            if response and response.text:
                advice_text = response.text.strip()
        except Exception as e:
            # Fallback if Gemini call fails or rate limited
            advice_text = (
                f"Based on tax rules for Assessment Year {year}, your estimated tax liability is ₹{calculated_liability:,.2f}. "
                f"Grounding evidence applied: {', '.join(cited_sources[:2])}."
            )
    
    if not advice_text:
        # Grounded fallback advice text
        advice_text = (
            f"For Assessment Year {year}, based on an income of ₹{profile.income:,.2f} and deductions of ₹{profile.deductions:,.2f}, "
            f"your optimal calculated tax liability is ₹{calculated_liability:,.2f}.\n\n"
            f"Temporal Tax Provisions Applied:\n" + "\n".join([f"• {chunk}" for chunk in evidence_chunks[:3]])
        )

    return AIResponse(
        advice=advice_text,
        confidence_score=confidence_score,
        cited_sources=cited_sources,
        calculated_liability=calculated_liability
    )
