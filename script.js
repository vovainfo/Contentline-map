const svgmap = document.querySelector('#svgmap');
const buttonPlus = document.querySelector('#button-plus');
const buttonMinus = document.querySelector('#button-minus');
const buttonNormal = document.querySelector('#button-normal');
const arrayPoints = [];
const viewBox = {x: 0, y: 0};

let scale = 1;

function clickOnMap(event){
    if(!event.target.classList.contains("point-of-interest"))
         return; //щёлкнули куда попало, но не по кругляшку магазина

    let idx = getIndexPointByPointId(event.target.parentNode.id);
    if(idx===-1) // так не должно быть. но вдруг?
        return;
    if(arrayPoints[idx].s == null){ // нет доп информации по точке
        console.log("А вот тут сэкономили и информацию не подготовили");
        console.log(arrayPoints[idx].p);
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

function clickOnNormal(){
    scale =  1;
    rescaleSVG();
}


function rescaleSVG(){
    svgmap.setAttribute("width", viewBox.x*scale);
    svgmap.setAttribute("height", viewBox.y*scale);

    for (let i = 0; i < arrayPoints.length; i++) {
        arrayPoints[i].p.setAttribute("transform", "translate(" + -arrayPoints[i].fX*(1/scale-1) + ", " +  -arrayPoints[i].fY*(1/scale-1) + ") scale(" + 1/scale + ")");
        if(arrayPoints[i].s!=null){
            arrayPoints[i].s.setAttribute("transform", "translate(" + -arrayPoints[i].fX*(1/scale-1) + ", " +  -arrayPoints[i].fY*(1/scale-1) + ") scale(" + 1/scale + ")");
        }
    }
}

function initArrayPoints(){
    for (let i = 0; i < 19 ; i++) {
        let point = {};

        point.p = svgmap.querySelector("#p_x5F_" + (i+1)); //ссылка на объект "точка"
        point.s = svgmap.querySelector("#s_x5F_" + (i+1)); //ссылка на объект "указатель с буквой S"

        point.x = point.p.querySelector('circle').getAttribute("cx"); //координата X центра точки строкой
        point.y = point.p.querySelector('circle').getAttribute("cy"); //координата Y центра точки строкой
        point.fX = parseFloat(point.x); //координата X центра точки флоатом
        point.fY = parseFloat(point.y); //координата Y центра точки флоатом
        arrayPoints.push(point);
        if(point.s!=null){
            point.s.style.setProperty("pointer-events", "none"); //S не должна экранировать точку
        }
        point.p.addEventListener("mouseover", clickOnMap);
        point.p.addEventListener("mouseout", hideS);

    }
}


function getIndexPointByPointId(pointID){
    for (let i = 0; i < arrayPoints.length; i++) {
        if(arrayPoints[i].p.id === pointID)
            return i;
    }
    return -1;
}

function initViewBox()
{
    let viewBoxCoord = svgmap.getAttribute("viewBox").split(" ");

    viewBox.x = parseFloat(viewBoxCoord[2]);
    viewBox.y= parseFloat(viewBoxCoord[3]);
}


buttonPlus.addEventListener("click", clickOnPlus);
buttonMinus.addEventListener("click", clickOnMinus);
buttonNormal.addEventListener("click", clickOnNormal);
svgmap.addEventListener("click", clickOnMap);

initArrayPoints();
initViewBox();
rescaleSVG();
