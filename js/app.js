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
    card.style.backgroundColor = {
      1000: "#e87d66",
      2000: "#4ea6c0",
      5000: "#a178c9",
      10000: "#f3b51b"
    }[tier.amount];

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
  const confirmed = confirm(`Purchase ${amount.toLocaleString()} SparkTokens for $${price.toFixed(2)}?`);
  if (confirmed) {
    addTokens(amount);
    closeSparkModal();
  }
}

function addTokens(amount) {
  let balance = parseInt(localStorage.getItem("sparkBalance")) || 0;
  balance += amount;
  localStorage.setItem("sparkBalance", balance);
  updateSparkButtonLabel();
  showSuccessAnimation(`+${amount.toLocaleString()} SparkTokens added`);
}

function showSuccessAnimation(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.top = "80px";
  toast.style.right = "20px";
  toast.style.background = "#4caf50";
  toast.style.color = "white";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  toast.style.zIndex = 5000;
  toast.style.opacity = 1;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

// === Subscription Modal ===
function openSubscriptionModal() {
  document.getElementById("subscriptionModal").classList.remove("hidden");
}

function closeSubscriptionModal() {
  document.getElementById("subscriptionModal").classList.add("hidden");
}

function selectPlan(plan) {
  if (!["SparkPlus", "SparkPremium"].includes(plan)) return;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Upgrade Plan</h2>
      <p>Are you sure you want to upgrade to <strong>${plan}</strong>?</p>
      <div style="margin-top: 20px; display: flex; justify-content: center; gap: 16px;">
        <button id="confirmUpgrade" style="padding: 10px 18px; font-weight: bold;">Yes</button>
        <button id="cancelUpgrade" style="padding: 10px 18px;">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("confirmUpgrade").onclick = () => {
    localStorage.setItem("subscriptionPlan", plan);

    let balance = parseInt(localStorage.getItem("sparkBalance")) || 0;
    if (plan === "SparkPlus") balance += 1000;
    if (plan === "SparkPremium") balance += 2500;

    localStorage.setItem("sparkBalance", balance);

    updatePlanButton();
    updateSparkButtonLabel();
    showSuccessAnimation(`Upgraded to ${plan} + SparkTokens added`);
    closeSubscriptionModal();
    modal.remove();
  };

  document.getElementById("cancelUpgrade").onclick = () => modal.remove();
}

function updatePlanButton() {
  const plan = localStorage.getItem("subscriptionPlan") || "Starter";
  const button = document.getElementById("plan-button");

  let text = `Plan: ${plan}`;
  let style = {};

  if (plan === "SparkPlus") {
    style = { background: "#a178c9", color: "#fff" };
  } else if (plan === "SparkPremium") {
    style = { background: "#000", color: "#fbd561" };
  } else {
    style = { background: "#fbd561", color: "#000" }; // Starter
  }

  button.textContent = text;
  Object.assign(button.style, style);
}

// === Global Setup ===
function toggleHamburger() {
  const dropdown = document.getElementById("hamburgerDropdown");
  if (dropdown) dropdown.classList.toggle("hidden");
}

function resetDemo() {
  if (confirm("Are you sure you want to reset the demo? This will clear all your data.")) {
    localStorage.clear();
    location.reload();
  }
}

function showInfoModal() {
  document.getElementById("infoModal").classList.remove("hidden");
}

function hideInfoModal() {
  document.getElementById("infoModal").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  updateSparkButtonLabel();
  updatePlanButton();

  document.getElementById("plan-button").addEventListener("click", openSubscriptionModal);
  document.getElementById("closeSubscriptionModal").addEventListener("click", closeSubscriptionModal);

  const sparkBtn = document.querySelector(".spark-button");
  const closeBtns = document.querySelectorAll(".close");
  sparkBtn?.addEventListener("click", openSparkModal);
  closeBtns.forEach(btn => btn.addEventListener("click", e => {
    e.target.closest(".modal").classList.add("hidden");
  }));

  // Hamburger dropdown
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("hamburgerDropdown");

  hamburger?.addEventListener("click", toggleHamburger);

  window.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !hamburger.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });

  // Info modal
  const closeInfoModalBtn = document.getElementById("closeInfoModal");
  document.getElementById("infoItem")?.addEventListener("click", () => {
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
