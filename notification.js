import { messaging } from "https://vuthanhcong77.github.io/quanlybaivietvtc6/firebase-config.js";

import {

    getToken,
    onMessage

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const vapidKey = "BIUs3ELW2tcEm8It0mD0OGrL1ChD5sBimbDXy3NDIkyUxYthLpxG8A2OD_ROaBUotCjURabPU94o07w47RjPwC";

async function dangKyThongBao() {

    try {

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {

            alert("Bạn chưa cho phép nhận thông báo.");

            return;

        }

        const token = await getToken(messaging, {

            vapidKey

        });

        if (!token) {

            alert("Không lấy được Token.");

            return;

        }

        console.log("FCM TOKEN:", token);

        alert("Đăng ký nhận thông báo thành công!");

    }

    catch (err) {

        console.error(err);

    }

}

onMessage(messaging, (payload) => {

    console.log(payload);

    if (Notification.permission === "granted") {

        new Notification(

            payload.notification.title,

            {

                body: payload.notification.body,

                icon: payload.notification.icon

            }

        );

    }

});

window.dangKyThongBao = dangKyThongBao;
