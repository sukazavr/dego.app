import { isDefined, isText } from './type-guards';

export const stringToSlug = (str: string) => str.replace(/\s+/g, '-').toLowerCase();

export const slugToTitle = (slug: string) =>
  slug.replace('-', ' ').replace(/^./, (str) => str.toUpperCase());

export const mapToQuery = (map?: Record<string, string | number>) => {
  let q: string = '';
  if (isDefined(map)) {
    q = Object.entries(map)
      .map((v) => v.join('='))
      .join('&');
  }
  return isText(q) ? `?${q}` : q;
};
