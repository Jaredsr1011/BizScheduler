function logout() {
  window.location.href = 'index.html';
}

function home() {
  window.location.href = 'homepage.html';
}

document.addEventListener("DOMContentLoaded", function() {
  const hamburgerButton = document.getElementById('hamburgerButton');
  const dropdownMenu = document.getElementById('dropdownMenu');

  hamburgerButton.addEventListener('click', function() {
      dropdownMenu.classList.toggle('show');
  });

  window.onclick = function(event) {
      if (!event.target.matches('#hamburgerButton')) {
          if (dropdownMenu.classList.contains('show')) {
              dropdownMenu.classList.remove('show');
          }
      }
  };

  const mainItems = document.querySelectorAll('.main-item');

  mainItems.forEach(item => {
      item.addEventListener('click', function() {
          const subList = this.nextElementSibling;

          if (subList) {
              subList.style.display = subList.style.display === 'block' ? 'none' : 'block';
          }
      });
  });

  const subItems = document.querySelectorAll('.sub-item');
  const contentArea = document.getElementById('contentArea');

  subItems.forEach(item => {
      item.addEventListener('click', function(event) {
          event.preventDefault();
          const href = this.getAttribute('href').substring(1);
          loadContent(href);
      });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');
  const capitalizedUsername = username ? username.charAt(0).toUpperCase() + username.slice(1) : '';
  const logoutButton = document.getElementById('logoutButton');
  const homeButton = document.getElementById('homeButton');

  logoutButton.addEventListener('click', logout);
  homeButton.addEventListener('click', home);

  if (capitalizedUsername) {
      const welcomeMessage = document.getElementById('welcomeMessage');
      welcomeMessage.textContent = `Welcome, ${capitalizedUsername}!`;
  }
});

function loadContent(section) {
  const contentArea = document.getElementById('contentArea');
  let content = '';

    switch (section) {
        case 'add-user':
            content = `
                <h2 style="text-align: center;">Add User</h2>
                <form>
                    <div>
                        <label for="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName">
                    </div>
                    <div>
                        <label for="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName">
                    </div>
                    <div>
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email">
                    </div>
                    <div>
                        <label for="new-username">Username:</label>
                        <input type="text" id="new-username" name="new-username">
                    </div>
                    <div>
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password">
                    </div>
                    <div>
                        <label for="birthday">Birthday:</label>
                        <input type="date" id="birthday" name="birthday">
                    </div>
                    <div>
                        <label for="jobTitle">Job Title:</label>
                        <input type="text" id="jobTitle" name="jobTitle">
                    </div>
                    <div>
                        <label for="employeeId">Employee ID:</label>
                        <input type="text" id="employeeId" name="employeeId">
                    </div>
                    <div>
                        <label for="isAdmin">Admin:</label>
                        <input type="checkbox" id="isAdmin" name="isAdmin">
                    </div>
                    <input type="submit" value="Save">
                </form>
            `;
            break;
        case 'modify-user':
            content = `
                <h2 style="text-align: center;">Modify User</h2>
                <form>
                    <div>
                        <label for="employeeSearch">Search Employee:</label>
                        <select id="employeeSearch" name="employeeSearch">
                            <option value="">--Select Employee--</option>
                            <!-- Options will be populated dynamically -->
                        </select>
                    </div>
                    <div>
                        <label for="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName">
                    </div>
                    <div>
                        <label for="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName">
                    </div>
                    <div>
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email">
                    </div>
                    <div>
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" readOnly>
                    </div>
                    <div>
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password">
                    </div>
                    <div>
                        <label for="birthday">Birthday:</label>
                        <input type="date" id="birthday" name="birthday">
                    </div>
                    <div>
                        <label for="jobTitle">Job Title:</label>
                        <input type="text" id="jobTitle" name="jobTitle">
                    </div>
                    <div>
                        <label for="employeeId">Employee ID:</label>
                        <input type="text" id="employeeId" name="employeeId">
                    </div>
                    <div>
                        <label for="isAdmin">Admin:</label>
                        <input type="checkbox" id="isAdmin" name="isAdmin">
                    </div>
                    <div class="button-container">
                        <input type="submit" value="Save" class="save-btn">
                        <input type="submit" value="Delete" class="delete-btn">
                    </div>
                </form>
            `;
            break;
        case 'create-schedule':
            content = `
                <h2 style="text-align: center;">Create Schedule</h2>
                <form>
                    <div>
                        <label for="employeeSelect">Select Employee:</label>
                        <select id="employeeSelect" name="employeeSelect">
                            <option value="">--Select Employee--</option>
                            <!-- Options will be populated dynamically -->
                        </select>
                    </div>
                    <input type="submit" value="Save">
                </form>
            `;
            break;
        case 'modify-schedule':
            content = `
                <h2 style="text-align: center;">Modify Schedule</h2>
                <form>
                    <div>
                        <label for="employeeSelect">Select Employee:</label>
                        <select id="employeeSelect" name="employeeSelect">
                            <option value="">--Select Employee--</option>
                            <!-- Options will be populated dynamically -->
                        </select>
                    </div>
                    <input type="submit" value="Save">
                </form>
            `;
            break;
        default:
            content = '<h2>Welcome to BizSchedule</h2><p>Select an option from the menu to get started.</p>';
    }

    contentArea.innerHTML = content;
    }
