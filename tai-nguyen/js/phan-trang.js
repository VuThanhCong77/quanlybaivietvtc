let trangHienTai = 1;

const soBaiMoiTrang = 8;

function hienThiTrang() {

    const batDau =

    (trangHienTai - 1)
    * soBaiMoiTrang;

    const ketThuc =

    batDau
    + soBaiMoiTrang;

    const baiVietTrang =

    danhSachBaiViet.slice(
    batDau,
    ketThuc
    );

    hienThiBaiViet(
    baiVietTrang
    );

    capNhatPhanTrang();

}

function capNhatPhanTrang(){

    const tongTrang =

    Math.ceil(
    danhSachBaiViet.length
    / soBaiMoiTrang
    );

const thongTinTrang =
document.getElementById(
"thong-tin-trang"
);

if(thongTinTrang){

    thongTinTrang.textContent =
    `Trang ${trangHienTai} / ${tongTrang}`;

}

}

function trangTruoc(){

    if(
        trangHienTai > 1
    ){

        trangHienTai--;

        hienThiTrang();

    }

}

function trangSau(){

    const tongTrang =

    Math.ceil(
    danhSachBaiViet.length
    / soBaiMoiTrang
    );

    if(
        trangHienTai <
        tongTrang
    ){

        trangHienTai++;

        hienThiTrang();

    }

}

function khoiTaoPhanTrang(){

    const nutTruoc =
    document.getElementById(
    "nut-truoc"
    );

    const nutSau =
    document.getElementById(
    "nut-sau"
    );

    if(nutTruoc){

        nutTruoc.addEventListener(
        "click",
        trangTruoc
        );

    }

    if(nutSau){

        nutSau.addEventListener(
        "click",
        trangSau
        );

    }

}

