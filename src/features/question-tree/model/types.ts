export interface TreeNodeItem {
  id: string;
  name: string;
  children: TreeNodeItem[];
}

export interface TreeQuestionData {
  title: string;
  description: string;
  nodes: TreeNodeItem[];
}
