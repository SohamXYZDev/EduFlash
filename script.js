// Elements
const form = document.getElementById('flashcard-form');
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const cardList = document.getElementById('card-list');
const generateBtn = document.getElementById('generate-btn');
const input = document.getElementById('generate-topic');
const output = document.getElementById('generate-status');

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

// Handle form submission (manual card creation)
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

// Handle auto-generation of flashcards
generateBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const topic = input.value.trim();

  if (!topic) return alert("Please enter a topic.");

  output.innerHTML = "Generating flashcards...";

  try {
    const response = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic })
    });

    const data = await response.json();

    if (data.error) {
      output.innerHTML = `❌ Error: ${data.error}`;
      return;
    }

    // Add generated cards to the flashcards array
    flashcards.push(...data);
    saveCards();
    renderCards();

    // Clear input and output
    input.value = '';
    output.innerHTML = '✅ Flashcards generated successfully!';
  } catch (err) {
    console.error(err);
    output.innerHTML = "❌ Something went wrong. Try again.";
  }
});

// Initial render
renderCards();