async function taiBaiVietMoiNhat() {

    try {

        const response =
        await fetch(
        "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
        );

        const danhSach =
        await response.json();

        const baiVietMoiNhat =
        [...danhSach]

        .sort((a, b) => {

            const ngayA =
            new Date(
                a.date.split("-")
                .reverse()
                .join("-")
            );

            const ngayB =
            new Date(
                b.date.split("-")
                .reverse()
                .join("-")
            );

            return ngayB - ngayA;

        })

        .slice(0, 6);

        const container =
        document.getElementById(
        "bai-viet-moi-nhat"
        );

        if(!container) return;

        container.innerHTML =
        baiVietMoiNhat.map(
        baiViet => `

        <a
        href="${baiViet.url}"
        class="card-bai-viet">

            <img
            src="${baiViet.image}"
            alt="${baiViet.title}">

            <div class="noi-dung-card">

                <h3>
                ${baiViet.title}
                </h3>

                <p>
                ${baiViet.desc}
                </p>

                <div class="meta">

                    <span>
                    📅 ${baiViet.date}
                    </span>

                    <span>
                    📂 ${baiViet.category[0]}
                    </span>

                </div>

            </div>

        </a>

        `
        ).join("");

    }

    catch(error){

        console.error(
        "Lỗi tải bài viết:",
        error
        );

    }

}
