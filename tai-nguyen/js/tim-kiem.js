/* =========================================================
TÌM KIẾM BÀI VIẾT
========================================================= */

function timKiemBaiViet() {

    const oTimKiem =
    document.getElementById(
    "oTimKiem"
    );

    if (!oTimKiem) return;

    const tuKhoa =

    oTimKiem.value
    .toLowerCase()
    .trim();

    if (tuKhoa === "") {

        hienThiBaiViet(
        danhSachBaiViet
        );

        return;

    }

    const ketQua =

    danhSachBaiViet.filter(
    baiViet => {

        const noiDung =

        `
        ${baiViet.title}
        ${baiViet.desc}
        ${baiViet.date}
        ${baiViet.category.join(" ")}
        `
        .toLowerCase();

        return noiDung.includes(
        tuKhoa
        );

    });

    hienThiBaiViet(
    ketQua
    );

}


/* =========================================================
KHỞI TẠO TÌM KIẾM
========================================================= */

function khoiTaoTimKiem() {

    const oTimKiem =
    document.getElementById(
    "oTimKiem"
    );

    if (!oTimKiem) return;

    oTimKiem.addEventListener(
    "input",
    timKiemBaiViet
    );

}