const API_KEY = "YOUR_API_KEY_HERE";

async function askAI(textInput = null) {

  const text =
    textInput ||
    document.getElementById("userInput").value;

  if (!text) return;

  document.getElementById("output").innerText =
    "You: " + text;

  try {

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: text }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "HTTP error! Status: " + response.status
      );
    }

    const data = await response.json();

    console.log("FULL RESPONSE:", data);

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    document.getElementById("output").innerText +=
      "\nAI: " + reply;

  } catch (error) {

    console.error("Fetch Error:", error);
    alert("Fetch failed — check internet / endpoint");

  }
}


/* ---------- VOICE INPUT ---------- */

function startListening() {

  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice input not supported.");
    return;
  }

  const recognition = new webkitSpeechRecognition();

  recognition.lang = "en-US";

  alert("Listening... Speak now");

  recognition.start();

  recognition.onresult = function(event) {

    const text = event.results[0][0].transcript;

    document.getElementById("userInput").value = text;

    askAI(text);
  };
}

/* ---------- VOICE OUTPUT ---------- */

function speak(text) {

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";

  speechSynthesis.speak(speech);
}
