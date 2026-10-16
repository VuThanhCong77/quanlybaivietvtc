/* =====================================================
   CHẾ ĐỘ TỐI / SÁNG - HỖ TRỢ TOÀN DIỆN DESKTOP & MOBILE
===================================================== */

(function () {
    "use strict";

    const KHOA_LUU = "vtc-che-do-giao-dien";
    const CHE_DO_SANG = "light";
    const CHE_DO_TOI = "dark";

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

    function apDungCheDo(cheDo, ghiNho = true) {
        const laToi = cheDo === CHE_DO_TOI;

        document.body.dataset.theme = laToi ? CHE_DO_TOI : CHE_DO_SANG;
        document.documentElement.dataset.theme = laToi ? CHE_DO_TOI : CHE_DO_SANG;
        document.documentElement.style.colorScheme = laToi ? CHE_DO_TOI : CHE_DO_SANG;

        // Cập nhật tất cả các nút (cả trên máy tính lẫn điện thoại)
        const danhSachNut = document.querySelectorAll("#nut-toi-sang, #nut-toi-sang-mobile");

        danhSachNut.forEach(nut => {
            if (nut) {
                nut.innerHTML = laToi
                    ? '<span aria-hidden="true">☀️</span><span>Sáng</span>'
                    : '<span aria-hidden="true">🌙</span><span>Tối</span>';

                nut.setAttribute("aria-label", laToi ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối");
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

    function ganSuKienChoNut() {
        const danhSachNut = document.querySelectorAll("#nut-toi-sang, #nut-toi-sang-mobile");
        
        danhSachNut.forEach(nut => {
            if (nut.dataset.daKhoiTao === "true") return;

            nut.dataset.daKhoiTao = "true";
            nut.addEventListener("click", function () {
                const dangToi = document.body.dataset.theme === CHE_DO_TOI;
                apDungCheDo(dangToi ? CHE_DO_SANG : CHE_DO_TOI);
            });
            
            nut.style.display = "inline-flex";
        });
    }

    // Khởi tạo trạng thái ngay lập tức khi load trang
    const cheDoHienTai = docCheDoDaLuu();
    apDungCheDo(cheDoHienTai, false);

    // Theo dõi liên tục DOM để bắt sự kiện ngay khi menu di động được nạp xong qua fetch
    const observer = new MutationObserver(() => {
        ganSuKienChoNut();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("DOMContentLoaded", () => {
        apDungCheDo(docCheDoDaLuu(), false);
        ganSuKienChoNut();
    });
})();
