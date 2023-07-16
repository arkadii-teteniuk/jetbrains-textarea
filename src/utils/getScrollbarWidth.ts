/**
 * Returns width of scrollbar in px. That needs according to the fact that browser API does not provide function to do that.
 *
 * Different GUI and OS provides different sizes for that component:
 * 1. Windows 11 - `17px`;
 * 2. MacOS - `15px` with visible scrollbars, `0px` in case of hidden ones;
 * 3. Linux Ubuntu – `18px`;
 * 4. Other various widths.
 *
 * @param doc {Document} is a link to page document;
 * @returns {number} width of a scrollbar in px.
 */

export function getScrollbarWidth(doc = document) {
  const div = doc.createElement("div");
  div.style.overflowY = "scroll";
  div.style.visibility = "hidden";
  div.style.width = "50px";
  div.style.height = "50px";

  // without mounting the result will be a zero
  doc.body.append(div);
  const scrollWidth = div.offsetWidth - div.clientWidth;

  div.remove();
  return scrollWidth;
}
