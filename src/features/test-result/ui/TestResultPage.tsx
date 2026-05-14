import { useState } from "react";
import { Asset, Button, Tab, Text, Top } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Question {
  id: number;
  title: string;
  type: string;
}

const MOCK_QUESTIONS: Question[] = [
  { id: 1, title: "입력한 제목이 이렇게 떠요", type: "객관식" },
  { id: 2, title: "입력한 제목이 이렇게 떠요", type: "주관식" },
];

interface Props {
  testId: string;
}

export function TestResultPage({ testId }: Props) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <div>
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            질문별 결과 요약
          </Top.TitleParagraph>
        }
        subtitleTop={
          <Top.SubtitleBadges badges={[{ text: `진행중`, color: `green`, variant: `weak` }]} />
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>총 8개 질문 · 100명 참여</Top.SubtitleParagraph>
        }
      />
      <div className="w-full h-fit bg-white flex flex-col justify-start items-start px-5 pb-3">
        <Button size="large" display="block" disabled={true}>
          통계 다운받기
        </Button>
      </div>
      <Tab
        fluid={false}
        size="large"
        style={{ backgroundColor: adaptive.background }}
        onChange={(index) => setSelectedTabIndex(index)}
      >
        <Tab.Item key="0-질문" selected={selectedTabIndex === 0}>
          질문
        </Tab.Item>
        <Tab.Item key="1-결과" selected={selectedTabIndex === 1}>
          결과
        </Tab.Item>
      </Tab>
      {selectedTabIndex === 0 && (
        <div className="flex flex-col">
          {MOCK_QUESTIONS.map((question, index) => (
            <div
              key={question.id}
              className="w-full bg-white py-3 px-5 flex flex-row gap-1 items-center"
            >
              <div className="w-full flex flex-row gap-3 items-center">
                <Asset.Text
                  frameShape={Asset.frameShape.CircleMedium}
                  backgroundColor={adaptive.greyOpacity100}
                  style={{ color: `#4365cb`, fontSize: `13px`, fontWeight: `bold` }}
                  aria-label=""
                >
                  {String(index + 1).padStart(2, "0")}
                </Asset.Text>
                <div className="w-full flex flex-row gap-3 justify-between items-center">
                  <div className="w-full flex flex-col">
                    <Text
                      display="block"
                      color={adaptive.grey800}
                      typography="t5"
                      fontWeight="semibold"
                    >
                      {question.title}
                    </Text>
                    <Text
                      display="block"
                      color={adaptive.grey600}
                      typography="t6"
                      fontWeight="medium"
                    >
                      {question.type}
                    </Text>
                  </div>
                  <Asset.Icon
                    frameShape={Asset.frameShape.CleanW24}
                    backgroundColor="transparent"
                    name="icon-system-arrow-right-outlined"
                    aria-hidden={true}
                    ratio="1/1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
