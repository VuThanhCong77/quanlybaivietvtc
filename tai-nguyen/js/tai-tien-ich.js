/**
 * Script tự động nạp Bộ Tiện Ích nổi (Vũ Thành Công) vào trang bài viết
 */
document.addEventListener("DOMContentLoaded", function () {
    // Thay đổi đường dẫn bên dưới thành link trỏ đến file tien-ich.html trên GitHub Pages của bạn nếu cần
    const vtcWidgetUrl = "https://vuthanhcong77.github.io/quanlybaivietvtc/thanh-phan/tien-ich.html"; 

    fetch(vtcWidgetUrl)
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải bộ tiện ích.");
            return response.text();
        })
        .then(html => {
            // Tạo một container tạm để bọc nội dung HTML tải về
            const container = document.createElement("div");
            container.innerHTML = html;

            // Tách riêng phần CSS (style) và chèn vào thẻ <head> của trang bài viết
            const styles = container.querySelectorAll("style");
            styles.forEach(style => document.head.appendChild(style));

            // Tách phần giao diện (HTML) và chèn vào cuối thẻ <body>
            const bodyContent = container.querySelectorAll(".vtc-floating-tools, .vtc-qr-modal");
            bodyContent.forEach(el => document.body.appendChild(el));

            // Tách phần mã nguồn JavaScript của tiện ích và thực thi
            const scripts = container.querySelectorAll("script");
            scripts.forEach(script => {
                const newScript = document.createElement("script");
                if (script.text) {
                    newScript.text = script.text;
                } else if (script.src) {
                    newScript.src = script.src;
                }
                document.body.appendChild(newScript);
            });
        })
        .catch(error => {
            console.error("Lỗi khi nạp tiện ích:", error);
        });
});