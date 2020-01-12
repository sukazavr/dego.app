import { BODY_ID, TElementAny } from '../states/elements';
import { isElementGenericOrBody, isText } from './type-guards';

export const getElementName = (element: TElementAny) => {
  if (isElementGenericOrBody(element)) {
    return isText(element.name) ? element.name : element.id === BODY_ID ? 'Body' : element.type;
  } else {
    return 'Canvas';
  }
};

export const getElementClassName = (element: TElementAny) =>
  stringToClassName(getElementName(element));

export const stringToClassName = (str: string) => {
  const step1 = str.replace(/^[^-_a-zA-Z]+/, '').replace(/^-(?:[-0-9]+)/, '-');
  const step2 = step1 && step1.replace(/[^-_a-zA-Z0-9]+/g, '-');
  return step2;
};
