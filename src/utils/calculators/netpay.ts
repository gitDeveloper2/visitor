interface Options {
  nonCashBenefits?: number;
  pensionContribution?: number;
  otherAllowableDeductions?: number;
}

export interface NetPayResult {
  nssfTier1: number;
  nssfTier2: number;
  shif: number;
  housingLevy: number;
  personalRelief: number;
  affordableHousingRelief: number;
  totalAllowableDeductions: number;
  taxablePay: number;
  paye: number;
  payeBeforeRelief:number;
  totalDeductions: number;
  netPay: number;
}

const PERSONAL_RELIEF = 2400; // Fixed personal relief per month
const HOUSING_LEVY_RATE = 0.015; // 1.5% Housing Levy
const SHIF_RATE = 0.0275; // 2.75% SHIF rate
const NSSF_RATE = 0.06; // 6% NSSF
const NSSF_TIER1_LIMIT = 7000; // Tier 1 NSSF cap
const NSSF_TIER2_LIMIT = 36000; // Tier 2 upper limit
const AFFORDABLE_HOUSING_RELIEF_RATE = 0.15; // 15% of AHL contribution
const AFFORDABLE_HOUSING_RELIEF_CAP = 9000; // Monthly cap for Affordable Housing Relief
const PENSION_CONTRIBUTION_CAP = 20000; // Pension contribution cap


let payeBeforeRelief=0
const calculateNSSF = (grossPay: number) => {
  const tier1 = Math.min(NSSF_TIER1_LIMIT, grossPay) * NSSF_RATE;
  const tier2 = Math.max(0, Math.min(grossPay - NSSF_TIER1_LIMIT, NSSF_TIER2_LIMIT - NSSF_TIER1_LIMIT)) * NSSF_RATE;
  return { tier1, tier2, total: tier1 + tier2 };
};

const calculateSHIF = (grossPay: number) => Math.max(grossPay * SHIF_RATE, 300);

const calculateHousingLevy = (grossPay: number) => grossPay * HOUSING_LEVY_RATE;

const calculateAffordableHousingRelief = (housingLevy: number) =>
  Math.min(housingLevy * AFFORDABLE_HOUSING_RELIEF_RATE, AFFORDABLE_HOUSING_RELIEF_CAP);

const calculateTaxablePay = (
  grossPay: number,
  options: Options,
  totalAllowableDeductions: number
) => {
  let taxablePay = grossPay - totalAllowableDeductions;

  if (options.nonCashBenefits && options.nonCashBenefits > 3000) {
    taxablePay += options.nonCashBenefits;
  }

  if (options.otherAllowableDeductions) {
    taxablePay -= options.otherAllowableDeductions;
  }

  return taxablePay;
};

const calculatePAYE = (taxablePay: number, personalRelief: number, affordableHousingRelief: number) => {
  const brackets = [
    { limit: 24000, rate: 0.1 },
    { limit: 32333, rate: 0.25 },
    { limit: 500000, rate: 0.3 },
    { limit: 800000, rate: 0.325 },
    { limit: Infinity, rate: 0.35 },
  ];

  let tax = 0;
  let remainingIncome = taxablePay;

  for (let i = 0; i < brackets.length; i++) {
    const prevLimit = i > 0 ? brackets[i - 1].limit : 0;
    const taxableAmount = Math.min(remainingIncome, brackets[i].limit - prevLimit);
    if (taxableAmount > 0) {
      tax += taxableAmount * brackets[i].rate;
      remainingIncome -= taxableAmount;
    }
  }

  payeBeforeRelief=tax
  return Math.max(tax - personalRelief - affordableHousingRelief, 0);
};

export const calculateNetPay = (grossPay: number, options: Options): NetPayResult => {
  const { tier1: nssfTier1, tier2: nssfTier2, total: totalNSSF } = calculateNSSF(grossPay);
  const shif = calculateSHIF(grossPay);
  const housingLevy = calculateHousingLevy(grossPay);
  const affordableHousingRelief = calculateAffordableHousingRelief(housingLevy);

  let totalAllowableDeductions = totalNSSF;
  let pensionRelief = 0;

  if (options.pensionContribution) {
    pensionRelief = Math.min(options.pensionContribution, Math.min(PENSION_CONTRIBUTION_CAP, grossPay * 0.3));
    totalAllowableDeductions += pensionRelief;
  }

  const taxablePay = calculateTaxablePay(grossPay, options, totalAllowableDeductions);
  const paye = calculatePAYE(taxablePay, PERSONAL_RELIEF, affordableHousingRelief);

  const totalDeductions = totalAllowableDeductions + shif + housingLevy + paye;
  const netPay = grossPay - totalDeductions;

  return {
    nssfTier1,
    nssfTier2,
    shif,
    housingLevy,
    personalRelief: PERSONAL_RELIEF,
    affordableHousingRelief,
    totalAllowableDeductions,
    taxablePay,
    paye,
    totalDeductions,
    netPay,
    payeBeforeRelief
  };
};
