class TaxRuleEngine:
    """
    Deterministic Tax Engine for calculating income tax liability 
    based on hardcoded tax bracket rules for specific tax years (Old and New Regimes).
    Does NOT use LLM or nondeterministic models.
    """

    def calculate_new_regime(self, income: float, deductions: float, year: int) -> float:
        # Standard deduction allowed under New Regime for salaried employees
        standard_deduction = 75000.0 if year >= 2025 else 50000.0
        taxable_income = max(0.0, income - standard_deduction)

        if taxable_income <= 0:
            return 0.0

        tax = 0.0

        if year >= 2025:
            # 2025-2026 New Tax Regime Slabs
            # Up to 3,00,000 -> Nil
            # 3,00,001 to 6,00,000 -> 5%
            # 6,00,001 to 9,00,000 -> 10%
            # 9,00,001 to 12,00,000 -> 15%
            # 12,00,001 to 15,00,000 -> 20%
            # Above 15,00,000 -> 30%
            if taxable_income > 1500000:
                tax += (taxable_income - 1500000) * 0.30
                taxable_income = 1500000
            if taxable_income > 1200000:
                tax += (taxable_income - 1200000) * 0.20
                taxable_income = 1200000
            if taxable_income > 900000:
                tax += (taxable_income - 900000) * 0.15
                taxable_income = 900000
            if taxable_income > 600000:
                tax += (taxable_income - 600000) * 0.10
                taxable_income = 600000
            if taxable_income > 300000:
                tax += (taxable_income - 300000) * 0.05

            # Rebate u/s 87A for New Regime (Taxable income up to 7 Lakhs gets full rebate)
            raw_taxable = max(0.0, income - standard_deduction)
            if raw_taxable <= 700000:
                tax = 0.0
        else:
            # Pre-2025 Slabs
            if taxable_income > 1500000:
                tax += (taxable_income - 1500000) * 0.30
                taxable_income = 1500000
            if taxable_income > 1200000:
                tax += (taxable_income - 1200000) * 0.20
                taxable_income = 1200000
            if taxable_income > 900000:
                tax += (taxable_income - 900000) * 0.15
                taxable_income = 900000
            if taxable_income > 600000:
                tax += (taxable_income - 600000) * 0.10
                taxable_income = 600000
            if taxable_income > 300000:
                tax += (taxable_income - 300000) * 0.05

            raw_taxable = max(0.0, income - standard_deduction)
            if raw_taxable <= 700000:
                tax = 0.0

        # Health and Education Cess @ 4%
        total_tax = tax * 1.04
        return round(total_tax, 2)

    def calculate_old_regime(self, income: float, deductions: float, year: int) -> float:
        # Old regime allows full specified deductions (80C, 80D, HRA, etc.) + 50,000 std deduction
        total_deduction = deductions + 50000.0
        taxable_income = max(0.0, income - total_deduction)

        if taxable_income <= 250000:
            return 0.0

        tax = 0.0
        if taxable_income > 1000000:
            tax += (taxable_income - 1000000) * 0.30
            taxable_income = 1000000
        if taxable_income > 500000:
            tax += (taxable_income - 500000) * 0.20
            taxable_income = 500000
        if taxable_income > 250000:
            tax += (taxable_income - 250000) * 0.05

        # Section 87A rebate for Old Regime if taxable income <= 5,00,000
        raw_taxable = max(0.0, income - total_deduction)
        if raw_taxable <= 500000:
            tax = 0.0

        total_tax = tax * 1.04
        return round(total_tax, 2)

    def calculate_liability(self, income: float, deductions: float, year: int) -> float:
        """
        Calculates exact tax liability by evaluating both regimes and returning lower tax liability.
        """
        new_tax = self.calculate_new_regime(income, deductions, year)
        old_tax = self.calculate_old_regime(income, deductions, year)

        # Return the lower tax liability for optimal taxpayer benefit
        return min(new_tax, old_tax)
