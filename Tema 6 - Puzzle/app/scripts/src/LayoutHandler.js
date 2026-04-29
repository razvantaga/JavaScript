class LayoutHandler {
  constructor() {
    this.init();
    this.handleDOM();
    this.createGrid();
    this.createPieces();
    this.shufflePieces();
    this.handleEvents();
  }

  /**
   * Declare global variables
   */
  init() {
    this.selectedPiece = null;
    this.correctCount = 0;
    this.pieces = [];
  }

  /**
   * Handle DOM queries
   */
  handleDOM() {
    this.grid = document.getElementById("grid");
    this.piecesContainer = document.getElementById("pieces");
    this.submitBtn = document.getElementById("submitBtn");
    this.message = document.getElementById("message");
  }

  /**
   * Creează sloturile (grid 3x3)
   */
  createGrid() {
    this.grid.innerHTML = ""; // evită dublarea

    for (let i = 0; i < 9; i++) {
      const slot = document.createElement("div");
      slot.className = "col-4 p-1";

      const inner = document.createElement("div");
      inner.className = "slot";
      inner.dataset.position = i;

      inner.addEventListener("click", () => this.placePiece(inner));

      slot.appendChild(inner);
      this.grid.appendChild(slot);
    }
  }

  /**
   * Creează piesele
   */
  createPieces() {
    for (let i = 0; i < 9; i++) {
      const piece = document.createElement("div");
      piece.className = "piece";
      piece.dataset.correct = i;

      const x = (i % 3) * 100;
      const y = Math.floor(i / 3) * 100;

      piece.style.backgroundImage = "url('https://picsum.photos/300')";
      piece.style.backgroundPosition = `-${x}px -${y}px`;

      piece.addEventListener("click", () => {
        this.selectPiece(piece);
      });

      this.pieces.push(piece);
    }
  }

  /**
   * Amestecă piesele
   */
  shufflePieces() {
    // distruge slick dacă există
    if ($(this.piecesContainer).hasClass("slick-initialized")) {
      $(this.piecesContainer).slick("unslick");
    }

    this.piecesContainer.innerHTML = "";

    this.pieces.forEach((p) => {
      const wrapper = document.createElement("div");
      wrapper.appendChild(p);
      this.piecesContainer.appendChild(wrapper);
    });

    $(this.piecesContainer).slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      arrows: true,
      infinite: false,
      centerMode: true,
      centerPadding: "0px",
    });
  }

  /**
   * Selectare piesă
   */
  selectPiece(piece) {
    // reset highlight
    this.pieces.forEach((p) => p.classList.remove("border", "border-primary"));

    this.selectedPiece = piece;
    piece.classList.add("border", "border-primary");
  }

  /**
   * Plasare piesă
   */
  placePiece(slot) {
    if (!this.selectedPiece || slot.firstChild) return;

    // elimină piesa din array
    this.pieces = this.pieces.filter((p) => p !== this.selectedPiece);

    slot.appendChild(this.selectedPiece);

    if (this.selectedPiece.dataset.correct === slot.dataset.position) {
      this.selectedPiece.classList.add("correct");
      this.correctCount++;
    }

    this.selectedPiece.classList.remove("border", "border-primary");
    this.selectedPiece = null;

    // 🔥 reface slider-ul (se recentrează automat)
    this.shufflePieces();

    this.checkWin();
  }

  /**
   * Verificare final
   */
  checkWin() {
    if (this.correctCount === 9) {
      this.submitBtn.classList.remove("d-none");
    }
  }

  /**
   * Evenimente generale
   */
  handleEvents() {
    this.submitBtn.addEventListener("click", () => {
      this.grid.style.display = "none";
      this.piecesContainer.style.display = "none";
      this.submitBtn.style.display = "none";

      this.message.innerHTML = "<h3>Felicitări! Ai completat puzzle-ul 🎉</h3>";
    });
  }
}
