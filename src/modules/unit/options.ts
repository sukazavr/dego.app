import { EUnitType } from '../../generic/states/unit'
import { UnitOption } from './UnitOption'

export const unitOptions = {
	default: new UnitOption(EUnitType.Default, 'default'),

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
}

export type TUnitOptionsKeys = keyof typeof unitOptions
