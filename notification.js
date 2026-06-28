import {
    messaging,
    db
}
from "https://vuthanhcong77.github.io/quanlybaivietvtc/firebase-config.js";

import {

doc,
setDoc,
serverTimestamp

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// ===========================
// CẤU HÌNH
// ===========================

const vapidKey = "BIUs3ELW2tcEm8It0mD0OGrL1ChD5sBimbDXy3NDIkyUxYthLpxG8A2OD_ROaBUotCjURabPU94o07w47RjPwC4";

// ===========================
// LƯU TOKEN
// ===========================

async function luuToken(token){

    await setDoc(

        doc(db,"tokens",token),

        {

            token:token,

            updated:serverTimestamp(),

            userAgent:navigator.userAgent

        }

    );

    console.log("Đã lưu Firestore");

}

// ===========================
// CẬP NHẬT GIAO DIỆN
// ===========================

function capNhatTrangThai(permission) {

    const btn = document.getElementById("btnSubscribe");

    if (!btn) return;

    switch (permission) {

        case "granted":
            btn.innerHTML = "✅ Đang nhận thông báo";
            btn.classList.add("subscribed");
            break;

        case "denied":
            btn.innerHTML = "🚫 Đã chặn thông báo";
            btn.classList.add("blocked");
            break;

        default:
            btn.innerHTML = "🔔 Theo dõi bài viết mới";
    }

}

// ===========================
// ĐĂNG KÝ
// ===========================

async function dangKyThongBao(){

    console.log("=== Bắt đầu đăng ký ===");

    console.log("Permission:", Notification.permission);
    
    try{

        if(Notification.permission==="denied"){

            alert(
`Bạn đã chặn thông báo.

Để bật lại:

Chrome
→ Biểu tượng ổ khóa cạnh địa chỉ
→ Site settings
→ Notifications
→ Allow`
            );

            capNhatTrangThai("denied");

            return;

        }

        if(Notification.permission==="default"){

            const permission=

            await Notification.requestPermission();

            if(permission!=="granted"){

                capNhatTrangThai(permission);

                return;

            }

        }

        const registration=

        await navigator.serviceWorker.register(

            "/quanlybaivietvtc/firebase-messaging-sw.js"
           );

         console.log("Service Worker OK");
        
        const token=

        await getToken(

            messaging,

            {

                vapidKey,

                serviceWorkerRegistration:registration

            }

        );
        
        console.log("TOKEN:", token);
        
        if(!token){

            alert("Không lấy được FCM Token.");

            return;

        }

        console.log("FCM TOKEN:",token);
        
        console.log("Chuẩn bị gửi token lên Apps Script");
        
        await luuToken(token);

        console.log("Đã vào guiToken()");

        capNhatTrangThai("granted");

        alert("Đăng ký nhận thông báo thành công.");

    }

    catch(error){

        console.error(error);

    }

}

// ===========================
// NHẬN PUSH KHI ĐANG MỞ WEB
// ===========================

onMessage(

    messaging,

    (payload)=>{

        console.log(payload);

        if(Notification.permission==="granted"){

            new Notification(

                payload.notification.title,

                {

                    body:payload.notification.body,

                    icon:payload.notification.icon

                }

            );

        }

    }

);

// ===========================
// KHỞI TẠO
// ===========================

window.addEventListener("load",()=>{

    capNhatTrangThai(Notification.permission);

    const timer=setInterval(()=>{

        const btn=document.getElementById("btnSubscribe");

        if(btn){

  	btn.addEventListener("click", dangKyThongBao);

         clearInterval(timer);

        }

    },200);

});
