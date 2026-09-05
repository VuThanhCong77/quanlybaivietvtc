(function () {
    "use strict";

    function getElements() {
        return {
            button: document.getElementById("nutMenu"),
            closeButton: document.getElementById("nutDong"),
            drawer: document.getElementById("menuDrawer"),
            overlay: document.getElementById("menuOverlay")
        };
    }


    function setMenuState(isOpen) {
        const elements = getElements();

        if (!elements.drawer || !elements.overlay) {
            console.error(
                "Không tìm thấy menuDrawer hoặc menuOverlay."
            );
            return;
        }

        elements.drawer.classList.toggle("active", isOpen);
        elements.overlay.classList.toggle("active", isOpen);

        elements.drawer.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );

        elements.overlay.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        if (elements.button) {
            elements.button.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }
    }


    window.toggleMenu = function () {
        const elements = getElements();

        if (!elements.drawer) {
            return;
        }

        const isOpen =
            elements.drawer.classList.contains("active");

        setMenuState(!isOpen);
    };


    window.closeMenu = function () {
        setMenuState(false);
    };


    /*
     * Dùng bắt sự kiện trên document để hoạt động
     * kể cả khi menu.html được chèn bằng fetch().
     */
    document.addEventListener("click", function (event) {

        const target = event.target;

        if (target.closest("#nutMenu")) {
            window.toggleMenu();
            return;
        }

        if (target.closest("#nutDong")) {
            window.closeMenu();
            return;
        }

        if (target.closest("#menuOverlay")) {
            window.closeMenu();
            return;
        }

        if (
            target.closest(".drawer-body a") &&
            window.innerWidth <= 1000
        ) {
            window.closeMenu();
        }
    });


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            window.closeMenu();
        }
    });

})();

async function loadLatestNews() {
    const container = document.getElementById("latest-news");

    try {
        const response = await fetch(
            "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
        );

        const data = await response.json();

        // Nếu dữ liệu nằm trong data.posts thì lấy data.posts
        const posts = Array.isArray(data)
            ? data
            : (data.posts || []);

        // Lọc các bài thuộc chuyên mục "Tin tức"
        const newsPosts = posts.filter(post =>
            Array.isArray(post.category) &&
            post.category.some(category =>
                category.toLowerCase() === "tin tức"
            )
        );

        // Chuyển ngày DD-MM-YYYY thành đối tượng Date
        function parseDate(dateString) {
            const [day, month, year] = dateString.split("-");

            return new Date(
                `${year}-${month}-${day}`
            );
        }

        // Sắp xếp từ mới đến cũ
        newsPosts.sort((a, b) =>
            parseDate(b.date) - parseDate(a.date)
        );

        // Lấy 5 tin mới nhất
        const latestNews = newsPosts.slice(0, 5);

        // Hiển thị
        if (latestNews.length === 0) {
            container.innerHTML = "<p>Chưa có tin tức.</p>";
            return;
        }

const latestBox =
    document.getElementById("latest-news-box");

latestBox.innerHTML = latestNews
    .map(post => `
        <a href="${post.url}" class="news-title">
            ${post.title}
        </a>
    `)
    .join("");

    } catch (error) {

        console.error("Lỗi tải tin tức:", error);

        container.innerHTML =
            "<p>Không thể tải tin tức.</p>";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    loadLatestNews
);

let danhSachGoc = [];

async function taiBaiViet(){

    try{

        const [resPost, resView] = await Promise.all([

            fetch(
                "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
            ),

            fetch(
                `${VIEW_API}?mode=list`
            )

        ]);

        const data =
            await resPost.json();

        const thongKe =
            await resView.json();

        const viewMap = {};

        thongKe.forEach(item => {

            viewMap[item.postId] =
                Number(item.views || 0);

        });

        danhSachGoc = data.map(bv => ({

            ...bv,

            views:
                viewMap[bv.id] || 0

        }));

        hienThiNoiBat();

    }

    catch(err){

        console.log(
            "LOI JSON:",
            err
        );

    }

}

function hienThiNoiBat(){

    const baiNoiBat = danhSachGoc

        .sort(
            (a, b) =>
            b.views - a.views
        )

        .slice(0, 6);

    const box =
        document.getElementById(
            "noiBatList"
        );

    if(!box) return;

    box.innerHTML = baiNoiBat.map(bv => `

        <div class="bai-viet-item">

            <img
            src="${bv.image}"
            alt="${bv.title}">

            <div class="bai-viet-noi-dung">

                <div class="bai-viet-tieu-de">
                    ${bv.title}
                </div>

                <div class="bai-viet-mo-ta">
                    ${bv.desc}
                </div>

                <div class="bai-viet-ngay">
                    👁️ ${bv.views.toLocaleString("vi-VN")} lượt xem
                </div>

                <a
                class="bai-viet-xem-them"
                href="${bv.url}">
                    Xem chi tiết →
                </a>

            </div>

        </div>

    `).join("");

}

taiBaiViet();

async function taiBaiVietMoiNhat() {

    try {

        const response =
        await fetch(
        "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
        );

        const danhSach =
        await response.json();

        const baiVietMoiNhat =
        [...danhSach]

        .sort((a, b) => {

            const ngayA =
            new Date(
                a.date.split("-")
                .reverse()
                .join("-")
            );

            const ngayB =
            new Date(
                b.date.split("-")
                .reverse()
                .join("-")
            );

            return ngayB - ngayA;

        })

        .slice(0, 8);

const container = document.getElementById("bai-viet-moi-nhat");

if (!container) return;        

 container.innerHTML =
baiVietMoiNhat.map(baiViet => `
<a href="${baiViet.url}" class="card-bai-viet">

    <img
        src="${baiViet.image}"
        alt="${baiViet.title}"
        loading="lazy">

    <div class="noi-dung-card">
        <h3>${baiViet.title}</h3>
    </div>

</a>
`).join("");

}

    catch(error){

        console.error(
        "Lỗi tải bài viết:",
        error
        );

    }

}

document.addEventListener("DOMContentLoaded", async function () {

    const res = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/chuyen-mon.json");
    const data = await res.json();

    // Lọc theo Kiểm tra
    const danhSach = data.filter(item =>
        item.category && item.category.includes("Văn phòng")
    );

    if (danhSach.length === 0) return;

    const box = document.querySelector(".o-chuyen-muc.suc-khoe");

    // BÀI NỔI BẬT
    const top = danhSach[0];

    const linkTop = box.querySelector(".bai-noi-bat");
    const imgTop = box.querySelector("img");
    const titleTop = box.querySelector(".overlay h3");

    linkTop.href = top.url;
    imgTop.src = top.image;
    imgTop.alt = top.title;
    titleTop.textContent = top.title;

    // DANH SÁCH BÊN DƯỚI (chỉ title + url)
    const ul = box.querySelector(".ds-van-phong");
    ul.innerHTML = "";

    danhSach.slice(1).forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${item.url}">${item.title}</a>`;
        ul.appendChild(li);
    });

});

