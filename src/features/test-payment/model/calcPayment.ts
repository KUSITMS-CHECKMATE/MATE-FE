export function calcPayment(testerCount: number, rewardAmount: number) {
  const testerReward = testerCount * rewardAmount;
  const supply = Math.round(testerReward / 0.6);
  const fee = supply - testerReward;
  const vat = Math.round(supply * 0.1);
  const total = supply + vat;
  return { testerReward, fee, vat, total };
}

export function toKRW(amount: number) {
  return `${amount.toLocaleString()}원`;
}
