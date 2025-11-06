document.addEventListener("DOMContentLoaded", () => {
  console.log("Creator Dashboard loaded ✅");

  // Handle menu toggle
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("hamburgerDropdown");

  hamburger?.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  // Optional: mock interactivity
  document.querySelectorAll(".action-card").forEach(card => {
    card.addEventListener("click", () => {
      alert(`"${card.textContent.trim()}" feature coming soon!`);
    });
  });
});
