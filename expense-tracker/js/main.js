
    const balance = document.getElementById('my_balance');
    const add_money = document.getElementById('add-money');
    const remove_money = document.getElementById('remove-money');
    const list = document.getElementById('list');
    const form = document.getElementById('form');
    const text = document.getElementById('text');
    const amount = document.getElementById('amount');

    const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

    let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];






// pie chart configuration

var xValues = ["Balance", "Income", "Expense"];
var yValues = [3500, 5000, 1500];
var barColors = [
"#2ecc71",
"#00aba9",
"#b91d47"
];

var _myChart=  new Chart("myChart", {
type: "pie",
data: {
    labels: xValues,
    datasets: [{
    backgroundColor: barColors,
    data: yValues
    }]
},
options: {
    title: {
    display: true,
    text: "Expense tracker pie chart"
    }
}
});




    // Add transaction
    function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please insert a text and amount');
    } else {
        const transaction = {
        id: generateID(),
        text: text.value,
        amount: +amount.value
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
    }

    // Generate random ID
    function generateID() {
    return Math.floor(Math.random() * 100000000);
    }

    // Add transactions to DOM list
    function addTransactionDOM(transaction) {
    // Get sign
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    // Add class based on value
    item.classList.add(transaction.amount < 0 ? 'remove' : 'add');

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(
        transaction.amount
    )}</span> <button class="delete-btn" onclick="removeTransaction(${
        transaction.id
    })">x</button>
    `;

    list.appendChild(item);
    }

    // Update the balance, income and expense
    function updateValues() {
        const amounts = transactions.map(transaction => transaction.amount);

        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

        const income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0)
            .toFixed(2);

        const expense = (
            amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
            -1
        ).toFixed(2);

        balance.innerText = `Rs ${total}`;
        add_money.innerText = `Rs ${income}`;
        remove_money.innerText = `Rs ${expense}`;

        _myChart.data.datasets[0].data = [total, income,expense];
        _myChart.update();  

    }

    // Remove transaction by ID
    function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
    }

    // Update local storage transactions
    function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Init app
    function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
    }

    init();

    form.addEventListener('submit', addTransaction);

    