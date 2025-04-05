// Main JavaScript file for Chemistry Exam Study Guide
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or respect OS preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Update icon
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            const nav = document.querySelector('nav');
            nav.classList.toggle('active');
            
            // Update icon
            const navIcon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                navIcon.classList.remove('fa-bars');
                navIcon.classList.add('fa-times');
            } else {
                navIcon.classList.remove('fa-times');
                navIcon.classList.add('fa-bars');
            }
        });
    }
    
    // Quiz functionality
    const quizSubmitButtons = document.querySelectorAll('.quiz-submit');
    quizSubmitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quizContainer = this.closest('.quiz-container');
            const options = quizContainer.querySelectorAll('.quiz-option');
            const feedback = quizContainer.querySelector('.quiz-feedback');
            
            let selectedOption = null;
            
            options.forEach(option => {
                if (option.classList.contains('selected')) {
                    selectedOption = option;
                }
                
                // Add click event to options if not already added
                if (!option.hasAttribute('data-event-added')) {
                    option.addEventListener('click', function() {
                        options.forEach(opt => opt.classList.remove('selected'));
                        this.classList.add('selected');
                    });
                    option.setAttribute('data-event-added', 'true');
                }
            });
            
            if (selectedOption) {
                // Show feedback
                feedback.style.display = 'block';
                feedback.textContent = selectedOption.getAttribute('data-feedback');
                
                // Apply correct/incorrect styling
                if (selectedOption.getAttribute('data-correct') === 'true') {
                    feedback.classList.add('correct');
                    feedback.classList.remove('incorrect');
                    selectedOption.classList.add('correct-answer');
                } else {
                    feedback.classList.add('incorrect');
                    feedback.classList.remove('correct');
                    selectedOption.classList.add('incorrect-answer');
                    
                    // Highlight the correct answer
                    options.forEach(option => {
                        if (option.getAttribute('data-correct') === 'true') {
                            option.classList.add('correct-answer');
                        }
                    });
                }
                
                // Track completed quiz in localStorage
                trackQuizCompletion(quizContainer);
            } else {
                feedback.style.display = 'block';
                feedback.textContent = 'Please select an answer.';
                feedback.classList.remove('correct', 'incorrect');
            }
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
    
    function performSearch(query) {
        if (!query || query.trim() === '') {
            if (searchResults) {
                searchResults.style.display = 'none';
            }
            return;
        }
        
        query = query.toLowerCase();
        
        // Get all headings and paragraphs on the page
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const paragraphs = document.querySelectorAll('p, li');
        const matches = [];
        
        // Search in headings
        headings.forEach(heading => {
            if (heading.textContent.toLowerCase().includes(query)) {
                matches.push({
                    element: heading,
                    text: heading.textContent,
                    type: 'heading'
                });
            }
        });
        
        // Search in paragraphs
        paragraphs.forEach(paragraph => {
            if (paragraph.textContent.toLowerCase().includes(query)) {
                matches.push({
                    element: paragraph,
                    text: paragraph.textContent,
                    type: 'paragraph'
                });
            }
        });
        
        // Display results
        if (searchResults) {
            if (matches.length > 0) {
                let resultsHTML = `<h3>Search Results for "${query}"</h3><ul>`;
                
                matches.forEach(match => {
                    const snippet = getSnippet(match.text, query);
                    resultsHTML += `<li class="search-result-item" data-element-id="${match.element.id || generateId(match.element)}">
                        <strong>${match.type === 'heading' ? match.text : getParentHeading(match.element)}</strong>
                        <p>${snippet}</p>
                    </li>`;
                    
                    // Ensure the element has an ID for scrolling
                    if (!match.element.id) {
                        match.element.id = generateId(match.element);
                    }
                });
                
                resultsHTML += '</ul>';
                searchResults.innerHTML = resultsHTML;
                searchResults.style.display = 'block';
                
                // Add click event to results
                const resultItems = document.querySelectorAll('.search-result-item');
                resultItems.forEach(item => {
                    item.addEventListener('click', function() {
                        const elementId = this.getAttribute('data-element-id');
                        const element = document.getElementById(elementId);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            element.classList.add('highlight-search');
                            setTimeout(() => {
                                element.classList.remove('highlight-search');
                            }, 2000);
                        }
                    });
                });
            } else {
                searchResults.innerHTML = `<p>No results found for "${query}"</p>`;
                searchResults.style.display = 'block';
            }
        }
    }
    
    function getSnippet(text, query) {
        const maxLength = 100;
        const lowerText = text.toLowerCase();
        const index = lowerText.indexOf(query.toLowerCase());
        
        if (index === -1) return text.substring(0, maxLength) + '...';
        
        const start = Math.max(0, index - 40);
        const end = Math.min(text.length, index + query.length + 40);
        let snippet = text.substring(start, end);
        
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';
        
        // Highlight the query
        const regex = new RegExp(query, 'gi');
        snippet = snippet.replace(regex, match => `<span class="highlight">${match}</span>`);
        
        return snippet;
    }
    
    function getParentHeading(element) {
        let current = element;
        while (current) {
            let previous = current.previousElementSibling;
            while (previous) {
                if (previous.tagName.match(/^H[1-6]$/)) {
                    return previous.textContent;
                }
                previous = previous.previousElementSibling;
            }
            current = current.parentElement;
        }
        return 'Section';
    }
    
    function generateId(element) {
        const text = element.textContent.trim().toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return text + '-' + Math.random().toString(36).substring(2, 8);
    }
    
    // Track page visits for progress tracking
    trackPageVisit();
    
    // Initialize flashcards if they exist on the page
    initializeFlashcards();
    
    // Initialize 3D molecular viewers if they exist
    initializeMolecularViewers();
    
    // Update progress display if on interactive tools page
    updateProgressDisplay();
});

