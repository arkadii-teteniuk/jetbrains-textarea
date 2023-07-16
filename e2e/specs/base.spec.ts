import { expect, test } from "@playwright/test";
import { wait } from "../../src/utils/wait";
import { checkIntersection } from "../../src/utils/checkIntersection";
import { mockTextMultiline } from "../../src/mocks";
import { DEFAULT_CLIP, SELECTORS } from "../../src/constants";

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_TEST_URL ?? "http://localhost:5173/");
});

type TestCase = {
  name: string;
  prefix: string;
  search: string;
  text: string;
  total: number;
  visible: number;
  width: number;
  height: number;
  predefinedText: boolean;
  multiline?: boolean;
};

const testCase: TestCase[] = [
  {
    name: `Find elements (total: 3, visible: 3)`,
    prefix: "base",
    search: "book",
    text: mockTextMultiline.repeat(2) + "book book book",
    total: 3,
    visible: 3,
    width: 410,
    height: 145,
    predefinedText: false,
  },
  {
    name: `Find elements (total: 6, visible: 6)`,
    prefix: "base",
    search: "book",
    text: "book book book book book book",
    total: 6,
    visible: 6,
    width: 410,
    height: 145,
    predefinedText: false,
  },
  {
    name: `Find elements (total: 9, visible: 6)`,
    prefix: "base",
    search: "book",
    text:
      "book book book" +
      mockTextMultiline.repeat(2) +
      "book book book book book book",
    total: 9,
    visible: 6,
    width: 410,
    height: 145,
    predefinedText: false,
  },

  // predefined text (scrollTop)
  {
    name: `Find elements (total: 3, visible: 0) + Predefined text`,
    prefix: "predefined-text",

    search: "book",
    text: mockTextMultiline.repeat(2) + "book book book",
    total: 3,
    visible: 0,
    width: 410,
    height: 145,
    predefinedText: true,
  },
  {
    name: `Find elements (total: 9, visible: 3) + Predefined text`,
    prefix: "predefined-text",

    search: "book",
    text:
      "book book book" + mockTextMultiline + "book book book book book book",
    total: 9,
    visible: 3,
    width: 410,
    height: 145,
    predefinedText: true,
  },

  // predefined text + bigger size
  {
    name: `Find elements (total: 3, visible: 3) + Predefined text + Extended size`,
    prefix: "predefined-text-extended-size",
    search: "book",
    text: mockTextMultiline.repeat(2) + "book book book",
    total: 3,
    visible: 0,
    width: 410,
    height: 300,
    predefinedText: true,
  },
  {
    name: `Find elements (total: 9, visible: 6) + Predefined text + Extended size`,
    prefix: "predefined-text-extended-size",
    search: "book",
    text:
      "book book book" + mockTextMultiline + "book book book book book book",
    total: 9,
    visible: 3,
    width: 410,
    height: 300,
    predefinedText: true,
  },

  {
    name: `Very long line without breaks`,
    prefix: "long-line-no-breaks",
    search:
      "Schoolasdasodiaposidaaosidaosidoasidaisudoaiuasdasidaosiduaosiduaoisudoaiusdoiausoiduaosiduaoisudoaisudoiau",
    text: "Schoolasdasodiaposidaaosidaosidoasidaisudoaiuasdasidaosiduaosiduaoisudoaiusdoiausoiduaosiduaoisudoaisudoiau",
    total: 1,
    visible: 1,
    width: 410,
    height: 145,
    predefinedText: false,
  },
  {
    name: `Very long line with space`,
    prefix: "long-line-1-space",
    search:
      "School asdasodiaposidaaosidaosidoasidaisudoaiuasdasidaosiduaosiduaoisudoaiusdoiausoiduaosiduaoisudoaisudoiau",
    text: "School asdasodiaposidaaosidaosidoasidaisudoaiuasdasidaosiduaosiduaoisudoaiusdoiausoiduaosiduaoisudoaisudoiau",
    total: 1,
    visible: 1,
    width: 410,
    height: 145,
    predefinedText: false,
  },
  {
    name: `Very long line with break`,
    prefix: "long-line-1-break",
    search:
      "School\nasdasodiaposidaaosidaosidoasidaisudoaiuasdasidaosiduaosiduaoisudoaiusdoiausoiduaosiduaoisudoaisudoiau",
    text: "School\nasdasodiaposidaaosidaosidoasidaisudoaiuasdasidaosiduaosiduaoisudoaiusdoiausoiduaosiduaoisudoaisudoiau",
    total: 1,
    multiline: true,
    visible: 1,
    width: 410,
    height: 145,
    predefinedText: false,
  },
];

test("Has title", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/JetBrains test assessment/);
});

test.describe("Highlight textarea search", () => {
  testCase.forEach((currentCase) => {
    test(currentCase.name, async ({ page }) => {
      const search = page.locator(SELECTORS.search);
      const editor = page.locator(SELECTORS.editor);
      const container = page.locator(SELECTORS.container);
      const multilineSwitcher = page.locator(SELECTORS.multilineSwitcher);

      await editor.evaluate(
        (node, { innerCurrentCase }) => {
          node.style.width = `${innerCurrentCase.width}px`;
          node.style.height = `${innerCurrentCase.height}px`;
        },
        { innerCurrentCase: currentCase },
      );

      multilineSwitcher.evaluate((input, isMultilineRequired) => {
        const checkbox = input as HTMLInputElement;
        if (!checkbox.checked && isMultilineRequired) {
          checkbox.click();
        }
      }, currentCase.multiline);

      await editor.fill(currentCase.text);
      await search.fill(currentCase.search);

      await editor.evaluate(
        (node, { innerCurrentCase }) => {
          node.removeAttribute("spellcheck");
          node.scrollTo(
            0,
            innerCurrentCase.predefinedText ? 0 : node.scrollHeight,
          );
        },
        { innerCurrentCase: currentCase },
      );

      // todo sort out how to avoid using
      await wait(400);

      const { height } = await page.locator("body").boundingBox();

      const screenshot = await page.screenshot({
        clip: {
          ...DEFAULT_CLIP,
          width: 600,
          height: height + 10,
        },
      });

      expect(screenshot).toMatchSnapshot();

      const allFoundItems = await page.locator(SELECTORS.foundEntity);

      const elementsCount = await allFoundItems.count();
      const containerBox = await container.boundingBox();

      let visibleElementsCount = 0;

      for (let i = 0; i < (await allFoundItems.count()); i++) {
        const element = await allFoundItems.nth(i);

        if (checkIntersection(await element.boundingBox(), containerBox)) {
          visibleElementsCount++;
        }
      }

      await expect(elementsCount).toEqual(currentCase.total);
      await expect(visibleElementsCount).toEqual(currentCase.visible);
    });
  });
});
