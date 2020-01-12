export interface ITree {
  draggingID: string | null;
  hoveredID: string | null;
  focusedID: string | null; // [LS]
  exportedID: string | null; // [LS]
  flashedID: string | null; // What to animate after drop
  scopedID: string | null; // Used in context menu
  targetID: string | null; // Where to drop
  parentID: string | null; // Parent of target
  highlighter: {
    isVisible: boolean;
    style: {
      top: number;
      left: number;
      width: number;
    };
  };
  add: {
    inside: boolean;
    above: boolean;
    below: boolean;
  };
}

export const defaultTree: ITree = {
  draggingID: null,
  hoveredID: null,
  focusedID: null,
  exportedID: null,
  flashedID: null,
  scopedID: null,
  targetID: null,
  parentID: null,
  highlighter: {
    isVisible: false,
    style: {
      top: 0,
      left: 0,
      width: 0,
    },
  },
  add: {
    inside: false,
    above: false,
    below: false,
  },
};
