/* ==========================================================================
   HE THONG HOAT DONG & CAU TRUC DU LIEU CHUNG
   ========================================================================== */

const VIEW_API = "https://script.google.com/macros/s/AKfycbxi8dkZZjOCRR6IcyVYA2qP0t9ce94UCdeV-xSMrWpqk87ebV-uBfIcTQmjycV_5R4bWw/exec";
const LIKE_API = "https://script.google.com/macros/s/AKfycbxjfwu2JFjKwji5SPaPk8ZPxkL5p3kuzdEWyUazHr9DDBTpT3rbqpTs4ddUcbiYwB_2/exec";
const FEEDBACK_API = "https://script.google.com/macros/s/AKfycbzb_ovIs2kZto3vuHVPATt1Iq0Uvb0GiQo3hvCm_FAcjRgfaTPyjTG0Qir4ECEkyOE8-g/exec";
const ONLINE_API = "https://script.google.com/macros/s/AKfycbwX1QX8GHhhpj5rPaescYalPprrAq5XioNiCy77oSWmNrvwQHe2QemRHj148xFvJzSo/exec";

let danhSachGoc = [];
const pageId = document.body.dataset.postId || "index";


/* ==========================================================================
   1. KHU VUC: MENU MOBILE & DRAWER
   ========================================================================== */

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
        if (!elements.drawer || !elements.overlay) return;

        elements.drawer.classList.toggle("active", isOpen);
        elements.overlay.classList.toggle("active", isOpen);

        elements.drawer.setAttribute("aria-hidden", String(!isOpen));
        elements.overlay.setAttribute("aria-hidden", String(!isOpen));
        document.body.classList.toggle("menu-open", isOpen);

        if (elements.button) {
            elements.button.setAttribute("aria-expanded", String(isOpen));
        }
    }

    window.toggleMenu = function () {
        const elements = getElements();
        if (!elements.drawer) return;
        const isOpen = elements.drawer.classList.contains("active");
        setMenuState(!isOpen);
    };

    window.closeMenu = function () {
        setMenuState(false);
    };

    document.addEventListener("click", function (event) {
        const target = event.target;
        if (target.closest("#nutMenu")) {
            window.toggleMenu();
            return;
        }
        if (target.closest("#nutDong") || target.closest("#menuOverlay")) {
            window.closeMenu();
            return;
        }
        if (target.closest(".drawer-body a") && window.innerWidth <= 1000) {
            window.closeMenu();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") window.closeMenu();
    });
})();

async function taiMenu() {
    const el = document.getElementById("menu");
    if (!el) return;
    try {
        const response = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/thanh-phan/menu.html");
        const html = await response.text();
        el.innerHTML = html;
    } catch (err) {
        console.error("Lỗi tải menu:", err);
    }
}


/* ==========================================================================
   2. KHU VUC: SLIDER HERO BANNER
   ========================================================================== */

let heroIndex = 0;
let heroTimer;

async function taiBannerMoiNhat() {
    const slides = document.getElementById("hero-slides");
    if (!slides) return;

    try {
        const response = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json");
        const danhSach = await response.json();

        const baiMoi = [...danhSach]
            .sort((a, b) => {
                const ngayA = new Date(a.date.split("-").reverse().join("-"));
                const ngayB = new Date(b.date.split("-").reverse().join("-"));
                return ngayB - ngayA;
            })
            .slice(0, 5);

        slides.innerHTML = baiMoi.map(bai => `
            <a class="hero-slide" href="${bai.url}">
                <img src="${bai.image}" alt="${bai.title}">
                <div class="hero-caption">
                    <h2>${bai.title}</h2>
                </div>
            </a>
        `).join("");

        const allSlides = document.querySelectorAll(".hero-slide");
        if (allSlides.length === 0) return;

        function hienSlide(i) {
            allSlides.forEach(s => s.classList.remove("active"));
            allSlides[i].classList.add("active");
        }

        hienSlide(0);

        heroTimer = setInterval(() => {
            heroIndex = (heroIndex + 1) % allSlides.length;
            hienSlide(heroIndex);
        }, 5000);

        const btnNext = document.getElementById("hero-next");
        const btnPrev = document.getElementById("hero-prev");

        if (btnNext) {
            btnNext.onclick = () => {
                heroIndex = (heroIndex + 1) % allSlides.length;
                hienSlide(heroIndex);
            };
        }
        if (btnPrev) {
            btnPrev.onclick = () => {
                heroIndex = (heroIndex - 1 + allSlides.length) % allSlides.length;
                hienSlide(heroIndex);
            };
        }
    } catch (error) {
        console.error("Lỗi tải hero banner:", error);
    }
}


