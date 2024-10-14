// Your existing JavaScript functions
let currentMonthIndex = 0;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthlyData = {};

function loadData() {
    const savedData = JSON.parse(localStorage.getItem('paymentData')) || {};
    Object.assign(monthlyData, savedData);
    updateTable();
}

function updateTable() {
    const table = document.getElementById('paymentTable').querySelector('tbody');
    table.innerHTML = '';
    const currentMonth = months[currentMonthIndex];

    if (!monthlyData[currentMonth]) {
        monthlyData[currentMonth] = [];
    }

    monthlyData[currentMonth].forEach((rowData, index) => addRow(rowData, index));
    document.getElementById('currentMonth').textContent = currentMonth;
}

function addRow(data = {name: '', phone: '', prepaid: '', value: '', date: '', furniture: '', days: '', confirmed: false}, index = null) {
    const table = document.getElementById('paymentTable').querySelector('tbody');
    const row = document.createElement('tr');

    row.innerHTML = 
        `<td><textarea class="large-input name">${data.name}</textarea></td>
        <td><textarea class="large-input phone">${data.phone}</textarea></td>
        <td><input type="number" class="small-input prepaid" value="${data.prepaid}" /></td>
        <td><input type="number" class="small-input value" value="${data.value}" /></td>
        <td><input type="date" class="small-input date" value="${data.date}" /></td>
        <td><textarea class="extra-large-input furniture" rows="4" maxlength="100">${data.furniture}</textarea></td>
        <td><input type="number" class="small-input days" value="${data.days}" /></td>
        <td><input type="checkbox" class="checkbox confirmed" ${data.confirmed ? 'checked' : ''} /></td>
        <td><button class="delete-btn" onclick="deleteRow(${index})">Delete</button></td>`;

    table.appendChild(row);
}

function saveCurrentMonthData() {
    const table = document.getElementById('paymentTable').querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    const data = [];

    rows.forEach(row => {
        const name = row.querySelector('.name').value;
        const phone = row.querySelector('.phone').value;
        const prepaid = row.querySelector('.prepaid').value;
        const value = row.querySelector('.value').value;
        const date = row.querySelector('.date').value;
        const furniture = row.querySelector('.furniture').value;
        const days = row.querySelector('.days').value;
        const confirmed = row.querySelector('.confirmed').checked;
        data.push({ name, phone, prepaid, value, date, furniture, days, confirmed });
    });

    fetch('save_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteRow(index) {
    monthlyData[months[currentMonthIndex]].splice(index, 1);
    updateTable();
}

function previousMonth() {
    currentMonthIndex = (currentMonthIndex - 1 + months.length) % months.length;
    updateTable();
}

function nextMonth() {
    currentMonthIndex = (currentMonthIndex + 1) % months.length;
    updateTable();
}

function goToCurrentMonth() {
    const now = new Date();
    currentMonthIndex = now.getMonth();
    updateTable();
}

window.onload = loadData;
