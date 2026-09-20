/* =========================================================
ĐỌC BÀI VIẾT (Tối ưu cho cả PC và Mobile/iOS)
========================================================= */

let dangDoc = false;

const btnDoc = document.getElementById("btnDoc");

if (btnDoc) {

    btnDoc.addEventListener("click", () => {

        // 1. Nếu đang đọc -> Dừng đọc
        if (dangDoc) {

            window.speechSynthesis.cancel();

            dangDoc = false;

            btnDoc.innerHTML = "🔊";

            return;

        }

        // 2. Lấy nội dung cần đọc
        const noiDung = document.getElementById("readingContent")?.innerText;

        if (!noiDung) {

            alert("Không tìm thấy nội dung bài viết.");

            return;

        }

        // 3. Đảm bảo xóa bỏ tất cả tác vụ đọc cũ
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(noiDung);

        speech.lang = "vi-VN";

        speech.rate = 1;

        speech.pitch = 1;

        speech.volume = 1;

        speech.onstart = () => {

            dangDoc = true;

            btnDoc.innerHTML = "⏹";

        };

        speech.onend = () => {

            dangDoc = false;

            btnDoc.innerHTML = "🔊";

        };

        speech.onerror = () => {

            dangDoc = false;

            btnDoc.innerHTML = "🔊";

        };

        // 4. Kích hoạt resume để tránh lỗi bị "khóa" âm thanh trên trình duyệt di động (iOS Safari/Android Chrome)
        if (window.speechSynthesis.paused) {

            window.speechSynthesis.resume();

        }

        window.speechSynthesis.speak(speech);

    });

}

// Reset trạng thái nếu người dùng chuyển trang hoặc ẩn trình duyệt
window.addEventListener("beforeunload", () => {

    if (window.speechSynthesis) {

        window.speechSynthesis.cancel();

    }

});
