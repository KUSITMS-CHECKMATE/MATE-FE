import { BoardRow } from "@toss/tds-mobile";
import type { ReactNode } from "react";

interface GuideAccordionItemProps {
  title: string;
  children: ReactNode;
  isOpened: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function GuideAccordionItem({ title, children, isOpened, onOpen, onClose }: GuideAccordionItemProps) {
  return (
    <BoardRow title={title} icon={<BoardRow.ArrowIcon />} isOpened={isOpened} onOpen={onOpen} onClose={onClose}>
      {children}
    </BoardRow>
  );
}
