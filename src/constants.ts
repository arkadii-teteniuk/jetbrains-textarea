import { mockSearchTextValue, mockTextMultiline } from "./mocks";

export const DEFAULT_WIDTH = 410;
export const DEFAULT_HEIGHT = 145;
export const DEFAULT_CLIP = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  y: 0,
  x: 0,
};

export const INITIAL_SEARCH_TEXT = mockTextMultiline;
export const INITIAL_SEARCH_VALUE = mockSearchTextValue;
export const SELECTORS = {
  foundEntity: ".backdrop mark",
  search: "#search-field",
  editor: ".editor",
  container: ".container",
  textContainer: ".textContainer",
  multilineSwitcher: "#search-multiline",
};
