// notification.js


import { messaging } 
from "./firebase-config.js";


import {

getToken,
onMessage

}

from 

"https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";




// VAPID KEY

const vapidKey =

"BIUs3ELW2tcEm8It0mD0OGrL1ChD5sBimbDXy3NDIkyUxYthLpxG8A2OD_ROaBUotCjURabPU94o07w47RjPwC";





// Xin quyền thông báo

async function dangKyThongBao(){


try{


const permission =
await Notification.requestPermission();



if(permission !== "granted"){


alert("Bạn chưa cho phép nhận thông báo");


return;


}




// lấy token


const token = await getToken(

messaging,

{

vapidKey:vapidKey

}

);





if(token){


console.log(
"FCM TOKEN:",
token
);



// gửi về Google Sheet


fetch(

"https://script.google.com/macros/s/AKfycbz9NsG-hD4sLY2X_wkxwLpIHEhQJoulVfmUKhmd2HNUbz-jW-QY-CLNrTYt2dxOcIXu/exec",

{


method:"POST",


body:JSON.stringify({

token:token,


time:new Date().toLocaleString()

})


}

);



alert(
"Đã bật nhận thông báo"
);



}



}

catch(error){


console.error(error);


}



}





// Nhận thông báo khi đang mở web


onMessage(

messaging,

(payload)=>{


console.log(
"Tin nhắn:",
payload
);



new Notification(

payload.notification.title,

{

body:
payload.notification.body,

icon:
"https://vuthanhcong77.github.io/quanlybaivietvtc/tai-nguyen/images/logos/logo.png"


}

);



}

);




window.dangKyThongBao =
dangKyThongBao;
