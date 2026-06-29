'use strict';

/* ===================================================
   CONSTANTS
=================================================== */
const NOTE_COLORS = [
  { value: '#6366F1', label: 'Indigo' },
  { value: '#10B981', label: 'Emerald' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EF4444', label: 'Red' },
  { value: '#8B5CF6', label: 'Violet' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#F97316', label: 'Orange' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#14B8A6', label: 'Teal' },
  { value: '#64748B', label: 'Slate' },
];

const PRIORITY_ORDER = { Critical: 4, High: 3, Medium: 2, Low: 1 };

const LS_KEYS = {
  NOTES: 'nv_notes',
  THEME: 'nv_theme',
  FILTERS: 'nv_filters',
  SORT: 'nv_sort',
  DRAFT: 'nv_draft',
};

/* ===================================================
   STATE
=================================================== */
let state = {
  notes: [],
  filters: { category: '', priority: '', status: '', color: '' },
  sort: 'createdDesc',
  view: 'main',        // 'main' | 'favorites' | 'archived'
  search: '',
  selectedIds: new Set(),
  editingId: null,
};

/* ===================================================
   LOCAL STORAGE HELPERS
=================================================== */
function lsGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota or disabled */ }
}

function lsRemove(key) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

/* ===================================================
   NOTES CRUD
=================================================== */
function loadNotes() {
  const raw = lsGet(LS_KEYS.NOTES, []);
  if (!Array.isArray(raw)) { state.notes = []; return; }
  // Filter only valid notes, skip broken ones silently
  const valid = [];
  let skipped = 0;
  raw.forEach(n => {
    try {
      if (isValidNote(n)) valid.push(n);
      else skipped++;
    } catch { skipped++; }
  });
  state.notes = valid;
  if (skipped > 0) console.warn(`NoteVault: skipped ${skipped} corrupted note(s) from storage`);
}

function saveNotes() {
  lsSet(LS_KEYS.NOTES, state.notes);
}

function isValidNote(n) {
  return n && typeof n === 'object' && n.id && typeof n.title === 'string';
}

function createNote(data) {
  const now = Date.now();
  return {
    id: `${now}_${Math.random().toString(36).slice(2, 8)}`,
    title: data.title,
    description: data.description,
    category: data.category || 'Other',
    priority: data.priority || 'Medium',
    status: data.status || 'Active',
    color: data.color || NOTE_COLORS[0].value,
    tags: Array.isArray(data.tags) ? data.tags : [],
    favorite: false,
    createdAt: now,
    updatedAt: now,
  };
}

function addNote(data) {
  const note = createNote(data);
  state.notes.unshift(note);
  saveNotes();
  return note;
}

function updateNote(id, data) {
  const idx = state.notes.findIndex(n => n.id === id);
  if (idx === -1) return false;
  state.notes[idx] = { ...state.notes[idx], ...data, id, updatedAt: Date.now() };
  saveNotes();
  return true;
}

function deleteNote(id) {
  const idx = state.notes.findIndex(n => n.id === id);
  if (idx === -1) return null;
  const [removed] = state.notes.splice(idx, 1);
  saveNotes();
  return removed;
}

function deleteNotes(ids) {
  const removed = state.notes.filter(n => ids.has(n.id));
  state.notes = state.notes.filter(n => !ids.has(n.id));
  saveNotes();
  return removed;
}

function toggleFavorite(id) {
  const note = state.notes.find(n => n.id === id);
  if (!note) return;
  note.favorite = !note.favorite;
  note.updatedAt = Date.now();
  saveNotes();
}

