const VIEW_API =
"https://script.google.com/macros/s/AKfycbxi8dkZZjOCRR6IcyVYA2qP0t9ce94UCdeV-xSMrWpqk87ebV-uBfIcTQmjycV_5R4bWw/exec";

/* =========================================================
BÀI VIẾT NỔI BẬT
========================================================= */

async function taiBaiVietNoiBat() {

    try {

        const [postsRes, viewsRes] = await Promise.all([

            fetch(
                "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
            ),

            fetch(
                `${VIEW_API}?mode=list`
            )

        ]);

        const danhSach =
            await postsRes.json();

        const thongKe =
            await viewsRes.json();

        /* Tạo bảng tra cứu lượt xem */

        const viewMap = {};

        thongKe.forEach(item => {

            viewMap[item.postId] =
                Number(item.views || 0);

        });

        /* Chỉ lấy bài featured */

        const baiNoiBat = danhSach

            .filter(
            bai => bai.id
            )

            .map(bai => ({

                ...bai,

                views:
                    viewMap[bai.id] || 0

            }))

            .sort(
                (a, b) =>
                b.views - a.views
            )

            .slice(0, 6);

        hienThiBaiVietNoiBat(
            baiNoiBat
        );

    }

    catch (error) {

        console.error(
            "Lỗi tải bài viết nổi bật:",
            error
        );

    }

}

function hienThiBaiVietNoiBat(ds) {

    const container =
        document.getElementById(
            "featuredPosts"
        );

    if (!container) return;

    container.innerHTML = ds.map(bai => `

        <a
        href="${bai.url}"
        class="card-bai-viet">

            <img
            src="${bai.image}"
            alt="${bai.title}">

            <div class="noi-dung-card">

                <h3>
                    ${bai.title}
                </h3>

                <p>
                    ${bai.desc}
                </p>

                <div class="meta-bai-viet">
                    👁️ ${bai.views.toLocaleString("vi-VN")}
                </div>

            </div>

        </a>

    `).join("");

}

document.addEventListener(
    "DOMContentLoaded",
    taiBaiVietNoiBat
);