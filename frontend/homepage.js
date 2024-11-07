function logout() {
    window.location.href = 'index.html';
}

function admin() {
    window.location.href = 'adminpage.html';
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
});

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function showCalendarView(year = currentYear, month = currentMonth) {
    const urlParams = new URLSearchParams(window.location.search);
    const scheduleData = urlParams.get('schedule');
    const scheduleDiv = document.getElementById('schedule');
    scheduleDiv.innerHTML = '';  

    if (scheduleData) {
        const schedule = JSON.parse(decodeURIComponent(scheduleData));
        const scheduleDetails = schedule.details;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        
        const calendarTable = document.createElement('table');
        calendarTable.classList.add('calendar-table');

        const monthYearDiv = document.createElement('div');
        monthYearDiv.classList.add('month-year');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearDiv.textContent = `${monthNames[month]} ${year}`;

        const navigationDiv = document.createElement('div');
        navigationDiv.classList.add('calendar-navigation');
        const prevButton = document.createElement('button');
        prevButton.textContent = '◀';
        prevButton.addEventListener('click', () => {
            if (month === 0) {
                currentMonth = 11;
                currentYear -= 1;
            } else {
                currentMonth -= 1;
            }
            showCalendarView(currentYear, currentMonth);
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = '▶';
        nextButton.addEventListener('click', () => {
            if (month === 11) {
                currentMonth = 0;
                currentYear += 1;
            } else {
                currentMonth += 1;
            }
            showCalendarView(currentYear, currentMonth);
        });

        navigationDiv.appendChild(prevButton);
        navigationDiv.appendChild(monthYearDiv);
        navigationDiv.appendChild(nextButton);

        scheduleDiv.appendChild(navigationDiv);

        const headerRow = calendarTable.insertRow();
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });

        let date = 1;
        for (let i = 0; i < 6; i++) {
            const row = calendarTable.insertRow();

            for (let j = 0; j < 7; j++) {
                const cell = row.insertCell();

                if (i === 0 && j < firstDay) {
                    cell.classList.add('empty');
                } else if (date > daysInMonth) {
                    cell.classList.add('empty');
                } else {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    const detail = scheduleDetails.find(detail => detail.date === dateStr);

                    if (detail) {
                        cell.classList.add('work-day');
                        cell.textContent = date;
                        const hoursDiv = document.createElement('div');
                        hoursDiv.classList.add('hours');
                        hoursDiv.textContent = detail.hours;
                        cell.appendChild(hoursDiv);
                    } else {
                        cell.textContent = date;
                    }
                    date++;
                }
            }
        }

        scheduleDiv.appendChild(calendarTable);
    }
}

function showDayView() {
    const urlParams = new URLSearchParams(window.location.search);
    const scheduleData = urlParams.get('schedule');

    if (scheduleData) {
        const schedule = JSON.parse(decodeURIComponent(scheduleData));
        const scheduleDetails = schedule.details;
        const scheduleDiv = document.getElementById('schedule');
        scheduleDiv.innerHTML = '';  
        scheduleDiv.classList.add('centered-content');  

        const currentDate = new Date();
        const currentDayStr = currentDate.toDateString(); 

        const header = document.createElement('h2');
        header.textContent = currentDayStr;
        scheduleDiv.appendChild(header);

        const dayScheduleDetails = scheduleDetails.filter(detail => {
            const scheduleDate = new Date(detail.date);
            return scheduleDate.toDateString() === currentDayStr;
        });

        if (dayScheduleDetails.length > 0) {
            const scheduleTable = document.createElement('table');
            scheduleTable.classList.add('centered-table'); 

            const headerRow = scheduleTable.insertRow();
            const headers = ['Status', 'Hours'];
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });

            dayScheduleDetails.forEach(detail => {
                const row = scheduleTable.insertRow();
                const statusCell = row.insertCell();
                statusCell.textContent = detail.status;

                const hoursCell = row.insertCell();
                hoursCell.textContent = detail.status === 'On' ? detail.hours : '';
            });

            scheduleDiv.appendChild(scheduleTable);
        } else {
            const noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'No schedule available for this day.';
            scheduleDiv.appendChild(noDataMessage);
        }
    }
}

function showWeekView(startDate) {
    
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const capitalizedUsername = username ? username.charAt(0).toUpperCase() + username.slice(1) : '';
    const logoutButton = document.getElementById('logoutButton');
    const adminButton = document.getElementById('adminButton');

    logoutButton.addEventListener('click', logout);
    adminButton.addEventListener('click', admin);

    if (capitalizedUsername) {
        const welcomeMessage = document.getElementById('welcomeMessage');
        welcomeMessage.textContent = `Welcome, ${capitalizedUsername}!`;
    }

    const viewButtons = document.querySelectorAll('.view-buttons button');

    function setActiveButton(activeButton) {
        viewButtons.forEach(button => {
            if (button === activeButton) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }


    showDayView();
    setActiveButton(document.getElementById('dayViewButton'));

    document.getElementById('calendarViewButton').addEventListener('click', () => {
        showCalendarView(currentYear, currentMonth);
        setActiveButton(document.getElementById('calendarViewButton'));
    });

    document.getElementById('dayViewButton').addEventListener('click', () => {
        showDayView();
        setActiveButton(document.getElementById('dayViewButton'));
    });

    document.getElementById('weekViewButton').addEventListener('click', () => {
        showWeekView();
        setActiveButton(document.getElementById('weekViewButton'));
    });
});
