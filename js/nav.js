document.addEventListener('DOMContentLoaded', () => {
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
    const userPlan = localStorage.getItem('selectedPlan') || 'Starter';
    planBtn.textContent = `Plan: ${userPlan}`;
    planBtn.classList.add(`plan-${userPlan.toLowerCase()}`);

    // Optional click logic
    planBtn.addEventListener('click', () => {
      const modal = document.getElementById('subscriptionModal');
      if (modal) {
        modal.classList.remove('hidden');
      }
    });
  }

  // === SparkTokens Button (optional) ===
  const sparkButton = document.querySelector('.spark-button');
  if (sparkButton) {
    sparkButton.addEventListener('click', () => {
      const tokenModal = document.getElementById('tokenModal');
      if (tokenModal) {
        tokenModal.classList.remove('hidden');
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

  // === Add more navigation handlers here (e.g., Settings, Wallet, etc.) ===
});
