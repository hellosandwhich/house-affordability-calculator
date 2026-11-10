# LionCity HomeAfford - Singapore Property Affordability Calculator

A comprehensive Singapore residential property affordability calculator built with React 19, TypeScript, and Tailwind CSS. The engine is modeled directly after Singapore's statutory framework under the **Monetary Authority of Singapore (MAS)** and the **Inland Revenue Authority of Singapore (IRAS)**.

## Features

- **Property Classification**: HDB Build-To-Order (BTO), HDB Resale Flats, Executive Condominiums (EC), Private Condominiums, and Landed Properties.
- **Out-of-Pocket Expense Breakdown**:
  - Mandatory 5% cash downpayment for commercial bank loans (0% cash for HDB concessionary loans).
  - Remaining 20% downpayment via CPF Ordinary Account (OA) or cash.
  - IRAS Buyer's Stamp Duty (BSD) calculated progressively across all 6 statutory tax tiers (1% to 6%).
  - IRAS Additional Buyer's Stamp Duty (ABSD) for Singapore Citizens (0% / 20% / 30%), Permanent Residents (5% / 30% / 35%), and Foreigners (60%), with matrimonial remission support.
  - Legal conveyancing fees, bank/HDB valuation fees, renovation budgets, and moving reserves.
  - Option to Purchase (OTP) cash flow schedule (1% option booking fee + 4% exercise fee).
- **Monthly Mortgage & Cashflow Dynamics**:
  - Standard amortization at contract interest rates vs. the official **MAS 4.00% stress-test rate floor**.
  - Monthly CPF OA offset calculation: Shows whether the mortgage is 100% absorbed by monthly CPF OA accrual or requires out-of-pocket cash top-ups.
  - Household cashflow waterfall: Gross household income, other debt obligations (car loans, credit cards, education loans), and remaining disposable take-home cash.
- **Regulatory MAS Ratios**:
  - **Mortgage Servicing Ratio (MSR 30%)**: Enforced for HDB and Executive Condominiums.
  - **Total Debt Servicing Ratio (TDSR 55%)**: Enforced for all residential property loans, incorporating the MAS 30% haircut on variable earnings.
- **Reverse Purchasing Power Calculator**:
  - Reverse-calculates your maximum affordable property price across HDB, EC, and Private Condo tiers, highlighting your primary limiting constraint (capital vs. debt cap).
- **Stress Tester & Runway Simulator**:
  - Simulates SORA interest rate spikes and household pay cuts to compute emergency reserve runway months.
- **Singapore Archetype Presets**:
  - First-Timer Couple (4-Room BTO)
  - HDB Resale 5-Room in Mature Estate (Queenstown / Bishan)
  - Executive Condominium (EC) Upgrader
  - Single Professional (OCR Condo)
  - Dual-Income Family (CCR Luxury Condo)

## Tech Stack

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & JetBrains Mono (tabular figures)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License

Apache-2.0
