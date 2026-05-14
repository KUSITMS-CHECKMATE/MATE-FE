import { Button, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { MultipleResultCard, type MultipleResultOption } from "./MultipleResultCard";
import { SubjectiveResultCard } from "./SubjectiveResultCard";
import { ScaleResultCard, type ScoreBar } from "./ScaleResultCard";
import { AbResultCard, type AbOption } from "./AbResultCard";
import { CardSortResultCard, type CardSortCategory } from "./CardSortResultCard";
import { TreeResultCard, type TreeResultPath } from "./TreeResultCard";
import { FiveSecResultCard, type FiveSecAnswer } from "./FiveSecResultCard";

type QuestionResult =
  | { type: "multiple"; title: string; imageUrl?: string; options: MultipleResultOption[] }
  | { type: "subjective"; title: string; answers: string[] }
  | { type: "scale"; title: string; average: number; scores: ScoreBar[] }
  | { type: "ab"; title: string; options: AbOption[] }
  | { type: "cardSort"; title: string; categories: CardSortCategory[] }
  | { type: "tree"; title: string; imageUrl?: string; paths: TreeResultPath[] }
  | { type: "fiveSec"; title: string; imageUrl?: string; answers: FiveSecAnswer[] };

const MOCK_RESULTS: QuestionResult[] = [
  {
    type: "multiple",
    title: "전반적인 사용 경험에 만족하시나요?",
    options: [
      { label: "프로필", count: 32, percentage: 58, isHighlight: true },
      { label: "설정", count: 15, percentage: 27, isHighlight: false },
      { label: "홈", count: 8, percentage: 15, isHighlight: false },
    ],
  },
  {
    type: "subjective",
    title: "전반적인 사용 경험에 만족하시나요?",
    answers: Array(15).fill("만족해요"),
  },
  {
    type: "scale",
    title: "전반적인 사용 경험에 만족하시나요?",
    average: 3.5,
    scores: [
      { label: "1점", height: 20, isHighlight: false },
      { label: "2점", height: 45, isHighlight: false },
      { label: "3점", height: 115, isHighlight: true },
      { label: "4점", height: 35, isHighlight: false },
      { label: "5점", height: 15, isHighlight: false },
    ],
  },
  {
    type: "ab",
    title: "전반적인 사용 경험에 만족하시나요?",
    options: [
      { label: "A안 (27.2%)", height: 45, isHighlight: false },
      { label: "B안 (62.8%)", height: 115, isHighlight: true },
    ],
  },
  {
    type: "cardSort",
    title: "전반적인 사용 경험에 만족하시나요?",
    categories: [
      {
        name: "상의",
        items: [
          { rank: "icon-step-1-mono", label: "티셔츠", count: 32, percentage: 58, isHighlight: true },
          { rank: "icon-step-2-mono", label: "반팔티", count: 15, percentage: 27, isHighlight: false },
          { rank: "icon-step-3-mono", label: "크롭티", count: 8, percentage: 15, isHighlight: false },
        ],
      },
      {
        name: "하의",
        items: [
          { rank: "icon-step-1-mono", label: "청바지", count: 32, percentage: 58, isHighlight: true },
          { rank: "icon-step-2-mono", label: "반바지", count: 15, percentage: 27, isHighlight: false },
        ],
      },
      {
        name: "신발",
        items: [
          { rank: "icon-step-1-mono", label: "운동화", count: 32, percentage: 58, isHighlight: true },
          { rank: "icon-step-2-mono", label: "슬리퍼", count: 15, percentage: 27, isHighlight: false },
        ],
      },
    ],
  },
  {
    type: "tree",
    title: "내 프로필을 수정하려면 어디로 가야 할까요?",
    paths: [
      { label: "프로필", count: 32, percentage: 58, isHighlight: true },
      { label: "설정", count: 15, percentage: 27, isHighlight: false },
      { label: "홈", count: 8, percentage: 15, isHighlight: false },
    ],
  },
  {
    type: "fiveSec",
    title: "5초동안 보고 기억에 남는것은?",
    imageUrl: undefined,
    answers: [
      { label: "프로필", count: 32, percentage: 58, isHighlight: true },
      { label: "설정", count: 15, percentage: 27, isHighlight: false },
      { label: "홈", count: 8, percentage: 15, isHighlight: false },
    ],
  },
];

export function ResultTabContent() {
  return (
    <div className="w-full bg-[#f2f4f6] p-5 flex flex-col gap-4 items-center">
      {MOCK_RESULTS.map((result, i) => {
        switch (result.type) {
          case "multiple":
            return <MultipleResultCard key={i} title={result.title} imageUrl={result.imageUrl} options={result.options} />;
          case "subjective":
            return <SubjectiveResultCard key={i} title={result.title} answers={result.answers} />;
          case "scale":
            return <ScaleResultCard key={i} title={result.title} average={result.average} scores={result.scores} />;
          case "ab":
            return <AbResultCard key={i} title={result.title} options={result.options} />;
          case "cardSort":
            return <CardSortResultCard key={i} title={result.title} categories={result.categories} />;
          case "tree":
            return <TreeResultCard key={i} title={result.title} imageUrl={result.imageUrl} paths={result.paths} />;
          case "fiveSec":
            return <FiveSecResultCard key={i} title={result.title} imageUrl={result.imageUrl} answers={result.answers} />;
        }
      })}

      <ListRow
        left={<ListRow.AssetIcon size="xsmall" shape="original" name="icon-graph-circle" />}
        contents={
          <ListRow.Texts
            type="2RowTypeF"
            top="모든 결과를 보고 싶다면"
            topProps={{ color: adaptive.grey500 }}
            bottom="파일로 발급 받아봐요"
            bottomProps={{ color: adaptive.grey800, fontWeight: "bold" }}
          />
        }
        right={<Button>통계 발급받기</Button>}
        verticalPadding="xlarge"
      />
    </div>
  );
}
