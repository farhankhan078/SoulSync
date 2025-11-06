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

const moodData = {
  happy: {
    title: "Senorita, Zindagi Na Milegi Dobara",
    link: "https://youtu.be/yDv0WSgXJVg?si=OR9i5dQwzDtiYNlz",
    embed: "https://www.youtube.com/embed/yDv0WSgXJVg?autoplay=1",
    color: "#FFD93D",
    emoji: "😊",
    quote: "Happiness is not by chance, but by choice. 🌼"
  },
  sad: {
    title: " WILDFLOWER  – Billie Eilish",
    link: "https://youtu.be/wKBYEhTgoHU?si=BnqtCK06WB2WJSmZ",
    embed: "https://www.youtube.com/embed/wKBYEhTgoHU?si=d2S5S8ZP8TaNbshO",
    color: "#89CFF0",
    emoji: "😢",
    quote: "Even the darkest nights end with sunrise. 🌅"
  },
  chill: {
    title: "Sunflower – Post Malone & Swae Lee",
    link: "https://www.youtube.com/watch?v=ApXoWvfEYVU",
    embed: "https://www.youtube.com/embed/ApXoWvfEYVU?autoplay=1",
    color: "#C1F0C1",
    emoji: "😌",
    quote: "Peace is found in moments of stillness. 🍃"
  },
  energetic: {
    title: "Believer – Imagine Dragons",
    link: "https://www.youtube.com/watch?v=7wtfhZwyrcc",
    embed: "https://www.youtube.com/embed/7wtfhZwyrcc?autoplay=1",
    color: "#FF6F61",
    emoji: "⚡",
    quote: "Energy flows where attention goes. 🔥"
  },
  romantic: {
    title: "Pride and Prejudic – Lana Del Rey",
    link: "https://www.youtube.com/watch?v=dSAPGEnCc3Y",
    embed: "https://www.youtube.com/embed/dSAPGEnCc3Y?autoplay=1",
    color: "#FFB6C1",
    emoji: "❤️",
    quote: "Love isn’t about finding perfection — it’s about feeling at home in someone’s soul. 💞"
  }
};

// 🎵 Main Mood Handler
getSongBtn.addEventListener("click", () => {
  const mood = moodSelect.value;
  if (!mood) {
    showToast("Please select a mood!", "#444");
    return;
  }
  displayMood(mood);
});

// 🎨 Function: display mood
function displayMood(mood) {
  const moodInfo = moodData[mood];
  songTitle.textContent = moodInfo.title;
  moodQuote.textContent = moodInfo.quote;
  resultDiv.classList.remove("hidden");

  // Custom background logic
  if (mood === "sad") {
    document.body.style.background = "linear-gradient(135deg, #c7a7a7ff, #482a2aff)";
  } else if (mood === "romantic") {
    document.body.style.background = "linear-gradient(135deg, #ffdde1, #ee9ca7)";
  } else {
    document.body.style.background = `linear-gradient(135deg, ${moodInfo.color}, white)`;
  }

  // 💫 Floating emojis
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

  // 🎥 Video (muted)
  playerContainer.innerHTML = `
    <div class="video-wrapper" style="position: relative; display: inline-block;">
      <iframe width="280" height="158"
        src="${moodInfo.embed}&mute=1"
        title="${moodInfo.title}"
        frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy">
      </iframe>
      <button id="playSoundBtn" 
        style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 8px; padding: 6px 10px; cursor: pointer; font-size: 0.85rem;">
        ▶ Play Sound
      </button>
    </div>
  `;

  // ▶ Play Sound
  const playSoundBtn = document.getElementById("playSoundBtn");
  playSoundBtn.addEventListener("click", () => {
    playerContainer.innerHTML = `
      <iframe width="280" height="158"
        src="${moodInfo.embed}&autoplay=1"
        title="${moodInfo.title}"
        frameborder="0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    `;
  });

  // 📋 Copy Link
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(moodInfo.link);
    showToast("🎶 Song link copied!", moodInfo.color);
  };

  // 💌 Share Mood
  shareBtn.onclick = async () => {
    const shareText = `I'm feeling ${mood}! 💫 Listening to "${moodInfo.title}" on EchoMood 🎧`;
    const shareUrl = `${window.location.origin}${window.location.pathname}?mood=${mood}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "EchoMood 🎧",
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.log("Share cancelled:", err);
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      showToast("💌 Mood link copied! Share it anywhere 💫", moodInfo.color);
    }
  };
}

// 🌙 Dark mode toggle
toggleMode.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleMode.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// 🚀 Auto-load mood from URL
const urlParams = new URLSearchParams(window.location.search);
const moodFromUrl = urlParams.get("mood");
if (moodFromUrl && moodData[moodFromUrl]) {
  moodSelect.value = moodFromUrl;
  displayMood(moodFromUrl);
}

// ✨ Toast Notification with color
function showToast(message, color = "#444") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = color;
  toast.style.color = "#222";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "25px";
  toast.style.fontSize = "0.9rem";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.4s ease, bottom 0.4s ease";
  toast.style.zIndex = "9999";
  toast.style.fontWeight = "500";
  toast.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
  toast.style.backdropFilter = "blur(8px)";

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.bottom = "45px";
  }, 50);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.bottom = "25px";
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}


/* 🎶 Mood-based autoplay setup */
const moodAudio = document.getElementById("moodAudio");

// Example mood triggers (replace or integrate with your actual buttons)
const moods = {
  happy: "songs/happy.mp3",
  sad: "songs/sad.mp3",
  romantic: "songs/romantic.mp3"
};

// Example: user types mood name in chat
function playMoodMusic(message) {
  const lower = message.toLowerCase();
  let moodFile = null;

  if (lower.includes("happy")) moodFile = moods.happy;
  else if (lower.includes("sad")) moodFile = moods.sad;
  else if (lower.includes("romantic")) moodFile = moods.romantic;

  if (moodFile) {
    moodAudio.src = moodFile;
    moodAudio.play().catch(err =>
      console.log("Autoplay blocked until user interacts:", err)
    );
  }
}

// Call after each user message
function handleUserInput() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  userInput.value = "";
  playMoodMusic(text); // 🎧 triggers music when mood detected
  botReply();
}