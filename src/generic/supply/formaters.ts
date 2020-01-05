import { BODY_ID, TElementAny } from '../states/elements';
import { isDefined, isElementGenericOrBody, isText } from './type-guards';

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

export const getElementName = (element: TElementAny) => {
  if (isElementGenericOrBody(element)) {
    return isText(element.name) ? element.name : element.id === BODY_ID ? 'Body' : element.type;
  } else {
    return 'Canvas';
  }
};
