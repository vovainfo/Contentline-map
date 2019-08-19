const svgmap = document.querySelector('#svgmap');
const buttonPlus = document.querySelector('#button-plus');
const buttonMinus = document.querySelector('#button-minus');
const arrayPoints = [];
const viewBox = {x: 0, y: 0};

let scale = 1;

function clickOnMap(event){
    console.log(event);
    hideS();
    if(!event.target.classList.contains("point-of-interest"))
        return; //щёлкнули куда попало, но не по кругляшку магазина
    let idx = getIndexPointByPointId(event.path[1].id);
    if(idx===-1) // так не должно быть. но вдруг?
        return;
    if(arrayPoints[idx].s == null){ // нет доп информации по точке
        alert("А вот тут сэкономили и информацию не подготовили");
        return;
    }
    arrayPoints[idx].s.style.visibility = "visible";
}


function hideS(){
    for (let i = 0; i < arrayPoints.length; i++) {
        if(arrayPoints[i].s != null){
            arrayPoints[i].s.style.visibility = "hidden";
        }
    }
}

function clickOnPlus(){
    scale *= 1.5;
    rescaleSVG();
}

function clickOnMinus(){
    scale /=  1.5;
    rescaleSVG();
}

function rescaleSVG(){
    console.log(`translate(${-arrayPoints[0].fX*(scale-1)}, ${-arrayPoints[0].fY*(scale-1)}) scale(${scale})`);
    //svgmap.setAttribute("transform", `scale(${scale})`);
    //svgmap.setAttribute("viewBox", `0 0 ${viewBox.x/scale} ${viewBox.y/scale}`);
    svgmap.setAttribute("width", `${viewBox.x*scale}`);
    svgmap.setAttribute("height", `${viewBox.y*scale}`);
    for (let i = 0; i < arrayPoints.length; i++) {
        arrayPoints[i].p.setAttribute("transform", `translate(${-arrayPoints[i].fX*(1/scale-1)}, ${-arrayPoints[i].fY*(1/scale-1)}) scale(${1/scale})`);
        if(arrayPoints[i].s!=null){
            arrayPoints[i].s.setAttribute("transform", `translate(${-arrayPoints[i].fX*(1/scale-1)}, ${-arrayPoints[i].fY*(1/scale-1)}) scale(${1/scale})`);
        }
    }

}

function initArrayPoints(){
    for (let i = 0; i < 19 ; i++) {
        let point = {};
        point.p = svgmap.querySelector(`#p_x5F_${i+1}`);
        point.s = svgmap.querySelector(`#s_x5F_${i+1}`);
        point.x = point.p.querySelector('circle').getAttribute("cx");
        point.y = point.p.querySelector('circle').getAttribute("cy");
        point.fX = parseFloat(point.x);
        point.fY = parseFloat(point.y);
        arrayPoints.push(point);
    }
}


function getIndexPointByPointId(pointID){
    console.log(pointID);
    for (let i = 0; i < arrayPoints.length; i++) {
        console.log(`-- ${i} - ${arrayPoints[i].p.id}`);
        if(arrayPoints[i].p.id === pointID)
            return i;
    }
    console.log("-----");
    return -1;
}

function initViewBox()
{
    viewBoxCoord = svgmap.getAttribute("viewBox").split(" ");

    viewBox.x = parseFloat(viewBoxCoord[2]);
    viewBox.y= parseFloat(viewBoxCoord[3]);
}


buttonPlus.addEventListener("click", clickOnPlus);
buttonMinus.addEventListener("click", clickOnMinus);

svgmap.addEventListener("click", clickOnMap);

let elements = document.querySelectorAll('.point-of-interest');

for (let elem of elements) {
    elem.addEventListener("mouseover", clickOnMap);
    elem.addEventListener("mouseout", hideS);
    //console.log(elem);
}


initArrayPoints();
initViewBox();
rescaleSVG();
//console.log(arrayPoints);
//hideS();
