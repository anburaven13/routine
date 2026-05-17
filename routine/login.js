const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const toggleModeBtn = document.getElementById('toggleMode');
const errorMsg = document.getElementById('errorMsg');
const headerTitle = document.querySelector('header h1');
const headerDesc = document.querySelector('header .date-display');

let isLoginMode = true;

// Check if already logged in
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        window.location.href = 'index.html';
    }
}
checkAuth();

toggleModeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        headerTitle.textContent = 'Welcome Back';
        headerDesc.textContent = 'Sign in to manage your routine';
        submitBtn.textContent = 'Sign In';
        toggleModeBtn.parentElement.innerHTML = `Don't have an account? <a href="#" id="toggleMode" style="color: var(--accent); text-decoration: none;">Sign Up</a>`;
    } else {
        headerTitle.textContent = 'Create Account';
        headerDesc.textContent = 'Sign up to create your own routine';
        submitBtn.textContent = 'Sign Up';
        toggleModeBtn.parentElement.innerHTML = `Already have an account? <a href="#" id="toggleMode" style="color: var(--accent); text-decoration: none;">Sign In</a>`;
    }
    
    // Re-attach event listener to new element
    document.getElementById('toggleMode').addEventListener('click', arguments.callee);
    errorMsg.style.display = 'none';
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    errorMsg.style.display = 'none';
    
    let result;
    
    if (isLoginMode) {
        result = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
    } else {
        result = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });
    }
    
    if (result.error) {
        errorMsg.textContent = result.error.message;
        errorMsg.style.display = 'block';
        submitBtn.textContent = isLoginMode ? 'Sign In' : 'Sign Up';
        submitBtn.disabled = false;
    } else {
        // Success! Redirect to dashboard
        window.location.href = 'index.html';
    }
});
