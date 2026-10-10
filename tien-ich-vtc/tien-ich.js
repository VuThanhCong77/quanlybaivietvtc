/* =====================================================
   BỘ TIỆN ÍCH NỔI VŨ THÀNH CÔNG
   Tự động hiển thị trên các trang bài viết
   ===================================================== */

(function () {
    "use strict";

    // Tránh khởi tạo nhiều lần
    if (window.vtcTienIchDaKhoiTao) return;
    window.vtcTienIchDaKhoiTao = true;

    const BASE_URL =
        "https://vuthanhcong77.github.io/quanlybaivietvtc/";

    const HTML_TIEN_ICH = BASE_URL + "tien-ich-vtc/tien-ich.html";

    function khoiTaoTienIch() {
        if (document.querySelector(".vtc-floating-tools")) return;

        fetch(HTML_TIEN_ICH)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Không tải được bộ tiện ích.");
                }
                return response.text();
            })
            .then(function (html) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                // Nạp CSS của bộ tiện ích
                if (!document.querySelector("#vtc-tien-ich-css")) {
                    const css = doc.querySelector("style");

                    if (css) {
                        const style = document.createElement("style");
                        style.id = "vtc-tien-ich-css";
                        style.textContent = css.textContent;
                        document.head.appendChild(style);
                    }
                }

                // Chèn HTML vào trang
                const box = doc.querySelector(".vtc-floating-tools");
                const modal = doc.querySelector(".vtc-qr-modal");

                if (box) {
                    document.body.appendChild(
                        document.importNode(box, true)
                    );
                }

                if (modal) {
                    document.body.appendChild(
                        document.importNode(modal, true)
                    );
                }

                // Khởi tạo sự kiện
                khoiTaoSuKienTienIch();
            })
            .catch(function (error) {
                console.error("Lỗi bộ tiện ích VTC:", error);
            });
    }

    function khoiTaoSuKienTienIch() {
        const box = document.querySelector(".vtc-floating-tools");
        const main = document.getElementById("vtcToolsMain");
        const modal = document.getElementById("vtcQrModal");
        const qr = document.getElementById("vtcQrCode");

        if (!box || !main) return;

        // Mở hoặc đóng menu tiện ích
        main.addEventListener("click", function (event) {
            event.stopPropagation();

            const opened = box.classList.toggle("open");

            main.setAttribute(
                "aria-expanded",
                opened ? "true" : "false"
            );
        });

        // Đóng menu khi nhấn ra ngoài
        document.addEventListener("click", function (event) {
            if (!box.contains(event.target)) {
                box.classList.remove("open");
                main.setAttribute("aria-expanded", "false");
            }
        });

        // Tạo mã QR cho trang hiện tại
        const qrButton = box.querySelector('[data-vtc-action="qr"]');

        if (qrButton && modal && qr) {
            qrButton.addEventListener("click", function () {
                qr.innerHTML = "";

                const img = document.createElement("img");

                img.src =
                    "https://api.qrserver.com/v1/create-qr-code/" +
                    "?size=220x220&data=" +
                    encodeURIComponent(window.location.href);

                img.alt = "Mã QR của trang hiện tại";

                qr.appendChild(img);

                modal.classList.add("active");
                modal.setAttribute("aria-hidden", "false");
            });
        }

        // Đóng cửa sổ QR
        if (modal) {
            modal.addEventListener("click", function (event) {
                if (
                    event.target === modal ||
                    event.target.closest(".vtc-qr-close")
                ) {
                    modal.classList.remove("active");
                    modal.setAttribute("aria-hidden", "true");
                }
            });
        }

        // Sao chép liên kết
        const copyButton = document.getElementById("vtcCopyUrl");

        if (copyButton) {
            copyButton.addEventListener("click", async function () {
                try {
                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    const oldText = copyButton.textContent;
                    copyButton.textContent = "✓ Đã sao chép";

                    setTimeout(function () {
                        copyButton.textContent = oldText;
                    }, 1800);
                } catch (error) {
                    alert("Không thể sao chép liên kết.");
                }
            });
        }
    }

    // Chờ DOM sẵn sàng
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            khoiTaoTienIch,
            { once: true }
        );
    } else {
        khoiTaoTienIch();
    }
})();