// Final tips page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer if on final tips page
    initializeCountdown();
    
    // Initialize study plan checklist
    initializeChecklist();
});

// Function to initialize countdown timer to exam
function initializeCountdown() {
    const countdownElement = document.getElementById('exam-countdown');
    if (!countdownElement) return;
    
    // Set exam date (20 days from now as default)
    let examDate = localStorage.getItem('examDate');
    if (!examDate) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 20);
        examDate = defaultDate.toISOString();
        localStorage.setItem('examDate', examDate);
    }
    
    // Update countdown every second
    function updateCountdown() {
        const now = new Date();
        const examDateTime = new Date(examDate);
        const diff = examDateTime - now;
        
        if (diff <= 0) {
            countdownElement.innerHTML = '<span class="highlight">Today is your exam day! Good luck!</span>';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div class="countdown-item"><span class="countdown-value">${days}</span><span class="countdown-label">days</span></div>
            <div class="countdown-item"><span class="countdown-value">${hours}</span><span class="countdown-label">hours</span></div>
            <div class="countdown-item"><span class="countdown-value">${minutes}</span><span class="countdown-label">minutes</span></div>
            <div class="countdown-item"><span class="countdown-value">${seconds}</span><span class="countdown-label">seconds</span></div>
        `;
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
    
    // Allow user to set custom exam date
    const dateInput = document.getElementById('exam-date-input');
    const dateButton = document.getElementById('set-exam-date');
    
    if (dateInput && dateButton) {
        // Set initial value to current exam date
        const initialDate = new Date(examDate);
        dateInput.value = initialDate.toISOString().split('T')[0];
        
        dateButton.addEventListener('click', function() {
            const newDate = new Date(dateInput.value);
            if (!isNaN(newDate.getTime())) {
                localStorage.setItem('examDate', newDate.toISOString());
                updateCountdown();
                
                // Show confirmation
                const confirmation = document.createElement('div');
                confirmation.className = 'alert alert-success mt-2';
                confirmation.textContent = 'Exam date updated successfully!';
                dateButton.parentNode.appendChild(confirmation);
                
                // Remove confirmation after 3 seconds
                setTimeout(() => {
                    confirmation.remove();
                }, 3000);
            }
        });
    }
}

// Function to initialize study plan checklist
function initializeChecklist() {
    const checklistItems = document.querySelectorAll('.checklist-item');
    if (!checklistItems.length) return;
    
    // Load saved checklist state
    const savedChecklist = JSON.parse(localStorage.getItem('finalTipsChecklist') || '{}');
    
    checklistItems.forEach((item, index) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        
        // Set initial state from localStorage
        if (savedChecklist[index]) {
            checkbox.checked = true;
            item.classList.add('completed');
        }
        
        // Add change event
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
            
            // Save state to localStorage
            savedChecklist[index] = this.checked;
            localStorage.setItem('finalTipsChecklist', JSON.stringify(savedChecklist));
            
            // Update progress
            updateChecklistProgress();
        });
    });
    
    // Initial progress update
    updateChecklistProgress();
}

// Function to update checklist progress
function updateChecklistProgress() {
    const progressBar = document.getElementById('checklist-progress');
    const progressText = document.getElementById('checklist-progress-text');
    if (!progressBar || !progressText) return;
    
    const checklistItems = document.querySelectorAll('.checklist-item');
    const completedItems = document.querySelectorAll('.checklist-item.completed');
    
    const percentage = Math.round((completedItems.length / checklistItems.length) * 100);
    
    progressBar.style.width = percentage + '%';
    progressText.textContent = `${completedItems.length} of ${checklistItems.length} items completed (${percentage}%)`;
    
    // Update overall progress
    updateProgress();
}
