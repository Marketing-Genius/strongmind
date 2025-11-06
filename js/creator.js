document.addEventListener("DOMContentLoaded", () => {
  console.log("🎨 StrongMind Creator Dashboard loaded");

  // === Hamburger Menu Logic ===
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("hamburgerDropdown");

  hamburger?.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== hamburger) {
      dropdown.style.display = "none";
    }
  });

  // === Modal Logic ===
  const modals = document.querySelectorAll(".creator-modal");
  const cards = document.querySelectorAll(".creator-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const modalId = card.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = "flex";
    });
  });

  // Close modals on X click or background click
  modals.forEach(modal => {
    const close = modal.querySelector(".close");
    close?.addEventListener("click", () => (modal.style.display = "none"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
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
