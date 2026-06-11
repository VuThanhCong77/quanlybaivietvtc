let danhSachGoc = [];

async function taiBaiViet(){

    try{

        const res = await fetch("./du-lieu/bai-viet.json");
        const data = await res.json();

        danhSachGoc = data;

        hienThiNoiBat();

    }catch(err){
        console.log("LOI JSON:", err);
    }

}

function hienThiNoiBat(){

    const baiNoiBat = danhSachGoc
        .filter(bv => bv.featured === true)
        .slice(0, 6);

    console.log("NOI BAT:", baiNoiBat); // 👈 debug quan trọng

    const box = document.getElementById("noiBatList");

    if(!box){
        console.log("KHONG TIM THAY noiBatList");
        return;
    }

    box.innerHTML = baiNoiBat.map(bv => `

        <div class="bai-viet-item">

            <img src="${bv.image}" alt="${bv.title}">

            <div class="bai-viet-noi-dung">

                <div class="bai-viet-tieu-de">${bv.title}</div>

                <div class="bai-viet-mo-ta">${bv.desc}</div>

                <div class="bai-viet-ngay">${bv.date}</div>

                <a class="bai-viet-xem-them" href="${bv.url}">
                    Xem chi tiet →
                </a>

            </div>

        </div>

    `).join("");

}

taiBaiViet();