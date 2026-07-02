let heroIndex = 0;
let heroTimer;

async function taiBannerMoiNhat() {

    try {

        const response = await fetch(
            "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
        );

        const danhSach = await response.json();

        const baiMoi = [...danhSach]

        .sort((a,b)=>{

            const ngayA = new Date(a.date.split("-").reverse().join("-"));
            const ngayB = new Date(b.date.split("-").reverse().join("-"));

            return ngayB-ngayA;

        })

        .slice(0,5);

        const slides = document.getElementById("hero-slides");

        slides.innerHTML = baiMoi.map(bai=>`

            <a class="hero-slide"
               href="${bai.url}">

                <img
                    src="${bai.image}"
                    alt="${bai.title}">

                <div class="hero-caption">

                    <h2>${bai.title}</h2>

                </div>

            </a>

        `).join("");

        const allSlides = document.querySelectorAll(".hero-slide");

        function hienSlide(i){

            allSlides.forEach(s=>s.classList.remove("active"));

            allSlides[i].classList.add("active");

        }

        hienSlide(0);

        heroTimer = setInterval(()=>{

            heroIndex++;

            if(heroIndex>=allSlides.length){

                heroIndex=0;

            }

            hienSlide(heroIndex);

        },5000);

        document.getElementById("hero-next").onclick=()=>{

            heroIndex++;

            if(heroIndex>=allSlides.length){

                heroIndex=0;

            }

            hienSlide(heroIndex);

        };

        document.getElementById("hero-prev").onclick=()=>{

            heroIndex--;

            if(heroIndex<0){

                heroIndex=allSlides.length-1;

            }

            hienSlide(heroIndex);

        };

    }

    catch(error){

        console.error(error);

    }

}

taiBannerMoiNhat();