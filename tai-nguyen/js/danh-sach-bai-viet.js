let danhSachGoc = [];

/* =====================================================
   TAI DU LIEU JSON
===================================================== */

async function taiBaiViet(){

    try{

        const res = await fetch("../du-lieu/bai-viet.json");
        const data = await res.json();

        danhSachGoc = data;

        capNhatGiaoDien(data);

    }catch(err){
        console.log("Loi tai du lieu:", err);
    }

}

/* =====================================================
   HIEN THI DANH SACH
===================================================== */

function capNhatGiaoDien(data){

    document.getElementById("tongSo").innerText = data.length;

    const box = document.getElementById("danhSach");

    box.innerHTML = data.map(bv => `

        <div class="bai-viet-item">

            <img src="${bv.image}" alt="${bv.title}">

            <div class="bai-viet-noi-dung">

                <div class="bai-viet-tieu-de">${bv.title}</div>
                <div class="bai-viet-mo-ta">${bv.desc}</div>
                <div class="bai-viet-ngay">Ngay dang: ${bv.date}</div>

<a class="bai-viet-xem-them" href="${bv.url}">
    Xem chi tiet →
</a>

            </div>

        </div>

    `).join("");

}

/* =====================================================
   TIM KIEM
===================================================== */

function timKiem(){

    const keyword = document.getElementById("inputSearch").value.toLowerCase();

    const ketQua = danhSachGoc.filter(bv =>
        bv.title.toLowerCase().includes(keyword) ||
        bv.desc.toLowerCase().includes(keyword)
    );

    capNhatGiaoDien(ketQua);

}

taiBaiViet();
