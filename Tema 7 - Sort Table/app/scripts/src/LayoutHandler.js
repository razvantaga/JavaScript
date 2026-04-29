class LayoutHandler {
  constructor() {
    this.init();
    this.handleDOM();
    this.handleEvents();
  }

  /**
   * Declare global variables
   */
  init() {}

  /**
   * Handle DOM queries
   */
  handleDOM() {
    this.thItems = document.querySelectorAll("th");
    this.tBody = document.querySelector("tbody");
    this.trItems = Array.from(this.tBody.querySelectorAll("tr"));
  }

  /**
   * Listen for events
   */
  handleEvents() {
    let self = this;

    this.thItems.forEach((item) => {
      item.addEventListener("click", () => {
        console.log(item.dataset.index);
        self.trItems.sort((a, b) => {
          const aText = a.cells[item.dataset.index].textContent.trim();
          const bText = b.cells[item.dataset.index].textContent.trim();

          // Sort numerically if both values are numbers
          const aNum = parseFloat(aText);
          const bNum = parseFloat(bText);
          if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;

          // Otherwise sort alphabetically
          return aText.localeCompare(bText);
        });

        self.trItems.forEach((row) => self.tBody.appendChild(row));
      });
    });
  }
}