/* ===================================================
   FILTERING & SORTING
=================================================== */
function getFilteredNotes() {
  let result = [...state.notes];

  // View filter
  if (state.view === 'favorites') {
    result = result.filter(n => n.favorite && n.status !== 'Archived');
  } else if (state.view === 'archived') {
    result = result.filter(n => n.status === 'Archived');
  } else {
    result = result.filter(n => n.status !== 'Archived');
  }

  // Search
  if (state.search) {
    const q = state.search.toLowerCase();
    result = result.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Filters
  const { category, priority, status, color } = state.filters;
  if (category) result = result.filter(n => n.category === category);
  if (priority) result = result.filter(n => n.priority === priority);
  if (status) result = result.filter(n => n.status === status);
  if (color) result = result.filter(n => n.color === color);

  // Sort
  result.sort((a, b) => {
    switch (state.sort) {
      case 'createdAsc':  return a.createdAt - b.createdAt;
      case 'createdDesc': return b.createdAt - a.createdAt;
      case 'updatedAsc':  return a.updatedAt - b.updatedAt;
      case 'updatedDesc': return b.updatedAt - a.updatedAt;
      case 'titleAZ':     return a.title.localeCompare(b.title);
      case 'titleZA':     return b.title.localeCompare(a.title);
      case 'priority':    return (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
      default:            return b.createdAt - a.createdAt;
    }
  });

  return result;
}

/* ===================================================
   STATS
=================================================== */
function updateStats() {
  const all = state.notes;
  const archived = all.filter(n => n.status === 'Archived');
  const active = all.filter(n => n.status === 'Active');
  const completed = all.filter(n => n.status === 'Completed');
  const favorites = all.filter(n => n.favorite);

  el('statTotal').textContent = all.length;
  el('statActive').textContent = active.length;
  el('statCompleted').textContent = completed.length;
  el('statArchived').textContent = archived.length;
  el('statFavorites').textContent = favorites.length;
}

/* ===================================================
   RENDER
=================================================== */
function el(id) { return document.getElementById(id); }

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
         ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function makeBadge(cls, text) {
  const b = document.createElement('span');
  b.className = `badge ${cls}`;
  b.textContent = text;
  return b;
}

function statusBadgeClass(status) {
  switch (status) {
    case 'Active':      return 'badge--status-active';
    case 'In Progress': return 'badge--status-progress';
    case 'Completed':   return 'badge--status-completed';
    case 'Archived':    return 'badge--status-archived';
    default:            return '';
  }
}

function priorityBadgeClass(priority) {
  return `badge--priority-${priority.toLowerCase()}`;
}

function renderNotes() {
  const grid = el('notesGrid');
  const emptyState = el('emptyState');
  const filtered = getFilteredNotes();
  const selectionMode = state.selectedIds.size > 0;

  // Selection mode UI
  document.querySelector('.notes-grid').classList.toggle('selection-mode', selectionMode);
  el('selectAllLabel').hidden = filtered.length === 0;
  el('bulkActionsSection').hidden = state.selectedIds.size === 0;
  el('selectedCount').textContent = `${state.selectedIds.size} selected`;
  el('selectAllCheckbox').checked = filtered.length > 0 && filtered.every(n => state.selectedIds.has(n.id));

  // Empty state
  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyState.hidden = false;
    updateEmptyState();
    return;
  }
  emptyState.hidden = true;

  // Render cards
  grid.innerHTML = '';
  filtered.forEach(note => {
    try {
      grid.appendChild(buildNoteCard(note));
    } catch (err) {
      console.error('NoteVault: failed to render note', note?.id, err);
    }
  });
}

function updateEmptyState() {
  const hasSearch = !!state.search;
  const hasFilters = Object.values(state.filters).some(Boolean);
  el('emptyTitle').textContent = hasSearch || hasFilters ? 'No notes match your search' : 'No notes here';
  el('emptySub').textContent = hasSearch || hasFilters
    ? 'Try different search terms or clear your filters'
    : state.view === 'favorites' ? 'Star a note to add it to favorites'
    : state.view === 'archived' ? 'Archived notes will appear here'
    : 'Create your first note to get started';
}

function buildNoteCard(note) {
  const card = document.createElement('article');
  card.className = 'note-card';
  card.style.setProperty('--note-color', note.color);
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Note: ${note.title}`);

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'note-card__checkbox';
  checkbox.checked = state.selectedIds.has(note.id);
  checkbox.setAttribute('aria-label', `Select note: ${note.title}`);
  checkbox.addEventListener('change', (e) => {
    e.stopPropagation();
    if (checkbox.checked) state.selectedIds.add(note.id);
    else state.selectedIds.delete(note.id);
    renderNotes();
  });

  // Header
  const header = document.createElement('div');
  header.className = 'note-card__header';

  const title = document.createElement('h3');
  title.className = 'note-card__title';
  title.textContent = note.title;

  const star = document.createElement('button');
  star.className = `note-card__star${note.favorite ? ' active' : ''}`;
  star.textContent = note.favorite ? '★' : '☆';
  star.setAttribute('aria-label', note.favorite ? 'Remove from favorites' : 'Add to favorites');
  star.setAttribute('aria-pressed', String(note.favorite));
  star.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(note.id);
    renderAll();
  });

  header.append(checkbox, title, star);

  // Excerpt
  const excerpt = document.createElement('p');
  excerpt.className = 'note-card__excerpt';
  excerpt.textContent = note.description.length > 150
    ? note.description.slice(0, 150) + '…'
    : note.description;

  // Meta badges
  const meta = document.createElement('div');
  meta.className = 'note-card__meta';
  meta.append(
    makeBadge('badge--category', note.category),
    makeBadge(priorityBadgeClass(note.priority), note.priority),
    makeBadge(statusBadgeClass(note.status), note.status),
  );

  // Tags
  let tagsEl = null;
  if (note.tags.length > 0) {
    tagsEl = document.createElement('div');
    tagsEl.className = 'note-card__tags';
    note.tags.slice(0, 5).forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = `#${t}`;
      tagsEl.appendChild(tag);
    });
    if (note.tags.length > 5) {
      const more = document.createElement('span');
      more.className = 'tag';
      more.textContent = `+${note.tags.length - 5}`;
      tagsEl.appendChild(more);
    }
  }

  // Footer
  const footer = document.createElement('div');
  footer.className = 'note-card__footer';
  footer.innerHTML = `<span>Created: ${formatDate(note.createdAt)}</span><span>Updated: ${formatDate(note.updatedAt)}</span>`;

  // Action buttons
  const actions = document.createElement('div');
  actions.className = 'note-card__actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'note-card__action-btn';
  editBtn.setAttribute('aria-label', 'Edit note');
  editBtn.title = 'Edit';
  editBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M9 2l2 2-7 7H2v-2l7-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
  editBtn.addEventListener('click', (e) => { e.stopPropagation(); openEditModal(note.id); });

  const archiveBtn = document.createElement('button');
  archiveBtn.className = 'note-card__action-btn';
  archiveBtn.setAttribute('aria-label', note.status === 'Archived' ? 'Unarchive note' : 'Archive note');
  archiveBtn.title = note.status === 'Archived' ? 'Unarchive' : 'Archive';
  archiveBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><rect x="1" y="3" width="11" height="8" rx="1" stroke="currentColor" stroke-width="1.3"/><path d="M1 3l1.2-2h8.6L12 3" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M4.5 6.5h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;
  archiveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const newStatus = note.status === 'Archived' ? 'Active' : 'Archived';
    updateNote(note.id, { status: newStatus });
    renderAll();
    showToast(newStatus === 'Archived' ? 'Note archived' : 'Note unarchived');
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'note-card__action-btn note-card__action-btn--danger';
  deleteBtn.setAttribute('aria-label', 'Delete note');
  deleteBtn.title = 'Delete';
  deleteBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M2 3.5h9M5 3.5V2.5h3v1M4 3.5l.5 7h4l.5-7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    confirmDialog('Are you sure you want to delete this note?', () => {
      const removed = deleteNote(note.id);
      state.selectedIds.delete(note.id);
      renderAll();
      if (removed) showUndoToast(removed);
    });
  });

  // Archived notes: only unarchive allowed — hide delete and edit
  if (note.status === 'Archived') {
    deleteBtn.hidden = true;
    editBtn.hidden = true;
  }

  actions.append(editBtn, archiveBtn, deleteBtn);

  // Card click → detail
  card.addEventListener('click', () => {
    if (state.selectedIds.size > 0) {
      checkbox.checked = !checkbox.checked;
      if (checkbox.checked) state.selectedIds.add(note.id);
      else state.selectedIds.delete(note.id);
      renderNotes();
    } else {
      openDetailModal(note.id);
    }
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });

  card.append(header, excerpt, meta);
  if (tagsEl) card.appendChild(tagsEl);
  card.append(footer, actions);
  return card;
}

