let posts = [];
let currentIndex = -1;
let speech = null;

/* ==========================
LOAD DANH SÁCH BÀI
========================== */

async function loadPodcastData() {

  const response =
    await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/hoi-ky.json");

  posts = await response.json();

}

function renderPodcastList() {

  const container =
    document.getElementById("podcast-list");

  if (!container) return;

  container.innerHTML = "";

  posts.forEach((post, index) => {

    container.innerHTML += `
    
    <div class="podcast-card">

      <img
        src="${post.image}"
        alt="${post.title}"
        class="podcast-thumb">

      <div class="podcast-content">

        <div class="podcast-category">
          ${post.category?.[1] || ""}
        </div>

        <h3>${post.title}</h3>

        <p>${post.desc}</p>

        <div class="podcast-actions">

          <button
            onclick="playPodcast(${index})">

            🎙 Nghe

          </button>

          <a
            href="${post.url}"
            target="_blank">

            📖 Đọc bài

          </a>

        </div>

      </div>

    </div>

    `;

  });

}

/* ==========================
CẬP NHẬT PLAYER
========================== */

function updatePlayer(post) {

  document.getElementById("podcastTitle")
    .textContent = post.title;

  document.getElementById("podcastChapter")
    .textContent =
    post.category?.[1] || "";

}

/* ==========================
ĐỌC BÀI VIẾT
========================== */

async function playPodcast(index) {

  if (!posts[index]) return;

  currentIndex = index;

  const post = posts[index];

  updatePlayer(post);

  speechSynthesis.cancel();

  const response =
    await fetch(post.url);

  const html =
    await response.text();

  const parser =
    new DOMParser();

  const doc =
    parser.parseFromString(
      html,
      "text/html"
    );

  const content =
    doc.querySelector("#readingContent");

  if (!content) {

    alert("Không tìm thấy nội dung");

    return;
  }

  content
    .querySelectorAll("figure")
    .forEach(el => el.remove());

  content
    .querySelectorAll(".sidebar-box")
    .forEach(el => el.remove());

  const text =
    content.innerText;

  speech =
    new SpeechSynthesisUtterance(text);

  speech.lang = "vi-VN";

  speech.rate = 1;

  speech.onend = () => {

    if (currentIndex < posts.length - 1) {

      playPodcast(currentIndex + 1);

    }

  };

  speechSynthesis.speak(speech);

}

/* ==========================
PHÁT TIẾP
========================== */

function resumePodcast() {

  speechSynthesis.resume();

}

/* ==========================
TẠM DỪNG
========================== */

function pausePodcast() {

  speechSynthesis.pause();

}

/* ==========================
DỪNG
========================== */

function stopPodcast() {

  speechSynthesis.cancel();

}

/* ==========================
BÀI TRƯỚC
========================== */

function prevPodcast() {

  if (currentIndex <= 0) return;

  playPodcast(currentIndex - 1);

}

/* ==========================
BÀI TIẾP
========================== */

function nextPodcast() {

  if (currentIndex >= posts.length - 1) return;

  playPodcast(currentIndex + 1);

}

/* ==========================
GẮN NÚT
========================== */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    await loadPodcastData();

console.log("Render:", posts.length);

renderPodcastList();

    document
      .getElementById("playBtn")
      .addEventListener(
        "click",
        () => {

          if (
            speechSynthesis.paused
          ) {

            resumePodcast();

          } else if (
            currentIndex === -1
          ) {

            playPodcast(0);

          }

        }
      );

    document
      .getElementById("pauseBtn")
      .addEventListener(
        "click",
        pausePodcast
      );

    document
      .getElementById("stopBtn")
      .addEventListener(
        "click",
        stopPodcast
      );

    document
      .getElementById("prevBtn")
      .addEventListener(
        "click",
        prevPodcast
      );

    document
      .getElementById("nextBtn")
      .addEventListener(
        "click",
        nextPodcast
      );

  }
);
