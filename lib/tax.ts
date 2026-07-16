export const VAT_RATE = 0.16;

export function inclusiveVatBreakdown(grossAmount: number): {
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
} {
  const netAmount = grossAmount / (1 + VAT_RATE);

  return {
    netAmount,
    vatAmount: grossAmount - netAmount,
    grossAmount,
  };
}
