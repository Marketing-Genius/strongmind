document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("hamburgerDropdown");

  // Toggle hamburger menu
  hamburger.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  // Modal handling
  const cards = document.querySelectorAll(".creator-card");
  const modals = document.querySelectorAll(".creator-modal");
  const closes = document.querySelectorAll(".close");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const modalId = card.dataset.modal;
      document.getElementById(modalId).classList.remove("hidden");
    });
  });

  closes.forEach(close => {
    close.addEventListener("click", () => {
      close.closest(".creator-modal").classList.add("hidden");
    });
  });

  // Close modal when clicking outside
  modals.forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  });
});
