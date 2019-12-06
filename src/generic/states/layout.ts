import { EUnitType, IUnit } from './unit'

export interface ILayout {
	treePanelWidth: number
	nodePanelWidth: number
	canvasWidth: IUnit
	canvasHeight: IUnit
}

export const defaultLayout: ILayout = {
	treePanelWidth: 260,
	nodePanelWidth: 310,
	canvasWidth: {
		t: EUnitType.IntegerString,
		n: 800,
		s: 'px',
	},
	canvasHeight: {
		t: EUnitType.IntegerString,
		n: 1000,
		s: 'px',
	},
}
