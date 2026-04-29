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
    this.MODELS = [
      {
        id: "gtr",
        name: "GT-R",
        sub: "2.0L Turbo · 220hp",
        price: 28900,
        badge: null,
      },
      {
        id: "gtrs",
        name: "GT-R S",
        sub: "2.5L Turbo · 290hp",
        price: 35400,
        badge: "Popular",
      },
      {
        id: "gtrv",
        name: "GT-R V",
        sub: "3.5L V6 · 380hp",
        price: 48200,
        badge: null,
      },
      {
        id: "gtre",
        name: "GT-R e",
        sub: "Electric · 420hp",
        price: 54900,
        badge: "New",
      },
    ];

    this.COLORS = [
      {
        id: "white",
        name: "Arctic White",
        hex: "#E8E8E2",
        roof: "#C8C8C2",
        price: 0,
      },
      {
        id: "black",
        name: "Onyx Black",
        hex: "#1C1C1E",
        roof: "#111113",
        price: 600,
      },
      {
        id: "blue",
        name: "Cobalt Blue",
        hex: "#1e40af",
        roof: "#1e3a8a",
        price: 700,
      },
      {
        id: "red",
        name: "Apex Red",
        hex: "#b91c1c",
        roof: "#991b1b",
        price: 700,
      },
      {
        id: "green",
        name: "British Green",
        hex: "#14532d",
        roof: "#052e16",
        price: 750,
      },
      {
        id: "silver",
        name: "Mercury",
        hex: "#9CA3AF",
        roof: "#6B7280",
        price: 400,
      },
      {
        id: "gold",
        name: "Champagne",
        hex: "#a16207",
        roof: "#854d0e",
        price: 900,
      },
      {
        id: "orange",
        name: "Sunset",
        hex: "#c2410c",
        roof: "#9a3412",
        price: 800,
      },
    ];

    this.TRIMS = [
      {
        id: "sport",
        name: "Sport",
        desc: "Alcantara seats · Carbon accents",
        price: 0,
      },
      {
        id: "comfort",
        name: "Comfort",
        desc: "Nappa leather · Wood inlays",
        price: 1800,
      },
      {
        id: "luxury",
        name: "Luxury",
        desc: "Full leather · Ambient lighting",
        price: 3600,
      },
      {
        id: "race",
        name: "Race",
        desc: "Bucket seats · Roll cage prep",
        price: 2900,
      },
    ];

    this.OPTIONS = [
      {
        id: "sunroof",
        name: "Panoramic Sunroof",
        sub: "Full-length glass roof panel",
        price: 1400,
      },
      {
        id: "sport-rims",
        name: 'Sport Alloy Rims 20"',
        sub: "Forged aluminium, gloss black",
        price: 1100,
      },
      {
        id: "spoiler",
        name: "Rear Spoiler",
        sub: "Carbon fibre performance spoiler",
        price: 850,
      },
      {
        id: "audio",
        name: "Premium Audio System",
        sub: "1200W · 16-speaker Meridian",
        price: 1800,
      },
      {
        id: "heated-seats",
        name: "Heated & Ventilated Seats",
        sub: "Front & rear, 3-stage control",
        price: 950,
      },
      {
        id: "driver-assist",
        name: "Driver Assist Package",
        sub: "Adaptive cruise · Lane keep · ADAS",
        price: 2400,
      },
      {
        id: "tow",
        name: "Tow Package",
        sub: "2500kg rated · Electrics included",
        price: 680,
      },
      {
        id: "paint-protect",
        name: "Paint Protection Film",
        sub: "Full front-end PPF ceramic coat",
        price: 1950,
      },
    ];

    this.state = {
      model: this.MODELS[0],
      color: this.COLORS[0],
      trim: this.TRIMS[0],
      options: new Set(),
    };
  }

  /**
   * Handle DOM queries
   */
  handleDOM() {
    this.modelGrid = document.getElementById("model-grid");
    this.colorRow = document.getElementById("color-row");
    this.trimGrid = document.getElementById("trim-grid");
    this.optionsList = document.getElementById("options-list");
    this.summaryItems = document.getElementById("summary-items");
    this.cBody = document.getElementById("c-body");
    this.cRoof = document.getElementById("c-roof");
    this.SunRoof = document.getElementById("c-sunroof");
    this.rimStdL = document.getElementById("rim-std-l");
    this.rimStdR = document.getElementById("rim-std-r");
    this.rimSportL = document.getElementById("rim-sport-l");
    this.rimSportR = document.getElementById("rim-sport-r");
    this.stageModelName = document.getElementById("stage-model-name");
    this.stageModelSub = document.getElementById("stage-model-sub");
  }

  /**
   * Listen for events
   */
  handleEvents() {
    this.render();

    // MODELS CLICK (delegation)
    this.modelGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".model-card");
      if (!card) return;

      this.selectModel(card.dataset.id);
    });

    // COLORS CLICK
    this.colorRow.addEventListener("click", (e) => {
      const swatch = e.target.closest(".swatch-wrap");
      if (!swatch) return;

      this.selectColor(swatch.dataset.id);
    });

    // TRIM CLICK
    this.trimGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".trim-card");
      if (!card) return;

      this.selectTrim(card.dataset.id);
    });

    // OPTIONS CLICK
    this.optionsList.addEventListener("click", (e) => {
      const row = e.target.closest(".option-row");
      if (!row) return;

      this.toggleOption(row.dataset.id);
    });
  }

  render() {
    if (
      !this.state?.model ||
      !this.state?.color ||
      !this.state?.trim ||
      !this.state?.options
    )
      return;

    this.buildModels();
    this.buildColors();
    this.buildTrims();
    this.buildOptions();
    this.buildSummary();
    this.updateCarVisual();
  }

  // ─── Render helpers ──────────────────────────────────
  fmt(n) {
    return "€" + n.toLocaleString("de-DE");
  }

  calcTotal() {
    let t =
      this.state.model.price + this.state.color.price + this.state.trim.price;
    this.state.options.forEach((id) => {
      const o = this.OPTIONS.find((x) => x.id === id);
      if (o) t += o.price;
    });
    return t;
  }

  buildModels() {
    const current = this.state?.model;

    this.modelGrid.innerHTML = this.MODELS.map(
      (m) => `
    <div class="model-card ${current && m.id === current.id ? "active" : ""}"
         data-id="${m.id}">
      ${m.badge ? `<div class="model-badge">${m.badge}</div>` : ""}
      <div class="model-name">${m.name}</div>
      <div class="model-spec">${m.sub}</div>
      <div class="model-price">${this.fmt(m.price)}</div>
    </div>
  `,
    ).join("");
  }

  buildColors() {
    const current = this.state?.color;

    this.colorRow.innerHTML = this.COLORS.map(
      (c) => `
    <div class="swatch-wrap ${current && c.id === current.id ? "active" : ""}"
         data-id="${c.id}">

      <div class="swatch" style="background:${c.hex}"></div>
      <div class="swatch-label">${c.name.split(" ")[0]}</div>

    </div>
  `,
    ).join("");
  }

  buildTrims() {
    const current = this.state?.trim;

    this.trimGrid.innerHTML = this.TRIMS.map(
      (t) => `
    <div class="trim-card ${current && t.id === current.id ? "active" : ""}"
         data-id="${t.id}">

      <div class="trim-name">${t.name}</div>
      <div class="trim-desc">${t.desc}</div>

      <div class="trim-price">
        ${t.price === 0 ? "Included" : "+" + this.fmt(t.price)}
      </div>

    </div>
  `,
    ).join("");
  }

  buildOptions() {
    const selected = this.state?.options;

    this.optionsList.innerHTML = this.OPTIONS.map(
      (o) => `
    <div class="option-row ${selected?.has(o.id) ? "active" : ""}"
         data-id="${o.id}">

      <div class="option-info">
        <div class="opt-name">${o.name}</div>
        <div class="opt-sub">${o.sub}</div>
      </div>

      <div class="option-right">
        <div class="opt-price">+${this.fmt(o.price)}</div>
        <div class="toggle"></div>
      </div>

    </div>
  `,
    ).join("");
  }

  buildSummary() {
    let self = this;
    const items = [
      {
        label: "Model",
        val: this.state.model.name + " — " + this.fmt(this.state.model.price),
      },
      {
        label: "Color",
        val:
          this.state.color.name +
          (this.state.color.price
            ? " +" + this.fmt(this.state.color.price)
            : " (incl.)"),
      },
      {
        label: "Interior",
        val:
          this.state.trim.name +
          (this.state.trim.price
            ? " +" + this.fmt(this.state.trim.price)
            : " (incl.)"),
      },
    ];

    this.state.options.forEach((id) => {
      const o = self.OPTIONS.find((x) => x.id === id);
      if (o) items.push({ label: o.name, val: "+" + self.fmt(o.price) });
    });

    document.getElementById("summary-items").innerHTML = items
      .map(
        (i) => `
      <div class="summary-item">
        <span class="s-label">${i.label}</span>
        <span class="s-val">${i.val}</span>
      </div>
    `,
      )
      .join("");
    const total = this.calcTotal();
    document.getElementById("total-price").textContent = this.fmt(total);
    document.getElementById("hdr-price").textContent = this.fmt(total);
    document.getElementById("hdr-model").textContent =
      this.state.model.name + " · " + this.state.trim.name;
  }

  updateCarVisual() {
    document
      .getElementById("c-body")
      .setAttribute("fill", this.state.color.hex);
    document
      .getElementById("c-roof")
      .setAttribute("fill", this.state.color.roof);
    document.getElementById("c-sunroof").style.display = this.state.options.has(
      "sunroof",
    )
      ? ""
      : "none";
    const showSpoiler = this.state.options.has("spoiler");
    ["c-spoiler", "c-spoiler-2", "c-spoiler-3"].forEach((id) => {
      document.getElementById(id).style.display = showSpoiler ? "" : "none";
    });
    const showSport = this.state.options.has("sport-rims");
    document.getElementById("rim-std-l").style.display = showSport
      ? "none"
      : "";
    document.getElementById("rim-std-r").style.display = showSport
      ? "none"
      : "";
    document.getElementById("rim-sport-l").style.display = showSport
      ? ""
      : "none";
    document.getElementById("rim-sport-r").style.display = showSport
      ? ""
      : "none";
    document.getElementById("stage-model-name").textContent =
      this.state.model.name;
    document.getElementById("stage-model-sub").textContent =
      this.state.model.sub;
  }

  // ─── Actions ──────────────────────────────────────────
  selectModel(id) {
    this.state.model = this.MODELS.find((m) => m.id === id);
    this.render();
  }

  selectColor(id) {
    this.state.color = this.COLORS.find((c) => c.id === id);
    this.render();
  }

  selectTrim(id) {
    this.state.trim = this.TRIMS.find((t) => t.id === id);
    this.render();
  }

  toggleOption(id) {
    if (this.state.options.has(id)) this.state.options.delete(id);
    else this.state.options.add(id);
    this.render();
  }
}

// ─── Init ─────────────────────────────────────────────
