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

  // ✅ Disable "Claim Now" if already claimed
const claimed = localStorage.getItem("welcomeBonusClaimed");
if (claimed === "true") {
  const claimBtn = document.getElementById("claimWelcomeBonus");
  if (claimBtn) {
    claimBtn.textContent = "Claimed!";
    claimBtn.disabled = true;
    claimBtn.style.background = "#ccc";
  }
 }
}

document.addEventListener("click", (e) => {
  if (e.target.id === "claimWelcomeBonus") {
    // Check if already claimed
    const claimed = localStorage.getItem("welcomeBonusClaimed");
    if (claimed === "true") return;

    // Add 500 tokens
    const balance = parseInt(localStorage.getItem("sparkBalance")) || 0;
    localStorage.setItem("sparkBalance", balance + 500);
    localStorage.setItem("welcomeBonusClaimed", "true"); // ✅ remember they claimed

    updateSparkButtonLabel();
    showSuccessAnimation("🎉 500 SparkTokens added to your wallet!");

    // Update button
    e.target.textContent = "Claimed!";
    e.target.disabled = true;
    e.target.style.background = "#ccc";
  }
});

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
  renderDashboardHeader();
    renderDashboardCards();
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

    // Hide the onboarding modal, but keep overlay visible for setup flow
    onboardingModal.style.display = "none";

    // If homeschool, continue to setup; otherwise remove overlay right away
    if (selectedType === "homeschool") {
    document.getElementById("homeschoolStep1Modal").style.display = "flex";
    } else {
    overlay.classList.add("hidden"); // only hide for non-homeschool types
    }
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
  const step1 = document.getElementById("homeschoolStep1Modal");
  const step2 = document.getElementById("homeschoolDetailsModal");
  const overlay = document.getElementById("screenOverlay");

  // Hide welcome, show setup form
  step1.style.display = "none";
  step2.classList.remove("hidden");

  // Hide overlay now that setup form is visible
  overlay.classList.add("hidden");
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

  // ✨ Success animation on Save button
  const saveBtn = document.getElementById("saveHomeschoolInfo");
  saveBtn.textContent = "✓ Saved!";
  saveBtn.style.background = "#4CAF50";
  saveBtn.style.color = "white";
  saveBtn.style.transition = "all 0.3s ease";

  // Fade out modal smoothly before hiding overlay and refreshing
  const modal = document.getElementById("homeschoolDetailsModal");
  modal.style.transition = "opacity 0.4s ease";
  modal.style.opacity = "0";

  setTimeout(() => {
    modal.classList.add("hidden");
    document.getElementById("screenOverlay")?.classList.add("hidden");
    location.reload(); // optional refresh
  }, 800);
};

  if (picFile) {
    reader.readAsDataURL(picFile);
  } else {
    reader.onload(); // use default
  }
});

