// firebase-messaging-sw.js


importScripts(

"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"

);



importScripts(

"https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"

);



firebase.initializeApp({

apiKey:
"AIzaSyCvzI0JvNuR5bNaHDT7_oP-5-n72ve4fuU",


authDomain:
"vuthanhcong-e7ef8.firebaseapp.com",


projectId:
"vuthanhcong-e7ef8",


storageBucket:
"vuthanhcong-e7ef8.firebasestorage.app",


messagingSenderId:
"206106498648",


appId:
"1:206106498648:web:90b3edaaa015bc60439c2d"


});





const messaging =
firebase.messaging();





messaging.onBackgroundMessage(

function(payload){



console.log(

"Background:",
payload

);



self.registration.showNotification(

payload.notification.title,


{

body:
payload.notification.body,


icon:
"https://vuthanhcong77.github.io/quanlybaivietvtc/tai-nguyen/icons/CK.png"


}

);



}

);
