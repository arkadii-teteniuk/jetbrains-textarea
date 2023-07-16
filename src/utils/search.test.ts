import { searchSubstr } from "./search";
import {
  mockHighlightedText,
  mockHighlightedTextMultiline,
  mockText,
  mockTextMultiline,
  mockSearchTextValue,
} from "../mocks";

describe("Search", () => {
  test(`by "${mockSearchTextValue}"`, () => {
    expect(searchSubstr(mockText, mockSearchTextValue)).toEqual(
      mockHighlightedText,
    );
  });

  test(`by "${mockSearchTextValue}" multiline`, () => {
    expect(searchSubstr(mockTextMultiline, mockSearchTextValue)).toEqual(
      mockHighlightedTextMultiline,
    );
  });
});
