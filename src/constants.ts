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
  multilineSwitcher: "#search-multiline",

  search: "#search-field",
  searchPrev: "#search-prev",
  searchNext: "#search-next",
  searchReset: "#search-reset",
  searchResults: "#search-results",
  searchRegex: "#search-regex",

  container: ".container",

  editor: ".editor",
  foundEntity: ".backdrop mark",
  textContainer: ".textContainer",
};
