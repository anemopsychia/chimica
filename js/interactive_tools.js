document.addEventListener('DOMContentLoaded', () => {
    // --- Common Elements ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('header nav');
    const body = document.body;

    // --- Theme Toggle ---
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeToggleButton.querySelector('i').classList.remove('fa-moon');
            themeToggleButton.querySelector('i').classList.add('fa-sun');
        }
    } else { // Default to light mode if nothing is set
         body.classList.add('light-mode'); // Assuming light is default without class
         themeToggleButton.querySelector('i').classList.add('fa-moon');
    }

    themeToggleButton.addEventListener('click', () => {
        const icon = themeToggleButton.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // --- Mobile Nav Toggle ---
    mobileNavToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // --- Search (Basic Page Content Search) ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsContainer = document.getElementById('search-results');
    const mainContent = document.querySelector('.main-content .container'); // Area to search within

    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        searchResultsContainer.innerHTML = ''; // Clear previous results
        searchResultsContainer.style.display = 'none';

        if (searchTerm.length < 3) {
             if (searchTerm.length > 0) searchResultsContainer.innerHTML = '<p>Please enter at least 3 characters.</p>';
            searchResultsContainer.style.display = searchTerm.length > 0 ? 'block' : 'none';
            return;
        }

        const searchableElements = mainContent.querySelectorAll('h1, h2, h3, p, li'); // Adjust tags as needed
        let resultsFound = 0;
        const resultsHTML = [];

        searchableElements.forEach(el => {
            // Avoid searching within the search results container itself or hidden elements
            if (!el.closest('#search-results') && el.offsetParent !== null && el.textContent.toLowerCase().includes(searchTerm)) {
                 // Try to find the closest section/card title for context
                 const card = el.closest('.card');
                 const title = card ? (card.querySelector('.card-title') ? card.querySelector('.card-title').textContent : 'Section') : 'Page Content';
                 const linkId = card ? card.parentElement.id : ''; // Link to section if possible
                 const linkText = `<a href="#${linkId}">${title}</a>`;

                 // Add result (avoid duplicates from same card)
                 if (!resultsHTML.some(item => item.includes(linkId || title))) {
                    resultsHTML.push(`<li>Found in: ${linkId ? linkText : title} - "...${highlightMatch(el.textContent, searchTerm)}..."</li>`);
                    resultsFound++;
                 }

            }
        });

        if (resultsFound > 0) {
            searchResultsContainer.innerHTML = `<h4>Search Results (${resultsFound}):</h4><ul>${resultsHTML.join('')}</ul>`;
            searchResultsContainer.style.display = 'block';
        } else {
            searchResultsContainer.innerHTML = '<p>No results found on this page.</p>';
            searchResultsContainer.style.display = 'block';
        }
    };

    // Helper function to highlight search term (basic)
    function highlightMatch(text, term) {
        const index = text.toLowerCase().indexOf(term);
        if (index === -1) return text;
        const start = Math.max(0, index - 30);
        const end = Math.min(text.length, index + term.length + 30);
        const snippet = text.substring(start, end);
        // Simple highlight - replace with more robust method if needed
        return snippet.replace(new RegExp(`(${term})`, 'gi'), '<mark>$1</mark>');
    }


    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });


    // --- Progress Tracker ---
    const overallProgress = document.getElementById('overall-progress');
    const visitedTopicsList = document.getElementById('visited-topics');
    const quizProgressDiv = document.getElementById('quiz-progress');
    const resetProgressButton = document.getElementById('reset-progress');
    const topicCountSpan = document.getElementById('topic-count');
    const totalTopicsSpan = document.getElementById('total-topics');

    const studyTopics = {
        'thermodynamics': 'Thermodynamics',
        'kinetics': 'Kinetics',
        'electrochemistry': 'Electrochemistry',
        'organic_chemistry': 'Organic Chemistry',
        'carbohydrates': 'Carbohydrates',
        'nad_fad': 'NAD and FAD'
    };
    const totalTopics = Object.keys(studyTopics).length;
    totalTopicsSpan.textContent = totalTopics;

    function updateProgressTracker() {
        let visitedCount = 0;
        visitedTopicsList.innerHTML = ''; // Clear list
        let visitedItems = [];
        let quizScoresHTML = [];

        for (const key in localStorage) {
            if (key.startsWith('visited_')) {
                const topicKey = key.replace('visited_', '');
                if (studyTopics[topicKey] && localStorage.getItem(key) === 'true') {
                    visitedCount++;
                    visitedItems.push(`<li><i class="fas fa-check-circle" style="color: green;"></i> ${studyTopics[topicKey]}</li>`);
                }
            }
             if (key.startsWith('quiz_score_')) {
                 const topicName = key.replace('quiz_score_', '').replace(/_/g, ' '); // Format topic name
                 const score = localStorage.getItem(key);
                 quizScoresHTML.push(`<p><strong>${capitalizeFirstLetter(topicName)}:</strong> ${score}</p>`);
             }
        }

        // Update Visited Topics List
        if (visitedItems.length > 0) {
            visitedTopicsList.innerHTML = visitedItems.join('');
        } else {
            visitedTopicsList.innerHTML = '<li>No topics marked as visited yet. Visit content pages to track progress.</li>';
        }

        // Update Quiz Progress Display
        if (quizScoresHTML.length > 0) {
            quizProgressDiv.innerHTML = quizScoresHTML.join('');
        } else {
            quizProgressDiv.innerHTML = '<p>No quizzes completed yet.</p>';
        }


        // Update Overall Progress Bar
        const progressPercentage = totalTopics > 0 ? Math.round((visitedCount / totalTopics) * 100) : 0;
        overallProgress.style.width = `${progressPercentage}%`;
        overallProgress.textContent = `${progressPercentage}%`;
        topicCountSpan.textContent = visitedCount;

        // Check other pages for visited status (Example - needs implementation on other pages)
        // Simulate visiting a page (normally this happens on the specific page)
        // if (window.location.pathname.includes('thermodynamics.html')) {
        //     localStorage.setItem('visited_thermodynamics', 'true');
        // }
    }

    resetProgressButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            for (const key in localStorage) {
                if (key.startsWith('visited_') || key.startsWith('quiz_score_')) {
                    localStorage.removeItem(key);
                }
            }
            updateProgressTracker(); // Refresh display
            // Optionally reload or reset other interactive elements like quizzes if needed
            console.log("Progress Reset.");
        }
    });


    // --- Flashcards ---
    const flashcardData = {
        thermodynamics: [
            { q: 'What is the First Law of Thermodynamics?', a: 'Energy cannot be created or destroyed, only transferred or converted. ΔU = q + w' },
            { q: 'What is Gibbs Free Energy (ΔG) and its relation to spontaneity?', a: 'ΔG = ΔH - TΔS. Spontaneous if ΔG < 0, equilibrium if ΔG = 0, non-spontaneous if ΔG > 0.' },
            { q: 'What is Hess\'s Law?', a: 'The total enthalpy change for a reaction is independent of the pathway taken.' },
            { q: 'Define Enthalpy (H).', a: 'A thermodynamic property representing the total heat content of a system (H = U + PV).' }
        ],
        kinetics: [
            { q: 'What is a rate law?', a: 'An equation relating the rate of a reaction to the concentrations of reactants.' },
            { q: 'Define activation energy (Ea).', a: 'The minimum energy required for reactants to collide effectively and form products.' },
            { q: 'What is the difference between zero, first, and second order reactions?', a: 'Refers to how the rate depends on reactant concentration (Rate = k[A]^0, Rate = k[A]^1, Rate = k[A]^2 respectively).' },
            { q: 'What is a catalyst?', a: 'A substance that increases reaction rate without being consumed, by lowering the activation energy.'}
        ],
        electrochemistry: [
            { q: 'What occurs at the anode in an electrochemical cell?', a: 'Oxidation (loss of electrons).' },
            { q: 'What occurs at the cathode in an electrochemical cell?', a: 'Reduction (gain of electrons).' },
            { q: 'What is the Nernst Equation used for?', a: 'To calculate cell potential under non-standard conditions.' },
            { q: 'What is Faraday\'s constant (F)?', a: 'The charge (in coulombs) of one mole of electrons (approx. 96,485 C/mol).' }
        ],
        organic: [
             { q: 'What is a functional group?', a: 'A specific group of atoms within a molecule responsible for its characteristic chemical reactions.' },
             { q: 'Name two common types of isomers.', a: 'Structural isomers (different connectivity) and stereoisomers (same connectivity, different spatial arrangement - e.g., enantiomers, diastereomers).' },
             { q: 'What is an SN2 reaction?', a: 'A bimolecular nucleophilic substitution reaction occurring in a single step with inversion of configuration.' },
             { q: 'What is Markovnikov\'s rule?', a: 'In the addition of H-X to an alkene, the hydrogen atom adds to the carbon with more hydrogen substituents.' }
        ],
         carbohydrates: [
             { q: 'What is the empirical formula for most carbohydrates?', a: 'C_n(H2O)_n' },
             { q: 'What is the difference between an aldose and a ketose?', a: 'Aldoses have an aldehyde group (-CHO) at one end; Ketoses have a ketone group (C=O) within the chain.' },
             { q: 'Glucose and Fructose are examples of what type of sugar?', a: 'Monosaccharides (specifically, hexoses).' },
             { q: 'What type of linkage joins monosaccharides to form polysaccharides?', a: 'Glycosidic linkage (formed via a dehydration reaction).' }
         ],
         'nad-fad': [ // Key uses hyphen like the select option value
             { q: 'What are the full names of NAD+ and FAD?', a: 'Nicotinamide Adenine Dinucleotide (NAD+) and Flavin Adenine Dinucleotide (FAD).' },
             { q: 'What vitamin is the precursor for the nicotinamide part of NAD+?', a: 'Niacin (Vitamin B3).' },
             { q: 'What vitamin is the precursor for the flavin part of FAD?', a: 'Riboflavin (Vitamin B2).' },
             { q: 'What is the primary role of NADH and FADH2 in metabolism?', a: 'They are electron carriers, transporting electrons (and protons) to the electron transport chain for ATP synthesis.' },
             { q: 'How many electrons can NAD+ accept? How many can FAD accept?', a: 'NAD+ accepts 2 electrons (and 1 proton) to become NADH. FAD accepts 2 electrons (and 2 protons) to become FADH2.' }
         ]
    };

    const flashcardTopicSelect = document.getElementById('flashcard-topic');
    const flashcardViewer = document.getElementById('flashcard-viewer');
    const prevFlashcardButton = document.getElementById('prev-flashcard');
    const nextFlashcardButton = document.getElementById('next-flashcard');
    const flashcardCounter = document.getElementById('flashcard-counter');
    const noFlashcardsMsg = document.getElementById('no-flashcards-msg');

    let currentFlashcardTopic = '';
    let currentFlashcardIndex = 0;
    let currentFlashcards = [];

    // Populate flashcard topic selector
    Object.keys(flashcardData).forEach(topicKey => {
        const option = document.createElement('option');
        option.value = topicKey;
        option.textContent = capitalizeFirstLetter(topicKey.replace(/_/g, ' ')); // Format name
        flashcardTopicSelect.appendChild(option);
    });
    flashcardTopicSelect.value = Object.keys(flashcardData)[0]; // Select first topic by default

    function loadFlashcards(topic) {
        currentFlashcardTopic = topic;
        currentFlashcards = flashcardData[topic] || [];
        currentFlashcardIndex = 0;
        flashcardViewer.innerHTML = ''; // Clear previous cards

        if (currentFlashcards.length === 0) {
            noFlashcardsMsg.style.display = 'block';
            flashcardCounter.textContent = 'Card 0 of 0';
            prevFlashcardButton.disabled = true;
            nextFlashcardButton.disabled = true;
            return;
        }

        noFlashcardsMsg.style.display = 'none';
        currentFlashcards.forEach((cardData, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('flashcard');
            cardElement.dataset.index = index;
            cardElement.innerHTML = `
                <div class="flashcard-inner">
                    <div class="flashcard-front"><p>${cardData.q}</p></div>
                    <div class="flashcard-back"><p>${cardData.a}</p></div>
                </div>
            `;
            cardElement.addEventListener('click', () => {
                cardElement.classList.toggle('flipped');
            });
            flashcardViewer.appendChild(cardElement);
        });

        showFlashcard(currentFlashcardIndex);
    }

    function showFlashcard(index) {
        const allCards = flashcardViewer.querySelectorAll('.flashcard');
        allCards.forEach(card => card.style.display = 'none'); // Hide all

        const cardToShow = flashcardViewer.querySelector(`.flashcard[data-index="${index}"]`);
        if (cardToShow) {
            cardToShow.style.display = 'block';
             // Reset flip state when changing card
             cardToShow.classList.remove('flipped');
        }

        flashcardCounter.textContent = `Card ${index + 1} of ${currentFlashcards.length}`;
        prevFlashcardButton.disabled = index === 0;
        nextFlashcardButton.disabled = index === currentFlashcards.length - 1;
    }

    flashcardTopicSelect.addEventListener('change', (e) => {
        loadFlashcards(e.target.value);
    });

    prevFlashcardButton.addEventListener('click', () => {
        if (currentFlashcardIndex > 0) {
            currentFlashcardIndex--;
            showFlashcard(currentFlashcardIndex);
        }
    });

    nextFlashcardButton.addEventListener('click', () => {
        if (currentFlashcardIndex < currentFlashcards.length - 1) {
            currentFlashcardIndex++;
            showFlashcard(currentFlashcardIndex);
        }
    });

     // Initial load
     loadFlashcards(flashcardTopicSelect.value);


    // --- 3D Molecular Viewer ---
    const moleculeSelector = document.getElementById('molecule-selector');
    const viewerContainer = document.getElementById('mol-viewer');
    let molViewer = null;

    // Define molecules (using PubChem CIDs for easy fetching)
    const molecules = {
        nad: { name: 'NAD+', cid: 5893 },
        fad: { name: 'FAD', cid: 643748 },
        glucose: { name: 'Glucose (alpha-D)', cid: 5793 }, // Alpha-D-glucopyranose common form
        benzene: { name: 'Benzene', cid: 241 },
        // Add more molecules here if needed
        // aspirin: { name: 'Aspirin', cid: 2244 },
        // ethanol: { name: 'Ethanol', cid: 702 }
    };

     // Populate molecule selector
     Object.keys(molecules).forEach(key => {
         const option = document.createElement('option');
         option.value = key;
         option.textContent = molecules[key].name;
         moleculeSelector.appendChild(option);
     });


    function loadMolecule(moleculeKey) {
        if (!window.$3Dmol) {
            console.error("3Dmol.js library not loaded!");
            viewerContainer.innerHTML = "<p>Error: 3Dmol.js library failed to load.</p>";
            return;
        }

        const moleculeInfo = molecules[moleculeKey];
        if (!moleculeInfo) {
            console.error("Invalid molecule key:", moleculeKey);
            return;
        }

        viewerContainer.innerHTML = ''; // Clear previous viewer/message

        try {
            molViewer = $3Dmol.createViewer(viewerContainer, {
                backgroundColor: '#f5f5f5', // Light grey background
                 // defaultcolors: $3Dmol.rasmolElementColors // Optional: Set color scheme
            });

            // Fetch from PubChem using CID
            molViewer.addModel({ cid: moleculeInfo.cid }, "sdf");

            // Set style (e.g., stick, sphere)
            molViewer.setStyle({}, { stick: { radius: 0.15 }, sphere: { scale: 0.25 } });
             // molViewer.setStyle({}, { cartoon: { color: 'spectrum' } }); // For proteins/polymers

            molViewer.zoomTo(); // Zoom to fit the molecule
            molViewer.render(); // Render the scene

            // Optional: Add rotation
            // molViewer.spin(true);
        } catch (e) {
            console.error("Error creating 3Dmol viewer:", e);
            viewerContainer.innerHTML = `<p>Error loading molecule: ${moleculeInfo.name}. Please try refreshing.</p>`;
        }
    }

    moleculeSelector.addEventListener('change', (e) => {
        loadMolecule(e.target.value);
    });

     // Initial load (load the first molecule in the list)
     if (Object.keys(molecules).length > 0) {
         const firstMoleculeKey = Object.keys(molecules)[0];
         moleculeSelector.value = firstMoleculeKey;
         loadMolecule(firstMoleculeKey);
     }


    // --- Self-Assessment Quizzes ---
     const quizData = {
         thermodynamics: [
             { q: 'A process with ΔG < 0 is:', options: ['Spontaneous', 'Non-spontaneous', 'At equilibrium', 'Exothermic'], answer: 0 },
             { q: 'The First Law of Thermodynamics deals with:', options: ['Entropy', 'Conservation of Energy', 'Reaction Rates', 'Free Energy'], answer: 1 },
             { q: 'Hess\'s Law allows calculation of:', options: ['Activation Energy', 'Equilibrium Constant', 'Enthalpy Change', 'Reaction Order'], answer: 2 },
         ],
         kinetics: [
             { q: 'A catalyst increases reaction rate by:', options: ['Increasing temperature', 'Decreasing activation energy', 'Increasing concentration', 'Shifting equilibrium'], answer: 1 },
             { q: 'The units of the rate constant k for a first-order reaction are:', options: ['M/s', '1/s', '1/(M·s)', 'M^2/s'], answer: 1 },
              { q: 'What factor does the Arrhenius equation relate rate constant to?', options: ['Pressure', 'Concentration', 'Temperature', 'Volume'], answer: 2 },
         ],
         electrochemistry: [
             { q: 'In a galvanic (voltaic) cell, the cathode is where:', options: ['Oxidation occurs', 'Electrons are produced', 'Reduction occurs', 'The salt bridge connects'], answer: 2 },
             { q: 'Standard cell potential (E°cell) is calculated as:', options: ['E°cathode + E°anode', 'E°anode - E°cathode', 'E°cathode - E°anode', 'E°ox + E°red'], answer: 2 },
         ],
          organic: [
              { q: 'Which functional group contains a C=O double bond?', options: ['Alcohol', 'Ether', 'Amine', 'Carbonyl (Ketone/Aldehyde)'], answer: 3 },
              { q: 'Enantiomers are stereoisomers that are:', options: ['Superimposable mirror images', 'Non-superimposable mirror images', 'Not mirror images', 'Identical molecules'], answer: 1 },
          ],
          carbohydrates: [
              { q: 'Sucrose (table sugar) is a disaccharide composed of:', options: ['Glucose + Glucose', 'Glucose + Fructose', 'Glucose + Galactose', 'Fructose + Fructose'], answer: 1 },
              { q: 'Starch and Cellulose are both polymers of:', options: ['Fructose', 'Galactose', 'Glucose', 'Ribose'], answer: 2 },
          ],
          'nad-fad': [
              { q: 'NAD+ is the ______ form, while NADH is the ______ form.', options: ['Reduced, Oxidized', 'Oxidized, Reduced', 'Phosphorylated, Dephosphorylated', 'Active, Inactive'], answer: 1 },
              { q: 'FADH2 carries how many high-energy electrons?', options: ['One', 'Two', 'Three', 'Four'], answer: 1 },
          ],
          comprehensive: [] // We'll populate this dynamically
     };

    // Populate Comprehensive Quiz (take 2 questions from each topic)
    function createComprehensiveQuiz() {
        const comprehensiveQuestions = [];
        const questionsPerTopic = 2;
        for (const topic in quizData) {
             if (topic !== 'comprehensive' && quizData[topic].length > 0) {
                 const topicQuestions = [...quizData[topic]]; // Create a copy
                 // Shuffle and pick questions
                 for (let i = 0; i < questionsPerTopic && topicQuestions.length > 0; i++) {
                     const randomIndex = Math.floor(Math.random() * topicQuestions.length);
                     comprehensiveQuestions.push(topicQuestions.splice(randomIndex, 1)[0]);
                 }
             }
        }
        // Shuffle the final comprehensive list
        quizData.comprehensive = comprehensiveQuestions.sort(() => Math.random() - 0.5);
    }
    createComprehensiveQuiz(); // Create it once on load


    const quizTopicSelect = document.getElementById('quiz-topic');
    const startQuizButton = document.getElementById('start-quiz');
    const quizSelectionDiv = document.getElementById('quiz-selection');
    const quizContainer = document.getElementById('quiz-container');
    const quizTitle = document.getElementById('quiz-title');
    const quizProgressBar = document.getElementById('quiz-progress-bar');
    const quizProgressText = document.getElementById('quiz-progress-text');
    const currentQuestionText = document.getElementById('current-question');
    const currentOptionsList = document.getElementById('current-options');
    const submitAnswerButton = document.getElementById('submit-answer');
    const nextQuestionButton = document.getElementById('next-question');
    const quizFeedbackMessage = document.getElementById('quiz-feedback-message');
    const quizResultsDiv = document.getElementById('quiz-results');
    const quizScoreText = document.getElementById('quiz-score');
    const quizResultFeedback = document.getElementById('quiz-result-feedback');
    const restartQuizButton = document.getElementById('restart-quiz');

    let currentQuizTopic = '';
    let currentQuizQuestions = [];
    let currentQuizQuestionIndex = 0;
    let score = 0;
    let selectedAnswerIndex = -1;


     // Populate quiz topic selector
     Object.keys(quizData).forEach(topicKey => {
         if (quizData[topicKey].length > 0 || topicKey === 'comprehensive') { // Only add topics with questions
             const option = document.createElement('option');
             option.value = topicKey;
             option.textContent = capitalizeFirstLetter(topicKey.replace(/_/g, ' ')); // Format name
             quizTopicSelect.appendChild(option);
         }
     });

    function startQuiz() {
        currentQuizTopic = quizTopicSelect.value;
        currentQuizQuestions = quizData[currentQuizTopic];
        if (!currentQuizQuestions || currentQuizQuestions.length === 0) {
            alert('No questions available for this topic yet.');
            return;
        }

        currentQuizQuestionIndex = 0;
        score = 0;
        selectedAnswerIndex = -1;

        quizSelectionDiv.style.display = 'none';
        quizResultsDiv.style.display = 'none';
        quizContainer.style.display = 'block';
        nextQuestionButton.style.display = 'none';
        submitAnswerButton.style.display = 'block';
        submitAnswerButton.disabled = true; // Disable until an option is selected
        quizFeedbackMessage.style.display = 'none';

        quizTitle.textContent = `${capitalizeFirstLetter(currentQuizTopic.replace(/_/g, ' '))} Quiz`;

        displayQuizQuestion();
    }

    function displayQuizQuestion() {
        const questionData = currentQuizQuestions[currentQuizQuestionIndex];
        currentQuestionText.textContent = `${currentQuizQuestionIndex + 1}. ${questionData.q}`;
        currentOptionsList.innerHTML = ''; // Clear previous options

        questionData.options.forEach((option, index) => {
            const li = document.createElement('li');
            li.textContent = option;
            li.dataset.index = index;
            li.classList.add('quiz-option');
            li.addEventListener('click', handleOptionSelect);
            currentOptionsList.appendChild(li);
        });

        // Update progress bar
        const progressPercent = ((currentQuizQuestionIndex + 1) / currentQuizQuestions.length) * 100;
        quizProgressBar.style.width = `${progressPercent}%`;
        quizProgressText.textContent = `Question ${currentQuizQuestionIndex + 1} of ${currentQuizQuestions.length}`;

        // Reset state for the new question
        selectedAnswerIndex = -1;
        submitAnswerButton.disabled = true;
        submitAnswerButton.style.display = 'block'; // Ensure submit is visible
        nextQuestionButton.style.display = 'none'; // Hide next button
        quizFeedbackMessage.style.display = 'none';
        enableOptions(); // Make sure options are clickable
    }

    function handleOptionSelect(event) {
        // Remove 'selected' from previously selected option
        const currentlySelected = currentOptionsList.querySelector('.selected');
        if (currentlySelected) {
            currentlySelected.classList.remove('selected');
        }

        // Add 'selected' to clicked option
        event.target.classList.add('selected');
        selectedAnswerIndex = parseInt(event.target.dataset.index);
        submitAnswerButton.disabled = false; // Enable submit button
    }

    function submitAnswer() {
        if (selectedAnswerIndex === -1) return; // Should not happen if button is enabled

        const questionData = currentQuizQuestions[currentQuizQuestionIndex];
        const correctAnswerIndex = questionData.answer;
        const options = currentOptionsList.querySelectorAll('li');

        disableOptions(); // Prevent changing answer after submission
        submitAnswerButton.style.display = 'none'; // Hide submit button
        nextQuestionButton.style.display = 'inline-block'; // Show next/finish button

        // Provide feedback
        quizFeedbackMessage.style.display = 'block';
        if (selectedAnswerIndex === correctAnswerIndex) {
            score++;
            options[selectedAnswerIndex].classList.add('correct');
            quizFeedbackMessage.textContent = 'Correct!';
            quizFeedbackMessage.style.color = 'green';
        } else {
            options[selectedAnswerIndex].classList.add('incorrect');
            options[correctAnswerIndex].classList.add('correct'); // Show the correct answer
            quizFeedbackMessage.textContent = `Incorrect. The correct answer was: ${options[correctAnswerIndex].textContent}`;
            quizFeedbackMessage.style.color = 'red';
        }

        // Check if last question
        if (currentQuizQuestionIndex === currentQuizQuestions.length - 1) {
            nextQuestionButton.textContent = 'Finish Quiz';
        } else {
            nextQuestionButton.textContent = 'Next Question';
        }
    }

    function nextQuizQuestion() {
        currentQuizQuestionIndex++;
        if (currentQuizQuestionIndex < currentQuizQuestions.length) {
            displayQuizQuestion();
        } else {
            showQuizResults();
        }
    }

    function showQuizResults() {
        quizContainer.style.display = 'none'; // Hide question area
        quizResultsDiv.style.display = 'block';

        const percentage = Math.round((score / currentQuizQuestions.length) * 100);
        quizScoreText.textContent = `You scored: ${score} out of ${currentQuizQuestions.length} (${percentage}%)`;

        let feedback = '';
        if (percentage === 100) {
            feedback = 'Excellent work!';
        } else if (percentage >= 75) {
            feedback = 'Good job! You know this topic well.';
        } else if (percentage >= 50) {
            feedback = 'Not bad, but some review might be helpful.';
        } else {
            feedback = 'Keep studying! Review the material for this topic.';
        }
        quizResultFeedback.textContent = feedback;

        // Save score to localStorage for progress tracker
         const scoreString = `${score}/${currentQuizQuestions.length} (${percentage}%)`;
         localStorage.setItem(`quiz_score_${currentQuizTopic}`, scoreString);
         updateProgressTracker(); // Update the progress display immediately
    }

    function restartQuiz() {
        quizResultsDiv.style.display = 'none';
        quizSelectionDiv.style.display = 'block'; // Show topic selection again
    }

     function disableOptions() {
         currentOptionsList.querySelectorAll('li').forEach(li => {
             li.removeEventListener('click', handleOptionSelect);
             li.style.cursor = 'default';
             li.classList.add('disabled'); // Optional visual cue
         });
     }

     function enableOptions() {
        currentOptionsList.querySelectorAll('li').forEach(li => {
            // Remove old listener before adding new one (belt-and-suspenders)
             li.removeEventListener('click', handleOptionSelect);
             li.addEventListener('click', handleOptionSelect);
            li.style.cursor = 'pointer';
            li.classList.remove('disabled', 'selected', 'correct', 'incorrect');
        });
     }


    startQuizButton.addEventListener('click', startQuiz);
    submitAnswerButton.addEventListener('click', submitAnswer);
    nextQuestionButton.addEventListener('click', nextQuizQuestion);
    restartQuizButton.addEventListener('click', restartQuiz);

    // --- Utility Functions ---
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // --- Initial Setup Calls ---
    updateProgressTracker(); // Load initial progress on page load

}); // End DOMContentLoaded
