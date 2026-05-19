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
