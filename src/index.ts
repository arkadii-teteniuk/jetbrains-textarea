import { initSearch } from "./initSearch";
import { INITIAL_SEARCH_TEXT, INITIAL_SEARCH_VALUE } from "./constants";

window.addEventListener("load", () => {
  initSearch(INITIAL_SEARCH_TEXT.repeat(25), INITIAL_SEARCH_VALUE);
});