// Skip this step button
document.getElementById("skipOnboardingStep")?.addEventListener("click", () => {
  document.getElementById("homeschoolDetailsModal").classList.add("hidden");
  document.getElementById("screenOverlay")?.classList.add("hidden");
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

function renderDashboardHeader() {
  const profileData = JSON.parse(localStorage.getItem('homeschoolProfile')) || {};
  const firstName = profileData.first || 'Friend';
  const homeschool = profileData.school || 'Your Homeschool';
  const photo = profileData.photo || 'assets/default-profile.png';

  const headerHTML = `
    <div class="dashboard-welcome">
      <div class="profile-thumb" id="profileThumb">
        <img id="dashboardProfilePic" src="${photo}" alt="Profile Photo" />
        <div class="edit-overlay">EDIT</div>
      </div>
      <div class="welcome-text">
        <h1>Welcome, ${firstName}!</h1>
        <h3>${homeschool.includes('Homeschool') ? homeschool : `${homeschool} Homeschool`}</h3>
      </div>
    </div>
  `;

  document.getElementById('dashboardHeader').innerHTML = headerHTML;

  // Enable click to open profile modal
  const thumb = document.getElementById("profileThumb");
  thumb?.addEventListener("click", () => {
    document.getElementById("profileModal").classList.remove("hidden");
    loadProfileData();
  });
}

function renderDashboardCards() {
  const grid = document.getElementById("dashboardGrid");
  grid.innerHTML = "";

  // ---- SECTION: YOUR HUB ----
  grid.insertAdjacentHTML("beforeend",
    `<div class="section-divider"><span>Your Hub</span></div>`
  );

  const hubCards = [
    {
      title: "🔔 Notifications",
      subtitle: "You have 8 updates to review",
      bodyHTML: `
        <div class="live-feed scrollable">
          <div class="feed-item">💬 <strong>Emily</strong> commented on your post in “Homeschool Science Projects.”</div>
          <div class="feed-item">📅 New field trip announced: <strong>Desert Botanical Garden – Nov 14</strong>.</div>
          <div class="feed-item">🎉 <strong>Liam</strong> joined the “STEM Learners” group.</div>
          <div class="feed-item">⭐ <strong>Your post</strong> received 12 new likes!</div>
          <div class="feed-item">🧠 New lesson added: <strong>Exploring the Solar System</strong>.</div>
          <div class="feed-item">💬 <strong>Olivia</strong> replied: “We loved that field trip last year!”</div>
          <div class="feed-item">📚 Featured post: “5 Ways to Keep Learning Fun at Home.”</div>
          <div class="feed-item">🎈 <strong>Community Meetup</strong> this Saturday at City Park!</div>
        </div>
      `
    },
    { title: "Learners", subtitle: "Track progress for each learner." },
    {
      title: "Groups",
      subtitle: "Join and manage homeschool groups.",
      image: "assets/card-pics/groups-card.png"
    },
    {
      title: "Explore Marketplace",
      subtitle: "Discover endless educational content",
      image: "assets/card-pics/marketplace-card.png"
    },
    { title: "Lesson Library", subtitle: "Explore lessons and Spark content." },
    { title: "Upcoming Events", subtitle: "Field trips, meetups, and more." }
  ];

  hubCards.forEach(card => {
    const div = document.createElement("div");
    div.className = "dashboard-card";

    const subtitleHTML = card.subtitle
      ? `<p class="card-sub">${card.subtitle}</p>`
      : "";

    const imageHTML = card.image
      ? `<div class="card-image-container"><img src="${card.image}" class="card-image" alt=""></div>`
      : "";

    const bodyHTML = card.bodyHTML || "";

    div.innerHTML = `
      <h2>${card.title}</h2>
      ${subtitleHTML}
      ${imageHTML}
      ${bodyHTML}
    `;
    grid.appendChild(div);
  });

  // ---- SECTION: MARKETPLACE ----
  grid.insertAdjacentHTML("beforeend",
    `<div class="section-divider"><span>Marketplace</span></div>`
  );

  const marketplaceWrapper = document.createElement("div");
  marketplaceWrapper.className = "marketplace-section";
  marketplaceWrapper.innerHTML = `
    <div class="featured-card">
      <div class="featured-label">Featured Course</div>
      <!-- Use any banner you have; these are placeholders -->
      <img src="assets/featured-writing-banner.png" class="featured-banner" alt="Featured Course">
      <div class="featured-info">
        <h3>Creative Writing 101</h3>
        <p>by Edutect: Mrs. Smithers</p>
        <div class="rating">⭐ 4.5 <small>(1,328 reviews)</small></div>
      </div>
    </div>

<div class="recommended-section">
  <div class="recommended-label">Recommended for You</div>
  <div class="recommended-scroll">

    <div class="rec-card">
      <img src="assets/rec-algebra.png" alt="Algebra 1">
      <div class="overlay">
        <p><strong>By:</strong> Jason Lang</p>
        <p><strong>Year:</strong> 2025</p>
        <p><strong>Cost:</strong> 250 ⚡ </p>
        <p>⭐ 4.6 - 318 reviews</p>
      </div>
      <p>Algebra 1</p>
    </div>

    <div class="rec-card">
      <img src="assets/rec-history.png" alt="World History">
      <div class="overlay">
        <p><strong>By:</strong> Dr. Amelia Cruz</p>
        <p><strong>Year:</strong> 2024</p>
        <p><strong>Cost:</strong> 300 ⚡ </p>
        <p>⭐ 4.8 - 512 reviews</p>
      </div>
      <p>World History</p>
    </div>

    <div class="rec-card">
      <img src="assets/rec-science.png" alt="Science 101">
      <div class="overlay">
        <p><strong>By:</strong> Aaron Patel</p>
        <p><strong>Year:</strong> 2025</p>
        <p><strong>Cost:</strong> 200 ⚡ </p>
        <p>⭐ 4.3 - 241 reviews</p>
      </div>
      <p>Science 101</p>
    </div>

    <div class="rec-card">
      <img src="assets/rec-art.png" alt="Art History 2">
      <div class="overlay">
        <p><strong>By:</strong> Sofia Moretti</p>
        <p><strong>Year:</strong> 2023</p>
        <p><strong>Cost:</strong> 275 ⚡ </p>
        <p>⭐ 4.9 - 678 reviews</p>
      </div>
      <p>Art History 2</p>
    </div>

    <div class="rec-card">
      <img src="assets/rec-photography.png" alt="Photography 101">
      <div class="overlay">
        <p><strong>By:</strong> Laura Chen</p>
        <p><strong>Year:</strong> 2025</p>
        <p><strong>Cost:</strong> 180 ⚡ </p>
        <p>⭐ 4.5 - 392 reviews</p>
      </div>
      <p>Photography 101</p>
    </div>

    <div class="rec-card">
      <img src="assets/rec-biology.png" alt="Biology 2">
      <div class="overlay">
        <p><strong>By:</strong> Dr. Miles Everett</p>
        <p><strong>Year:</strong> 2024</p>
        <p><strong>Cost:</strong> 320 ⚡ </p>
        <p>⭐ 4.7 - 467 reviews</p>
      </div>
      <p>Biology 2</p>
    </div>

  </div>
</div>
  `;
  grid.appendChild(marketplaceWrapper);
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
      setTimeout(() => {
      location.reload();
    }, 400);
    });
  }
});

