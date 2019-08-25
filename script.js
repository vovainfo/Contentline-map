"use strict";

let scale = 1;
const svgmap = document.querySelector('#svgmap');
const buttonPlus = document.querySelector('#button-plus');
const buttonMinus = document.querySelector('#button-minus');
const buttonNormal = document.querySelector('#button-normal');
const arrayPoints = [];
const viewBox = {x: 0, y: 0};

/**
 * при добавлении новых точек необходимо пополнить массивы arrayInitPoints и templateInfoTag;
 * число записей в них должно быть одинаковым.
 * arrayInitPoints:
 * x,y - координаты точки магазина
 * dx, dy - смещение информационной карточки магазина относительно координат, прописанных в templateInfoTag.
 *          может потребоваться для точной подгонки позиции инфокарточки.
 *
 *  templateInfoTag - массиф функций генерации инфокарточек магазинов. входные параметры:
 *  x, y, dx, dy - тот же смысл, что и у arrayInitPoints
 *  index - порядковый номер магазина (используется для генерации уникальных ID).
 *          дефолтное значение index прописывать не обязательно (index всегда передаётся из кода).
 *          дефолтное значение используется только для наглядной навигации глазами программиста при чтении кода
 *   если значение templateInfoTag[i] = null, то карточка не рисуется,
 *          а в консоль выводится информационное сообщение об отсутствии карточки
 *          если этот вывод в консоль не нужен, то убрать его в функции clickOnMap
 */
const arrayInitPoints = [
    {x: 533.5, y: 704.6, dx: 0, dy: 0},
    {x: 837.7, y: 155.1, dx: 0, dy: 0},
    {x: 333.9, y: 454.6, dx: 0, dy: 0},
    {x: 441.5, y: 989.6, dx: 0, dy: 0},
    {x: 593.5, y: 707.8, dx: 0, dy: 0},
    {x: 484.2, y: 681.9, dx: 0, dy: 0},
    {x: 591.9, y: 720.8, dx: 0, dy: 0},
    {x: 607.4, y: 745.2, dx: 0, dy: 0},
    {x: 592.3, y: 751, dx: 0, dy: 0},
    {x: 628.8, y: 709.9, dx: 0, dy: 0},
    {x: 441.7, y: 678.2, dx: 0, dy: 0},
    {x: 555.5, y: 741.6, dx: 0, dy: 0},
    {x: 571.3, y: 721, dx: 0, dy: 0},
    {x: 510.4, y: 855.1, dx: 0, dy: 0},
    {x: 382.4, y: 613.2, dx: 0, dy: 0},
    {x: 588, y: 637.5, dx: 0, dy: 0},
    {x: 270.4, y: 575.3, dx: 0, dy: 0},
    {x: 637, y: 735.7, dx: 0, dy: 0},
    {x: 541.6, y: 715.6, dx: 0, dy: 0}
];
const nPoint = arrayInitPoints.length;


