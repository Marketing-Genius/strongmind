// === UI Update Functions ===
function updatePlanButton() {
  const plan = localStorage.getItem("subscriptionPlan") || "Starter";
  const button = document.getElementById("plan-button");
  if (!button) return;

  const PLAN_UI = {
    Starter: { color: "#fbd561", text: "#000" },
    SparkPlus: { color: "#a178c9", text: "#fff" },
    SparkPremium: { color: "#000", text: "#fbd561" }
  };

  const { color, text } = PLAN_UI[plan];
  button.textContent = `Plan: ${plan}`;
  button.style.background = color;
  button.style.color = text;
}

function updateSparkButtonLabel() {
  const balance = parseInt(localStorage.getItem("sparkBalance")) || 0;
  const label = document.getElementById("token-label");
  if (label) {
    label.textContent = balance > 0 ? balance.toLocaleString() : "SparkTokens";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updatePlanButton();
  updateSparkButtonLabel();

  // === Hamburger Menu Toggle ===
  const hamburger = document.getElementById('hamburger');
  const dropdown = document.getElementById('hamburgerDropdown');

  if (hamburger && dropdown) {
    hamburger.addEventListener('click', () => {
      dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  // === Plan Button ===
  const planBtn = document.getElementById('plan-button');
  if (planBtn) {
    planBtn.addEventListener('click', () => {
      const modal = document.getElementById('subscriptionModal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  }

  // === SparkTokens Button ===
  const sparkButton = document.querySelector('.spark-button');
  if (sparkButton) {
    sparkButton.addEventListener('click', () => {
      const modal = document.getElementById('sparkModal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  }

  // === Click outside SparkTokens modal to close
  const sparkModal = document.getElementById("sparkModal");
  if (sparkModal) {
    window.addEventListener("click", (e) => {
      if (!sparkModal.classList.contains("hidden") && e.target === sparkModal) {
        if (typeof closeSparkModal === "function") closeSparkModal();
        else sparkModal.classList.add("hidden"); // fallback
      }
    });
  }

  // === User Type Icon ===
  const userTypeIcon = document.getElementById('userTypeIcon');
  if (userTypeIcon) {
    const userType = localStorage.getItem('userType');
    if (userType === 'homeschool') {
      userTypeIcon.src = 'assets/icon-homeschool.png';
    } else if (userType === 'learner') {
      userTypeIcon.src = 'assets/icon-learner.png';
    } else if (userType === 'edutech') {
      userTypeIcon.src = 'assets/icon-edutech.png';
    }
  }

  // === Reset Demo ===
  const resetBtn = document.getElementById('resetItem');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }

  // === (Optional) Profile Navigation ===
  const profileItem = document.getElementById('profileItem');
  if (profileItem) {
    profileItem.addEventListener('click', () => {
      window.location.href = 'profile.html';
    });
  }

  // === Add more navigation handlers here (Settings, Wallet, etc.) ===
});
