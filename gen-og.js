/**
 * gen-og.js
 * ----------------------------------------------------
 * Chức năng:
 * - Tự động sinh các file HTML đại diện (OG) cho từng bài viết
 * - Phục vụ chia sẻ Zalo / Facebook / Messenger
 *
 * Nguyên tắc:
 * - Mỗi bài = 1 file /posts/{id}.html
 * - File chỉ chứa thẻ OG + redirect về trang bài viết chung
 * - Ảnh OG chỉ có 2 loại: PNG / JPG
 *
 * Yêu cầu:
 * - File posts_data.json tồn tại, là mảng các bài viết
 * - Mỗi bài tối thiểu có: id, title
 * ----------------------------------------------------
 */

const fs = require("fs");

// ================== CẤU HÌNH CHUNG ==================
const BASE_URL = "https://vuthanhcong77.github.io/quanlybaivietvtc";
const POSTS_DIR = "posts";
const DATA_FILE = "posts_data.json";

// ================== ĐỌC DỮ LIỆU ==================
const posts = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

// ================== TẠO THƯ MỤC POSTS ==================
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR);
}

// ================== HÀM LÀM SẠCH MÔ TẢ ==================
function cleanDescription(text = "", maxLength = 200) {
  return text
    .replace(/<[^>]*>/g, "")      // bỏ HTML
    .replace(/\s+/g, " ")         // chuẩn hóa khoảng trắng
    .trim()
    .slice(0, maxLength);
}

// ================== DUYỆT TỪNG BÀI ==================
posts.forEach(p => {
  if (!p.id) return;

  /* ========= XỬ LÝ ẢNH OG ========= */
  let imageUrl = `${BASE_URL}/images/default.png`;
  let imageType = "image/png";

  if (p.thumbnail) {
    // Nếu thumbnail là URL đầy đủ
    if (p.thumbnail.startsWith("http")) {
      imageUrl = p.thumbnail;
    }
    // Nếu thumbnail dạng images/xxx.png
    else if (p.thumbnail.startsWith("images/")) {
      imageUrl = `${BASE_URL}/${p.thumbnail}`;
    }
    // Nếu chỉ là tên file: xxx.png | xxx.jpg
    else {
      imageUrl = `${BASE_URL}/images/${p.thumbnail}`;
    }

    // Xác định MIME type theo đuôi file
    const lower = imageUrl.toLowerCase();
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
      imageType = "image/jpeg";
    } else if (lower.endsWith(".png")) {
      imageType = "image/png";
    }
  }

  /* ========= XỬ LÝ MÔ TẢ ========= */
  const description = cleanDescription(
    p.description || p.content || ""
  );

  /* ========= TẠO HTML OG ========= */
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">

<meta property="og:type" content="article">
<meta property="og:title" content="${p.title || ""}">
<meta property="og:description" content="${description}">

<meta property="og:image" content="${imageUrl}">
<meta property="og:image:secure_url" content="${imageUrl}">
<meta property="og:image:type" content="${imageType}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<meta property="og:url" content="${BASE_URL}/posts/${p.id}.html">

<script>
  // Redirect người dùng thật về trang bài viết chung
  location.replace("../post.html?id=${p.id}");
</script>
</head>
<body></body>
</html>`;

  /* ========= GHI FILE ========= */
  fs.writeFileSync(`${POSTS_DIR}/${p.id}.html`, html, "utf8");
});

// ================== THÔNG BÁO ==================
console.log("✅ Đã sinh xong các file HTML đại diện (OG)");