document.addEventListener("DOMContentLoaded", async function () {

    const res = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/chuyen-mon.json");
    const data = await res.json();

    // Lọc theo Kiểm tra
    const danhSach = data.filter(item =>
        item.category && item.category.includes("Xây dựng đảng")
    );

    if (danhSach.length === 0) return;

    const box = document.querySelector(".o-chuyen-muc.tri-tue");

    // BÀI NỔI BẬT
    const top = danhSach[0];

    const linkTop = box.querySelector(".bai-noi-bat");
    const imgTop = box.querySelector("img");
    const titleTop = box.querySelector(".overlay h3");

    linkTop.href = top.url;
    imgTop.src = top.image;
    imgTop.alt = top.title;
    titleTop.textContent = top.title;

    // DANH SÁCH BÊN DƯỚI (chỉ title + url)
    const ul = box.querySelector(".ds-xay-dung-dang");
    ul.innerHTML = "";

    danhSach.slice(1).forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${item.url}">${item.title}</a>`;
        ul.appendChild(li);
    });

});

document.addEventListener("DOMContentLoaded", async function () {

    const res = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/chuyen-mon.json");
    const data = await res.json();

    // Lọc theo Kiểm tra
    const danhSach = data.filter(item =>
        item.category && item.category.includes("Kiểm tra")
    );

    if (danhSach.length === 0) return;

    const box = document.querySelector(".o-chuyen-muc.hanh-phuc");

    // BÀI NỔI BẬT
    const top = danhSach[0];

    const linkTop = box.querySelector(".bai-noi-bat");
    const imgTop = box.querySelector("img");
    const titleTop = box.querySelector(".overlay h3");

    linkTop.href = top.url;
    imgTop.src = top.image;
    imgTop.alt = top.title;
    titleTop.textContent = top.title;

    // DANH SÁCH BÊN DƯỚI (chỉ title + url)
    const ul = box.querySelector(".ds-kiem-tra");
    ul.innerHTML = "";

    danhSach.slice(1).forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${item.url}">${item.title}</a>`;
        ul.appendChild(li);
    });

});

