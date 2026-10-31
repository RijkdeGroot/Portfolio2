/**
 * RIJK DE GROOT - PORTFOLIO JAVASCRIPT
 * Features:
 *  - "Show me something at random" engine
 *  - "I'm looking for..." Live Search with instantaneous preview
 *  - Interactive Project Detail Lightbox Modal
 *  - Category filter tabs on Portfolio page
 *  - Wireframe viewer modal
 *  - Interactive Contact Form with feedback
 */

// Portfolio Projects Dataset
const PROJECTS_DATA = [
  {
    id: 1,
    title: "Dice Joystick",
    category: "3d",
    categoryLabel: "3D Design",
    image: "images/blenderDiceJoystick.png",
    shortDesc: "Teaching myself blender by making a joystick with a custom head.",
    fullDesc: "Teaching myself blender by making a joystick with a custom head. It depicts a 20 sided dice (commonly referred to as a D20) typical of table top RPG games such as Dungeons and dragon.",
    tools: ["Blender", "Hard-surface modeling"],
    year: "2026",
    role: "3D Design"
  },
  {
    id: 2,
    title: "Catch Me If You Can",
    category: "storytelling",
    categoryLabel: "Storytelling",
    image: "https://www.youtube.com/embed/lhvToab1TLI",
    mediaType: "embed",
    shortDesc: "Opening credits inspired by the popular movie about a young master scammer.",
    fullDesc: "Catch Me If You Can was a relatively popular movie back in the day, loosely based on a real story about a young man who becomes a master scammer. In this exercise I made opening credits for the movie to practise both my animation and storytelling ability, capturing the feeling of the movie in its opening credits.",
    tools: ["Animation", "Motion design"],
    year: "2026",
    role: "Storytelling"
  },
  {
    id: 3,
    title: "Portfolio Blueprint",
    category: "conceptual",
    categoryLabel: "Conceptualising",
    image: "images/wireframe.jpg",
    shortDesc: "The hand-drawn layout that established the portfolio's visual direction.",
    fullDesc: "Portfolio Blueprint documents the original sketch behind this portfolio: a rough spatial plan translated into a working digital experience.",
    tools: ["Sketching", "Art direction"],
    year: "2026",
    role: "Conceptualising"
  },
  {
    id: 4,
    title: "Flappybird clone",
    category: "3d",
    categoryLabel: "3D Design",
    image: "https://www.youtube.com/embed/jkinLw42e80",
    mediaType: "embed",
    shortDesc: "An exploration of Unity by making a flappy bird clone using free assets I found online.",
    fullDesc: "An exploration of Unity by making a flappy bird clone using free assets I found online.",
    tools: ["Unity", "Game development"],
    year: "2026",
    role: "3D Design"
  },
  {
    id: 5,
    title: "Protest Poster",
    category: "storytelling",
    categoryLabel: "Storytelling",
    image: "images/collectief1_RijkdeGroot_poster(2).png",
    shortDesc: "‘They won’t stop at Ukraine’ is a protest poster made for the ‘Stop!’ assignment from Graphic Matters.",
    fullDesc: "‘They won’t stop at Ukraine’ is a protest poster made for the ‘Stop!’ assignment from Graphic Matters. In it students were asked to make posters about subjects they believe something should be done, or should be stopped. Due to my own beliefs about the unjust invasion of Ukraine, I made the following poster.",
    tools: ["Poster design", "Visual communication", "Adobe Illustrator"],
    year: "2026",
    role: "Storytelling"
  },
  {
    id: 6,
    title: "1 April reclame",
    category: "storytelling conceptual",
    categoryLabel: "Storytelling",
    tags: ["Storytelling", "Conceptualising"],
    image: "images/CoraMora.png",
    shortDesc: "For this assignment I had to set up an April Fools joke campaign for the brand Mora.",
    fullDesc: "For this assignment I had to set up an April Fools joke campaign for the brand Mora. This assignment came from the agency known as Fightclub.",
    tools: ["Campaign concept", "Brand storytelling"],
    year: "2026",
    role: "Storytelling / Conceptualising"
  }
];

