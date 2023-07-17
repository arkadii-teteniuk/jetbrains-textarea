import { throttle } from "./utils/throttle";
import { CustomCache, getCache } from "./utils/cache";
import { getScrollbarWidth } from "./utils/getScrollbarWidth";
import { SearchConfig, options } from "./config";
import { SELECTORS } from "./constants";
import { searchSubstr } from "./utils/search";

class TextareaSearch {
  private editor: HTMLTextAreaElement;
  private backdrop: HTMLDivElement;
  private container: HTMLDivElement;
  private search: HTMLInputElement | HTMLTextAreaElement;
  private multilineSwitcher: HTMLInputElement;

  private initialText: string;
  private initialSearch: string;
  private selectors: typeof SELECTORS;
  private options: SearchConfig;
  private cache: CustomCache;

  constructor(
    initialText: string,
    initialSearch: string,
    selectors: typeof SELECTORS,
    options: SearchConfig,
  ) {
    this.initialText = initialText;
    this.initialSearch = initialSearch;
    this.selectors = selectors;
    this.options = options;
    this.cache = getCache();

    this.multilineSwitcher = this.initMultilineSwitcher();
    this.editor = this.initEditor();
    this.search = this.initSearch();
    this.container = this.createContainer();
    this.backdrop = this.createBackdrop();
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

  private initMultilineSwitcher(): HTMLInputElement {
    const checkboxSearchMultiline = document.querySelector(
      this.selectors.multilineSwitcher,
    );

    if (!checkboxSearchMultiline) {
      throw new TypeError('"checkboxSearchMultiline" must be specified');
    }

    return checkboxSearchMultiline as HTMLInputElement;
  }

  private createContainer() {
    const container = document.createElement("div");
    container.className = "container";
    return container;
  }

  private createBackdrop() {
    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    backdrop.style.paddingRight = `${getScrollbarWidth()}px`;
    return backdrop;
  }

  private getHighlightedText(fromText: string, textToReplace: string) {
    const cachedValue = this.cache.get(textToReplace);

    if (cachedValue) {
      return cachedValue;
    }

    if (!textToReplace) {
      this.cache.save("", fromText);
      return fromText;
    }

    const updatedHighlightedText = searchSubstr(fromText, textToReplace);
    this.cache.save(textToReplace, updatedHighlightedText);
    return updatedHighlightedText;
  }

  private handleTextOrSearchUpdate() {
    this.backdrop.innerHTML = this.getHighlightedText(
      this.editor.value,
      this.search.value,
    );
  }

  private getClosestNode(posY: number, nodes: NodeListOf<HTMLElement>) {
    for (const entity of nodes) {
      if (posY < entity.offsetTop) {
        return entity;
      }
    }

    return null;
  }

  private navigateToTheNextEntity() {
    const entities = this.backdrop.querySelectorAll("mark");
    const currentPos = this.editor.scrollTop;
    const closest = this.getClosestNode(currentPos, entities);

    if (closest) {
      this.editor.scrollTo(0, closest.offsetTop);
    }
  }

  private addEventListeners() {
    const throttledOnSearch = throttle(() => this.handleTextOrSearchUpdate());
    const onSearchKeyPress = (e) => {
      if ((e as KeyboardEvent).key === "Enter") {
        e.preventDefault();
        this.navigateToTheNextEntity();
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

    this.multilineSwitcher.addEventListener("change", (e) => {
      const isChecked = (e.target as HTMLInputElement).checked;
      options.multilineSearch = isChecked;

      this.search.removeEventListener("input", throttledOnSearch);
      this.search.removeEventListener("keypress", onSearchKeyPress);
      if (isChecked) {
        this.switchToMultilineSearch();
      } else {
        this.switchToBasicSearch();
      }

      this.search.addEventListener("input", throttledOnSearch);
      this.search.addEventListener("keypress", onSearchKeyPress);
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

    // init a correct state of the search control based on `options`
    if (this.options.multilineSearch) {
      const checkboxSearchMultiline = this.multilineSwitcher;
      checkboxSearchMultiline.checked = options.multilineSearch;
      checkboxSearchMultiline.dispatchEvent(new Event("change"));
    }
  }

  private replaceSearchControl(
    updatedControl: HTMLInputElement | HTMLTextAreaElement,
  ) {
    const searchInput = this.search;
    searchInput.parentElement?.append(updatedControl);
    searchInput?.remove();
    this.search = updatedControl;
  }

  private switchToMultilineSearch() {
    const searchInput = this.search;
    const searchMultiline = document.createElement("textarea");
    searchMultiline.id = "search-field";
    searchMultiline.value = searchInput?.value;
    this.replaceSearchControl(searchMultiline);
  }

  private switchToBasicSearch() {
    const searchInput = this.search;
    const searchBasic = document.createElement("input");
    searchBasic.type = "text";
    searchBasic.id = "search-field";
    searchBasic.value = searchInput.value;
    this.replaceSearchControl(searchBasic);
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
  initialSearch: string,
): TextareaSearch =>
  new TextareaSearch(initialText, initialSearch, SELECTORS, options).init();
