
// === Constants ===
const PLAN_TIERS = {
  Starter: { tokens: 0, color: "#fbd561", text: "#000" },
  SparkPlus: { tokens: 1000, color: "#a178c9", text: "#fff" },
  SparkPremium: { tokens: 2500, color: "#000", text: "#fbd561" }
};

function updateSparkButtonLabel() {
  const balance = parseInt(localStorage.getItem("sparkBalance")) || 0;
  const label = document.getElementById("token-label");
  if (label) {
    label.textContent = balance > 0 ? balance.toLocaleString() : "SparkTokens";
  }
}

function updatePlanButton() {
  const plan = localStorage.getItem("subscriptionPlan") || "Starter";
  const button = document.getElementById("plan-button");

  const { color, text } = PLAN_TIERS[plan];
  button.textContent = `Plan: ${plan}`;
  button.style.background = color;
  button.style.color = text;
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

function openSubscriptionModal() {
  const modal = document.getElementById("subscriptionModal");
  modal.classList.remove("hidden");
  updatePlanCards();
}

function closeSubscriptionModal() {
  document.getElementById("subscriptionModal").classList.add("hidden");
}

function updatePlanCards() {
  const currentPlan = localStorage.getItem("subscriptionPlan") || "Starter";
  const cards = document.querySelectorAll(".plan-card");

  cards.forEach(card => {
    const title = card.querySelector("h3").textContent.trim();
    const button = card.querySelector("button");
    if (title === currentPlan) {
      button.textContent = "Current Plan";
      button.disabled = true;
      button.style.background = "#ccc";
      button.style.color = "#333";
    } else {
      button.textContent = title === "SparkPremium" ? "Subscribe" : "Subscribe";
      button.disabled = false;
      if (title === "SparkPremium") {
        button.style.background = "linear-gradient(160deg, #e97e66, #f0b21a)";
        button.style.color = "#000";
      } else {
        button.style.background = "#fbd561";
        button.style.color = "#000";
      }
    }
  });
}

function selectPlan(plan) {
  const current = localStorage.getItem("subscriptionPlan") || "Starter";
  const isDowngrade =
    (current === "SparkPremium" && plan !== "SparkPremium") ||
    (current === "SparkPlus" && plan === "Starter");

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
    const balance = parseInt(localStorage.getItem("sparkBalance")) || 0;
    localStorage.setItem("sparkBalance", balance + PLAN_TIERS[plan].tokens);
    updatePlanButton();
    updateSparkButtonLabel();
    showSuccessAnimation(`Switched to ${plan} + Tokens added!`);
    closeSubscriptionModal();
    modal.remove();
  };

  document.getElementById("cancelUpgrade").onclick = () => modal.remove();
}

document.addEventListener("DOMContentLoaded", () => {
  updateSparkButtonLabel();
  updatePlanButton();

  document.getElementById("plan-button").addEventListener("click", openSubscriptionModal);
  document.getElementById("closeSubscriptionModal").addEventListener("click", closeSubscriptionModal);

  const hamburger = document.getElementById("hamburger");
  hamburger?.addEventListener("click", () => {
    document.getElementById("hamburgerDropdown").classList.toggle("hidden");
  });

  const infoItem = document.getElementById("infoItem");
  infoItem?.addEventListener("click", () => {
    document.getElementById("infoModal").classList.remove("hidden");
  });

  const closeInfoModalBtn = document.getElementById("closeInfoModal");
  closeInfoModalBtn?.addEventListener("click", () => {
    document.getElementById("infoModal").classList.add("hidden");
  });

  const resetItem = document.getElementById("resetItem");
  resetItem?.addEventListener("click", () => {
    if (confirm("Reset all demo data?")) {
      localStorage.clear();
      location.reload();
    }
  });

  updatePlanCards();
});
    
