document.addEventListener("DOMContentLoaded", () => {
  console.log("🎨 StrongMind Creator Dashboard loaded");

  // === Hamburger Menu Logic ===
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("hamburgerDropdown");

  hamburger?.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });

  // === Dropdown Item Click Handling ===
  dropdown.querySelectorAll("div").forEach(item => {
    item.addEventListener("click", () => {
      const text = item.textContent.trim();

      if (text === "Creator Profile") {
        document.getElementById("creatorProfileModal")?.classList.remove("hidden");
      }

      if (text === "Settings") {
        alert("⚙️ Settings coming soon!");
      }

      if (text === "My Courses") {
        alert("📚 Course management tools coming soon!");
      }

      if (text === "Earnings Dashboard") {
        alert("💰 Earnings dashboard coming soon!");
      }

      if (text === "Reset Demo") {
        if (confirm("Reset all Creator data and return to onboarding?")) {
          localStorage.clear();
          window.location.href = "index.html";
        }
      }

      dropdown.classList.add("hidden");
    });
  });

  // === Modal Logic ===
  const modals = document.querySelectorAll(".creator-modal");
  const cards = document.querySelectorAll(".creator-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const modalId = card.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove("hidden");
    });
  });

  // Close modals on X click or background click
  modals.forEach(modal => {
    const close = modal.querySelector(".close");
    close?.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  });

  // === Switch Account Button ===
  const switchBtn = document.getElementById("switchAccountBtn");
  switchBtn?.addEventListener("click", () => {
    if (confirm("Switch back to your homeschool or learner account?")) {
      localStorage.removeItem("userType");
      window.location.href = "index.html";
    }
  });
});