function renderAll() {
  updateStats();
  renderNotes();
}

/* ===================================================
   NOTE MODAL
=================================================== */
let currentTags = [];
let selectedColor = NOTE_COLORS[0].value;

function openCreateModal() {
  state.editingId = null;
  el('modalTitle').textContent = 'Create Note';
  el('saveNoteBtn').textContent = 'Save Note';
  resetModalForm();

  // Restore draft
  const draft = lsGet(LS_KEYS.DRAFT);
  if (draft && (draft.title || draft.description)) {
    el('draftBanner').hidden = false;
    fillModalForm(draft);
  } else {
    el('draftBanner').hidden = true;
  }

  showModal('noteModalOverlay');
  el('noteTitle').focus();
}

function openEditModal(id) {
  const note = state.notes.find(n => n.id === id);
  if (!note) return;
  state.editingId = id;
  el('modalTitle').textContent = 'Edit Note';
  el('saveNoteBtn').textContent = 'Save Changes';
  el('draftBanner').hidden = true;
  fillModalForm(note);
  showModal('noteModalOverlay');
  el('noteTitle').focus();
}

function fillModalForm(data) {
  el('noteTitle').value = data.title || '';
  el('noteDesc').value = data.description || '';
  el('noteCategory').value = data.category || 'Work';
  el('notePriority').value = data.priority || 'Medium';
  el('noteStatus').value = data.status || 'Active';
  currentTags = Array.isArray(data.tags) ? [...data.tags] : [];
  selectedColor = data.color || NOTE_COLORS[0].value;

  updateCharCount('noteTitle', 'titleCharCount');
  updateCharCount('noteDesc', 'descCharCount');
  renderTagChips();
  renderColorPicker();
}

