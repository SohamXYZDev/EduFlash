// Elements
const form = document.getElementById('flashcard-form');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const cardList = document.getElementById('card-list');

// Load from localStorage or initialize
let flashcards = JSON.parse(localStorage.getItem('eduflash-cards')) || [];

// Save to localStorage
function saveCards() {
  localStorage.setItem('eduflash-cards', JSON.stringify(flashcards));
}

// Render all cards
function renderCards() {
  cardList.innerHTML = '';
  flashcards.forEach((card, idx) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'flashcard';
    cardEl.innerHTML = `
      <div class="inner">
        <div class="front">${card.question}</div>
        <div class="back">${card.answer}</div>
      </div>
      <button data-index="${idx}">×</button>
    `;
    // Flip on click
    cardEl.addEventListener('click', () => {
      cardEl.classList.toggle('flipped');
    });
    // Delete on button click
    cardEl.querySelector('button').addEventListener('click', e => {
      e.stopPropagation();
      const i = parseInt(e.target.dataset.index, 10);
      flashcards.splice(i, 1);
      saveCards();
      renderCards();
    });
    cardList.appendChild(cardEl);
  });
}

// Handle form submission
form.addEventListener('submit', e => {
  e.preventDefault();
  const q = questionInput.value.trim();
  const a = answerInput.value.trim();
  if (!q || !a) return;
  flashcards.push({ question: q, answer: a });
  saveCards();
  renderCards();
  form.reset();
});

// Initial render
renderCards();
