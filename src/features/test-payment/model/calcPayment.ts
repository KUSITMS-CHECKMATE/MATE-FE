// actualTotal이 있으면(= 스토어에 등록된 실제 IAP 상품 가격) 그 값을 기준으로 공급가/수수료/부가세를 역산한다.
// 로컬 공식(0.6 역산)으로 구한 값은 스토어 등록가와 반올림 방식이 달라 몇십 원 단위로 어긋날 수 있는데,
// 그러면 "결제 합계"가 실제 청구액과 안 맞아 보이므로 항상 실제 청구액에 맞춰 항목을 재계산한다.
export function calcPayment(testerCount: number, rewardAmount: number, actualTotal?: number) {
  const testerReward = testerCount * rewardAmount;

  if (actualTotal != null) {
    const supply = Math.round(actualTotal / 1.1);
    const vat = actualTotal - supply;
    const fee = supply - testerReward;
    return { testerReward, fee, vat, total: actualTotal };
  }

  const supply = Math.round(testerReward / 0.6);
  const fee = supply - testerReward;
  const vat = Math.round(supply * 0.1);
  const total = supply + vat;
  return { testerReward, fee, vat, total };
}

export function toKRW(amount: number) {
  return `${amount.toLocaleString()}원`;
}

// IAP 상품 목록 API는 숫자 가격 필드 없이 "73,370원" 형태의 displayAmount 문자열만 준다.
export function parseWonAmount(displayAmount: string): number | undefined {
  const parsed = Number(displayAmount.replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}
