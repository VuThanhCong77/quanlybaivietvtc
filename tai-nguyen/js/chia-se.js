/* =========================================================
COPY LINK BÀI VIẾT
========================================================= */

const btnCopy =
document.getElementById(
"btnCopy"
);

if(btnCopy){

    btnCopy.addEventListener(
    "click",
    async () => {

        try{

            await navigator
            .clipboard
            .writeText(
            window.location.href
            );

            const noiDungGoc =
            btnCopy.innerHTML;

            btnCopy.innerHTML =
            "✅ Đã sao chép";

            setTimeout(
            () => {

                btnCopy.innerHTML =
                noiDungGoc;

            },
            2000
            );

        }

        catch(error){

            console.error(
            "Lỗi sao chép:",
            error
            );

            alert(
            "Không thể sao chép liên kết."
            );

        }

    }
    );

}

/* =========================================================
CHIA SẺ BÀI VIẾT
========================================================= */

const btnShare =
document.getElementById(
"btnShare"
);

if(btnShare){

    btnShare.addEventListener(
    "click",
    async () => {

        const duLieuChiaSe = {

            title:
            document.title,

            text:
            "Mời bạn đọc bài viết này",

            url:
            window.location.href

        };

        try{

            if(
                navigator.share
            ){

                await navigator.share(
                duLieuChiaSe
                );

            }

            else{

                await navigator
                .clipboard
                .writeText(
                window.location.href
                );

                alert(
                "Đã sao chép liên kết bài viết."
                );

            }

        }

        catch(error){

            console.log(
            "Đã hủy chia sẻ"
            );

        }

    }
    );

}

