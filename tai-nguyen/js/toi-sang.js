/* =====================================================
   TỐI / SÁNG - WEBSITE VŨ THÀNH CÔNG
   Chỉ hoạt động trên trang index.html
===================================================== */

(function () {
    "use strict";

    const KHOA_LUU = "vtc-che-do-giao-dien";
    const SANG = "light";
    const TOI = "dark";

    // Chỉ chạy trên trang chủ
    if (
        document.body.dataset.page !== "home" ||
        document.body.dataset.postId !== "index"
    ) {
        return;
    }

    const CAC_NUT = [
        "nut-toi-sang",
        "nut-toi-sang-mobile"
    ];

    function docCheDo() {
        try {
            const cheDo = localStorage.getItem(KHOA_LUU);

            if (cheDo === SANG || cheDo === TOI) {
                return cheDo;
            }
        } catch (error) {
            console.warn("Không thể đọc chế độ giao diện:", error);
        }

        return SANG;
    }

    function capNhatNut(cheDo) {
        const laToi = cheDo === TOI;

        CAC_NUT.forEach(function (id) {
            const nut = document.getElementById(id);

            if (!nut) return;

            const bieuTuong = nut.querySelector(
                ".bieu-tuong-toi-sang"
            );

            const nhan = nut.querySelector(
                ".nhan-toi-sang"
            );

            if (bieuTuong) {
                bieuTuong.textContent = laToi ? "☀️" : "🌙";
            }

            if (nhan) {
                nhan.textContent = laToi ? "Sáng" : "Tối";
            }

            nut.setAttribute(
                "aria-label",
                laToi
                    ? "Chuyển sang chế độ sáng"
                    : "Chuyển sang chế độ tối"
            );

            nut.setAttribute("aria-pressed", String(laToi));
        });
    }

    function apDungCheDo(cheDo, ghiNho = true) {
        const giaTri = cheDo === TOI ? TOI : SANG;

        document.documentElement.dataset.theme = giaTri;
        document.body.dataset.theme = giaTri;

        document.documentElement.style.colorScheme = giaTri;

        capNhatNut(giaTri);

        if (ghiNho) {
            try {
                localStorage.setItem(KHOA_LUU, giaTri);
            } catch (error) {
                console.warn("Không thể lưu chế độ giao diện:", error);
            }
        }
    }

    function ganSuKien() {
        CAC_NUT.forEach(function (id) {
            const nut = document.getElementById(id);

            if (!nut || nut.dataset.daKhoiTao === "true") {
                return;
            }

            nut.dataset.daKhoiTao = "true";

            nut.addEventListener("click", function () {
                const dangToi =
                    document.body.dataset.theme === TOI;

                apDungCheDo(dangToi ? SANG : TOI);
            });
        });

        capNhatNut(
            document.body.dataset.theme || SANG
        );
    }

    // Khởi tạo chế độ đã lưu
    apDungCheDo(docCheDo(), false);

    // Theo dõi menu được nạp bằng fetch()
    const boTheoDoi = new MutationObserver(function () {
        ganSuKien();
    });

    boTheoDoi.observe(
        document.getElementById("menu") || document.body,
        {
            childList: true,
            subtree: true
        }
    );

    // Khởi tạo nếu các nút đã tồn tại
    ganSuKien();

    window.addEventListener("load", ganSuKien, {
        once: true
    });

})();
