function updateSparkButtonLabel() {
  const balance = parseInt(localStorage.getItem("sparkBalance")) || 0;
  const label = document.getElementById("token-label");
  if (label) {
    label.textContent = balance > 0 ? balance.toLocaleString() : "SparkTokens";
  }
}

const sparkTiers = [
  { amount: 1000, price: 14.99 },
  { amount: 2000, price: 24.99, bonus: "20% Extra!" },
  { amount: 5000, price: 54.99, bonus: "36% Extra!" },
  { amount: 10000, price: 94.99, bonus: "58% Extra!" },
];

function openSparkModal() {
  const modal = document.getElementById("sparkModal");
  const container = modal.querySelector(".token-options");
  container.innerHTML = "";

  const extraMap = {
    2000: "20-extra.png",
    5000: "36-extra.png",
    10000: "59-extra.png"
  };

  sparkTiers.forEach(tier => {
    const card = document.createElement("div");
    card.className = "token-card";

    // Assign background color
    card.style.backgroundColor = {
      1000: "#e87d66",
      2000: "#4ea6c0",
      5000: "#a178c9",
      10000: "#f3b51b"
    }[tier.amount];

    // Bonus badge
    const bonusImg = tier.bonus
      ? `<img class="bonus-img" src="assets/${extraMap[tier.amount]}" alt="${tier.bonus}" />`
      : "";

    card.innerHTML = `
      ${bonusImg}
      <img src="assets/sparkTokens-by-strongmind.png" class="token-logo" alt="SparkTokens Logo" />
      <h3>${tier.amount.toLocaleString()}</h3>
      <p>$${tier.price.toFixed(2)}</p>
      <button onclick="confirmPurchase(${tier.amount}, ${tier.price})">BUY NOW</button>
    `;

    container.appendChild(card);
  });

  modal.classList.remove("hidden");
}

function closeSparkModal() {
  document.getElementById("sparkModal").classList.add("hidden");
}

function confirmPurchase(amount, price) {
  const confirmed = confirm(`Purchase ${amount.toLocaleString()} SparkTokens for $${price.toFixed(2)} with your credit card on file?`);
  if (confirmed) {
    let balance = parseInt(localStorage.getItem("sparkBalance")) || 0;
    balance += amount;
    localStorage.setItem("sparkBalance", balance);
    updateSparkButtonLabel();
    closeSparkModal();
  }
}

function loadView(role) {
  const app = document.getElementById("app");
  if (role === "parent") {
    app.innerHTML = `<h2>Parent Dashboard</h2><p>Manage your school, students, and subscriptions here.</p>`;
  } else if (role === "learner") {
    app.innerHTML = `<h2>Adult Learner View</h2><p>Track your progress and explore courses.</p>`;
  } else if (role === "edutect") {
    app.innerHTML = `<h2>Edutect Dashboard</h2><p>Create and manage your courses.</p>`;
  }
}

// === GLOBAL FUNCTIONS (not nested!) ===
function toggleHamburger() {
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.toggle("hidden");
}

function resetDemo() {
  if (confirm("Are you sure you want to reset the demo? This will clear all your data.")) {
    localStorage.clear();
    location.reload();
  }
}

function showInfoModal() {
  const infoModal = document.getElementById("infoModal");
  infoModal.classList.remove("hidden");
}

function hideInfoModal() {
  const infoModal = document.getElementById("infoModal");
  infoModal.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  updateSparkButtonLabel();

  const sparkBtn = document.querySelector(".spark-button");
  const closeBtn = document.querySelector(".close");
  sparkBtn?.addEventListener("click", openSparkModal);
  closeBtn?.addEventListener("click", closeSparkModal);

  // Hamburger dropdown handling
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("dropdownMenu");

  hamburger?.addEventListener("click", toggleHamburger);

  window.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !hamburger.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });

  // Info modal
  const infoItem = document.getElementById("infoItem");
  const closeInfoModalBtn = document.getElementById("closeInfoModal");

  infoItem?.addEventListener("click", () => {
    showInfoModal();
    dropdown.classList.add("hidden");
  });

  closeInfoModalBtn?.addEventListener("click", hideInfoModal);

  // Reset Demo
  const resetItem = document.getElementById("resetItem");
  resetItem?.addEventListener("click", () => {
    dropdown.classList.add("hidden");
    resetDemo();
  });
});
