// === Constants ===
const PLAN_TIERS = {
  Starter: { tokens: 0, color: "#fbd561", text: "#000" },
  SparkPlus: { tokens: 1000, color: "#a178c9", text: "#fff" },
  SparkPremium: { tokens: 2500, color: "#000", text: "#fbd561" }
};

// === UI Update Functions ===
function updateSparkButtonLabel() {
  const balance = parseInt(localStorage.getItem("sparkBalance")) || 0;
  const label = document.getElementById("token-label");
  if (label) {
    label.textContent = balance > 0 ? balance.toLocaleString() : "SparkTokens";
  }
}
window.updateSparkButtonLabel = updateSparkButtonLabel;

function updatePlanButton() {
  const plan = localStorage.getItem("subscriptionPlan") || "Starter";
  const button = document.getElementById("plan-button");
  if (!button) return;
  const { color, text } = PLAN_TIERS[plan];
  button.textContent = `Plan: ${plan}`;
  button.style.background = color;
  button.style.color = text;
}
window.updatePlanButton = updatePlanButton;

function confirmPurchase(amount, price) {
  const confirmMsg = `Are you sure you want to purchase ${amount.toLocaleString()} SparkTokens for $${price.toFixed(2)}?`;
  if (!window.confirm(confirmMsg)) return;
  const currentBalance = parseInt(localStorage.getItem("sparkBalance")) || 0;
  const newBalance = currentBalance + amount;
  localStorage.setItem("sparkBalance", newBalance);
  updateSparkButtonLabel();
  showSuccessAnimation(`Purchased ${amount.toLocaleString()} SparkTokens!`);
  closeSparkModal();
}
window.confirmPurchase = confirmPurchase;

function showSuccessAnimation(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed", top: "80px", right: "20px", background: "#4caf50", color: "white",
    padding: "12px 20px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 5000, opacity: 1, transition: "opacity 0.5s"
  });
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = 0; setTimeout(() => toast.remove(), 500); }, 2000);
}

function closeSparkModal() {
  document.getElementById("sparkModal").classList.add("hidden");
}
window.closeSparkModal = closeSparkModal;

function openSparkModal() {
  const modal = document.getElementById("sparkModal");
  const container = modal.querySelector(".token-options");
  container.innerHTML = "";
  const tiers = [
    { amount: 1000, price: 14.99 },
    { amount: 2000, price: 24.99, bonus: "20% Extra!" },
    { amount: 5000, price: 54.99, bonus: "36% Extra!" },
    { amount: 10000, price: 94.99, bonus: "58% Extra!" },
  ];
  const colorMap = {
    1000: "#e87d66", 2000: "#4ea6c0", 5000: "#a178c9", 10000: "#f3b51b",
  };
  const bonusMap = {
    2000: "20-extra.png", 5000: "36-extra.png", 10000: "59-extra.png",
  };
  tiers.forEach(tier => {
    const card = document.createElement("div");
    card.className = "token-card";
    card.style.backgroundColor = colorMap[tier.amount];
    const bonusImg = tier.bonus ? `<img class="bonus-img" src="assets/${bonusMap[tier.amount]}" alt="${tier.bonus}" />` : "";
    const formattedAmount = tier.amount === 10000 ? tier.amount.toLocaleString() : tier.amount.toString();
    card.innerHTML = `
      ${bonusImg}
      <img src="assets/sparkTokens-by-strongmind.png" class="token-logo" alt="SparkTokens Logo" />
      <h3>${formattedAmount}</h3>
      <p>$${tier.price.toFixed(2)}</p>
      <small style="margin-top: -8px; display: block; font-size: 0.75rem;">USD</small>
      <button onclick="confirmPurchase(${tier.amount}, ${tier.price})">BUY NOW</button>
    `;
    container.appendChild(card);
  });
  modal.classList.remove("hidden");
}
window.openSparkModal = openSparkModal;

function openSubscriptionModal() {
  document.getElementById("subscriptionModal").classList.remove("hidden");
  updatePlanCards();
}
window.openSubscriptionModal = openSubscriptionModal;

function closeSubscriptionModal() {
  document.getElementById("subscriptionModal").classList.add("hidden");
}
window.closeSubscriptionModal = closeSubscriptionModal;

function updatePlanCards() {
  const currentPlan = localStorage.getItem("subscriptionPlan") || "Starter";
  const cards = document.querySelectorAll(".plan-card");
  cards.forEach(card => {
    const title = card.querySelector("h3").textContent.trim().replace(/\s+/g, "");
    const button = card.querySelector("button");
    if (title === currentPlan) {
      button.textContent = "Current Plan";
      button.disabled = true;
      button.style.background = "#ccc";
      button.style.color = "#333";
    } else {
      button.textContent = "Subscribe";
      button.disabled = false;
      button.style.background = title === "SparkPremium" ? "linear-gradient(160deg, #e97e66, #f0b21a)" : "#fbd561";
      button.style.color = "#000";
    }
  });
}
window.updatePlanCards = updatePlanCards;

function selectPlan(plan) {
  const current = localStorage.getItem("subscriptionPlan") || "Starter";
  const isDowngrade = (current === "SparkPremium" && plan !== "SparkPremium") || (current === "SparkPlus" && plan === "Starter");
  if (plan === current) return;
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${isDowngrade ? "Downgrade" : "Upgrade"} Plan</h2>
      <p>Are you sure you want to ${isDowngrade ? "downgrade to" : "upgrade to"} <strong>${plan}</strong>?</p>
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
    balance += PLAN_TIERS[plan].tokens;
    localStorage.setItem("sparkBalance", balance);
    showSuccessAnimation(`Switched to ${plan} + Tokens added!`);
    closeSubscriptionModal();
    updatePlanCards();
    updatePlanButton();
    updateSparkButtonLabel();
    modal.remove();
  };
  document.getElementById("cancelUpgrade").onclick = () => modal.remove();
}
window.selectPlan = selectPlan;
