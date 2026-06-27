import { messaging } from "https://vuthanhcong77.github.io/quanlybaivietvtc/firebase-config.js";

import {
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// ===========================
// CẤU HÌNH
// ===========================

const vapidKey = "BIUs3ELW2tcEm8It0mD0OGrL1ChD5sBimbDXy3NDIkyUxYthLpxG8A2OD_ROaBUotCjURabPU94o07w47RjPwC4";

const API_URL = "https://script.google.com/macros/s/AKfycbz9NsG-hD4sLY2X_wkxwLpIHEhQJoulVfmUKhmd2HNUbz-jW-QY-CLNrTYt2dxOcIXu/exec";

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
// GỬI TOKEN LÊN APPS SCRIPT
// ===========================

async function guiToken(token){

    try{

const response = await fetch(API_URL, {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        token: token,
        time: new Date().toISOString(),
        userAgent: navigator.userAgent
    })

});

        console.log("Status:", response.status);

        console.log(await response.text());

        const text = await response.text();
        console.log("Kết quả:", text);

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

        await guiToken(token);

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