function resetModalForm() {
  el('noteTitle').value = '';
  el('noteDesc').value = '';
  el('noteCategory').value = 'Work';
  el('notePriority').value = 'Medium';
  el('noteStatus').value = 'Active';
  el('tagInput').value = '';
  currentTags = [];
  selectedColor = NOTE_COLORS[0].value;
  clearFormErrors();
  el('titleCharCount').textContent = '0';
  el('descCharCount').textContent = '0';
  renderTagChips();
  renderColorPicker();
}

function clearFormErrors() {
  el('titleError').textContent = '';
  el('descError').textContent = '';
  el('tagError').textContent = '';
  el('noteTitle').classList.remove('error');
  el('noteDesc').classList.remove('error');
}

function updateCharCount(inputId, countId) {
  el(countId).textContent = el(inputId).value.length;
}

function renderColorPicker() {
  const picker = el('colorPicker');
  picker.innerHTML = '';
  NOTE_COLORS.forEach(c => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = `color-swatch${c.value === selectedColor ? ' selected' : ''}`;
    swatch.style.background = c.value;
    swatch.setAttribute('aria-label', `Color: ${c.label}`);
    swatch.setAttribute('aria-pressed', String(c.value === selectedColor));
    swatch.addEventListener('click', () => {
      selectedColor = c.value;
      renderColorPicker();
      saveDraft();
    });
    picker.appendChild(swatch);
  });
}

function renderTagChips() {
  const list = el('tagList');
  list.innerHTML = '';
  currentTags.forEach((tag, idx) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.textContent = `#${tag}`;
    const removeBtn = document.createElement('button');
    removeBtn.className = 'tag-chip__remove';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', `Remove tag ${tag}`);
    removeBtn.addEventListener('click', () => {
      currentTags.splice(idx, 1);
      renderTagChips();
      saveDraft();
    });
    chip.appendChild(removeBtn);
    list.appendChild(chip);
  });
}

function buildColorFilterGrid() {
  const grid = el('colorFilterGrid');
  grid.innerHTML = '';
  NOTE_COLORS.forEach(c => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `color-filter-dot${state.filters.color === c.value ? ' selected' : ''}`;
    dot.style.background = c.value;
    dot.setAttribute('aria-label', `Filter by ${c.label}`);
    dot.setAttribute('aria-pressed', String(state.filters.color === c.value));
    dot.addEventListener('click', () => {
      state.filters.color = state.filters.color === c.value ? '' : c.value;
      persistFilters();
      buildColorFilterGrid();
      renderAll();
    });
    grid.appendChild(dot);
  });
}

