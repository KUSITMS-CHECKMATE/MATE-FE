import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TreeNodeItem } from "../../model/types";
import { TreeCreateBottomCTA } from "./TreeCreateBottomCTA";
import { TreeCreateOptionSection } from "./TreeCreateOptionSection";
import { TreeCreateTopSection } from "./TreeCreateTopSection";
import { TreeNodeAddSheet } from "./TreeNodeAddSheet";
import { TreeQuestionEditorOverlay } from "./TreeQuestionEditorOverlay";
import { useTestCreateForm } from "@/features/test-create/model/useTestCreateForm";


interface TreeCreatePageProps {
  questionId: string;
  onClose: () => void;
}

type NodeSheetMode =
  | { kind: "create-root" }
  | { kind: "rename"; nodeId: string; initialName: string };

export function TreeCreatePage({ questionId, onClose }: TreeCreatePageProps) {
  const { updateQuestion, questions } = useTestCreateForm();
  const existing = questions.find((q) => q.id === questionId)?.data;

  const [questionTitle, setQuestionTitle] = useState(
    existing?.typeId === "tree" ? existing.title : "",
  );
  const [questionDescription, setQuestionDescription] = useState(
    existing?.typeId === "tree" ? existing.description : "",
  );
  const [nodes, setNodes] = useState<TreeNodeItem[]>(
    existing?.typeId === "tree" ? existing.nodes : [],
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isManageMode, setIsManageMode] = useState(false);
  const [isQuestionEditorOpen, setIsQuestionEditorOpen] = useState(false);
  const [nodeSheetMode, setNodeSheetMode] = useState<NodeSheetMode | null>(null);

  const isCompleteDisabled =
    questionTitle.trim().length === 0 || nodes.length === 0;

  const findNode = (
    list: TreeNodeItem[],
    nodeId: string,
  ): TreeNodeItem | null => {
    for (const node of list) {
      if (node.id === nodeId) return node;
      const found = findNode(node.children, nodeId);
      if (found) return found;
    }
    return null;
  };

  const renameNode = (
    list: TreeNodeItem[],
    nodeId: string,
    name: string,
  ): TreeNodeItem[] =>
    list.map((node) =>
      node.id === nodeId
        ? { ...node, name }
        : { ...node, children: renameNode(node.children, nodeId, name) },
    );

  const deleteNode = (
    list: TreeNodeItem[],
    nodeId: string,
  ): TreeNodeItem[] =>
    list
      .filter((node) => node.id !== nodeId)
      .map((node) => ({ ...node, children: deleteNode(node.children, nodeId) }));

  const appendChild = (
    list: TreeNodeItem[],
    parentId: string,
    child: TreeNodeItem,
  ): TreeNodeItem[] =>
    list.map((node) =>
      node.id === parentId
        ? { ...node, children: [...node.children, child] }
        : { ...node, children: appendChild(node.children, parentId, child) },
    );

  const createNode = (name: string): TreeNodeItem => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    children: [],
  });

  const handleNodeSheetConfirm = (name: string) => {
    if (!nodeSheetMode) return;

    if (nodeSheetMode.kind === "create-root") {
      const next = createNode(name);
      setNodes((prev) => [...prev, next]);
      setSelectedNodeId((prev) => prev ?? next.id);
    } else {
      setNodes((prev) => renameNode(prev, nodeSheetMode.nodeId, name));
    }

    setNodeSheetMode(null);
  };

  const handleAddChildNode = (parentId: string) => {
    const parent = findNode(nodes, parentId);
    if (!parent) return;
    const isRoot = nodes.some((n) => n.id === parentId);
    const separator = isRoot ? " " : ".";
    const newName = `${parent.name}${separator}${parent.children.length + 1}`;
    setNodes((prev) => appendChild(prev, parentId, createNode(newName)));
  };

  const sheetTitle =
    nodeSheetMode?.kind === "rename" ? "기능 이름 수정" : "기능 추가하기";
  const sheetInitialName =
    nodeSheetMode?.kind === "rename" ? nodeSheetMode.initialName : "";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <TreeCreateTopSection
        questionTitle={questionTitle}
        questionDescription={questionDescription}
        onOpenQuestionEditor={() => setIsQuestionEditorOpen(true)}
      />
      <TreeCreateOptionSection
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        isManageMode={isManageMode}
        onOpenNodeEditor={() => setNodeSheetMode({ kind: "create-root" })}
        onSelectNode={setSelectedNodeId}
        onEditNode={(nodeId) => {
          const target = findNode(nodes, nodeId);
          if (!target) return;
          setNodeSheetMode({ kind: "rename", nodeId, initialName: target.name });
        }}
        onAddChildNode={handleAddChildNode}
        onToggleManageMode={() => setIsManageMode((prev) => !prev)}
        onDeleteNode={(nodeId) => {
          setNodes((prev) => deleteNode(prev, nodeId));
          setSelectedNodeId((prev) => (prev === nodeId ? null : prev));
        }}
      />
      <TreeCreateBottomCTA
        isCompleteDisabled={isCompleteDisabled}
        onCancel={onClose}
        onComplete={() => {
          updateQuestion(questionId, {
            typeId: "tree",
            title: questionTitle,
            description: questionDescription,
            nodes,
          });
          onClose();
        }}
      />

      <TreeNodeAddSheet
        key={nodeSheetMode ? `${nodeSheetMode.kind}-${'nodeId' in nodeSheetMode ? nodeSheetMode.nodeId : 'root'}` : 'closed'}
        open={nodeSheetMode !== null}
        title={sheetTitle}
        initialName={sheetInitialName}
        onClose={() => setNodeSheetMode(null)}
        onConfirm={handleNodeSheetConfirm}
      />

      <AnimatePresence>
        {isQuestionEditorOpen && (
          <TreeQuestionEditorOverlay
            initialTitle={questionTitle}
            initialDescription={questionDescription}
            onClose={() => setIsQuestionEditorOpen(false)}
            onSave={({ title, description }) => {
              setQuestionTitle(title);
              setQuestionDescription(description);
              setIsQuestionEditorOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
