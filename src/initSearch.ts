import { throttle } from "./utils/throttle";
import { CustomCache, getCache } from "./utils/cache";
import { SearchConfig, options } from "./config";
import { SELECTORS } from "./constants";
import { searchSubstr } from "./utils/search";
import { sanitize } from "./utils/sanitize";

class TextareaSearch {
  private editor: HTMLTextAreaElement;
  private backdrop: HTMLDivElement;
  private container: HTMLDivElement;

  private regexSwitcher: HTMLInputElement;

  private search: HTMLInputElement | HTMLTextAreaElement;
  private searchButtonNext: HTMLButtonElement | null;
  private searchButtonPrev: HTMLButtonElement | null;
  private searchButtonReset: HTMLButtonElement | null;

  private foundEntities: NodeListOf<HTMLElement> | null;
  private closestFoundNode: HTMLElement | null;
  private selectedFoundEntity: null | number;

  private initialText: string;
  private initialSearch: string;
  private selectors: typeof SELECTORS;
  private options: SearchConfig;
  private cache: CustomCache;

  constructor(
    initialText: string,
    initialSearch: string,
    selectors: typeof SELECTORS,
    options: SearchConfig
  ) {
    this.initialText = initialText;
    this.initialSearch = initialSearch;
    this.selectors = selectors;
    this.options = options;
    this.cache = getCache();

    this.closestFoundNode = null;
    this.selectedFoundEntity = null;
    this.foundEntities = null;

    this.regexSwitcher = this.initRegexSwitcher();

    this.editor = this.initEditor();
    this.search = this.initSearch();
    this.container = this.createContainer();
    this.backdrop = this.createBackdrop();
    this.searchButtonPrev = this.initSearchButtonPrev();
    this.searchButtonNext = this.initSearchButtonNext();
    this.searchButtonReset = this.initSearchButtonReset();
  }

  private initSearchButtonPrev() {
    const buttonPrev = document.querySelector(
      this.selectors.searchPrev
    ) as HTMLButtonElement;
    buttonPrev.addEventListener("click", () => {
      console.log("click prev", this.selectedFoundEntity);
      if (this.selectedFoundEntity) {
        this.selectedFoundEntity--;
      }

      this.highlightSelectedSearchResult();
    });
    return buttonPrev;
  }

  private initSearchButtonNext() {
    const buttonNext = document.querySelector(
      this.selectors.searchNext
    ) as HTMLButtonElement;

    buttonNext.addEventListener("click", () => {
      if (!this.foundEntities) {
        return;
      }

      console.log(
        "click next",
        this.selectedFoundEntity,
        this.foundEntities?.length
      );

      if (this.selectedFoundEntity == null) {
        this.selectedFoundEntity = 0;
      } else if (this.selectedFoundEntity < this.foundEntities?.length - 1) {
        this.selectedFoundEntity++;
      }

      this.highlightSelectedSearchResult();
    });
    return buttonNext;
  }

  private initSearchButtonReset() {
    const buttonReset = document.querySelector(
      this.selectors.searchReset
    ) as HTMLButtonElement;

    buttonReset.addEventListener("click", () => {
      this.selectedFoundEntity = null;
      this.search.value = "";
      this.handleTextOrSearchUpdate();
      this.highlightSelectedSearchResult();
    });

    return buttonReset;
  }

  private highlightSelectedSearchResult() {
    if (!this.foundEntities) {
      return;
    }

    if (this.closestFoundNode) {
      this.closestFoundNode.className = "";
    }

    this.closestFoundNode = this.foundEntities[this.selectedFoundEntity];

    if (this.closestFoundNode) {
      this.closestFoundNode.className = "selected";
    }

    this.updateSearchResults();

    // scroll
    if (this.closestFoundNode) {
      this.editor.scrollTo(0, this.closestFoundNode.offsetTop);
    }
  }

  private initEditor(): HTMLTextAreaElement {
    const editorNode = document.querySelector(this.selectors.editor);

    if (!editorNode) {
      throw new TypeError('"editor" must be specified');
    }

    return editorNode as HTMLTextAreaElement;
  }

