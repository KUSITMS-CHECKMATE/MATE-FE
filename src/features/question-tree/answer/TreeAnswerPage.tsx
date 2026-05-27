import { useState } from "react";
import { ListRow } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { QuestionAnswerProps } from "@/features/test-participate/model/types";
import { QUESTION_TYPE_LABEL } from "@/features/test-participate/model/constants";
import { QuestionHeader } from "@/features/test-participate/ui/QuestionHeader";
import type { TreeNodeItem } from "../model/types";

export function TreeAnswerPage({ question, answer, onChange }: QuestionAnswerProps<"TREE_TEST">) {
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
      <QuestionHeader categoryLabel={QUESTION_TYPE_LABEL.TREE_TEST} title={title} description={description} />
<div>
        {nodes.map((node) => (
          <TreeNodeRow
            key={node.id}
            node={node}
            depth={0}
            expandedIds={expandedIds}
            selectedNodeId={selectedNodeId}
            onToggleExpand={toggleExpanded}
            onSelect={(nodeId) => onChange({ type: "TREE_TEST", selectedNodeId: nodeId })}
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
  onSelect: (nodeId: string | null) => void;
}

function TreeNodeRow({ node, depth, expandedIds, selectedNodeId, onToggleExpand, onSelect }: TreeNodeRowProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedNodeId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(node.id);
      return;
    }
    onSelect(isSelected ? null : node.id);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick(e as unknown as React.MouseEvent)}
        className="active:scale-[0.98] transition-transform cursor-pointer"
        style={{ paddingLeft: depth * 16 }}
      >
        <ListRow
          left={renderDepthIcon(depth, hasChildren, isExpanded)}
          contents={<ListRow.Texts type={textRowTypeFor(depth)} top={node.name} topProps={{ color: adaptive.grey800 }} />}
          right={!hasChildren ? <SelectIndicator selected={isSelected} /> : undefined}
          verticalPadding="large"
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

function renderDepthIcon(depth: number, hasChildren: boolean, isExpanded: boolean) {
  if (depth === 0) {
    return <ListRow.AssetIcon name="icon-folder" backgroundColor={adaptive.greyOpacity100} />;
  }
  if (!hasChildren) {
    return <ListRow.AssetIcon size="xsmall" shape="original" name="icon-arrow-solid-down-mono" color="transparent" />;
  }
  return <ListRow.AssetIcon size="xsmall" shape="original" name={isExpanded ? "icon-arrow-solid-down-mono" : "icon-arrow-solid-right-mono"} color={adaptive.grey300} />;
}

function SelectIndicator({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        selected ? "bg-blue-500 border-blue-500" : "border-gray-300"
      }`}
    >
      {selected && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function textRowTypeFor(depth: number): "1RowTypeA" | "1RowTypeB" | "1RowTypeC" {
  if (depth === 0) return "1RowTypeC";
  if (depth >= 3) return "1RowTypeA";
  return "1RowTypeB";
}
