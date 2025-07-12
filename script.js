/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Display welcome message
chatWindow.innerHTML = "";
const welcomeMsg = document.createElement("div");
welcomeMsg.className = "msg ai";
welcomeMsg.textContent = "👋 Hello! How can I help you today?";
chatWindow.appendChild(welcomeMsg);

// L’Oréal-specific system prompt
const systemPrompt = {
  role: "system",
  content: "You are a helpful assistant for L’Oréal. Only answer questions related to L’Oréal products, beauty routines, and recommendations. Politely refuse unrelated topics."
};

// Replace this with your actual deployed Cloudflare Worker URL
const WORKER_ENDPOINT = "https://your-cloudflare-worker-url.workers.dev";

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const input = userInput.value.trim();
  if (!input) return;

  // Display user message
  const userMsg = document.createElement("div");
  userMsg.className = "msg user";
  userMsg.textContent = input;
  chatWindow.appendChild(userMsg);
  userInput.value = "";

  // Prepare message list
  const messages = [systemPrompt, { role: "user", content: input }];

  try {
    const response = await fetch(WORKER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content?.trim() || "⚠️ No response received.";
    const aiMsg = document.createElement("div");
    aiMsg.className = "msg ai";
    aiMsg.textContent = reply;
    chatWindow.appendChild(aiMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (err) {
    console.error("API Error:", err);
    const errorMsg = document.createElement("div");
    errorMsg.className = "msg ai";
    errorMsg.textContent = "⚠️ There was an error contacting the assistant.";
    chatWindow.appendChild(errorMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});