const weeklyContainer = document.getElementById('weeklyContainer');

async function initWeekly() {
    await initAuth();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    weeklyContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary)">Loading routine from Supabase...</p>';
    
    // Fetch data asynchronously
    await loadRoutine();
    
    weeklyContainer.innerHTML = '';
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach(day => {
        const col = document.createElement('div');
        col.className = 'day-column';
        
        let blocksHtml = '';
        if (currentRoutine[day]) {
            currentRoutine[day].forEach(block => {
                blocksHtml += `
                    <div class="mini-card">
                        <div class="mini-time">${formatTime(block.start)} - ${formatTime(block.end)}</div>
                        <h4 class="mini-title">${block.title}</h4>
                        <span class="tag ${block.type}" style="font-size: 0.6rem; padding: 2px 8px;">${block.type}</span>
                    </div>
                `;
            });
        }

        col.innerHTML = `
            <h2 class="day-title">${day}</h2>
            <div class="blocks-container">
                ${blocksHtml}
            </div>
        `;
        
        weeklyContainer.appendChild(col);
    });
}

function formatTime(time24) {
    if(!time24) return '';
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
}

initWeekly();
