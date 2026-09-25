from typing import List, Dict, Any

# Simulated Vector Database Document Store with Temporal Metadata
TEMPORAL_TAX_KNOWLEDGE_BASE: List[Dict[str, Any]] = [
    {
        "id": "sec_80c_2023_2025",
        "title": "Section 80C Deduction Limit",
        "text": "Section 80C allows deductions up to ₹1,50,000 per financial year for investments in PPF, EPF, ELSS, Life Insurance, and Principal Home Loan repayment under the Old Tax Regime.",
        "source": "Income Tax Act Sec 80C (Valid 2020-2025)",
        "valid_from_year": 2020,
        "valid_to_year": 2025,
        "keywords": ["80c", "deduction", "ppf", "epf", "elss", "investment", "old regime"]
    },
    {
        "id": "sec_87a_new_2025",
        "title": "Section 87A Rebate under New Regime (AY 2025-26)",
        "text": "For Assessment Year 2025-26, under the New Tax Regime, resident individuals with total taxable income up to ₹7,00,000 are eligible for full rebate u/s 87A, resulting in zero tax liability. Standard deduction is increased to ₹75,000.",
        "source": "Finance Act 2024 / AY 2025-26 Provisions",
        "valid_from_year": 2025,
        "valid_to_year": 2025,
        "keywords": ["87a", "rebate", "new regime", "700000", "7 lakh", "standard deduction", "2025"]
    },
    {
        "id": "sec_87a_new_2026",
        "title": "Section 87A & Revised Slabs (AY 2026-27)",
        "text": "For Assessment Year 2026-27, proposed modifications update slab thresholds: 0-4L at 0%, 4-8L at 5%, 8-12L at 10%. Rebate u/s 87A applies for taxable income up to ₹8,00,000 under New Regime.",
        "source": "Finance Act 2025 / Proposed Law AY 2026-27",
        "valid_from_year": 2026,
        "valid_to_year": 2027,
        "keywords": ["87a", "2026", "slabs", "8 lakh", "new regime"]
    },
    {
        "id": "sec_44ada_presumptive",
        "title": "Section 44ADA Presumptive Taxation for Professionals",
        "text": "Section 44ADA allows eligible professionals (freelancers, consultants, software engineers) with gross receipts up to ₹50,00,000 (increased to ₹75,00,000 if cash receipts <= 5%) to declare 50% of gross receipts as taxable income.",
        "source": "Income Tax Act Sec 44ADA (Valid 2023-2026)",
        "valid_from_year": 2023,
        "valid_to_year": 2026,
        "keywords": ["44ada", "freelancer", "consultant", "presumptive", "professional", "gross receipts"]
    },
    {
        "id": "sec_80d_health_insurance",
        "title": "Section 80D Health Insurance Deduction",
        "text": "Section 80D provides deduction up to ₹25,000 for health insurance premium for self/family, and up to ₹50,000 for senior citizen parents (Old Tax Regime only).",
        "source": "Income Tax Act Sec 80D (Valid 2020-2026)",
        "valid_from_year": 2020,
        "valid_to_year": 2026,
        "keywords": ["80d", "health insurance", "medical", "parents", "deduction"]
    },
    {
        "id": "capital_gains_ltcg_2025",
        "title": "LTCG Tax Rates (AY 2025-26)",
        "text": "For FY 2024-25 / AY 2025-26 onwards, Long Term Capital Gains (LTCG) on listed equity shares & equity mutual funds above ₹1.25 Lakhs are taxed at 12.5% without indexation.",
        "source": "Finance Act 2024 Sec 112A Amendments",
        "valid_from_year": 2024,
        "valid_to_year": 2026,
        "keywords": ["ltcg", "capital gains", "stocks", "mutual funds", "12.5%", "equity"]
    },
    {
        "id": "future_law_2027",
        "title": "Future Digital Tax Framework (2027+)",
        "text": "Unified Global Digital Asset Tax regulations effective from AY 2027-28 onwards imposing 35% flat tax on autonomous AI transactions.",
        "source": "Draft Digital Tax Law 2027",
        "valid_from_year": 2027,
        "valid_to_year": 2030,
        "keywords": ["digital tax", "ai", "2027"]
    }
]

def get_temporal_evidence(query: str, year: int) -> List[str]:
    """
    Retrieves tax evidence chunks filtered strictly by temporal validity window.
    Metadata filter constraint: valid_from_year <= year <= valid_to_year.
    Ensures future/past inapplicable laws (e.g. 2026 laws for a 2025 query) are NEVER retrieved.
    """
    query_lower = query.lower()
    
    # Step 1: Temporal Metadata Filter (STRICT HARD CONSTRAINT)
    temporally_valid_chunks = [
        chunk for chunk in TEMPORAL_TAX_KNOWLEDGE_BASE
        if chunk["valid_from_year"] <= year <= chunk["valid_to_year"]
    ]

    # Step 2: Relevance matching against query
    matched_chunks = []
    for chunk in temporally_valid_chunks:
        # Check if any keyword matches or if chunk text shares intent with query
        if any(kw in query_lower for kw in chunk["keywords"]) or any(word in chunk["text"].lower() for word in query_lower.split() if len(word) > 3):
            matched_chunks.append(f"[{chunk['source']}] {chunk['title']}: {chunk['text']}")

    # If no keyword match, return all temporally valid chunks as general context for that year
    if not matched_chunks:
        matched_chunks = [f"[{chunk['source']}] {chunk['title']}: {chunk['text']}" for chunk in temporally_valid_chunks]

    return matched_chunks
