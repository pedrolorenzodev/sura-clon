const foldText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export function matchesQuery(query: string, ...fields: string[]) {
  const needle = foldText(query);
  return !needle || fields.some((field) => foldText(field).includes(needle));
}

export function paginate<T>(items: T[], requestedPage: string, pageSize: number) {
  const pages = Math.ceil(items.length / pageSize);
  const page = Math.min(Math.max(Number.parseInt(requestedPage, 10) || 1, 1), Math.max(pages, 1));
  return { pageItems: items.slice((page - 1) * pageSize, page * pageSize), page, pages };
}

export function rotate<T>(items: T[], by: number) {
  const offset = ((by % items.length) + items.length) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

export function seeded(seed: string) {
  let state = [...seed].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619), 2166136261);
  return () => {
    state = Math.imul(state ^ (state >>> 15), 2246822507);
    state = Math.imul(state ^ (state >>> 13), 3266489909);
    return ((state ^= state >>> 16) >>> 0) / 4294967296;
  };
}

export const SEARCH_SETTLE_MS = 250;
