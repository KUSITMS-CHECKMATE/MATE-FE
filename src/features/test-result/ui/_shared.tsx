import { Asset, Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

export function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-white rounded-2xl p-4 flex flex-col items-start">{children}</div>
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
