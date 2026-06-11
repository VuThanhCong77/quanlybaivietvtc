document.addEventListener("DOMContentLoaded", async function () {

    const res = await fetch("https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/chuyen-mon.json");
    const data = await res.json();

    // Lọc theo Kiểm tra
    const danhSach = data.filter(item =>
        item.category && item.category.includes("Kiểm tra")
    );

    if (danhSach.length === 0) return;

    const box = document.querySelector(".o-chuyen-muc.hanh-phuc");

    // BÀI NỔI BẬT
    const top = danhSach[0];

    const linkTop = box.querySelector(".bai-noi-bat");
    const imgTop = box.querySelector("img");
    const titleTop = box.querySelector(".overlay h3");

    linkTop.href = top.url;
    imgTop.src = top.image;
    imgTop.alt = top.title;
    titleTop.textContent = top.title;

    // DANH SÁCH BÊN DƯỚI (chỉ title + url)
    const ul = box.querySelector(".ds-kiem-tra");
    ul.innerHTML = "";

    danhSach.slice(1).forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${item.url}">${item.title}</a>`;
        ul.appendChild(li);
    });

});
