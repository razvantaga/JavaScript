class LayoutHandler {
  constructor() {
    if (document.getElementById("toDoList")) {
      this.init();
      this.handleDOM();
      this.handleEvents();
    }
  }

  /**
   * Declare global variables
   */
  init() {
    this.tasks = [];
  }

  /**
   * Handle DOM queries
   */
  handleDOM() {
    this.addTaskBtn = document.querySelector(".btn-primary");
    this.addTaskInput = document.getElementById("addTaskInput");
    this.totalTaskContainer = document.querySelector(".badge");
    this.tasksContainer = document.querySelector(".list-group");
  }

  /**
   * Listen for events
   */
  handleEvents() {
    // Initial render
    this.renderTasks();

    // ADD TASK
    this.addTaskBtn.addEventListener("click", () => {
      const value = this.addTaskInput.value.trim();

      if (value !== "") {
        const newTask = {
          id: Date.now(),
          name: value,
        };

        this.tasks.push(newTask);
        this.addTaskInput.value = "";

        this.renderTasks();
      }
    });

    // EVENT DELEGATION (edit / delete / save)
    this.tasksContainer.addEventListener("click", (e) => {
      e.preventDefault();

      const editBtn = e.target.closest(".btn-outline-warning");
      const deleteBtn = e.target.closest(".btn-outline-danger");
      const saveBtn = e.target.closest(".saveBtn");

      // EDIT MODE
      if (editBtn) {
        const li = editBtn.closest(".list-group-item");
        li.classList.add("editMode");
      }

      // SAVE EDIT
      if (saveBtn) {
        const li = saveBtn.closest(".list-group-item");
        const id = parseInt(
          li.querySelector(".btn-outline-warning").dataset.id,
        );

        const input = li.querySelector(".editTaskInput");
        const task = this.tasks.find((t) => t.id === id);
        if (task) {
          task.name = input.value.trim();
        }

        this.renderTasks();
      }

      // DELETE
      if (deleteBtn) {
        const id = parseInt(deleteBtn.dataset.id);
        this.tasks = this.tasks.filter((t) => t.id !== id);

        this.renderTasks();
      }
    });
  }

  /**
   * Render tasks
   */
  renderTasks() {
    this.tasksContainer.innerHTML = "";

    this.tasks.forEach((task) => {
      const templateItem = `
        <li class="list-group-item d-flex flex-column bg-transparent text-light border-secondary">

          <div class="d-flex justify-content-between align-items-center viewMode">
            <span>${task.name}</span>
            <div class="btn-group btn-group-sm">
              <a href="#" data-id="${task.id}" class="btn btn-outline-warning">Edit</a>
              <a href="#" data-id="${task.id}" class="btn btn-outline-danger">Delete</a>
            </div>
          </div>

          <div class="input-group mt-3 editBox">
            <input type="text" class="form-control form-control-lg editTaskInput" value="${task.name}">
            <button class="btn btn-primary px-4 saveBtn">Save</button>
          </div>

        </li>
      `;

      this.tasksContainer.insertAdjacentHTML("beforeend", templateItem);
    });

    // Update counter
    this.totalTaskContainer.innerText = this.tasks.length;
  }
}
