class LayoutHandler {
  constructor() {
    this.init();
    this.handleDOM();
    this.handleEvents();
  }

  init() {
    this.cardLimitPerPage = 9;
    this.cardSkipPerPage = 0;
    this.currentPage = 1;
    this.totalProducts = 0;
    this.searchQuery = "";
    this.filterQuery = "";
    this.URL = "";
  }

  handleDOM() {
    this.container = document.getElementById("menu");
    this.paginationContainer = document.getElementById("pagination");
    this.searchBtn = document.getElementById("searchBtn");
    this.searchValue = document.getElementById("searchValue");
    this.filtersBtn = document.querySelectorAll(".filtersBtn");
  }

  handleEvents() {
    // initial load
    this.loadPage(this.currentPage);

    // pagination (event delegation)
    this.paginationContainer.addEventListener("click", (e) => {
      e.preventDefault();

      const page = e.target.dataset.page;
      const isPrev = e.target.id === "btn_prev";
      const isNext = e.target.id === "btn_next";

      const totalPages = Math.ceil(this.totalProducts / this.cardLimitPerPage);

      if (page) {
        this.currentPage = parseInt(page);
      }

      if (isPrev && this.currentPage > 1) {
        this.currentPage--;
      }

      if (isNext && this.currentPage < totalPages) {
        this.currentPage++;
      }

      this.loadPage(this.currentPage);
    });

    // search
    this.searchBtn.addEventListener("click", (e) => {
      e.preventDefault();

      this.searchQuery = this.searchValue.value.trim();
      this.currentPage = 1;

      this.loadPage(this.currentPage);
    });

    this.filtersBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.filterQuery = btn.value;
        this.currentPage = 1;
        this.loadPage(this.currentPage);
      });
    });
  }

  async loadPage(pageNumber) {
    this.cardSkipPerPage = (pageNumber - 1) * this.cardLimitPerPage;

    await this.fetchData();
  }

  fetchData() {
    this.container.innerHTML = "";

    if (this.searchQuery !== "") {
      this.URL = `https://dummyjson.com/products/search?q=${this.searchQuery}&limit=${this.cardLimitPerPage}&skip=${this.cardSkipPerPage}`;
    } else if (this.filterQuery !== "") {
      this.URL = `https://dummyjson.com/products/category/${this.filterQuery}?limit=${this.cardLimitPerPage}&skip=${this.cardSkipPerPage}`;
    } else {
      this.URL = `https://dummyjson.com/products?limit=${this.cardLimitPerPage}&skip=${this.cardSkipPerPage}`;
    }

    fetch(this.URL)
      .then((res) => res.json())
      .then((data) => {
        this.totalProducts = data.total;

        this.renderPagination();
        this.container.innerHTML = "";

        data.products.forEach((item) => {
          this.container.innerHTML += `
            <div class="col-12 col-md-4">
              <div class="d-flex align-items-center bg-secondary bg-opacity-25 rounded-4 p-3 shadow-sm">

                <img src="${item.thumbnail}"
                     class="rounded-4 shadow-sm me-3"
                     width="90"
                     height="90"
                     style="object-fit: cover;">

                <div class="flex-grow-1">

                  <div class="d-flex justify-content-between">
                    <h5 class="fw-bold mb-1 text-light" style="min-height: 60px;">
                      ${item.title}
                    </h5>
                    <span class="badge bg-warning text-dark align-self-start">$${item.price}</span>
                  </div>

                  <p class="text-secondary small mb-2" style="min-height: 80px;">
                    ${item.description}
                  </p>

                  <span class="badge bg-info">${item.category}</span>

                </div>

              </div>
            </div>
          `;
        });
      });
  }

  renderPagination() {
    const totalPages = Math.ceil(this.totalProducts / this.cardLimitPerPage);
    const current = this.currentPage;

    this.paginationContainer.innerHTML = "";

    const createPage = (page) => `
      <li class="page-item ${current === page ? "active" : ""}">
        <a class="page-link ${
          current === page
            ? "bg-warning text-dark border-0"
            : "bg-dark text-light border-secondary"
        }" href="#" data-page="${page}">
          ${page}
        </a>
      </li>
    `;

    // PREV
    this.paginationContainer.innerHTML += `
      <li class="page-item ${current === 1 ? "disabled" : ""}">
        <a class="page-link bg-dark text-light border-secondary" href="#" id="btn_prev">Prev</a>
      </li>
    `;

    // FIRST
    this.paginationContainer.innerHTML += createPage(1);

    // LEFT DOTS
    if (current > 3) {
      this.paginationContainer.innerHTML += `
        <li class="page-item disabled">
          <span class="page-link bg-dark text-light border-secondary">...</span>
        </li>
      `;
    }

    // MIDDLE
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(totalPages - 1, current + 1);
      i++
    ) {
      this.paginationContainer.innerHTML += createPage(i);
    }

    // RIGHT DOTS
    if (current < totalPages - 2) {
      this.paginationContainer.innerHTML += `
        <li class="page-item disabled">
          <span class="page-link bg-dark text-light border-secondary">...</span>
        </li>
      `;
    }

    // LAST
    if (totalPages > 1) {
      this.paginationContainer.innerHTML += createPage(totalPages);
    }

    // NEXT
    this.paginationContainer.innerHTML += `
      <li class="page-item ${current === totalPages ? "disabled" : ""}">
        <a class="page-link bg-dark text-light border-secondary" href="#" id="btn_next">Next</a>
      </li>
    `;
  }
}
