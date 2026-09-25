# TAX-SHIELD

**Temporal-RAG Powered Tax Advisory & Deterministic Liability Engine**

TAX-SHIELD is a full-stack Indian income-tax advisory platform that combines a **deterministic rule engine** with **temporal vector knowledge retrieval** to deliver accurate, grounded tax calculations and advice — with zero reliance on LLM arithmetic.

---

## Features

- **Deterministic TaxRuleEngine** — Calculates liability under both Old and New tax regimes using hardcoded slabs, standard deductions, Section 87A rebates, and 4% Health & Education Cess. Always returns the lower liability.
- **Temporal RAG** — In-memory knowledge base of tax provisions filtered by strict `valid_from_year ≤ year ≤ valid_to_year` metadata. Prevents retrieval of inapplicable future or past laws.
- **Grounded AI Advisory** — Optional Google Gemini integration produces natural-language advice constrained to the rule-engine result and temporal context. The LLM is instructed never to perform its own math.
- **Modern Dashboard** — Dark cyber-finance UI (React + Tailwind) with assessment-year selector, presets, effective tax rate, cited sources, and live temporal evidence panel.
- **Offline fallback** — Frontend includes a client-side simulation of the rule engine so the UI remains usable even when the backend is offline.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI, Pydantic, Uvicorn |
| Tax Engine | Pure Python (no LLM) |
| RAG | Temporal metadata filter + keyword matching |
| LLM (optional) | Google Gemini 1.5 Flash |
| Frontend | React 18, Vite, Tailwind CSS, Lucide icons |
| Auth / DB (optional) | Supabase placeholders in `.env` |

---

## Project Structure

```
TAX-SHIELD-/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app & /api/v1/analyze-tax
│   │   ├── models.py            # Pydantic request/response models
│   │   ├── rule_engine.py       # Deterministic Old/New regime calculator
│   │   └── temporal_rag.py      # Temporal knowledge base & retrieval
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EvidencePanel.jsx
│   │   │   └── TaxDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js           # Backend client + offline fallback
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .gitignore
├── LICENSE
└── README.md
```

---

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- (Optional) Google Gemini API key

### 1. Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv

# Windows (PowerShell)
.\\venv\\Scripts\\Activate.ps1

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Optional: configure Gemini
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key

# Run the API
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (default http://localhost:3000).

---

## API Overview

**`POST /api/v1/analyze-tax`**

```json
{
  "query": {
    "question": "What is my tax liability under AY 2025-26?",
    "assessment_year": 2025
  },
  "profile": {
    "income": 1200000,
    "deductions": 150000,
    "tax_year": 2025,
    "employment_type": "salaried"
  }
}
```

**Response**

```json
{
  "advice": "...",
  "confidence_score": 0.95,
  "cited_sources": ["Income Tax Act Sec 87A ..."],
  "calculated_liability": 85800.0
}
```

---

## Supported Assessment Years

| AY | Notes |
|----|-------|
| 2024-25 | Previous year slabs |
| 2025-26 | Current — ₹75k standard deduction (New Regime), 87A up to ₹7L |
| 2026-27 | Proposed / illustrative future slabs |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Enables Gemini-powered advisory text |
| `SUPABASE_URL` | No | Placeholder for future persistence |
| `SUPABASE_KEY` | No | Placeholder for future persistence |

Without `GEMINI_API_KEY` the backend still returns correct deterministic liability and a grounded fallback message.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Disclaimer

TAX-SHIELD is an educational / demonstration tool. Tax calculations are approximate and based on simplified rules. Always consult a qualified tax professional or refer to official Income Tax Department publications for filing decisions.