document.addEventListener("DOMContentLoaded", async function () {

    const res = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/chuyen-mon.json");
    const data = await res.json();

    // Lọc theo Kiểm tra
    const danhSach = data.filter(item =>
        item.category && item.category.includes("Chi bộ")
    );

    if (danhSach.length === 0) return;

    const box = document.querySelector(".o-chuyen-muc.tin-anh");

    // BÀI NỔI BẬT
    const top = danhSach[0];

    const linkTop = box.querySelector(".bai-noi-bat");
    const imgTop = box.querySelector("img");
    const titleTop = box.querySelector(".overlay h3");

    linkTop.href = top.url;
    imgTop.src = top.image;
    imgTop.alt = top.title;
    titleTop.textContent = top.title;

    // DANH SÁCH BÊN DƯỚI (chỉ title + url)
    const ul = box.querySelector(".ds-chi-bo");
    ul.innerHTML = "";

    danhSach.slice(1).forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${item.url}">${item.title}</a>`;
        ul.appendChild(li);
    });

});

/* =========================================================
THÍCH BÀI VIẾT / TRANG
========================================================= */

const LIKE_API =
"https://script.google.com/macros/s/AKfycbxjfwu2JFjKwji5SPaPk8ZPxkL5p3kuzdEWyUazHr9DDBTpT3rbqpTs4ddUcbiYwB_2/exec";

const likeBtn =
document.getElementById(
"likeBtn"
);

const likeCount =
document.getElementById(
"likeCount"
);

/* =========================================================
LẤY ID TRANG
========================================================= */

const pageId =

document.body.dataset.postId

||

"index";

/* =========================================================
TẢI SỐ LƯỢT THÍCH
========================================================= */

function loadLike(){

    if(!likeCount) return;

    fetch(

    LIKE_API +

    "?action=get&page=" +

    encodeURIComponent(
    pageId
    )

    )

    .then(
    response =>
    response.text()
    )

    .then(data => {

        likeCount.textContent =
        data;

    })

    .catch(error => {

        console.error(
        "Loi tai like:",
        error
        );

    });

}

/* =========================================================
THÍCH
========================================================= */

function xuLyLike(){

    const key =

    "liked_" + pageId;

    if(

        localStorage.getItem(
        key
        )

    ){

        alert(
        "Bạn đã đồng tình trước đó."
        );

        return;

    }

    fetch(

    LIKE_API +

    "?action=like&page=" +

    encodeURIComponent(
    pageId
    )

    )

    .then(
    response =>
    response.text()
    )

    .then(data => {

        likeCount.textContent =
        data;

        localStorage.setItem(
        key,
        "true"
        );

    })

    .catch(error => {

        console.error(
        "Loi gui like:",
        error
        );

    });

}

/* =========================================================
KHỞI TẠO
========================================================= */

document.addEventListener(

"DOMContentLoaded",

() => {

    loadLike();

    if(likeBtn){

        likeBtn
        .addEventListener(
        "click",
        xuLyLike
        );

    }

}

);

/* =========================================================
GỬI GÓP Ý
========================================================= */

const FEEDBACK_API =
"https://script.google.com/macros/s/AKfycbzb_ovIs2kZto3vuHVPATt1Iq0Uvb0GiQo3hvCm_FAcjRgfaTPyjTG0Qir4ECEkyOE8-g/exec";

async function sendFeedback(){

    const noiDung =

    document
    .getElementById(
    "fb-content"
    )
    ?.value
    .trim();

    if(!noiDung){

        alert(
        "Vui lòng nhập nội dung góp ý!"
        );

        return;

    }

    const duLieu = {

        page:
        document.title,

        ten:

        document
        .getElementById(
        "fb-name"
        )
        ?.value
        .trim()

        ||

        "Ẩn danh",

        noiDung:
        noiDung,

        thoiGian:

        new Date()
        .toLocaleString(
        "vi-VN"
        ),

        url:
        window.location.href

    };

    try{

        await fetch(

        FEEDBACK_API,

        {

            method:"POST",

            mode:"no-cors",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(
            duLieu
            )

        }

        );

        const thongBao =

        document
        .getElementById(
        "fb-message"
        );

        if(thongBao){

            thongBao.innerHTML =

            "✅ Đã gửi góp ý thành công!";

        }

        document
        .getElementById(
        "fb-content"
        )
        .value = "";

    }

    catch(error){

        console.error(
        error
        );

        alert(
        "Có lỗi xảy ra khi gửi góp ý!"
        );

    }

}

