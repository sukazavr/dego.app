import { defaultUnit, EUnitType, IUnit } from '../../generic/states/unit';

export class UnitOption {
  constructor(private type: EUnitType, private string: string) {}

  get placeholder() {
    return this.type === EUnitType.Default ? 'default' : 'undefined';
  }

  get defaultUnit() {
    const unit: IUnit = { t: this.type, n: 0, s: this.string };
    return unit;
  }

  is = ({ t, s }: IUnit): boolean => {
    if (t !== this.type) {
      return false;
    }
    switch (this.type) {
      case EUnitType.String:
      case EUnitType.FloatString:
      case EUnitType.IntegerString:
        return s === this.string;
      default:
        return true;
    }
  };

  convert = (unit: IUnit): IUnit => {
    switch (this.type) {
      case EUnitType.String:
      case EUnitType.FloatString:
        return { ...unit, t: this.type, s: this.string };
      case EUnitType.Float:
        return { ...unit, t: this.type };
      case EUnitType.Integer:
        return { ...unit, t: this.type, n: Math.round(unit.n) };
      case EUnitType.IntegerString:
        return { t: this.type, n: Math.round(unit.n), s: this.string };
      default:
        return { ...unit, t: EUnitType.Default };
    }
  };

  stringToUnit = (_: string) => {
    const string = _.trim();
    const unit: IUnit = { ...defaultUnit };
    if (string === '') {
      return unit;
    }
    const number = parseFloat(string);
    if (isNaN(number)) {
      unit.t = EUnitType.String;
      unit.s = string;
      return unit;
    }
    const numberString = number.toString();
    if (numberString === string) {
      unit.t = number % 1 === 0 ? EUnitType.Integer : EUnitType.Float;
      unit.n = number;
      return unit;
    }
    unit.t = number % 1 === 0 ? EUnitType.IntegerString : EUnitType.FloatString;
    unit.n = number;
    unit.s = string.replace(numberString, '').toLowerCase();
    return unit;
  };

  unitToString = ({ t: type, n: number, s: string }: IUnit): string => {
    switch (type) {
      case EUnitType.Float:
      case EUnitType.Integer:
        return number.toString();
      case EUnitType.String:
        return string;
      case EUnitType.FloatString:
      case EUnitType.IntegerString:
        return number + string;
      default:
        return '';
    }
  };

  canIncrement = ({ t }: IUnit) => t !== EUnitType.Default && t !== EUnitType.String;
}

export const unitOptions = {
  default: new UnitOption(EUnitType.Default, 'default'),
  int: new UnitOption(EUnitType.Integer, ''),

  fr: new UnitOption(EUnitType.FloatString, 'fr'),
  em: new UnitOption(EUnitType.FloatString, 'em'),
  rem: new UnitOption(EUnitType.FloatString, 'rem'),
  vw: new UnitOption(EUnitType.FloatString, 'vw'),
  vh: new UnitOption(EUnitType.FloatString, 'vh'),
  '%': new UnitOption(EUnitType.FloatString, '%'),

  px: new UnitOption(EUnitType.IntegerString, 'px'),

  auto: new UnitOption(EUnitType.String, 'auto'),
  inherit: new UnitOption(EUnitType.String, 'inherit'),
  'fit-content': new UnitOption(EUnitType.String, 'fit-content'),
  'min-content': new UnitOption(EUnitType.String, 'min-content'),
  'max-content': new UnitOption(EUnitType.String, 'max-content'),
};

export type TUnitOptionsKeys = keyof typeof unitOptions;
