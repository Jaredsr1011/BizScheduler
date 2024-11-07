document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const accountSelect = document.getElementById('accountSelect');
    const loginError = document.getElementById('loginError');

    // Fetch accounts and populate the dropdown
    fetch('/api/accounts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(accounts => {
        // Populate the accountSelect dropdown with account names and IDs
        accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.id;
            option.textContent = account.name;
            accountSelect.appendChild(option);
        });
        checkInputs();  // Check inputs once accounts are loaded
    })
    .catch(error => console.error('Error fetching accounts:', error));

    // Function to check if the input fields are filled and enable the login button accordingly
    function checkInputs() {
        const usernameValue = usernameInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const accountValue = accountSelect.value.trim();

        if (usernameValue !== '' && passwordValue !== '' && accountValue != '') {
            loginButton.classList.add('active');
            loginButton.removeAttribute('disabled');
        } else {
            loginButton.classList.remove('active');
            loginButton.setAttribute('disabled', 'true');
        }
    }

    checkInputs();
    // Add event listeners to input fields to check inputs on each input event and to trigger the login function for login button
    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);
    accountSelect.addEventListener('input', checkInputs);
    loginButton.addEventListener('click', login);
});

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const account_id = document.getElementById('accountSelect').value;
    const loginError = document.getElementById('loginError');

    // Clear any previous error message
    loginError.textContent = '';

    // Send login request to the server
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, password: password})
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            // Fetch the user's schedule after successful login
            fetchSchedule(username, account_id);
        } else {
            // Display the error message
            loginError.textContent = 'Incorrect login.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        loginError.textContent = 'An error occurred during login. Please try again.';
    });
}

function fetchSchedule(username, account_id) {
    // Fetch user ID based on username and account ID
    fetch(`/api/users?username=${username}&account_id=${account_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.user_id) {
            const userId = data.user_id;
            // Fetch the user's schedule using the user ID
            fetch(`/api/users/${userId}/schedule`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(scheduleData => {
                if (scheduleData.schedule_data) {
                    // Encode the schedule data and redirect to the homepage with schedule and username as URL parameters
                    const schedule = encodeURIComponent(JSON.stringify(scheduleData.schedule_data));
                    const usernameParam = encodeURIComponent(username);
                    window.location.href = `homepage.html?username=${usernameParam}&schedule=${schedule}`;
                } else {
                    console.log('No schedule found for this user.');
                }
            })
            .catch(error => console.error('Error fetching schedule:', error));
        } else {
            console.log('User not found.');
        }
    })
    .catch(error => console.error('Error fetching user ID:', error));
}
