export enum EExportLayout {
  HTML,
  JSX,
}

export interface IExport {
  targetID: string | null;
  layout: EExportLayout;
  firstPanelWidth: number;
  secondPanelWidth: number;
}

export const defaultExport: IExport = {
  targetID: null,
  layout: EExportLayout.HTML,
  firstPanelWidth: 400,
  secondPanelWidth: 400,
};