/* ===================================================
   VALIDATION
=================================================== */
function validateNoteForm() {
  let valid = true;
  clearFormErrors();
  const title = el('noteTitle').value.trim();
  const desc = el('noteDesc').value.trim();

  if (!title) {
    showFieldError('titleError', 'noteTitle', 'Title is required');
    valid = false;
  } else if (title.length < 3) {
    showFieldError('titleError', 'noteTitle', 'Title must contain at least 3 characters');
    valid = false;
  } else if (title.length > 100) {
    showFieldError('titleError', 'noteTitle', 'Title exceeds maximum length (100)');
    valid = false;
  }

  if (!desc) {
    showFieldError('descError', 'noteDesc', 'Description is required');
    valid = false;
  } else if (desc.length < 10) {
    showFieldError('descError', 'noteDesc', 'Description must be at least 10 characters');
    valid = false;
  }

  return valid;
}

function showFieldError(errorId, inputId, msg) {
  el(errorId).textContent = msg;
  el(inputId).classList.add('error');
}

/* ===================================================
   SAVE NOTE
=================================================== */
function saveNote() {
  if (!validateNoteForm()) return;
  const data = {
    title: el('noteTitle').value.trim(),
    description: el('noteDesc').value.trim(),
    category: el('noteCategory').value,
    priority: el('notePriority').value,
    status: el('noteStatus').value,
    color: selectedColor,
    tags: [...currentTags],
  };

  if (state.editingId) {
    updateNote(state.editingId, data);
    showToast('Note updated');
  } else {
    addNote(data);
    showToast('Note created');
  }

  lsRemove(LS_KEYS.DRAFT);
  closeModal('noteModalOverlay');
  state.editingId = null;
  renderAll();
}

/* ===================================================
   DRAFT
=================================================== */
function saveDraft() {
  if (state.editingId) return; // Don't draft when editing
  const data = {
    title: el('noteTitle').value,
    description: el('noteDesc').value,
    category: el('noteCategory').value,
    priority: el('notePriority').value,
    status: el('noteStatus').value,
    color: selectedColor,
    tags: [...currentTags],
  };
  if (data.title || data.description) {
    lsSet(LS_KEYS.DRAFT, data);
  }
}

let draftTimer = null;
function scheduleAutoSave() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(saveDraft, 800);
}

/* ===================================================
   DETAIL MODAL
=================================================== */
function openDetailModal(id) {
  const note = state.notes.find(n => n.id === id);
  if (!note) return;

  el('detailTitle').textContent = note.title;
  el('detailColorBar').style.background = note.color;

  const body = el('detailBody');
  body.innerHTML = '';

  // Meta grid
  const metaGrid = document.createElement('div');
  metaGrid.className = 'detail-meta-grid';
  [
    ['Unique ID', `<span class="detail-id">${note.id}</span>`],
    ['Category', note.category],
    ['Priority', note.priority],
    ['Status', note.status],
    ['Color', `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${note.color};vertical-align:middle;margin-right:6px"></span>${NOTE_COLORS.find(c => c.value === note.color)?.label || note.color}`],
    ['Favorite', note.favorite ? '★ Yes' : '☆ No'],
  ].forEach(([label, value]) => {
    const item = document.createElement('div');
    item.className = 'detail-meta-item';
    item.innerHTML = `<p class="detail-meta-label">${label}</p><p class="detail-meta-value">${value}</p>`;
    metaGrid.appendChild(item);
  });
  body.appendChild(metaGrid);

  // Description
  const descLabel = document.createElement('p');
  descLabel.className = 'detail-section-label';
  descLabel.textContent = 'Description';
  const desc = document.createElement('div');
  desc.className = 'detail-description';
  desc.textContent = note.description;
  body.append(descLabel, desc);

  // Tags
  if (note.tags.length > 0) {
    const tagsSection = document.createElement('div');
    tagsSection.className = 'detail-tags-section';
    const tLabel = document.createElement('p');
    tLabel.className = 'detail-section-label';
    tLabel.textContent = 'Tags';
    const tagsList = document.createElement('div');
    tagsList.className = 'detail-tags';
    note.tags.forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = `#${t}`;
      tagsList.appendChild(tag);
    });
    tagsSection.append(tLabel, tagsList);
    body.appendChild(tagsSection);
  }

  // Dates
  const dates = document.createElement('div');
  dates.className = 'detail-dates';
  dates.innerHTML = `<span>Created: ${formatDate(note.createdAt)}</span><span>Last Updated: ${formatDate(note.updatedAt)}</span>`;
  body.appendChild(dates);

  el('detailEditBtn').onclick = () => { closeModal('detailModalOverlay'); openEditModal(id); };
  showModal('detailModalOverlay');
}

