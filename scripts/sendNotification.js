import admin from "firebase-admin";
import fs from "fs";

// =========================
// Khởi tạo Firebase Admin
// =========================

const serviceAccount = JSON.parse(
    fs.readFileSync("serviceAccount.json", "utf8")
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// =========================
// Đọc bài viết mới nhất
// =========================

const posts = JSON.parse(
    fs.readFileSync("du-lieu/bai-viet.json", "utf8")
);

if (!posts.length) {
    console.log("Không có bài viết.");
    process.exit(0);
}

const newest = posts[0];

console.log("==========");
console.log("Bài mới:");
console.log(newest.title);
console.log(newest.url);
console.log("==========");

// =========================
// Đọc last-post.json
// =========================

const last = JSON.parse(
    fs.readFileSync("last-post.json", "utf8")
);

console.log("Last ID:", last.lastId);
console.log("Newest :", newest.id);

if (last.lastId === newest.id) {

    console.log("Đã gửi trước đó.");

    process.exit(0);

}

// =========================
// Lấy token Firestore
// =========================

const snapshot = await db.collection("tokens").get();

console.log("Số token:", snapshot.size);

snapshot.forEach(doc => {

    console.log(doc.id);

});

console.log("Kiểm tra thành công.");