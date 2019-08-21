"use strict";

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

    const idx = getIndexPointByPointId(event.target.parentNode.id);
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
    arrayPoints.forEach(function (item){
        if(item.s != null){
            item.s.style.visibility = "hidden";
        }
    })
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
    initScale();
    rescaleSVG();
}


function rescaleSVG(){
    svgmap.setAttribute("width", viewBox.x*scale);
    svgmap.setAttribute("height", viewBox.y*scale);

    arrayPoints.forEach(function (item){
        const strTransform = "translate(" + -item.fX*(1/scale-1) + ", " +  -item.fY*(1/scale-1) + ") scale(" + 1/scale + ")";

        item.p.setAttribute("transform", strTransform);
        if(item.s!=null){
            item.s.setAttribute("transform", strTransform);
        }
    })
}

function initArrayPoints(){
    for (let i = 0; i < 19 ; i++) {
        const point = {};

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
    const viewBoxCoord = svgmap.getAttribute("viewBox").split(" ");

    viewBox.x = parseFloat(viewBoxCoord[2]);
    viewBox.y = parseFloat(viewBoxCoord[3]);
    initScale();
}

function initScale(){
    const scrollbox = document.querySelector('.scrollbox');
    scale = scrollbox.clientWidth/viewBox.x;
}


buttonPlus.addEventListener("click", clickOnPlus);
buttonMinus.addEventListener("click", clickOnMinus);
buttonNormal.addEventListener("click", clickOnNormal);
svgmap.addEventListener("click", clickOnMap);

initArrayPoints();
initViewBox();
rescaleSVG();
