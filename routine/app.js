const routineContainer = document.getElementById('routineContainer');
const dateDisplay = document.getElementById('dateDisplay');

function getDayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}

async function initDashboard() {
    await initAuth();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Show a loading state
    routineContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary)">Loading routine from Supabase...</p>';
    
    // Fetch data asynchronously
    await loadRoutine();
    const todayStr = getTodayString();
    await loadProgress(todayStr);

    const today = new Date();
    const dayName = getDayName();
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = today.toLocaleDateString('en-US', options);

    const todayRoutine = currentRoutine[dayName];
    if (!todayRoutine) {
        routineContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary)">No routine set for today!</p>';
        return;
    }

    renderRoutine(todayRoutine, todayStr);
    
    // Update active highlight every minute
    setInterval(updateActiveHighlight, 60000);
}

function renderRoutine(routineData, dateKey) {
    routineContainer.innerHTML = '';
    
    const todayProgress = currentProgress[dateKey] || {};

    routineData.forEach(block => {
        const isChecked = todayProgress[block.id] ? 'checked' : '';
        
        const card = document.createElement('div');
        card.className = 'glass-card block-card';
        card.setAttribute('data-start', block.start);
        card.setAttribute('data-end', block.end);
        
        const startTime = formatTime(block.start);
        const endTime = formatTime(block.end);

        card.innerHTML = `
            <div class="block-info">
                <span class="time">${startTime} - ${endTime}</span>
                <h3 class="title">${block.title}</h3>
                <span class="tag ${block.type}">${block.type}</span>
            </div>
            <div class="completion-check">
                <label>Did correctly?</label>
                <input type="checkbox" class="custom-checkbox progress-check" 
                    data-id="${block.id}" ${isChecked}>
            </div>
        `;

        routineContainer.appendChild(card);
    });

    updateActiveHighlight();
    attachCheckboxListeners(dateKey);
}

function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
}

function updateActiveHighlight() {
    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    const cards = document.querySelectorAll('.block-card');
    cards.forEach(card => {
        const start = card.getAttribute('data-start');
        const end = card.getAttribute('data-end');
        
        const startMins = timeToMinutes(start);
        let endMins = timeToMinutes(end);
        
        if (endMins < startMins) {
            endMins += 24 * 60;
        }

        let isCurrent = false;
        
        if (startMins <= endMins) {
             if (currentTotalMinutes >= startMins && currentTotalMinutes < endMins) {
                 isCurrent = true;
             }
        }
        
        let adjCurrent = currentTotalMinutes;
        if (startMins > 24 * 60 - 12 * 60 && currentTotalMinutes < 12 * 60) {
            adjCurrent += 24 * 60;
        }
        
        if (adjCurrent >= startMins && adjCurrent < endMins) {
             isCurrent = true;
        }

        if (isCurrent) {
            card.classList.add('active-now');
        } else {
            card.classList.remove('active-now');
        }
    });
}

function timeToMinutes(time24) {
    const [h, m] = time24.split(':');
    return parseInt(h) * 60 + parseInt(m);
}

function attachCheckboxListeners(dateKey) {
    const checkboxes = document.querySelectorAll('.progress-check');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', async (e) => {
            const blockId = e.target.getAttribute('data-id');
            const isDone = e.target.checked;
            
            if (!currentProgress[dateKey]) {
                currentProgress[dateKey] = {};
            }
            
            // Optimistic UI update locally
            const newProgress = { ...currentProgress[dateKey] };
            newProgress[blockId] = isDone;
            
            // Save to Supabase asynchronously
            await saveProgress(dateKey, newProgress);
        });
    });
}

initDashboard();
