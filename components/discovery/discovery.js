(function () {
  function initDiscovery() {
    const mount = document.getElementById("discoveryMount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="discovery-wrapper">
        <div class="section-divider"><span>Discovery</span></div>

        <div class="discovery-content">
          <div class="recommended-label">RECOMMENDED FOR YOU</div>
          <div class="discovery-placeholder">
            Discovery content will appear here.
          </div>
        </div>
      </div>
    `;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDiscovery);
  } else {
    initDiscovery();
  }
})();
