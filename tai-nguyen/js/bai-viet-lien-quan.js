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

    container.innerHTML = ds.map(bai => `

<div class="related-item">

    <a href="${bai.url}" class="related-thumb">
        <img src="${bai.image}" alt="${bai.title}">
    </a>

    <div class="related-content">

        <a href="${bai.url}" class="related-title">
            ${bai.title}
        </a>

        <div class="related-desc">
            ${bai.desc}
        </div>

        <div class="related-footer">

            <span class="related-view">
                👁 ${bai.views || 0} lượt xem
            </span>

            <a href="${bai.url}" class="related-link">
                Xem chi tiết →
            </a>

        </div>

    </div>

</div>

`).join("");

}
