async function checkSession() {
  try {
    const res = await fetch("/api/session", {
      method: "GET",
      credentials: "include"
    });

    // no session → go to create user page
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


  } catch (err) {
    console.error("Error checking session:", err);
  }
}

checkSession();
async function fetchUserInfo() {
  try {
    const res = await fetch("/api/users/me", {
      method: "GET",
      credentials: "include"
    });

    if (res.status === 401) {
      window.location.replace("/createUser.html");
      return;
    }

    if (!res.ok) {
      console.error("Failed to get user info:", res.status);
      return;
    }

    const data = await res.json();
    const user = data.user;

    // update UI
    
  const usernameDisplay = document.querySelector(".usernameDisplay");
    const tokensDisplay = document.querySelector(".tokens");
    const transmissionsDisplay = document.querySelector(".transmissions");

    if (usernameDisplay) usernameDisplay.textContent = user.username;
    if (tokensDisplay) tokensDisplay.textContent = `🪙 ${user.tokens}`;
    if (transmissionsDisplay) transmissionsDisplay.textContent = `📡 ${user.transmissions}`;

  } catch (err) {
    console.error("Error fetching user info:", err);
  }
}

fetchUserInfo();

function updateTime() {
  const timeDisplay = document.querySelector(".time");
  if (!timeDisplay) return;

  const now = new Date();
  // format as HH:MM
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  timeDisplay.textContent = `${hours}:${minutes}`;
}

// run immediately and then every minute
updateTime();
setInterval(updateTime, 1000);


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