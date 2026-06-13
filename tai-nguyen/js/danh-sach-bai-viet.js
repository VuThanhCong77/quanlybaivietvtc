let danhSachGoc = [];
let danhSachDangHienThi = [];

/* =====================================================
   TAI DU LIEU JSON
===================================================== */

async function taiBaiViet(){

    try{

        const res = await fetch(
        "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
        );

        const data =
        await res.json();

        const chuyenMuc =
        document.body.dataset.category;

        if(chuyenMuc){

            danhSachGoc =

            data.filter(
            bv =>

                bv.category &&

                bv.category.some(
                category =>

                    category.toLowerCase() ===
                    chuyenMuc.toLowerCase()

                )

            );

        }else{

            danhSachGoc = data;

        }

        danhSachDangHienThi =
        [...danhSachGoc];

        capNhatGiaoDien(
        danhSachDangHienThi
        );

    }

    catch(err){

        console.log(
        "Loi tai du lieu:",
        err
        );

    }

}

/* =====================================================
   HIEN THI DANH SACH
===================================================== */

function capNhatGiaoDien(data){

    const tongSo =
    document.getElementById(
    "tongSo"
    );

    if(tongSo){

        tongSo.innerText =
        data.length;

    }

    const box =
    document.getElementById(
    "danhSach"
    );

    if(!box) return;

    box.innerHTML =

    data.map(
    bv => `

        <div class="bai-viet-item">

            <img
            src="${bv.image}"
            alt="${bv.title}">

            <div class="bai-viet-noi-dung">

                <div class="bai-viet-tieu-de">
                    ${bv.title}
                </div>

                <div class="bai-viet-mo-ta">
                    ${bv.desc}
                </div>

                <div class="bai-viet-ngay">
                    Ngay dang: ${bv.date}
                </div>

                <a
                class="bai-viet-xem-them"
                href="${bv.url}">

                    Xem chi tiet →

                </a>

            </div>

        </div>

    `

    ).join("");

}

/* =====================================================
   TIM KIEM
===================================================== */

function timKiem(){

    const keyword =

    document
    .getElementById(
    "inputSearch"
    )
    .value
    .toLowerCase()
    .trim();

    const ketQua =

    danhSachGoc.filter(
    bv =>

        bv.title
        .toLowerCase()
        .includes(keyword)

        ||

        bv.desc
        .toLowerCase()
        .includes(keyword)

    );

    danhSachDangHienThi =
    ketQua;

    capNhatGiaoDien(
    ketQua
    );

}

taiBaiViet();