// Site Pages for Search Index
const SITE_PAGES = [
  { title: "Home Page", url: "index.html", category: "Navigation", snippet: "Main portfolio overview, wireframe intro, featured works" },
  { title: "Projects & Portfolio", url: "projects.html", category: "Navigation", snippet: "Complete showcase of 3D design, storytelling, and conceptual works" },
  { title: "About Rijk de Groot", url: "about.html", category: "Navigation", snippet: "Biography, creative background, skills, and disciplines" },
  { title: "Contact", url: "contact.html", category: "Navigation", snippet: "Get in touch, inquiry form, collaborations, and social links" }
];

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initRandomizer();
  initModal();
  initProjectCards();
  initFilters();
  initContactForm();
  initWireframeViewer();
  highlightActiveNav();
});

function initProjectCards() {
  document.querySelectorAll('.project-card[data-project-id]').forEach(card => {
    const projectId = parseInt(card.getAttribute('data-project-id'), 10);
    const project = PROJECTS_DATA.find(item => item.id === projectId);
    if (!project) return;

    const tagLabels = Array.isArray(project.tags) && project.tags.length ? project.tags : [project.categoryLabel || 'Project'];
    card.setAttribute('data-category', project.category || tagLabels.join(' '));

    const thumb = card.querySelector('.project-thumb-box');
    const tags = card.querySelector('.project-tags');
    const title = card.querySelector('.project-card-title');
    const excerpt = card.querySelector('.project-card-excerpt');
    const action = card.querySelector('.project-action-link');
    const footerMeta = card.querySelector('.project-card-footer span:last-child');
    const mediaMarkup = project.mediaType === 'embed'
      ? `<iframe src="${project.image}" class="project-svg-graphic project-embed" title="${escapeHtml(project.title)}" loading="lazy" allowfullscreen></iframe>`
      : project.mediaType === 'video'
      ? `<video src="${project.image}" class="project-svg-graphic" autoplay muted loop playsinline preload="metadata" aria-label="${escapeHtml(project.title)}"></video>`
      : project.mediaType === 'pdf'
        ? `<object data="${project.image}" type="application/pdf" class="project-svg-graphic" aria-label="${escapeHtml(project.title)}" style="width:100%; height:100%; background:#fff;"><p style="padding:1rem;">PDF preview unavailable.</p></object>`
        : `<img src="${project.image}" alt="${escapeHtml(project.title)}" class="project-svg-graphic">`;

    if (thumb) {
      thumb.querySelector('.project-svg-graphic')?.remove();
      thumb.insertAdjacentHTML('afterbegin', mediaMarkup);
      const mark = thumb.querySelector('.thumb-overlay-mark');
      if (mark) mark.textContent = project.mediaType === 'video' ? 'Motion' : project.mediaType === 'embed' ? 'Play' : 'View';
    }
    if (tags) tags.innerHTML = tagLabels.map(label => `<span class="project-tag">${escapeHtml(label)}</span>`).join('');
    if (title) title.textContent = project.title;
    if (excerpt) excerpt.textContent = project.shortDesc || '';
    if (action) action.textContent = 'View Project ->';
    if (footerMeta) footerMeta.textContent = project.year;
  });
}

/* ==========================================================================
   1. "I'M LOOKING FOR..." SEARCH ENGINE
   ========================================================================== */
