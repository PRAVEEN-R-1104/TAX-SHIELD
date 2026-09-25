from pydantic import BaseModel, Field
from typing import List, Optional

class UserFinancialProfile(BaseModel):
    income: float = Field(..., description="Gross annual income", ge=0)
    deductions: float = Field(0.0, description="Total eligible tax deductions", ge=0)
    tax_year: int = Field(2025, description="Tax / Assessment year (e.g. 2025)")
    employment_type: str = Field("salaried", description="Employment type e.g. salaried, self-employed, freelancer")

class TaxQuery(BaseModel):
    question: str = Field(..., description="Tax question or query")
    assessment_year: int = Field(2025, description="Target assessment year for tax rule application")

class AIResponse(BaseModel):
    advice: str = Field(..., description="AI generated tax advisory grounded in temporal context")
    confidence_score: float = Field(..., description="Confidence score between 0.0 and 1.0")
    cited_sources: List[str] = Field(default_factory=list, description="List of cited tax law provisions and sections")
    calculated_liability: float = Field(..., description="Deterministic tax liability calculated by TaxRuleEngine")

class TaxAnalysisRequest(BaseModel):
    query: TaxQuery
    profile: UserFinancialProfile
