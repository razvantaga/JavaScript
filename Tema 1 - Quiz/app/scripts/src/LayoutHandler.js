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
    this.questions = [
      {
        question: "Care este capitala României?",
        answers: [
          { text: "Cluj-Napoca", correct: false },
          { text: "București", correct: true },
          { text: "Iași", correct: false },
          { text: "Timișoara", correct: false },
        ],
      },
      {
        question: "Ce limbaj rulează în browser?",
        answers: [
          { text: "Python", correct: false },
          { text: "C++", correct: false },
          { text: "JavaScript", correct: true },
          { text: "Java", correct: false },
        ],
      },
      {
        question: "HTML este folosit pentru?",
        answers: [
          { text: "Stilizare", correct: false },
          { text: "Structura paginii", correct: true },
          { text: "Bază de date", correct: false },
          { text: "Server backend", correct: false },
        ],
      },
    ];

    this.score = 0;
    this.currQuestion = 0;
    this.blockQuesiton = false;
  }

  /**
   * Handle DOM queries
   */
  handleDOM() {
    this.quizWrapper = document.getElementById("quizWrapper");
    this.quizTitle = document.getElementById("quizTitle");
    this.answersDOM = [...document.querySelectorAll(".answer")];
    this.scoreDOM = document.getElementById("score");
    this.nextQuestion = document.getElementById("nextQuestion");
    this.finish = document.getElementById("finish");
    this.titleModalDOM = document.getElementById("modalTitle");
    this.modalScoreDOM = document.getElementById("modalScore");
  }

  /**
   * Listen for events
   */
  handleEvents() {
    this.displayQuestion(this.currQuestion);
    this.nextQuestion.addEventListener("click", () => this.displayQuestion());

    this.answersDOM.forEach((answerDOM) => {
      if (this.blockQuesiton === false) {
        answerDOM.addEventListener("click", () =>
          this.checkedAnswer(answerDOM),
        );
      }
    });

    this.finish.addEventListener("click", () => this.quizModal());
  }

  displayQuestion() {
    this.blockQuesiton = false;
    this.nextQuestion.classList.remove("active");

    if (this.currQuestion >= this.questions.length) {
      console.log("Quiz finished");
      return;
    }

    const current = this.questions[this.currQuestion];
    this.quizTitle.innerText = current.question;

    current.answers.forEach((answer, index) => {
      if (this.answersDOM[index]) {
        this.answersDOM[index].innerText = answer.text;
        this.answersDOM[index].classList.remove("correct", "wrong");

        this.answersDOM[index].dataset.correct = answer.correct;
      }
    });

    this.currQuestion++;
  }

  checkedAnswer(answer) {
    console.log(answer);

    if (this.blockQuesiton) return;
    this.blockQuesiton = true;

    if (this.currQuestion === this.questions.length) {
      this.finish.classList.add("active");
    } else {
      this.nextQuestion.classList.add("active");
    }

    const answerCorrect = answer.getAttribute("data-correct");
    console.log(answerCorrect);
    if (answerCorrect === "true") {
      this.score++;
      this.scoreDOM.innerText = `${this.score} / ${this.questions.length}`;
      answer.classList.add("correct");
    } else {
      answer.classList.add("wrong");
    }
  }

  quizModal() {
    this.modalScoreDOM.innerText = `${this.score} / ${this.questions.length}`;
    $("#quizModal").modal("show");
  }
}