const templateInfoTag = [
    (x, y, dx, dy, index=0) => `
        <g>
            <rect x="${x+dx+29.7}" y="${y+dy-265.6}" opacity="0.76" fill="#FFFFFF" width="358.6" height="156.7"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+63} ${y+dy-142.2})" font-family="'MyriadPro-Regular',sans-serif" font-size="26px" >
                ул. Мясницкая 24/7, стр. 1
            </text>
            <image style="overflow:visible" width="282" height="47" xlink:href="img\\C8705B9C.png" transform="matrix(1.1057 0 0 1.1057 ${x+dx+52} ${y+dy-234.3})"></image>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+59.26}" y1="${y+dy-175.75}" x2="${x+dx+355.3}" y2="${y+dy-175.75}">
                <stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
            </linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+59.26}" y1="${y+dy-175.75}" x2="${x+dx+355.3}" y2="${y+dy-175.75}"></line>
        </g>`,
    (x, y, dx, dy, index=1) => `
        <g>
            <rect x="${x+dx-417.4}" y="${y+dy-127,5}" opacity="0.76" fill="#FFFFFF"  width="358.6" height="198.5"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx-352.2} ${y+dy+37.6})">
                <tspan x="0" y="0" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">ул. Широкая, д.12Б,</tspan>
                <tspan x="0" y="31.4" font-family="'MyriadPro-Regular',sans-serif" font-size="26px"> ТЦ Фортуна</tspan>
            </text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx-352.2}" y1="100" x2="${x+dx-127.4}" y2="100">
                <stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
            </linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx-352.2}" y1="${y+dy+4.1}" x2="${x+dx-127.3}" y2="${y+dy+4.1}"></line>
            <image style="overflow:visible;" width="900" height="360" xlink:href="img\\C8705B93.jpg" transform="matrix(0.2623 0 0 0.2623 ${x+dx-357.8} ${y+dy-101.8})"></image>
        </g>`,
    (x, y, dx, dy, index=2) => `
        <g>
			<rect x="${x+dx+55.8}" y="${y+dy-201.1}"  opacity="0.76" fill="#FFFFFF" width="328.2" height="198.5"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+92} ${y+dy-86.1})">
                <tspan x="0" y="0" font-family="'MyriadPro-Regular',sans-serif" font-size="26px" >Сущевский Вал 5с11,</tspan>
                <tspan x="0" y="31.4" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">ТК Савёловский корпус</tspan>
                <tspan x="0" y="62.8" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">Спортивный</tspan></text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+83.7}" y1="100" x2="${x+dx+353.7}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10"  x1="${x+dx+83.7}" y1="${y+dy-117.6}" x2="${x+dx+353.7}" y2="${y+dy-117.6}"></line> 
            <image style="overflow:visible;" width="248" height="46" xlink:href="img\\C8705B91.jpg" transform="matrix(1 0 0 1 ${x+dx+94.7} ${y+dy-183.4})"></image>
        </g>`,
    (x, y, dx, dy, index=3) => `
        <g>
			<image style="overflow:visible;" width="386" height="120" xlink:href="img\\C8705BB7.png" transform="matrix(0.6067 0 0 0.6067 ${x+dx+90} ${y+dy-214.2})"></image>
            <rect x="${x+dx+60.2}" y="${y+dy+-232.4}" opacity="0.76" fill="#FFFFFF" width="295.4" height="159.6"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+89.8} ${y+dy-98.6})" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">ул. Шаболовка 25 к.1</text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+90}" y1="100" x2="${x+dx+324.2}" y2="100">
                <stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+90}" y1="${y+dy-130.2}" x2="${x+dx+324.2}" y2="${y+dy-130.2}"></line>
        </g>`,
    (x, y, dx, dy, index=4) => `
        <g>
		    <rect x="${x+dx+48.5}" y="${y+dy-215.9}" opacity="0.76" fill="#FFFFFF" width="295.4" height="166.9"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+78.2} ${y+dy-107.7})">
                <tspan x="0" y="0" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">Чистопрудный</tspan>
                <tspan x="0" y="31.4" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">бульвар, 9</tspan>
            </text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+78.3}" y1="100" x2="${x+dx+312.5}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+78.3}" y1="${y+dy-139.2}" x2="${x+dx+312.5}" y2="${y+dy-139.2}"></line>
            <image style="overflow:visible;" width="154" height="29" xlink:href="img\\C8705BA6.png" transform="matrix(1.5207 0 0 1.5207 ${x+dx+78.3} ${y+dy-196.1})"></image>
        </g>`,
    (x, y, dx, dy, index=5) => `
        <g>
			<rect x="${x+dx+55.7}" y="${y+dy-215.7}" opacity="0.76" fill="#FFFFFF" width="285.6" height="174.5"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+93.6} ${y+dy-81})" font-family="'MyriadPro-Regular',sans-serif" font-size="26px" >ул. Неглинная, д. 9</text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+92.8}" y1="100" x2="${x+dx+302}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+92.8}" y1="${y+dy-109.5}" x2="${x+dx+302}" y2="${x+dx+92.8}"></line>
            <image style="overflow:visible;" width="192" height="91" xlink:href="img\\C8705BA4.png" transform="matrix(0.8605 0 0 0.8605 ${x+dx+114.8} ${y+dy-196.9})"></image>
        </g>`,
    (x, y, dx, dy, index=6) => `
        <g>
			<rect x="${x+dx+54.8}" y="${y+dy-232.7}" opacity="0.76" fill="#FFFFFF" width="285.6" height="174.5"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+92.7} ${y+dy-98.1})" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">ул. Покровка, д. 17</text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+91.9}" y1="100" x2="${x+dx+301.1}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10"  x1="${x+dx+91.9}" y1="${y+dy-129.6}" x2="${x+dx+301.1}" y2="${y+dy-129.6}"></line>
            <image style="overflow:visible;" width="960" height="283" xlink:href="img\\C8705BFA.jpg" transform="matrix(0.2099 0 0 0.2099 ${x+dx+95.7} ${y+dy-193})"></image>
        </g>`,
    (x, y, dx, dy, index=7) => `
        <g>
			<rect x="${x+dx+49.9}" y="${y+dy-209.9}" opacity="0.76" fill="#FFFFFF" width="285.6" height="169.8"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+89.7} ${y+dy-87.6})">
                <tspan x="0" y="0" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">Хохловский пер.,</tspan>
                <tspan x="0" y="31.4" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">д. 7–9, 2</tspan>
            </text>
            <text transform="matrix(1 0 0 1 ${x+dx+92.8} ${y+dy-154.4})">
                <tspan x="0" y="0" font-family="'HelveticaNeueCyr-Bold',sans-serif" font-size="29px" >Mix and Match</tspan>
                <tspan x="47.3" y="25" font-family="'HelveticaNeueCyr-Bold',sans-serif" font-size="29px" >Vintage</tspan>
            </text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+88.8}" y1="100" x2="${x+dx+298.1}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+88.8}" y1="${y+dy-119.2}" x2="${x+dx+298.1}" y2="${y+dy-119.2}"></line>
        </g>`,
    (x, y, dx, dy, index=8) => `
        <g>
			<rect x="${x+dx+48.7}" y="${y+dy+-168.5}" opacity="0.76" fill="#FFFFFF" width="282.3" height="109.8"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+74.5} ${y+dy-84.3})" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">Хохловский пер, д. 3</text>
            <text transform="matrix(1 0 0 1 ${x+dx+68.4} ${y+dy-129.7})" font-family="'HelveticaNeueCyr-Bold',sans-serif" font-size="29px">Legacy Showroom</text>
            <linearGradient id="SI_${index}_1"  gradientUnits="userSpaceOnUse" x1="${x+dx+73.7}" y1="100" x2="${x+dx+306.5}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+73.7}" y1="${y+dy-115.8}" x2="${x+dx+306.5}" y2="${y+dy-115.8}"></line>
        </g>`,
    (x, y, dx, dy, index=9) => `
        <g>
			<rect x="${x+dx+52.2}" y="${y+dy-224.4}" opacity="0.76" fill="#FFFFFF" width="303.8" height="196.9"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+78.2} ${y+dy-77.3})" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">Лялин пер., д. 14, стр. 3</text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+77.3}" y1="100" x2="${x+dx+330.4}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+77.3}" y1="${y+dy-108.8}" x2="${x+dx+330.4}" y2="${y+dy-108.8}"></line>
            <image style="overflow:visible;" width="1034" height="1034" xlink:href="img\\C8705B0B.jpg" transform="matrix(7.413048e-02 0 0 7.413048e-02 ${x+dx+165.8} ${y+dy-196.3})"></image>
        </g>`,
    (x, y, dx, dy, index=10) => `
        <g>
			<rect x="${x+dx+52.8}" y="${y+dy-207.6}" opacity="0.76" fill="#FFFFFF" width="282.3" height="183"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+78.7} ${y+dy-74.3})">
                <tspan x="0" y="0" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">Столешников пер.,</tspan>
                <tspan x="0" y="31.4" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">д. 7/3</tspan>
            </text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+77.8}" y1="100" x2="${x+dx+303.6}" y2="100">
                <stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10"  x1="${x+dx+77.8}" y1="${y+dy-105.8}" x2="${x+dx+303.6}" y2="${y+dy-105.8}"></line>
            <image style="overflow:visible;" width="960" height="960" xlink:href="img\\C8705B09.jpg" transform="matrix(7.984480e-02 0 0 7.984480e-02 ${x+dx+154.3} ${y+dy-193.2})"></image>
        </g>`,
    (x, y, dx, dy, index=11) => `
        <g>
			<rect x="${x+dx+56.1}" y="${y+dy-182.6}" opacity="0.76" fill="#FFFFFF" width="282.3" height="199.5"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+83.3} ${y+dy-77.9})">
                <tspan x="0" y="0" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">Большой </tspan>
                <tspan x="0" y="31.4" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">Златоустинский пер., </tspan>
                <tspan x="0" y="62.8" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">д. 8/7</tspan></text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+82.5}" y1="100" x2="${x+dx+320.5}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+82.5}" y1="${y+dy-109.4}" x2="${x+dx+320.5}" y2="${y+dy+-109.4}"></line>
            <text transform="matrix(1 0 0 1 ${x+dx+75} ${y+dy-122.6})" font-family="'HelveticaNeueCyr-Bold',sans-serif" font-size="35px">Fefёla Vintage</text>
        </g>`,
    (x, y, dx, dy, index=12) => `
        <g>
			<rect x="${x+dx+53.5}" y="${y+dy-185.8}" opacity="0.76" fill="#FFFFFF" width="282.3" height="148.2"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+80.7} ${y+dy-81})" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">ул. Покровка, д. 1</text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+79.7}" y1="100" x2="${x+dx+317.7}" y2="100">
                <stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+79.7}" y1="${y+dy-112.6}" x2="${x+dx+317.7}" y2="${y+dy-112.6}"></line>
            <text transform="matrix(1 0 0 1 ${x+dx+83.3} ${y+dy-131.6})" font-family="'HelveticaNeueCyr-Bold',sans-serif" font-size="35px">Total Vintage</text>
        </g>`,
    (x, y, dx, dy, index=13) => `
        <g>
			<rect x="${x+dx+48.7}" y="${y+dy-165}" opacity="0.76" fill="#FFFFFF" width="282.3" width="289.8" height="148.2"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+64.6} ${y+dy-60.1})" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">ул. Новокузнецкая, д. 1</text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+63.6}" y1="100"  x2="${x+dx+319.6}"  y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+63.6}" y1="${y+dy-91.8}" x2="${x+dx+319.6}" y2="${y+dy-91.8}"></line>
            <text transform="matrix(1 0 0 1 ${x+dx+79} ${y+dy-110.9})" font-family="'HelveticaNeueCyr-Bold',sans-serif" font-size="35px">Charity Shop</text>
        </g>`,
    (x, y, dx, dy, index=14) => `
        <g>
			<rect x="${x+dx+60.7}" y="${y+dy-178.9}" opacity="0.76" fill="#FFFFFF" width="289.8" height="148.2"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+78.6} ${y+dy-75.2})" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">ул. Фадеева, д. 7с1</text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+77.6}" y1="100" x2="${x+dx+333.6}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+77.6}" y1="${y+dy-106.6}" x2="${x+dx+333.6}" y2="${y+dy-106.6}"></line>
            <text transform="matrix(1 0 0 1 ${x+dx+93} ${y+dy-125.7})" font-family="'HelveticaNeueCyr-Bold',sans-serif" font-size="35px">Charity Shop</text>
        </g>`,
    (x, y, dx, dy, index=15) => `
        <g>
			<rect x="${x+dx+49.2}" y="${y+dy-175.7}" opacity="0.76" fill="#FFFFFF" width="289.8" height="151.4"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+67} ${y+dy-76.9})">
                <tspan x="0" y="0" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">ул. Садовая-Спасская,</tspan>
                <tspan x="0" y="31.4" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">д. 12/23с2</tspan>
            </text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+66.1}" y1="100" x2="${x+dx+322}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+66.1}" y1="${y+dy-108.5}" x2="${x+dx+322}" y2="${y+dy-108.5}"></line>
            <text transform="matrix(1 0 0 1 ${x+dx+81.4} ${y+dy-127.5})" font-family="'HelveticaNeueCyr-Bold',sans-serif" font-size="35px">Charity Shop</text>
        </g>`,
    (x, y, dx, dy, index=16) => `
        <g>
			<rect x="${x+dx+54.9}" y="${y+dy-183.2}" opacity="0.76" fill="#FFFFFF" width="313.8" height="151.4"></rect>
            <text transform="matrix(1 0 0 1 ${x+dx+72.6} ${y+dy-84.3})">
                <tspan x="0" y="0" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">1-й Боткинский проезд,</tspan>
                <tspan x="0" y="31.4" font-family="'MyriadPro-Regular',sans-serif" font-size="26px">д. 7с1</tspan>
            </text>
            <linearGradient id="SI_${index}_1" gradientUnits="userSpaceOnUse" x1="${x+dx+71.8}" y1="100" x2="${x+dx+342.4}" y2="100">
				<stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
			</linearGradient>
            <line fill="none" stroke="url(#SI_${index}_1)" stroke-width="5" stroke-miterlimit="10" x1="${x+dx+71.8}" y1="${y+dy-115.9}" x2="${x+dx+342.4}" y2="${y+dy-115.9}"></line>
            <text transform="matrix(1 0 0 1 ${x+dx+104.1} ${y+dy-134.9})" font-family="'HelveticaNeueCyr-Bold',sans-serif" font-size="35px">Charity Shop</text>
        </g>`,
    null,
    null
];



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

        point.p = svgmap.querySelector("#p_x5F_" + i); //ссылка на объект "точка"
        point.s = svgmap.querySelector("#s_x5F_" + i); //ссылка на объект "указатель с буквой S"

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
                <circle class="point-of-interest" fill="#FFFFFF" cx="${x}" cy="${y}" r="12.2"></circle>
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

    return point;
}



