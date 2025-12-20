/**
 * SCRIPT SINH FILE CHIA SẺ FACEBOOK TỰ ĐỘNG
 * Tác giả: sử dụng nội bộ
 */

const fs = require("fs");
const path = require("path");

// ===== CẤU HÌNH =====
const BASE_URL = "https://vuthanhcong77.github.io/quanlybaivietvtc/";
const POSTS_FILE = "posts_data.json";
const SHARE_DIR = "share";

// ===== TẠO THƯ MỤC SHARE NẾU CHƯA CÓ =====
if (!fs.existsSync(SHARE_DIR)) {
    fs.mkdirSync(SHARE_DIR);
}

// ===== ĐỌC FILE DỮ LIỆU =====
const posts = JSON.parse(fs.readFileSync(POSTS_FILE, "utf8"));

// ===== HÀM TẠO FILE SHARE =====
posts.forEach(post => {
    if (!post.id) return;

    const title = post.title || "Bài viết";
    const description = post.shortDescription || post.title || "";
    let image = BASE_URL + "images/default.jpg";

if (post.thumbnail && !post.thumbnail.startsWith("data:")) {
    image = BASE_URL + post.thumbnail.replace(/^\//, "");
}

    const shareHtml = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>${title}</title>

<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${BASE_URL}share/share-${post.id}.html">
<meta property="og:type" content="article">

<meta http-equiv="refresh" content="0; url=../post.html?id=${post.id}">
</head>
<body>
</body>
</html>`;

    const filePath = path.join(SHARE_DIR, `share-${post.id}.html`);
    fs.writeFileSync(filePath, shareHtml, "utf8");

    console.log(`✔ Đã tạo: ${filePath}`);
});

// ===== HÀM CHỐNG LỖI HTML =====
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

console.log("🎯 Hoàn thành sinh file chia sẻ Facebook.");

