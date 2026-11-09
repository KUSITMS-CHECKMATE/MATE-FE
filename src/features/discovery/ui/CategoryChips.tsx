import { Text } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import { CATEGORY_LABEL } from "@/shared/constants/categories";

interface Props {
  categories: string[];
}

export function CategoryChips({ categories }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap gap-x-1.5 gap-y-1">
      {categories.map((category) => (
        // flex로 감싸야 Text(inline-block)가 기준선에 얹히며 위쪽에만 생기는 여백이 없어진다
        <span
          key={category}
          className="flex w-fit h-fit rounded px-1 py-px"
          style={{ backgroundColor: "#4E596828" }}
        >
          <Text color={adaptive.grey700} typography="st13" fontWeight="semibold">
            {CATEGORY_LABEL[category] ?? category}
          </Text>
        </span>
      ))}
    </div>
  );
}
