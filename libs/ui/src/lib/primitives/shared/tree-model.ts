/** Stable keys are unique across the entire tree, including unloaded branches. */
export type JpTreeLoadState = 'idle' | 'loading' | 'error' | 'loaded';

export interface JpTreeNode {
  key: string;
  label: string;
  description?: string;
  disabled?: boolean;
  children?: readonly JpTreeNode[];
  /** An unloaded branch. Once loaded, children determine whether it is a branch. */
  hasChildren?: boolean;
  loadState?: JpTreeLoadState;
}

export interface JpTreeEntry<T extends JpTreeNode> {
  node: T;
  parentKey: string | null;
  ancestors: readonly string[];
  level: number;
  position: number;
  size: number;
}

/** Internal traversal shared by the navigation tree and the native tree table. */
export function indexJpTree<T extends JpTreeNode>(
  nodes: readonly T[],
): {
  entries: JpTreeEntry<T>[];
  byKey: Map<string, JpTreeEntry<T>>;
} {
  const entries: JpTreeEntry<T>[] = [];
  const byKey = new Map<string, JpTreeEntry<T>>();
  const visit = (siblings: readonly T[], ancestors: readonly string[]) => {
    siblings.forEach((node, position) => {
      if (!node.key?.trim() || byKey.has(node.key)) {
        throw new Error(
          'JP hierarchy requires nonempty, globally unique node keys.',
        );
      }
      const entry: JpTreeEntry<T> = {
        node,
        parentKey: ancestors[ancestors.length - 1] ?? null,
        ancestors,
        level: ancestors.length + 1,
        position: position + 1,
        size: siblings.length,
      };
      entries.push(entry);
      byKey.set(node.key, entry);
      visit((node.children ?? []) as readonly T[], [...ancestors, node.key]);
    });
  };
  visit(nodes, []);
  return { entries, byKey };
}

export function jpTreeHasChildren(node: JpTreeNode): boolean {
  return (
    !!node.children?.length ||
    (node.hasChildren === true && node.loadState !== 'loaded')
  );
}
