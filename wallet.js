let balance = parseInt(localStorage.getItem('sparkBalance')) || 0;
let history = JSON.parse(localStorage.getItem('sparkHistory')) || [];

function updateDisplay() {
  document.getElementById('balance').textContent = balance;
  const historyList = document.getElementById('history');
  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function addTokens(amount) {
  balance += amount;
  history.unshift(`+${amount} SparkTokens`);
  saveAndUpdate();
}

function spendTokens(amount) {
  if (balance >= amount) {
    balance -= amount;
    history.unshift(`-${amount} SparkTokens`);
    saveAndUpdate();
  } else {
    alert("Not enough SparkTokens!");
  }
}

function saveAndUpdate() {
  localStorage.setItem('sparkBalance', balance);
  localStorage.setItem('sparkHistory', JSON.stringify(history.slice(0, 10)));
  updateDisplay();
}

updateDisplay();
