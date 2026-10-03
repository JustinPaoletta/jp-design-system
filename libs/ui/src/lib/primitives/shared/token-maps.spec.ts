import {
  createNumberUnionTransform,
  createOptionalStringUnionTransform,
  createStringUnionTransform,
} from './token-maps';

describe('token-maps transforms', () => {
  it('createStringUnionTransform returns fallback for non-string values', () => {
    const transform = createStringUnionTransform(['a', 'b'] as const, 'a');
    expect(transform(1)).toBe('a');
    expect(transform('b')).toBe('b');
  });

  it('createOptionalStringUnionTransform handles nullish, empty, valid, and invalid', () => {
    const transform = createOptionalStringUnionTransform(['sm', 'md'] as const);
    expect(transform(null)).toBeNull();
    expect(transform(undefined)).toBeNull();
    expect(transform('')).toBeNull();
    expect(transform('   ')).toBeNull();
    expect(transform('sm')).toBe('sm');
    expect(transform('lg')).toBeNull();
    expect(transform(12)).toBeNull();
  });

  it('createNumberUnionTransform accepts numbers and numeric strings', () => {
    const transform = createNumberUnionTransform([1, 2, 3] as const, 1);
    expect(transform(2)).toBe(2);
    expect(transform('3')).toBe(3);
    expect(transform('')).toBe(1);
    expect(transform('1.5')).toBe(1);
    expect(transform('9')).toBe(1);
    expect(transform(true)).toBe(1);
  });
});