document.addEventListener("DOMContentLoaded", () => {

    const page = document.body.dataset.page;

    if (page === "home") {
        taiBaiVietMoiNhat();
    }

    if (page === "chuyen-muc") {
        taiTatCaBaiViet();
    }

    if (page === "chi-tiet") {
        taiBaiVietLienQuan();
    }

});

async function taiMenu(){

    const response = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/thanh-phan/menu.html");
    const html = await response.text();

    const el = document.getElementById("menu");

    if (!el) return;

    el.innerHTML = html;
}

/* =====================================
   ONLINE.JS
===================================== */

const ONLINE_API =
"https://script.google.com/macros/s/AKfycbwX1QX8GHhhpj5rPaescYalPprrAq5XioNiCy77oSWmNrvwQHe2QemRHj148xFvJzSo/exec";

/* visitor id */

let visitorId =
localStorage.getItem(
  "visitorId"
);

if(!visitorId){

  visitorId =
  crypto.randomUUID();

  localStorage.setItem(
    "visitorId",
    visitorId
  );

}

/* nhận dữ liệu */

function hienThiThongKe(data){

  const online =
  document.getElementById("online");

  const totalViews =
  document.getElementById("totalViews");

  const todayViews =
  document.getElementById("todayViews");

  const weekViews =
  document.getElementById("weekViews");

  const topPage =
  document.getElementById("topPage");

  if(online)
    online.textContent =
    data.online;

  if(totalViews)
    totalViews.textContent =
    data.totalViews;

  if(todayViews)
    todayViews.textContent =
    data.todayViews;

  if(weekViews)
    weekViews.textContent =
    data.weekViews;

  if(topPage)
    topPage.textContent =
    data.topPage;

}

/* gọi JSONP */

function capNhatThongKe(){

  const oldScript =
  document.getElementById(
    "online-script"
  );

  if(oldScript){

    oldScript.remove();

  }

  const script =
  document.createElement(
    "script"
  );

  script.id =
  "online-script";

  script.src =

    ONLINE_API +

    "?page=index&id=" +

    visitorId +

    "&callback=hienThiThongKe&_=" +

    Date.now();

  document.body
  .appendChild(script);

}

document.addEventListener(
  "DOMContentLoaded",
  ()=>{

    capNhatThongKe();

    setInterval(
      capNhatThongKe,
      60000
    );

  }
);

function khoiTaoCanBo() {

    const dsNguoi = document.querySelectorAll('.nguoi');

    dsNguoi.forEach(item => {

        item.addEventListener('click', () => {

            dsNguoi.forEach(x =>
                x.classList.remove('active')
            );

            item.classList.add('active');

            document.getElementById('anhHienThi').src =
                item.dataset.anh;

            document.getElementById('tenHienThi').textContent =
                item.dataset.ten;

            document.getElementById('ghiChuHienThi').textContent =
                item.dataset.ghichu;
        });

    });

}

let heroIndex = 0;
let heroTimer;

async function taiBannerMoiNhat() {

    try {

        const response = await fetch(
            "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
        );

        const danhSach = await response.json();

        const baiMoi = [...danhSach]

        .sort((a,b)=>{

            const ngayA = new Date(a.date.split("-").reverse().join("-"));
            const ngayB = new Date(b.date.split("-").reverse().join("-"));

            return ngayB-ngayA;

        })

        .slice(0,5);

        const slides = document.getElementById("hero-slides");

        slides.innerHTML = baiMoi.map(bai=>`

            <a class="hero-slide"
               href="${bai.url}">

                <img
                    src="${bai.image}"
                    alt="${bai.title}">

                <div class="hero-caption">

                    <h2>${bai.title}</h2>

                </div>

            </a>

        `).join("");

        const allSlides = document.querySelectorAll(".hero-slide");

        function hienSlide(i){

            allSlides.forEach(s=>s.classList.remove("active"));

            allSlides[i].classList.add("active");

        }

        hienSlide(0);

        heroTimer = setInterval(()=>{

            heroIndex++;

            if(heroIndex>=allSlides.length){

                heroIndex=0;

            }

            hienSlide(heroIndex);

        },5000);

        document.getElementById("hero-next").onclick=()=>{

            heroIndex++;

            if(heroIndex>=allSlides.length){

                heroIndex=0;

            }

            hienSlide(heroIndex);

        };

        document.getElementById("hero-prev").onclick=()=>{

            heroIndex--;

            if(heroIndex<0){

                heroIndex=allSlides.length-1;

            }

            hienSlide(heroIndex);

        };

    }

    catch(error){

        console.error(error);

    }

}

taiBannerMoiNhat();

