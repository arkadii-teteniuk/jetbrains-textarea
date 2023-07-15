import { searchSubstr } from "./utils/search";
import { throttle } from "./utils/throttle";

type InitSearchFn = (
  editor: HTMLTextAreaElement | null,
  searchField: HTMLInputElement | null,
  options?: Record<string, unknown>,
) => void;

export const initSearch: InitSearchFn = (editor, searchField) => {
  if (!editor) {
    throw new TypeError('"editor" must be specified');
  }

  if (!searchField) {
    throw new TypeError('"searchField" must be specified');
  }

  const container = document.createElement("div");
  container.className = "container";

  const backdrop = document.createElement("div");
  backdrop.className = "backdrop";

  const throttledOnSearch = throttle(function onSearch(e: unknown) {
    backdrop.innerHTML = searchSubstr(
      editor.value,
      (e.target as HTMLInputElement).value,
    );
  });

  // handle update of the search input
  searchField.addEventListener("input", throttledOnSearch);

  const throttledOnTextChange = throttle(function onTextChange(e: unknown) {
    backdrop.innerHTML = searchSubstr(
      (e.target as HTMLTextAreaElement).value,
      searchField.value,
    );
  });

  // handle update of the textarea
  editor.addEventListener("input", throttledOnTextChange);

  // on scroll textarea need to scroll backdrop as well
  editor.addEventListener("scroll", function (e) {
    const target = e.target as HTMLTextAreaElement;
    backdrop.scrollTo(target.scrollLeft, target.scrollTop);
  });

  new ResizeObserver(() => {
    backdrop.scrollTo(editor.scrollLeft, editor.scrollTop);
  }).observe(editor);

  container.append(backdrop, editor);

  document.querySelector("body")?.append(container);
};
