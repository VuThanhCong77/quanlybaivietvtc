/* =========================================================
GỬI GÓP Ý
========================================================= */

const FEEDBACK_API =
"https://script.google.com/macros/s/AKfycbzb_ovIs2kZto3vuHVPATt1Iq0Uvb0GiQo3hvCm_FAcjRgfaTPyjTG0Qir4ECEkyOE8-g/exec";

async function sendFeedback(){

    const noiDung =

    document
    .getElementById(
    "fb-content"
    )
    ?.value
    .trim();

    if(!noiDung){

        alert(
        "Vui lòng nhập nội dung góp ý!"
        );

        return;

    }

    const duLieu = {

        page:
        document.title,

        ten:

        document
        .getElementById(
        "fb-name"
        )
        ?.value
        .trim()

        ||

        "Ẩn danh",

        noiDung:
        noiDung,

        thoiGian:

        new Date()
        .toLocaleString(
        "vi-VN"
        ),

        url:
        window.location.href

    };

    try{

        await fetch(

        FEEDBACK_API,

        {

            method:"POST",

            mode:"no-cors",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(
            duLieu
            )

        }

        );

        const thongBao =

        document
        .getElementById(
        "fb-message"
        );

        if(thongBao){

            thongBao.innerHTML =

            "✅ Đã gửi góp ý thành công!";

        }

        document
        .getElementById(
        "fb-content"
        )
        .value = "";

    }

    catch(error){

        console.error(
        error
        );

        alert(
        "Có lỗi xảy ra khi gửi góp ý!"
        );

    }

}