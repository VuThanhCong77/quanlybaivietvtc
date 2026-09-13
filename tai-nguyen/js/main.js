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



async function napThanhTimKiem() {

    const vungTimKiem =
        document.getElementById("thanh-tim-kiem-chung");

    if (!vungTimKiem) return;

    try {

        const response = await fetch(
            "https://vuthanhcong77.github.io/quanlybaivietvtc/thanh-phan/tim-kiem.html"
        );

        if (!response.ok) {
            throw new Error("Không tải được thanh tìm kiếm");
        }

        vungTimKiem.innerHTML =
            await response.text();

        const script =
            document.createElement("script");

        script.src =
            "https://vuthanhcong77.github.io/quanlybaivietvtc/tai-nguyen/js/tim-kiem-chung.js";

        document.body.appendChild(script);

    } catch (error) {

        console.error(
            "Lỗi tải thanh tìm kiếm:",
            error
        );

    }

}

document.addEventListener(
    "DOMContentLoaded",
    napThanhTimKiem
);

