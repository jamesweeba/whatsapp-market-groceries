
const chat = document.getElementById("chat");
const form = document.getElementById("chatForm");
const input = document.getElementById("message");

const sessionId =
    localStorage.getItem("session_id") ||
    (localStorage.setItem("session_id", crypto.randomUUID()),
        localStorage.getItem("session_id"));

// function addMessage(text, sender) {
//     const div = document.createElement("div");
//     div.classList.add("message", sender);
//     div.innerText = text;
//     chat.appendChild(div);
//     chat.scrollTop = chat.scrollHeight;
// }

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender);

    const messageText = document.createElement("div");
    messageText.classList.add("message-text");
    messageText.innerText = text;

    const time = document.createElement("div");
    time.classList.add("timestamp");
    time.innerText = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    div.appendChild(messageText);
    div.appendChild(time);
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    // Typing indicator
    const typing = document.createElement("div");
    typing.classList.add("message", "bot");
    // typing.innerText = "Typing...";
    typing.innerHTML = `
    <span class="typing">
        <span></span>
        <span></span>
        <span></span>
    </span>
`;
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;

    try {
        const res = await fetch("https://pagepage.app.n8n.cloud/webhook/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: text,
                session_id: sessionId
            })
        });

        const data = await res.json();
        console.log(data);


        typing.remove();
        addMessage(data.output, "bot");

    } catch (err) {
        console.error(err);
        typing.remove();
        addMessage("⚠️ Network error. Try again.", "bot");
    }
});

