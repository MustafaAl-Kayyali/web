document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', login);
    }

    handleAuthButton();      
    setupLogoutButton();
});

if (!localStorage.getItem('accounts')) {
    const defaultAccounts = [
        {
            email: 'mustafa@example.com',
            password: '1234',
            name: 'Mustafa',
            role: 'Admin',
            status: 'Active'
        },
        {
            email: 'abed@gmail.com',
            password: '4321',
            name: 'Abed',
            role: 'User',
            status: 'Active'
        }
    ];
    localStorage.setItem('accounts', JSON.stringify(defaultAccounts));
}

let accounts = JSON.parse(localStorage.getItem('accounts'));


function login(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    accounts = JSON.parse(localStorage.getItem('accounts')) || accounts;

    const account = accounts.find(acc => acc.email === email && acc.password === password);

    if (account) {
        if (account.status !== 'Active') {
            alert('Your account is not active. Please contact support.');
            return;
        }

        localStorage.setItem('loggedInUser', JSON.stringify(account));
        checkLoginStatus();
    } else {
        alert('Invalid email or password');
    }
}

function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        if (user.role === 'Admin') {
            window.location.href = '/html/Admin.html';
        } else {
            window.location.href = '/html/index.html';
        }
    }
}

function checkPassword() {
    const password = document.getElementById("thePassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    return true;
}

function Signup() {
    if (!checkPassword()) {
        return;
    }

    const name = document.getElementById('first').value.trim();
    const lastName = document.getElementById('last').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const password = document.getElementById('thePassword').value.trim();

    if (!email || !password || !name || !lastName) {
        alert('Please fill in all fields');
        return;
    }

    accounts = JSON.parse(localStorage.getItem('accounts')) || accounts;

    const exists = accounts.some(acc => acc.email === email);
    if (exists) {
        alert('Email already registered');
        return;
    }

    const newAccount = {
        email: email,
        password: password,
        name: `${name} ${lastName}`,
        role: "User",
        status: "Active"
    };

    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    alert('Account created successfully');

    window.location.href = '/html/index.html';
}

function logout() {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out');
    window.location.href = '/html/index.html';
}

function handleAuthButton() {
    const authButton = document.getElementById('authButton');
    const authText = document.getElementById('authText');
    const authIcon = authButton?.querySelector('i');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (authButton && authText && authIcon) {
        if (loggedInUser) {
            authText.innerText = 'Logout';
            authIcon.className = 'fas fa-sign-out-alt';
            authButton.href = '#';
            authButton.addEventListener('click', function (e) {
                e.preventDefault();
                logout();
            });
        } else {
            authText.innerText = 'Login';
            
            authIcon.className = 'fas fa-user';
            authButton.href = '/html/Login.html';
        }
    }
}

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }
}
