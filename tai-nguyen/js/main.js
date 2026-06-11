document.addEventListener("DOMContentLoaded", () => {

    const page = document.body.dataset.page;

    if (page === "home") {
        taiBaiVietMoiNhat();
    }

    if (page === "chuyen-muc") {
        taiTatCaBaiViet();
    }

    if (page === "chi-tiet") {
        taiBaiVietLienQuan();
    }

});

async function taiMenu(){

    const response = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/thanh-phan/menu.html");
    const html = await response.text();

    const el = document.getElementById("menu");

    if (!el) return;

    el.innerHTML = html;
}

