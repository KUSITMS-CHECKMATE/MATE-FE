import { useState } from 'react';
import { Asset, Text, Top, List, ListRow, Spacing, ListHeader, BottomCTA } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';
import type { TestDetail } from '../model';

interface Props {
  test: TestDetail;
}

export function MyTestDetail({ test }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="flex flex-col pb-24">
      <Spacing size={16} />
      <Top
        title={
          <Top.TitleParagraph size={22} color={adaptive.grey900}>
            {test.name}
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleBadges
            badges={test.categories.map((label) => ({
              text: label,
              color: 'elephant',
              variant: 'weak',
            }))}
          />
        }
      />
      <div
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ gap: '12px', margin: '0 20px' }}
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          const index = Math.round(target.scrollLeft / target.clientWidth);
          setActiveImageIndex(index);
        }}
      >
        {test.images.map((src, i) => (
          <div key={i} className="snap-start shrink-0 w-full" style={{ aspectRatio: '16/9' }}>
            <img
              src={src}
              aria-hidden={true}
              style={{ width: '100%', height: '100%', borderRadius: 16, objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
      <Spacing size={16} />
      <div className="flex justify-center gap-1.5">
        {test.images.map((_, i) => (
          <Asset.Icon
            key={i}
            frameShape={{ width: 12, height: 12 }}
            backgroundColor="transparent"
            name="icon-circle-16-mono"
            color={i === activeImageIndex ? adaptive.greyOpacity500 : adaptive.greyOpacity300}
            aria-hidden={true}
            ratio="1/1"
          />
        ))}
      </div>
      <Spacing size={20} />
      <List>
        <ListRow
          left={<ListRow.AssetIcon size="medium" name="icon-coin-yellow" backgroundColor={adaptive.yellow100} />}
          contents={
            <ListRow.Texts
              type="2RowTypeF"
              top="보상 머니"
              topProps={{ color: adaptive.grey500 }}
              bottom={test.reward}
              bottomProps={{ color: adaptive.grey800, fontWeight: 'bold' }}
            />
          }
          verticalPadding="small"
          horizontalPadding="small"
        />
        <ListRow
          left={<ListRow.AssetIcon size="medium" name="icon-document-teal" backgroundColor={adaptive.green100} />}
          contents={
            <ListRow.Texts
              type="2RowTypeF"
              top="테스트 한줄 소개"
              topProps={{ color: adaptive.grey500 }}
              bottom={test.summary}
              bottomProps={{ color: adaptive.grey700, fontWeight: 'medium' }}
            />
          }
          verticalPadding="small"
          horizontalPadding="small"
        />
        <ListRow
          left={
            <ListRow.AssetIcon
              size="medium"
              name="icon-loudspeaker"
              backgroundColor={adaptive.red50}
            />
          }
          contents={
            <ListRow.Texts
              type="2RowTypeC"
              top="서비스 소개"
              topProps={{ color: adaptive.grey800, fontWeight: `bold` }}
              bottom="진행될 테스트의 서비스를 소개할게요"
              bottomProps={{ color: adaptive.grey500 }}
            />
          }
          horizontalPadding="small"
        />
      </List>
        <ListHeader
        title={
          <ListHeader.TitleParagraph
            color={adaptive.grey800}
            fontWeight="bold"
            typography="t5"
          >
            메이트
          </ListHeader.TitleParagraph>
        }
        descriptionPosition="bottom"
      />
      <div className="px-6 pb-5">
        <Text
          display="block"
          color={adaptive.grey700}
          typography="t5"
          fontWeight="regular"
        >
          {test.serviceDescription}
        </Text>
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <BottomCTA.Single disabled={true}>
          {test.isEnded ? '종료된 설문이에요' : '테스트 참여하기'}
        </BottomCTA.Single>
      </div>
    </div>
  );
}
