/* =========================================================
THÍCH BÀI VIẾT / TRANG
========================================================= */

const LIKE_API =
"https://script.google.com/macros/s/AKfycbxjfwu2JFjKwji5SPaPk8ZPxkL5p3kuzdEWyUazHr9DDBTpT3rbqpTs4ddUcbiYwB_2/exec";

const likeBtn =
document.getElementById(
"likeBtn"
);

const likeCount =
document.getElementById(
"likeCount"
);

/* =========================================================
LẤY ID TRANG
========================================================= */

const pageId =

document.body.dataset.postId

||

"index";

/* =========================================================
TẢI SỐ LƯỢT THÍCH
========================================================= */

function loadLike(){

    if(!likeCount) return;

    fetch(

    LIKE_API +

    "?action=get&page=" +

    encodeURIComponent(
    pageId
    )

    )

    .then(
    response =>
    response.text()
    )

    .then(data => {

        likeCount.textContent =
        data;

    })

    .catch(error => {

        console.error(
        "Loi tai like:",
        error
        );

    });

}

/* =========================================================
THÍCH
========================================================= */

function xuLyLike(){

    const key =

    "liked_" + pageId;

    if(

        localStorage.getItem(
        key
        )

    ){

        alert(
        "Bạn đã đồng tình trước đó."
        );

        return;

    }

    fetch(

    LIKE_API +

    "?action=like&page=" +

    encodeURIComponent(
    pageId
    )

    )

    .then(
    response =>
    response.text()
    )

    .then(data => {

        likeCount.textContent =
        data;

        localStorage.setItem(
        key,
        "true"
        );

    })

    .catch(error => {

        console.error(
        "Loi gui like:",
        error
        );

    });

}

/* =========================================================
KHỞI TẠO
========================================================= */

document.addEventListener(

"DOMContentLoaded",

() => {

    loadLike();

    if(likeBtn){

        likeBtn
        .addEventListener(
        "click",
        xuLyLike
        );

    }

}

);