/* =========================================================
ĐẾM LƯỢT XEM
========================================================= */

const VIEW_API =
"https://script.google.com/macros/s/AKfycbxi8dkZZjOCRR6IcyVYA2qP0t9ce94UCdeV-xSMrWpqk87ebV-uBfIcTQmjycV_5R4bWw/exec";

const postId =
document.body.dataset.postId;

const viewCount =
document.getElementById(
"viewCount"
);

async function updateViews(){

    if(!postId || !viewCount){
        return;
    }

    try{

        if(

            !sessionStorage.getItem(
            "viewed_" + postId
            )

        ){

            const response =

            await fetch(

            VIEW_API +

            "?action=increment&postId=" +

            encodeURIComponent(
            postId
            )

            );

            const data =
            await response.json();

            viewCount.textContent =
            data.views || 0;

            sessionStorage.setItem(

            "viewed_" + postId,

            "true"

            );

        }

        else{

            const response =

            await fetch(

            VIEW_API +

            "?postId=" +

            encodeURIComponent(
            postId
            )

            );

            const data =
            await response.json();

            viewCount.textContent =
            data.views || 0;

        }

    }

    catch(error){

        console.error(
        "Loi luot xem:",
        error
        );

    }

}

document.addEventListener(

"DOMContentLoaded",

updateViews

);

