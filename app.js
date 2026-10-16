(() => {
  "use strict";

  const localHost = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  const preview = localHost && new URLSearchParams(window.location.search).get("preview") === "1";

  const downloadFeedback = document.getElementById("download-feedback");
  const downloadMessage = document.getElementById("download-message");
  const platformNames = {
    windows: "Windows 版",
    macos_arm64: "Mac 芯片版",
    macos_x86_64: "Mac Intel 版"
  };
  document.querySelectorAll("a[data-download]").forEach((link) => {
    link.addEventListener("click", () => {
      if (!downloadFeedback || !downloadMessage) return;
      const platform = link.closest("[data-platform]")?.dataset.platform;
      const filename = new URL(link.href).pathname.split("/").pop();
      downloadMessage.textContent = `已请求 ${platformNames[platform] || "软件"} 下载：${filename}。请查看浏览器下载列表；若未开始，可打开版本下载页重试。`;
      downloadFeedback.hidden = false;
      // Keep the native link action: the browser handles the file in a new tab.
    });
  });

  const tutorialPlay = document.getElementById("tutorial-play");
  const tutorialVideo = document.getElementById("tutorial-video");
  const tutorialNote = document.getElementById("tutorial-playback-note");
  if (tutorialPlay && tutorialVideo) {
    tutorialPlay.addEventListener("click", () => {
      // Attach the media only after a visitor chooses to play it.
      if (!tutorialVideo.getAttribute("src")) {
        tutorialVideo.src = tutorialVideo.dataset.src;
      }
      tutorialPlay.hidden = true;
      tutorialVideo.hidden = false;
      tutorialVideo.focus();
      tutorialVideo.play().catch(() => {
        // Native controls remain available when the browser delays playback.
      });
    });
    tutorialVideo.addEventListener("error", () => {
      if (tutorialNote) tutorialNote.hidden = false;
    });
  }

  if (preview) {
    const banner = document.getElementById("preview-banner");
    if (banner) banner.hidden = false;
    document.querySelectorAll("a[href]").forEach((link) => {
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname.endsWith(".html")) {
        url.searchParams.set("preview", "1");
        link.href = url.href;
      }
    });
  }

  // Local static metadata only. Missing metadata leaves the HTML defaults intact.
  fetch("releases.json", { credentials: "omit", cache: "no-cache" })
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
