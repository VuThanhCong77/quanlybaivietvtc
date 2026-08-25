async function loadLatestNews() {
    const container = document.getElementById("latest-news");

    try {
        const response = await fetch(
            "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
        );

        const data = await response.json();

        // Nếu dữ liệu nằm trong data.posts thì lấy data.posts
        const posts = Array.isArray(data)
            ? data
            : (data.posts || []);

        // Lọc các bài thuộc chuyên mục "Tin tức"
        const newsPosts = posts.filter(post =>
            Array.isArray(post.category) &&
            post.category.some(category =>
                category.toLowerCase() === "tin tức"
            )
        );

        // Chuyển ngày DD-MM-YYYY thành đối tượng Date
        function parseDate(dateString) {
            const [day, month, year] = dateString.split("-");

            return new Date(
                `${year}-${month}-${day}`
            );
        }

        // Sắp xếp từ mới đến cũ
        newsPosts.sort((a, b) =>
            parseDate(b.date) - parseDate(a.date)
        );

        // Lấy 5 tin mới nhất
        const latestNews = newsPosts.slice(0, 5);

        // Hiển thị
        if (latestNews.length === 0) {
            container.innerHTML = "<p>Chưa có tin tức.</p>";
            return;
        }

const latestBox =
    document.getElementById("latest-news-box");

latestBox.innerHTML = latestNews
    .map(post => `
        <a href="${post.url}" class="news-title">
            ${post.title}
        </a>
    `)
    .join("");

    } catch (error) {

        console.error("Lỗi tải tin tức:", error);

        container.innerHTML =
            "<p>Không thể tải tin tức.</p>";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    loadLatestNews
);