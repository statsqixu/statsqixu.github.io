(() => {
  const literatureSlide = document.getElementById("slide-10");
  let foundationSetupSlide = document.getElementById("slide-foundation-setup");
  if (!foundationSetupSlide && literatureSlide) {
    foundationSetupSlide = document.createElement("section");
    foundationSetupSlide.className = "slide content-slide";
    foundationSetupSlide.id = "slide-foundation-setup";
    foundationSetupSlide.innerHTML = `
      <div class="slide-title-zone">
        <h2>Problem Setup: Foundation Models</h2>
      </div>
      <hr class="separator-line">
      <div class="slide-content-zone foundation-setup-zone"></div>
      <span class="slide-number"></span>
    `;
    literatureSlide.before(foundationSetupSlide);
  }

  const exampleData = [
    {
      key: "survey",
      title: "Survey",
      headers: ["Demo.", "Income", "Health"],
      rows: [
        ["D", "I", null],
        ["D", null, "H"],
        ["D", "I", "H"]
      ]
    },
    {
      key: "longitudinal",
      title: "Longitudinal Study",
      headers: ["V1", "V2", "V3", "V4"],
      rows: [
        ["1", "2", null, "4"],
        ["1", null, "3", null],
        ["1", "2", "3", null]
      ]
    },
    {
      key: "ehr",
      title: "Electronic Health Records",
      headers: ["Labs", "Imaging", "Notes", "Meds"],
      rows: [
        ["Labs", "Img", "Notes", null],
        ["Labs", null, "Notes", "Meds"],
        [null, "Img", "Notes", "Meds"]
      ]
    },
    {
      key: "omics",
      title: "Multi-Omics",
      headers: ["RNA", "ATAC", "Protein"],
      rows: [
        ["RNA", "ATAC", "ADT"],
        ["RNA", null, "ADT"],
        [null, "ATAC", "ADT"]
      ]
    }
  ];

  function buildExample(example, index, withImputation) {
    const article = document.createElement("article");
    article.className = `pair-example pair-${example.key}`;
    if (!withImputation) {
      article.dataset.fragment = String(index);
    }

    const copy = document.createElement("div");
    copy.className = "pair-example-copy";
    const title = document.createElement("h3");
    title.textContent = example.title;
    const rule = document.createElement("span");
    rule.className = "pair-example-rule";
    copy.append(title, rule);

    const matrix = document.createElement("div");
    matrix.className = `pair-matrix pair-cols-${example.headers.length}`;
    matrix.setAttribute("aria-label", `${example.title} observation patterns`);

    example.headers.forEach((header) => {
      const head = document.createElement("div");
      head.className = "pair-matrix-head";
      head.textContent = header;
      matrix.append(head);
    });

    example.rows.flat().forEach((value) => {
      const cell = document.createElement("div");
      cell.className = `pair-matrix-cell${value === null ? " pair-missing" : ""}`;
      if (value !== null) {
        cell.textContent = value;
      } else if (withImputation) {
        const fill = document.createElement("span");
        fill.className = "pair-fm-fill";
        fill.dataset.fragment = "0";
        fill.textContent = "FM";
        cell.append(fill);
      }
      matrix.append(cell);
    });

    article.append(copy, matrix);
    return article;
  }

  const problemSlide = document.getElementById("slide-nonmonotone");
  const problemContent = problemSlide?.querySelector(".slide-content-zone");
  if (problemContent) {
    problemContent.className = "slide-content-zone pair-problem-content";
    problemContent.replaceChildren();

    const lead = document.createElement("p");
    lead.className = "pair-lead";
    lead.textContent = "Observed variables differ across units in non-nested patterns.";

    const examples = document.createElement("div");
    examples.className = "pair-examples";
    examples.setAttribute("aria-label", "Examples of nonmonotone missingness");
    exampleData.forEach((example, index) => {
      examples.append(buildExample(example, index, false));
    });

    const punchline = document.createElement("p");
    punchline.className = "pair-punchline";
    punchline.dataset.fragment = "4";
    punchline.textContent = "No single ordering describes which records are more complete.";

    problemContent.append(lead, examples, punchline);
  }

  const fmSlide = document.getElementById("slide-foundation-imputation");
  const fmTitle = fmSlide?.querySelector(".slide-title-zone h2");
  const fmContent = fmSlide?.querySelector(".slide-content-zone");
  if (fmTitle) {
    fmTitle.textContent = "Zero-shot Imputation with Foundation Models";
  }
  if (fmContent) {
    fmContent.className = "slide-content-zone pair-fm-content";
    fmContent.replaceChildren();

    const leadBlock = document.createElement("div");
    leadBlock.className = "pair-fm-lead-block";
    const lead = document.createElement("p");
    lead.className = "pair-lead";
    lead.textContent = "Foundation models now offer zero-shot imputation across data types.";
    const modelMap = document.createElement("div");
    modelMap.className = "pair-model-map";
    modelMap.setAttribute("aria-label", "Example foundation models");
    modelMap.innerHTML = [
      "<span><strong>Tabular:</strong> TabImpute · TabPFN · TabFM</span>",
      '<span class="pair-omics-model"><strong>Multi-Omics:</strong> CAPTAIN</span>'
    ].join("");
    leadBlock.append(lead, modelMap);

    const stage = document.createElement("div");
    stage.className = "pair-fm-stage";
    const examples = document.createElement("div");
    examples.className = "pair-examples";
    examples.setAttribute("aria-label", "Foundation-model imputations across data types");
    exampleData.forEach((example, index) => {
      examples.append(buildExample(example, index, true));
    });
    stage.append(examples);

    const warning = document.createElement("p");
    warning.className = "pair-warning";
    warning.dataset.fragment = "1";
    warning.textContent = "Foundation-model predictions can be inaccurate, biased, or unstable.";

    const question = document.createElement("p");
    question.className = "pair-question";
    question.dataset.fragment = "2";
    question.textContent = "How should we use foundation-model imputations for valid statistical analysis under nonmonotone missingness?";

    fmContent.append(leadBlock, stage, warning, question);
  }

  const estimandsSlide = document.getElementById("slide-estimands");
  const estimandsTitle = estimandsSlide?.querySelector(".slide-title-zone h2");
  const estimandsIntro = estimandsSlide?.querySelector(".targets-intro");
  const estimandsChallenge = estimandsSlide?.querySelector(".targets-challenge");
  if (estimandsTitle) {
    estimandsTitle.textContent = "Statistical Analysis of Interest";
  }
  estimandsIntro?.remove();
  if (estimandsChallenge) {
    estimandsChallenge.innerHTML =
      "How can we obtain accurate estimation and valid inference for $\\theta^*$, under nonmonotone missingness and pretrained foundation models?";
  }

  const setupSlide = document.getElementById("slide-8");
  const setupContent = setupSlide?.querySelector(".slide-content-zone");
  if (setupContent) {
    setupContent.className = "slide-content-zone setup6-zone";
    setupContent.replaceChildren();

    const layout = document.createElement("div");
    layout.className = "setup6-layout";

    const story = document.createElement("div");
    story.className = "setup6-story";
    story.innerHTML = `
      <section class="setup6-step setup6-step-full" data-fragment="0">
        <span class="setup6-kicker">Full data</span>
        <p class="setup6-formula">$Z=(X_1,\\ldots,X_p)\\sim\\mathcal P_Z$</p>
        <p class="setup6-note">$p$ variables or modalities.</p>
      </section>
      <section class="setup6-step setup6-step-patterns" data-fragment="1">
        <span class="setup6-kicker">Observed-pattern set</span>
        <p class="setup6-formula">$\\mathcal Q\\subseteq 2^{[p]}$</p>
        <p class="setup6-note setup6-qset">$\\mathcal Q=\\{\\{1,2,3\\},\\{1,2\\},\\{1,3\\},\\{1\\}\\}$</p>
      </section>
      <section class="setup6-step setup6-step-record" data-fragment="4">
        <span class="setup6-kicker">A record with pattern $r$</span>
        <p class="setup6-formula">$R\\in\\mathcal Q,\\quad Z_r=(X_j)_{j\\in r}$</p>
        <p class="setup6-note">Example: $Z_{\\{1,3\\}}=(X_1,Y)$.</p>
      </section>
      <section class="setup6-step setup6-step-size" data-fragment="6">
        <span class="setup6-kicker">Pattern frequency</span>
        <p class="setup6-formula">$n_r$ observations; $\\pi_r=\\mathbb P(R=r)$</p>
      </section>
    `;

    const figure = document.createElement("div");
    figure.className = "setup6-figure";

    const table = document.createElement("div");
    table.className = "setup6-table";

    const header = document.createElement("div");
    header.className = "setup6-header";
    header.dataset.fragment = "0";
    header.innerHTML = String.raw`
      <span data-fragment="5">Pattern</span>
      <span>$X_1$</span>
      <span>$X_2$</span>
      <span>$Y$</span>
      <span data-fragment="6">Size / Proportion</span>
    `;
    table.append(header);

    const patternRows = [
      {
        fragment: 0,
        key: "123",
        label: "R=\\{1,2,3\\}",
        observed: [true, true, true]
      },
      {
        fragment: 1,
        key: "12",
        label: "R=\\{1,2\\}",
        observed: [true, true, false]
      },
      {
        fragment: 2,
        key: "13",
        label: "R=\\{1,3\\}",
        observed: [true, false, true],
        focus: true
      },
      {
        fragment: 3,
        key: "1",
        label: "R=\\{1\\}",
        observed: [true, false, false]
      }
    ];

    patternRows.forEach((pattern) => {
      const row = document.createElement("div");
      row.className = "setup6-row";
      row.dataset.fragment = String(pattern.fragment);
      if (pattern.focus) {
        row.dataset.focus = "true";
      }

      const label = document.createElement("div");
      label.className = "setup6-row-label";
      label.dataset.fragment = "5";
      label.innerHTML = `$${pattern.label}$`;
      row.append(label);

      ["x1", "x2", "y"].forEach((variable, index) => {
        const cell = document.createElement("div");
        cell.className = pattern.observed[index]
          ? `setup6-cell setup6-cell-${variable}`
          : "setup6-cell setup6-cell-missing";
        row.append(cell);
      });

      const stats = document.createElement("div");
      stats.className = "setup6-stats";
      stats.dataset.fragment = "6";
      stats.innerHTML = `<span>$n_{${pattern.key}}$</span><span>$\\pi_{${pattern.key}}$</span>`;
      row.append(stats);
      table.append(row);
    });

    const focusNote = document.createElement("p");
    focusNote.className = "setup6-focus-note";
    focusNote.dataset.fragment = "5";
    focusNote.innerHTML =
      "For $R=\\{1,3\\}$, only the colored blocks form $Z_r$.";

    figure.append(table, focusNote);
    layout.append(story, figure);
    setupContent.append(layout);
  }

  const assumptionsSlide = document.getElementById("slide-9");
  const assumptionsContent = assumptionsSlide?.querySelector(
    ".slide-content-zone"
  );
  if (assumptionsContent) {
    assumptionsContent.className =
      "slide-content-zone setup6-zone setup7-zone";
    assumptionsContent.replaceChildren();

    const layout = document.createElement("div");
    layout.className = "setup6-layout";

    const story = document.createElement("div");
    story.className = "setup6-story";
    story.innerHTML = `
      <section class="setup6-step setup6-step-full" data-fragment="0">
        <span class="setup6-kicker">MCAR</span>
        <p class="setup6-formula">$R\\perp Z$</p>
        <p class="setup6-note">The observed pattern is independent of the full data.</p>
      </section>
      <section class="setup6-step setup6-step-patterns" data-fragment="1">
        <span class="setup6-kicker">Positivity</span>
        <p class="setup6-formula">$\\pi_{[p]}=\\mathbb P(R=[p])>0$</p>
        <p class="setup6-note">Complete cases occur with positive probability.</p>
      </section>
      <section class="setup6-step setup6-step-record" data-fragment="2">
        <span class="setup6-kicker">No nesting required</span>
        <p class="setup6-formula">Observed patterns are unrestricted.</p>
        <p class="setup6-note">They need not be nested.</p>
      </section>
    `;

    const figure = document.createElement("div");
    figure.className = "setup6-figure";

    const table = document.createElement("div");
    table.className = "setup6-table";

    const header = document.createElement("div");
    header.className = "setup6-header";
    header.dataset.fragment = "0";
    header.innerHTML = `
      <span>Pattern</span>
      <span>$X_1$</span>
      <span>$X_2$</span>
      <span>$Y$</span>
      <span data-fragment="1">Condition</span>
    `;
    table.append(header);

    const assumptionRows = [
      {
        key: "123",
        label: "R=\\{1,2,3\\}",
        observed: [true, true, true],
        role: "complete"
      },
      {
        key: "12",
        label: "R=\\{1,2\\}",
        observed: [true, true, false],
        role: "nonnested"
      },
      {
        key: "13",
        label: "R=\\{1,3\\}",
        observed: [true, false, true],
        role: "nonnested"
      },
      {
        key: "1",
        label: "R=\\{1\\}",
        observed: [true, false, false],
        role: "other"
      }
    ];

    assumptionRows.forEach((pattern) => {
      const row = document.createElement("div");
      row.className = "setup6-row setup7-row";
      row.dataset.fragment = "0";
      row.dataset.role = pattern.role;

      const label = document.createElement("div");
      label.className = "setup6-row-label";
      label.innerHTML = `$${pattern.label}$`;
      row.append(label);

      ["x1", "x2", "y"].forEach((variable, index) => {
        const cell = document.createElement("div");
        cell.className = pattern.observed[index]
          ? `setup6-cell setup6-cell-${variable}`
          : "setup6-cell setup6-cell-missing";
        row.append(cell);
      });

      const condition = document.createElement("div");
      if (pattern.role === "complete") {
        condition.className = "setup7-condition";
        condition.dataset.fragment = "1";
        condition.innerHTML = "$\\pi_{123}>0$";
      }
      row.append(condition);
      table.append(row);
    });

    const nonnestedNote = document.createElement("p");
    nonnestedNote.className = "setup7-nonnested-note";
    nonnestedNote.dataset.fragment = "2";
    nonnestedNote.innerHTML =
      "$\\{1,2\\}$ and $\\{1,3\\}$ are incomparable patterns.";

    figure.append(table, nonnestedNote);
    layout.append(story, figure);
    assumptionsContent.append(layout);
  }

  const foundationSetupContent = foundationSetupSlide?.querySelector(
    ".foundation-setup-zone"
  );
  if (foundationSetupContent) {
    foundationSetupContent.className =
      "slide-content-zone setup6-zone foundation8-zone";
    foundationSetupContent.replaceChildren();

    const patterns = [
      { key: "123", label: "R=\\{1,2,3\\}", observed: [true, true, true] },
      { key: "12", label: "R=\\{1,2\\}", observed: [true, true, false] },
      { key: "13", label: "R=\\{1,3\\}", observed: [true, false, true] },
      { key: "1", label: "R=\\{1\\}", observed: [true, false, false] }
    ];
    const imputations = [
      {
        fragment: 0,
        target: "y",
        label: "Y from X₁",
        notation: "f_{Y\\mid X_1}",
        paths: [
          { d: "M100,62 C190,24 410,24 500,62", arrow: true }
        ],
        eligible: ({ observed }) => observed[0]
      },
      {
        fragment: 1,
        target: "y",
        label: "Y from X₁, X₂",
        notation: "f_{Y\\mid X_1,X_2}",
        paths: [
          { d: "M100,62 C180,24 350,24 430,50" },
          { d: "M300,62 C345,36 390,38 430,50" },
          { d: "M430,50 C458,50 482,55 500,62", arrow: true }
        ],
        merge: { x: 430, y: 50 },
        eligible: ({ observed }) => observed[0] && observed[1]
      },
      {
        fragment: 2,
        target: "x2",
        label: "X₂ from X₁",
        notation: "f_{X_2\\mid X_1}",
        paths: [
          { d: "M100,62 C145,24 255,24 300,62", arrow: true }
        ],
        eligible: ({ observed }) => observed[0]
      },
      {
        fragment: 3,
        target: "x2",
        label: "X₂ from X₁, Y",
        notation: "f_{X_2\\mid X_1,Y}",
        paths: [
          { d: "M100,62 C165,24 285,24 350,48" },
          { d: "M500,62 C455,34 400,36 350,48" },
          { d: "M350,48 C330,50 314,55 300,62", arrow: true }
        ],
        merge: { x: 350, y: 48 },
        eligible: ({ observed }) => observed[0] && observed[2]
      }
    ];

    const layout = document.createElement("div");
    layout.className = "foundation8-clean-layout";

    const pretraining = document.createElement("p");
    pretraining.className = "foundation8-pretraining";
    pretraining.innerHTML =
      '<strong>Pretrained foundation model</strong><span>independent of the estimation sample $\\mathcal D_N$</span>';

    const stage = document.createElement("div");
    stage.className = "foundation8-clean-stage";

    const mappingPanel = document.createElement("aside");
    mappingPanel.className = "foundation8-map-panel";
    const mappingTitle = document.createElement("h3");
    mappingTitle.textContent = "Available FM Mappings";
    const mappingList = document.createElement("div");
    mappingList.className = "foundation8-map-list";
    imputations.forEach((item) => {
      const mapping = document.createElement("div");
      mapping.className = `foundation8-map-item foundation8-map-${item.fragment}`;
      mapping.dataset.fragment = String(item.fragment);
      mapping.innerHTML = `
        <span class="foundation8-map-description">${item.label}</span>
        <span class="foundation8-map-notation">$${item.notation}$</span>
      `;
      mappingList.append(mapping);
    });
    mappingPanel.append(mappingTitle, mappingList);

    const table = document.createElement("div");
    table.className = "foundation8-pattern-table";

    const header = document.createElement("div");
    header.className = "foundation8-pattern-header";
    header.innerHTML = `
      <span>Pattern</span>
      <span>$X_1$</span>
      <span>$X_2$</span>
      <span>$Y$</span>
    `;
    table.append(header);

    patterns.forEach((pattern) => {
      const row = document.createElement("div");
      row.className = "foundation8-pattern-row";
      row.dataset.pattern = pattern.key;

      const label = document.createElement("div");
      label.className = "setup6-row-label";
      label.innerHTML = `$${pattern.label}$`;
      row.append(label);

      ["x1", "x2", "y"].forEach((variable, index) => {
        const cell = document.createElement("div");
        cell.className = pattern.observed[index]
          ? `setup6-cell setup6-cell-${variable}`
          : "setup6-cell setup6-cell-missing";
        cell.dataset.variable = variable;
        row.append(cell);
      });

      const flowLayer = document.createElement("div");
      flowLayer.className = "foundation8-clean-flow-layer";
      const eligibleImputations = imputations.filter((item) =>
        item.eligible(pattern)
      );
      eligibleImputations.forEach((item) => {
        const markerId = `foundation8-arrow-${pattern.key}-${item.fragment}`;
        const flow = document.createElement("div");
        flow.className = `foundation8-clean-flow foundation8-flow-map-${item.fragment}`;
        flow.dataset.fragment = String(item.fragment);
        flow.innerHTML = `
          <span class="foundation8-clean-flow-formula">$${item.notation}$</span>
          <svg viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <marker id="${markerId}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor"></path>
              </marker>
            </defs>
            ${item.paths
              .map(
                (path) =>
                  `<path class="foundation8-arrow-path" d="${path.d}"${
                    path.arrow ? ` marker-end="url(#${markerId})"` : ""
                  }></path>`
              )
              .join("")}
            ${
              item.merge
                ? `<circle class="foundation8-flow-junction" cx="${item.merge.x}" cy="${item.merge.y}" r="5"></circle>`
                : ""
            }
          </svg>
        `;
        flowLayer.append(flow);
      });
      row.append(flowLayer);
      table.append(row);
    });

    stage.append(mappingPanel, table);
    layout.append(pretraining, stage);
    foundationSetupContent.append(layout);
  }

  const deckSlides = Array.from(document.querySelectorAll("#deck .slide"));
  deckSlides.forEach((slide, index) => {
    const number = slide.querySelector(".slide-number");
    if (number) {
      number.textContent = `${index + 1} / ${deckSlides.length}`;
    }
  });
})();
