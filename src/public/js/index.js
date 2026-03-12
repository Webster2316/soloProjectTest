async function checkSession() {
  try {
    const res = await fetch("/api/session", {
      method: "GET",
      credentials: "include"
    });

    if (res.status === 401) {
      window.location.replace("/createUser.html");
      return;
    }

    if (!res.ok) {
      console.error("Session check failed:", res.status);
      return;
    }

    const data = await res.json();
    const user = data.user;

    // update username display
    const usernameDisplay = document.getElementById("usernameDisplay");
    if (usernameDisplay) {
      usernameDisplay.textContent = user.username;
    }

    // first update of lastSeenAt
    updateLastSeen();
    // after getting user from /api/session
const resGrant = await fetch("/api/users/grantDaily", { method: "POST", credentials: "include" });
const dataGrant = await resGrant.json();
console.log("Daily transmissions:", dataGrant.transmissions);

    // set interval to auto-update every 5 minutes
    setInterval(updateLastSeen, 5 * 60 * 1000); // 5 min in ms

  } catch (err) {
    console.error("Error checking session:", err);
  }
}

checkSession();

// --------------------
// function to update lastSeenAt
async function updateLastSeen() {
  try {
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastSeenAt: new Date() })
    });

    if (!res.ok) {
      console.error("Failed to update lastSeenAt:", res.status);
      return;
    }

    const data = await res.json();
    console.log("Last seen updated:", data.user.lastSeenAt);
  } catch (err) {
    console.error("Error updating lastSeenAt:", err);
  }
}

// background music
const bgm = document.getElementById("bgm");
document.addEventListener("click", () => {

  bgm.muted = false;
  bgm.loop = true;     // keep looping
  bgm.volume = 0;

  bgm.play().catch(e => console.log("Playback blocked:", e));

  let fade = setInterval(() => {
    if (bgm.volume < 0.5) {
      bgm.volume += 0.0001;
    } else {
      clearInterval(fade);
    }
  }, 100);

}, { once: true });