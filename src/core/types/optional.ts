/**
 * Defines a type where a subset of properties in `T` are optional.
 *
 * @template T - The type of the object that will have some properties made optional.
 * @template K - The subset of keys in `T` that should be made optional.
 * @param {T} - The object that will have some of its properties made optional.
 * @param {K} - The subset of keys in `T` that should be made optional.
 * @return {Pick<Partial<T>, K> & Omit<T, K>} - A new type where the subset of keys in `T` are optional.
 */

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
