// Study schedule page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize collapsible sections
    initializeCollapsibleSections();
    
    // Initialize day tracking
    initializeDayTracking();
});

// Function to initialize collapsible sections
function initializeCollapsibleSections() {
    const collapsibleHeaders = document.querySelectorAll('.day-header');
    
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class on the header
            this.classList.toggle('active');
            
            // Toggle the content visibility
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
    
    // Expand the current day by default
    const currentDay = getCurrentStudyDay();
    if (currentDay > 0 && currentDay <= 20) {
        const currentDayHeader = document.querySelector(`.day-header[data-day="${currentDay}"]`);
        if (currentDayHeader) {
            currentDayHeader.classList.add('active');
            const content = currentDayHeader.nextElementSibling;
            content.style.maxHeight = content.scrollHeight + "px";
            
            // Scroll to current day
            setTimeout(() => {
                currentDayHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }
}

// Function to initialize day tracking
function initializeDayTracking() {
    const startDateElement = document.getElementById('study-start-date');
    const startButton = document.getElementById('start-study-plan');
    const resetButton = document.getElementById('reset-study-plan');
    const currentDayElement = document.getElementById('current-day');
    
    if (!startDateElement || !startButton || !currentDayElement) return;
    
    // Check if study plan has already started
    let startDate = localStorage.getItem('studyStartDate');
    
    if (startDate) {
        // Plan already started, calculate current day
        const currentDay = getCurrentStudyDay();
        updateCurrentDayDisplay(currentDay);
        
        // Show reset button
        if (resetButton) {
            resetButton.style.display = 'inline-block';
        }
        
        // Hide start button
        startButton.style.display = 'none';
        
        // Show start date
        const formattedDate = new Date(startDate).toLocaleDateString();
        startDateElement.textContent = formattedDate;
    } else {
        // Plan not started yet
        if (resetButton) {
            resetButton.style.display = 'none';
        }
        
        // Set default start date to today
        const today = new Date();
        startDateElement.value = today.toISOString().split('T')[0];
    }
    
    // Add event listener to start button
    startButton.addEventListener('click', function() {
        const selectedDate = startDateElement.value;
        if (selectedDate) {
            localStorage.setItem('studyStartDate', new Date(selectedDate).toISOString());
            
            // Update display
            const currentDay = getCurrentStudyDay();
            updateCurrentDayDisplay(currentDay);
            
            // Show reset button
            if (resetButton) {
                resetButton.style.display = 'inline-block';
            }
            
            // Hide start button
            startButton.style.display = 'none';
            
            // Show start date
            const formattedDate = new Date(selectedDate).toLocaleDateString();
            startDateElement.textContent = formattedDate;
            
            // Refresh collapsible sections to highlight current day
            initializeCollapsibleSections();
        }
    });
    
    // Add event listener to reset button
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset your study plan? This will clear your progress.')) {
                localStorage.removeItem('studyStartDate');
                localStorage.removeItem('completedDays');
                
                // Reload page
                location.reload();
            }
        });
    }
    
    // Add event listeners to day completion checkboxes
    const dayCheckboxes = document.querySelectorAll('.day-completion');
    dayCheckboxes.forEach(checkbox => {
        const day = parseInt(checkbox.getAttribute('data-day'));
        
        // Set initial state
        const completedDays = JSON.parse(localStorage.getItem('completedDays') || '[]');
        if (completedDays.includes(day)) {
            checkbox.checked = true;
        }
        
        // Add change event
        checkbox.addEventListener('change', function() {
            let completedDays = JSON.parse(localStorage.getItem('completedDays') || '[]');
            
            if (this.checked) {
                // Add day to completed days if not already included
                if (!completedDays.includes(day)) {
                    completedDays.push(day);
                }
            } else {
                // Remove day from completed days
                completedDays = completedDays.filter(d => d !== day);
            }
            
            // Save to localStorage
            localStorage.setItem('completedDays', JSON.stringify(completedDays));
            
            // Update progress
            updateStudyProgress();
        });
    });
    
    // Initial progress update
    updateStudyProgress();
}

// Function to get current study day
function getCurrentStudyDay() {
    const startDate = localStorage.getItem('studyStartDate');
    if (!startDate) return 0;
    
    const start = new Date(startDate);
    const today = new Date();
    
    // Calculate difference in days
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because day 1 starts on the start date
    
    return Math.min(Math.max(diffDays, 1), 20); // Clamp between 1 and 20
}

// Function to update current day display
function updateCurrentDayDisplay(day) {
    const currentDayElement = document.getElementById('current-day');
    if (!currentDayElement) return;
    
    if (day > 20) {
        currentDayElement.innerHTML = 'You have completed the 20-day study plan! <span class="highlight">Review any topics you still find challenging.</span>';
    } else {
        currentDayElement.textContent = `Current Day: ${day} of 20`;
    }
}

// Function to update study progress
function updateStudyProgress() {
    const progressBar = document.getElementById('study-progress');
    const progressText = document.getElementById('study-progress-text');
    if (!progressBar || !progressText) return;
    
    const completedDays = JSON.parse(localStorage.getItem('completedDays') || '[]');
    const percentage = Math.round((completedDays.length / 20) * 100);
    
    progressBar.style.width = percentage + '%';
    progressText.textContent = `${completedDays.length} of 20 days completed (${percentage}%)`;
    
    // Update overall progress
    updateProgress();
}
