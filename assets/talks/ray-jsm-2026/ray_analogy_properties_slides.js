(() => {
  const rayApproximationSlide = document.getElementById("slide-ray-approximation");
  const oldFinalSlide = document.getElementById("slide-30");
  if (!rayApproximationSlide || !oldFinalSlide) return;

  document.getElementById("slide-ray-analogies")?.remove();
  document.getElementById("slide-ray-properties")?.remove();
  document.getElementById("slide-ray-efficiency")?.remove();
  document.getElementById("slide-ray-gap-bound")?.remove();
  document.getElementById("slide-ray-summary")?.remove();
  oldFinalSlide.remove();

  const analogySlide = document.createElement("section");
  analogySlide.id = "slide-ray-analogies";
  analogySlide.className = "slide content-slide ray-analogy-slide";
  analogySlide.innerHTML = String.raw`
    <div class="slide-title-zone"><h2>RAY as a Structured Approximation</h2></div>
    <hr class="separator-line">
    <div class="slide-content-zone ray-analogy-zone">
      <div class="ray-analogy-table">
        <div class="ray-analogy-header" aria-hidden="true">
          <span></span>
          <span>Decompose</span>
          <span>Simplify coupling</span>
          <span>Solve tractably</span>
        </div>

        <div class="ray-analogy-row ray-analogy-meanfield" data-fragment="0">
          <h3>Mean-field VI</h3>
          <p>$q(z)=\prod_j q_j(z_j)$</p>
          <p>Restrict posterior dependence</p>
          <p>Coordinate-wise updates</p>
        </div>

        <div class="ray-analogy-row ray-analogy-composite" data-fragment="1">
          <h3>Composite likelihood</h3>
          <p>$\ell_c(\theta)=\sum_k w_k\ell_k(\theta)$</p>
          <p>Avoid the full joint likelihood</p>
          <p>$U_c(\theta)=\nabla_\theta\ell_c(\theta)=0$</p>
        </div>

        <div class="ray-analogy-row ray-analogy-ray" data-fragment="2">
          <h3>RAY</h3>
          <p>$\varphi=\sum_s\mathcal P_s(\varphi)$</p>
          <p>Discard cross-pattern compositions</p>
          <p>$\widetilde{\mathcal M}^{-1}(\varphi)=\sum_s\lambda_s^{-1}\mathcal P_s(\varphi)$</p>
        </div>
      </div>

      <p class="ray-analogy-punch" data-fragment="3">
        Common principle: replace hard global coupling with tractable local structure.
      </p>
    </div>
    <p class="ray-new-slide-citation">Blei et al. (2017); Varin et al. (2011); Xu et al. (2026+)</p>
    <span class="slide-number"></span>
  `;
  analogySlide.append(
    document.createComment(
      "[Sources] Blei, Kucukelbir, and McAuliffe (2017), JASA 112:859-877; Varin, Reid, and Firth (2011), Statistica Sinica 21:5-42; Xu et al. (2026+), manuscript Section 2.2."
    )
  );

  const propertiesSlide = document.createElement("section");
  propertiesSlide.id = "slide-ray-properties";
  propertiesSlide.className = "slide content-slide ray-properties-slide";
  propertiesSlide.innerHTML = String.raw`
    <div class="slide-title-zone"><h2>Statistical Properties of RAY</h2></div>
    <hr class="separator-line">
    <div class="slide-content-zone ray-properties-zone">
      <p class="ray-property-conditions">
        Under MCAR, pretrained imputations independent of the analysis data, and standard regularity conditions
      </p>

      <div class="ray-property-row">
        <section class="ray-property ray-property-unbiased" data-fragment="0">
          <h3>Unbiased estimating equation</h3>
          <p>$\mathbb E\{\psi_{\mathrm{RAY}}(O;\theta^*,\{f_r\})\}=0$</p>
        </section>

        <section class="ray-property ray-property-consistent" data-fragment="1">
          <h3>Consistency</h3>
          <p>$\widehat\theta_{\mathrm{RAY}}\xrightarrow{p}\theta^*$</p>
        </section>

        <section class="ray-property ray-property-normal" data-fragment="2">
          <h3>Asymptotic normality</h3>
          <p>$\sqrt N\,(\widehat\theta_{\mathrm{RAY}}-\theta^*)\Rightarrow\mathcal N(0,\Sigma_f)$</p>
        </section>
      </div>

      <div class="ray-robustness" data-fragment="3">
        <div class="ray-robustness-heading">
          <span>Imputation-model robustness</span>
          <p>$f_r(Z_r)\not\equiv\mathbb E\{\varphi(Z,\theta^*)\mid Z_r\}$ is allowed for every $r$.</p>
        </div>
        <p class="ray-robustness-punch">
          One, several, or <strong>all</strong> conditional expectations may be misspecified.
        </p>
        <p class="ray-robustness-consequence">
          Misspecification changes <span>efficiency $(\Sigma_f)$</span>, not <strong>validity $(\theta^*)$</strong>.
        </p>
      </div>
    </div>
    <p class="ray-new-slide-citation">Xu et al. (2026+), Proposition 1 and Theorem 2</p>
    <span class="slide-number"></span>
  `;
  propertiesSlide.append(
    document.createComment(
      "[Sources] Xu et al. (2026+), manuscript Proposition 1 and Theorem 2, Section 2.3."
    )
  );

  const efficiencySlide = document.createElement("section");
  efficiencySlide.id = "slide-ray-efficiency";
  efficiencySlide.className = "slide content-slide ray-efficiency-slide";
  efficiencySlide.innerHTML = String.raw`
    <div class="slide-title-zone"><h2>When Does RAY Attain the Efficiency Bound?</h2></div>
    <hr class="separator-line">
    <div class="slide-content-zone ray-efficiency-zone">
      <p class="ray-efficiency-intro">Any one of three complementary structures is sufficient.</p>

      <div class="ray-efficiency-conditions">
        <section class="ray-efficiency-condition ray-efficiency-intersection" data-fragment="0">
          <h3>Intersection-closed + independent</h3>
          <div class="ray-pattern-table" aria-label="Intersection-closed observed patterns for X1, X2, and Y">
            <div class="ray-pattern-header"><span>Pattern</span><span>$X_1$</span><span>$X_2$</span><span>$Y$</span></div>
            <div class="ray-pattern-row"><span>$\{1,2,3\}$</span><i class="ray-pattern-cell ray-pattern-x1"></i><i class="ray-pattern-cell ray-pattern-x2"></i><i class="ray-pattern-cell ray-pattern-y"></i></div>
            <div class="ray-pattern-row ray-pattern-source"><span>$\{1,2\}$</span><i class="ray-pattern-cell ray-pattern-x1"></i><i class="ray-pattern-cell ray-pattern-x2"></i><i class="ray-pattern-cell ray-pattern-missing"></i></div>
            <div class="ray-pattern-row ray-pattern-source"><span>$\{2,3\}$</span><i class="ray-pattern-cell ray-pattern-missing"></i><i class="ray-pattern-cell ray-pattern-x2"></i><i class="ray-pattern-cell ray-pattern-y"></i></div>
            <div class="ray-pattern-row ray-pattern-overlap"><span>$\{2\}$</span><i class="ray-pattern-cell ray-pattern-missing"></i><i class="ray-pattern-cell ray-pattern-x2"></i><i class="ray-pattern-cell ray-pattern-missing"></i></div>
            <div class="ray-pattern-row"><span>$\{3\}$</span><i class="ray-pattern-cell ray-pattern-missing"></i><i class="ray-pattern-cell ray-pattern-missing"></i><i class="ray-pattern-cell ray-pattern-y"></i></div>
          </div>
          <p class="ray-pattern-caption">$\{1,2\}\cap\{2,3\}=\{2\}\in\mathcal Q$</p>
          <p class="ray-efficiency-law">$X_1,X_2,Y$ mutually independent</p>
        </section>

        <span class="ray-efficiency-or" data-fragment="1">OR</span>

        <section class="ray-efficiency-condition ray-efficiency-monotone" data-fragment="1">
          <h3>Monotone patterns</h3>
          <div class="ray-pattern-table ray-pattern-table-monotone" aria-label="Nested observed patterns for X1, X2, and Y">
            <div class="ray-pattern-header"><span>Pattern</span><span>$X_1$</span><span>$X_2$</span><span>$Y$</span></div>
            <div class="ray-pattern-row"><span>$\{1,2,3\}$</span><i class="ray-pattern-cell ray-pattern-x1"></i><i class="ray-pattern-cell ray-pattern-x2"></i><i class="ray-pattern-cell ray-pattern-y"></i></div>
            <div class="ray-pattern-row"><span>$\{1,2\}$</span><i class="ray-pattern-cell ray-pattern-x1"></i><i class="ray-pattern-cell ray-pattern-x2"></i><i class="ray-pattern-cell ray-pattern-missing"></i></div>
            <div class="ray-pattern-row"><span>$\{1\}$</span><i class="ray-pattern-cell ray-pattern-x1"></i><i class="ray-pattern-cell ray-pattern-missing"></i><i class="ray-pattern-cell ray-pattern-missing"></i></div>
          </div>
          <p class="ray-pattern-caption">$\{1\}\subset\{1,2\}\subset\{1,2,3\}$</p>
          <p class="ray-efficiency-law">No distributional restriction</p>
        </section>

        <span class="ray-efficiency-or" data-fragment="2">OR</span>

        <section class="ray-efficiency-condition ray-efficiency-anchored" data-fragment="2">
          <h3>Anchored patterns</h3>
          <div class="ray-pattern-table ray-pattern-table-anchored" aria-label="Anchored observed patterns with X1 present in every pattern">
            <div class="ray-pattern-header"><span>Pattern</span><span class="ray-pattern-anchor-head">$X_1$</span><span>$X_2$</span><span>$Y$</span></div>
            <div class="ray-pattern-row"><span>$\{1,2,3\}$</span><i class="ray-pattern-cell ray-pattern-x1 ray-pattern-anchor"></i><i class="ray-pattern-cell ray-pattern-x2"></i><i class="ray-pattern-cell ray-pattern-y"></i></div>
            <div class="ray-pattern-row"><span>$\{1,2\}$</span><i class="ray-pattern-cell ray-pattern-x1 ray-pattern-anchor"></i><i class="ray-pattern-cell ray-pattern-x2"></i><i class="ray-pattern-cell ray-pattern-missing"></i></div>
            <div class="ray-pattern-row"><span>$\{1,3\}$</span><i class="ray-pattern-cell ray-pattern-x1 ray-pattern-anchor"></i><i class="ray-pattern-cell ray-pattern-missing"></i><i class="ray-pattern-cell ray-pattern-y"></i></div>
            <div class="ray-pattern-row"><span>$\{1\}$</span><i class="ray-pattern-cell ray-pattern-x1 ray-pattern-anchor"></i><i class="ray-pattern-cell ray-pattern-missing"></i><i class="ray-pattern-cell ray-pattern-missing"></i></div>
          </div>
          <p class="ray-pattern-caption"><span>$X_1$</span> is observed in every pattern</p>
          <p class="ray-efficiency-law">$X_2\perp Y\mid X_1$</p>
        </section>
      </div>

      <div class="ray-efficiency-result" data-fragment="3">
        <span>Any one condition</span>
        <b>$\Longrightarrow$</b>
        <p>Efficiency gap $\mathcal E=0$</p>
        <b>$\Longrightarrow$</b>
        <strong>$\Sigma_{\mathrm{RAY}}=\Sigma_{\mathrm{eff}}$</strong>
      </div>
    </div>
    <p class="ray-new-slide-citation">Xu et al. (2026+), Theorem 5</p>
    <span class="slide-number"></span>
  `;
  efficiencySlide.append(
    document.createComment(
      "[Sources] Xu et al. (2026+), manuscript Section 3.1, Definition 1 and Theorem 5."
    )
  );

  const gapBoundSlide = document.createElement("section");
  gapBoundSlide.id = "slide-ray-gap-bound";
  gapBoundSlide.className = "slide content-slide ray-gap-bound-slide";
  gapBoundSlide.innerHTML = String.raw`
    <div class="slide-title-zone"><h2>Two Mechanisms Control the Efficiency Gap</h2></div>
    <hr class="separator-line">
    <div class="slide-content-zone ray-gap-zone">
      <div class="ray-gap-formula" aria-label="General two-factor upper bound for the RAY efficiency gap">
        <div class="ray-gap-formula-term ray-gap-loss-term">
          <span>Efficiency loss</span>
          <p>$\displaystyle \sqrt{\operatorname{tr}(A\mathcal E A^\top)}$</p>
        </div>
        <b>$\le$</b>
        <div class="ray-gap-formula-term ray-gap-correlation-term">
          <span>Correlation term</span>
          <p>$\displaystyle C(\pi,\mathcal Q)\,\rho_{\max}^{*}\,\lVert\psi^F\rVert$</p>
        </div>
        <b>$+$</b>
        <div class="ray-gap-formula-term ray-gap-structure-term">
          <span>Structural term</span>
          <p>$\displaystyle S(\psi^F)$</p>
        </div>
      </div>

      <div class="ray-gap-interpretations">
        <section class="ray-gap-mechanism ray-gap-correlation" data-fragment="0">
          <h3>Dependence across private modalities</h3>
          <div class="ray-gap-correlation-visual" aria-label="Conditional dependence between the private parts of two overlapping patterns">
            <div class="ray-gap-private-block">
              <strong>$Z_{r\setminus t}$</strong>
              <span>private to $r$</span>
            </div>
            <div class="ray-gap-correlation-link">
              <p>$\stackrel{\rho_{\max}^{*}}{\longleftrightarrow}$</p>
              <span>given $Z_{r\cap t}$</span>
            </div>
            <div class="ray-gap-private-block">
              <strong>$Z_{t\setminus r}$</strong>
              <span>private to $t$</span>
            </div>
          </div>
          <p class="ray-gap-rho-formula">
            $\displaystyle \rho_{\max}^{*}
            =\max_{r,t\in\mathcal Q}
            \rho^{*}\!\left(Z_{r\setminus t};Z_{t\setminus r}\mid Z_{r\cap t}\right)$
          </p>
          <p class="ray-gap-zero">Zero under conditional independence given the overlap.</p>
        </section>

        <span class="ray-gap-plus" data-fragment="1" aria-hidden="true">+</span>

        <section class="ray-gap-mechanism ray-gap-structure" data-fragment="1">
          <h3>Missing intersections in $\mathcal Q$</h3>
          <div class="ray-gap-structure-visual" aria-label="Two observed patterns whose required intersection is absent">
            <svg class="ray-gap-structure-arrows" viewBox="0 0 510 135" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <marker id="ray-gap-converge-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z"></path>
                </marker>
              </defs>
              <path d="M 117 58 C 155 61, 205 65, 249 68" marker-end="url(#ray-gap-converge-arrow)"></path>
              <path d="M 393 58 C 355 61, 305 65, 261 68" marker-end="url(#ray-gap-converge-arrow)"></path>
              <circle class="ray-gap-merge-point" cx="255" cy="68" r="5"></circle>
              <path class="ray-gap-merge-stem" d="M 255 73 L 255 80"></path>
            </svg>
            <span class="ray-gap-pattern ray-gap-pattern-left">$\{1,2\}$</span>
            <span class="ray-gap-pattern ray-gap-pattern-right">$\{2,3\}$</span>
            <span class="ray-gap-missing">$\{2\}\notin\mathcal Q$ <b>✕</b></span>
          </div>
          <p class="ray-gap-meaning ray-gap-structure-meaning">
            Missing overlap patterns leave cross-pattern compositions unresolved.
          </p>
          <p class="ray-gap-zero">$S(\psi^F)=0$ when $\mathcal Q$ is intersection-closed.</p>
        </section>
      </div>

      <div class="ray-gap-conclusion" data-fragment="2">
        <span>Conditional independence</span>
        <b>$+$</b>
        <span>Intersection-closed $\mathcal Q$</span>
        <strong>$\Longrightarrow$ bound $=0$ $\Longrightarrow$ RAY is efficient</strong>
      </div>
    </div>
    <p class="ray-new-slide-citation">Xu et al. (2026+), Theorem 6</p>
    <span class="slide-number"></span>
  `;
  gapBoundSlide.append(
    document.createComment(
      "[Sources] Xu et al. (2026+), manuscript Section 3.2, Definition 2 and Theorem 6."
    )
  );

  const summarySlide = document.createElement("section");
  summarySlide.id = "slide-ray-summary";
  summarySlide.className = "slide content-slide ray-summary-slide";
  summarySlide.innerHTML = String.raw`
    <div class="slide-title-zone"><h2>Summary and Beyond</h2></div>
    <hr class="separator-line">
    <div class="slide-content-zone ray-summary-zone">
      <div class="ray-summary-columns">
        <section class="ray-summary-column ray-summary-main" data-fragment="0">
          <h3>Summary</h3>
          <ul>
            <li>
              <strong>Predictions need not be correct.</strong>
              <span>Augmentation preserves validity even when foundation-model imputations are biased or misspecified.</span>
            </li>
            <li>
              <strong>Use every compatible pattern.</strong>
              <span>RAY combines all applicable imputations and modalities instead of relying only on complete cases.</span>
            </li>
            <li>
              <strong>Efficiency becomes tractable.</strong>
              <span>A closed-form approximation targets the optimal equation, with exactness conditions and an interpretable gap.</span>
            </li>
          </ul>
        </section>

        <section class="ray-summary-column ray-summary-beyond" data-fragment="1">
          <h3>Beyond This Talk</h3>
          <ul>
            <li>
              <strong>Adaptive RAY</strong>
              <span>Population-optimal weights in a broader class containing both RAY and IPI.</span>
            </li>
            <li>
              <strong>Beyond MCAR</strong>
              <span>Weaker patternwise independence and a population extension under missing at random.</span>
            </li>
            <li>
              <strong>Full empirical study</strong>
              <span>Mean and regression simulations, MAR/MNAR sensitivity, and a randomized single-cell multi-omics benchmark.</span>
            </li>
          </ul>
        </section>
      </div>

    </div>
    <p class="ray-new-slide-citation">Xu et al. (2026+)</p>
    <span class="slide-number"></span>
  `;
  summarySlide.append(
    document.createComment(
      "[Sources] Xu et al. (2026+), manuscript Sections 1.2, 2.4, 4-6, and Appendix A."
    )
  );

  rayApproximationSlide.after(analogySlide, propertiesSlide, efficiencySlide, gapBoundSlide, summarySlide);

  const slides = Array.from(document.querySelectorAll("#deck .slide"));
  slides.forEach((slide, index) => {
    const number = slide.querySelector(".slide-number");
    if (number) number.textContent = `${index + 1} / ${slides.length}`;
  });
})();
