const seedEvents = [
  { id: 1, title: 'AI Bootcamp', category: 'Technology', seats: 30, registered: 12 },
  { id: 2, title: 'Design Thinking Workshop', category: 'Workshop', seats: 20, registered: 20 },
  { id: 3, title: 'Career Fair 2025', category: 'Networking', seats: 100, registered: 45 },
  { id: 4, title: 'Web Dev Hackathon', category: 'Technology', seats: 50, registered: 23 },
  { id: 5, title: 'Public Speaking Seminar', category: 'Personal Development', seats: 40, registered: 0 },
];

let events = [];

function generateId() {
  if (events.length === 0) return Date.now();
  return Math.max(...events.map((e) => e.id)) + 1;
}

const CATEGORY_COLOURS = {
  Technology: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Workshop: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Networking: { bg: 'bg-green-100', text: 'text-green-700' },
  'Personal Development': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

function getCategoryColour(category) {
  return CATEGORY_COLOURS[category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
}

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

  const registerBtn = document.createElement('button');
  registerBtn.className = 'btn-register flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  registerBtn.textContent = 'Register';
  registerBtn.disabled = remaining === 0;

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

function initApp() {
  events = seedEvents.slice();
  renderCards(events);
}

document.addEventListener('DOMContentLoaded', initApp);
