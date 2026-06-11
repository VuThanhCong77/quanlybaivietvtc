/* =========================================================
TĂNG GIẢM CỠ CHỮ
========================================================= */

const noiDung =
document.getElementById(
"readingContent"
);

const nutTang =
document.getElementById(
"fontTang"
);

const nutGiam =
document.getElementById(
"fontGiam"
);

let coChu =
parseFloat(

localStorage.getItem(
"coChuBaiViet"
)

) || 18;

if(noiDung){

    noiDung.style.fontSize =
    coChu + "px";

}

if(nutTang){

    nutTang.addEventListener(
    "click",
    () => {

        if(coChu < 30){

            coChu += 2;

            noiDung.style.fontSize =
            coChu + "px";

            localStorage.setItem(
            "coChuBaiViet",
            coChu
            );

        }

    }
    );

}

if(nutGiam){

    nutGiam.addEventListener(
    "click",
    () => {

        if(coChu > 14){

            coChu -= 2;

            noiDung.style.fontSize =
            coChu + "px";

            localStorage.setItem(
            "coChuBaiViet",
            coChu
            );

        }

    }
    );

}