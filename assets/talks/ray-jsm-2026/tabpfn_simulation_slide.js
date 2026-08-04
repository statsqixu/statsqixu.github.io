(() => {
  const slide = document.getElementById("slide-19");
  const literatureSlide = document.getElementById("slide-10");
  if (!slide || !literatureSlide) return;

  // Digitized from Figure 3C of submission/jrssb_rr/main.pdf (TabPFN; n = 100).
  const series = [
    {
      name: "Naive",
      color: "#6D6E71",
      values: [0.393, 0.393, 0.393, 0.393, 0.393, 0.393, 0.393, 0.393, 0.393, 0.393, 0.393]
    },
    {
      name: "PPI",
      color: "#009647",
      values: [0.399, 0.3925, 0.3828, 0.3685, 0.3548, 0.3451, 0.3395, 0.3364, 0.3351, 0.3347, 0.3348]
    },
    {
      name: "IPI",
      color: "#FDB515",
      values: [0.399, 0.382, 0.3488, 0.3189, 0.3033, 0.2954, 0.2914, 0.2892, 0.2882, 0.2877, 0.2875]
    },
    {
      name: "RAY",
      color: "#007BC0",
      hero: true,
      values: [0.3955, 0.382, 0.3454, 0.3116, 0.2909, 0.2788, 0.272, 0.2687, 0.267, 0.2665, 0.2667]
    }
  ];

  const width = 700;
  const height = 400;
  const left = 84;
  const right = 664;
  const top = 48;
  const bottom = 314;
  const yMin = 0.245;
  const yMax = 0.405;
  const xAt = (index) => left + (index / 10) * (right - left);
  const yAt = (value) =>
    top + ((yMax - value) / (yMax - yMin)) * (bottom - top);

  const curvePath = (values) => {
    const points = values.map((value, index) => [xAt(index), yAt(value)]);
    let path = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
    const tension = 0.72;
    for (let index = 0; index < points.length - 1; index += 1) {
      const p0 = points[Math.max(0, index - 1)];
      const p1 = points[index];
      const p2 = points[index + 1];
      const p3 = points[Math.min(points.length - 1, index + 2)];
      const c1x = p1[0] + ((p2[0] - p0[0]) * tension) / 6;
      const c1y = p1[1] + ((p2[1] - p0[1]) * tension) / 6;
      const c2x = p2[0] - ((p3[0] - p1[0]) * tension) / 6;
      const c2y = p2[1] - ((p3[1] - p1[1]) * tension) / 6;
      path += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return path;
  };

  const yTicks = [0.25, 0.275, 0.3, 0.325, 0.35, 0.375, 0.4];
  const xTicks = [
    { value: 0, label: "Pure noise" },
    { value: 0.25, label: "0.25" },
    { value: 0.5, label: "0.50" },
    { value: 0.75, label: "0.75" },
    { value: 1, label: "TabPFN" }
  ];

  const horizontalGrid = yTicks
    .map((tick) => {
      const y = yAt(tick);
      return `<line x1="${left}" y1="${y.toFixed(1)}" x2="${right}" y2="${y.toFixed(1)}" stroke="#e6e6e6" stroke-width="1"/><text x="${left - 12}" y="${(y + 5).toFixed(1)}" text-anchor="end" font-family="var(--font-body)" font-size="16" fill="var(--text-secondary)">${tick.toFixed(3)}</text>`;
    })
    .join("");

  const verticalGrid = xTicks
    .map((tick) => {
      const x = left + tick.value * (right - left);
      const label =
        tick.value === 0
          ? `<text x="${x}" y="339" text-anchor="middle" font-family="var(--font-body)" font-size="16" fill="var(--text-primary)"><tspan x="${x}" dy="0">Pure</tspan><tspan x="${x}" dy="17">noise</tspan></text>`
          : tick.value === 1
            ? `<text x="${x}" y="339" text-anchor="middle" font-family="var(--font-body)" font-size="16" fill="var(--text-primary)"><tspan x="${x}" dy="0">TabPFN</tspan><tspan x="${x}" dy="17">prediction</tspan></text>`
            : `<text x="${x}" y="347" text-anchor="middle" font-family="var(--font-body)" font-size="16" fill="var(--text-primary)">${tick.label}</text>`;
      return `<line x1="${x.toFixed(1)}" y1="${top}" x2="${x.toFixed(1)}" y2="${bottom}" stroke="#eeeeee" stroke-width="1"/>${label}`;
    })
    .join("");

  const curves = series
    .map(
      (item) =>
        `<path class="fig-line${item.hero ? " hero" : ""}" data-fragment="0" pathLength="100" fill="none" stroke="${item.color}" stroke-width="${item.hero ? 4.5 : 3}" stroke-linecap="round" stroke-linejoin="round" d="${curvePath(item.values)}"/>`
    )
    .join("");

  const legend = series
    .map(
      (item) =>
        `<span style="color:${item.color}"><i style="background:${item.color}"></i>${item.name}</span>`
    )
    .join("");

  slide.innerHTML = `
    <div class="slide-title-zone"><h2>Simulation With TabPFN Imputation</h2></div>
    <hr class="separator-line">
    <div class="slide-content-zone">
      <div class="fig-chart">
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="height:66vh;width:auto;max-width:94vw" role="img" aria-label="Outcome-mean RMSE under MCAR using TabPFN imputation as prediction quality improves">
          <text x="${(left + right) / 2}" y="24" text-anchor="middle" font-family="var(--font-display)" font-size="18" font-weight="700" fill="var(--text-secondary)">Outcome mean under MCAR · outcome-observed pattern size n = 100</text>
          ${horizontalGrid}
          ${verticalGrid}
          <line x1="${left}" y1="${top}" x2="${left}" y2="${bottom}" stroke="var(--separator-color)" stroke-width="2"/>
          <line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" stroke="var(--separator-color)" stroke-width="2"/>
          <text x="24" y="${(top + bottom) / 2}" text-anchor="middle" font-family="var(--font-body)" font-size="18" fill="var(--text-primary)" transform="rotate(-90 24 ${(top + bottom) / 2})">RMSE</text>
          <text x="${(left + right) / 2}" y="391" text-anchor="middle" font-family="var(--font-body)" font-size="18" fill="var(--text-primary)">Prediction quality</text>
          ${curves}
        </svg>
        <div class="fig-legend">${legend}</div>
      </div>
    </div>
    <p class="method-floating-citation">Xu et al. (2026+), Figure 3C</p>
    <span class="slide-number"></span>
  `;

  literatureSlide.before(slide);

  const slides = Array.from(document.querySelectorAll("#deck .slide"));
  slides.forEach((item, index) => {
    const number = item.querySelector(".slide-number");
    if (number) number.textContent = `${index + 1} / ${slides.length}`;
  });
})();
