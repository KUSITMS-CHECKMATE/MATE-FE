import { BoardRow } from "@toss/tds-mobile";
import type { ReactNode } from "react";

interface GuideAccordionItemProps {
  title: string;
  children: ReactNode;
}

export function GuideAccordionItem({ title, children }: GuideAccordionItemProps) {
  return (
    <BoardRow title={title} icon={<BoardRow.ArrowIcon />}>
      {children}
    </BoardRow>
  );
}
