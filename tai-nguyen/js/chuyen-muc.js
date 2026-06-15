const chuyenMuc = [
    {
        ten: "Tất cả",
        link: "https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/danh-sach-bai-viet.html"
    },
    {
        ten: "Tin tức",
        link: "https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/tin-tuc.html"
    }
];

let html = `
<nav class="chuyen-muc">
`;

const trangHienTai =
    location.pathname.split("/").pop();

chuyenMuc.forEach(item => {

    const active =
        trangHienTai === item.link
        ? "active"
        : "";

    html += `
        <a
            href="${item.link}"
            class="${active}"
        >
            ${item.ten}
        </a>
    `;
});

html += `
<div class="dropdown">

<button class="dropdown-btn">
☰ Chuyên mục
</button>

<div class="dropdown-menu">

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/chinh-tri.html">
Chính trị
</a>

<a href="van-hoa.html">
Văn hóa
</a>

<a href="suc-khoe.html">
Sức khỏe
</a>

<a href="tri-tue.html">
Trí tuệ
</a>

<a href="hanh-phuc.html">
Hạnh phúc
</a>

<a href="hoi-ky.html">
Hồi ký
</a>

<a href="kinh-te.html">
Kinh tế (Đang cập nhật)
</a>

<a href="phap-luat.html">
Pháp luật (Đang cập nhật)
</a>

<a href="du-lich.html">
Du lịch (Đang cập nhật)
</a>

<a href="the-thao.html">
Thể thao (Đang cập nhật)
</a>

</div>
</div>
</nav>
`;

document.getElementById(
    "menu-chuyen-muc"
).innerHTML = html;