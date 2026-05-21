import { Asset, Badge, Spacing, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { DoughnutAnswerItem } from "../model/types";
import { ResultDoughnutChart } from "./ResultDoughnutChart";

export type { DoughnutAnswerItem };

export function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-white rounded-2xl p-4 flex flex-col items-start">{children}</div>
  );
}

export function ResultCardBase({
  badgeLabel,
  title,
  subtitle,
  imageUrl,
  children,
}: {
  badgeLabel: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  children: React.ReactNode;
}) {
  return (
    <CardWrapper>
      <div className="w-full flex flex-col gap-1 justify-start items-start">
        <Badge size="small" variant="weak" color="elephant">{badgeLabel}</Badge>
        <Text color={adaptive.grey800} typography="t5" fontWeight="bold">{title}</Text>
        {subtitle && (
          <Text color={adaptive.grey500} typography="t7" fontWeight="semibold">{subtitle}</Text>
        )}
      </div>
      <Spacing size={16} />
      {imageUrl && (
        <>
          <div className="w-full h-43.75">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <Spacing size={16} />
        </>
      )}
      {children}
    </CardWrapper>
  );
}

export function BarColumn({
  height,
  label,
  isHighlight = false,
}: {
  height: number;
  label: string;
  isHighlight?: boolean;
}) {
  return (
    <div className="w-full flex flex-col gap-1 justify-start items-center">
      <div className="w-full flex flex-row justify-start items-center">
        <div
          className="w-full rounded-lg"
          style={{
            height,
            backgroundColor: isHighlight ? "#4365cc" : "rgba(0,27,55,0.1)",
          }}
        />
      </div>
      <Text color={isHighlight ? "#4365cc" : adaptive.grey700} typography="t7" fontWeight="semibold">
        {label}
      </Text>
    </div>
  );
}

export function AnswerRow({
  iconColor,
  label,
  count,
  labelColor,
}: {
  iconColor: string;
  label: string;
  count: string;
  labelColor: string;
}) {
  return (
    <div className="w-full flex flex-row justify-between items-center">
      <div className="flex-1 flex flex-row justify-start items-center">
        <Asset.Icon
          frameShape={Asset.frameShape.CleanW24}
          backgroundColor="transparent"
          name="icon-circle-12-mono"
          color={iconColor}
          aria-hidden={true}
          ratio="1/1"
        />
        <Text display="block" color={labelColor} typography="t7" fontWeight="semibold">
          {label}
        </Text>
      </div>
      <Text color={labelColor} typography="t7" fontWeight="semibold" display="block">
        {count}
      </Text>
    </div>
  );
}

export function TextAnswerItem({ text }: { text: string }) {
  return (
    <div className="w-full bg-[#00173305] rounded-2xl p-3 flex flex-row justify-between items-center">
      <Text color={adaptive.grey700} typography="t7" fontWeight="semibold">
        {text}
      </Text>
    </div>
  );
}

export function TextAnswerScrollList({ texts }: { texts: string[] }) {
  return (
    <div className="w-full h-38.75 overflow-visible flex flex-col gap-3 justify-start items-center">
      <div
        className="w-full overflow-y-scroll flex flex-col gap-2 justify-start items-center"
        style={{ scrollbarWidth: "none" }}
      >
        {texts.map((text, i) => (
          <TextAnswerItem key={i} text={text} />
        ))}
      </div>
    </div>
  );
}

export function DoughnutAnswerSection({ items }: { items: DoughnutAnswerItem[] }) {
  return (
    <>
      <ResultDoughnutChart items={items} />
      <Spacing size={16} />
      <div className="w-full flex flex-col gap-1 items-center">
        {items.map((item, i) => (
          <AnswerRow
            key={i}
            iconColor={item.isHighlight ? "#5571cf" : i === 1 ? adaptive.greyOpacity400 : adaptive.greyOpacity200}
            labelColor={item.isHighlight ? "#4365cc" : adaptive.grey700}
            label={item.label}
            count={`${item.count}개 (${item.percentage}%)`}
          />
        ))}
      </div>
    </>
  );
}
