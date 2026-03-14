//check session 
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
    // set interval to auto-update every 5 minutes
    setInterval(updateLastSeen, 5 * 60 * 1000);

  } catch (err) {
    console.error("Error checking session:", err);
  }
}


// background music
const bgm = document.getElementById("bgm");
document.addEventListener("click", () => {

  bgm.muted = false;
  bgm.loop = true;   
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


////
function addMessage(msg){

const el = document.createElement("div");
el.className = "message";

el.innerHTML = `
<img class="avatar" src="${msg.pfpUrl}">

<div class="message-content">

<div class="username">${msg.username}</div>

<div class="bubble">${msg.content}</div>

</div>
`;

document.getElementById("messages").appendChild(el);

}


const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (event)=>{
  const data = JSON.parse(event.data);

  if(data.type === "message"){
    addMessage(data.message);
  }

  if(data.type === "recentMessages"){
    data.messages.forEach(addMessage);
  }
};
sendBtn.onclick = ()=>{

const text = messageInput.value;

ws.send(JSON.stringify({
  type:"newMessage",
  content:text
}));

messageInput.value="";
};
