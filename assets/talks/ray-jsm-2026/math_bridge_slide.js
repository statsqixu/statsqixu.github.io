(() => {
  const insertionPoint = document.getElementById("slide-11");
  if (!insertionPoint) return;

  const existing = document.getElementById("slide-math-behind-intuition");
  existing?.remove();

  const slide = document.createElement("section");
  slide.id = "slide-math-behind-intuition";
  slide.className = "slide content-slide math-bridge-slide";
  slide.innerHTML = `
    <div class="slide-title-zone"><h2>Math Behind Intuition</h2></div>
    <hr class="separator-line">
    <div class="slide-content-zone math-bridge-zone">
      <div class="math-bridge-shared" data-fragment="0">
        <p class="math-bridge-kicker">A classical semiparametric inference problem</p>
        <div class="math-bridge-methods" aria-label="PPI, IPI, and RAY are augmented estimators">
          <span class="math-bridge-method math-bridge-ppi">PPI</span>
          <span class="math-bridge-method math-bridge-ipi">IPI</span>
          <span class="math-bridge-method math-bridge-ray">RAY</span>
          <span class="math-bridge-equals">are augmented estimators</span>
        </div>
      </div>

      <div class="math-bridge-guarantees" data-fragment="1">
        <span>Unbiased</span>
        <span>Consistent</span>
        <span>Robust to imputation bias</span>
      </div>

      <p class="math-bridge-gap" data-fragment="2">
        But none is generally semiparametrically efficient.
      </p>

      <div class="math-bridge-tension" data-fragment="3">
        <section class="math-bridge-theory">
          <p class="math-bridge-side-label">Theory</p>
          <h3>Efficiency-optimal estimator is known.</h3>
          <p class="math-bridge-citation">Robins et al. (1994); Tsiatis (2006)</p>
        </section>

        <section class="math-bridge-computation">
          <p class="math-bridge-side-label">Practice</p>
          <h3>Empirically intractable.</h3>
        </section>
      </div>
    </div>
    <span class="slide-number"></span>
  `;

  slide.append(
    document.createComment(
      "[Sources] Robins, Rotnitzky, and Zhao (1994), JASA 89(427):846–866; Tsiatis (2006), Semiparametric Theory and Missing Data; Xu et al. (2026+), manuscript Sections 1 and 1.1."
    )
  );

  insertionPoint.before(slide);

  const optimalSlide = document.getElementById("slide-11");
  const optimalEquation = optimalSlide?.querySelector(".optimal-equation");
  const optimalDefinitions = optimalSlide?.querySelector(".optimal-defs");
  if (optimalEquation && optimalDefinitions) {
    const equationCluster = document.createElement("div");
    equationCluster.className = "optimal-equation-cluster";
    optimalEquation.before(equationCluster);
    equationCluster.append(optimalEquation, optimalDefinitions);

    const emptyDetailStack = optimalSlide.querySelector(".optimal-detail-stack");
    if (emptyDetailStack && !emptyDetailStack.children.length) {
      emptyDetailStack.remove();
    }
  }

  const optimalGapText = optimalSlide?.querySelector(".optimal-gap-text");
  const optimalGapPanels = optimalSlide?.querySelector(".optimal-gap-panels");
  optimalGapText?.remove();
  optimalGapPanels?.classList.add("optimal-gap-balance-only");

  // Remove the former slide 17, "Outline of Our Solution."
  document.getElementById("slide-12")?.remove();

  // Remove the current contiguous range of slides 17–24.
  Array.from(document.querySelectorAll("#deck .slide"))
    .slice(16, 24)
    .forEach((item) => item.remove());

  const slides = Array.from(document.querySelectorAll("#deck .slide"));
  slides.forEach((item, index) => {
    const number = item.querySelector(".slide-number");
    if (number) number.textContent = `${index + 1} / ${slides.length}`;
  });
})();
