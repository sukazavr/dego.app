// eslint-disable-next-line @typescript-eslint/interface-name-prefix
declare interface Window {
  STORYBOOK_ENV?: string;
  __REDUX_DEVTOOLS_EXTENSION__?: {
    connect: () => {
      init: (state: unknown) => void;
      send: (name: string, state: unknown) => void;
    };
  };
}

declare module 'nanoid' {
  const nanoid: (v?: number) => string;
  export default nanoid;
}
