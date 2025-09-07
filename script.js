// CGPA Booster - Main JavaScript File

// Global Variables
let currentSemester = 1;
let bookmarkedQuestions = new Set();
let studyStats = {
    questionsStudied: 0,
    studyStreak: 0,
    totalTime: 0
};

// Sample Data
const motivationalQuotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts! 💪",
    "The future belongs to those who believe in the beauty of their dreams! ✨",
    "Don't watch the clock; do what it does. Keep going! ⏰",
    "Success is the sum of small efforts repeated day in and day out! 🌟",
    "The only way to do great work is to love what you do! ❤️",
    "Believe you can and you're halfway there! 🚀",
    "Your limitation—it's only your imagination! 💭",
    "Push yourself, because no one else is going to do it for you! 💯",
    "Great things never come from comfort zones! 🌈",
    "Dream it. Wish it. Do it! ⭐"
];

const semesterData = [
    { number: 1, title: "Semester 1", subjects: "Math, Physics, Chemistry", icon: "📚" },
    { number: 2, title: "Semester 2", subjects: "Advanced Math, Electronics, Programming", icon: "💻" },
    { number: 3, title: "Semester 3", subjects: "Data Structures, Circuits, Thermodynamics", icon: "⚡" },
    { number: 4, title: "Semester 4", subjects: "Algorithms, Database, System Design", icon: "🔧" },
    { number: 5, title: "Semester 5", subjects: "Machine Learning, Networks, Security", icon: "🛡️" },
    { number: 6, title: "Semester 6", subjects: "AI, Cloud Computing, Mobile Dev", icon: "☁️" },
    { number: 7, title: "Semester 7", subjects: "Project Management, Blockchain, IoT", icon: "🔗" },
    { number: 8, title: "Semester 8", subjects: "Capstone Project, Industry Training", icon: "🎓" }
];

const sampleQuestions = [
    {
        id: 1,
        question: "What is the derivative of x²?",
        answer: "The derivative of x² is 2x. This follows from the power rule: d/dx[xⁿ] = n·xⁿ⁻¹",
        subject: "math",
        difficulty: "easy",
        semester: 1
    },
    {
        id: 2,
        question: "Explain Newton's First Law of Motion",
        answer: "Newton's First Law states that an object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
        subject: "physics",
        difficulty: "medium",
        semester: 1
    },
    {
        id: 3,
        question: "What is the time complexity of binary search?",
        answer: "The time complexity of binary search is O(log n) because we eliminate half of the remaining elements in each step.",
        subject: "programming",
        difficulty: "medium",
        semester: 2
    },
    {
        id: 4,
        question: "Define Big O notation",
        answer: "Big O notation describes the upper bound of the time complexity of an algorithm. It describes the worst-case scenario and gives an upper bound of the running time.",
        subject: "programming",
        difficulty: "hard",
        semester: 3
    }
];

// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const searchInput = document.getElementById('searchInput');
const motivationText = document.getElementById('motivationText');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const semesterGrid = document.getElementById('semesterGrid');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const questionsContainer = document.getElementById('questionsContainer');
const subjectFilter = document.getElementById('subjectFilter');
const difficultyFilter = document.getElementById('difficultyFilter');

const progressQuestions = document.getElementById('progressQuestions');
const progressBookmarks = document.getElementById('progressBookmarks');
const progressStreak = document.getElementById('progressStreak');

const examDateInput = document.getElementById('examDateInput');
const examCountdown = document.getElementById('examCountdown');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadSavedData();
    generateSemesterCards();
    loadQuestions();
    setupEventListeners();
    updateStats();
    const savedExamDate = localStorage.getItem('examDate');
    if (savedExamDate) startCountdown(new Date(savedExamDate));
});

// Initialize app settings and states
function initializeApp() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    } else {
        if (darkModeToggle) darkModeToggle.textContent = '🌙';
    }
    showRandomQuote();
}

// Load saved data
function loadSavedData() {
    const savedBookmarks = localStorage.getItem('bookmarkedQuestions');
    if (savedBookmarks) bookmarkedQuestions = new Set(JSON.parse(savedBookmarks));

    const savedStats = localStorage.getItem('studyStats');
    if (savedStats) studyStats = JSON.parse(savedStats);

    const savedSemester = localStorage.getItem('currentSemester');
    if (savedSemester) currentSemester = parseInt(savedSemester);
}

// Save data
function saveData() {
    localStorage.setItem('bookmarkedQuestions', JSON.stringify([...bookmarkedQuestions]));
    localStorage.setItem('studyStats', JSON.stringify(studyStats));
    localStorage.setItem('currentSemester', currentSemester.toString());
}

// Setup Event Listeners
function setupEventListeners() {
    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);
    if (newQuoteBtn) newQuoteBtn.addEventListener('click', showRandomQuote);
    if (searchInput) searchInput.addEventListener('input', filterQuestions);
    if (subjectFilter) subjectFilter.addEventListener('change', filterQuestions);
    if (difficultyFilter) difficultyFilter.addEventListener('change', filterQuestions);

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    const setExamDateBtn = document.getElementById('setExamDateBtn');
    if (setExamDateBtn && examDateInput) {
        setExamDateBtn.addEventListener('click', () => examDateInput.click());
        examDateInput.addEventListener('change', () => {
            const examDate = new Date(examDateInput.value);
            localStorage.setItem('examDate', examDate);
            startCountdown(examDate);
        });
    }

    const flashcardBtn = document.querySelector('.flashcards-btn');
    if (flashcardBtn) flashcardBtn.addEventListener('click', () => switchTab('flashcards'));

    const quizBtn = document.querySelector('.quiz-btn');
    if (quizBtn) quizBtn.addEventListener('click', () => switchTab('quiz'));

    const bookmarksBtn = document.querySelector('.bookmarks-btn');
    if (bookmarksBtn) bookmarksBtn.addEventListener('click', () => showBookmarkedQuestions());

    const uploadBtn = document.querySelector('.upload-notes-btn');
    if (uploadBtn) uploadBtn.addEventListener('click', () => switchTab('uploadNotes'));
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
}

