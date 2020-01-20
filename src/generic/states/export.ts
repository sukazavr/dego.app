export enum EExportLayout {
  HTML,
  JSX,
}

export interface IExport {
  layout: {
    firstPanelWidth: number;
    secondPanelWidth: number;
  };
  settings: {
    layout: EExportLayout;
    eliminateEmptyCSSRules: boolean;
  };
}

export const defaultExport: IExport = {
  layout: {
    firstPanelWidth: 400,
    secondPanelWidth: 400,
  },
  settings: {
    layout: EExportLayout.HTML,
    eliminateEmptyCSSRules: true,
  },
};
