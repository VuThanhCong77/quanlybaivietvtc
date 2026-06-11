/* =========================================================
ĐỌC BÀI VIẾT
========================================================= */

let dangDoc = false;

let speech = null;

const btnDoc =
document.getElementById(
"btnDoc"
);

if(btnDoc){

    btnDoc.addEventListener(
    "click",
    () => {

        if(dangDoc){

            window.speechSynthesis.cancel();

            dangDoc = false;

            btnDoc.innerHTML =
            "🔊 Đọc bài";

            return;

        }

        const noiDung =

        document
        .getElementById(
        "readingContent"
        )
        ?.innerText;

        if(!noiDung){

            alert(
            "Không tìm thấy nội dung bài viết."
            );

            return;

        }

        speech =
        new SpeechSynthesisUtterance(
        noiDung
        );

        speech.lang =
        "vi-VN";

        speech.rate =
        1;

        speech.pitch =
        1;

        speech.volume =
        1;

        speech.onstart =
        () => {

            dangDoc = true;

            btnDoc.innerHTML =
            "⏹ Dừng đọc";

        };

        speech.onend =
        () => {

            dangDoc = false;

            btnDoc.innerHTML =
            "🔊 Đọc bài";

        };

        window
        .speechSynthesis
        .speak(
        speech
        );

    }
    );

}