function initSearch() {
  const searchInputs = document.querySelectorAll('.search-input');

  searchInputs.forEach(input => {
    const wrapper = input.closest('.search-wrapper');
    if (!wrapper) return;

    let dropdown = wrapper.querySelector('.search-results-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'search-results-dropdown';
      wrapper.appendChild(dropdown);
    }

    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        dropdown.classList.remove('show');
        dropdown.innerHTML = '';
        return;
      }

      // Search across projects
      const matchedProjects = PROJECTS_DATA.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query) ||
        p.shortDesc.toLowerCase().includes(query) ||
        p.tools.some(t => t.toLowerCase().includes(query))
      );

      // Search across pages
      const matchedPages = SITE_PAGES.filter(page => 
        page.title.toLowerCase().includes(query) ||
        page.snippet.toLowerCase().includes(query)
      );

      let html = '';

      if (matchedProjects.length === 0 && matchedPages.length === 0) {
        html = `<div class="no-results">No matches found for "${escapeHtml(query)}"</div>`;
      } else {
        if (matchedProjects.length > 0) {
          html += `<div style="font-size:0.75rem; font-weight:800; color:var(--text-light); text-transform:uppercase; margin:0.4rem 0.6rem 0.2rem;">Projects</div>`;
          matchedProjects.forEach(proj => {
            html += `
              <a href="javascript:void(0)" class="search-result-item" data-project-id="${proj.id}">
                <div class="search-result-category">${escapeHtml(proj.categoryLabel)}</div>
                <div class="search-result-title">${escapeHtml(proj.title)}</div>
              </a>
            `;
          });
        }

        if (matchedPages.length > 0) {
          html += `<div style="font-size:0.75rem; font-weight:800; color:var(--text-light); text-transform:uppercase; margin:0.6rem 0.6rem 0.2rem;">Pages</div>`;
          matchedPages.forEach(p => {
            html += `
              <a href="${p.url}" class="search-result-item">
                <div class="search-result-category">Page</div>
                <div class="search-result-title">${escapeHtml(p.title)}</div>
              </a>
            `;
          });
        }
      }

      dropdown.innerHTML = html;
      dropdown.classList.add('show');

      // Bind click on project results
      dropdown.querySelectorAll('[data-project-id]').forEach(link => {
        link.addEventListener('click', (ev) => {
          ev.preventDefault();
          const projId = parseInt(link.getAttribute('data-project-id'), 10);
          dropdown.classList.remove('show');
          openProjectModal(projId);
        });
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });

    // Keyboard navigation (Enter)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstLink = dropdown.querySelector('.search-result-item');
        if (firstLink) {
          firstLink.click();
        }
      }
    });
  });
}

/* ==========================================================================
   2. "SHOW ME SOMETHING AT RANDOM" ENGINE
   ========================================================================== */
function initRandomizer() {
  const randomBtns = document.querySelectorAll('.btn-random, [data-action="random"]');
  
  randomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Visual button feedback
      const icon = btn.querySelector('.btn-random-icon');
      if (icon) {
        icon.style.transform = 'rotate(360deg) scale(1.3)';
        setTimeout(() => { icon.style.transform = ''; }, 450);
      }

      // Pick a random project from PROJECTS_DATA
      const randomIndex = Math.floor(Math.random() * PROJECTS_DATA.length);
      const chosenProject = PROJECTS_DATA[randomIndex];

      // Open in modal
      openProjectModal(chosenProject.id);
    });
  });
}

/* ==========================================================================
   3. PROJECT MODAL LIGHTBOX
   ========================================================================== */
function initModal() {
  // Bind all elements with data-project-id
  document.querySelectorAll('[data-project-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      // Don't trigger if clicked a nested direct button
      const id = parseInt(el.getAttribute('data-project-id'), 10);
      if (id) {
        openProjectModal(id);
      }
    });
  });

  // Check URL params for ?project=ID
  const urlParams = new URLSearchParams(window.location.search);
  const projectIdParam = urlParams.get('project');
  if (projectIdParam) {
    const id = parseInt(projectIdParam, 10);
    if (!isNaN(id)) {
      setTimeout(() => openProjectModal(id), 250);
    }
  }

  // Close modal bindings
  const overlay = document.getElementById('project-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn')) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

