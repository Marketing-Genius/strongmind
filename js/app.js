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

function updatePlanButton() {
  const plan = localStorage.getItem("subscriptionPlan") || "Starter";
  const button = document.getElementById("plan-button");
  const { color, text } = PLAN_TIERS[plan];
  button.textContent = `Plan: ${plan}`;
  button.style.background = color;
  button.style.color = text;
}

function confirmPurchase(amount, price) {
  const confirmMsg = `Are you sure you want to purchase ${amount.toLocaleString()} SparkTokens for $${price.toFixed(2)}?`;
  const confirmed = window.confirm(confirmMsg);
  if (!confirmed) return;

  const currentBalance = parseInt(localStorage.getItem("sparkBalance")) || 0;
  const newBalance = currentBalance + amount;
  localStorage.setItem("sparkBalance", newBalance);

  updateSparkButtonLabel();
  showSuccessAnimation(`Purchased ${amount.toLocaleString()} SparkTokens!`);
  closeSparkModal();
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
  toast.style.transition = "opacity 0.5s";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

// === Modal Controls ===
function closeSparkModal() {
  document.getElementById("sparkModal").classList.add("hidden");
}

function openSubscriptionModal() {
  document.getElementById("subscriptionModal").classList.remove("hidden");
  updatePlanCards();
}

function closeSubscriptionModal() {
  document.getElementById("subscriptionModal").classList.add("hidden");
}

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
    let balance = parseInt(localStorage.getItem("sparkBalance")) || 0;
    balance += PLAN_TIERS[plan].tokens;
    localStorage.setItem("sparkBalance", balance);

    updatePlanButton();
    updateSparkButtonLabel();
    showSuccessAnimation(`Switched to ${plan} + Tokens added!`);
    closeSubscriptionModal();
    updatePlanCards();
    modal.remove();
  };

  document.getElementById("cancelUpgrade").onclick = () => modal.remove();
}

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
    1000: "#e87d66",
    2000: "#4ea6c0",
    5000: "#a178c9",
    10000: "#f3b51b",
  };

  const bonusMap = {
    2000: "20-extra.png",
    5000: "36-extra.png",
    10000: "59-extra.png",
  };

  tiers.forEach(tier => {
    const card = document.createElement("div");
    card.className = "token-card";
    card.style.backgroundColor = colorMap[tier.amount];

    const bonusImg = tier.bonus
      ? `<img class="bonus-img" src="assets/${bonusMap[tier.amount]}" alt="${tier.bonus}" />`
      : "";

    const formattedAmount =
      tier.amount === 10000 ? tier.amount.toLocaleString() : tier.amount.toString();

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

// === User Type Variables ===
function applyUserTypeBackground(type) {
  const body = document.body;
  const icon = document.getElementById("userTypeIcon");

  // Backgrounds
  if (type === "learner") {
    body.style.background = "linear-gradient(160deg, #4ea6c0, #82d1a8)";
  } else if (type === "edutech") {
    body.style.background = "linear-gradient(160deg, #4ea6c0, #2e768b)";
  } else {
    body.style.background = "linear-gradient(160deg, #e97e66, #f0b21a)";
  }

  // Icons
  if (icon) {
    if (type === "homeschool") {
      icon.src = "assets/icon-homeschool.png";
    } else if (type === "learner") {
      icon.src = "assets/icon-learner.png";
    } else if (type === "edutech") {
      icon.src = "assets/icon-edutech.png";
    } else {
      icon.style.display = "none";
    }
    icon.style.display = "inline-block";
  }
}

// === DOM Ready Setup ===
document.addEventListener("DOMContentLoaded", () => {
  updateSparkButtonLabel();
  updatePlanButton();
  updatePlanCards();

  const overlay = document.getElementById("screenOverlay");
  const onboardingModal = document.getElementById("onboardingModal");
  const storedType = localStorage.getItem("userType");

  // Show modal if not set
  if (!storedType) {
    onboardingModal.style.display = "flex";
    overlay.classList.remove("hidden");
  } else {
    applyUserTypeBackground(storedType);
    onboardingModal.style.display = "none";
    overlay.classList.add("hidden");
  }

  // === Fix: Ensure onboarding buttons are clickable ===
  const buttons = document.querySelectorAll(".onboard-btn");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const selectedType = button.dataset.usertype;
      localStorage.setItem("userType", selectedType);
      applyUserTypeBackground(selectedType);
      onboardingModal.style.display = "none";
      overlay.classList.add("hidden");
    });
  });

  // Recovery: If overlay is visible but modal is not, show modal again
  if (
    !storedType &&
    overlay && !overlay.classList.contains("hidden") &&
    onboardingModal && onboardingModal.style.display === "none"
  ) {
    onboardingModal.style.display = "flex";
  }

  // === Plan modal ===
  document.getElementById("plan-button")?.addEventListener("click", openSubscriptionModal);
  document.getElementById("closeSubscriptionModal")?.addEventListener("click", closeSubscriptionModal);

  // === SparkTokens modal ===
  document.querySelector(".spark-button")?.addEventListener("click", openSparkModal);
  document.querySelector("#sparkModal .close")?.addEventListener("click", closeSparkModal);

  // === Hamburger menu ===
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("hamburgerDropdown");

  hamburger?.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });
  
  document.getElementById("profileItem")?.addEventListener("click", () => {
  openProfileModal();
});

  // Close hamburger if click outside
  window.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });

  // === Info modal ===
  document.getElementById("infoItem")?.addEventListener("click", () => {
    document.getElementById("infoModal").classList.remove("hidden");
    dropdown.classList.add("hidden");
  });

  document.getElementById("closeInfoModal")?.addEventListener("click", () => {
    document.getElementById("infoModal").classList.add("hidden");
  });

  // === Reset Demo ===
  document.getElementById("resetItem")?.addEventListener("click", () => {
    if (confirm("Reset all demo data?")) {
      localStorage.clear();
      location.reload();
    }
  });
});

