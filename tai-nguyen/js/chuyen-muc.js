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

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/van-hoa.html">
Văn hóa
</a>

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/suc-khoe.html">
Sức khỏe
</a>

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/tri-tue.html">
Trí tuệ
</a>

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/hanh-phuc.html">
Hạnh phúc
</a>

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/hoi-ky.html">
Hồi ký
</a>

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/kinh-te.html">
Kinh tế
</a>

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/cong-nghe.html">
Công nghệ
</a>

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/giao-duc.html">
Giáo dục
</a>

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/kiem-tra.html">
Kiểm tra
</a>

<a href="https://vuthanhcong77.github.io/quanlybaivietvtc/bai-viet/the-thao.html">
Thể thao
</a>

</div>
</div>
</nav>
`;

document.getElementById(
    "menu-chuyen-muc"
).innerHTML = html;
