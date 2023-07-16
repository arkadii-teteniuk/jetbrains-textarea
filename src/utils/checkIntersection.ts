export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Returns true in case if rect1 and rect2 have intersections.
 * @param rect1 {Box}
 * @param rect2 {Box}
 * @returns {boolean}
 */
export function checkIntersection(rect1: Box, rect2: Box): boolean {
  const left1 = rect1.x;
  const top1 = rect1.y;
  const right1 = rect1.x + rect1.width;
  const bottom1 = rect1.y + rect1.height;

  const left2 = rect2.x;
  const top2 = rect2.y;
  const right2 = rect2.x + rect2.width;
  const bottom2 = rect2.y + rect2.height;

  return left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2;
}
