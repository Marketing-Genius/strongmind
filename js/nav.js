
document.addEventListener('DOMContentLoaded', () => {
  updatePlanButton();
  updateSparkButtonLabel();

  const hamburger = document.getElementById('hamburger');
  const dropdown = document.getElementById('hamburgerDropdown');
  if (hamburger && dropdown) {
    hamburger.addEventListener('click', () => dropdown.classList.toggle('hidden'));
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  document.querySelectorAll(".modal .close").forEach(closeBtn => {
    closeBtn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal");
      if (modal) modal.classList.add("hidden");
    });
  });

  const planBtn = document.getElementById('plan-button');
  if (planBtn) {
    planBtn.addEventListener('click', () => {
      if (typeof openSubscriptionModal === "function") openSubscriptionModal();
    });
  }

  const sparkButton = document.querySelector('.spark-button');
  if (sparkButton) {
    sparkButton.addEventListener('click', () => {
      if (typeof openSparkModal === "function") openSparkModal();
    });
  }

  const resetBtn = document.getElementById('resetItem');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }

  const profileItem = document.getElementById('profileItem');
  if (profileItem) {
    profileItem.addEventListener('click', () => {
      window.location.href = 'profile.html';
    });
  }

  const userTypeIcon = document.getElementById('userTypeIcon');
  if (userTypeIcon) {
    const userType = localStorage.getItem('userType');
    if (userType === 'homeschool') userTypeIcon.src = 'assets/icon-homeschool.png';
    else if (userType === 'learner') userTypeIcon.src = 'assets/icon-learner.png';
    else if (userType === 'edutech') userTypeIcon.src = 'assets/icon-edutech.png';
  }
});
