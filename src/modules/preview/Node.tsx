import React from 'react';
import { classes, style } from 'typestyle';

import { reactiveList } from '@grammarly/focal';

import { actionsTree } from '../../generic/actions';
import {
    CANVAS_ID, ECanvasType, EElementType, TElementGenericOrBody,
} from '../../generic/states/elements';
import { stateElements$ } from '../../generic/states/state-app';
import { getNormalizedElementCSSProperties } from '../../generic/style-helpers/normalize';
import { getElementClassName, getElementName } from '../../generic/supply/formaters';
import { useObservable } from '../../generic/supply/react-helpers';
import { tv } from '../../generic/supply/style-helpers';
import { isDefined, isElementGeneric } from '../../generic/supply/type-guards';
import { createTreeElement } from '../tree/utils';
import { refNode } from './node-elements-collection';

interface IProps {
  elementID: string;
}

export const Node = React.memo<IProps>(({ elementID }) => {
  const { ref, className$, CSSProperties$, text$, tree$, instances$ } = React.useMemo(() => {
    const node$ = getNode(elementID);
    const element$ = node$.view('element');
    return {
      ref: refNode(elementID),
      className$: element$.view(getElementClassName),
      CSSProperties$: node$.view(getNormalizedElementCSSProperties),
      text$: element$.view((element) => {
        if (isElementGeneric(element)) {
          if (element.type === EElementType.Component) {
            const mockupProps = element.props.Mockup;
            return mockupProps.hasRandomText
              ? makeTextLine(mockupProps.randomTextLength.n)
              : getElementName(element);
          }
        }
      }),
      tree$: reactiveList(element$.view('children'), (eID) => <Node elementID={eID} key={eID} />),
      instances$: element$.view((element) => {
        if (isElementGeneric(element)) {
          const instances = element.props.Mockup.instances.n;
          return instances < 1 ? 1 : instances;
        } else {
          return 1;
        }
      }),
    };
  }, [elementID]);
  const className = useObservable(className$);
  const CSSProperties = useObservable(CSSProperties$);
  const text = useObservable(text$);
  const tree = useObservable(tree$);
  const instances = useObservable(instances$);
  const node = React.createElement('div', {
    ref,
    className: classes($container, style(CSSProperties, { $debugName: className })),
    children: isDefined(text) ? text : tree,
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      actionsTree.focus({ id: elementID });
    },
  });
  return instances > 1 ? (
    <>
      {[...new Array(instances)].map((_, key) =>
        React.createElement(React.Fragment, { children: node, key })
      )}
    </>
  ) : (
    node
  );
});

const ref = 'ab.cde fghi!jkl mno.pqrs tuvw?xyz';
const makeTextLine = (length: number) => {
  if (length < 1) {
    return length === 0 ? '' : '🍆';
  } else {
    let res = '';
    const refLength = ref.length;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    while (length--) {
      res += ref.charAt(Math.floor(Math.random() * refLength));
    }
    return res.trim();
  }
};

const getNode = (elementID: string) =>
  stateElements$.view((state): { element: TElementGenericOrBody; parentType: EElementType } => {
    const element = state[elementID] as TElementGenericOrBody | undefined;
    if (isDefined(element)) {
      if (isElementGeneric(element)) {
        return {
          element,
          parentType: (state[element.parent] as TElementGenericOrBody).type,
        };
      } else {
        return {
          element,
          parentType:
            state[CANVAS_ID].type === ECanvasType.Div ? EElementType.Component : EElementType.Flex,
        };
      }
    } else {
      return {
        element: createTreeElement(),
        parentType: EElementType.Component,
      };
    }
  });

const $container = style({
  wordBreak: 'break-all',
  $nest: {
    '&:hover': {
      boxShadow: `inset 0 0 0 1px ${tv('base')}, inset 0 0 0 2px ${tv(
        'base900'
      )}, inset 0 0 0 3px ${tv('base')}`,
    },
  },
});