/* ==========================================================================
   3. KHU VUC: QUAN LY & HIEN THI BAI VIET
   ========================================================================== */

   async function taiBaiViet() {
    try {
        // Gửi 2 yêu cầu cùng lúc để tiết kiệm thời gian chờ mạng
        const [resPost, resView] = await Promise.all([
            fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"),
            fetch(`${VIEW_API}?mode=list`)
        ]);

        const data = await resPost.json();
        const thongKe = await resView.json();
        
        // Tiến hành ghép dữ liệu và hiển thị
    } catch (err) {
        console.error("Lỗi tải dữ liệu bài viết:", err);
    }
}

// 3.1. Tin tức mới nhất (Side Header)
async function loadLatestNews() {
    const container = document.getElementById("latest-news-box");
    if (!container) return;

    try {
        const response = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json");
        const data = await response.json();
        const posts = Array.isArray(data) ? data : (data.posts || []);

        const newsPosts = posts.filter(post =>
            Array.isArray(post.category) &&
            post.category.some(c => c.toLowerCase() === "tin tức")
        );

        function parseDate(dateString) {
            const [day, month, year] = dateString.split("-");
            return new Date(`${year}-${month}-${day}`);
        }

        newsPosts.sort((a, b) => parseDate(b.date) - parseDate(a.date));
        const latestNews = newsPosts.slice(0, 5);

        if (latestNews.length === 0) {
            container.innerHTML = "<p>Chưa có tin tức.</p>";
            return;
        }

        container.innerHTML = latestNews.map(post => `
            <a href="${post.url}" class="news-title">${post.title}</a>
        `).join("");
    } catch (error) {
        console.error("Lỗi tải tin tức:", error);
        container.innerHTML = "<p>Không thể tải tin tức.</p>";
    }
}

// 3.2. Bài viết mới nhất (Lưới Trang Chủ)
async function taiBaiVietMoiNhat() {
    const container = document.getElementById("bai-viet-moi-nhat");
    if (!container) return;

    try {
        const response = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json");
        const danhSach = await response.json();

        const baiVietMoiNhat = [...danhSach]
            .sort((a, b) => {
                const ngayA = new Date(a.date.split("-").reverse().join("-"));
                const ngayB = new Date(b.date.split("-").reverse().join("-"));
                return ngayB - ngayA;
            })
            .slice(0, 8);

        container.innerHTML = baiVietMoiNhat.map(baiViet => `
            <a href="${baiViet.url}" class="card-bai-viet">
                <img src="${baiViet.image}" alt="${baiViet.title}" loading="lazy">
                <div class="noi-dung-card">
                    <h3>${baiViet.title}</h3>
                </div>
            </a>
        `).join("");
    } catch (error) {
        console.error("Lỗi tải bài viết mới nhất:", error);
    }
}

// 3.3. Bài viết nổi bật (Theo lượt xem)
async function taiBaiViet() {
    try {
        const [resPost, resView] = await Promise.all([
            fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"),
            fetch(`${VIEW_API}?mode=list`)
        ]);

        const data = await resPost.json();
        const thongKe = await resView.json();
        const viewMap = {};

        thongKe.forEach(item => {
            viewMap[item.postId] = Number(item.views || 0);
        });

        danhSachGoc = data.map(bv => ({
            ...bv,
            views: viewMap[bv.id] || 0
        }));

        hienThiNoiBat();
    } catch (err) {
        console.error("Lỗi tải dữ liệu bài viết nổi bật:", err);
    }
}

