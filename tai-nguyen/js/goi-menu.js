async function loadComponent(id, file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(
                "Lỗi tải component: " + file
            );

        }

        const html = await response.text();

        document.getElementById(id)
        .innerHTML = html;

    }catch(error){

        console.log(error);

    }

}

document.addEventListener(
"DOMContentLoaded",
()=>{

    loadComponent(
        "menu",
        "https://vuthanhcong77.github.io/quanlybaivietvtc/thanh-phan/menu.html"
    );

}
);
