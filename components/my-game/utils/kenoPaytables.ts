// Placeholder Keno paytables (by spots picked) for UX iteration.
// Replace with audited Vegas tables later.

// Convention: table[spotsPicked][matches] = multiplier per 1 credit
export const PAYTABLE: Record<number, Record<number, number>> = {
  1: { 1: 3 },
  2: { 2: 12, 1: 1 },
  3: { 3: 44, 2: 2, 1: 0 },
  4: { 4: 120, 3: 10, 2: 1 },
  5: { 5: 640, 4: 40, 3: 5, 2: 1 },
  6: { 6: 1800, 5: 120, 4: 25, 3: 3 },
  7: { 7: 5000, 6: 400, 5: 80, 4: 10, 3: 2 },
  8: { 8: 10000, 7: 1200, 6: 200, 5: 50, 4: 5 },
  9: { 9: 25000, 8: 4000, 7: 800, 6: 100, 5: 20 },
  10: { 10: 100000, 9: 10000, 8: 1000, 7: 200, 6: 50, 5: 10, 4: 2, 3: 1 },
};

export function payoutMultiplier(spotsPicked: number, matches: number): number {
  return PAYTABLE[spotsPicked]?.[matches] ?? 0;
}
