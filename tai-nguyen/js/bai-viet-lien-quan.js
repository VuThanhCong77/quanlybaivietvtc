/* =========================================================
BÀI VIẾT LIÊN QUAN
========================================================= */

async function taiBaiVietLienQuan(){

    try{

        const response =
        await fetch(
        "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
        );

        const danhSach =
        await response.json();

        const currentId =

        document.body.dataset.postId;

        if(!currentId) return;

        const baiHienTai =

        danhSach.find(
        bai =>
        bai.id === currentId
        );

        if(!baiHienTai) return;

        const baiLienQuan =

        danhSach

        .filter(
        bai =>

        bai.id !== currentId &&

        bai.category.some(
        category =>

        baiHienTai.category.includes(
        category
        )

        )
        )

        .slice(0,6);

        hienThiBaiLienQuan(
        baiLienQuan
        );

    }

    catch(error){

        console.error(
        "Lỗi bài viết liên quan:",
        error
        );

    }

}

function hienThiBaiLienQuan(ds){

    const container =

    document.getElementById(
    "relatedPosts"
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