function addS(x,y, dx, dy, index){
    if(templateInfoTag[index]===null) // для данной точки нет описания
        return null;
    const strS=`
        <g>
            <linearGradient id="S_${index}_1" gradientUnits="userSpaceOnUse" x1="${x-46.12}" y1="100" x2="${x+43.49}" y2="100">
                <stop offset="0" style="stop-color:#B3916D"></stop>
                <stop offset="0.2253" style="stop-color:#A07D6E"></stop>
                <stop offset="0.6836" style="stop-color:#6F4A6F"></stop>
                <stop offset="1" style="stop-color:#4A2370"></stop>
            </linearGradient>
            <path fill-rule="evenodd" clip-rule="evenodd" fill="url(#S_${index}_1)" d="M${x+43.5},${y-65.9}c0,24.7-44.8,69.8-44.8,69.8s-44.8-45.1-44.8-69.8c0-24.7,20.1-44.8,44.8-44.8C${x+23.4},${y-110.7},${x+43.5},${y-90.6},${x+43.5},${y-65.9}z"></path>
            <circle fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" cx="${x-1.3}" cy="${y-65.9}" r="32.2"></circle>
                <circle fill-rule="evenodd" clip-rule="evenodd" fill="#481F72" cx="${x-1.3}" cy="${y-65.9}" r="27.2"></circle>
                <g>
                    <defs>
                        <circle id="S_${index}_3" cx="${x-1.3}" cy="${y-65.9}" r="27.2"></circle>
                    </defs>
                    <clipPath id="S_${index}_2">
                        <use xlink:href="#S_${index}_3" style="overflow:visible"></use>
                    </clipPath>
                    <g style="clip-path:url(#S_${index}_2)">
                    <image style="overflow:visible" width="320" height="320" xlink:href="./img/S320x320.jpg" transform="matrix(0.1562 0 0 0.1562 ${x-26.4} ${y-91})"></image>
                </g>
            </g>
        </g>` + templateInfoTag[index](x,y, dx, dy, index);

    const point = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    point.id = `s_x5F_${index}`;
    point.innerHTML = strS;

    return point;
}

function drawPointsOnMap(){
    const fragmentPoint = new DocumentFragment();
    const fragmentS = new DocumentFragment();

    for(let i=0; i<nPoint; i++) {
        fragmentPoint.append(addPoint(arrayInitPoints[i].x,arrayInitPoints[i].y,i));
        const S =  addS(arrayInitPoints[i].x, arrayInitPoints[i].y, arrayInitPoints[i].dx, arrayInitPoints[i].dy, i);
        if(S!=null){
            fragmentS.append(S);
        }
    }
    document.querySelector('#S').append(fragmentS);
    document.querySelector('#points').append(fragmentPoint);
}


buttonPlus.addEventListener("click", clickOnPlus);
buttonMinus.addEventListener("click", clickOnMinus);
buttonNormal.addEventListener("click", clickOnNormal);
svgmap.addEventListener("click", clickOnMap);

initViewBox();
drawPointsOnMap();
initArrayPoints();
rescaleSVG();

