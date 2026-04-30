import { IconButton } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  onClick: () => void;
}

export function TestCreateButton({ onClick }: Props) {
  return (
    <div className="flex justify-end fixed right-4 bottom-24 w-full h-fit overflow-visible">
      <IconButton
        src="https://static.toss.im/icons/png/4x/icon-plus-thin-mono.png"
        iconSize={24}
        variant="fill"
        color={adaptive.background}
        bgColor="#4365CC"
        aria-label="테스트 등록"
        style={{ borderRadius: "9999px" }}
        onClick={onClick}
      />
    </div>
  );
}
