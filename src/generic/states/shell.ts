import { graduations, TGraduationName } from '../tokens';

export type TStateGraduations = Record<TGraduationName, boolean>;

export interface IShellState {
  vw: number;
  graduations: TStateGraduations;
  isOnline: boolean;
  isReadyForOffline: boolean;
  isUpdateAvailable: boolean;
  isInstallAvailable: boolean;
}

export const vwToGraduations = (vw: number) => {
  const res: Record<string, boolean> = {};
  let graduation: TGraduationName;
  for (graduation in graduations) {
    const [min, max] = graduations[graduation];
    res[graduation] = vw >= min && vw <= max;
  }
  return res as TStateGraduations;
};

const vw = window.innerWidth;

export const defaultShellState: IShellState = {
  vw,
  graduations: vwToGraduations(vw),
  isOnline: window.navigator.onLine,
  isReadyForOffline: false,
  isUpdateAvailable: false,
  isInstallAvailable: false,
};
