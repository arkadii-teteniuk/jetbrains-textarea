/**
 * Returns the width of the scrollbar in px. The function is needed as the browser API does not provide such functionality.
 *
 * Different GUIs and operating systems provide different sizes for this component:
 * 1. Windows 11 - `17px`;
 * 2. MacOS - `15px` for visible scrollbars, `0px` for hidden ones;
 * 3. Linux Ubuntu – `18px`;
 * 4. Other various widths.
 **/

export function getScrollbarWidth(doc: Document = document): number {
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
