// ================================
// Discovery Section (placeholder)
// ================================

(function () {
  function initDiscovery() {
    const container = document.getElementById("discoveryScroll");
    if (!container) return;

    // Simple placeholder content
    container.innerHTML = `
      <div class="discovery-placeholder">
        Discovery content will appear here.
      </div>
    `;
  }

  // Run immediately if DOM is ready,
  // otherwise wait (safe for async load)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDiscovery);
  } else {
    initDiscovery();
  }
})();
