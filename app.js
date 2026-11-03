const clock = document.querySelector("#clock");
const backendStatus = document.querySelector("#backend-status");
const statusIndicator = document.querySelector(".status");

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date());
}

async function checkBackend() {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      throw new Error(`Health check returned HTTP ${response.status}`);
    }

    const health = await response.json();
    if (health.status !== "ok") {
      throw new Error("Backend reported an unhealthy status");
    }

    backendStatus.textContent = "Backend is healthy";
    statusIndicator.classList.remove("status--checking", "status--error");
  } catch (error) {
    console.error("Backend health check failed:", error);
    backendStatus.textContent = "Backend is unavailable";
    statusIndicator.classList.remove("status--checking");
    statusIndicator.classList.add("status--error");
  }
}

updateClock();
setInterval(updateClock, 1000);
checkBackend();
setInterval(checkBackend, 10000);
