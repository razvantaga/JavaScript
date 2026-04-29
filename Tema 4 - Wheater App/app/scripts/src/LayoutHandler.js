class LayoutHandler {
  constructor() {
    if (document.getElementById("weatherApp")) {
      this.init();
      this.handleDOM();
      this.handleEvents();
    }
  }

  /**
   * Declare global variables
   */
  init() {
    this.API_KEY = "efcbadd128d9ca8b4b30ed338ed68234";
  }

  /**
   * Handle DOM queries
   */
  handleDOM() {
    this.searchInput = document.querySelector(".form-control");
    this.searchBtn = document.querySelector(".btn");
  }

  /**
   * Listen for events
   */
  handleEvents() {
    let self = this;
    this.searchBtn.addEventListener("click", function () {
      self.fetchData(self.searchInput.value);
    });
  }

  async fetchData(value) {
    let self = this;
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${this.API_KEY}&units=metric`,
    )
      .then((res) => res.json())
      .then((data) => self.displayData(data))
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => {
        console.log("finally");
      });
  }

  displayData(data) {
    document.querySelector("h2").innerText = data.name;

    document.querySelector(".temp").innerText =
      Math.round(data.main.temp) + "°";

    document.querySelector(".humidity").innerText = data.main.humidity + "%";

    document.querySelector(".wind").innerText =
      (data.wind.speed * 3.6).toFixed(1) + " km/h";

    document.querySelector(".weather").innerText = data.weather[0].main;
  }
}
