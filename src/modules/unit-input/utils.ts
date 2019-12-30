import { EUnitType, IUnit } from '../../generic/states/unit';

export const getMultiplier = (
  { t }: IUnit,
  e: { ctrlKey: boolean; shiftKey: boolean; altKey: boolean }
) => {
  switch (true) {
    case e.ctrlKey:
      return 100;
    case e.shiftKey:
      return 10;
    case e.altKey && t === EUnitType.FloatString:
      return 0.1;
    default:
      return 1;
  }
};
