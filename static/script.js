const API_URL = "https://truthsleuth.onrender.com/analyze";

const analyzeBtn = document.getElementById("analyzeBtn");
const input = document.getElementById("input");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const errorDiv = document.getElementById("error");

analyzeBtn.addEventListener("click", analyze);

async function analyze() {
  const text = input.value.trim();
  if (!text) {
    showError("Please enter text to analyze.");
    return;
  }

  hide(errorDiv);
  hide(result);
  show(loading);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const data = await res.json();
    hide(loading);
    renderResult(data.result);
  } catch (err) {
    hide(loading);
    showError("Could not connect to backend.");
    console.error(err);
  }
}

function renderResult(text) {
  result.querySelector("#score").textContent = "—";
  result.querySelector("#classification").textContent = "Analyzed";
  result.querySelector("#summary").textContent = text;
  show(result);
}

function showError(msg) {
  errorDiv.textContent = msg;
  show(errorDiv);
}

function show(el) {
  el.classList.remove("hidden");
}

function hide(el) {
  el.classList.add("hidden");
}
