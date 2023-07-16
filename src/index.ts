import { initSearch } from "./initSearch";
import { INITIAL_SEARCH_TEXT, INITIAL_SEARCH_VALUE } from "./constants";

window.addEventListener("load", () => {
  const editor: HTMLTextAreaElement | null = document.querySelector(".editor");
  const search: HTMLInputElement | null =
    document.querySelector("#search-field");

  initSearch(editor, search);

  (editor as HTMLTextAreaElement).value = initialText.repeat(25);
  (search as HTMLInputElement).value = initialSearch;

  // programmatically call search input value change
  search?.dispatchEvent(new Event("input"));
});
