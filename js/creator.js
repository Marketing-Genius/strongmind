document.addEventListener("DOMContentLoaded", () => {
  console.log("🎨 StrongMind Creator Dashboard loaded");

  /* === Hamburger Menu === */
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

  dropdown.querySelectorAll("div").forEach(item => {
    item.addEventListener("click", () => {
      const text = item.textContent.trim();

      if (text === "Creator Profile") {
        document.getElementById("creatorProfileModal")?.classList.remove("hidden");
      }
      if (text === "Settings") alert("⚙️ Settings coming soon!");
      if (text === "My Courses") alert("📚 Course management tools coming soon!");
      if (text === "Earnings Dashboard") alert("💰 Earnings dashboard coming soon!");

      if (text === "Reset Demo") {
        if (confirm("Reset all Creator data and return to onboarding?")) {
          localStorage.clear();
          window.location.href = "index.html";
        }
      }
      dropdown.classList.add("hidden");
    });
  });

  /* === Switch Account === */
  const switchBtn = document.getElementById("switchAccountBtn");
  switchBtn?.addEventListener("click", () => {
    if (confirm("Switch back to your homeschool or learner account?")) {
      localStorage.removeItem("userType");
      window.location.href = "index.html";
    }
  });

  /* === Dashboard Card Modals === */
  const modals = document.querySelectorAll(".creator-modal");
  const cards = document.querySelectorAll(".creator-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const modalId = card.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove("hidden");
    });
  });

  modals.forEach(modal => {
    const close = modal.querySelector(".close");
    close?.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
    });
  });

  /* === Creator Profile Modal === */
  const profileModal = document.getElementById("creatorProfileModal");
  const closeBtn = profileModal.querySelector(".close");
  const saveBtn = document.getElementById("saveCreatorProfile");
  const uploadBtn = document.getElementById("uploadCreatorPhoto");
  const photoInput = document.getElementById("creatorPhotoInput");
  const learnMoreHover = document.getElementById("learnMoreHover");
  const learnMorePopup = document.getElementById("learnMorePopup");
  const uploadCredentials = document.getElementById("uploadCredentials");
  const typeSelect = document.getElementById("creatorType");

  // === Show modal automatically on first visit ===
  const firstVisit = !localStorage.getItem("creatorProfileSet");
  console.log("First Visit?", firstVisit);
  if (firstVisit) {
    setTimeout(() => profileModal.classList.remove("hidden"), 400);
  } else {
    loadCreatorProfile();
  }

  // === Close modal ===
  closeBtn.addEventListener("click", () => {
    profileModal.classList.add("hidden");
  });

  // === Save profile ===
  saveBtn.addEventListener("click", () => {
    const data = {
      first: document.getElementById("creatorFirstName").value.trim(),
      last: document.getElementById("creatorLastName").value.trim(),
      username: document.getElementById("creatorUsername").value.trim(),
      email: document.getElementById("creatorEmail").value.trim(),
      phone: document.getElementById("creatorPhone").value.trim(),
      type: document.getElementById("creatorType").value,
      bio: document.getElementById("creatorBio").value.trim(),
      photo: document.getElementById("creatorProfileImage").src
    };

    localStorage.setItem("creatorProfile", JSON.stringify(data));
    localStorage.setItem("creatorProfileSet", "true");

    saveBtn.textContent = "✓ Saved!";
    saveBtn.style.background = "#4caf50";
    saveBtn.style.color = "white";
    setTimeout(() => profileModal.classList.add("hidden"), 800);
  });

  function loadCreatorProfile() {
    const stored = JSON.parse(localStorage.getItem("creatorProfile")) || {};
    if (!stored) return;

    document.getElementById("creatorFirstName").value = stored.first || "";
    document.getElementById("creatorLastName").value = stored.last || "";
    document.getElementById("creatorUsername").value = stored.username || "";
    document.getElementById("creatorEmail").value = stored.email || "";
    document.getElementById("creatorPhone").value = stored.phone || "";
    document.getElementById("creatorType").value = stored.type || "";
    document.getElementById("creatorBio").value = stored.bio || "";
    document.getElementById("creatorProfileImage").src = stored.photo || "assets/default-profile.png";
  }

  // === Upload photo ===
  uploadBtn.addEventListener("click", () => photoInput.click());
  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById("creatorProfileImage").src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // === Enable upload credentials ===
  typeSelect.addEventListener("change", () => {
    if (["Certified Teacher", "Professor"].includes(typeSelect.value)) {
      uploadCredentials.disabled = false;
      uploadCredentials.classList.remove("disabled");
    } else {
      uploadCredentials.disabled = true;
      uploadCredentials.classList.add("disabled");
    }
  });

  // === Learn more hover ===
  learnMoreHover.addEventListener("mouseenter", () => learnMorePopup.classList.remove("hidden"));
  learnMoreHover.addEventListener("mouseleave", () => learnMorePopup.classList.add("hidden"));
});
