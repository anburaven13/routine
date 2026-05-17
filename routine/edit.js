const daySelector = document.getElementById('daySelector');
const editBlocksContainer = document.getElementById('editBlocksContainer');
const currentDayTitle = document.getElementById('currentDayTitle');
const addBlockBtn = document.getElementById('addBlockBtn');
const saveBtn = document.getElementById('saveBtn');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let selectedDay = days[new Date().getDay()] || 'Monday'; 
const currentDayIndex = new Date().getDay();
selectedDay = currentDayIndex === 0 ? 'Sunday' : days[currentDayIndex - 1];

let workingRoutine = null;

async function initEdit() {
    await initAuth();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    editBlocksContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary)">Loading routine from Supabase...</p>';
    
    // Fetch data asynchronously
    await loadRoutine();
    
    // We need a working copy of the routine to edit before saving
    workingRoutine = JSON.parse(JSON.stringify(currentRoutine));

    renderDaySelector();
    renderBlocksForDay(selectedDay);
}

function renderDaySelector() {
    daySelector.innerHTML = '';
    days.forEach(day => {
        const btn = document.createElement('button');
        btn.className = `day-btn ${day === selectedDay ? 'active' : ''}`;
        btn.textContent = day;
        btn.onclick = () => {
            selectedDay = day;
            renderDaySelector();
            renderBlocksForDay(selectedDay);
        };
        daySelector.appendChild(btn);
    });
    currentDayTitle.textContent = selectedDay;
}

function renderBlocksForDay(day) {
    editBlocksContainer.innerHTML = '';
    const blocks = workingRoutine[day] || [];
    
    blocks.forEach((block, index) => {
        const row = document.createElement('div');
        row.className = 'edit-block';
        row.innerHTML = `
            <input type="text" value="${block.title}" placeholder="Activity Name" data-index="${index}" class="edit-title">
            <input type="time" value="${block.start}" data-index="${index}" class="edit-start">
            <input type="time" value="${block.end}" data-index="${index}" class="edit-end">
            <select data-index="${index}" class="edit-type">
                <option value="school" ${block.type === 'school' ? 'selected' : ''}>School</option>
                <option value="study" ${block.type === 'study' ? 'selected' : ''}>Study</option>
                <option value="class" ${block.type === 'class' ? 'selected' : ''}>Class/Tuition</option>
                <option value="break" ${block.type === 'break' ? 'selected' : ''}>Break/Chill</option>
                <option value="sleep" ${block.type === 'sleep' ? 'selected' : ''}>Sleep</option>
            </select>
            <button class="btn-danger remove-btn" data-index="${index}">✕</button>
        `;
        editBlocksContainer.appendChild(row);
    });

    // Attach remove listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            workingRoutine[selectedDay].splice(index, 1);
            renderBlocksForDay(selectedDay);
        });
    });
    
    // Attach change listeners to update working data
    document.querySelectorAll('.edit-title, .edit-start, .edit-end, .edit-type').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = e.target.getAttribute('data-index');
            const field = e.target.className.replace('edit-', '');
            workingRoutine[selectedDay][index][field] = e.target.value;
        });
    });
}

addBlockBtn.addEventListener('click', () => {
    if (!workingRoutine[selectedDay]) {
        workingRoutine[selectedDay] = [];
    }
    workingRoutine[selectedDay].push({
        id: `custom-${Date.now()}`,
        title: "New Activity",
        start: "12:00",
        end: "13:00",
        type: "study"
    });
    renderBlocksForDay(selectedDay);
});

saveBtn.addEventListener('click', async () => {
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "Saving to cloud...";
    
    Object.keys(workingRoutine).forEach(day => {
        workingRoutine[day].sort((a, b) => {
            return a.start.localeCompare(b.start);
        });
    });
    
    // Asynchronously save to Supabase
    await saveRoutine(workingRoutine);
    
    saveBtn.textContent = "Saved Successfully! ✓";
    saveBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = "";
    }, 2000);
});

initEdit();
