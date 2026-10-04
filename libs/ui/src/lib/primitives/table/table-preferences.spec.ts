import {
  normalizeJpTablePreferences,
  parseJpTablePreferences,
} from './table-preferences';
const columns = [
  { key: 'name', header: 'Name', minWidth: 120, maxWidth: 400 },
  { key: 'owner', header: 'Owner' },
];
describe('table preferences', () => {
  it('resets corrupt JSON, old schema versions and missing data', () => {
    for (const json of [null, '{', 'null', 'false', '[]', '{"version":2}'])
      expect(parseJpTablePreferences(json, columns)).toEqual({
        version: 1,
        visibleColumnKeys: ['name', 'owner'],
        columnWidths: {},
      });
  });
  it('filters obsolete keys, preserves schema order, deduplicates and clamps widths', () => {
    expect(
      normalizeJpTablePreferences(
        {
          version: 1,
          visibleColumnKeys: ['owner', 'owner', 'missing'],
          columnWidths: { name: 40, owner: 10000, missing: 200 },
        },
        columns,
      ),
    ).toEqual({
      version: 1,
      visibleColumnKeys: ['owner'],
      columnWidths: { name: 120, owner: 960 },
    });
    expect(
      normalizeJpTablePreferences(
        {
          version: 1,
          visibleColumnKeys: [],
          columnWidths: { name: NaN, owner: '180' },
        },
        columns,
      ),
    ).toEqual({ version: 1, visibleColumnKeys: ['name'], columnWidths: {} });
  });
  it('handles invalid width bounds, unavailable columns and malformed fields', () => {
    expect(
      normalizeJpTablePreferences(
        { version: 1, columnWidths: { name: 123.6 } },
        [{ key: 'name', header: 'Name', minWidth: NaN, maxWidth: Infinity }],
      ).columnWidths,
    ).toEqual({ name: 124 });
    expect(
      normalizeJpTablePreferences({ version: 1, columnWidths: { name: 100 } }, [
        { key: 'name', header: 'Name', minWidth: 200, maxWidth: 20 },
      ]).columnWidths,
    ).toEqual({ name: 200 });
    expect(
      normalizeJpTablePreferences(
        { version: 1, visibleColumnKeys: 42, columnWidths: null },
        [],
      ),
    ).toEqual({ version: 1, visibleColumnKeys: [], columnWidths: {} });
  });
});
