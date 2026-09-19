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
    // Đang dùng JS Tìm kiếm chung

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

// --- THUẬT TOÁN HỒ NGỌC ĐỨC CHUYỂN DƯƠNG LỊCH SANG ÂM LỊCH (GMT+7) ---
function convertSolarToLunar(dd, mm, yyyy) {
    const timeZone = 7;
    const INT = (d) => Math.floor(d);

    function jdFromDate(d, m, y) {
        let a = INT((14 - m) / 12);
        let y1 = y + 4800 - a;
        let m1 = m + 12 * a - 3;
        return d + INT((153 * m1 + 2) / 5) + 365 * y1 + INT(y1 / 4) - INT(y1 / 100) + INT(y1 / 400) - 32045;
    }

    function getNewMoonDay(k, timeZone) {
        let T = k / 1236.85;
        let T2 = T * T, T3 = T2 * T, T4 = T3 * T;
        let dr = Math.PI / 180;
        let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.00917 * T2) * dr);

        let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
        let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
        let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
        let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * M * dr);
        C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * Mpr * dr);
        C1 = C1 - 0.0004 * Math.sin(3 * Mpr * dr) + 0.0104 * Math.sin(2 * F * dr);
        C1 = C1 - 0.0051 * Math.sin((M + Mpr) * dr) - 0.0074 * Math.sin((M - Mpr) * dr);
        C1 = C1 + 0.0004 * Math.sin((2 * F + M) * dr) - 0.0004 * Math.sin((2 * F - M) * dr);
        C1 = C1 - 0.0006 * Math.sin((2 * F - Mpr) * dr) + 0.0100 * Math.sin((2 * F + Mpr) * dr);

        let JdNew = Jd1 + C1;
        return INT(JdNew + 0.5 + timeZone / 24);
    }

    function getSunLongitude(jdn, timeZone) {
        let T = (jdn - 2451545.0 + 0.5 - timeZone / 24) / 36525;
        let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T * T;
        let M = 357.52910 + 35999.05030 * T - 0.0001559 * T * T - 0.00000048 * T * T * T;
        let dr = Math.PI / 180;
        let C = (1.914600 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * dr);
        C = C + (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) + 0.000289 * Math.sin(3 * M * dr);
        let L = L0 + C;
        L = L - 360 * INT(L / 360);
        return INT(L / 30);
    }

    function getLunarMonth11(yy, timeZone) {
        let off = jdFromDate(31, 12, yy) - 2415021;
        let k = INT(off / 29.53058868);
        let nm = getNewMoonDay(k, timeZone);
        let sunLong = getSunLongitude(nm, timeZone);
        if (sunLong >= 9) {
            nm = getNewMoonDay(k - 1, timeZone);
        }
        return nm;
    }

    let dayNumber = jdFromDate(dd, mm, yyyy);
    let k = INT((dayNumber - 2415021) / 29.53058868);
    let monthStart = getNewMoonDay(k, timeZone);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k - 1, timeZone);
    }
    let a11 = getLunarMonth11(yyyy, timeZone);
    let b11 = a11;

    let lunarYear;
    if (a11 >= monthStart) {
        lunarYear = yyyy;
        a11 = getLunarMonth11(yyyy - 1, timeZone);
    } else {
        lunarYear = yyyy + 1;
        b11 = getLunarMonth11(yyyy + 1, timeZone);
    }

    let lunarDay = dayNumber - monthStart + 1;
    let diff = INT((monthStart - a11) / 29);
    let lunarMonth = diff + 11;

    let leapMonthDiff = INT((b11 - a11) / 29);
    if (leapMonthDiff > 12) {
        let leapOff = 0;
        for (let i = 0; i <= diff; i++) {
            let nm1 = getNewMoonDay(INT((a11 - 2415021) / 29.53058868) + i, timeZone);
            let nm2 = getNewMoonDay(INT((a11 - 2415021) / 29.53058868) + i + 1, timeZone);
            let sl1 = getSunLongitude(nm1, timeZone);
            let sl2 = getSunLongitude(nm2, timeZone);
            if (sl1 === sl2) {
                leapOff = i;
                break;
            }
        }
        if (leapOff > 0) {
            if (diff >= leapOff) lunarMonth = diff + 10;
        }
    }

    if (lunarMonth > 12) lunarMonth -= 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear = yyyy - 1;

    return {
        day: String(lunarDay).padStart(2, "0"),
        month: String(lunarMonth).padStart(2, "0"),
        year: lunarYear
    };
}

// --- HÀM CẬP NHẬT GIỜ ---
function capNhatNgayGio() {
    const now = new Date();
    const gio = String(now.getHours()).padStart(2, "0");
    const phut = String(now.getMinutes()).padStart(2, "0");
    const giay = String(now.getSeconds()).padStart(2, "0");
    const ngay = String(now.getDate()).padStart(2, "0");
    const thang = String(now.getMonth() + 1).padStart(2, "0");
    const nam = now.getFullYear();
    const danhSachThu = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

    // Lấy Ngày/Tháng/Năm Âm lịch chuẩn Việt Nam
    const amLich = convertSolarToLunar(now.getDate(), now.getMonth() + 1, nam);

    const gioEl = document.getElementById("gioHienTai");
    const ngayEl = document.getElementById("ngayHienTai");
    const thuEl = document.getElementById("thuHienTai");
    const amLichEl = document.getElementById("amLichHienTai");

    if (gioEl) gioEl.innerHTML = `${gio}:${phut}:${giay}`;
    if (ngayEl) ngayEl.innerHTML = `${ngay}-${thang}-${nam}`;
    if (thuEl) thuEl.innerHTML = danhSachThu[now.getDay()];
    if (amLichEl) amLichEl.innerHTML = `${amLich.day}-${amLich.month}-${amLich.year}`;
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
