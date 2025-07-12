/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Display welcome message
chatWindow.innerHTML = "👋 Hello! How can I help you today?";

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
  chatWindow.innerHTML += `<div class="msg user">${input}</div>`;
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
    chatWindow.innerHTML += `<div class="msg ai">${reply}</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (err) {
    console.error("API Error:", err);
    chatWindow.innerHTML += `<div class="msg ai">⚠️ There was an error contacting the assistant.</div>`;
  }
});