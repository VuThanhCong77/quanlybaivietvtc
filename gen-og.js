/**
 * gen-og.js
 * ----------------------------------------------------
 * Sinh file HTML OG cho từng bài viết
 * Phục vụ chia sẻ Facebook / Zalo / Messenger
 * ----------------------------------------------------
 */

const fs = require("fs");

// ================== CẤU HÌNH ==================
const BASE_URL = "https://vuthanhcong77.github.io/quanlybaivietvtc";
const POSTS_DIR = "posts";
const DATA_FILE = "posts_data.json";

// ================== ĐỌC DỮ LIỆU ==================
const posts = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

// ================== TẠO THƯ MỤC ==================
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR);
}

// ================== LÀM SẠCH MÔ TẢ ==================
function cleanDescription(text = "", maxLength = 200) {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

// ================== DUYỆT BÀI VIẾT ==================
posts.forEach(p => {
  if (!p.id) return;

  /* ===== ẢNH OG ===== */
  let imageUrl = `${BASE_URL}/images/default.png`;
  let imageType = "image/png";

  if (p.thumbnail) {
    if (p.thumbnail.startsWith("http")) {
      imageUrl = p.thumbnail;
    } else if (p.thumbnail.startsWith("/")) {
      imageUrl = `${BASE_URL}/${p.thumbnail}`;
    } else {
      imageUrl = `${BASE_URL}/${p.thumbnail}`;
    }

    const lower = imageUrl.toLowerCase();
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
      imageType = "image/jpeg";
    }
  }

  /* ===== MÔ TẢ ===== */
  const description = cleanDescription(
    p.description || p.content || p.title || ""
  );

  /* ===== HTML OG ===== */
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">

<title>${p.title || ""}</title>
<meta name="description" content="${description}">

<meta property="og:type" content="article">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="Vũ Thành Công">

<meta property="og:title" content="${p.title || ""}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:secure_url" content="${imageUrl}">
<meta property="og:image:type" content="${imageType}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${BASE_URL}/posts/${p.id}.html">

<!-- Redirect CHUẨN cho bot -->
<meta http-equiv="refresh" content="0; url=../post.html?id=${p.id}">
</head>
<body></body>
</html>`;

  fs.writeFileSync(`${POSTS_DIR}/${p.id}.html`, html, "utf8");
});

console.log("✅ Đã tạo xong file OG cho Facebook / Zalo");