// Function to track page visits
function trackPageVisit() {
    const currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === 'index.html') return;
    
    let visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '[]');
    if (!visitedPages.includes(currentPage)) {
        visitedPages.push(currentPage);
        localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
    }
    
    // Update progress if on interactive tools page
    updateProgress();
}

// Function to track quiz completion
function trackQuizCompletion(quizContainer) {
    const currentPage = window.location.pathname.split('/').pop();
    if (!currentPage) return;
    
    const quizTopic = currentPage.replace('.html', '');
    const options = quizContainer.querySelectorAll('.quiz-option');
    let correctCount = 0;
    let totalCount = 0;
    
    options.forEach(option => {
        if (option.classList.contains('correct-answer') && option.classList.contains('selected')) {
            correctCount++;
        }
        // Count only one option per question
        if (option.getAttribute('data-correct') === 'true') {
            totalCount++;
        }
    });
    
    let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
    
    // Check if this quiz was already completed
    const existingIndex = completedQuizzes.findIndex(q => q.topic === quizTopic);
    
    const quizData = {
        topic: quizTopic,
        score: Math.round((correctCount / totalCount) * 100),
        date: new Date().toISOString()
    };
    
    if (existingIndex !== -1) {
        // Update existing entry
        completedQuizzes[existingIndex] = quizData;
    } else {
        // Add new entry
        completedQuizzes.push(quizData);
    }
    
    localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
    
    // Update progress
    updateProgress();
}

// Function to update overall progress
function updateProgress() {
    const totalPages = 6; // Number of content pages
    const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '[]');
    const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
    
    // Calculate progress percentage
    const visitedProgress = Math.min(visitedPages.length / totalPages, 1);
    const quizProgress = Math.min(completedQuizzes.length / totalPages, 1);
    
    // Combined progress (70% for visiting pages, 30% for completing quizzes)
    const overallProgress = (visitedProgress * 0.7) + (quizProgress * 0.3);
    
    // Store overall progress
    localStorage.setItem('overallProgress', Math.round(overallProgress * 100));
    
    // Update progress display if on interactive tools page
    updateProgressDisplay();
}

// Function to update progress display on interactive tools page
function updateProgressDisplay() {
    const progressBar = document.getElementById('overall-progress');
    const visitedTopicsList = document.getElementById('visited-topics');
    const quizProgressDiv = document.getElementById('quiz-progress');
    
    if (progressBar) {
        const progress = localStorage.getItem('overallProgress') || '0';
        progressBar.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', progress);
    }
    
    if (visitedTopicsList) {
        const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '[]');
        
        if (visitedPages.length === 0) {
            visitedTopicsList.innerHTML = '<li>No topics visited yet</li>';
            return;
        }
        
        let html = '';
        const pageNames = {
            'thermodynamics.html': 'Thermodynamics',
            'kinetics.html': 'Kinetics',
            'electrochemistry.html': 'Electrochemistry',
            'organic_chemistry.html': 'Organic Chemistry',
            'carbohydrates.html': 'Carbohydrates',
            'nad_fad.html': 'NAD and FAD',
            'final_tips.html': 'Final Preparation Tips'
        };
        
        visitedPages.forEach(page => {
            const name = pageNames[page] || page;
            html += `<li>${name} <i class="fas fa-check" style="color: var(--success-color);"></i></li>`;
        });
        
        visitedTopicsList.innerHTML = html;
    }
    
    if (quizProgressDiv) {
        const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
        
        if (completedQuizzes.length === 0) {
            quizProgressDiv.innerHTML = '<p>No quizzes completed yet</p>';
            return;
        }
        
        let html = '<ul>';
        completedQuizzes.forEach(quiz => {
            const topicNames = {
                'thermodynamics': 'Thermodynamics',
                'kinetics': 'Kinetics',
                'electrochemistry': 'Electrochemistry',
                'organic_chemistry': 'Organic Chemistry',
                'carbohydrates': 'Carbohydrates',
                'nad_fad': 'NAD and FAD'
            };
            const name = topicNames[quiz.topic] || quiz.topic;
            html += `<li>${name}: ${quiz.score}% <i class="fas fa-check" style="color: var(--success-color);"></i></li>`;
        });
        html += '</ul>';
        
        quizProgressDiv.innerHTML = html;
    }
}

// Function to initialize flashcards
function initializeFlashcards() {
    const flashcardTopic = document.getElementById('flashcard-topic');
    const flashcards = document.querySelectorAll('.flashcard');
    const prevButton = document.getElementById('prev-flashcard');
    const nextButton = document.getElementById('next-flashcard');
    
    if (!flashcards.length) return;
    
    let currentIndex = 0;
    
    /<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>