function hienThiNoiBat() {
    const box = document.getElementById("noiBatList");
    if (!box) return;

    const baiNoiBat = danhSachGoc
        .sort((a, b) => b.views - a.views)
        .slice(0, 6);

    box.innerHTML = baiNoiBat.map(bv => `
        <div class="bai-viet-item">
            <img src="${bv.image}" alt="${bv.title}">
            <div class="bai-viet-noi-dung">
                <div class="bai-viet-tieu-de">${bv.title}</div>
                <div class="bai-viet-mo-ta">${bv.desc}</div>
                <div class="bai-viet-ngay">👁️ ${bv.views.toLocaleString("vi-VN")} lượt xem</div>
                <a class="bai-viet-xem-them" href="${bv.url}">Xem chi tiết →</a>
            </div>
        </div>
    `).join("");
}

// 3.4. Chuyên mục chuyên môn (Văn phòng, Xây dựng Đảng, Kiểm tra, Chi bộ)
async function taiChuyenMucChuyenMon() {
    try {
        const res = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/chuyen-mon.json");
        const data = await res.json();

        const config = [
            { cat: "Văn phòng", selector: ".o-chuyen-muc.suc-khoe", ulClass: ".ds-van-phong" },
            { cat: "Xây dựng đảng", selector: ".o-chuyen-muc.tri-tue", ulClass: ".ds-xay-dung-dang" },
            { cat: "Kiểm tra", selector: ".o-chuyen-muc.hanh-phuc", ulClass: ".ds-kiem-tra" },
            { cat: "Chi bộ", selector: ".o-chuyen-muc.tin-anh", ulClass: ".ds-chi-bo" }
        ];

        config.forEach(item => {
            const danhSach = data.filter(d => d.category && d.category.includes(item.cat));
            if (danhSach.length === 0) return;

            const box = document.querySelector(item.selector);
            if (!box) return;

            const top = danhSach[0];
            const linkTop = box.querySelector(".bai-noi-bat");
            const imgTop = box.querySelector("img");
            const titleTop = box.querySelector(".overlay h3");

            if (linkTop) linkTop.href = top.url;
            if (imgTop) {
                imgTop.src = top.image;
                imgTop.alt = top.title;
            }
            if (titleTop) titleTop.textContent = top.title;

            const ul = box.querySelector(item.ulClass);
            if (ul) {
                ul.innerHTML = "";
                danhSach.slice(1).forEach(subItem => {
                    const li = document.createElement("li");
                    li.innerHTML = `<a href="${subItem.url}">${subItem.title}</a>`;
                    ul.appendChild(li);
                });
            }
        });
    } catch (err) {
        console.error("Lỗi tải chuyên mục chuyên môn:", err);
    }
}


/* ==========================================================
   4. KHU VUC: TIM KIEM NOI DUNG TRONG TRANG
   ========================================================== */

