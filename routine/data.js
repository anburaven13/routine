const SUPABASE_URL = 'https://pcevmuzadmqabnpnjmoq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_yG2v-zrGuPuSkXwd5m-_-Q_XuMpPcpY';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const defaultRoutine = {
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
    "Sunday": []
};

// Global references accessible by pages
let currentRoutine = null;
let currentProgress = {};
let currentUser = null;

// Initialize Auth
async function initAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    currentUser = session ? session.user : null;
    
    // Listen for auth changes
    supabaseClient.auth.onAuthStateChange((event, session) => {
        currentUser = session ? session.user : null;
        if (event === 'SIGNED_OUT') {
            window.location.href = 'login.html';
        }
    });
}

// Log out function
async function logout() {
    await supabaseClient.auth.signOut();
}

// Asynchronously load the routine from Supabase
async function loadRoutine() {
    if (!currentUser) return null;

    const { data, error } = await supabaseClient
        .from('routine_data')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

    if (data && data.schedule) {
        currentRoutine = data.schedule;
        return currentRoutine;
    } else {
        // First time running, insert default routine
        await supabaseClient
            .from('routine_data')
            .insert([{ user_id: currentUser.id, schedule: defaultRoutine }]);
        
        currentRoutine = defaultRoutine;
        return currentRoutine;
    }
}

// Save edited routine back to Supabase
async function saveRoutine(routineData) {
    if (!currentUser) return;
    
    currentRoutine = routineData;
    const { error } = await supabaseClient
        .from('routine_data')
        .upsert({ user_id: currentUser.id, schedule: routineData });
    
    if (error) console.error("Error saving routine:", error);
}

// Load progress for a specific date
async function loadProgress(dateKey) {
    if (!currentUser) return currentProgress;

    const { data, error } = await supabaseClient
        .from('routine_progress')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('date', dateKey)
        .single();
    
    if (data && data.progress) {
        currentProgress[dateKey] = data.progress;
    } else {
        currentProgress[dateKey] = {};
    }
    return currentProgress;
}

// Save progress to Supabase
async function saveProgress(dateKey, progressData) {
    if (!currentUser) return;
    
    currentProgress[dateKey] = progressData;
    const { error } = await supabaseClient
        .from('routine_progress')
        .upsert({ user_id: currentUser.id, date: dateKey, progress: progressData });
        
    if (error) console.error("Error saving progress:", error);
}

function getTodayString() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
