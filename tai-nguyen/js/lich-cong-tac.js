/* =====================================================
LICH-CONG-TAC.JS
===================================================== */


const API_URL = "https://script.google.com/macros/s/AKfycby3UYBLatxtDhG3Qah1pMhLxPmLD_8Ak_c6kgQHCHRh85b8VbCWX9dRYybdLnuTNUdc6Q/exec";

let role = "view";
let data = [];

const body = document.getElementById("body");
const inpViec = document.getElementById("inpViec");
const inpGio = document.getElementById("inpGio");
const ngayHienTai = document.getElementById("ngayHienTai");
const alertSound = document.getElementById("alertSound");

function escapeHTML(str){
  return str.replace(/[&<>"']/g, function(m){
    return ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;'
    })[m];
  });
}


function toggleLoginBox(){
    loginBox.classList.toggle("hidden");
}

function init(){
   role = "admin";  // hoặc "view" nếu chỉ xem
  }

function render(){
    body.innerHTML = "";
    const now = new Date();
    let coCanhBao = false;

    data.sort((a,b)=> new Date(b.g) - new Date(a.g));

    data.forEach(i=>{
        const tg = new Date(i.g);
        const diff = (tg-now)/3600000;

        let trangThai="Đang chờ", cls="";

        if(diff < 0){
            trangThai = "Đã qua";
            cls = "past";
        }
        else if(diff <= 12){
            trangThai = "⚠️ Sắp diễn ra";
            cls = "urgent";
            coCanhBao = true;
        }

        const thu = tg.toLocaleDateString("vi-VN",{weekday:"long"});

let row = `<tr class="${cls}">
    <td>${thu}</td>
    <td>${tg.toLocaleString("vi-VN")}</td>
    <td>${escapeHTML(i.v)}</td>
    <td>${trangThai}</td>
</tr>`;

        body.innerHTML += row;
    });

    if(coCanhBao && role!=="view"){
        alertSound.play().catch(()=>{});
    }

    
}

function themLich(){
    if(!inpViec.value||!inpGio.value) return alert("Thiếu thông tin");
    data.push({id:Date.now(),v:inpViec.value,g:inpGio.value});
    inpViec.value=""; inpGio.value="";
    render();
}

function sua(id){
    const item = data.find(i=>i.id===id);
    if(!item) return;

    const v = prompt("Sửa nội dung:", item.v);
    if(v===null) return;

    const g = prompt("Sửa thời gian (YYYY-MM-DDTHH:MM):", item.g);
    if(g===null) return;

    item.v = v.trim();
    item.g = g;
    render();
}

function xoa(id){
    if(confirm("Xóa lịch này?")){
        data=data.filter(i=>i.id!==id);
        render();
    }
}

function xuat(){
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)]));
    a.download="backup_lich.json";
    a.click();
}

function nhap(e){
    const r=new FileReader();
    r.onload=ev=>{
        data=JSON.parse(ev.target.result);
        render();
        alert("Phục hồi thành công");
    };
    r.readAsText(e.target.files[0]);
}
function logout(){
    if(confirm("Đăng xuất khỏi hệ thống?")){
        sessionStorage.clear();        // ← DÒNG BẮT BUỘC
        role = "view";                 // ← RESET TRẠNG THÁI
        location.replace(location.href); // ← LOAD SẠCH
    }
}

function hienNgayDayDu(){
    return new Date().toLocaleDateString("vi-VN",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
}

ngayHienTai.innerText=hienNgayDayDu();
document.getElementById("app").classList.remove("hidden");
init();
loadData();

function loadData(){
  fetch(API_URL)
    .then(res => res.json())
    .then(json => {
      data = json || [];
      render();
    })
    .catch(err => {
      alert("Không tải được dữ liệu lịch công tác");
      console.error(err);
    });
}
setInterval(render,60000);



var CAN = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
var CHI = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];

function INT(d){return Math.floor(d);}

function jdFromDate(dd,mm,yy){
  var a=INT((14-mm)/12);
  var y=yy+4800-a;
  var m=mm+12*a-3;
  return dd+INT((153*m+2)/5)+365*y+INT(y/4)-INT(y/100)+INT(y/400)-32045;
}