// === Edutect Follow Button Toggle ===
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("follow-btn")) {
    e.target.classList.toggle("following");
    e.target.textContent = e.target.classList.contains("following")
      ? "Following"
      : "Follow";
  }
});

// === Profile Modal Logic ===
document.getElementById("profileItem")?.addEventListener("click", () => {
  document.getElementById("profileModal").classList.remove("hidden");
  loadProfileData();
});

document.getElementById("closeProfileModal")?.addEventListener("click", () => {
  document.getElementById("profileModal").classList.add("hidden");
});

document.getElementById('updatePhotoBtn').addEventListener('click', () => {
  document.getElementById('profileUpload').click();
});

function loadProfileData() {
  const stored = JSON.parse(localStorage.getItem("homeschoolProfile")) || {};
  const fullName = `${stored.first || ""} ${stored.last || ""}`.trim();

  document.getElementById("profileImage").src = stored.photo || "assets/default-profile.png";
  document.getElementById("profileName").textContent = fullName || "Your Name";
  document.getElementById("nameInput").value = fullName;
  document.getElementById("emailInput").value = stored.email || "";
  document.getElementById("phoneInput").value = stored.phone || "";
  document.getElementById("schoolNameInput").value = stored.school || "Your Homeschool";
  document.getElementById("bioInput").value = stored.bio || "";
  document.getElementById("publicProfileToggle").checked = stored.public || false;
  document.getElementById("profileVisibilityLabel").textContent = stored.public ? "Public Profile" : "Private Profile";

  const currentPlan = localStorage.getItem("subscriptionPlan") || "Starter";
  document.getElementById("paymentInfo").innerHTML = `${currentPlan} - Active<br>Next Payment: Nov 20`;
}

document.getElementById("publicProfileToggle")?.addEventListener("change", (e) => {
  const label = document.getElementById("profileVisibilityLabel");
  label.textContent = e.target.checked ? "Public Profile" : "Private Profile";
});

document.getElementById("profileUpload")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("profileImage").src = reader.result;
  };
  if (file) reader.readAsDataURL(file);
});

document.getElementById("profileForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const [first, ...lastParts] = document.getElementById("nameInput").value.trim().split(" ");
  const last = lastParts.join(" ");
  const email = document.getElementById("emailInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  const school = document.getElementById("schoolNameInput").value.trim() || "Your Homeschool";
  const bio = document.getElementById("bioInput").value.trim();
  const publicProfile = document.getElementById("publicProfileToggle").checked;
  const photo = document.getElementById("profileImage").src;

  const stored = {
    first, last, email, phone, school, bio, public: publicProfile, photo
  };

  localStorage.setItem("homeschoolProfile", JSON.stringify(stored));
  document.getElementById("profileName").textContent = `${first} ${last}`;
  alert("Profile saved!");
});
