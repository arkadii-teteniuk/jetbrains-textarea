import { Box, checkIntersection } from "./checkIntersection";

type IntersectionTest = {
  name: string;
  box1: Box;
  box2: Box;
  expect: boolean;
};

const testCases: IntersectionTest[] = [
  {
    name: "#1",
    box1: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    box2: {
      x: 1,
      y: 1,
      width: 2,
      height: 2,
    },
    expect: false,
  },
  {
    name: "#2",
    box1: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    box2: {
      x: 99,
      y: 99,
      width: 2,
      height: 2,
    },
    expect: true,
  },
  {
    name: "#3",
    box1: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    box2: {
      x: 100,
      y: 100,
      width: 1,
      height: 1,
    },
    expect: false,
  },
  {
    name: "#4",
    box1: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    box2: {
      x: 150,
      y: 150,
      width: 100,
      height: 100,
    },
    expect: false,
  },
];

describe("Intersection", () => {
  testCases.forEach((currentCase) => {
    test(currentCase.name, () => {
      expect(checkIntersection(currentCase.box1, currentCase.box2)).toEqual(
        currentCase.expect,
      );
    });
  });
});
