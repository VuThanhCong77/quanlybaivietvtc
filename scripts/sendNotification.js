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

const tokens = [];

snapshot.forEach(doc => {
    tokens.push(doc.id);
});

console.log("Số token:", tokens.length);

if (tokens.length === 0) {
    console.log("Không có thiết bị nào đăng ký.");
    process.exit(0);
}

// =========================
// Gửi thông báo
// =========================

const message = {
    notification: {
        title: newest.title,
        body: newest.desc
    },

    data: {
        url: newest.url
    },

    tokens
};

const response = await admin.messaging().sendEachForMulticast(message);

console.log("================================");
console.log("Đã gửi:", response.successCount);
console.log("Lỗi   :", response.failureCount);
console.log("================================");

const message = {
    notification: {
        title: newest.title,
        body: newest.desc,
        image: newest.image
    },

    data: {
        url: newest.url
    },

    tokens
};

data: {
    url: newest.url,
    click_action: newest.url
},

// =========================
// Xóa token lỗi
// =========================

const docs = snapshot.docs;

for (let i = 0; i < response.responses.length; i++) {

    if (!response.responses[i].success) {

        console.log("Xóa token lỗi:", docs[i].id);

        await docs[i].ref.delete();

    }

}

// =========================
// Cập nhật last-post.json
// =========================

fs.writeFileSync(
    "last-post.json",
    JSON.stringify(
        {
            lastId: newest.id
        },
        null,
        2
    )
);

console.log("Đã cập nhật last-post.json");
console.log("Hoàn thành.");
