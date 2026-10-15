(() => {
  "use strict";

  const preview = new URLSearchParams(window.location.search).get("preview") === "1";
  if (preview) {
    document.getElementById("preview-banner").hidden = false;
    document.querySelectorAll("a[data-download]").forEach((link) => {
      link.setAttribute("aria-describedby", "preview-banner");
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const banner = document.getElementById("preview-banner");
        banner.textContent = "当前是本地预览，下载尚未发布。正式上线后，此入口将下载对应平台安装包。";
        banner.setAttribute("role", "status");
        banner.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    });
    document.querySelectorAll("a[href]").forEach((link) => {
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname.endsWith(".html")) {
        url.searchParams.set("preview", "1");
        link.href = url.href;
      }
    });
  }

  // Local static metadata only. Missing metadata leaves the HTML defaults intact.
  fetch("releases.json", { credentials: "omit" })
    .then((response) => {
      if (!response.ok) throw new Error("Release metadata unavailable");
      return response.json();
    })
    .then((manifest) => {
      const platforms = manifest.platforms;
      if (!platforms || typeof platforms !== "object") return;
      document.querySelectorAll("[data-platform]").forEach((card) => {
        const info = platforms[card.dataset.platform];
        if (!info || typeof info !== "object") return;
        if (typeof info.version === "string" && /^\d+\.\d+\.\d+$/.test(info.version)) {
          card.querySelector("[data-version]").textContent = info.version;
        }
        if (typeof info.size_label === "string" && /^[\d.]+ (MiB|MB)$/.test(info.size_label)) {
          card.querySelector("[data-size]").textContent = info.size_label;
        }
        if (typeof info.sha256 === "string" && /^[a-f0-9]{64}$/i.test(info.sha256)) {
          card.querySelector("[data-sha]").textContent = info.sha256.toLowerCase();
        }
        if (typeof info.url === "string") {
          try {
            const url = new URL(info.url);
            if (url.protocol === "https:" && url.hostname === "github.com" &&
                url.pathname.startsWith("/zhangyj19841123-star/paotu-studio-downloads/releases/")) {
              card.querySelector("[data-download]").href = url.href;
            }
          } catch {
            // Ignore malformed links; verified static links remain available.
          }
        }
      });
    })
    .catch(() => {});
})();
