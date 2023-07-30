import { findAll } from "./findAll";
import { expect } from "@playwright/test";

test("Find all", () => {
  expect(findAll("qwqwe", "qwe")).toEqual([2]);
  expect(findAll("qwe", "qww")).toEqual([]);
  expect(findAll("qwe", "")).toEqual([]);
  expect(findAll("", "qwe")).toEqual([]);
  expect(findAll("", "")).toEqual([]);
});
