export enum EUnitType {
	Default, // let browser set the value
	String, // only IUnit.s involved
	Float, // only IUnit.n involved and it's floating-point number
	Integer, // only IUnit.n involved and it's number without a decimal point
	FloatString, // value computes based on IUnit.n + IUnit.s
	IntegerString, // same but for number without a decimal point
}

export interface IUnit {
	t: EUnitType
	n: number
	s: string
}

export const defaultUnit: IUnit = {
	t: EUnitType.Default,
	n: 0,
	s: '',
}
