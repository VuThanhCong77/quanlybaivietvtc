/* =====================================================
   CHẾ ĐỘ TỐI / SÁNG - WEBSITE VŨ THÀNH CÔNG
   Áp dụng cho toàn bộ các trang (Trang chủ & Bài viết)
===================================================== */

(function () {
    "use strict";

    const KHOA_LUU = "vtc-che-do-giao-dien";
    const CHE_DO_SANG = "light";
    const CHE_DO_TOI = "dark";

    // Đọc lựa chọn đã lưu (mặc định sáng)
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

        document.body.dataset.theme = laToi ? CHE_DO_TOI : CHE_DO_SANG;
        document.documentElement.dataset.theme = laToi ? CHE_DO_TOI : CHE_DO_SANG;
        document.documentElement.style.colorScheme = laToi ? CHE_DO_TOI : CHE_DO_SANG;

        // Cập nhật giao diện tất cả các nút Tối / Sáng trên trang
        const danhSachNut = document.querySelectorAll("#nut-toi-sang, #nut-toi-sang-mobile");

        danhSachNut.forEach(nut => {
            if (nut) {
                nut.innerHTML = laToi
                    ? '<span aria-hidden="true">☀️</span><span>Sáng</span>'
                    : '<span aria-hidden="true">🌙</span><span>Tối</span>';

                nut.setAttribute(
                    "aria-label",
                    laToi ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
                );
                nut.setAttribute("aria-pressed", String(laToi));
                nut.title = laToi ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối";
            }
        });

        if (ghiNho) {
            try {
                localStorage.setItem(KHOA_LUU, cheDo);
            } catch (error) {
                console.warn("Không thể lưu chế độ giao diện:", error);
            }
        }
    }

    // Gắn sự kiện click cho các nút
    function ganNutToiSang() {
        const danhSachNut = document.querySelectorAll("#nut-toi-sang, #nut-toi-sang-mobile");
        if (danhSachNut.length === 0) return false;

        danhSachNut.forEach(nut => {
            if (nut.dataset.daKhoiTao === "true") return;

            nut.dataset.daKhoiTao = "true";
            nut.addEventListener("click", function () {
                const dangToi = document.body.dataset.theme === CHE_DO_TOI;
                apDungCheDo(dangToi ? CHE_DO_SANG : CHE_DO_TOI);
            });

            nut.style.display = "inline-flex";
        });

        apDungCheDo(docCheDoDaLuu());
        return true;
    }

    // Khởi tạo ngay lập tức để hạn chế nhấp nháy giao diện
    apDungCheDo(docCheDoDaLuu(), false);

    if (ganNutToiSang()) return;

    // Theo dõi menu nạp bất đồng bộ
    const boTheoDoi = new MutationObserver(function () {
        if (ganNutToiSang()) {
            boTheoDoi.disconnect();
        }
    });

    boTheoDoi.observe(
        document.getElementById("mainMenu") || document.getElementById("menu") || document.body,
        { childList: true, subtree: true }
    );

    window.addEventListener("load", ganNutToiSang, { once: true });
})();