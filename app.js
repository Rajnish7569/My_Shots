/* ============================================================
   My Shots — app.js
   ============================================================ */

'use strict';

/* ── State ── */
let photos      = [];
let searchQuery = '';
let editingId   = null;
let lbIndex     = 0;

/* ── DOM refs ── */
const gallery        = document.getElementById('gallery');
const emptyState     = document.getElementById('empty-state');
const noResults      = document.getElementById('no-results');
const noResultsQuery = document.getElementById('no-results-query');
const fileInput      = document.getElementById('file-input');
const countEl        = document.getElementById('photo-count');
const searchInput    = document.getElementById('search-input');
const searchClear    = document.getElementById('search-clear');
const searchStatus   = document.getElementById('search-status');

/* ============================================================
   FILE HANDLING
   ============================================================ */
fileInput.addEventListener('change', e => handleFiles(e.target.files));

function handleFiles(fileList) {
  Array.from(fileList).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      photos.push({
        id  : Date.now() + Math.random(),
        name: stripExt(file.name),
        desc: '',
        size: file.size,
        date: new Date(),
        src : e.target.result,
      });
      renderGallery();
      updateStats();
    };
    reader.readAsDataURL(file);
  });
  fileInput.value = '';
}

function stripExt(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

/* ============================================================
   SEARCH
   ============================================================ */
function onSearch(value) {
  searchQuery = value.trim().toLowerCase();
  searchClear.classList.toggle('visible', searchQuery.length > 0);
  renderGallery();
}

function clearSearch() {
  searchInput.value = '';
  searchQuery = '';
  searchClear.classList.remove('visible');
  renderGallery();
  searchInput.focus();
}

function filteredPhotos() {
  if (!searchQuery) return photos;
  return photos.filter(p =>
    p.name.toLowerCase().includes(searchQuery) ||
    (p.desc && p.desc.toLowerCase().includes(searchQuery))
  );
}

function highlight(text, query) {
  if (!query) return escapeHTML(text);
  const safe  = escapeHTML(text);
  const safeQ = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(`(${safeQ})`, 'gi'), '<span class="hl">$1</span>');
}

/* ============================================================
   SORT
   ============================================================ */
function sortPhotos(mode) {
  const sorts = {
    newest: (a, b) => b.date - a.date,
    oldest: (a, b) => a.date - b.date,
    name  : (a, b) => a.name.localeCompare(b.name),
  };
  if (sorts[mode]) { photos.sort(sorts[mode]); renderGallery(); }
}

/* ============================================================
   RENDER
   ============================================================ */
function renderGallery() {
  // Clear existing cards
  gallery.innerHTML = '';

  const results   = filteredPhotos();
  const hasPhotos = photos.length > 0;
  const hasResults= results.length > 0;

  // Show/hide states
  emptyState.style.display = !hasPhotos ? 'flex' : 'none';
  noResults.style.display  = (hasPhotos && !hasResults) ? 'flex' : 'none';

  // Search status label
  if (searchQuery && hasResults) {
    searchStatus.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${searchQuery}"`;
  } else {
    searchStatus.textContent = '';
  }

  if (hasPhotos && !hasResults) {
    noResultsQuery.textContent = searchQuery;
  }

  results.forEach((photo, idx) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.id = photo.id;
    card.style.animationDelay = (idx * 0.035) + 's';
    card.innerHTML = buildCardHTML(photo, idx);
    gallery.appendChild(card);
  });
}

function buildCardHTML(photo, idx) {
  return `
    <div class="img-wrap">
      <img src="${photo.src}" alt="${escapeAttr(photo.name)}" loading="lazy">
      <div class="img-overlay">
        <div class="overlay-actions">
          <button class="overlay-btn view-img-btn" title="View fullscreen"         onclick="openLightbox(${idx})">${iconSearch()}</button>
          <button class="overlay-btn edit-btn"     title="Edit name & description" onclick="openEditModal('${photo.id}')">${iconEdit()}</button>
          <button class="overlay-btn del-btn"      title="Delete"                  onclick="deletePhoto('${photo.id}')">${iconTrash()}</button>
        </div>
        <div class="overlay-meta">
          <div class="ov-name">${highlight(photo.name, searchQuery)}</div>
          ${photo.desc ? `<div class="ov-desc">${highlight(photo.desc, searchQuery)}</div>` : ''}
        </div>
      </div>
    </div>`;
}

/* ============================================================
   DELETE
   ============================================================ */
function deletePhoto(id) {
  const idx = photos.findIndex(p => p.id == id);
  if (idx === -1) return;
  photos.splice(idx, 1);
  renderGallery();
  updateStats();
}

/* ============================================================
   STATS
   ============================================================ */
function updateStats() {
  countEl.textContent = photos.length;
}

/* ============================================================
   EDIT MODAL
   ============================================================ */
function openEditModal(id) {
  const photo = photos.find(p => p.id == id);
  if (!photo) return;
  editingId = id;
  document.getElementById('modal-thumb').src  = photo.src;
  document.getElementById('modal-name').value = photo.name;
  document.getElementById('modal-desc').value = photo.desc || '';
  document.getElementById('edit-modal').classList.add('open');
  setTimeout(() => document.getElementById('modal-name').focus(), 120);
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('open');
  editingId = null;
}

function saveEdit() {
  if (!editingId) return;
  const photo = photos.find(p => p.id == editingId);
  if (!photo) return;
  const newName = document.getElementById('modal-name').value.trim();
  const newDesc = document.getElementById('modal-desc').value.trim();
  photo.name = newName || photo.name;
  photo.desc = newDesc;
  closeEditModal();
  renderGallery();
}

document.getElementById('edit-modal').addEventListener('click', function(e) {
  if (e.target === this) closeEditModal();
});
document.getElementById('modal-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') saveEdit();
});

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(idx) {
  lbIndex = idx;
  document.getElementById('lightbox').classList.add('open');
  updateLightbox();
  document.addEventListener('keydown', lbKeyHandler);
}

function updateLightbox() {
  const results = filteredPhotos();
  const photo   = results[lbIndex];
  if (!photo) return;
  document.getElementById('lb-img').src          = photo.src;
  document.getElementById('lb-name').textContent = photo.name;
  document.getElementById('lb-desc').textContent = photo.desc || '';
  document.getElementById('lb-caption').textContent = `${lbIndex + 1} / ${results.length}`;
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.removeEventListener('keydown', lbKeyHandler);
}

function lbNav(dir) {
  const len = filteredPhotos().length;
  lbIndex   = (lbIndex + dir + len) % len;
  updateLightbox();
}

function lbKeyHandler(e) {
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') lbNav(1);
  if (e.key === 'ArrowLeft')  lbNav(-1);
}

document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

/* ============================================================
   HELPERS
   ============================================================ */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}

function iconSearch() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>`;
}
function iconEdit() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>`;
}
function iconTrash() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>`;
}
