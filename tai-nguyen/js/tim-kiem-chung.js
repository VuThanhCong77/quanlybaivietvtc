/* =========================================================
   TIM KIEM CHUNG TOAN WEBSITE
   File: tai-nguyen/js/tim-kiem.js
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       CAU HINH
    ===================================================== */

    const BASE_URL =
        "https://vuthanhcong77.github.io/quanlybaivietvtc/";

    const NGUON_DU_LIEU = [
        "du-lieu/bai-viet.json",
        "du-lieu/hoi-ky.json"
    ];


    /* =====================================================
       BIEN TOAN CUC
    ===================================================== */

    let tatCaBaiViet = [];
    let ketQuaHienTai = [];
    let tuKhoaHienTai = "";
    let boLocHienTai = "all";


    /* =====================================================
       DOM
    ===================================================== */

    const form =
        document.getElementById("form-tim-kiem");

    const oTimKiem =
        document.getElementById("o-tim-kiem");

    const nutXoa =
        document.getElementById("xoa-tim-kiem");

    const goiY =
        document.getElementById("goi-y-tim-kiem");

    const khuVucKetQua =
        document.getElementById("ket-qua-tim-kiem");

    const danhSachKetQua =
        document.getElementById("danh-sach-ket-qua");

    const thongBao =
        document.getElementById("thong-bao-ket-qua");

    const nutDong =
        document.getElementById("dong-ket-qua-tim-kiem");

    const nutLoc =
        document.querySelectorAll(".bo-loc-item");


    if (!form || !oTimKiem) {
        return;
    }


    /* =====================================================
       HAM BO DAU TIENG VIET
    ===================================================== */

    function boDauTiengViet(chuoi) {

        return String(chuoi || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .toLowerCase();

    }


    /* =====================================================
       CHUAN HOA KHOANG TRANG
    ===================================================== */

    function chuanHoa(chuoi) {

        return boDauTiengViet(chuoi)
            .replace(/\s+/g, " ")
            .trim();

    }


    /* =====================================================
       LAY CAC TRUONG CO THE TIM KIEM
    ===================================================== */

    function layNoiDungTimKiem(baiViet) {

        return [
            baiViet.title,
            baiViet.desc,
            baiViet.description,
            baiViet.content,
            baiViet.noiDung,
            baiViet.category,
            baiViet.tags,
            baiViet.author
        ]
        .flat(Infinity)
        .filter(Boolean)
        .join(" ");

    }


    /* =====================================================
       CHUAN HOA DU LIEU
    ===================================================== */

    function chuanHoaBaiViet(baiViet, nguon) {

        return {
            ...baiViet,

            _nguon: nguon,

            _noiDungTimKiem:
                chuanHoa(
                    layNoiDungTimKiem(baiViet)
                ),

            _tieuDe:
                String(baiViet.title || "Không có tiêu đề"),

            _moTa:
                String(
                    baiViet.desc ||
                    baiViet.description ||
                    ""
                ),

            _url:
                taoUrlBaiViet(baiViet.url),

            _category:
                layChuyenMuc(baiViet.category)

        };

    }


    /* =====================================================
       TAO URL TUONG DOI / TUYET DOI
    ===================================================== */

    function taoUrlBaiViet(url) {

        if (!url) {
            return BASE_URL;
        }

        const urlString =
            String(url).trim();

        if (
            urlString.startsWith("http://") ||
            urlString.startsWith("https://")
        ) {
            return urlString;
        }

        return new URL(
            urlString.replace(/^\/+/, ""),
            BASE_URL
        ).href;

    }


    /* =====================================================
       CHUYEN MUC
    ===================================================== */

    function layChuyenMuc(category) {

        if (Array.isArray(category)) {
            return category.join(", ");
        }

        return String(category || "");

    }


    /* =====================================================
       TAI MOT FILE JSON
    ===================================================== */

    async function taiJson(duongDan) {

        try {

            const response =
                await fetch(
                    BASE_URL + duongDan,
                    {
                        cache: "no-store"
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            if (!Array.isArray(data)) {
                return [];
            }

            return data.map(
                baiViet =>
                    chuanHoaBaiViet(
                        baiViet,
                        duongDan
                    )
            );

        } catch (error) {

            console.warn(
                "Không thể tải:",
                duongDan,
                error
            );

            return [];

        }

    }


    /* =====================================================
       TAI TOAN BO DU LIEU
    ===================================================== */

    async function taiDuLieu() {

        try {

            const cacKetQua =
                await Promise.all(
                    NGUON_DU_LIEU.map(
                        taiJson
                    )
                );

            tatCaBaiViet =
                cacKetQua.flat();


            /* Loại bỏ bài trùng ID */
            const daCo =
                new Set();

            tatCaBaiViet =
                tatCaBaiViet.filter(
                    baiViet => {

                        const khoa =
                            baiViet.id ||
                            baiViet._url;

                        if (daCo.has(khoa)) {
                            return false;
                        }

                        daCo.add(khoa);

                        return true;

                    }
                );


            console.log(
                `Đã tải ${tatCaBaiViet.length} bài viết cho tìm kiếm.`
            );


        } catch (error) {

            console.error(
                "Lỗi tải dữ liệu tìm kiếm:",
                error
            );

        }

    }


    /* =====================================================
       KIEM TRA CHUYEN MUC
    ===================================================== */

    function thuocChuyenMuc(
        baiViet,
        chuyenMuc
    ) {

        if (chuyenMuc === "all") {
            return true;
        }

        const danhMuc =
            Array.isArray(
                baiViet.category
            )
            ? baiViet.category
            : [baiViet.category];

        const danhMucChuanHoa =
            danhMuc.map(
                chuanHoa
            );

        return danhMucChuanHoa.includes(
            chuanHoa(chuyenMuc)
        );

    }


    /* =====================================================
       TIM KIEM
    ===================================================== */

    function timKiem(
        tuKhoa,
        chuyenMuc = "all"
    ) {

        const tuKhoaChuanHoa =
            chuanHoa(tuKhoa);

        if (!tuKhoaChuanHoa) {
            return [];
        }


        const cacTu =
            tuKhoaChuanHoa
                .split(/\s+/)
                .filter(Boolean);


        const ketQua =
            tatCaBaiViet.filter(
                baiViet => {

                    if (
                        !thuocChuyenMuc(
                            baiViet,
                            chuyenMuc
                        )
                    ) {
                        return false;
                    }


                    return cacTu.every(
                        tu =>
                            baiViet
                                ._noiDungTimKiem
                                .includes(tu)
                    );

                }
            );


        /*
         * Ưu tiên bài có từ khóa
         * trong tiêu đề.
         */

        ketQua.sort(
            (a, b) => {

                const aTitle =
                    chuanHoa(
                        a._tieuDe
                    );

                const bTitle =
                    chuanHoa(
                        b._tieuDe
                    );

                const aScore =
                    tinhDiem(
                        aTitle,
                        tuKhoaChuanHoa
                    );

                const bScore =
                    tinhDiem(
                        bTitle,
                        tuKhoaChuanHoa
                    );

                return bScore - aScore;

            }
        );


        return ketQua;

    }


    /* =====================================================
       TINH DIEM KET QUA
    ===================================================== */

    function tinhDiem(
        tieuDe,
        tuKhoa
    ) {

        let diem = 0;

        if (tieuDe === tuKhoa) {
            diem += 100;
        }

        if (
            tieuDe.includes(tuKhoa)
        ) {
            diem += 50;
        }

        const cacTu =
            tuKhoa.split(/\s+/);

        cacTu.forEach(
            tu => {

                if (
                    tieuDe.includes(tu)
                ) {
                    diem += 10;
                }

            }
        );

        return diem;

    }


    /* =====================================================
       HIGHLIGHT TU KHOA
    ===================================================== */

    function highlight(
        text,
        tuKhoa
    ) {

        if (!text) {
            return "";
        }

        const tu =
            String(tuKhoa || "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (!tu.length) {
            return escapeHtml(text);
        }


        let html =
            escapeHtml(text);


        tu.forEach(
            tuKhoaNho => {

                const regex =
                    new RegExp(
                        "(" +
                        escapeRegex(
                            tuKhoaNho
                        ) +
                        ")",
                        "gi"
                    );

                html =
                    html.replace(
                        regex,
                        '<mark class="tim-kiem-tu-khoa">$1</mark>'
                    );

            }
        );


        return html;

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(text) {

        return String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function escapeRegex(text) {

        return String(text)
            .replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

    }


    /* =====================================================
       HIEN THI KET QUA
    ===================================================== */

    function hienThiKetQua(
        ketQua,
        tuKhoa
    ) {

        ketQuaHienTai =
            ketQua;

        khuVucKetQua.hidden = false;


        if (!ketQua.length) {

            thongBao.textContent =
                `Không tìm thấy kết quả phù hợp với "${tuKhoa}".`;

            danhSachKetQua.innerHTML = `

                <div class="khong-co-ket-qua">

                    <strong>Không tìm thấy bài viết</strong>

                    <span>
                        Hãy thử từ khóa khác hoặc bỏ dấu tiếng Việt.
                    </span>

                </div>

            `;

            return;

        }


        thongBao.textContent =
            `Tìm thấy ${ketQua.length} kết quả cho "${tuKhoa}".`;


        danhSachKetQua.innerHTML =
            ketQua
                .map(
                    taoTheKetQua
                )
                .join("");


        /* Cuộn đến kết quả */

        setTimeout(
            () => {

                khuVucKetQua.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            50
        );

    }


    /* =====================================================
       TAO THE KET QUA
    ===================================================== */

    function taoTheKetQua(
        baiViet
    ) {

        const title =
            highlight(
                baiViet._tieuDe,
                tuKhoaHienTai
            );

        const desc =
            escapeHtml(
                baiViet._moTa
            );

        const category =
            escapeHtml(
                baiViet._category
            );

        const date =
            escapeHtml(
                baiViet.date || ""
            );


        return `

            <a
                class="the-ket-qua"
                href="${escapeHtml(baiViet._url)}"
            >

                <h3>
                    ${title}
                </h3>

                ${
                    desc
                    ?
                    `<p>${desc}</p>`
                    :
                    ""
                }

                <div class="thong-tin-bai-viet">

                    ${
                        date
                        ?
                        `<span>📅 ${date}</span>`
                        :
                        ""
                    }

                    ${
                        category
                        ?
                        `<span class="the-chuyen-muc">
                            ${category}
                        </span>`
                        :
                        ""
                    }

                </div>

            </a>

        `;

    }


    /* =====================================================
       GOI Y
    ===================================================== */

    function hienThiGoiY(
        tuKhoa
    ) {

        if (
            tuKhoa.length < 2 ||
            !tatCaBaiViet.length
        ) {

            goiY.hidden = true;
            return;

        }


        const tuKhoaChuanHoa =
            chuanHoa(tuKhoa);


        const ketQua =
            tatCaBaiViet
                .filter(
                    baiViet =>
                        chuanHoa(
                            baiViet._tieuDe
                        )
                        .includes(
                            tuKhoaChuanHoa
                        )
                )
                .slice(0, 5);


        if (!ketQua.length) {

            goiY.hidden = true;
            return;

        }


        goiY.innerHTML =
            ketQua
                .map(
                    baiViet => `

                        <button
                            type="button"
                            class="goi-y-item"
                            data-url="${escapeHtml(
                                baiViet._url
                            )}"
                        >
                            ${escapeHtml(
                                baiViet._tieuDe
                            )}
                        </button>

                    `
                )
                .join("");


        goiY.hidden = false;

    }


    /* =====================================================
       SU KIEN GOI Y
    ===================================================== */

    goiY.addEventListener(
        "click",
        event => {

            const item =
                event.target.closest(
                    ".goi-y-item"
                );

            if (!item) {
                return;
            }

            window.location.href =
                item.dataset.url;

        }
    );


    /* =====================================================
       SUBMIT TIM KIEM
    ===================================================== */

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const tuKhoa =
                oTimKiem.value.trim();

            if (!tuKhoa) {

                oTimKiem.focus();

                return;

            }


            tuKhoaHienTai =
                tuKhoa;

            goiY.hidden = true;


            const ketQua =
                timKiem(
                    tuKhoa,
                    boLocHienTai
                );


            hienThiKetQua(
                ketQua,
                tuKhoa
            );

        }
    );


    /* =====================================================
       NHAP TU KHOA
    ===================================================== */

    oTimKiem.addEventListener(
        "input",
        () => {

            const coTuKhoa =
                oTimKiem.value.trim().length > 0;

            nutXoa.style.display =
                coTuKhoa
                ? "block"
                : "none";


            hienThiGoiY(
                oTimKiem.value.trim()
            );

        }
    );


    /* =====================================================
       XOA TU KHOA
    ===================================================== */

    nutXoa.addEventListener(
        "click",
        () => {

            oTimKiem.value = "";

            nutXoa.style.display =
                "none";

            goiY.hidden = true;

            oTimKiem.focus();

        }
    );


    /* =====================================================
       DONG KET QUA
    ===================================================== */

    nutDong.addEventListener(
        "click",
        () => {

            khuVucKetQua.hidden = true;

        }
    );


    /* =====================================================
       BO LOC CHUYEN MUC
    ===================================================== */

    nutLoc.forEach(
        nut => {

            nut.addEventListener(
                "click",
                () => {

                    nutLoc.forEach(
                        n =>
                            n.classList.remove(
                                "active"
                            )
                    );

                    nut.classList.add(
                        "active"
                    );


                    boLocHienTai =
                        nut.dataset.category ||
                        "all";


                    if (!tuKhoaHienTai) {
                        return;
                    }


                    const ketQua =
                        timKiem(
                            tuKhoaHienTai,
                            boLocHienTai
                        );


                    hienThiKetQua(
                        ketQua,
                        tuKhoaHienTai
                    );

                }
            );

        }
    );


    /* =====================================================
       CTRL + K / CMD + K
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                oTimKiem.focus();

                oTimKiem.select();

            }

        }
    );


    /* =====================================================
       ESC DONG GOI Y
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                goiY.hidden = true;

            }

        }
    );


    /* =====================================================
       CLICK RA NGOAI
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    ".tim-kiem-chung"
                )
            ) {

                goiY.hidden = true;

            }

        }
    );


    /* =====================================================
       KHOI DONG
    ===================================================== */

    taiDuLieu();

})();