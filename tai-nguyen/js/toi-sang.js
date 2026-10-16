
/* =====================================================
   CHẾ ĐỘ TỐI / SÁNG - WEBSITE VŨ THÀNH CÔNG
   Chỉ áp dụng cho index.html
===================================================== */

(function () {
    "use strict";

    const KHOA_LUU = "vtc-che-do-giao-dien";
    const CHE_DO_SANG = "light";
    const CHE_DO_TOI = "dark";

    // Chỉ chạy trên trang chủ
    if (
        document.body.dataset.page !== "home" ||
        document.body.dataset.postId !== "index"
    ) {
        return;
    }

    // Đọc lựa chọn đã lưu
    function docCheDoDaLuu() {
        try {
            const cheDo = localStorage.getItem(KHOA_LUU);

            if (cheDo === CHE_DO_SANG || cheDo === CHE_DO_TOI) {
                return cheDo;
            }
        } catch (error) {
            console.warn("Không thể đọc chế độ giao diện:", error);
        }

        return CHE_DO_SANG;
    }

    // Áp dụng chế độ giao diện
    function apDungCheDo(cheDo, ghiNho = true) {
        const laToi = cheDo === CHE_DO_TOI;

        document.body.dataset.theme = laToi
            ? CHE_DO_TOI
            : CHE_DO_SANG;

        document.documentElement.dataset.theme = laToi
            ? CHE_DO_TOI
            : CHE_DO_SANG;

        document.documentElement.style.colorScheme =
            laToi ? CHE_DO_TOI : CHE_DO_SANG;

        const nut = document.getElementById("nut-toi-sang");

        if (nut) {
            nut.innerHTML = laToi
                ? '<span aria-hidden="true">☀️</span><span>Sáng</span>'
                : '<span aria-hidden="true">🌙</span><span>Tối</span>';

            nut.setAttribute(
                "aria-label",
                laToi
                    ? "Chuyển sang chế độ sáng"
                    : "Chuyển sang chế độ tối"
            );

            nut.setAttribute("aria-pressed", String(laToi));
            nut.title = laToi
                ? "Chuyển sang chế độ sáng"
                : "Chuyển sang chế độ tối";
        }

        // Chỉ ghi nhớ khi người dùng chọn hoặc khi khởi tạo
        if (ghiNho) {
            try {
                localStorage.setItem(KHOA_LUU, cheDo);
            } catch (error) {
                console.warn("Không thể lưu chế độ giao diện:", error);
            }
        }
    }

    // Gắn nút vào menu đã được nạp
    function ganNutToiSang() {
        const nut = document.getElementById("nut-toi-sang");

        if (!nut) return false;

        // Không gắn sự kiện lặp lại
        if (nut.dataset.daKhoiTao === "true") return true;

        nut.dataset.daKhoiTao = "true";

        nut.addEventListener("click", function () {
            const dangToi =
                document.body.dataset.theme === CHE_DO_TOI;

            apDungCheDo(
                dangToi ? CHE_DO_SANG : CHE_DO_TOI
            );
        });

        nut.style.display = "inline-flex";

        // Áp dụng lựa chọn đã lưu
        apDungCheDo(docCheDoDaLuu());

        return true;
    }

    // Khởi tạo ngay để hạn chế nhấp nháy khi tải trang
    apDungCheDo(docCheDoDaLuu(), false);

    // Nếu menu đã có sẵn
    if (ganNutToiSang()) return;

    // Menu được nạp bất đồng bộ: theo dõi đến khi có nút
    const boTheoDoi = new MutationObserver(function () {
        if (ganNutToiSang()) {
            boTheoDoi.disconnect();
        }
    });

    boTheoDoi.observe(
        document.getElementById("menu") || document.body,
        {
            childList: true,
            subtree: true
        }
    );

    // Phương án dự phòng nếu menu chưa tải tại thời điểm khởi tạo
    window.addEventListener("load", ganNutToiSang, { once: true });

})();