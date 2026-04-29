class LayoutHandler {
  constructor() {
    if ($("#calculator")) {
      this.init();
      this.handleDOM();
      this.handleEvents();
    }
  }

  /**
   * Declare global variables
   */
  init() {
    this.expression = "";
    this.isOperator = false;
    this.justEvaluate = false;
  }

  /**
   * Handle DOM queries
   */
  handleDOM() {
    this.btnNumbers = document.querySelectorAll(".btn-light");
    this.btnOperations = document.querySelectorAll(".btn-warning");
    this.evaluateExpression = document.querySelector(".btn-success");
    this.clearInput = document.querySelector(".btn-outline-danger");
    this.evaluateInput = document.getElementById("evaluateInput");
  }

  /**
   * Listen for events
   */
  handleEvents() {
    let self = this;

    const addNumber = (val) => {
      if (this.justEvaluate) self.expression = "";

      self.expression += val;
      self.evaluateInput.value = self.expression;
      self.isOperator = false;
    };

    const addOperator = (val) => {
      self.justEvaluate = false;
      if (self.expression !== "") {
        if (self.isOperator === false) {
          self.expression += val;
          self.evaluateInput.value = self.expression;
        } else {
          self.expression = self.expression.slice(0, -1) + val;
          self.evaluateInput.value = self.expression;
        }
      }
      self.isOperator = true;
    };

    document.addEventListener("keyup", (e) => {
      if (/^\d$/.test(e.key)) {
        addNumber(e.key);
      } else if (["+", "-", "*", "/"].includes(e.key)) {
        addOperator(e.key);
      }
    });

    this.btnNumbers.forEach((btn) => {
      btn.addEventListener("click", function () {
        addNumber(btn.value);
      });
    });

    this.btnOperations.forEach((btn) => {
      btn.addEventListener("click", function () {
        addOperator(btn.value);
      });
    });

    this.clearInput.addEventListener("click", function () {
      self.expression = "";
      self.evaluateInput.value = self.expression;
    });

    this.evaluateExpression.addEventListener("click", function () {
      if (self.expression !== "") {
        self.expression = eval(self.expression);
        self.evaluateInput.value = Number(self.expression).toFixed(2);
        self.justEvaluate = true;
      }
    });
  }
}
