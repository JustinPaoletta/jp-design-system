import type { JpSortableTableColumn } from './table';

export interface JpTablePreferences {
  version: 1;
  visibleColumnKeys: string[];
  columnWidths: Record<string, number>;
}
/** Validate consumer-owned persisted preferences against the current schema. */
export function normalizeJpTablePreferences(
  value: unknown,
  columns: readonly JpSortableTableColumn[],
): JpTablePreferences {
  const source =
    value &&
    typeof value === 'object' &&
    'version' in value &&
    value.version === 1
      ? (value as Partial<JpTablePreferences>)
      : {};
  const visible = Array.isArray(source.visibleColumnKeys)
    ? columns
        .filter((column) => source.visibleColumnKeys?.includes(column.key))
        .map((column) => column.key)
    : columns.map((column) => column.key);
  const widths =
    source.columnWidths && typeof source.columnWidths === 'object'
      ? source.columnWidths
      : {};
  return {
    version: 1,
    visibleColumnKeys: visible.length
      ? visible
      : columns.slice(0, 1).map((column) => column.key),
    columnWidths: Object.fromEntries(
      columns.flatMap((column) => {
        const width = widths[column.key];
        if (!Number.isFinite(width)) return [];
        const min = Number.isFinite(column.minWidth)
          ? Math.max(80, column.minWidth ?? 80)
          : 80;
        const max = Number.isFinite(column.maxWidth)
          ? Math.max(min, column.maxWidth ?? 960)
          : Math.max(min, 960);
        return [[column.key, Math.round(Math.min(max, Math.max(min, width)))]];
      }),
    ),
  };
}
/** Corrupt JSON or old versions reset safely. Storage access stays with consumers. */
export function parseJpTablePreferences(
  json: string | null,
  columns: readonly JpSortableTableColumn[],
): JpTablePreferences {
  try {
    return normalizeJpTablePreferences(json ? JSON.parse(json) : null, columns);
  } catch {
    return normalizeJpTablePreferences(null, columns);
  }
}