function khoiTaoTimKiem() {
    const oTimKiem = document.getElementById("oTimKiemTrangChu");
    const nutTimKiem = document.getElementById("nutTimKiemTrangChu");
    const ketQua = document.getElementById("ketQuaTimKiemTrangChu");

    if (!oTimKiem || !nutTimKiem || !ketQua) return;

    function xoaHighlightCu() {
        document.querySelectorAll(".highlight-tim-kiem-trang-chu").forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
    }

    function highlightTuKhoa(phanTu, tuKhoa) {
        if (!phanTu || !tuKhoa) return;
        const regex = new RegExp("(" + tuKhoa.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");

        function duyetNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (regex.test(node.nodeValue)) {
                    const span = document.createElement("span");
                    span.innerHTML = node.nodeValue.replace(regex, '<mark class="highlight-tim-kiem-trang-chu">$1</mark>');
                    node.parentNode.replaceChild(span, node);
                }
            } else {
                Array.from(node.childNodes).forEach(duyetNode);
            }
        }
        duyetNode(phanTu);
    }

    function diDenKetQua(id, tuKhoa) {
        const phanTu = document.getElementById(id);
        if (!phanTu) return;

        ketQua.style.display = "none";
        xoaHighlightCu();
        highlightTuKhoa(phanTu, tuKhoa);

        setTimeout(() => {
            phanTu.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);

        phanTu.classList.add("vi-tri-tim-thay");
        setTimeout(() => {
            phanTu.classList.remove("vi-tri-tim-thay");
        }, 3000);
    }

    function timKiemNoiDung() {
        const tuKhoa = oTimKiem.value.trim().toLowerCase();
        if (tuKhoa.length < 2) {
            ketQua.style.display = "block";
            ketQua.innerHTML = `<div class="tim-kiem-thong-bao">Vui lòng nhập ít nhất 2 ký tự để tìm kiếm.</div>`;
            return;
        }

        xoaHighlightCu();
        const danhSach = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, article, .bai-viet, .tin-tuc, .noi-dung, .hoi-ky");
        let ketQuaHTML = "";
        let soKetQua = 0;

        danhSach.forEach(phanTu => {
            const noiDung = phanTu.innerText.trim().replace(/\s+/g, " ");
            if (noiDung && noiDung.toLowerCase().includes(tuKhoa)) {
                if (!phanTu.id) {
                    phanTu.id = "ket-qua-tim-kiem-" + Date.now() + "-" + soKetQua;
                }

                let viTri = noiDung.toLowerCase().indexOf(tuKhoa);
                let batDau = Math.max(0, viTri - 80);
                let ketThuc = Math.min(noiDung.length, viTri + tuKhoa.length + 120);
                let doanNoiDung = noiDung.substring(batDau, ketThuc);

                const regex = new RegExp("(" + tuKhoa.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
                doanNoiDung = doanNoiDung.replace(regex, '<mark>$1</mark>');

                soKetQua++;
                ketQuaHTML += `
                    <div class="ket-qua-tim-kiem-item" data-id="${phanTu.id}">
                        <strong>Kết quả ${soKetQua}</strong>
                        <span>${batDau > 0 ? "..." : ""}${doanNoiDung}${ketThuc < noiDung.length ? "..." : ""}</span>
                    </div>
                `;
            }
        });

        ketQua.style.display = "block";
        if (soKetQua === 0) {
            ketQua.innerHTML = `<div class="tim-kiem-thong-bao">Không tìm thấy nội dung phù hợp với: <strong>${oTimKiem.value}</strong></div>`;
        } else {
            ketQua.innerHTML = `
                <div class="tim-kiem-thong-bao">Tìm thấy <strong>${soKetQua}</strong> kết quả. Nhấn vào kết quả để đi đến vị trí.</div>
                ${ketQuaHTML}
            `;

            document.querySelectorAll(".ket-qua-tim-kiem-item").forEach(item => {
                item.addEventListener("click", function () {
                    diDenKetQua(this.dataset.id, tuKhoa);
                });
            });
        }
    }

    nutTimKiem.addEventListener("click", timKiemNoiDung);
    oTimKiem.addEventListener("keydown", e => { if (e.key === "Enter") timKiemNoiDung(); });
    oTimKiem.addEventListener("input", function () {
        if (this.value.trim().length >= 2) timKiemNoiDung();
        else ketQua.style.display = "none";
    });

    document.addEventListener("click", e => {
        if (!e.target.closest(".tim-kiem-trang-chu")) ketQua.style.display = "none";
    });
}


/* ==========================================================
   5. KHU VUC: TRINHI PHAT VIDEO
   ========================================================== */

function khoiTaoVideoPlayer() {
    const mainVideo = document.getElementById("mainVideo");
    if (!mainVideo) return;

    const playButton = document.getElementById("playButton");
    const videoOverlay = document.getElementById("videoOverlay");
    const videoTitle = document.getElementById("videoTitle");
    const videoDescription = document.getElementById("videoDescription");
    const videoCounter = document.getElementById("videoCounter");
    const previousButton = document.getElementById("previousButton");
    const nextButton = document.getElementById("nextButton");

    let videos = [];
    let currentIndex = 0;

    async function loadVideoList() {
        try {
            const response = await fetch(`videos.json?v=${Date.now()}`);
            if (!response.ok) throw new Error("Không thể tải videos.json");

            videos = await response.json();
            if (!Array.isArray(videos) || videos.length === 0) {
                if (videoTitle) videoTitle.textContent = "Chưa có video";
                return;
            }
            showVideo(0);
        } catch (error) {
            console.error(error);
            if (videoTitle) videoTitle.textContent = "Không thể tải danh sách video";
        }
    }

    function showVideo(index) {
        const selectedVideo = videos[index];
        if (!selectedVideo) return;

        mainVideo.pause();
        if (videoOverlay) videoOverlay.classList.remove("hidden");
        if (videoTitle) videoTitle.textContent = selectedVideo.title || "Video không có tiêu đề";
        if (videoDescription) videoDescription.textContent = selectedVideo.description || "";
        if (videoCounter) videoCounter.textContent = `Video ${index + 1} / ${videos.length}`;

        if (selectedVideo.poster) mainVideo.poster = selectedVideo.poster;
        else mainVideo.removeAttribute("poster");

        mainVideo.src = selectedVideo.url;
        mainVideo.load();

        if (previousButton) previousButton.disabled = index === 0;
        if (nextButton) nextButton.disabled = index === videos.length - 1;
    }

    if (playButton) {
        playButton.addEventListener("click", async () => {
            try {
                await mainVideo.play();
                if (videoOverlay) videoOverlay.classList.add("hidden");
            } catch (error) {
                alert("Không thể phát video này.");
            }
        });
    }

    mainVideo.addEventListener("click", () => {
        if (!mainVideo.paused) {
            mainVideo.pause();
            if (videoOverlay) videoOverlay.classList.remove("hidden");
        }
    });

    mainVideo.addEventListener("ended", () => {
        if (videoOverlay) videoOverlay.classList.remove("hidden");
    });

    if (previousButton) {
        previousButton.addEventListener("click", () => {
            if (currentIndex > 0) showVideo(--currentIndex);
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            if (currentIndex < videos.length - 1) showVideo(++currentIndex);
        });
    }

    loadVideoList();
}


/* ==========================================================
   6. KHU VUC: INTERACTION (LIKE, FEEDBACK, SHARE, LIGHTBOX)
   ========================================================== */

// 6.1. Like Bài Viết
function loadLike() {
    const likeCount = document.getElementById("likeCount");
    if (!likeCount) return;

    fetch(`${LIKE_API}?action=get&page=${encodeURIComponent(pageId)}`)
        .then(res => res.text())
        .then(data => { likeCount.textContent = data; })
        .catch(err => console.error("Lỗi tải lượt thích:", err));
}

function xuLyLike() {
    const likeCount = document.getElementById("likeCount");
    const key = "liked_" + pageId;

    if (localStorage.getItem(key)) {
        alert("Bạn đã đồng tình trước đó.");
        return;
    }

    fetch(`${LIKE_API}?action=like&page=${encodeURIComponent(pageId)}`)
        .then(res => res.text())
        .then(data => {
            if (likeCount) likeCount.textContent = data;
            localStorage.setItem(key, "true");
        })
        .catch(err => console.error("Lỗi gửi lượt thích:", err));
}

// 6.2. Gửi góp ý
async function sendFeedback() {
    const noiDung = document.getElementById("fb-content")?.value.trim();
    if (!noiDung) {
        alert("Vui lòng nhập nội dung góp ý!");
        return;
    }

    const duLieu = {
        page: document.title,
        ten: document.getElementById("fb-name")?.value.trim() || "Ẩn danh",
        noiDung: noiDung,
        thoiGian: new Date().toLocaleString("vi-VN"),
        url: window.location.href
    };

    try {
        await fetch(FEEDBACK_API, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(duLieu)
        });

        const thongBao = document.getElementById("fb-message");
        if (thongBao) thongBao.innerHTML = "✅ Đã gửi góp ý thành công!";
        document.getElementById("fb-content").value = "";
    } catch (error) {
        alert("Có lỗi xảy ra khi gửi góp ý!");
    }
}
window.sendFeedback = sendFeedback;

