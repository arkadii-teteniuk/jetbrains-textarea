import { expect, test } from "@playwright/test";
import { loremIpsum } from "./mocks";
import { wait } from "../../src/utils/wait";
import { checkIntersection } from "../../src/utils/checkIntersection";

const selectors = {
  foundEntity: ".backdrop mark",
  search: "#search-field",
  editor: "textarea.editor",
  container: ".container",
};

test.beforeEach(async ({ page }) => {
  // await page.goto("http://localhost:5173/");
  await page.goto("https://arkadii-teteniuk.github.io/jetbrains-textarea/");
});

const DEFAULT_WIDTH = 410;
const DEFAULT_HEIGHT = 145;
const DEFAULT_CLIP = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  y: 0,
  x: 0,
};

function getScreenshotsPath(data: TestCase) {
  return `${data.prefix}-${data.total}-visible-${data.visible}`;
}

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
};

const testCase: TestCase[] = [
  {
    name: `Find elements (total: 3, visible: 3)`,
    prefix: "base",
    search: "book",
    text: loremIpsum.repeat(2) + "book book book",
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
      "book book book" + loremIpsum.repeat(2) + "book book book book book book",
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
    text: loremIpsum.repeat(2) + "book book book",
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
    text: "book book book" + loremIpsum + "book book book book book book",
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
    text: loremIpsum.repeat(2) + "book book book",
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
    text: "book book book" + loremIpsum + "book book book book book book",
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

  // {
  //   name: `Very long line with break`,
  //   prefix: "long-line-1-break",
  //   search:
  //     "School asdasodiaposidaaosidaosidoasidaisudoaiuasdasidaosiduaosiduaoisudoaiusdoiausoiduaosiduaoisudoaisudoiau",
  //   text: "School\nasdasodiaposidaaosidaosidoasidaisudoaiuasdasidaosiduaosiduaoisudoaiusdoiausoiduaosiduaoisudoaisudoiau",
  //   total: 1,
  //   visible: 1,
  //   width: 410,
  //   height: 145,
  //   predefinedText: false,
  // },
];

test("Has title", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/JetBrains test assessment/);
});

test.describe("Highlight textarea search", () => {
  testCase.forEach((currentCase) => {
    test(currentCase.name, async ({ page, browserName }) => {
      const search = page.locator(selectors.search);
      const editor = page.locator(selectors.editor);
      const container = page.locator(selectors.container);

      await editor.evaluate(
        (node, { innerCurrentCase }) => {
          node.style.width = `${innerCurrentCase.width}px`;
          node.style.height = `${innerCurrentCase.height}px`;
        },
        { innerCurrentCase: currentCase },
      );

      await editor.fill(currentCase.text);
      await search.fill(currentCase.search);

      await editor.evaluate(
        (node, { innerCurrentCase }) => {
          if (innerCurrentCase.predefinedText) {
            node.scrollTo(0, 0);
          } else {
            // it needs especially for Safari, which does not move carriage on .fill()
            // it works without this workaround in browser
            node.scrollTo(0, node.scrollHeight);
          }
        },
        { innerCurrentCase: currentCase },
      );

      await wait(400);

      const screenshotSubdir = getScreenshotsPath(currentCase);

      await page.screenshot({
        path: `./screenshots/${screenshotSubdir}/${browserName}-${Date.now()}.png`,
        clip: {
          ...DEFAULT_CLIP,
          width: currentCase.width,
          height: currentCase.height + (await search.boundingBox()).height,
        },
      });

      const allFoundItems = await page.locator(selectors.foundEntity);

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