function openProjectModal(projectId) {
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  let overlay = document.getElementById('project-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'project-modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-container">
        <button class="modal-close-btn" aria-label="Close modal">&times;</button>
        <div class="modal-content" id="modal-project-content"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn')) {
        closeModal();
      }
    });
  }

  const contentBox = overlay.querySelector('#modal-project-content');
  const projectTags = Array.isArray(project.tags) && project.tags.length ? project.tags : [project.categoryLabel || 'Project'];
  const mediaMarkup = project.mediaType === 'embed'
    ? `<iframe src="${project.image}" class="modal-project-embed" title="${escapeHtml(project.title)}" loading="lazy" allowfullscreen></iframe>`
    : project.mediaType === 'video'
    ? `<video src="${project.image}" controls autoplay muted playsinline style="width:100%; height:100%; object-fit:cover;" aria-label="${escapeHtml(project.title)}"></video>`
    : project.mediaType === 'pdf'
      ? `<object data="${project.image}" type="application/pdf" class="modal-project-image" style="width:100%; min-height: 420px; background:#fff; border:1px solid var(--border-color);"><p style="padding:1rem;">PDF preview unavailable.</p></object>`
      : `<img src="${project.image}" alt="${escapeHtml(project.title)}" class="modal-project-image" style="width:100%; height:100%; object-fit:contain;">`;
  const descriptionMarkup = project.fullDesc ? `<p style="margin-bottom: 1.25rem;">${escapeHtml(project.fullDesc)}</p>` : '';
  const toolList = project.tools && project.tools.length ? project.tools.map(tool => `<span class="project-tag">${escapeHtml(tool)}</span>`).join('') : '';
  contentBox.innerHTML = `
    <div class="modal-hero-art">
      ${mediaMarkup}
    </div>
    <div class="modal-category-badge">${escapeHtml(projectTags.join(' / '))}</div>
    <h2 class="modal-title">${escapeHtml(project.title)}</h2>
    
    <div class="modal-meta-grid">
      <div class="modal-meta-item">
        <strong>Discipline</strong>
        <span>${escapeHtml(project.role || projectTags[0])}</span>
      </div>
      <div class="modal-meta-item">
        <strong>Timeline</strong>
        <span>${escapeHtml(project.year)}</span>
      </div>
      <div class="modal-meta-item">
        <strong>Primary Tools</strong>
        <span>${project.tools && project.tools.length ? project.tools.slice(0, 2).join(', ') : 'Concept development'}</span>
      </div>
    </div>

    <div class="modal-body-text">
      ${descriptionMarkup}
    </div>

    <div style="margin-top: 1.5rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
      ${toolList}
    </div>

    <div style="margin-top: 2rem; display:flex; justify-content:space-between; align-items:center; border-top:1.5px dashed var(--border-light); padding-top:1.25rem;">
      <button class="wireframe-btn" style="min-width:auto; padding:0.6rem 1.4rem; font-size:0.95rem;" onclick="closeModal()">Back to Page</button>
      <a href="contact.html" class="wireframe-btn" style="min-width:auto; padding:0.6rem 1.4rem; font-size:0.95rem; background-color:var(--accent); color:var(--bg-dark); border-color:var(--border-color);">Inquire About Work &rarr;</a>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('project-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
  const wireframeOverlay = document.getElementById('wireframe-modal-overlay');
  if (wireframeOverlay) {
    wireframeOverlay.classList.remove('active');
  }
  document.body.style.overflow = '';
}

/* ==========================================================================
   4. CATEGORY FILTER (On projects.html)
   ========================================================================== */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ==========================================================================
   5. CONTACT FORM INTERACTION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const feedbackBox = document.getElementById('form-feedback');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const discipline = document.getElementById('contact-discipline')?.selectedOptions[0]?.textContent.trim();
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !message) {
      return;
    }

    const subject = `Portfolio inquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Primary interest: ${discipline}`,
      '',
      message
    ].join('\n');

    window.location.href = `mailto:rc.degroot@student.avans.nl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (feedbackBox) {
      feedbackBox.innerHTML = `
        <strong>Your email draft is ready, ${escapeHtml(name)}.</strong><br>
        Complete and send it from your email application.
      `;
      feedbackBox.classList.add('show');
    }

    contactForm.reset();
  });
}

/* ==========================================================================
   6. WIREFRAME SKETCH LIGHTBOX VIEWER
   ========================================================================== */
function initWireframeViewer() {
  const wireframeLinks = document.querySelectorAll('[data-action="view-wireframe"]');
  if (wireframeLinks.length === 0) return;

  wireframeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openWireframeModal();
    });
  });
}

function openWireframeModal() {
  let overlay = document.getElementById('wireframe-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'wireframe-modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 650px;">
        <button class="modal-close-btn" aria-label="Close wireframe">&times;</button>
        <div class="modal-content" style="text-align: center;">
          <h3 style="margin-bottom: 0.75rem; font-size:1.5rem; text-transform:uppercase;">Hand-Drawn Wireframe Reference</h3>
          <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.25rem;">
            The original conceptual sketch (20260907_114628.jpg) upon which this entire layout and architecture are built.
          </p>
          <img src="images/wireframe.jpg" alt="Hand-drawn wireframe sketch by Rijk de Groot" style="width:100%; border:2px solid var(--border-color); border-radius:4px; margin-bottom:1rem;">
          <button class="wireframe-btn" style="min-width:auto; padding:0.5rem 1.5rem; font-size:0.95rem;" onclick="closeModal()">Close Viewer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn')) {
        closeModal();
      }
    });
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   7. NAVIGATION ACTIVE STATE HELPER
   ========================================================================== */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.header-nav .nav-link, .home-btn');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Utility: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