// 6.3. Chia sẻ & Copy Link
function sharePage() {
    const url = encodeURIComponent(location.href);
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
}
window.sharePage = sharePage;

function copyLink() {
    navigator.clipboard.writeText(location.href);
    alert("Đã copy liên kết!");
}
window.copyLink = copyLink;

// 6.4. Dropdown Liên kết ngoài
function toggleLienKet() {
    const danhSach = document.getElementById("danh-sach-lienket");
    const muiTen = document.getElementById("muiten-lienket");
    if (!danhSach || !muiTen) return;

    danhSach.classList.toggle("show");
    muiTen.textContent = danhSach.classList.contains("show") ? "▲" : "▼";
}
window.toggleLienKet = toggleLienKet;

document.addEventListener("click", function (event) {
    const hop = document.querySelector(".lien-ket-ngoai");
    const danhSach = document.getElementById("danh-sach-lienket");
    const muiTen = document.getElementById("muiten-lienket");

    if (hop && danhSach && !hop.contains(event.target)) {
        danhSach.classList.remove("show");
        if (muiTen) muiTen.textContent = "▼";
    }
});

// 6.5. Xem ảnh phóng to (Lightbox)
function openImg(src) {
    const lightbox = document.getElementById("lightbox");
    const bigImg = document.getElementById("bigImg");
    if (lightbox && bigImg) {
        bigImg.src = src;
        lightbox.style.display = "flex";
    }
}
window.openImg = openImg;

