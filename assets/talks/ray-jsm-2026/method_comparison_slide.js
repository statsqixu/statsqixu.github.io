(() => {
  const slide = document.getElementById("slide-10");
  if (!slide) return;

  const methods = [
    {
      key: "ppi",
      sourceId: "slide-method-ppi-mean",
      title: "PPI",
      caption: "One mapping; grouped observed vs. missing outcomes."
    },
    {
      key: "ipi",
      sourceId: "slide-method-ipi-mean",
      title: "IPI",
      caption: "Each mapping; one incomplete pattern vs. complete cases."
    },
    {
      key: "ray",
      sourceId: "slide-method-ray-mean",
      title: "RAY",
      caption: "Each mapping; all compatible observed patterns."
    }
  ];

  const comparisonGrid = document.createElement("div");
  comparisonGrid.className = "method-comparison-grid";

  methods.forEach((method, index) => {
    const source = document.getElementById(method.sourceId);
    const sourceBoard = source?.querySelector(".method-pattern-board");
    if (!sourceBoard) return;

    const panel = document.createElement("article");
    panel.className = `method-comparison-panel method-comparison-${method.key}`;
    panel.dataset.fragment = String(index);

    const heading = document.createElement("h3");
    heading.textContent = method.title;

    const frame = document.createElement("div");
    frame.className = "method-comparison-board-frame";
    const board = sourceBoard.cloneNode(true);
    board.classList.add("method-comparison-board");

    board.querySelectorAll(".method-block-tag").forEach((tag) => tag.remove());
    board
      .querySelectorAll(
        ".method-block-glow.method-tone-observed, .method-block-glow.method-tone-anchor, .method-block-glow.method-tone-regression"
      )
      .forEach((glow) => glow.remove());

    board.querySelectorAll("[data-fragment]").forEach((element) => {
      element.removeAttribute("data-fragment");
      element.classList.add("frag-shown");
    });

    const markerIds = new Map();
    board.querySelectorAll("marker[id]").forEach((marker, markerIndex) => {
      const previousId = marker.id;
      const nextId = `comparison-${method.key}-${markerIndex}`;
      marker.id = nextId;
      markerIds.set(previousId, nextId);
    });
    board.querySelectorAll("[marker-end]").forEach((path) => {
      const value = path.getAttribute("marker-end");
      markerIds.forEach((nextId, previousId) => {
        if (value === `url(#${previousId})`) {
          path.setAttribute("marker-end", `url(#${nextId})`);
        }
      });
    });

    const caption = document.createElement("p");
    caption.className = "method-comparison-caption";
    caption.textContent = method.caption;

    frame.append(board);
    panel.append(heading, frame, caption);
    comparisonGrid.append(panel);
  });

  slide.className = "slide content-slide method-comparison-slide";
  slide.replaceChildren();

  const titleZone = document.createElement("div");
  titleZone.className = "slide-title-zone";
  const title = document.createElement("h2");
  title.textContent = "How PPI, IPI, and RAY Use Imputations";
  titleZone.append(title);

  const separator = document.createElement("hr");
  separator.className = "separator-line";

  const zone = document.createElement("div");
  zone.className = "slide-content-zone method-comparison-zone";

  const intuition = document.createElement("p");
  intuition.className = "method-comparison-intuition";
  intuition.dataset.fragment = "3";
  intuition.innerHTML =
    "<strong>Intuition:</strong> RAY applies all compatible imputations and utilizes all modalities to improve efficiency.";

  zone.append(comparisonGrid, intuition);

  const number = document.createElement("span");
  number.className = "slide-number";

  slide.append(titleZone, separator, zone, number);

  const slides = Array.from(document.querySelectorAll("#deck .slide"));
  slides.forEach((item, index) => {
    const slideNumber = item.querySelector(".slide-number");
    if (slideNumber) slideNumber.textContent = `${index + 1} / ${slides.length}`;
  });
})();
