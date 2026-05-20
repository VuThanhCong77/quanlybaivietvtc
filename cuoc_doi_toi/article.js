function copyLink(){

navigator.clipboard.writeText(location.href);

alert("Đã copy liên kết!");

}


const paragraphs =
document.querySelectorAll(
".article-content p"
);

let currentFont = 18;

function applyFont(){

paragraphs.forEach(p=>{

p.style.fontSize =
currentFont + "px";

});

}

function increaseFont(){

if(currentFont < 30){

currentFont += 2;

applyFont();

}

}

function decreaseFont(){

if(currentFont > 14){

currentFont -= 2;

applyFont();

}

}


let utterance;
let isSpeaking = false;
let isPaused = false;

const speakBtn =
document.getElementById("speakBtn");

function toggleSpeak(){


if(isSpeaking && !isPaused){

speechSynthesis.pause();

isPaused = true;

speakBtn.innerHTML = "▶ Tiếp tục";

return;

}


if(isSpeaking && isPaused){

speechSynthesis.resume();

isPaused = false;

speakBtn.innerHTML = "⏸ Tạm dừng";

return;

}


const text =
document
.getElementById("readingContent")
.innerText;

speechSynthesis.cancel();

utterance =
new SpeechSynthesisUtterance(text);

utterance.lang = "vi-VN";

utterance.rate = 1;

utterance.onend = ()=>{

isSpeaking = false;
isPaused = false;

speakBtn.innerHTML = "▶ Đọc bài";

};

speechSynthesis.speak(utterance);

isSpeaking = true;

speakBtn.innerHTML = "⏸ Tạm dừng";

}


const topBtn =
document.getElementById(
"topBtn"
);

window.addEventListener(
"scroll",
()=>{

if(window.scrollY > 300){

topBtn.style.display =
"flex";

}else{

topBtn.style.display =
"none";

}

});

topBtn.addEventListener(
"click",
()=>{

window.scrollTo({

top:0,
behavior:"smooth"

});

});


function sendHeight(){

const height =
document.body.scrollHeight;

parent.postMessage({

iframeHeight:height

},"*");

}

window.onload = sendHeight;

window.onresize = sendHeight;


async function loadRelatedPosts(){

try{

const response =
await fetch('../data/posts.json');

const posts =
await response.json();


const currentPage =
location.pathname.split("/").pop();


const related =
posts.filter(post => {

return !post.url.includes(currentPage)

&& post.category === "Đi qua những mùa nhớ";

}).slice(0,4);

const container =
document.getElementById(
"relatedList"
);

container.innerHTML =
related.map(post => `

<div class="related-card">

<img src="../${post.image}"
alt="${post.title}">

<div class="related-content">

<h3>${post.title}</h3>

<p>${post.desc}</p>

<a href="../${post.url}">
Đọc bài →
</a>

</div>

</div>

`).join("");

}catch(error){

console.log(
"Lỗi tải bài liên quan:",
error
);

}

}


const feedbackForm =
document.getElementById(
"feedbackForm"
);

feedbackForm.addEventListener(
"submit",
function(e){

e.preventDefault();

const name =
document.getElementById(
"fbName"
).value || "Ẩn danh";

const message =
document.getElementById(
"fbMessage"
).value;

if(message.trim() === "") return;

const feedbacks =
JSON.parse(
localStorage.getItem("feedbacks")
|| "[]"
);


const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzb_ovIs2kZto3vuHVPATt1Iq0Uvb0GiQo3hvCm_FAcjRgfaTPyjTG0Qir4ECEkyOE8-g/exec";


feedbacks.push({

name:name,
message:message,
time:new Date().toLocaleString()

});

localStorage.setItem(
"feedbacks",
JSON.stringify(feedbacks)
);


fetch(GOOGLE_SCRIPT_URL,{

method:"POST",

mode:"no-cors",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

postId:
location.pathname
.split("/")
.pop(),

tieuDe:
document.querySelector("h1")
.innerText,

ten:name,

noiDung:message,

url:location.href

})

})

.then(()=>{

document.getElementById(
"fbStatus"
).innerHTML =
"✅ Đã gửi góp ý thành công!";

feedbackForm.reset();

})

.catch(()=>{

document.getElementById(
"fbStatus"
).innerHTML =
"⚠ Không gửi được lên Google Sheet";

});

}
);

loadRelatedPosts();