// Optional: click outside SparkTokens modal to close
window.addEventListener("click", function (e) {
  const modal = document.getElementById("sparkModal");
  if (!modal.classList.contains("hidden") && e.target === modal) {
    closeSparkModal();
  }
});

// Trigger secondary modal for homeschool user setup
document.querySelectorAll(".onboard-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.usertype;
    localStorage.setItem("userType", type);

    // === Backgrounds ===
    if (type === "learner") {
      document.body.style.background = "linear-gradient(160deg, #4ea6c0, #a178c9)";
    } else if (type === "edutech") {
      document.body.style.background = "linear-gradient(160deg, #4ea6c0, #82d1a8)";
    } else {
      document.body.style.background = "linear-gradient(160deg, #e97e66, #f0b21a)";
    }

    // === Show homeschool setup modal if applicable ===
    if (type === "homeschool") {
      document.getElementById("onboardingModal").style.display = "none";
      document.getElementById("homeschoolStep1Modal").style.display = "flex";
    } else {
      document.getElementById("onboardingModal").style.display = "none";
      document.getElementById("screenOverlay")?.classList.add("hidden");
    }
  });
});

// First step: From welcome modal → open detail modal
document.getElementById("homeschoolWelcomeBtn")?.addEventListener("click", () => {
  document.getElementById("homeschoolStep1Modal").style.display = "none";
  document.getElementById("homeschoolDetailsModal").classList.remove("hidden");
});

// Save homeschool user info to localStorage
document.getElementById("saveHomeschoolInfo")?.addEventListener("click", () => {
  const role = document.getElementById("homeschoolRole").value;
  const learners = parseInt(document.getElementById("homeschoolLearners").value);
  const first = document.getElementById("homeschoolFirstName").value.trim();
  const last = document.getElementById("homeschoolLastName").value.trim();
  const school = document.getElementById("homeschoolName").value.trim() || "Your Homeschool";
  const picFile = document.getElementById("uploadProfilePic").files[0];

  const reader = new FileReader();
  reader.onload = () => {
    const profileData = {
      role,
      learners,
      first,
      last,
      school,
      photo: reader.result || "assets/default-profile.png"
    };
    localStorage.setItem("homeschoolProfile", JSON.stringify(profileData));
    document.getElementById("homeschoolDetailsModal").classList.add("hidden");
    document.getElementById("screenOverlay")?.classList.add("hidden");
    location.reload(); // optional: refresh to update profile elsewhere
  };

  if (picFile) {
    reader.readAsDataURL(picFile);
  } else {
    reader.onload(); // use default
  }
});

// === Service Worker registration and update prompt ===
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").then(reg => {
    reg.onupdatefound = () => {
      const newWorker = reg.installing;
      newWorker.onstatechange = () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          if (confirm("A new version is available. Refresh now?")) {
            window.location.reload();
          }
        }
      };
    };
  }).catch(err => {
    console.error("Service Worker registration failed:", err);
  });
}

function openProfileModal() {
  document.getElementById("profileModal").classList.remove("hidden");
  loadProfileData(); // populate fields
}

function closeProfileModal() {
  document.getElementById("profileModal").classList.add("hidden");
}

// Load and sync data from localStorage
function loadProfileData() {
  const stored = JSON.parse(localStorage.getItem("homeschoolProfile")) || {};
  const fullName = `${stored.first || ""} ${stored.last || ""}`.trim();

  document.getElementById("nameInput").value = fullName;
  document.getElementById("emailInput").value = stored.email || "";
  document.getElementById("phoneInput").value = stored.phone || "";
  document.getElementById("schoolNameInput").value = stored.school || "Your Homeschool";
  document.getElementById("profileName").textContent = fullName || "Your Name";
  document.getElementById("profileImage").src = stored.photo || "assets/default-profile.png";
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileItem");
  if (profileBtn) {
    profileBtn.addEventListener("click", openProfileModal);
  }

  document.getElementById("closeProfileModal")?.addEventListener("click", closeProfileModal);

  const profileUpload = document.getElementById("profileUpload");
  if (profileUpload) {
    profileUpload.addEventListener("change", () => {
      const file = profileUpload.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById("profileImage").src = reader.result;
        const stored = JSON.parse(localStorage.getItem("homeschoolProfile")) || {};
        stored.photo = reader.result;
        localStorage.setItem("homeschoolProfile", JSON.stringify(stored));
      };
      reader.readAsDataURL(file);
    });
  }

  const form = document.getElementById("profileForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const [first, ...lastParts] = document.getElementById("nameInput").value.trim().split(" ");
      const last = lastParts.join(" ");

      const stored = JSON.parse(localStorage.getItem("homeschoolProfile")) || {};
      stored.first = first;
      stored.last = last;
      stored.email = document.getElementById("emailInput").value.trim();
      stored.phone = document.getElementById("phoneInput").value.trim();
      stored.school = document.getElementById("schoolNameInput").value.trim() || "Your Homeschool";

      localStorage.setItem("homeschoolProfile", JSON.stringify(stored));
      document.getElementById("profileName").textContent = `${first} ${last}`;
      closeProfileModal();
    });
  }
});
