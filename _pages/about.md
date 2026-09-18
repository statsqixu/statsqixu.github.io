---
layout: about
title: home
permalink: /
subtitle:

profile: false

selected_papers: false
social: false

announcements:
  enabled: false
  scrollable: false
  limit: 5

latest_posts:
  enabled: false
---
<div class="minimal-home minimal-home-single">
  <p>
    I am a tenure-track assistant professor in the <a href="https://cla.umn.edu/statistics">School of Statistics</a> at the University of Minnesota. Prior to this, I was a postdoctoral researcher in the
    <a href="https://www.cmu.edu/dietrich/statistics-datascience/index.html">Department of Statistics &amp; Data Science</a>
    at Carnegie Mellon University, working with
    <a href="https://kathrynmroeder.github.io">Kathryn Roeder</a>
    and
    <a href="https://www.stat.cmu.edu/~jinglei/">Jing Lei</a>. Previously, I received my PhD from the
    <a href="https://www.stat.uci.edu">University of California, Irvine</a>, advised by
    <a href="https://qu.pstat.ucsb.edu">Annie Qu</a>.
    Before that, I earned an M.S. in Statistics from the
    <a href="https://stat.illinois.edu">University of Illinois Urbana-Champaign</a>
    and a B.S. in Mathematics from
    <a href="https://math.tongji.edu.cn">Tongji University</a>.
  </p>

  <section class="research-scope" aria-labelledby="research-scope-title">
    <h2 id="research-scope-title">Research</h2>
    <ul class="research-focus-list">
      <li><strong>AI for Stat:</strong> foundation models for statistical problems</li>
      <li><strong>Stat for AI:</strong> multi-modal AI and automated data analysis in the agentic loop</li>
      <li><strong>Applications:</strong> genomics, EHR</li>
    </ul>
    <p class="section-link"><a href="{{ '/research/' | relative_url }}">More about my research <span aria-hidden="true">→</span></a></p>
  </section>

  <section class="updates-section">
    <h2>Recent Updates</h2>
    {% include news.liquid limit=true %}
  </section>

</div>
