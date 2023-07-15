import { searchSubstr } from "./utils/search";
import { throttle } from "./utils/throttle";
import { getCache } from "./utils/cache";
import { getScrollbarWidth } from "./utils/getScrollbarWidth";

type InitSearchFn = (
  editor: HTMLTextAreaElement | null,
  searchField: HTMLInputElement | null,
  options?: {
    scrollToTheFirstResult: false;
  } & Record<string, unknown>,
) => void;

const cache = getCache();

function wrapFoundEntitiesByTag(
  parent: Element,
  fromText: string,
  textToReplace: string,
) {
  const cachedValue = cache.get(textToReplace);

  if (cachedValue) {
    // console.log(`get cached! ${textToReplace}`, cachedValue)
    parent.innerHTML = cachedValue;
    return cachedValue;
  }

  if (!textToReplace) {
    parent.innerHTML = fromText;
    cache.save(textToReplace, fromText);
    return;
  }

  const updatedHighlightedText = searchSubstr(fromText, textToReplace);
  cache.save(textToReplace, updatedHighlightedText);
  parent.innerHTML = updatedHighlightedText;

  return updatedHighlightedText;
}

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

  const throttledOnSearch = throttle(function onSearch(e: Event) {
    wrapFoundEntitiesByTag(
      backdrop,
      editor.value,
      (e.target as HTMLInputElement).value,
    );
  });

  // handle update of the search input
  searchField.addEventListener("input", throttledOnSearch);

  const throttledOnTextChange = throttle(function onTextChange(e: Event) {
    cache.reset();
    wrapFoundEntitiesByTag(
      backdrop,
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

  const onResize = throttle(() => {
    backdrop.scrollTo(editor.scrollLeft, editor.scrollTop);
  }, 120);

  // handle resize of the textarea
  new ResizeObserver(onResize).observe(editor);

  backdrop.style.paddingRight = `${getScrollbarWidth()}px`;

  container.append(backdrop, editor);

  document.querySelector("body")?.append(container);
};