/* ===================================================
   MODAL HELPERS
=================================================== */
function showModal(overlayId) {
  el(overlayId).hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal(overlayId) {
  el(overlayId).hidden = true;
  document.body.style.overflow = '';
}

/* ===================================================
   CONFIRM DIALOG
=================================================== */
function confirmDialog(message, onYes) {
  el('confirmMsg').textContent = message;
  showModal('confirmOverlay');
  el('confirmYes').onclick = () => { closeModal('confirmOverlay'); onYes(); };
  el('confirmNo').onclick = () => closeModal('confirmOverlay');
}

/* ===================================================
   TOAST
=================================================== */
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  el('toastContainer').appendChild(toast);
  setTimeout(() => dismissToast(toast), duration);
}

function showUndoToast(removedNote) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');

  const msg = document.createTextNode('Note deleted  ');
  const undoBtn = document.createElement('button');
  undoBtn.className = 'toast__undo';
  undoBtn.textContent = 'Undo';
  undoBtn.setAttribute('aria-label', 'Undo note deletion');

  let undone = false;
  let timer = setTimeout(() => dismissToast(toast), 10000);

  undoBtn.addEventListener('click', () => {
    if (undone) return;
    undone = true;
    clearTimeout(timer);
    state.notes.unshift(removedNote);
    saveNotes();
    renderAll();
    dismissToast(toast);
    showToast('Note restored');
  });

  toast.append(msg, undoBtn);
  el('toastContainer').appendChild(toast);
}

function dismissToast(toast) {
  toast.classList.add('hiding');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

/* ===================================================
   THEME
=================================================== */
function applyTheme(theme) {
  document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  lsSet(LS_KEYS.THEME, theme);
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark-theme');
  applyTheme(isDark ? 'light' : 'dark');
}

/* ===================================================
   EXPORT / IMPORT
=================================================== */
function exportNotes() {
  if (state.notes.length === 0) { showToast('No notes to export'); return; }
  const data = JSON.stringify(state.notes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nodevault-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Notes exported');
}

function importNotes(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) throw new Error('Invalid format');
      const valid = parsed.filter(isValidNote);
      if (valid.length === 0) { showToast('No valid notes found in file'); return; }
      // Merge (avoid duplicates by id)
      const existingIds = new Set(state.notes.map(n => n.id));
      const newNotes = valid.filter(n => !existingIds.has(n.id));
      state.notes = [...state.notes, ...newNotes];
      saveNotes();
      renderAll();
      showToast(`Imported ${newNotes.length} note(s)`);
    } catch {
      showToast('Import failed: Invalid or corrupted JSON file');
    }
  };
  reader.readAsText(file);
}

/* ===================================================
   PERSIST FILTERS
=================================================== */
function persistFilters() {
  lsSet(LS_KEYS.FILTERS, state.filters);
}

function loadPersistedState() {
  const savedFilters = lsGet(LS_KEYS.FILTERS, {});
  state.filters = { category: '', priority: '', status: '', color: '', ...savedFilters };
  state.sort = lsGet(LS_KEYS.SORT, 'createdDesc');

  // Apply to desktop sidebar DOM
  el('filterCategory').value = state.filters.category;
  el('filterPriority').value = state.filters.priority;
  el('filterStatus').value = state.filters.status;
  el('sortSelect').value = state.sort;

  // Apply to mobile panel DOM (elements exist in HTML)
  el('mobileFilterCategory').value = state.filters.category;
  el('mobileFilterPriority').value = state.filters.priority;
  el('mobileFilterStatus').value   = state.filters.status;
  el('mobileSortSelect').value     = state.sort;
}

