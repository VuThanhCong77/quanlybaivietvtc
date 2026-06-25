let danhSachGoc = [];

async function taiBaiViet(){

    try{

        const [resPost, resView] = await Promise.all([

            fetch(
                "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
            ),

            fetch(
                `${VIEW_API}?mode=list`
            )

        ]);

        const data =
            await resPost.json();

        const thongKe =
            await resView.json();

        const viewMap = {};

        thongKe.forEach(item => {

            viewMap[item.postId] =
                Number(item.views || 0);

        });

        danhSachGoc = data.map(bv => ({

            ...bv,

            views:
                viewMap[bv.id] || 0

        }));

        hienThiNoiBat();

    }

    catch(err){

        console.log(
            "LOI JSON:",
            err
        );

    }

}

function hienThiNoiBat(){

    const baiNoiBat = danhSachGoc

        .sort(
            (a, b) =>
            b.views - a.views
        )

        .slice(0, 6);

    const box =
        document.getElementById(
            "noiBatList"
        );

    if(!box) return;

    box.innerHTML = baiNoiBat.map(bv => `

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
                    👁️ ${bv.views.toLocaleString("vi-VN")} lượt xem
                </div>

                <a
                class="bai-viet-xem-them"
                href="${bv.url}">
                    Xem chi tiết →
                </a>

            </div>

        </div>

    `).join("");

}

taiBaiViet();
