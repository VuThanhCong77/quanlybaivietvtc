/* =====================================
   ONLINE.JS
===================================== */

const ONLINE_API =
"https://script.google.com/macros/s/AKfycbwX1QX8GHhhpj5rPaescYalPprrAq5XioNiCy77oSWmNrvwQHe2QemRHj148xFvJzSo/exec";

/* visitor id */

let visitorId =
localStorage.getItem(
  "visitorId"
);

if(!visitorId){

  visitorId =
  crypto.randomUUID();

  localStorage.setItem(
    "visitorId",
    visitorId
  );

}

/* nhận dữ liệu */

function hienThiThongKe(data){

  const online =
  document.getElementById("online");

  const totalViews =
  document.getElementById("totalViews");

  const todayViews =
  document.getElementById("todayViews");

  const weekViews =
  document.getElementById("weekViews");

  const topPage =
  document.getElementById("topPage");

  if(online)
    online.textContent =
    data.online;

  if(totalViews)
    totalViews.textContent =
    data.totalViews;

  if(todayViews)
    todayViews.textContent =
    data.todayViews;

  if(weekViews)
    weekViews.textContent =
    data.weekViews;

  if(topPage)
    topPage.textContent =
    data.topPage;

}

/* gọi JSONP */

function capNhatThongKe(){

  const oldScript =
  document.getElementById(
    "online-script"
  );

  if(oldScript){

    oldScript.remove();

  }

  const script =
  document.createElement(
    "script"
  );

  script.id =
  "online-script";

  script.src =

    ONLINE_API +

    "?page=index&id=" +

    visitorId +

    "&callback=hienThiThongKe&_=" +

    Date.now();

  document.body
  .appendChild(script);

}

document.addEventListener(
  "DOMContentLoaded",
  ()=>{

    capNhatThongKe();

    setInterval(
      capNhatThongKe,
      60000
    );

  }
);