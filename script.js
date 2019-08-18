const svgmap = document.querySelector('#svgmap');
const layer_addinfo = document.querySelector('.layer_addinfo');
const arrayS = {};


function clickOnMap(event){
    console.log(event);
    if(!event.target.classList.contains("point_of_interest"))
        return; //щёлкнули куда попало, но не по кругляшку магазина
    let idS = 's'+event.path[1].id.slice(1);
    console.log(arrayS[idS]);
    hideS();
    arrayS[idS].style.visibility = "visible";
}

svgmap.addEventListener("click", clickOnMap);

function initArrayS(){
    for (let i = 1; i <= 17; i++) {
        arrayS[`s_x5F_${i}`] = svgmap.querySelector(`#s_x5F_${i}`);
    }
    console.log(arrayS);
}

function hideS(){
    for (let i = 1; i <= 17; i++) {
        arrayS[`s_x5F_${i}`].style.visibility = "hidden";
    }
}


svgmap.addEventListener("click", clickOnMap);
initArrayS();
hideS();
