export function getScrollbarWidth(doc = document) {
  const div = doc.createElement("div");
  div.style.overflowY = "scroll";
  div.style.width = "50px";
  div.style.height = "50px";

  // must put it in the document, otherwise sizes will be 0
  doc.body.append(div);
  const scrollWidth = div.offsetWidth - div.clientWidth;

  div.remove();
  return scrollWidth;
}
