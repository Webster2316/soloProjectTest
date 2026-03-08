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

// find the element
const usernameDisplay = document.getElementById("usernameDisplay");

// update the text
if (usernameDisplay) {
  usernameDisplay.textContent = user.username;
}

  } catch (err) {
    console.error("Error checking session:", err);
  }
}

checkSession();

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