function closeImg() {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) lightbox.style.display = "none";
}
window.closeImg = closeImg;


/* ==========================================================
   7. KHU VUC: TIEN ICH DONG HO & THONG KE VIEWS / ONLINE
   ========================================================== */

function capNhatNgayGio() {
    const now = new Date();
    const gio = String(now.getHours()).padStart(2, "0");
    const phut = String(now.getMinutes()).padStart(2, "0");
    const giay = String(now.getSeconds()).padStart(2, "0");
    const ngay = String(now.getDate()).padStart(2, "0");
    const thang = String(now.getMonth() + 1).padStart(2, "0");
    const nam = now.getFullYear();
    const danhSachThu = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

    const gioEl = document.getElementById("gioHienTai");
    const ngayEl = document.getElementById("ngayHienTai");
    const thuEl = document.getElementById("thuHienTai");

    if (gioEl) gioEl.innerHTML = `${gio}:${phut}:${giay}`;
    if (ngayEl) ngayEl.innerHTML = `${ngay}-${thang}-${nam}`;
    if (thuEl) thuEl.innerHTML = danhSachThu[now.getDay()];
}

// Thống kê lượt xem bài viết
async function updateViews() {
    const viewCount = document.getElementById("viewCount");
    if (!viewCount) return;

    try {
        if (!sessionStorage.getItem("viewed_" + postId)) {
            const res = await fetch(`${VIEW_API}?action=increment&postId=${postId}`);
            const data = await res.json();
            viewCount.innerText = data.views;
            sessionStorage.setItem("viewed_" + postId, "true");
        } else {
            const res = await fetch(`${VIEW_API}?postId=${postId}`);
            const data = await res.json();
            viewCount.innerText = data.views;
        }
    } catch (err) {
        console.error("Lỗi view:", err);
    }
}

