import { ListFooter } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";

interface Props {
  onClick: () => void;
}

export function MoreFooter({ onClick }: Props) {
  return (
    <ul>
      <ListFooter
        border="full"
        textColor={adaptive.grey600}
        iconColor={adaptive.grey600}
        icon="icon-arrow-down-mono"
        onClick={onClick}
      >
        <ListFooter.Text>더 보기</ListFooter.Text>
      </ListFooter>
    </ul>
  );
}
