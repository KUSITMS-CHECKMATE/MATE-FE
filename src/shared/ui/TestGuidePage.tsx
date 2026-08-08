import React, { useState } from "react";
import { motion } from "framer-motion";
import { Top, Post } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { GuideAccordionItem } from "./GuideAccordionItem";

export function TestGuidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const accordionProps = (index: number) => ({
    isOpened: openIndex === index,
    onOpen: () => setOpenIndex(index),
    onClose: () => setOpenIndex(null),
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-white pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={
        {
          "--adaptiveHairlineBorder": "transparent",
          "--tHairlineBackground": "transparent",
        } as React.CSSProperties
      }
    >
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            테스트는{"\n"}이렇게 진행돼요
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph size={15}>총 8가지의 테스트 방식이 있어요</Top.SubtitleParagraph>
        }
        right={
          <Top.RightAssetContent
            content={
              <img
                src="https://static.toss.im/ml-product/tosst-inapp_huc9tza798q5gg3g1ln3snfr.png"
                aria-hidden={true}
                style={{ width: 60, height: 60, objectFit: "contain" }}
              />
            }
          />
        }
      />
      <GuideAccordionItem title="1. 객관식" {...accordionProps(0)}>
        <Post.H4 paddingBottom={16}>객관식 테스트 방식</Post.H4>
        <Post.Paragraph paddingBottom={8} typography="t6">
          보기 중 하나를 고르는 질문이에요.
        </Post.Paragraph>
      </GuideAccordionItem>

      <GuideAccordionItem title="2. 주관식" {...accordionProps(1)}>
        <Post.H4 paddingBottom={16}>주관식 테스트 방식</Post.H4>
        <Post.Paragraph paddingBottom={8} typography="t6">
          자유 텍스트 입력 생각을 글로 적어 답하는 질문이에요.
        </Post.Paragraph>
      </GuideAccordionItem>

      <GuideAccordionItem title="3. 척도 질문" {...accordionProps(2)}>
        <Post.Paragraph paddingBottom={8} typography="t6">
          사용자의 의견이나 만족도, 사용 편의성 등을 일정한 척도로 평가받는 질문이에요.
        </Post.Paragraph>
        <Post.Paragraph paddingBottom={8} typography="t6">
          5점 척도, 7점 척도 중 원하는 척도를 설정할 수 있고, 각 점수에 원하는 라벨을 설정해
          응답자가 기준을 명확하게 이해할 수 있어요.
        </Post.Paragraph>
        <Post.Paragraph paddingBottom={8} typography="t6">
          디자인이나 서비스에 대한 사용자의 인식과 만족도를 수치로 확인하고 싶을 때 쓸 수 있어요.
        </Post.Paragraph>
      </GuideAccordionItem>

      <GuideAccordionItem title="4. A/B 테스트" {...accordionProps(3)}>
        <Post.H4 paddingBottom={16}>A/B 테스트 방식</Post.H4>
        <Post.Paragraph paddingBottom={8} typography="t6">
          두 가지 시안을 보여주고, 사용자에게 더 선호하는 하나를 선택하도록 하는 테스트예요.
        </Post.Paragraph>
        <Post.Paragraph paddingBottom={8} typography="t6">
          버튼 위치, 문구, 화면 구성처럼 서로 다른 두 가지 안 중 어떤 안이 더 효과적인지 비교하고
          싶을 때 활용할 수 있어요.
        </Post.Paragraph>
      </GuideAccordionItem>

      <GuideAccordionItem title="5. 카드 소팅" {...accordionProps(4)}>
        <Post.H4 paddingBottom={16}>카드 소팅이란?</Post.H4>
        <Post.Paragraph paddingBottom={16} typography="t6">
          사용자가 정보를 어떻게 분류하고 그룹화하는지 파악하는 테스트예요. 카드에 적힌 항목들을
          직접 묶어보게 하면서, 사용자의 멘탈 모델을 기반으로 정보 구조(IA)를 설계할 수 있어요.
        </Post.Paragraph>
        <Post.H4 paddingBottom={16}>어떻게 진행되나요?</Post.H4>
        <Post.Ol paddingBottom={16} typography="t6">
          <Post.Li>테스터에게 기능/콘텐츠 이름이 적힌 카드를 보여줘요.</Post.Li>
          <Post.Li>카드를 선택한 뒤, 해당 카드가 속한다고 생각하는 카테고리를 골라요.</Post.Li>
          <Post.Li>모든 카드에 대해 반복해요.</Post.Li>
          <Post.Li>여러 테스터의 결과를 모아 공통된 분류 패턴을 분석해요.</Post.Li>
        </Post.Ol>
        <Post.H4 paddingBottom={16}>무엇을 알 수 있나요?</Post.H4>
        <Post.Ul paddingBottom={8} typography="t6">
          <Post.Li>사용자가 기능/콘텐츠를 어떤 기준으로 묶는지</Post.Li>
          <Post.Li>어떤 항목들이 자연스럽게 같은 카테고리로 인식되는지</Post.Li>
          <Post.Li>메뉴 이름이나 카테고리 라벨을 어떻게 붙여야 할지</Post.Li>
        </Post.Ul>
      </GuideAccordionItem>

      <GuideAccordionItem title="6. 트리 테스트" {...accordionProps(5)}>
        <Post.H4 paddingBottom={16}>트리 테스트란?</Post.H4>
        <Post.Paragraph paddingBottom={16} typography="t6">
          웹사이트나 앱의 정보 구조(IA)가 사용자에게 직관적인지 검증하는 테스트예요. 실제 디자인
          없이 메뉴 계층 구조만 텍스트로 보여주고, 사용자가 특정 항목을 찾아가는 과정을 관찰해요.
        </Post.Paragraph>
        <Post.H4 paddingBottom={16}>어떻게 진행되나요?</Post.H4>
        <Post.Ol paddingBottom={16} typography="t6">
          <Post.Li>테스터에게 앱/사이트의 메뉴 구조를 텍스트 트리 형태로 보여줘요.</Post.Li>
          <Post.Li>"OO 기능을 찾아보세요" 같은 과제를 제시해요.</Post.Li>
          <Post.Li>테스터가 메뉴를 탐색하며 정답을 선택해요.</Post.Li>
          <Post.Li>어디서 헤매는지, 어디서 잘못 들어가는지를 분석해요.</Post.Li>
        </Post.Ol>
        <Post.H4 paddingBottom={16}>무엇을 알 수 있나요?</Post.H4>
        <Post.Ul paddingBottom={8} typography="t6">
          <Post.Li>메뉴 이름이 직관적인지</Post.Li>
          <Post.Li>카테고리 분류가 사용자 멘탈 모델과 맞는지</Post.Li>
          <Post.Li>특정 항목이 어디 있어야 할지 예측 가능한지</Post.Li>
        </Post.Ul>
      </GuideAccordionItem>

      <GuideAccordionItem title="7. 5초 테스트" {...accordionProps(6)}>
        <Post.H4 paddingBottom={16}>5초 테스트 방식</Post.H4>
        <Post.Paragraph paddingBottom={8} typography="t6">
          화면이나 디자인을 5초 동안 보여준 뒤, 사용자가 무엇을 기억하고 인식했는지 확인하는
          테스트예요.
        </Post.Paragraph>
        <Post.Paragraph paddingBottom={8} typography="t6">
          첫인상에서 어떤 정보가 가장 눈에 띄었는지, 핵심 메시지가 제대로 전달되었는지 등 사용자가
          짧은 시간 안에 무엇을 인지하는지 확인할 때 활용할 수 있어요.
        </Post.Paragraph>
      </GuideAccordionItem>

      <GuideAccordionItem title="8. 히트맵/도트맵" {...accordionProps(7)}>
        <Post.H4 paddingBottom={16}>곧 업데이트 될 테스트 유형이에요</Post.H4>
        <Post.H4 paddingBottom={8}>히트맵</Post.H4>
        <Post.Paragraph paddingBottom={16} typography="t6">
          사용자가 화면에서 어디에 많이 주목하거나 클릭하는지 색상으로 확인하는 테스트예요. 특정
          영역에 관심이 집중되는지, 중요한 정보가 잘 눈에 띄는지 확인하고 싶을 때 활용할 수
          있어요.
        </Post.Paragraph>
        <Post.H4 paddingBottom={8}>도트맵</Post.H4>
        <Post.Paragraph paddingBottom={8} typography="t6">
          사용자가 화면에서 가장 먼저 주목하거나 클릭한 위치를 점으로 표시해 확인하는 테스트예요.
          사용자의 시선이나 관심이 어느 위치에 향하는지 파악하고, 화면의 정보 배치가 적절한지
          확인할 때 활용할 수 있어요.
        </Post.Paragraph>
      </GuideAccordionItem>
    </motion.div>
  );
}
