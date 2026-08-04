(()=>{const a=document.getElementById("slide-30");if(!a)return;document.getElementById("slide-ray-approximation")?.remove();const s=document.createElement("section");s.id="slide-ray-approximation",s.className="slide content-slide ray-approx-slide",s.innerHTML=String.raw`
    <div class="slide-title-zone"><h2>Approximating the Optimal Equation</h2></div>
    <hr class="separator-line">
    <div class="slide-content-zone ray-approx-zone">
      <div class="ray-story">
        <div class="ray-progress" aria-hidden="true">
          <span class="ray-progress-item ray-progress-0"><b>1</b>Inverse</span>
          <i></i>
          <span class="ray-progress-item ray-progress-1"><b>2</b>Decompose</span>
          <i></i>
          <span class="ray-progress-item ray-progress-2"><b>3</b>Almost-eigen</span>
          <i></i>
          <span class="ray-progress-item ray-progress-3"><b>4</b>Two approximations</span>
        </div>

        <div class="ray-scenes">
          <section class="ray-scene ray-scene-0" data-fragment="0">
            <p class="ray-scene-kicker">Exact target</p>
            <p class="ray-hero-math">$\mathcal M^{-1}(\varphi)$</p>
            <p class="ray-scene-caption">The operator inverse is the computational bottleneck.</p>
          </section>

          <section class="ray-scene ray-scene-1" data-fragment="1">
            <div class="ray-scene-heading">
              <span>Restricted ANOVA hierarchY (RAY)</span>
              <p>$\displaystyle \varphi=\sum_{s\subseteq[p]}\mathcal P_s(\varphi)$</p>
            </div>
            <div class="ray-component-row" aria-label="RAY decomposition components">
              <div class="ray-component ray-component-a">$\mathcal P_{\varnothing}(\varphi)$</div>
              <div class="ray-component ray-component-b">$\mathcal P_{\{1\}}(\varphi)$</div>
              <div class="ray-component ray-component-c">$\mathcal P_{\{2\}}(\varphi)$</div>
              <div class="ray-component ray-component-more">$\cdots$</div>
              <div class="ray-component ray-component-d">$\mathcal P_{[p]}(\varphi)$</div>
            </div>
            <p class="ray-decomp-definition">
              $\displaystyle \mathcal P_s(\varphi)
              =\sum_{r\subseteq s,\ r\in\mathcal Q}(-1)^{|s|-|r|}\mathcal A_r(\varphi)$
            </p>
          </section>

          <section class="ray-scene ray-scene-2" data-fragment="2">
            <div class="ray-component-row ray-component-row-small" aria-hidden="true">
              <div class="ray-component ray-component-a">$\mathcal P_{\varnothing}$</div>
              <div class="ray-component ray-component-b">$\mathcal P_{\{1\}}$</div>
              <div class="ray-component ray-component-c">$\mathcal P_{\{2\}}$</div>
              <div class="ray-component ray-component-more">$\cdots$</div>
              <div class="ray-component ray-component-d">$\mathcal P_{[p]}$</div>
            </div>
            <div class="ray-eigen-equation">
              <span class="ray-eigen-main">$\mathcal M\{\mathcal P_s(\varphi)\}=\lambda_s\mathcal P_s(\varphi)$</span>
              <span class="ray-eigen-remainder">$+\operatorname{Rem}_s(\varphi)$</span>
            </div>
            <div class="ray-eigen-definitions">
              <div class="ray-lambda-block">
                <p class="ray-definition-label">Almost-eigen value</p>
                <p class="ray-lambda-definition">$\displaystyle \lambda_s=\sum_{r\in\mathcal Q:\ r\supseteq s}\pi_r$</p>
              </div>
              <div class="ray-rem-block">
                <p class="ray-definition-label">Remainder</p>
                <p class="ray-rem-definition">
                  $\displaystyle
                  \operatorname{Rem}_s(\varphi)
                  =\sum_{r\in\mathcal Q:\ s\nsubseteq r}
                  \pi_r\mathcal A_r\{\mathcal P_s(\varphi)\}$
                </p>
                <p class="ray-rem-meaning">Nested cross-pattern conditional regressions</p>
              </div>
            </div>
          </section>

          <section class="ray-scene ray-scene-3" data-fragment="3">
            <div class="ray-transform-stage" aria-label="Approximation of the inverse operator using the RAY decomposition">
              <div class="ray-transform-state ray-transform-state-1">
                <p class="ray-transform-cue">Start from the inverse</p>
                <p class="ray-transform-formula">$\displaystyle \mathcal M^{-1}(\varphi)$</p>
              </div>

              <div class="ray-transform-state ray-transform-state-2" data-fragment="4">
                <p class="ray-transform-cue">Insert the RAY decomposition</p>
                <p class="ray-transform-formula">
                  $\displaystyle
                  \mathcal M^{-1}\!\left\{
                  \sum_{s\subseteq[p]}\mathcal P_s(\varphi)
                  \right\}$
                </p>
              </div>

              <div class="ray-transform-state ray-transform-state-3" data-fragment="5">
                <p class="ray-transform-cue">Use linearity of $\mathcal M^{-1}$</p>
                <p class="ray-transform-formula">
                  $\displaystyle
                  \sum_{s\subseteq[p]}
                  \mathcal M^{-1}\{\mathcal P_s(\varphi)\}$
                </p>
              </div>

              <div class="ray-transform-state ray-transform-state-4" data-fragment="6">
                <p class="ray-transform-cue ray-transform-cue-final">First approximation: use the almost-eigen relation</p>
                <p class="ray-transform-formula ray-transform-result ray-transform-first-approx">
                  $\displaystyle
                  \mathcal M^{-1}(\varphi)
                  \approx\widetilde{\mathcal M}^{-1}(\varphi)
                  :=
                  \sum_{s\subseteq[p]}
                  \lambda_s^{-1}\mathcal P_s(\varphi)$
                </p>
              </div>

              <div class="ray-transform-state ray-transform-state-5" data-fragment="7">
                <p class="ray-transform-cue">Apply $\mathcal L$: split by the observed pattern</p>
                <div class="ray-l-one-line" aria-label="Applying L separates directly computable and cross-pattern terms">
                  <span class="ray-l-inline ray-l-prefix">$\displaystyle \mathcal L\{\widetilde{\mathcal M}^{-1}(\varphi)\}=\sum_{r\in\mathcal Q}\mathbb I(R=r)\Big\{$</span>
                  <span class="ray-l-inline-term ray-l-direct-inline">
                    <span>$\displaystyle \sum_{s\subseteq r}\lambda_s^{-1}\mathcal P_s(\varphi)$</span>
                    <small>directly computable</small>
                  </span>
                  <span class="ray-l-inline ray-l-plus">$+$</span>
                  <span class="ray-l-inline-term ray-l-cross-inline">
                    <span>$\displaystyle \sum_{s\nsubseteq r}\lambda_s^{-1}\mathcal A_r\{\mathcal P_s(\varphi)\}$</span>
                    <small>cross-pattern compositions</small>
                  </span>
                  <span class="ray-l-inline ray-l-suffix">$\displaystyle \Big\}$</span>
                </div>
              </div>

              <div class="ray-transform-state ray-transform-state-6" data-fragment="8">
                <p class="ray-transform-cue ray-transform-cue-final">Second approximation: retain the computable group</p>
                <p class="ray-transform-formula ray-transform-second-approx">
                  $\displaystyle
                  \mathcal L\{\widetilde{\mathcal M}^{-1}(\varphi)\}
                  \approx
                  \sum_{r\in\mathcal Q}\mathbb I(R=r)
                  \sum_{s\subseteq r}\lambda_s^{-1}\mathcal P_s(\varphi)$
                </p>
              </div>

              <div class="ray-transform-state ray-transform-state-7" data-fragment="9">
                <p class="ray-transform-cue ray-transform-cue-final">Reindex by observed pattern</p>
                <p class="ray-transform-formula ray-transform-final">
                  $\displaystyle
                  \frac{\mathbb I(R=[p])}{\pi_{[p]}}\varphi
                  +\sum_{\substack{r\in\mathcal Q\\r\ne[p]}}
                  \omega_r\mathcal A_r(\varphi)
                  \equiv\varphi_{\mathrm{RAY}}$
                </p>
                <p class="ray-omega-definition">
                  $\displaystyle
                  \omega_r
                  =\sum_{s:\ r\subseteq s\subseteq[p]}
                  (-1)^{|s|-|r|}
                  \frac{\mathbb I(R\supseteq s)}{\lambda_s},
                  \qquad r\ne[p]$
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    <p class="ray-approx-citation">Xu et al. (2026+)</p>
    <span class="slide-number"></span>
  `,s.append(document.createComment("[Sources] Xu et al. (2026+), manuscript Section 2.2, equations (8)\u2013(12).")),a.before(s);const r=Array.from(document.querySelectorAll("#deck .slide"));r.forEach(((a,s)=>{const e=a.querySelector(".slide-number");e&&(e.textContent=`${s+1} / ${r.length}`)}))})();