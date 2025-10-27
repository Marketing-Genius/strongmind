function loadView(role) {
  const app = document.getElementById('app');
  if (role === 'parent') {
    app.innerHTML = `<h2>Parent Dashboard</h2><p>Manage your school, students, and subscriptions here.</p>`;
  } else if (role === 'learner') {
    app.innerHTML = `<h2>Adult Learner View</h2><p>Track your progress and explore courses.</p>`;
  } else if (role === 'edutect') {
    app.innerHTML = `<h2>Edutect Dashboard</h2><p>Create and manage your courses.</p>`;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  updateSparkButtonLabel();
});
