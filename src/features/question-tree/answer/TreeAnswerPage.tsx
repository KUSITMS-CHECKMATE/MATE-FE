import { useState } from "react";
import { ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";
import { QUESTION_TYPE_LABEL } from "@/features/test-participate/model/constants";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";
import type { TreeNodeItem } from "../model/types";

export function TreeAnswerPage({ question, answer, onChange }: QuestionAnswerProps<"tree">) {
  const { title, description, nodes } = question.data;
  const selectedNodeId = answer?.selectedNodeId ?? null;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (nodeId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  return (
    <>
      <QuestionHeader categoryLabel={QUESTION_TYPE_LABEL.tree} title={title} description={description} />
      <div className="mx-4">
        {nodes.map((node) => (
          <TreeNodeRow
            key={node.id}
            node={node}
            depth={0}
            expandedIds={expandedIds}
            selectedNodeId={selectedNodeId}
            onToggleExpand={toggleExpanded}
            onSelect={(nodeId) => onChange({ type: "tree", selectedNodeId: nodeId })}
          />
        ))}
      </div>
    </>
  );
}

interface TreeNodeRowProps {
  node: TreeNodeItem;
  depth: number;
  expandedIds: Set<string>;
  selectedNodeId: string | null;
  onToggleExpand: (nodeId: string) => void;
  onSelect: (nodeId: string) => void;
}

function TreeNodeRow({ node, depth, expandedIds, selectedNodeId, onToggleExpand, onSelect }: TreeNodeRowProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedNodeId === node.id;

  const handleClick = () => {
    if (hasChildren) {
      onToggleExpand(node.id);
      return;
    }
    onSelect(node.id);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        className={`active:scale-[0.98] transition-transform cursor-pointer${depth >= 3 ? " mx-4" : ""}`}
        style={{
          backgroundColor: isSelected ? adaptive.blue50 : undefined,
          borderRadius: 12,
        }}
      >
        <ListRow
          left={renderDepthIcon(depth)}
          contents={<ListRow.Texts type={textRowTypeFor(depth)} top={node.name} topProps={{ color: textColorFor(depth) }} />}
          verticalPadding="large"
          arrowType={hasChildren ? (isExpanded ? "up" : "down") : undefined}
        />
      </div>
      {hasChildren && isExpanded
        ? node.children.map((child) => (
          <TreeNodeRow key={child.id} node={child} depth={depth + 1} expandedIds={expandedIds} selectedNodeId={selectedNodeId} onToggleExpand={onToggleExpand} onSelect={onSelect} />
        ))
        : null}
    </>
  );
}

function renderDepthIcon(depth: number) {
  switch (depth) {
    case 0:
      return <ListRow.AssetImage src="https://static.toss.im/2d-emojis/png/4x/u1F4C1.png" shape="squircle" scale={0.66} backgroundColor={adaptive.greyOpacity100} size="xsmall" />;
    case 1:
      return <ListRow.AssetIcon name="icon-document-lines-blue" backgroundColor={adaptive.greyOpacity100} />;
    case 2:
      return <ListRow.AssetIcon size="xsmall" shape="original" name="icon-system-arrow-right-outlined" />;
    default:
      return <ListRow.AssetIcon size="xsmall" shape="original" name="icon-arrow-down-mono" color={adaptive.grey700} />;
  }
}

function textRowTypeFor(depth: number): "1RowTypeA" | "1RowTypeB" | "1RowTypeC" {
  if (depth === 0) return "1RowTypeC";
  if (depth >= 3) return "1RowTypeA";
  return "1RowTypeB";
}

function textColorFor(depth: number) {
  if (depth >= 3) return adaptive.grey700;
  return adaptive.grey800;
}