  private initSearch() {
    const searchControl = document.querySelector(this.selectors.search) as
      | HTMLInputElement
      | HTMLTextAreaElement;

    if (!searchControl) {
      throw new TypeError('"searchField" must be specified');
    }

    return searchControl as HTMLInputElement | HTMLTextAreaElement;
  }

  private updateSearchResults() {
    const resultsSpan = document.querySelector(this.selectors.searchResults);

    const currentPosition =
      this.selectedFoundEntity === null ? 0 : this.selectedFoundEntity + 1;

    const totalAmount = this.foundEntities?.length ?? 0;

    if (resultsSpan) {
      resultsSpan.innerHTML = `${currentPosition}/${totalAmount}`;
    }
  }

  private initRegexSwitcher(): HTMLInputElement {
    const checkboxSearchRegex = document.querySelector(
      this.selectors.searchRegex
    );

    if (!checkboxSearchRegex) {
      throw new TypeError('"checkboxSearchRegex" must be specified');
    }

    return checkboxSearchRegex as HTMLInputElement;
  }

  private createContainer() {
    const container = document.createElement("div");
    container.className = "container";
    return container;
  }

  private createBackdrop() {
    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    return backdrop;
  }

  private getHighlightedText(fromText: string, textToReplace: string) {
    const cacheKey = JSON.stringify({
      textToReplace,
      regex: this.regexSwitcher.checked,
    });

    const cachedValue = this.cache.get(cacheKey);

    if (cachedValue) {
      return cachedValue;
    }

    if (!textToReplace) {
      this.cache.save("", fromText);
      return fromText;
    }

    const updatedHighlightedText = searchSubstr(
      fromText,
      textToReplace,
      this.regexSwitcher.checked
    );
    this.cache.save(cacheKey, updatedHighlightedText);
    return updatedHighlightedText;
  }

  private handleTextOrSearchUpdate() {
    this.backdrop.innerHTML = this.getHighlightedText(
      sanitize(this.editor.value),
      sanitize(this.search.value)
    );

    this.foundEntities = this.backdrop.querySelectorAll("mark");
    this.updateSearchResults();
  }

  private addEventListeners() {
    const throttledOnSearch = throttle(() => {
      this.selectedFoundEntity = null;
      this.handleTextOrSearchUpdate();
    });

    this.regexSwitcher.addEventListener("change", () => {
      this.handleTextOrSearchUpdate();
    });

    const onSearchKeyPress = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (keyboardEvent.key === "Enter" && !keyboardEvent.shiftKey) {
        e.preventDefault();
        this.searchButtonNext?.click();
      }
    };

    this.search.addEventListener("keypress", onSearchKeyPress);

    // handle update of the search input
    this.search.addEventListener("input", throttledOnSearch);

    const throttledOnTextChange = throttle(() => {
      this.cache.reset();
      this.handleTextOrSearchUpdate();
    });

    // handle update of the textarea
    this.editor.addEventListener("input", throttledOnTextChange);

    // when scrolling the textarea, the backdrop should be scrolled as well
    this.editor.addEventListener("scroll", (e) => {
      const target = e.target as HTMLTextAreaElement;
      this.backdrop.scrollTo(target.scrollLeft, target.scrollTop);
    });
  }

  private addResizeObserver() {
    const editor = this.editor;
    const onResize = throttle(() => {
      this.backdrop.scrollTo(editor.scrollLeft, editor.scrollTop);
    });
    // handle resize of the textarea
    new ResizeObserver(onResize).observe(editor);
  }

  private combineNodes() {
    const container = this.container;
    container.append(this.backdrop, this.editor);
    document.querySelector(this.selectors.textContainer)?.append(container);
  }

  private setDefaultValues() {
    this.editor.value = this.initialText;
    this.search.value = this.initialSearch;
  }

  init() {
    this.addEventListeners();
    this.addResizeObserver();
    this.setDefaultValues();
    this.combineNodes();
    // programmatically call search input value change
    this.search.dispatchEvent(new Event("input"));
    return this;
  }
}

export const initSearch = (
  initialText: string,
  initialSearch: string
): TextareaSearch =>
  new TextareaSearch(initialText, initialSearch, SELECTORS, options).init();
