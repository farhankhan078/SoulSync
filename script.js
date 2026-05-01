// 1. Element Selectors
const moodSelect = document.getElementById("moodSelect");
const getSongBtn = document.getElementById("getSong");
const resultDiv = document.getElementById("result");
const songTitle = document.getElementById("songTitle");
const moodQuote = document.getElementById("moodQuote");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareMood");
const emojiContainer = document.getElementById("emojiContainer");
const playerContainer = document.getElementById("playerContainer");
const toggleMode = document.getElementById("toggleMode");
const video = document.getElementById('video');
const aiStatus = document.getElementById('ai-status');

// 2. Song Database
const moodData = {
  happy: {
    title: "Tu Hi Mera",
    link: "https://youtu.be/_u9MRjafdMo",
    embed: "https://www.youtube.com/embed/_u9MRjafdMo?rel=0",
    color: "#FFD93D",
    emoji: "😊",
    quote: "Happiness is not by chance, but by choice. 🌼"
  },
  sad: {
    title: "To fir Aao - Awarapan",
    link: "https://youtu.be/h5-Kq9k3zeo",
    embed: "https://www.youtube.com/embed/h5-Kq9k3zeo?rel=0",
    color: "#89CFF0",
    emoji: "😢",
    quote: "Even the darkest nights end with sunrise. 🌅"
  },
  chill: {
    title: "Makhna - Drive",
    link: "https://youtu.be/HqUeSjsYLNU?si=6efD5W_Ggd7u3VYE",
    embed: "https://www.youtube.com/embed/HqUeSjsYLNU?si=6efD5W_Ggd7u3VYE",
    color: "#C1F0C1",
    emoji: "😌",
    quote: "Peace is found in moments of stillness. 🍃"
  },
  energetic: {
    title: "Ufff || Bang Bang",
    link: "https://youtu.be/yvcSsQ6rxgA",
    embed: "https://www.youtube.com/embed/yvcSsQ6rxgA?rel=0",
    color: "#FF6F61",
    emoji: "⚡",
    quote: "Energy flows where attention goes. 🔥"
  },
  romantic: {
    title: "Tum Ho To - Saiyaara",
    link: "https://youtu.be/8SYPKQMW_2Q",
    embed: "https://www.youtube.com/embed/8SYPKQMW_2Q?rel=0",
    color: "#FFB6C1",
    emoji: "❤️",
    quote: "If I know what love is, it is because of you. 💞"
  }
};

// 3. AI Model Loading
async function loadAI() {
  startVideo();
  try {
    const MODEL_URL = './models'; 
    aiStatus.textContent = "Loading AI Models...";
    
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    
    aiStatus.textContent = "AI Ready! Scanning Face...";
   // startVideo();
  } catch (err) {
    console.error("AI Load Error:", err);
    aiStatus.textContent = "AI Model Error. Ensure 'models' folder is present.";
  }
}

// 4. Camera Handling
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => { video.srcObject = stream; })
    .catch(err => { 
        aiStatus.textContent = "Camera Access Denied."; 
    });
}

// 5. AI Detection Loop (Runs every 4 seconds)
video.addEventListener('play', () => {
  setInterval(async () => {
    if (typeof faceapi !== 'undefined' && faceapi.nets.tinyFaceDetector.params) {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
      
      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        const mood = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
        
        let mappedMood = "";
        if (mood === "happy") mappedMood = "happy";
        else if (mood === "sad") mappedMood = "sad";
        else if (mood === "neutral") mappedMood = "chill";
        else if (mood === "surprised" || mood === "angry") mappedMood = "energetic";

        // Auto-update UI only if user hasn't made a manual choice
        if (mappedMood && !moodSelect.value) {
          moodSelect.value = mappedMood;
          displayMood(mappedMood);
          aiStatus.textContent = `Auto-Detected: ${mappedMood.toUpperCase()}`;
        }
      }
    }
  }, 4000);
});

// 6. UI Logic: Display Mood & Play Media
function displayMood(mood) {
  const moodInfo = moodData[mood];
  if (!moodInfo) return;

  songTitle.textContent = moodInfo.title;
  moodQuote.textContent = moodInfo.quote;
  resultDiv.classList.remove("hidden");

  // Dynamic Backgrounds
  document.body.style.background = `linear-gradient(135deg, ${moodInfo.color}, #ffffff)`;

  // Floating Emoji Animations
  emojiContainer.innerHTML = "";
  for (let i = 0; i < 15; i++) {
    const emoji = document.createElement("div");
    emoji.textContent = moodInfo.emoji;
    emoji.classList.add("emoji");
    emoji.style.left = Math.random() * 100 + "vw";
    emoji.style.animationDuration =
      mood === "romantic" ? 6 + Math.random() * 3 + "s" : 3 + Math.random() * 3 + "s";
    emojiContainer.appendChild(emoji);
  }

  // YouTube Embed integration
  playerContainer.innerHTML = `
    <div class="video-wrapper">
      <iframe width="280" height="158" 
        src="${moodInfo.embed}&autoplay=1" 
        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
      </iframe>
    </div>
  `;

  // Action Handlers
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(moodInfo.link);
    showToast("🎶 Song link copied!", moodInfo.color);
  };

  shareBtn.onclick = () => {
    const text = `I'm feeling ${mood}! Listening to "${moodInfo.title}" on SoulSync 🎧`;
    navigator.clipboard.writeText(text);
    showToast("💌 Share text copied!", moodInfo.color);
  };
}

// 7. Event Listeners
getSongBtn.addEventListener("click", () => {
  const mood = moodSelect.value;
  if (!mood) {
    showToast("Please select a mood first!", "#ff6b6b");
    return;
  }
  displayMood(mood);
});

toggleMode.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleMode.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// 8. Safety check to initialize only when library is ready
window.onload = () => {
  if (typeof faceapi !== 'undefined') {
    loadAI();
  } else {
    setTimeout(loadAI, 1000);
  }
};

function showToast(message, color) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:${color}; padding:10px 20px; border-radius:20px; z-index:1000;`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
const checkLibrary = setInterval(() => {
    if (typeof faceapi !== 'undefined') {
        console.log("Library loaded! Starting AI...");
        loadAI();
        clearInterval(checkLibrary);
    } else {
        console.log("Waiting for face-api library...");
    }
}, 500);