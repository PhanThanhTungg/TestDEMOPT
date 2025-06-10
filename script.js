
let questions = [];
let notedQuestions = new Set();

// Load noted questions from cookie
function loadNotedQuestions() {
  const savedNotes = getCookie('notedQuestions');
  if (savedNotes) {
    try {
      const notedIds = JSON.parse(savedNotes);
      notedQuestions = new Set(notedIds);
    } catch (error) {
      console.error('Error parsing noted questions from cookie:', error);
      notedQuestions = new Set();
    }
  }
}

// Save noted questions to cookie
function saveNotedQuestions() {
  const notedIds = Array.from(notedQuestions);
  setCookie('notedQuestions', JSON.stringify(notedIds), 365);
}

// Cookie helper functions
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Load questions from output.json
fetch('output.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    loadNotedQuestions(); // Load saved notes before rendering
    renderQuestions();
  })
  .catch(error => {
    console.error('Error loading questions:', error);
    loadNotedQuestions(); // Load saved notes even if questions fail
    renderQuestions();
  });

function renderQuestions() {
  const container = document.getElementById('questionContainer');
  const totalQuestionsSpan = document.getElementById('totalQuestions');

  totalQuestionsSpan.textContent = questions.length;

  questions.forEach(question => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.id = `question-${question.id}`;

    // Check if this question is noted
    if (notedQuestions.has(question.id)) {
      questionDiv.classList.add('noted');
    }

    const correctLetter = question.correct_answer.toLowerCase();

    questionDiv.innerHTML = `
          <button class="note-button ${notedQuestions.has(question.id) ? 'noted' : ''}" onclick="toggleNote(${question.id})" title="Note câu hỏi này">📝</button>
          <div class="question-number">Câu ${question.id}</div>
          <div class="question-text">${question.question}</div>
          <ul class="options">
            <li class="option ${correctLetter === 'a' ? 'correct' : ''}">
              <div class="option-letter">A</div>
              <div class="option-text">${question.a}</div>
            </li>
            <li class="option ${correctLetter === 'b' ? 'correct' : ''}">
              <div class="option-letter">B</div>
              <div class="option-text">${question.b}</div>
            </li>
            <li class="option ${correctLetter === 'c' ? 'correct' : ''}">
              <div class="option-letter">C</div>
              <div class="option-text">${question.c}</div>
            </li>
            <li class="option ${correctLetter === 'd' ? 'correct' : ''}">
              <div class="option-letter">D</div>
              <div class="option-text">${question.d}</div>
            </li>
          </ul>
        `;

    container.appendChild(questionDiv);
  });

  updateNotesList();
}

function toggleNote(questionId) {
  const questionElement = document.getElementById(`question-${questionId}`);
  const noteButton = questionElement.querySelector('.note-button');

  if (notedQuestions.has(questionId)) {
    notedQuestions.delete(questionId);
    questionElement.classList.remove('noted');
    noteButton.classList.remove('noted');
  } else {
    notedQuestions.add(questionId);
    questionElement.classList.add('noted');
    noteButton.classList.add('noted');
  }

  saveNotedQuestions(); // Save to cookie
  updateNotesList();
}

function updateNotesList() {
  const notesList = document.getElementById('notesList');
  const notedCount = document.getElementById('notedCount');

  notedCount.textContent = notedQuestions.size;

  if (notedQuestions.size === 0) {
    notesList.innerHTML = '<div class="empty-notes">Chưa có câu nào được note</div>';
    return;
  }

  const notedQuestionsArray = Array.from(notedQuestions).map(id =>
    questions.find(q => q.id === id)
  ).filter(q => q !== undefined).sort((a, b) => a.id - b.id);

  notesList.innerHTML = notedQuestionsArray.map(question => `
        <div class="note-item" onclick="scrollToQuestion(${question.id})">
          <div class="note-item-number">Câu ${question.id}</div>
          <div class="note-item-text">${question.question}</div>
        </div>
      `).join('');
}

function scrollToQuestion(questionId) {
  const questionElement = document.getElementById(`question-${questionId}`);
  if (questionElement) {
    questionElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    // Highlight effect
    questionElement.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.5)';
    setTimeout(() => {
      questionElement.style.boxShadow = '';
    }, 2000);
  }
}

// Initialize the quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadNotedQuestions();
  renderQuestions();
});

