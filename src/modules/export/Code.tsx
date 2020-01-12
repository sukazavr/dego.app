import React from 'react';
import { style } from 'typestyle';

import { ButtonSecondary } from '../../generic/components/ButtonSecondary';
import { Panel } from '../../generic/components/Panel';
import { tv } from '../../generic/supply/style-helpers';
import { isText } from '../../generic/supply/type-guards';
import { fontExportResult, scrollRegular } from '../../generic/theme';

interface IProps {
  title: string;
  code: string;
}

export const Code = React.memo<IProps>(({ title, code }) => {
  const ref = React.useRef<HTMLPreElement>(null);
  const copy = React.useCallback(() => {
    const el = ref.current as HTMLPreElement;
    const codeToBuffer = isText(el.textContent) ? el.textContent : el.innerText;
    if (isText(codeToBuffer)) {
      console.log(codeToBuffer);
      //clipboardCopy(codeToBuffer)
    }
  }, [ref]);
  return (
    <>
      <Panel title={title} onClick={copy}>
        <ButtonSecondary children="Copy To Clipboard" />
      </Panel>
      <pre ref={ref} className={$code} dangerouslySetInnerHTML={{ __html: code }} />
    </>
  );
});

const $code = style(scrollRegular, fontExportResult, {
  flexGrow: 1,
  position: 'relative',
  display: 'block',
  margin: 0,
  padding: '1rem 1rem 1rem 6rem',
  textTransform: 'none',
  wordBreak: 'break-all',
  wordWrap: 'break-word',
  tabSize: 2,
  counterReset: 'line',
  color: tv('base300'),
  overflow: 'auto',
  $nest: {
    '& .line:before': {
      display: 'inline-block',
      position: 'absolute',
      left: 0,
      width: '3rem',
      padding: '0 1rem',
      color: tv('base300'),
      borderRight: `1px solid ${tv('base100')}`,
      textAlign: 'right',
      counterIncrement: 'line',
      content: 'counter(line)',
    },
    '& .hl1': { color: tv('base500') },
    '& .hl2': { color: tv('error500') },
    '& .hl3': { color: tv('select500') },
  },
});