/* ===================================================
   KEYBOARD SHORTCUTS
=================================================== */
document.addEventListener('keydown', (e) => {
  const noteModalOpen = !el('noteModalOverlay').hidden;
  const detailOpen    = !el('detailModalOverlay').hidden;
  const confirmOpen   = !el('confirmOverlay').hidden;
  const anyModalOpen  = noteModalOpen || detailOpen || confirmOpen;

  // Escape always closes the topmost open modal
  if (e.key === 'Escape') {
    if (noteModalOpen) {
      if (!state.editingId) saveDraft();
      closeModal('noteModalOverlay');
    } else if (detailOpen) {
      closeModal('detailModalOverlay');
    } else if (confirmOpen) {
      closeModal('confirmOverlay');
    }
    return;
  }

  // Ctrl+S — save note (only when note modal is open)
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    if (noteModalOpen) {
      e.preventDefault();
      saveNote();
    }
    return;
  }

  // The remaining shortcuts only work when no modal is open
  if (anyModalOpen) return;

  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    openCreateModal();
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    el('searchInput').focus();
    el('searchInput').select();
  }
});

/* ===================================================
   EVENT LISTENERS
=================================================== */
function initEventListeners() {
  // Create note
  el('createNoteBtn').addEventListener('click', openCreateModal);

  // Modal close
  el('modalCloseBtn').addEventListener('click', () => {
    if (!state.editingId) saveDraft();
    closeModal('noteModalOverlay');
  });
  el('cancelModalBtn').addEventListener('click', () => {
    if (!state.editingId) saveDraft();
    closeModal('noteModalOverlay');
  });
  el('noteModalOverlay').addEventListener('click', (e) => {
    if (e.target === el('noteModalOverlay')) {
      if (!state.editingId) saveDraft();
      closeModal('noteModalOverlay');
    }
  });

  // Detail close
  el('detailCloseBtn').addEventListener('click', () => closeModal('detailModalOverlay'));
  el('detailModalOverlay').addEventListener('click', (e) => {
    if (e.target === el('detailModalOverlay')) closeModal('detailModalOverlay');
  });

  // Save note
  el('saveNoteBtn').addEventListener('click', saveNote);

  // Input change for draft
  ['noteTitle', 'noteDesc', 'noteCategory', 'notePriority', 'noteStatus'].forEach(id => {
    el(id).addEventListener('input', () => {
      if (id === 'noteTitle') updateCharCount('noteTitle', 'titleCharCount');
      if (id === 'noteDesc') updateCharCount('noteDesc', 'descCharCount');
      scheduleAutoSave();
    });
  });

  // Tag input
  el('tagInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = el('tagInput').value.trim().replace(/^#/, '').toLowerCase();
      el('tagError').textContent = '';
      if (!val) return;
      if (val.length > 20) { el('tagError').textContent = 'Tag too long (max 20 characters)'; return; }
      if (currentTags.length >= 10) { el('tagError').textContent = 'Maximum 10 tags allowed'; return; }
      if (currentTags.includes(val)) { el('tagError').textContent = 'Tag already added'; return; }
      currentTags.push(val);
      el('tagInput').value = '';
      renderTagChips();
      saveDraft();
    }
  });
  el('tagInputWrapper').addEventListener('click', () => el('tagInput').focus());

  // Draft discard
  el('discardDraftBtn').addEventListener('click', () => {
    lsRemove(LS_KEYS.DRAFT);
    el('draftBanner').hidden = true;
    resetModalForm();
  });

  // Theme toggle
  el('themeToggleBtn').addEventListener('click', toggleTheme);

  // Search
  el('searchInput').addEventListener('input', (e) => {
    state.search = e.target.value;
    el('searchClear').hidden = !state.search;
    renderAll();
  });
  el('searchClear').addEventListener('click', () => {
    state.search = '';
    el('searchInput').value = '';
    el('searchClear').hidden = true;
    el('searchInput').focus();
    renderAll();
  });

  // Filters
  el('filterCategory').addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    persistFilters();
    renderAll();
  });
  el('filterPriority').addEventListener('change', (e) => {
    state.filters.priority = e.target.value;
    persistFilters();
    renderAll();
  });
  el('filterStatus').addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    persistFilters();
    renderAll();
  });

  // Sort
  el('sortSelect').addEventListener('change', (e) => {
    state.sort = e.target.value;
    lsSet(LS_KEYS.SORT, state.sort);
    renderAll();
  });

  // Clear filters
  el('clearFiltersBtn').addEventListener('click', () => {
    state.filters = { category: '', priority: '', status: '', color: '' };
    persistFilters();
    el('filterCategory').value = '';
    el('filterPriority').value = '';
    el('filterStatus').value = '';
    buildColorFilterGrid();
    renderAll();
  });

  // View switchers
  document.querySelectorAll('.sidebar__nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar__nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.view = btn.dataset.view;
      state.selectedIds.clear();
      const titles = { main: 'All Notes', favorites: 'Favorites', archived: 'Archived Notes' };
      el('viewTitle').textContent = titles[state.view] || 'Notes';
      renderAll();
    });
  });

  // Select all
  el('selectAllCheckbox').addEventListener('change', (e) => {
    const filtered = getFilteredNotes();
    if (e.target.checked) {
      filtered.forEach(n => state.selectedIds.add(n.id));
    } else {
      state.selectedIds.clear();
    }
    renderNotes();
  });

  // Bulk delete
  el('deleteSelectedBtn').addEventListener('click', () => {
    if (state.selectedIds.size === 0) return;
    confirmDialog(`Are you sure you want to delete ${state.selectedIds.size} note(s)?`, () => {
      const removed = deleteNotes(new Set(state.selectedIds));
      state.selectedIds.clear();
      renderAll();
      showToast(`${removed.length} note(s) deleted`);
    });
  });

  // Export / Import
  el('exportBtn').addEventListener('click', exportNotes);
  el('importBtn').addEventListener('click', () => el('importFileInput').click());
  el('importFileInput').addEventListener('change', (e) => {
    importNotes(e.target.files[0]);
    e.target.value = '';
  });

  // Mobile panel: show/hide based on viewport
  initMobilePanel();
  window.addEventListener('resize', syncMobilePanelVisibility);
}

