import { defaultUnit, EUnitType, IUnit } from '../../generic/states/unit'

export class UnitOption {
	constructor(private type: EUnitType, private string: string) {}

	get placeholder() {
		return this.type === EUnitType.Default ? 'default' : 'undefined'
	}

	is = ({ t, s }: IUnit): boolean => {
		if (t !== this.type) {
			return false
		}
		switch (this.type) {
			case EUnitType.String:
			case EUnitType.FloatString:
			case EUnitType.IntegerString:
				return s === this.string
			default:
				return true
		}
	}

	convert = (unit: IUnit): IUnit => {
		switch (this.type) {
			case EUnitType.String:
			case EUnitType.FloatString:
				return { ...unit, t: this.type, s: this.string }
			case EUnitType.Float:
				return { ...unit, t: this.type }
			case EUnitType.Integer:
				return { ...unit, t: this.type, n: Math.round(unit.n) }
			case EUnitType.IntegerString:
				return { t: this.type, n: Math.round(unit.n), s: this.string }
			default:
				return { ...unit, t: EUnitType.Default }
		}
	}

	stringToUnit = (_: string) => {
		const string = _.trim()
		const unit: IUnit = { ...defaultUnit }
		if (string === '') {
			return unit
		}
		const number = parseFloat(string)
		if (isNaN(number)) {
			unit.t = EUnitType.String
			unit.s = string
			return unit
		}
		const numberString = number.toString()
		if (numberString === string) {
			unit.t = EUnitType.Float
			unit.n = number
			return unit
		}
		unit.t = number % 1 === 0 ? EUnitType.IntegerString : EUnitType.FloatString
		unit.n = number
		unit.s = string.replace(numberString, '').toLowerCase()
		return unit
	}

	unitToString = ({ t: type, n: number, s: string }: IUnit): string => {
		switch (type) {
			case EUnitType.Float:
				return number.toString()
			case EUnitType.String:
				return string
			case EUnitType.FloatString:
			case EUnitType.IntegerString:
				return number + string
			default:
				return ''
		}
	}

	canIncrement = ({ t }: IUnit) => t !== EUnitType.Default && t !== EUnitType.String
}