// Thống kê Online (JSONP)
function hienThiThongKe(data) {
    const online = document.getElementById("online");
    const totalViews = document.getElementById("totalViews");
    const todayViews = document.getElementById("todayViews");
    const weekViews = document.getElementById("weekViews");
    const topPage = document.getElementById("topPage");

    if (online) online.textContent = data.online;
    if (totalViews) totalViews.textContent = data.totalViews;
    if (todayViews) todayViews.textContent = data.todayViews;
    if (weekViews) weekViews.textContent = data.weekViews;
    if (topPage) topPage.textContent = data.topPage;
}
window.hienThiThongKe = hienThiThongKe;

function capNhatThongKe() {
    let visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem("visitorId", visitorId);
    }

    const oldScript = document.getElementById("online-script");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = "online-script";
    script.src = `${ONLINE_API}?page=index&id=${visitorId}&callback=hienThiThongKe&_=${Date.now()}`;
    document.body.appendChild(script);
}


/* ==========================================================
   8. KHU VUC: WIDGET DONG & SERVICE WORKER
   ========================================================== */

function khoiTaoCanBo() {
    const dsNguoi = document.querySelectorAll('.nguoi');
    dsNguoi.forEach(item => {
        item.addEventListener('click', () => {
            dsNguoi.forEach(x => x.classList.remove('active'));
            item.classList.add('active');

            const anh = document.getElementById('anhHienThi');
            const ten = document.getElementById('tenHienThi');
            const ghiChu = document.getElementById('ghiChuHienThi');

            if (anh) anh.src = item.dataset.anh;
            if (ten) ten.textContent = item.dataset.ten;
            if (ghiChu) ghiChu.textContent = item.dataset.ghichu;
        });
    });
}

function taiComponentPhu() {
    // Tải thông tin cán bộ
    const containerCanBo = document.getElementById('gioi-thieu-can-bo');
    if (containerCanBo) {
        fetch('https://vuthanhcong77.github.io/quanlybaivietvtc/thanh-phan/can-bo.html')
            .then(r => r.text())
            .then(html => {
                containerCanBo.innerHTML = html;
                khoiTaoCanBo();
            })
            .catch(err => console.error("Lỗi tải cán bộ:", err));
    }

    // Tải nút Subscribe
    const containerSub = document.getElementById("subscribe-container");
    if (containerSub) {
        fetch("subscribe.html")
            .then(r => r.text())
            .then(html => { containerSub.innerHTML = html; })
            .catch(err => console.error("Lỗi tải subscribe:", err));
    }
}

// Đăng ký Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js")
            .then(reg => console.log("Service Worker đăng ký thành công:", reg))
            .catch(err => console.log("Service Worker lỗi:", err));
    });
}


/* ==========================================================
   9. KHU VUC: KHOI TAO UNG DUNG (DOM CONTENT LOADED)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Tải ngày giờ & Cập nhật real-time
    capNhatNgayGio();
    setInterval(capNhatNgayGio, 1000);

    // 2. Tải lượt tương tác & Lượt xem
    updateViews();
    loadLike();

    const likeBtn = document.getElementById("likeBtn");
    if (likeBtn) likeBtn.addEventListener("click", xuLyLike);

    // 3. Khởi tạo Thống kê Online
    capNhatThongKe();
    setInterval(capNhatThongKe, 60000);

    // 4. Khởi tạo chức năng chung
    khoiTaoTimKiem();
    taiBannerMoiNhat();
    loadLatestNews();
    taiBaiViet();
    taiChuyenMucChuyenMon();
    khoiTaoVideoPlayer();
    taiComponentPhu();

    // 5. Khởi tạo các hàm theo trang đặc thù
    const page = document.body.dataset.page;
    if (page === "home") {
        taiBaiVietMoiNhat();
    }
});
