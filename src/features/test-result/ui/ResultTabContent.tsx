import { Button, ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { MultipleResultCard } from "./MultipleResultCard";
import { SubjectiveResultCard } from "./SubjectiveResultCard";
import { ScaleResultCard } from "./ScaleResultCard";
import { AbResultCard } from "./AbResultCard";
import { CardSortResultCard } from "./CardSortResultCard";
import { TreeResultCard } from "./TreeResultCard";
import { FiveSecResultCard } from "./FiveSecResultCard";
import type { QuestionResult } from "../model/types";

interface Props {
  results: QuestionResult[];
}

export function ResultTabContent({ results }: Props) {
  return (
    <div className="w-full flex flex-col bg-[#f2f4f6] pb-21.5">
      <div className="w-full  p-5 flex flex-col gap-4 items-center">
        {results.map((result, i) => {
          switch (result.type) {
            case "OBJECTIVE":
              return (
                <MultipleResultCard
                  key={i}
                  title={result.title}
                  imageUrl={result.imageUrl}
                  options={result.options}
                />
              );
            case "SUBJECTIVE":
              return <SubjectiveResultCard key={i} title={result.title} answers={result.answers} />;
            case "SCALE":
              return (
                <ScaleResultCard
                  key={i}
                  title={result.title}
                  average={result.average}
                  scores={result.scores}
                />
              );
            case "AB_TEST":
              return <AbResultCard key={i} title={result.title} options={result.options} />;
            case "CARD_SORTING":
              return (
                <CardSortResultCard key={i} title={result.title} categories={result.categories} />
              );
            case "TREE_TEST":
              return (
                <TreeResultCard
                  key={i}
                  title={result.title}
                  imageUrl={result.imageUrl}
                  paths={result.paths}
                />
              );
            case "FIVE_SECOND":
              return (
                <FiveSecResultCard
                  key={i}
                  title={result.title}
                  imageUrl={result.imageUrl}
                  answers={result.answers}
                />
              );
          }
        })}
      </div>

      <div className="w-full ">
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
          right={<Button size="small">통계 발급받기</Button>}
          verticalPadding="xlarge"
        />
      </div>
    </div>
  );
}
