/* Shared by the static build and the browser-only editor. No dependencies. */
(function (root) {
  'use strict';
  const e = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const url = value => /^(https?:\/\/|mailto:)/i.test(String(value)) ? e(value) : '';
  const external = (href, label) => url(href) ? `<a href="${url(href)}">${e(label)}</a>` : e(label);
  const authorList = text => e(text).replace(/Zichen Sun/g, '<strong>Zichen Sun</strong>');
  const head = (data, title) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${e(data.name)} — ${e(data.tagline)}. Research, publications, and curriculum vitae.">
<meta name="theme-color" content="#ffffff"><title>${e(title)}</title>
<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="style.css"></head><body>
<a class="skip-link" href="#main">Skip to content</a>`;
  function nav(data, cv) {
    return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="index.html">${e(data.name)}</a>
<nav aria-label="Main navigation"><a ${cv ? '' : 'class="active" aria-current="page"'} href="index.html">About</a><a href="index.html#publications">Publications</a><a ${cv ? 'class="active" aria-current="page"' : ''} href="cv.html">CV</a></nav></div></header>`;
  }
  const footer = data => `<footer class="site-footer"><span>© ${e(data.name)}</span><span>Updated ${e(data.updated)} · ${external('mailto:' + data.email, 'Email')}</span></footer></body></html>`;
  function bib(p) {
    const key = 'sun' + (p.year || 'manuscript') + p.title.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '').toLowerCase();
    const authors = p.authors.replace(/†/g, '').replace(/, and /g, ', ').replace(/ and /g, ', ').split(', ').join(' and ');
    return `@article{${key},\n  title = {${p.title}},\n  author = {${authors}},\n  journal = {${p.venue}}${p.year ? ',\n  year = {' + p.year + '}' : ''}${p.doi ? ',\n  doi = {' + p.doi + '}' : ''}\n}`;
  }
  function paper(p, i, manuscript = false) {
    return `<li class="paper"><div class="paper-number">${manuscript ? 'M' : ''}${i + 1}.</div><article>
<h3>${p.url ? external(p.url, p.title) : e(p.title)}</h3>
<p class="authors">${authorList(p.authors)}</p><p class="venue"><em>${e(p.venue)}</em>${p.details ? ', ' + e(p.details) : ''}.</p>
${p.note ? `<p class="paper-note">${e(p.note)}</p>` : ''}
<div class="paper-links">${p.url ? external(p.url, 'Paper ↗') : ''}${p.code ? external(p.code, 'Code ↗') : ''}
${p.abstract ? `<details><summary>Abstract</summary><p>${e(p.abstract)}</p></details>` : ''}
<details class="bib"><summary>BibTeX</summary><pre>${e(bib(p))}</pre></details></div></article></li>`;
  }
  const papers = (data, compact = false) => `<section id="publications" class="${compact ? 'cv-section' : 'section'}"><div class="section-heading"><h2>Publications</h2>${!compact ? external(data.scholar, 'Google Scholar ↗') : ''}</div>
<ol class="papers">${data.publications.map((p, i) => paper(p, i)).join('')}</ol></section>
${data.manuscripts.length ? `<section id="manuscripts" class="${compact ? 'cv-section' : 'section manuscripts'}"><h2>Manuscripts</h2><ol class="papers">${data.manuscripts.map((p, i) => paper(p, i, true)).join('')}</ol></section>` : ''}`;
  function education(data, full = false) {
    const p = data.education;
    return `<section id="education" class="${full ? 'cv-section' : 'section'}"><h2>Education</h2><div class="education-entry"><div><h3>${e(p.institution)}</h3><p>${e(p.degree)} · ${e(p.department)}</p><p>${e(p.details)}</p></div><p class="dates">${e(p.dates)}</p></div>${full ? `<p class="courses"><strong>Selected courses:</strong> ${e(p.courses)}.</p>` : ''}</section>`;
  }
  function home(data) {
    return head(data, `${data.name} | ${data.tagline}`) + nav(data, false) + `<main id="main" class="home">
<section id="about" class="about"><h1>${e(data.name)}</h1><p class="tagline">${e(data.tagline)}</p>
<div class="profile-links">${external('mailto:' + data.email, 'Email')}<span aria-hidden="true">/</span>${external(data.scholar, 'Google Scholar')}<span aria-hidden="true">/</span>${external(data.github, 'GitHub')}<span aria-hidden="true">/</span><a href="cv.html">CV</a></div>
<div class="about-grid"><div class="bio">${data.bio.map(p => `<p>${e(p)}</p>`).join('')}</div><aside class="interests"><h2>Research interests</h2><ul>${data.interests.map(x => `<li>${e(x)}</li>`).join('')}</ul><a class="text-link" href="cv.html#experience">Research experience ↗</a></aside></div></section>
${papers(data)}${education(data)}
<section id="contact" class="section contact"><h2>Contact</h2><p>The best way to reach me is by email: ${external('mailto:' + data.email, data.email)}.</p></section></main>` + footer(data);
  }
  function cv(data) {
    return head(data, `${data.name} | Curriculum Vitae`) + nav(data, true) + `<main id="main" class="cv"><div class="cv-heading"><div><h1>${e(data.name)}</h1><p class="tagline">Curriculum Vitae</p><p class="cv-contact">${external('mailto:' + data.email, data.email)} · ${external(data.scholar, 'Google Scholar')} · ${external(data.github, 'GitHub')}</p></div><div class="cv-actions"><button class="button secondary" type="button" onclick="window.print()">Print / Save as PDF</button></div></div>
<section class="cv-section"><h2>Research interests</h2><p>${data.interests.map(e).join('; ')}.</p></section>
${education(data, true)}
<section id="experience" class="cv-section"><h2>Research experience</h2>${data.experience.map(p => `<article class="experience-entry"><div class="entry-heading"><h3>${e(p.title)}</h3><span class="dates">${e(p.dates)}</span></div><p class="affiliation">${e(p.role)} · ${e(p.group)}</p><ul>${p.points.map(x => `<li>${e(x)}</li>`).join('')}</ul></article>`).join('')}</section>
${papers(data, true)}
<section class="cv-section"><h2>Awards</h2><ul class="simple-list">${data.awards.map(x => `<li>${e(x)}</li>`).join('')}</ul></section>
<section class="cv-section"><h2>Skills</h2>${Object.entries(data.skills).map(([k,v]) => `<p class="skill"><strong>${e(k)}:</strong> ${e(v)}.</p>`).join('')}</section></main>` + footer(data);
  }
  root.SiteRender = { home, cv, bib };
})(globalThis);
