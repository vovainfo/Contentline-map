"use strict";

const svgmap = document.querySelector('#svgmap');
const buttonPlus = document.querySelector('#button-plus');
const buttonMinus = document.querySelector('#button-minus');
const buttonNormal = document.querySelector('#button-normal');
const arrayPoints = [];
const viewBox = {x: 0, y: 0};
const nPoint = 22;

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
    for (let i = 0; i < nPoint ; i++) {
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

function addPoint(x,y,index){
    const strPoint = `
                <linearGradient gradientTransform="matrix(1 0 0 -1 0 1095.89)" gradientUnits="userSpaceOnUse" id="mySVGID_${index}_1" x1="${x-13.2}" x2="${x+13.2}" y1="100" y2="100">
                    <stop offset="0" style="stop-color:#B3916D"></stop>
                    <stop offset="0.23" style="stop-color:#A07D6E"></stop>
                    <stop offset="0.68" style="stop-color:#6F4A6F"></stop>
                    <stop offset="1" style="stop-color:#4A2370"></stop>
                </linearGradient>
                <circle class="point-of-interest" cx="${x}" cy="${y}" r="13.2" fill="url(#mySVGID_${index}_1)"></circle>
                <circle class="point-of-interest st5" cx="${x}" cy="${y}" r="12.2"></circle>
                <linearGradient gradientTransform="matrix(1 0 0 -1 0 1095.89)" gradientUnits="userSpaceOnUse" id="mySVGID_${index}_2" x1="${x-9.8}" x2="${x+9.8}" y1="100" y2="100">
                    <stop offset="0" style="stop-color:#B3916D"></stop>
                    <stop offset="0.23" style="stop-color:#A07D6E"></stop>
                    <stop offset="0.68" style="stop-color:#6F4A6F"></stop>
                    <stop offset="1" style="stop-color:#4A2370"></stop>
                </linearGradient>
                <circle class="point-of-interest" cx="${x}" cy="${y}" r="9.8" fill="url(#mySVGID_${index}_2)"></circle>`;

    const point = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    point.id = `p_x5F_${index}`;
    point.innerHTML = strPoint;

    document.querySelector('#points').appendChild(point);
}

const strInfoTag = `
        <g>
            <rect x="${x+29.7}" y="${y-265.6}" opacity="0.76" fill="#FFFFFF" width="358.6" height="156.7"></rect>
            <text transform="matrix(1 0 0 1 ${x+63} ${y-142.2})" font-family="'MyriadPro-Regular',sans-serif" font-size="26px" >
                Улица уличная 24/7, str. 1
            </text>
            <image style="overflow:visible" width="282" height="47" xlink:href="./img/C8705B9C.png" transform="matrix(1.1057 0 0 1.1057 ${x+52} ${y-234.3})"></image>
            <linearGradient id="smySVGID_${index}_3" gradientUnits="userSpaceOnUse" x1="${x+59.26}" y1="${y-175.75}" x2="${x+355.3}" y2="${y-175.75}">
                <stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
            </linearGradient>
            <line fill="none" stroke="url(#smySVGID_${index}_3)" stroke-width="5" stroke-miterlimit="10" x1="${x+59.26}" y1="${y-175.75}" x2="${x+355.3}" y2="${y-175.75}"></line>
        </g>
`;


function addS(x,y,index, infoTag){
const strS=`
        <g>
            <linearGradient id="smySVGID_${index}_1" gradientUnits="userSpaceOnUse" x1="${x-46.12}" y1="100" x2="${x+43.49}" y2="100">
                <stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
            </linearGradient>
            <path fill-rule="evenodd" clip-rule="evenodd" fill="url(#smySVGID_${index}_1)" d="M${x+43.5},${y-65.9}c0,24.7-44.8,69.8-44.8,69.8s-44.8-45.1-44.8-69.8c0-24.7,20.1-44.8,44.8-44.8C${x+23.4},${y-110.7},${x+43.5},${y-90.6},${x+43.5},${y-65.9}z"></path>
            <circle fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" cx="${x-1.3}" cy="${y-65.9}" r="32.2"></circle>
                <circle fill-rule="evenodd" clip-rule="evenodd" fill="#481F72" cx="${x-1.3}" cy="${y-65.9}" r="27.2"></circle>
                <g>
                    <defs>
                        <circle id="smySVGID_${index}_4" cx="${x-1.3}" cy="${y-65.9}" r="27.2"></circle>
                    </defs>
                    <clipPath id="smySVGID_${index}_2">
                        <use xlink:href="#smySVGID_${index}_4" style="overflow:visible"></use>
                    </clipPath>
                    <g style="clip-path:url(#smySVGID_${index}_2)">
                    <image style="overflow:visible" width="320" height="320" xlink:href="./img/S320x320.jpg" transform="matrix(0.1562 0 0 0.1562 ${x-26.4} ${y-91})"></image>
                </g>
            </g>
        </g>` + infoTag;

    const point = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    point.id = `s_x5F_${index}`;
    point.innerHTML = strS;

    document.querySelector('#S').appendChild(point);
}

buttonPlus.addEventListener("click", clickOnPlus);
buttonMinus.addEventListener("click", clickOnMinus);
buttonNormal.addEventListener("click", clickOnNormal);
svgmap.addEventListener("click", clickOnMap);

initViewBox();
addPoint(100,100,20);
addPoint(100,200,21);
addPoint(500,500,22);
addS(100,100,20, strInfoTag);
addS(100,200,21, strInfoTag);
addS(500,500,22, strInfoTag);
initArrayPoints();
rescaleSVG();

