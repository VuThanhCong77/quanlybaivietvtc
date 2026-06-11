/* =========================================================
BÀI VIẾT NỔI BẬT
========================================================= */

async function taiBaiVietNoiBat(){

    try{

        const response =

        await fetch(
        "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
        );

        const danhSach =

        await response.json();

        const baiNoiBat =

        danhSach

        .filter(
        bai =>
        bai.featured === true
        )

        .slice(0, 6);

        hienThiBaiVietNoiBat(
        baiNoiBat
        );

    }

    catch(error){

        console.error(

        "Loi bai viet noi bat:",

        error

        );

    }

}

function hienThiBaiVietNoiBat(ds){

    const container =

    document.getElementById(
    "featuredPosts"
    );

    if(!container) return;

    container.innerHTML =

    ds.map(
    bai => `

    <a
    href="${bai.url}"
    class="card-bai-viet">

        <img
        src="${bai.image}"
        alt="${bai.title}">

        <div
        class="noi-dung-card">

            <h3>

                ${bai.title}

            </h3>

            <p>

                ${bai.desc}

            </p>

        </div>

    </a>

    `
    )

    .join("");

}

document.addEventListener(

"DOMContentLoaded",

taiBaiVietNoiBat

);
