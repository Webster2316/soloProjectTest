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

    // store user globally if you want
    window.currentUser = user;

    // optional: display username somewhere
    const nameEl = document.getElementById("usernameDisplay");
    if (nameEl) nameEl.textContent = user.username;

  } catch (err) {
    console.error("Error checking session:", err);
  }
}

checkSession();