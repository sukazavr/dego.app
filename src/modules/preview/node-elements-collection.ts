import { isDefined, isNull } from '../../generic/supply/type-guards';

const reg: Record<string, HTMLElement[]> = {};

export const refNode = (elementID: string) => (el: HTMLElement | null) => {
  if (isNull(el)) {
    reg[elementID] = [];
  } else {
    const collection = reg[elementID];
    if (isDefined(collection)) {
      collection.push(el);
    } else {
      reg[elementID] = [el];
    }
  }
};

export const getNodeElementsCollection = (elementID: string) => {
  const collection = reg[elementID];
  return isDefined(collection) ? collection : [];
};
