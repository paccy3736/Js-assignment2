// Seed data — default events loaded when localStorage is empty
const seedEvents = [
  { id: 1, title: 'AI Bootcamp', category: 'Technology', seats: 30, registered: 12 },
  { id: 2, title: 'Design Thinking Workshop', category: 'Workshop', seats: 20, registered: 20 },
  { id: 3, title: 'Career Fair 2025', category: 'Networking', seats: 100, registered: 45 },
  { id: 4, title: 'Web Dev Hackathon', category: 'Technology', seats: 50, registered: 23 },
  { id: 5, title: 'Public Speaking Seminar', category: 'Personal Development', seats: 40, registered: 0 },
];

// Main events array — holds all event objects during the session
let events = [];

// Generates a unique ID for each new event
function generateId() {
  if (events.length === 0) return Date.now();
  return Math.max(...events.map((e) => e.id)) + 1;
}

// Maps category names to Tailwind colour classes for the badge
const CATEGORY_COLOURS = {
  Technology: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Workshop: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Networking: { bg: 'bg-green-100', text: 'text-green-700' },
  'Personal Development': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

// Returns colour classes for a given category, defaults to grey
function getCategoryColour(category) {
  return CATEGORY_COLOURS[category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
}

// Creates and appends a single event card to the #eventsGrid
function renderSingleCard(event) {
  const remaining = event.seats - event.registered;
  const colour = getCategoryColour(event.category);

  const card = document.createElement('div');
  card.className = 'event-card bg-white rounded-xl shadow p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-200';
  card.dataset.id = String(event.id);

  const header = document.createElement('div');
  header.className = 'flex items-start justify-between gap-2';

  const title = document.createElement('h3');
  title.className = 'card-title text-lg font-bold text-gray-800';
  title.textContent = event.title;

  const badgeWrapper = document.createElement('div');
  badgeWrapper.className = 'flex flex-col items-end gap-1';

  const categoryBadge = document.createElement('span');
  categoryBadge.className = `card-category ${colour.bg} ${colour.text} text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap`;
  categoryBadge.textContent = event.category;
  badgeWrapper.appendChild(categoryBadge);

  // Show "Full" badge when no seats remain
  if (remaining === 0) {
    const fullBadge = document.createElement('span');
    fullBadge.className = 'badge-full bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full';
    fullBadge.textContent = 'Full';
    badgeWrapper.appendChild(fullBadge);
  }

  header.appendChild(title);
  header.appendChild(badgeWrapper);

  const info = document.createElement('div');
  info.className = 'text-sm text-gray-600 space-y-1';

  const seatsRow = document.createElement('p');
  seatsRow.textContent = 'Total Seats: ';
  const seatsSpan = document.createElement('span');
  seatsSpan.className = 'card-seats font-medium text-gray-800';
  seatsSpan.textContent = String(event.seats);
  seatsRow.appendChild(seatsSpan);

  const registeredRow = document.createElement('p');
  registeredRow.textContent = 'Registered: ';
  const registeredSpan = document.createElement('span');
  registeredSpan.className = 'card-registered font-medium text-gray-800';
  registeredSpan.textContent = String(event.registered);
  registeredRow.appendChild(registeredSpan);

  const remainingRow = document.createElement('p');
  remainingRow.textContent = 'Remaining: ';
  const remainingSpan = document.createElement('span');
  remainingSpan.className = `card-remaining font-medium ${remaining === 0 ? 'text-red-500' : 'text-green-600'}`;
  remainingSpan.textContent = String(remaining);
  remainingRow.appendChild(remainingSpan);

  info.appendChild(seatsRow);
  info.appendChild(registeredRow);
  info.appendChild(remainingRow);

  const actions = document.createElement('div');
  actions.className = 'flex gap-2 mt-auto pt-2';

  // Register button — disabled when event is full
  const registerBtn = document.createElement('button');
  registerBtn.className = 'btn-register flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  registerBtn.textContent = 'Register';
  registerBtn.disabled = remaining === 0;

  // Cancel button — disabled when no registrations exist
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn-cancel flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.disabled = event.registered === 0;

  actions.appendChild(registerBtn);
  actions.appendChild(cancelBtn);

  card.appendChild(header);
  card.appendChild(info);
  card.appendChild(actions);

  document.getElementById('eventsGrid').appendChild(card);
  return card;
}

// Clears the grid and renders all cards using forEach()
function renderCards(eventsToRender) {
  const grid = document.getElementById('eventsGrid');
  grid.innerHTML = '';

  if (eventsToRender.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'col-span-full text-center text-gray-500 py-12';
    placeholder.textContent = 'No events available. Add one below!';
    grid.appendChild(placeholder);
    return;
  }

  eventsToRender.forEach((event) => renderSingleCard(event));
}

// Updates the three stat counters using reduce()
function updateStats(events) {
  const totalEvents = events.length;
  const totalRegistered = events.reduce((sum, e) => sum + e.registered, 0);
  const totalRemaining = events.reduce((sum, e) => sum + (e.seats - e.registered), 0);

  document.getElementById('statTotalEvents').textContent = totalEvents;
  document.getElementById('statTotalRegistered').textContent = totalRegistered;
  document.getElementById('statTotalRemaining').textContent = totalRemaining;
}

// Patches an existing card in-place without re-rendering the whole grid
function updateCard(id, events) {
  const card = document.querySelector(`[data-id="${id}"]`);
  const event = events.find((e) => e.id === id);
  if (!card || !event) return;

  const remaining = event.seats - event.registered;

  card.querySelector('.card-registered').textContent = String(event.registered);

  const remainingSpan = card.querySelector('.card-remaining');
  remainingSpan.textContent = String(remaining);
  if (remaining === 0) {
    remainingSpan.classList.remove('text-green-600');
    remainingSpan.classList.add('text-red-500');
  } else {
    remainingSpan.classList.remove('text-red-500');
    remainingSpan.classList.add('text-green-600');
  }

  card.querySelector('.btn-register').disabled = remaining === 0;
  card.querySelector('.btn-cancel').disabled = event.registered === 0;

  // Add or remove the "Full" badge based on remaining seats
  const badgeWrapper = card.querySelector('.flex.flex-col.items-end');
  const existingBadge = badgeWrapper ? badgeWrapper.querySelector('.badge-full') : null;
  if (remaining === 0 && !existingBadge && badgeWrapper) {
    const fullBadge = document.createElement('span');
    fullBadge.className = 'badge-full bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full';
    fullBadge.textContent = 'Full';
    badgeWrapper.appendChild(fullBadge);
  } else if (remaining > 0 && existingBadge) {
    existingBadge.remove();
  }
}

// Increments registered by 1 using find(), updates UI and localStorage
function handleRegister(id) {
  const event = events.find((e) => e.id === id);
  if (!event) return;
  if (event.seats - event.registered <= 0) return; // Prevent over-registration
  event.registered += 1;
  updateCard(id, events);
  updateStats(events);
  persist(events);
}

// Decrements registered by 1 using find(), updates UI and localStorage
function handleCancel(id) {
  const event = events.find((e) => e.id === id);
  if (!event) return;
  if (event.registered <= 0) return; // Prevent negative registrations
  event.registered -= 1;
  updateCard(id, events);
  updateStats(events);
  persist(events);
}

// Saves the events array to localStorage using JSON.stringify()
function persist(events) {
  try {
    localStorage.setItem('events', JSON.stringify(events));
  } catch (err) {
    console.warn('localStorage write failed:', err);
    alert('Could not save data: storage quota exceeded.');
  }
}

// Loads the events array from localStorage using JSON.parse()
function loadEvents() {
  try {
    const raw = localStorage.getItem('events');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return []; // Return empty array if data is corrupted
  }
}

// Validates form inputs — returns { valid, message }
function validateForm(title, category, seats) {
  if (title === '') return { valid: false, message: 'Event title is required.' };
  if (category === '') return { valid: false, message: 'Category is required.' };
  if (isNaN(seats) || seats < 1 || !Number.isInteger(seats))
    return { valid: false, message: 'Seats must be a whole number of at least 1.' };
  return { valid: true, message: '' };
}

// Handles form submit — validates, creates new event, updates UI and localStorage
function handleAddEvent(e) {
  e.preventDefault();

  const title = document.getElementById('eventTitle').value.trim();
  const category = document.getElementById('eventCategory').value.trim();
  const seats = parseInt(document.getElementById('eventSeats').value, 10);

  const result = validateForm(title, category, seats);
  const errorEl = document.getElementById('formError');

  if (!result.valid) {
    errorEl.textContent = result.message;
    errorEl.classList.remove('hidden');
    return;
  }

  errorEl.classList.add('hidden');

  // Create new event object and push() it to the array
  const newEvent = { id: generateId(), title, category, seats, registered: 0 };
  events.push(newEvent);

  renderSingleCard(newEvent);
  updateStats(events);
  persist(events);
  clearForm();
}

// Resets all form fields after successful submission
function clearForm() {
  document.getElementById('eventTitle').value = '';
  document.getElementById('eventCategory').value = '';
  document.getElementById('eventSeats').value = '';
}

// Delays function execution to avoid excessive DOM updates on fast typing
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Filters events by title or category using filter() and includes()
function handleSearch(query) {
  const q = query.trim().toLowerCase();
  if (q === '') {
    renderCards(events); // Restore all cards when search is cleared
    return;
  }
  const filtered = events.filter(
    (e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
  );
  renderCards(filtered);
}

// Initialises the app — loads data, renders UI, attaches all event listeners
function initApp() {
  const saved = loadEvents();
  events = saved.length > 0 ? saved : seedEvents.slice();

  renderCards(events);
  updateStats(events);

  // Single delegated click listener handles all Register/Cancel buttons
  document.getElementById('eventsGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.event-card');
    if (!card) return;
    const id = Number(card.dataset.id);
    if (e.target.classList.contains('btn-register')) handleRegister(id);
    if (e.target.classList.contains('btn-cancel')) handleCancel(id);
  });

  // Debounced search fires 150ms after the user stops typing
  const debouncedSearch = debounce((val) => handleSearch(val), 150);
  document.getElementById('searchInput').addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });

  // Form submit listener for adding new events
  document.getElementById('addEventForm').addEventListener('submit', (e) => {
    handleAddEvent(e);
  });
}

// Run initApp once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
