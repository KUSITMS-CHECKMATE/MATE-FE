import { Asset, IconButton, ListHeader, ListRow, Text, TextButton } from "@toss/tds-mobile";
import { adaptive } from "@toss/tds-colors";
import type { TreeNodeItem } from "../../model/types";

const ListHeaderTitleParagraph = ListHeader.TitleParagraph;

const MAX_TREE_DEPTH = 4;

interface TreeCreateOptionSectionProps {
  nodes: TreeNodeItem[];
  selectedNodeId: string | null;
  isManageMode: boolean;
  onOpenNodeEditor: () => void;
  onSelectNode: (nodeId: string) => void;
  onEditNode: (nodeId: string) => void;
  onAddChildNode: (nodeId: string) => void;
  onToggleManageMode: () => void;
  onDeleteNode: (nodeId: string) => void;
}

interface TreeNodeRowProps {
  node: TreeNodeItem;
  depth: number;
  isManageMode?: boolean;
  onEditNode: (nodeId: string) => void;
  onAddChildNode: (nodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
}

function TreeNodeRow({ node, depth, isManageMode, onEditNode, onAddChildNode, onDeleteNode }: TreeNodeRowProps) {
  const hasChildren = node.children.length > 0;
  const isAddDisabled = depth >= MAX_TREE_DEPTH - 1;
  return (
    <>
      <div
        className="flex items-center justify-between py-2 pr-5"
        style={{ paddingLeft: `${20 + depth * 16}px` }}
      >
        <div className="flex items-center gap-1.5">
          {hasChildren ? (
            <Asset.Icon
              frameShape={Asset.frameShape.CleanW16}
              backgroundColor="transparent"
              name="icon-arrow-solid-down-mono"
              color={adaptive.grey500}
              aria-hidden
            />
          ) : (
            <div style={{ width: 16 }} />
          )}
          <Text display="block" color={adaptive.grey700} typography="t5" fontWeight="regular">
            {node.name}
          </Text>
        </div>
        <div className="flex items-center gap-1">
          {isManageMode ? (
            <IconButton
              src="https://static.toss.im/icons/png/4x/icon-simplebin-line-mono.png"
              variant="clear"
              iconSize={16}
              color={adaptive.grey600}
              aria-label={`${node.name} 삭제`}
              onClick={() => onDeleteNode?.(node.id)}
            />
          ) : (
            <>
              <IconButton
                src="https://static.toss.im/icons/png/4x/icon-pencil-18px-mono.png"
                variant="clear"
                iconSize={16}
                color={adaptive.grey600}
                aria-label={`${node.name} 이름 수정`}
                onClick={() => onEditNode(node.id)}
              />
              <IconButton
                src="https://static.toss.im/icons/png/4x/icon-plus-thin-mono.png"
                variant="clear"
                iconSize={16}
                color={isAddDisabled ? adaptive.grey300 : adaptive.grey600}
                disabled={isAddDisabled}
                aria-label={`${node.name} 하위 항목 추가`}
                onClick={() => onAddChildNode(node.id)}
              />
            </>
          )}
        </div>
      </div>
      {node.children.map((child) => (
        <TreeNodeRow
          key={child.id}
          node={child}
          depth={depth + 1}
          isManageMode={isManageMode}
          onEditNode={onEditNode}
          onAddChildNode={onAddChildNode}
          onDeleteNode={onDeleteNode}
        />
      ))}
    </>
  );
}

export function TreeCreateOptionSection({
  nodes,
  selectedNodeId,
  isManageMode,
  onOpenNodeEditor,
  onSelectNode,
  onEditNode,
  onAddChildNode,
  onToggleManageMode,
  onDeleteNode,
}: TreeCreateOptionSectionProps) {
  const hasNodes = nodes.length > 0;
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? nodes[0] ?? null;

  return (
    <>
      <div className="pr-5">
        <ListHeader
          descriptionPosition="bottom"
          rightAlignment="center"
          titleWidthRatio={0.6}
          title={
            <ListHeaderTitleParagraph typography="t5" fontWeight="medium" color={adaptive.grey600}>
              트리 목록
            </ListHeaderTitleParagraph>
          }
          right={
            <div className="pr-1">
              <TextButton
                color={adaptive.blue500}
                typography="t5"
                fontWeight="medium"
                size="small"
                disabled={!isManageMode && !hasNodes}
                onClick={isManageMode || hasNodes ? onToggleManageMode : undefined}
              >
                {isManageMode ? "저장하기" : "수정하기"}
              </TextButton>
            </div>
          }
          className="w-full"
        />
      </div>

      {!isManageMode ? (
        <ListRow
          left={<ListRow.AssetIcon shape="original" name="icon-plus-grey-fill" color={adaptive.grey400} variant="fill" />}
          contents={<ListRow.Texts type="1RowTypeA" top="추가하기" topProps={{ color: adaptive.grey700 }} />}
          verticalPadding="large"
          onClick={onOpenNodeEditor}
        />
      ) : null}

      {hasNodes ? (
        <div role="tablist" className="flex flex-wrap gap-2 px-5 pt-2">
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={node.name}
                onClick={() => onSelectNode(node.id)}
                className="px-3.5 py-1.5 text-[14px] font-semibold transition-colors"
                style={{
                  backgroundColor: isSelected ? adaptive.grey900 : adaptive.greyOpacity100,
                  color: isSelected ? adaptive.grey50 : adaptive.grey700,
                  borderRadius: "9999px",
                }}
              >
                {node.name}
              </button>
            );
          })}
        </div>
      ) : null}

      {selectedNode ? (
        <div className="pt-3">
          <TreeNodeRow
            node={selectedNode}
            depth={0}
            isManageMode={isManageMode}
            onEditNode={onEditNode}
            onAddChildNode={onAddChildNode}
            onDeleteNode={onDeleteNode}
          />
        </div>
      ) : null}
    </>
  );
}