function getNewMoonDay(k,timeZone){
  var T=k/1236.85;
  var T2=T*T;
  var T3=T2*T;
  var dr=Math.PI/180;
  var Jd1=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3;
  Jd1+=0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*dr);
  var M=359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3;
  var Mpr=306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3;
  var F=21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3;
  var C1=(0.1734-0.000393*T)*Math.sin(M*dr)+0.0021*Math.sin(2*dr*M);
  C1-=0.4068*Math.sin(Mpr*dr)+0.0161*Math.sin(2*dr*Mpr);
  C1-=0.0004*Math.sin(3*dr*Mpr);
  C1+=0.0104*Math.sin(2*dr*F)-0.0051*Math.sin((M+Mpr)*dr);
  C1-=0.0074*Math.sin((M-Mpr)*dr)+0.0004*Math.sin((2*F+M)*dr);
  C1-=0.0004*Math.sin((2*F-M)*dr)-0.0006*Math.sin((2*F+Mpr)*dr);
  C1+=0.0010*Math.sin((2*F-Mpr)*dr)+0.0005*Math.sin((2*Mpr+M)*dr);
  var deltaT = T< -11 ? 0.001+0.000839*T+0.0002261*T2-0.00000845*T3 : -0.000278+0.000265*T+0.000262*T2;
  return INT(Jd1+C1-deltaT+0.5+timeZone/24);
}

function getSunLongitude(jdn,timeZone){
  var T=(jdn-2451545.5-timeZone/24)/36525;
  var T2=T*T;
  var dr=Math.PI/180;
  var M=357.52910+35999.05030*T-0.0001559*T2-0.00000048*T*T2;
  var L0=280.46645+36000.76983*T+0.0003032*T2;
  var DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M);
  DL+=(0.019993-0.000101*T)*Math.sin(2*dr*M)+0.000290*Math.sin(3*dr*M);
  var L=L0+DL;
  L=L*dr;
  L=L-2*Math.PI*(INT(L/(2*Math.PI)));
  return INT(L/Math.PI*6);
}

function getLunarMonth11(yy,timeZone){
  var off=jdFromDate(31,12,yy)-2415021;
  var k=INT(off/29.530588853);
  var nm=getNewMoonDay(k,timeZone);
  var sunLong=getSunLongitude(nm,timeZone);
  if(sunLong>=9) nm=getNewMoonDay(k-1,timeZone);
  return nm;
}

function convertSolar2Lunar(dd,mm,yy,timeZone){
  var dayNumber=jdFromDate(dd,mm,yy);
  var k=INT((dayNumber-2415021)/29.530588853);
  var monthStart=getNewMoonDay(k+1,timeZone);
  if(monthStart>dayNumber) monthStart=getNewMoonDay(k,timeZone);
  var a11=getLunarMonth11(yy,timeZone);
  var b11=a11;
  var lunarYear;
  if(a11>=monthStart){lunarYear=yy;a11=getLunarMonth11(yy-1,timeZone);}
  else{lunarYear=yy+1;b11=getLunarMonth11(yy+1,timeZone);}
  var lunarDay=dayNumber-monthStart+1;
  var diff=INT((monthStart-a11)/29);
  var lunarMonth=diff+11;
  if(lunarMonth>12) lunarMonth-=12;
  if(lunarMonth>=11&&diff<4) lunarYear--;
  var yearCanChi=CAN[(lunarYear+6)%10]+" "+CHI[(lunarYear+8)%12];
  return [lunarDay,lunarMonth,yearCanChi];
}

function updateLichAm(){
  var now=new Date();
  var l=convertSolar2Lunar(now.getDate(),now.getMonth()+1,now.getFullYear(),7);
  document.getElementById("lich-am").innerHTML=
    "Âm lịch: <b>Ngày "+l[0]+" tháng "+l[1]+" năm "+l[2]+"</b>";
}

window.addEventListener("load",updateLichAm);



const menuBtn=document.getElementById("menuBtn");
const navMenu=document.getElementById("navMenu");
const menuOverlay=document.getElementById("menuOverlay");

menuBtn.onclick=()=>{
  navMenu.classList.add("active");
  menuOverlay.classList.add("active");
};
menuOverlay.onclick=()=>{
  navMenu.classList.remove("active");
  menuOverlay.classList.remove("active");
};

document.querySelectorAll(".toggle").forEach(t=>{
  t.onclick=()=>t.parentElement.classList.toggle("open");
});

const currentPage = location.pathname.split("/").pop();

document.querySelectorAll(".header-nav a, .nav-links a")
.forEach(link => {

  const linkPage = link.getAttribute("href");

  if(linkPage === currentPage){
    link.classList.add("active");
  }

});
