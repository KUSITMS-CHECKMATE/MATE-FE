interface Props {
  testId: string;
}

export function TestResultPage({ testId }: Props) {
  return <div>{testId}</div>;
}
