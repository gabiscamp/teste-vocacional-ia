const USERNAME = "admin";
const PASSWORD = "123";
const LOGIN_STORAGE_KEY = "admin_logged_in"; 

function setLoggedIn(isLoggedIn) {
    localStorage.setItem(LOGIN_STORAGE_KEY, isLoggedIn ? "true" : "false");
}

function checkLoginStatus() {
    return localStorage.getItem(LOGIN_STORAGE_KEY) === "true";
}

function logout() {
    setLoggedIn(false);
    window.location.href = 'login.html';
}

if (document.getElementById('adminLoginForm')) {
    document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        if (usernameInput === USERNAME && passwordInput === PASSWORD) {
            setLoggedIn(true);
            window.location.href = 'admin.html';
        } else {
            alert('Usuário ou senha incorretos.');
        }
    });
}

if (window.location.pathname.endsWith('admin.html')) {
    if (!checkLoginStatus()) {
        window.location.href = 'login.html';
    }
}

window.logout = logout;