/* ===================================================
   MOBILE PANEL
=================================================== */
function syncMobilePanelVisibility() {
  const isMobile = window.innerWidth <= 768;
  el('mobilePanel').hidden = !isMobile;
}

function initMobilePanel() {
  syncMobilePanelVisibility();

  // Sync selects to current state
  el('mobileSortSelect').value       = state.sort;
  el('mobileFilterCategory').value   = state.filters.category;
  el('mobileFilterPriority').value   = state.filters.priority;
  el('mobileFilterStatus').value     = state.filters.status;

  // Sort
  el('mobileSortSelect').addEventListener('change', (e) => {
    state.sort = e.target.value;
    el('sortSelect').value = state.sort;
    lsSet(LS_KEYS.SORT, state.sort);
    renderAll();
  });

  // Filters
  el('mobileFilterCategory').addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    el('filterCategory').value = e.target.value;
    persistFilters(); renderAll();
  });
  el('mobileFilterPriority').addEventListener('change', (e) => {
    state.filters.priority = e.target.value;
    el('filterPriority').value = e.target.value;
    persistFilters(); renderAll();
  });
  el('mobileFilterStatus').addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    el('filterStatus').value = e.target.value;
    persistFilters(); renderAll();
  });

  // Import / Export
  el('mobileExportBtn').addEventListener('click', exportNotes);
  el('mobileImportBtn').addEventListener('click', () => el('importFileInput').click());

  // View buttons
  document.querySelectorAll('.mobile-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mobile-view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Mirror desktop sidebar nav
      document.querySelectorAll('.sidebar__nav-item').forEach(b => {
        b.classList.toggle('active', b.dataset.view === btn.dataset.view);
      });
      state.view = btn.dataset.view;
      state.selectedIds.clear();
      const titles = { main: 'All Notes', favorites: 'Favorites', archived: 'Archived Notes' };
      el('viewTitle').textContent = titles[state.view] || 'Notes';
      renderAll();
    });
  });
}

/* ===================================================
   INIT
=================================================== */
function init() {
  // Load persisted data
  loadNotes();
  loadPersistedState();

  // Apply theme
  const savedTheme = lsGet(LS_KEYS.THEME, 'light');
  applyTheme(savedTheme);

  // Build color filter grid
  buildColorFilterGrid();

  // Build color picker
  renderColorPicker();

  // Event listeners
  initEventListeners();

  // Initial render
  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
