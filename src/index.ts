import { initSearch } from "./initSearch";

const initialText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris fringilla finibus elit, at fermentum magna tincidunt at. Vivamus blandit aliquam feugiat. In et dignissim sem, nec sagittis neque. Aenean euismod sem id ex bibendum lobortis. Aenean vel mattis mauris. In viverra purus in sagittis tempus. Suspendisse sagittis blandit enim ac pharetra. Vestibulum et bibendum nulla, vel commodo sem. Vivamus purus odio, posuere vitae bibendum id, convallis quis diam. Nullam nec eros vitae ligula convallis gravida quis at neque. Duis sagittis ullamcorper est, ac varius leo.\n\n" +
  "Nam aliquam suscipit porta. Nulla sed justo a tellus lacinia gravida non sit amet ligula. Nullam ullamcorper nisl ac lobortis placerat. Aliquam ac vehicula elit. Cras et vehicula lacus, vitae congue nulla. Donec sollicitudin et lectus id sodales. Donec commodo nibh ipsum, et volutpat massa feugiat id. Nam tempus nunc vitae massa facilisis pellentesque. Phasellus ac tincidunt dui. Mauris scelerisque metus vel enim semper pretium nec pretium diam. Integer vel imperdiet tortor, a maximus nisl. Aliquam nec dictum dolor. Phasellus vulputate elit a nisi mollis, sed tristique massa molestie.\n\n" +
  "Pellentesque ipsum urna, suscipit nec porta vel, tincidunt dictum orci. Aenean ornare ligula semper turpis facilisis, semper pulvinar velit pulvinar. Vestibulum id dolor ut tortor dictum porttitor. Vivamus id mauris ut nunc laoreet feugiat. Nunc vel rutrum nibh, vel gravida elit. Donec dignissim dolor vitae viverra commodo. Sed et eros a metus hendrerit ornare et at nisi. Vivamus porta, nisl eget rhoncus bibendum, justo massa posuere arcu, id cursus augue ipsum nec nulla. Suspendisse pulvinar ex ac est rutrum, non blandit justo feugiat.\n\n" +
  "Aenean orci enim, imperdiet eu porttitor ut, lacinia a purus. Vestibulum elementum vel arcu id tempor. Sed quis dignissim massa, eu dignissim erat. Maecenas malesuada est lobortis nulla feugiat, ullamcorper volutpat elit viverra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque aliquam feugiat ornare. Praesent ultrices finibus mollis. Nulla non lectus ac sapien euismod fermentum. Etiam vestibulum laoreet quam nec sagittis.\n\n" +
  "Donec nec elit sit amet leo lacinia tristique vitae fermentum tellus. Nullam vel vulputate diam. Pellentesque elementum vel purus eu ultricies. Vestibulum volutpat bibendum dapibus. Duis finibus lobortis metus, ac aliquet magna vulputate finibus. Fusce quam nulla, euismod vitae tempus ut, dignissim vitae risus. Vivamus fringilla mauris non ligula lobortis efficitur. Nunc finibus dui et mattis sollicitudin. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean non rhoncus eros.";

const initialSearch = "ipsum";

window.addEventListener("load", () => {
  const editor: HTMLTextAreaElement | null = document.querySelector(".editor");
  const search: HTMLInputElement | null =
    document.querySelector("#search-field");

  initSearch(editor, search);

  (editor as HTMLTextAreaElement).value = initialText.repeat(99);
  (search as HTMLInputElement).value = initialSearch;

  // programmatically call search input value change
  search?.dispatchEvent(new Event("input"));
});
