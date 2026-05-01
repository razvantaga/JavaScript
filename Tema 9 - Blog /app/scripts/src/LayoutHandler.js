class LayoutHandler {
  constructor() {
    this.init();
    this.handleDOM();
    this.handleEvents();
  }

  /**
   * Declare global variables
   */
  init() {
    this.usersAPI = fetch("https://dummyjson.com/users?limit=210").then((res) =>
      res.json(),
    );

    this.usersMap = {};
    this.tags = new Set();
    this.currentTag = "";
    this.currentSearch = "";

    this.limit = 9;
    this.skip = 0;
    this.hasMore = true;
  }
  /**
   * Handle DOM queries
   */
  handleDOM() {
    this.blogsContainer = document.getElementById("blogsContainer");
    this.tagsContainer = document.getElementById("tagsContainer");
    this.searchBlogForm = document.getElementById("searchBlogForm");
    this.searchBtn = document.getElementById("searchBtn");
    this.searchInput = document.getElementById("searchInput");
    this.blogModal = document.getElementById("blogModal");
    this.blogTitle = this.blogModal.querySelector("#modalTitle");
    this.blogBody = this.blogModal.querySelector("#modalBody");
    this.modalAuthor = this.blogModal.querySelector("#modalAuthor");
    this.modalReadTime = this.blogModal.querySelector("#modalReadTime");
    this.loadMoreBtn = document.getElementById("loadMoreBtn");
  }

  /**
   * Listen for events
   */
  handleEvents() {
    let self = this;
    this.drawBlogList("", this.limit, this.skip);

    this.tagsContainer.addEventListener("click", (e) => {
      const tagFilter = e.target.closest(".tag-filter");
      if (!tagFilter) {
        return;
      } else {
        this.tagsContainer
          .querySelectorAll(".tag-filter")
          .forEach((el) => el.classList.remove("active"));

        tagFilter.classList.add("active");
        this.drawBlogList(tagFilter.dataset.tag);
      }
    });

    this.blogsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".read-more");
      if (!btn) {
        return;
      } else {
        e.preventDefault();
        this.displayBlogDetails(btn.dataset.id, Number(btn.dataset.userid));
      }
    });

    this.loadMoreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // self.skip += self.limit;
      self.limit += 3;
      this.drawBlogList("", this.limit, this.skip);
    });

    this.searchBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const query = this.searchInput.value.trim();

      // reset state
      this.skip = 0;
      this.limit = 9;
      this.currentTag = "";
      this.currentSearch = query;

      if (!query) {
        this.drawBlogList();
        return;
      }

      this.drawBlogList("", this.limit, this.skip, false, query);
    });
  }

  drawBlogList(
    tagFilter = "",
    limit = this.limit,
    skip = this.skip,
    append = false,
    search = this.currentSearch,
  ) {
    let blogsAPI;

    if (tagFilter) {
      blogsAPI = fetch(
        `https://dummyjson.com/posts/tag/${tagFilter}?limit=${limit}&skip=${skip}`,
      ).then((res) => res.json());
    } else if (search) {
      blogsAPI = fetch(
        `https://dummyjson.com/posts/search?q=${search}&limit=${limit}&skip=${skip}`,
      ).then((res) => res.json());
    } else {
      blogsAPI = fetch(
        `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`,
      ).then((res) => res.json());
    }

    Promise.all([blogsAPI, this.usersAPI]).then(([postsData, usersData]) => {
      usersData.users.forEach((user) => {
        this.usersMap[user.id] = user;
      });

      const html = postsData.posts
        .map((post) => {
          const user = this.usersMap[post.userId] ?? {
            firstName: "Unknown",
            lastName: "Author",
          };

          return `<div class="d-flex align-items-start flex-column col-12 col-md-6 col-xl-4 py-4 "> <div class="card-thumb"></div> <div> <span> ${post.tags?.[0] || "General"}</span> <h3><a href="#" data-id="${post.id}">${post.title}</a></h3> <p> ${post.body.substring(0, 100)}... </p> </div> <div class="d-flex align-items-center justify-content-between gap-3 w-100"> <div class="author-row d-flex align-items-center g-5 gap-3"> <span class="author-avatar" style="background:linear-gradient(135deg,#4f7eb3,#2a4f7c)">M</span> <div> <p>${user.firstName} ${user.lastName}</p> <p>${Math.floor(Math.random() * 10) + 3} min</p> </div> </div> <a href="#" class="read-more" data-id=${post.id} data-userid=${post.userId}>Read</a> </div> </div> `;
        })
        .join("");

      if (append) {
        this.blogsContainer.insertAdjacentHTML("beforeend", html);
      } else {
        this.blogsContainer.innerHTML = html;
      }

      // tags doar prima dată
      if (!this.tags.size) {
        postsData.posts.forEach((post) => {
          post.tags.forEach((tag) => this.tags.add(tag));
        });

        this.tagsContainer.innerHTML = [...this.tags]
          .map(
            (tag) => `
          <a href="#" class="tag-filter me-2" data-tag="${tag}">
            ${tag}
          </a>
        `,
          )
          .join("");
      }
    });
  }

  displayBlogDetails(postId, userId) {
    fetch(`https://dummyjson.com/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        this.blogTitle.textContent = data.title;
        this.blogBody.textContent = data.body;

        const user = this.usersMap[userId];

        if (user) {
          this.modalAuthor.textContent = `${user.firstName} ${user.lastName}`;
        } else {
          fetch(`https://dummyjson.com/users/${userId}`)
            .then((res) => res.json())
            .then((userData) => {
              this.modalAuthor.textContent = `${userData.firstName} ${userData.lastName}`;
            });
        }

        new bootstrap.Modal(this.blogModal).show();
      });
  }
}