// Show Random Quote
function showRandomQuote() {
    if (!motivationText) return;
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    motivationText.textContent = randomQuote;
    motivationText.style.animation = 'none';
    motivationText.offsetHeight;
    motivationText.style.animation = 'fadeInUp 1s ease';
}

// Semester Cards
function generateSemesterCards() {
    if (!semesterGrid) return;
    semesterGrid.innerHTML = '';
    semesterData.forEach(semester => {
        const card = document.createElement('div');
        card.className = `semester-card card sem-${semester.number}`;
        card.innerHTML = `
            <span class="semester-icon">${semester.icon}</span>
            <h3>${semester.title}</h3>
            <p>${semester.subjects}</p>
        `;
        card.addEventListener('click', () => {
            currentSemester = semester.number;
            localStorage.setItem('currentSemester', currentSemester);
            loadQuestions();
            switchTab('questions');
            updateStats();
        });
        semesterGrid.appendChild(card);
    });
}

// Load Questions
function loadQuestions() {
    if (!questionsContainer) return;
    const subject = subjectFilter ? subjectFilter.value : '';
    const difficulty = difficultyFilter ? difficultyFilter.value : '';
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

    let filtered = sampleQuestions.filter(q => q.semester === currentSemester);

    if (subject && subject !== 'all') {
        filtered = filtered.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    }
    if (difficulty && difficulty !== 'all') {
        filtered = filtered.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (searchTerm) {
        filtered = filtered.filter(q => q.question.toLowerCase().includes(searchTerm) || q.answer.toLowerCase().includes(searchTerm));
    }

    questionsContainer.innerHTML = '';
    if (filtered.length === 0) {
        questionsContainer.textContent = 'No questions found.';
        return;
    }

    filtered.forEach(q => {
        const elem = document.createElement('div');
        elem.className = 'question-item';
        elem.innerHTML = `
            <h4>${q.question}</h4>
            <p>${q.answer}</p>
            <small>Subject: ${q.subject} | Difficulty: ${q.difficulty}</small>
            <button class="bookmark-btn" data-id="${q.id}">
                ${bookmarkedQuestions.has(q.id) ? '★' : '☆'}
            </button>
        `;
        elem.addEventListener('click', () => {
            studyStats.questionsStudied += 1;
            studyStats.studyStreak += 1;
            updateStats();
            saveData();
        });

        const btn = elem.querySelector('.bookmark-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(e.target.dataset.id);
            if (bookmarkedQuestions.has(id)) {
                bookmarkedQuestions.delete(id);
                e.target.textContent = '☆';
            } else {
                bookmarkedQuestions.add(id);
                e.target.textContent = '★';
            }
            updateStats();
            saveData();
        });

        questionsContainer.appendChild(elem);
    });
}

// Filter Questions
function filterQuestions() {
    loadQuestions();
}

// Tab Switch
function switchTab(tabName) {
    tabPanes.forEach(p => p.style.display = (p.id === tabName ? 'block' : 'none'));
    tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
}

// Update Study Stats
function updateStats() {
    if (progressQuestions) progressQuestions.textContent = studyStats.questionsStudied;
    if (progressBookmarks) progressBookmarks.textContent = bookmarkedQuestions.size;
    if (progressStreak) progressStreak.textContent = studyStats.studyStreak;
}

// Show Only Bookmarked
function showBookmarkedQuestions() {
    const bookmarked = sampleQuestions.filter(q => bookmarkedQuestions.has(q.id));
    questionsContainer.innerHTML = '';
    if (bookmarked.length === 0) {
        questionsContainer.textContent = 'No bookmarks yet.';
        return;
    }
    bookmarked.forEach(q => {
        const elem = document.createElement('div');
        elem.className = 'question-item';
        elem.innerHTML = `
            <h4>${q.question}</h4>
            <p>${q.answer}</p>
            <small>Subject: ${q.subject} | Difficulty: ${q.difficulty}</small>
        `;
        questionsContainer.appendChild(elem);
    });
    switchTab('questions');
}

// Countdown Logic
function startCountdown(examDate) {
    const timer = setInterval(() => {
        const now = new Date();
        const diff = examDate - now;
        if (diff <= 0) {
            clearInterval(timer);
            updateCountdown(0, 0, 0);
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        updateCountdown(days, hours, minutes);
    }, 1000);
}

function updateCountdown(days, hours, minutes) {
    const dayElem = examCountdown.querySelector('.days');
    const hourElem = examCountdown.querySelector('.hours');
    const minuteElem = examCountdown.querySelector('.minutes');
    if (dayElem) dayElem.textContent = days;
    if (hourElem) hourElem.textContent = hours;
    if (minuteElem) minuteElem.textContent = minutes;
}
