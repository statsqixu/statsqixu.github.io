(() => {
  const insertionPoint = document.getElementById("slide-10");
  if (!insertionPoint) return;

  const patterns = [
    { key: "123", label: "\\{1,2,3\\}", observed: [true, true, true] },
    { key: "12", label: "\\{1,2\\}", observed: [true, true, false] },
    { key: "13", label: "\\{1,3\\}", observed: [true, false, true] },
    { key: "1", label: "\\{1\\}", observed: [true, false, false] }
  ];

  const action = (step, label, tone, cells) => ({ step, label, tone, cells });

  const specs = [
    {
      id: "slide-method-cc-mean",
      method: "naive",
      title: "Naive Estimator",
      targetName: "Outcome Mean",
      target: "$\\theta^*=\\mathbb E(Y)$",
      principle: "Average the observed outcomes.",
      actions: {
        123: [action(0, "1", "observed", ["y"])],
        13: [action(0, "1", "observed", ["y"])]
      },
      steps: [
        {
          tone: "observed",
          label: "Mean of the highlighted $Y$ values",
          formula:
            "$\\widehat\\theta_{\\mathrm{naive}}=\\frac{1}{N}\\sum_{i=1}^{N}\\frac{\\mathbb I\\!\\left(R_i\\in\\{\\{1,2,3\\},\\{1,3\\}\\}\\right)}{\\pi_{123}+\\pi_{13}}Y_i$"
        }
      ],
      final: "No FM imputation.",
      citation: ""
    },
    {
      id: "slide-method-cc-regression",
      method: "naive",
      title: "Naive Estimator",
      targetName: "Linear Regression",
      target:
        "$\\theta^*=\\arg\\min_{\\theta}\\,\\mathbb E(Y-X^\\top\\theta)^2$",
      principle: "Fit least squares using rows where $X_1$, $X_2$, and $Y$ are all observed.",
      actions: {
        123: [action(0, "1", "regression", ["x1", "x2", "y"])]
      },
      steps: [
        {
          tone: "regression",
          label: "Least squares on the highlighted complete rows",
          formula:
            "$\\widehat\\theta_{\\mathrm{naive}}=\\arg\\min_{\\theta}\\sum_{i:R_i=\\{1,2,3\\}}(Y_i-X_i^\\top\\theta)^2$"
        }
      ],
      final: "No FM imputation.",
      citation: ""
    },
    {
      id: "slide-method-ppi-mean",
      method: "ppi",
      title: "Prediction-Powered Inference (PPI)",
      targetName: "Outcome Mean",
      target: "$\\theta^*=\\mathbb E(Y)$",
      principle:
        "Add predictions where $Y$ is missing; subtract the same predictions where $Y$ is observed.",
      actions: {
        123: [
          action(0, "1", "observed", ["y"]),
          action(1, "2 · $-\\widehat Y_1$", "map-0", ["y"])
        ],
        12: [action(1, "2 · $+\\widehat Y_1$", "map-0", ["y"])],
        13: [
          action(0, "1", "observed", ["y"]),
          action(1, "2 · $-\\widehat Y_1$", "map-0", ["y"])
        ],
        1: [action(1, "2 · $+\\widehat Y_1$", "map-0", ["y"])]
      },
      steps: [
        {
          tone: "observed",
          label: "Start with the observed mean",
          formula: "$\\widehat\\theta_{\\mathrm{PPI}}=\\widehat\\theta_{\\mathrm{naive}}$"
        },
        {
          tone: "map-0",
          label: "Debias with the FM imputation",
          formula:
            "$\\displaystyle\\begin{aligned}&+\\frac{\\alpha_1}{N}\\sum_{i=1}^{N}\\frac{\\mathbb I\\!\\left(R_i\\in\\{\\{1,2\\},\\{1\\}\\}\\right)}{\\pi_{12}+\\pi_1}f_{Y\\mid X_1}(X_{i1})\\\\[.45em]&-\\frac{\\alpha_1}{N}\\sum_{i=1}^{N}\\frac{\\mathbb I\\!\\left(R_i\\in\\{\\{1,2,3\\},\\{1,3\\}\\}\\right)}{\\pi_{123}+\\pi_{13}}f_{Y\\mid X_1}(X_{i1})\\end{aligned}$"
        }
      ],
      final: "One FM mapping; one bias-correcting contrast.",
      citation: "Angelopoulos et al. (2023a)."
    },
    {
      id: "slide-method-ppi-regression",
      method: "ppi",
      title: "Prediction-Powered Inference (PPI)",
      targetName: "Linear Regression",
      target:
        "$\\theta^*=\\arg\\min_{\\theta}\\,\\mathbb E(Y-X^\\top\\theta)^2$",
      principle: "Use one FM outcome imputation to bring pattern $\\{1,2\\}$ into the fit.",
      actions: {
        123: [
          action(0, "1", "regression", ["x1", "x2", "y"]),
          action(2, "3 · $-\\widehat Y_{12}$", "map-1", ["y"])
        ],
        12: [action(1, "2 · $+\\widehat Y_{12}$", "map-1", ["y"])]
      },
      steps: [
        {
          tone: "regression",
          label: "Observed squared-error loss",
          formula:
            "$\\widehat\\theta_{\\mathrm{PPI}}=\\arg\\min_{\\theta}\\;\\operatorname{avg}_{123}(Y-X^\\top\\theta)^2$"
        },
        {
          tone: "map-1",
          label: "Add imputed loss in pattern $\\{1,2\\}$",
          formula:
            "$+\\alpha_{12}\\operatorname{avg}_{12}(\\widehat Y_{12}-X^\\top\\theta)^2$"
        },
        {
          tone: "map-1",
          label: "Subtract the same imputed loss in complete cases",
          formula:
            "$-\\alpha_{12}\\operatorname{avg}_{123}(\\widehat Y_{12}-X^\\top\\theta)^2$"
        }
      ],
      final: "One FM mapping; one bias-correcting loss contrast.",
      citation: "Angelopoulos et al. (2023a)."
    },
    {
      id: "slide-method-ipi-mean",
      method: "ipi",
      title: "Imputation-Powered Inference (IPI)",
      targetName: "Outcome Mean",
      target: "$\\theta^*=\\mathbb E(Y)$",
      principle: "Build a separate filled-data mean contrast for each incomplete pattern.",
      actions: {
        123: [
          action(0, "1", "observed", ["y"]),
          action(1, "2 · $-\\widehat Y_1$", "map-0", ["y"]),
          action(2, "3 · $-\\widehat Y_{12}$", "map-1", ["y"])
        ],
        12: [action(2, "3 · $+\\widehat Y_{12}$", "map-1", ["y"])],
        13: [action(0, "1", "observed", ["y"])],
        1: [action(1, "2 · $+\\widehat Y_1$", "map-0", ["y"])]
      },
      steps: [
        {
          tone: "observed",
          label: "Start with the observed mean",
          formula: "$\\widehat\\theta_{\\mathrm{IPI}}=\\widehat\\theta_{\\mathrm{naive}}$"
        },
        {
          tone: "map-0",
          label: "Debias with $f_{Y\\mid X_1}$",
          formula:
            "$\\displaystyle\\begin{aligned}&+\\frac{\\alpha_1}{N}\\sum_{i=1}^{N}\\frac{\\mathbb I(R_i=\\{1\\})}{\\pi_1}f_{Y\\mid X_1}(X_{i1})\\\\[.45em]&-\\frac{\\alpha_1}{N}\\sum_{i=1}^{N}\\frac{\\mathbb I(R_i=\\{1,2,3\\})}{\\pi_{123}}f_{Y\\mid X_1}(X_{i1})\\end{aligned}$"
        },
        {
          tone: "map-1",
          label: "Debias with $f_{Y\\mid X_1,X_2}$",
          formula:
            "$\\displaystyle\\begin{aligned}&+\\frac{\\alpha_{12}}{N}\\sum_{i=1}^{N}\\frac{\\mathbb I(R_i=\\{1,2\\})}{\\pi_{12}}f_{Y\\mid X_1,X_2}(X_{i1},X_{i2})\\\\[.45em]&-\\frac{\\alpha_{12}}{N}\\sum_{i=1}^{N}\\frac{\\mathbb I(R_i=\\{1,2,3\\})}{\\pi_{123}}f_{Y\\mid X_1,X_2}(X_{i1},X_{i2})\\end{aligned}$"
        }
      ],
      final: "One debiasing contrast per imputation pattern.",
      citation: "Duan and Pelger (2025); Zhao and Candès (2025)."
    },
    {
      id: "slide-method-ipi-regression",
      method: "ipi",
      title: "Imputation-Powered Inference (IPI)",
      targetName: "Linear Regression",
      target:
        "$\\theta^*=\\arg\\min_{\\theta}\\,\\mathbb E(Y-X^\\top\\theta)^2$",
      principle: "Build a separate filled-data loss contrast for each incomplete pattern.",
      actions: {
        123: [
          action(0, "1", "anchor", ["x1", "x2", "y"]),
          action(1, "2 · ref", "ipi", ["x1", "x2", "y"])
        ],
        12: [action(1, "2 · $\\widehat Y_{12}$", "map-1", ["y"])],
        13: [action(1, "2 · $\\widehat X_{2|1Y}$", "map-3", ["x2"])],
        1: [
          action(1, "2 · $\\widehat Y_1$", "map-0", ["y"]),
          action(1, "2 · $\\widehat X_{2|1}$", "map-2", ["x2"])
        ]
      },
      steps: [
        {
          tone: "anchor",
          label: "Complete-case squared-error loss",
          formula: "$L_0(\\theta)=\\operatorname{avg}_{123}(Y-X^\\top\\theta)^2$"
        },
        {
          tone: "ipi",
          label: "Filled-data loss contrast for pattern $r$",
          formula:
            "$\\Delta_r(\\theta)=\\operatorname{avg}_{r}(\\widetilde Y_r-\\widetilde X_r^\\top\\theta)^2-\\operatorname{avg}_{123}(\\widetilde Y_r-\\widetilde X_r^\\top\\theta)^2$"
        },
        {
          tone: "ipi",
          label: "Combine the three pattern contrasts",
          formula:
            "$\\widehat\\theta_{\\mathrm{IPI}}=\\arg\\min_{\\theta}\\{L_0(\\theta)+\\alpha_{12}\\Delta_{12}(\\theta)+\\alpha_{13}\\Delta_{13}(\\theta)+\\alpha_1\\Delta_1(\\theta)\\}$"
        }
      ],
      final: "One loss contrast per incomplete pattern.",
      citation: "Duan and Pelger (2025); Zhao and Candès (2025)."
    },
    {
      id: "slide-method-ray-mean",
      method: "ray",
      title: "RAY Estimator",
      targetName: "Outcome Mean",
      target: "$\\theta^*=\\mathbb E(Y)$",
      principle: "Apply every FM imputation wherever its inputs are observed.",
      actions: {
        123: [
          action(0, "1", "observed", ["y"]),
          action(1, "2 · $\\widehat Y_1$", "map-0", ["y"]),
          action(2, "3 · $\\widehat Y_{12}$", "map-1", ["y"])
        ],
        12: [
          action(1, "2 · $\\widehat Y_1$", "map-0", ["y"]),
          action(2, "3 · $\\widehat Y_{12}$", "map-1", ["y"])
        ],
        13: [
          action(0, "1", "observed", ["y"]),
          action(1, "2 · $\\widehat Y_1$", "map-0", ["y"])
        ],
        1: [action(1, "2 · $\\widehat Y_1$", "map-0", ["y"])]
      },
      steps: [
        {
          tone: "observed",
          label: "Start with the observed mean",
          formula: "$\\widehat\\theta_{\\mathrm{RAY}}=\\widehat\\theta_{\\mathrm{naive}}$"
        },
        {
          tone: "map-0",
          label: "Correction from $f_{Y\\mid X_1}$",
          formula:
            "$\\displaystyle\\begin{aligned}&+\\frac{\\alpha_1}{N}\\sum_{i=1}^{N}\\Bigg[1-\\frac{\\mathbb I\\!\\left(R_i\\in\\{\\{1,2,3\\},\\{1,2\\}\\}\\right)}{\\pi_{123}+\\pi_{12}}\\\\[-.05em]&\\qquad-\\frac{\\mathbb I\\!\\left(R_i\\in\\{\\{1,2,3\\},\\{1,3\\}\\}\\right)}{\\pi_{123}+\\pi_{13}}+\\frac{\\mathbb I(R_i=\\{1,2,3\\})}{\\pi_{123}}\\Bigg]f_{Y\\mid X_1}(X_{i1})\\end{aligned}$"
        },
        {
          tone: "map-1",
          label: "Correction from $f_{Y\\mid X_1,X_2}$",
          formula:
            "$\\displaystyle\\begin{aligned}&+\\frac{\\alpha_{12}}{N}\\sum_{i=1}^{N}\\Bigg[\\frac{\\mathbb I\\!\\left(R_i\\in\\{\\{1,2,3\\},\\{1,2\\}\\}\\right)}{\\pi_{123}+\\pi_{12}}\\\\[-.05em]&\\qquad-\\frac{\\mathbb I(R_i=\\{1,2,3\\})}{\\pi_{123}}\\Bigg]f_{Y\\mid X_1,X_2}(X_{i1},X_{i2})\\end{aligned}$"
        }
      ],
      final: "Calibration: $\\sum_i w_{ik}=0$ for every FM mapping $k$.",
      citation: "Xu et al. (2026+)"
    },
    {
      id: "slide-method-ray-regression",
      method: "ray",
      title: "RAY Estimator",
      targetName: "Linear Regression",
      target:
        "$\\theta^*=\\arg\\min_{\\theta}\\,\\mathbb E(Y-X^\\top\\theta)^2$",
      principle: "Apply all four FM imputations wherever their inputs are observed.",
      actions: {
        123: [
          action(0, "1", "anchor", ["x1", "x2", "y"]),
          action(1, "2 · $\\widehat Y_1$", "map-0", ["y"]),
          action(1, "2 · $\\widehat Y_{12}$", "map-1", ["y"]),
          action(2, "3 · $\\widehat X_{2|1}$", "map-2", ["x2"]),
          action(2, "3 · $\\widehat X_{2|1Y}$", "map-3", ["x2"])
        ],
        12: [
          action(1, "2 · $\\widehat Y_1$", "map-0", ["y"]),
          action(1, "2 · $\\widehat Y_{12}$", "map-1", ["y"]),
          action(2, "3 · $\\widehat X_{2|1}$", "map-2", ["x2"])
        ],
        13: [
          action(1, "2 · $\\widehat Y_1$", "map-0", ["y"]),
          action(2, "3 · $\\widehat X_{2|1}$", "map-2", ["x2"]),
          action(2, "3 · $\\widehat X_{2|1Y}$", "map-3", ["x2"])
        ],
        1: [
          action(1, "2 · $\\widehat Y_1$", "map-0", ["y"]),
          action(2, "3 · $\\widehat X_{2|1}$", "map-2", ["x2"])
        ]
      },
      steps: [
        {
          tone: "anchor",
          label: "Complete-case squared-error loss",
          formula: "$L_0(\\theta)=\\operatorname{avg}_{123}(Y-X^\\top\\theta)^2$"
        },
        {
          tone: "map-mixed-y",
          label: "Corrections from the two $Y$ imputations",
          formula:
            "$C_k(\\theta)=\\sum_i w_{ik}(\\widetilde Y_{ik}-\\widetilde X_{ik}^\\top\\theta)^2,\\quad k\\in\\{\\widehat Y_1,\\widehat Y_{12}\\}$"
        },
        {
          tone: "map-mixed-x",
          label: "Corrections from the two $X_2$ imputations",
          formula:
            "$C_k(\\theta)=\\sum_i w_{ik}(\\widetilde Y_{ik}-\\widetilde X_{ik}^\\top\\theta)^2,\\quad k\\in\\{\\widehat X_{2|1},\\widehat X_{2|1Y}\\}$"
        },
        {
          tone: "ray",
          label: "Combine all four calibrated corrections",
          formula:
            "$\\widehat\\theta_{\\mathrm{RAY}}=\\arg\\min_{\\theta}\\{L_0(\\theta)+\\sum_{k=1}^{4}\\alpha_kC_k(\\theta)\\}$"
        }
      ],
      final: "Calibration: $\\sum_i w_{ik}=0$ for every FM mapping $k$.",
      citation: "Xu et al. (2026+)"
    }
  ];

  const slideOrder = [
    "slide-method-cc-mean",
    "slide-method-ppi-mean",
    "slide-method-ipi-mean",
    "slide-method-ray-mean"
  ];
  const activeSpecs = specs.filter((spec) => slideOrder.includes(spec.id));
  activeSpecs.sort((a, b) => slideOrder.indexOf(a.id) - slideOrder.indexOf(b.id));

  const fmMappings = [
    {
      tone: "map-0",
      fragment: 0,
      label: "Y from X₁",
      notation: "f_{Y\\mid X_1}",
      paths: [
        { d: "M100,62 C190,24 410,24 500,62", arrow: true }
      ],
      eligible: (pattern) => pattern.observed[0]
    },
    {
      tone: "map-1",
      fragment: 1,
      label: "Y from X₁, X₂",
      notation: "f_{Y\\mid X_1,X_2}",
      paths: [
        { d: "M100,62 C180,24 350,24 430,50" },
        { d: "M300,62 C345,36 390,38 430,50" },
        { d: "M430,50 C458,50 482,55 500,62", arrow: true }
      ],
      merge: { x: 430, y: 50 },
      eligible: (pattern) => pattern.observed[0] && pattern.observed[1]
    },
    {
      tone: "map-2",
      fragment: 2,
      label: "X₂ from X₁",
      notation: "f_{X_2\\mid X_1}",
      paths: [
        { d: "M100,62 C145,24 255,24 300,62", arrow: true }
      ],
      eligible: (pattern) => pattern.observed[0]
    },
    {
      tone: "map-3",
      fragment: 3,
      label: "X₂ from X₁, Y",
      notation: "f_{X_2\\mid X_1,Y}",
      paths: [
        { d: "M100,62 C165,24 285,24 350,48" },
        { d: "M500,62 C455,34 400,36 350,48" },
        { d: "M350,48 C330,50 314,55 300,62", arrow: true }
      ],
      merge: { x: 350, y: 48 },
      eligible: (pattern) => pattern.observed[0] && pattern.observed[2]
    }
  ];

  function firstFmCalls(spec) {
    const firstCall = new Map();
    Object.values(spec.actions)
      .flat()
      .forEach((entry) => {
        if (!entry.tone.startsWith("map-")) return;
        const current = firstCall.get(entry.tone);
        if (current === undefined || entry.step < current) {
          firstCall.set(entry.tone, entry.step);
        }
      });
    return firstCall;
  }

  function buildPatternBoard(spec) {
    const board = document.createElement("div");
    board.className = "method-pattern-board";
    const firstCall = firstFmCalls(spec);

    const headerRow = document.createElement("div");
    headerRow.className = "method-pattern-header-row";
    const corner = document.createElement("div");
    corner.className = "method-pattern-corner";
    corner.textContent = "Pattern";
    headerRow.append(corner);

    ["$X_1$", "$X_2$", "$Y$"].forEach((name) => {
      const header = document.createElement("div");
      header.className = "method-pattern-header";
      header.innerHTML = name;
      headerRow.append(header);
    });
    board.append(headerRow);

    patterns.forEach((pattern) => {
      const row = document.createElement("div");
      row.className = "method-pattern-row";
      row.dataset.pattern = pattern.key;

      const label = document.createElement("div");
      label.className = "method-pattern-label";
      label.innerHTML = "$R=" + pattern.label + "$";
      row.append(label);

      ["x1", "x2", "y"].forEach((variable, index) => {
        const block = document.createElement("div");
        block.className = pattern.observed[index]
          ? "method-data-block method-data-" + variable
          : "method-data-block method-data-missing";
        block.dataset.variable = variable;

        const entries = (spec.actions[pattern.key] || []).filter((entry) =>
          entry.cells.includes(variable)
        );
        const marks = document.createElement("div");
        marks.className = "method-block-marks";
        entries.forEach((entry, layer) => {
          const glow = document.createElement("span");
          glow.className = "method-block-glow method-tone-" + entry.tone;
          glow.dataset.fragment = String(entry.step);
          glow.style.setProperty("--layer", String(layer));

          block.append(glow);
          const tagLabel =
            spec.targetName === "Outcome Mean"
              ? entry.label.replace(/^\s*\d+(?:\s*·\s*)?/, "").trim()
              : entry.label;
          if (tagLabel) {
            const tag = document.createElement("span");
            tag.className = "method-block-tag method-tone-" + entry.tone;
            tag.dataset.fragment = String(entry.step);
            tag.innerHTML = tagLabel;
            marks.append(tag);
          }
        });
        block.append(marks);
        row.append(block);
      });

      const flowLayer = document.createElement("div");
      flowLayer.className = "method-flow-layer";
      fmMappings
        .filter((mapping) => mapping.eligible(pattern))
        .forEach((mapping) => {
          const directCalls = (spec.actions[pattern.key] || [])
            .filter((entry) => entry.tone === mapping.tone)
            .map((entry) => entry.step);
          let callStep = directCalls.length
            ? Math.min(...directCalls)
            : undefined;

          // IPI evaluates each pattern-specific imputation again in the
          // complete-case reference sample.
          if (
            callStep === undefined &&
            spec.method === "ipi" &&
            pattern.key === "123" &&
            firstCall.has(mapping.tone)
          ) {
            callStep = firstCall.get(mapping.tone);
          }

          if (callStep === undefined) return;

          const markerId = `method-arrow-${spec.id}-${pattern.key}-${mapping.fragment}`;
          const flow = document.createElement("div");
          flow.className =
            `method-flow method-flow-map-${mapping.fragment} method-tone-${mapping.tone}`;
          flow.dataset.fragment = String(callStep);
          flow.innerHTML = `
            <span class="method-flow-formula">$${mapping.notation}$</span>
            <svg viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <marker id="${markerId}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="currentColor"></path>
                </marker>
              </defs>
              ${mapping.paths
                .map(
                  (path) =>
                    `<path class="method-flow-path" d="${path.d}"${
                      path.arrow ? ` marker-end="url(#${markerId})"` : ""
                    }></path>`
                )
                .join("")}
              ${
                mapping.merge
                  ? `<circle class="method-flow-junction" cx="${mapping.merge.x}" cy="${mapping.merge.y}" r="5"></circle>`
                  : ""
              }
            </svg>
          `;
          flowLayer.append(flow);
        });
      row.append(flowLayer);
      board.append(row);
    });

    return board;
  }

  function buildEquationSteps(spec) {
    const pane = document.createElement("div");
    pane.className = "method-equation-pane";

    const list = document.createElement("div");
    list.className = "method-equation-list";
    spec.steps.forEach((step, index) => {
      const row = document.createElement("div");
      row.className = "method-equation-step method-tone-" + step.tone;
      row.dataset.fragment = String(index);

      const numbered = spec.targetName !== "Outcome Mean";
      if (!numbered) row.classList.add("method-equation-step-unnumbered");

      const copy = document.createElement("div");
      copy.className = "method-step-copy";
      const formula = document.createElement("div");
      formula.className = "method-step-formula";
      formula.innerHTML = step.formula;
      copy.append(formula);

      if (numbered) {
        const number = document.createElement("span");
        number.className = "method-step-number";
        number.textContent = String(index + 1);
        row.append(number, copy);
      } else {
        row.append(copy);
      }
      list.append(row);
    });
    pane.append(list);
    return pane;
  }

  activeSpecs.forEach((spec) => {
    let slide = document.getElementById(spec.id);
    if (!slide) {
      slide = document.createElement("section");
      slide.id = spec.id;
      insertionPoint.before(slide);
    }

    slide.className = "slide content-slide method-slide method-single-slide";
    slide.dataset.method = spec.method;
    slide.dataset.target =
      spec.targetName === "Outcome Mean" ? "mean" : "regression";
    slide.replaceChildren();

    const titleZone = document.createElement("div");
    titleZone.className = "slide-title-zone";
    const title = document.createElement("h2");
    title.textContent = spec.title;
    titleZone.append(title);

    const separator = document.createElement("hr");
    separator.className = "separator-line";

    const zone = document.createElement("div");
    zone.className = "slide-content-zone method-single-zone";

    const target = document.createElement("div");
    target.className = "method-target-line";
    const targetLabel = document.createElement("span");
    targetLabel.className = "method-target-label";
    targetLabel.textContent = spec.targetName;
    const targetMath = document.createElement("span");
    targetMath.className = "method-target-math";
    targetMath.innerHTML = spec.target;
    target.append(targetLabel, targetMath);

    const main = document.createElement("div");
    main.className = "method-single-main";
    main.append(buildPatternBoard(spec), buildEquationSteps(spec));

    zone.append(target, main);

    const number = document.createElement("span");
    number.className = "slide-number";
    slide.append(titleZone, separator, zone);
    if (spec.citation) {
      const citation = document.createElement("p");
      citation.className = "method-floating-citation";
      citation.textContent = spec.citation;
      slide.append(citation);
    }
    slide.append(number);
  });

  const allSlides = Array.from(document.querySelectorAll("#deck .slide"));
  allSlides.forEach((slide, index) => {
    const number = slide.querySelector(".slide-number");
    if (number) number.textContent = index + 1 + " / " + allSlides.length;
  });
})();
