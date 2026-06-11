let danhSachBaiViet = [];

async function taiTatCaBaiViet() {

    try {

        const response =
        await fetch(
          "../../du-lieu/bai-viet.json"
        );

        danhSachBaiViet =
        await response.json();

        const container =
        document.getElementById(
        "bai-viet-container"
        );

        if(!container) return;

        const danhSachSapXep =
        [...danhSachBaiViet]

.sort((a, b) => {

    const ngayA =
    new Date(
        a.date
        .split("-")
        .reverse()
        .join("-")
    );

    const ngayB =
    new Date(
        b.date
        .split("-")
        .reverse()
        .join("-")
    );

    return ngayB - ngayA;

});

     danhSachBaiViet =
    danhSachSapXep;

    hienThiTrang();

    capNhatThongKe();

    }

    catch(error){

        console.error(
        "Lỗi tải bài viết:",
        error
        );

    }

}

function capNhatThongKe(){

    const elBaiViet =
    document.getElementById(
    "tong-so-bai-viet"
    );

    const elChuyenMuc =
    document.getElementById(
    "tong-so-chuyen-muc"
    );

    const elLuotDoc =
    document.getElementById(
    "tong-luot-doc"
    );

    if(
        !elBaiViet ||
        !elChuyenMuc ||
        !elLuotDoc
    ){
        return;
    }

    const tongBaiViet =
    danhSachBaiViet.length;

    const tongChuyenMuc =

    new Set(

        danhSachBaiViet.flatMap(
        baiViet =>
        baiViet.category || []
        )

    ).size;

    const tongLuotDoc =

    danhSachBaiViet.reduce(

        (tong, baiViet) =>

        tong +
        (baiViet.views || 0),

        0

    );

    elBaiViet.textContent =
    tongBaiViet;

    elChuyenMuc.textContent =
    tongChuyenMuc;

    elLuotDoc.textContent =
    tongLuotDoc.toLocaleString(
    "vi-VN"
    );

}

function hienThiBaiViet(ds){

    const container =
    document.getElementById(
    "bai-viet-container"
    );

    if(!container) return;

    container.innerHTML =

    ds.map(
    baiViet => `

    <a
    href="${baiViet.url}"
    class="card-bai-viet">

        <img
        src="${baiViet.image}"
        alt="${baiViet.title}">

        <div class="noi-dung-card">

            <h3>
                ${baiViet.title}
            </h3>

            <p>
                ${baiViet.desc}
            </p>

            <div class="meta">

                <span>
                📅 ${baiViet.date}
                </span>

                <span>
                📂 ${baiViet.category[0]}
                </span>

            </div>

        </div>

    </a>

    `

    ).join("");

}
