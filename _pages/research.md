---
layout: page
title: Research
permalink: /research/
---

<div class="site-page">
  <section class="content-section">
    <h2>Recent research interests</h2>
    <div class="research-interest-list">
      <details>
        <summary>AI for Stat</summary>
        <p>Foundation models are expanding the reach of prediction in business, finance, and science. Tabular models such as <a href="https://www.nature.com/articles/s41586-024-08328-6">TabPFN</a>, <a href="https://arxiv.org/abs/2502.05564">TabICL</a>, and <a href="https://research.google/blog/introducing-tabfm-a-zero-shot-foundation-model-for-tabular-data/">TabFM</a> draw on large-scale synthetic pretraining, while time-series models such as <a href="https://arxiv.org/abs/2310.10688">TimesFM</a> learn from substantial real-world and synthetic corpora.</p>
        <p>Scientific analysis, however, asks for more than prediction. Reliable inference and hypothesis testing are equally important. I am interested in how foundation models can address these statistical tasks while preserving valid uncertainty quantification.</p>
      </details>
      <details>
        <summary>Stat for AI</summary>
        <p>Multimodal AI brings together data types that statisticians have long studied. I am interested in how statistical reasoning about relationships across modalities and uncertainty can make these models more reliable and effective.</p>
        <p>As data analysis becomes more automated and accessible to non-statisticians, it becomes increasingly important to evaluate whether the resulting analyses are sound. I am interested in using statistical principles to help automated systems choose appropriate methods, assess their results, and communicate uncertainty.</p>
      </details>
      <details>
        <summary>Applications</summary>
        <p>Genomic studies and electronic health records often involve complex data structures, including multimodal measurements, blockwise missingness, and distribution shift. I am interested in applying principled statistical methods to address these challenges in real-world studies.</p>
      </details>
    </div>
  </section>

  <section class="content-section">
    <h2>Selected publications in scientific applications</h2>
    <ul class="work-list">
      <li><a href="https://doi.org/10.1177/17455057231190952">Longitudinal changes in objective sleep parameters during pregnancy</a></li>
    </ul>
  </section>

  <section class="content-section">
    <h2>Earlier selected publications in statistical methodology</h2>
    <ul class="work-list">
      {% for project in site.data.finished_projects %}
        <li><a href="{{ project.url }}">{{ project.title }}</a></li>
      {% endfor %}
    </ul>
  </section>

  <p class="section-link">For a complete and current list of papers, visit <a href="https://scholar.google.com/citations?user=iRt0ZAgAAAAJ&hl=en">Google Scholar <span aria-hidden="true">→</span></a>.</p>
</div>
