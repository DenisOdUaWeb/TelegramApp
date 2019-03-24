//стартуем график не с 0 а с первого значения
//Глюки канвас при двигании может - превент дефаул и пропаганда или убрать логи или толще линию, или меньше переменных создавать в циклах
//пересчет маштаба значений графиков по набольшему значению тех графиков, которые находяться на сцене в данный момент
//заменить все style.width на offsetWidth (offsetLeft)
//нет оказывается offsetWidth (offsetLeft) старые методы и лучше их не использовать
//выкидывает изза кеша может (найти как чистить) или меньше переменных создавать в циклах (можно при заполнении кэша отпустить кнопку принудительно и очистить кеш)
//отменить работу второго пальца (не обязательно вконце)
//функция дроу лайн должна быть одна и вызываться в цикле взависимости от количества линий 
//XSTEP вычисляеться в 2х фун -ях подряд еще и в событиях (не забыть что там в массиве есть лишний элемент Х и от длинны отнять 1)
//сделать все как библиотеку - вызываем функцию или скрипт и вносим параметры
//плавное появление - через таймер и увеличение параметров и прозрачности
//разная шырина рисунков от неточности расчета startIndx и lastIndx = чем больше кнопка тем точнее рисунок не выходит за рамки канваса чтоли, если сделать чтобы выходил или последнюю точку ставить на край
//функция плавного пересчета для мягкого перехода от значения к значению чтобы не создавать километровый массив ,,,!!!????
//можно создать объект с настройками как в библиотеке вверху и пользоваться ими или програмно менять их если надо
//перед большим циклом поставть заставку (сделать видимый прелоадер) после окончания цикла (жирного тормоза) мы прячем прелоадер
//правильные ли значения выводят даты совпадают ли они с верхним рисунком
//по многу раз вытаскиваем одни и теже данные ($id(...) в разных фу-ях, нужно просто инициализировать их вначале потом просто брать их значения.нужно как в классе проинициализировать свойства затем работать с ними в методах.

//ИЗНАЧАЛЬНАЯ ШИРИНА КВАДРАТА ДЛЖНА БЫТЬ ЕЕ МИНИМАЛЬНОЙ ЕСЛИ ДЕЛАТЬ УЖЕ ЛЕТИТ ГДЕТО ПРИ СТАРТЕ ЕСТЬ ЗАЦЕПКА
// square.offsetLeft и square.style.left это разные вещи кажеться все дело в бордере
//ТОРМОЗИТ ПРИ БОЛЬШОМ КВАДРАТЕ МОЖНО ПОПЫТАТЬСЯ УМЕНЬШИТЬ КАДРЫ ДЛЯ БОЛЬШОГО КВАДРАТА НЕ 100 u 200  А 200 и 300 только на больших через переменную

//смещение Канвасов может быть изза Length - 1 забыл может отнять гдето ДЕЛАТЬ КАНВАСЫ ЧУТЬ ШИРЕ НЕ ВЛЯЗЯТ ЗНАЧЕНИЯ ПОСЛЕДНИИ ,МОЖНО ИЗМЕНИТЬ ПОСЛЕДНИЕ ЗНАЧЕНИЯ ПО Х  НА Х=МАХ.Х или канвВидтх ЧТОБЫ ВЛЕЗЛИ !!!
//ПРОБЛЕМА КОГДА ОТПУСКАЕШЬ ПАЛЕЦ ВЫЗЫВАЕТЬСЯ ПЕРЕРИСОВКА XLя И ЗАТЕРАЕТЬСЯ ЛИНИЯ НУЖНО ВЫЗЫВАТЬ ПЕРЕРЕСОВКУ КОГДА ПАЛЕЦ ПОКИНУЛ МАЛЫЙ КАНВАС ПО ВЫСОТЕ И УБЕРАТЬ ОБРАБОТЧИКИ ТОГДА МОЖНО БУДЕТ ПОВЕСИТЬ МОУСЕАП НА МАЛЫЙ КАНВАС НЕПОСРЕДСТВЕННО (ОНМОУСЕЛИВЭ !!! свой или,)
//CLIET X OR PAGE X ???

//СВАЙП ??? что это за событие
window.onload = function() {
	
//init

function $id(id){
	var elById = document.getElementById(id);
	return elById;
}
var body = $id("body");	
//console.log(body.style.padding);
body.style.padding = "0px";/// CSS
body.style.margin = "0px";/// может оверфлоу ДОБАВИТЬ хиден

var ratio = window.devicePixelRatio || 1;
var screenW = document.body.offsetWidth;//screen.width * ratio; //screen.width * ratio; document.clientWidth

//устанавливаем ширину родителя малого канваса 92 % от экрана, большого 92%
$id("canvas_s_wrapper").style.width = Math.floor(screenW * 0.92) +"px";
$id("canvas_xl_wrapper").style.width = Math.floor(screenW * 0.92) +"px";

//var cw = $id("canvas_s_wrapper").width;
//console.log($id("canvas_s_wrapper").style.width);
//устанавливаем ширину малого канваса 92 % от экрана, большого 92%
$id("canvas_s").setAttribute('width', Math.floor(screenW * 0.92));
$id("canvas_xl").setAttribute('width', Math.floor(screenW * 0.92));
//console.log($id("canvas_s").width);
var canvasSWidth = $id("canvas_s").width; // лучше задать значения
var canvasSHeight = $id("canvas_s").height; // лучше задать значения

var canvasXlWidth = $id("canvas_xl").width; /// // лучше задать значения
var canvasXlHeight = $id("canvas_xl").height; ///
//alert(canvasXlHeight);

var chosenChart = 4;
var chosenLinesArr = [1,2];// ,3,4 // 0 не допустимо это даты !!! тоесть массив с идексами от 1 до лэнх но не обязательно подряд 1, 3 или 2, 4 
var datesWidthRatio = 0.167; //ширина 1й даты 16,% от экрана 167
var minWidthOfSquare = 150;
var startIndx = 0;
var lastIndx = 0;
//Get JSON FILE
var jsonFileUrl = "chart_data.json";
var objWithAllData;

//halfglobal
var canvasXl = $id('canvas_xl');
var canvasS = $id('canvas_s');
var flag = $id('flag');
var square = document.getElementById('square');
var int =0;// interval
var int2 = 0;//interval











//controller

// getJsonFile();
var getJsonFile = function(fileUrl){
	var req = new XMLHttpRequest();
	req.overrideMimeType("application/json");
	req.open("GET", fileUrl, false); //?async or not?
	req.send(); // with null or not?
	if (req.readyState === 4 && req.status == "200") {
		return req.responseText;
	}
}

//parsing in obj
function parseObjFromJson(){
	var allDataAsJson = getJsonFile(jsonFileUrl);
	var chartsDataAsObj = JSON.parse(allDataAsJson);
	return chartsDataAsObj;
}

objWithAllData = parseObjFromJson(); //ПОСТАВИТЬ ГДЕТО ВНАЧАЛО ?

//get short dates____as____feb 10_НАДО ВЫЗЫВАТЬ ВВЕРХУ ТОРОМОЗИТ
function getShortDatesFromChart(chartIndex){
	var chartsDataAsObj = objWithAllData;
	var dates = chartsDataAsObj[chartIndex].columns[0];
	var shortDates = [];
	var i, len;
	var options = {
			month: 'short',
			day: 'numeric'
		};
	for (i = 1, len = dates.length; i < len; i++){
		var date = new Date(dates[i]);
		date = date.toLocaleString("en-US", options)
		shortDates.push(date);
	}
	//console.log(shortDates, shortDates.length);
	return shortDates;
}
//getShortDatesFromChart(chosenChart);


//get values of chart _____23, 2125, 325656...________
function getValuesFromChart(chartIndex){
	var chartsDataAsObj = objWithAllData;
	var values = chartsDataAsObj[chartIndex];
	return values;
}

//UTILS functions
//color getting
function getCollor(chartIndex, lineColorKey){
	var chartsDataAsObj = objWithAllData;
	var color = chartsDataAsObj[chartIndex].colors[lineColorKey];
	return color;
}
//Find biggest value MAYBE I DON`T NEED IT AT ALL
// function findBiggestValue(arr){
// 	var biggestOne;
// 	biggestOne = Math.max(arr);
// 	return biggestOne;
// }

//Values converter - returns new array for rendering in canvas
function valuesConverter(arr, canvMax, biggestValueInArr, xl){
	var newArr = [];
	//console.log(arr[0]);
	if (typeof arr[0] === "string"){
		arr.shift(0); // becouse 0 index is NaN
	}
	//arr.shift(0);
	//console.log(arr);
	// if (!xl){
	// 	var biggestValueInArr = Math.max.apply(null, arr);
	// 	var big = biggestValueInArr;

	// }else{
	// 	var big = biggestValueInArr;
	// }
	var big = biggestValueInArr;
	//var biggestValueInArr = Math.max.apply(null, arr);
	
	//console.log(biggestValueInArr);
    var len = arr.length;
    var i;
    var newN;
    for (i = 0; i < len; i++) {
    	//console.log(arr[i]);
    	newN = arr[i] * canvMax / big;
    	newN = Math.round(newN);
       newArr.push(newN);
    }
    //console.log(newArr);
    return newArr;
}

 
//TESTs TESTs TESTs TESTs TESTs TESTs TESTs TESTs 























//VIEW VIEW VIEW VIEW VIEW VIEW VIEW

//функция инициализации и создания спинов в блоке с датами, может ее не в view a B init????
	var datesArr = getShortDatesFromChart(chosenChart);
	//console.log(datesArr.length);
	var canv = document.getElementById("canvas_date");
	var canvas_sW = $id("canvas_s").offsetWidth;
	function createDatesCan(chosenChartIndex){
		

		
		var squareW = $id("square").offsetWidth;
		

		var inSquareDatesQuantity = squareW/canvas_sW*datesArr.length;
		//console.log(inSquareDatesQuantity, " inSquareDatesQuantity");
		
		var dateStep = inSquareDatesQuantity*datesWidthRatio;

	  //console.log(dateStep, " dateStep");

	  var datesQuantity = Math.floor(datesArr.length/dateStep);///79 штук
	  //console.log(datesQuantity, " DatesQuantity");

	  var dateW = canvas_sW * datesWidthRatio;
		//console.log(dateW, " dateWx");
	  var realDatesQuantity=0;
	  dateStep = Math.round(dateStep);
		for(i = 0; i < datesArr.length; i+=dateStep){
			// console.log(datesArr[i]);
			// console.log(dateStep);
			if(datesArr[i])realDatesQuantity++;
			
		}
		//console.log(realDatesQuantity, " realDatesQuantity");
		datesQuantity = realDatesQuantity;
		var canvW = datesQuantity * dateW;
		//console.log(canvW, " canvW");

		canv.setAttribute('width', canvW+"");// VREMENNO 16694 VREMENNO 16694
		//console.log(canvW, " canvW");
		var ctx = canv.getContext("2d");
		ctx.fillStyle = "#333";
		//ctx.strokeStyle = "#F00";
		ctx.font = "italic 16px Arial";

		//dateStep = Math.round(dateStep); // UGE SDELAL
		for(i = 0, x = 0; i < datesArr.length; i+=dateStep, x = x + dateW){
			//console.log(i);
			//i = Math.round(i);
			//console.log(i);
			ctx.fillText(' '+datesArr[i], x, 30);

			//x = x + dateW;// ширина одной даты 130,
		}
		// for (i=0; i < datesDivLength; i = i+dateStep){
		// 	$id("span"+i).className ="visible";
		// 	//console.log(squareW);
		// }
		
	}
	createDatesCan(chosenChart); /// ????????????
	setInterval(createDatesCan, 300, chosenChart);// , datesWidthRatio/// ???????????? почему интервал открытый работает ,,,,
	replaceDatesDiv(chosenChart); /// ????????????


	function drowDates(chosenChartIndex, datesWidth){
		var values = getValuesFromChart(chosenChartIndex);
		var valLength = values.columns[0].length-1;
		
		var canvas_sW = $id("canvas_s").offsetWidth;
		var visibleDatesQuantity = squareW/canvas_sW*valLength;
		var dateStep = visibleDatesQuantity*datesWidth;
		dateStep = Math.round(dateStep);
		var datesSpans = $id("dates_div"+chosenChartIndex).childNodes;
		var datesDivLength = datesSpans.length;//вместо этого для ускора можно использовать valLength уже взятую ранее!!!!!
		
		for (i=0; i < datesDivLength; i++){
			$id("span"+i).className = "hidden";

		}
		for (i=0; i < datesDivLength; i = i+dateStep){
			$id("span"+i).className ="visible";
			//console.log(squareW);
		}
	}
	//drowDates(chosenChart, datesWidth);
	//setInterval(createDatesCan, 1000, chosenChart);// , datesWidthRatio


	///////////////////все это вынести в одно место инит
	
	function replaceDatesDiv(chosenChartIndex){
		
		var square = $id("square");
		var canvas_sW = $id("canvas_s").offsetWidth;
		var canvas_date = $id("canvas_date"); //chosenChartIndex
		var ddw = canvas_date.offsetWidth; //datesDivW
		//console.log(ddw, " datesDivW");
		var sol = square.offsetLeft; //squareOffsetLeft
		//console.log(squareOffsetLeft, " squareOffsetLeft");
		
		//console.log(canvas_sW, " canvas_sW");
		var rsl = sol/canvas_sW;// - square.offsetWidth; //ratioSquareLeft
		//console.log(rsl, " ratioSquareLeft");
		canvas_date.style.left = ddw*rsl*-1+'px';
		//console.log(datesDiv.style.left, " datesDiv.offset");1552089600000
		//console.log(canvas_date.style.left);
	}



















	//drowLine -> ОДНА НА ВСЕ КАНВАСЫ -> droVLine с буквой W кажися
	function drovLine(val, context, color, canvasHeight,xl,i,biggestValueInArr){ // убрать из фии создания переменных эта фуя вызываеться в цикле , ЭТИ ДАННЫЕ НУЖНЫ ДЛЯ function getNeededIndexes()
			//indexes of chousen lines
			//var val = values;
			context.strokeStyle = color;

			val = valuesConverter(val, canvasHeight, biggestValueInArr, xl);

			//var i;  ///////////////////////
			var len = val.length;
			//console.log(len,val);
			//alert(len);
			var xStep = canvasSWidth/len;//dolgno but` ne 1000 a can.width

			//console.log("DL xStep", xStep);
			var x = 0;
			if (xl && i==0){
				context.clearRect(0,0,canvasXlWidth,300);// не 300 а CanvasHeight может
			}else if (i==0){
				context.clearRect(0,0,canvasXlWidth,100);
			}
			
			context.beginPath();
			context.moveTo(0,val[0]); /// ,,,??? /? val[0]
			//console.log(xStep, len);
			for(i = 1; i < len; i ++){

				//console.log(val[i], x);
				x = x + xStep;
				context.lineTo(x,val[i]);
			}
			context.stroke();
	}






	function setCanvas_s(chosenChart) {
		var biggestValueInArr = 0;
		var canv = document.getElementById("canvas_s");
		var canvH = canv.height;
		//alert(canv.width);
		canv.style.transform = "scale("+ 1 +','+ -1 +")";
		var context = canv.getContext("2d");
		var values = getValuesFromChart(chosenChart);
		//chosenLinesArr итак массивы c индексами нужных линий и цветов
		var lines = [];
		var colors = [];
		var i;
		var len = chosenLinesArr.length;
		//console.log(len);
		for (i = 0; i < len; i++){
			lines.push(values.columns[chosenLinesArr[i]]);
			colors.push(values.colors["y"+(chosenLinesArr[i]-1)]);
		}
		for(i = 0; i < len; i++){
			if (typeof lines[i][0] === "string"){
			lines[i].shift(0); }// becouse 0 index is NaN
			var bigest = Math.max.apply(null, lines[i]);
			
			if(biggestValueInArr < bigest){biggestValueInArr = bigest;}
			//console.log(biggestValueInArr);
		}
		//console.log(colors);
		for (i = 0; i < len; i++){
			
			drovLine(lines[i], context, colors[i], canvH,0,i, biggestValueInArr);
		}//drovLine(lines[i], context, colors[i], canvH, xl,i,biggestValueInArr);
	}

	setTimeout(setCanvas_s, 500, chosenChart);//peredelat na on load



	//VIEW2 VIEW2 VIEW2 VIEW2 VIEW2 VIEW2 VIEW2

	//////--------------
 
	//var ctxVal = canVal.getContext("2d");
	//var yS = 60;// Y STEP
	//ctxVal.fillStyle = "#333";
	//ctxVal.font = "italic 15px Arial";
	var canVal = $id("canvas_values");
	var divsValArr =[]; 
	for (i = 1; i<=6; i++){
		//ctxVal.fillText(b, 10, y);
		//$id(i+'').innerHTML = b;
		divsValArr.push($id(i+''));
		//b = b - vS;
		//y = y + yS;
		}
		//console.log(divsValArr, " divsValArr");
	function drowValues(b){ //ctxVal, 
		var vS = b / 5;//VALUE STEP
		//ctxVal.clearRect(0,0,100,300);
		//var i,y;
		//divsValArr[i].innerHTML = b;
		for (i = 0; i<=4; i++){
			//ctxVal.fillText(b, 10, y);
			divsValArr[i].innerHTML = b;
			b = Math.round(b - vS);
			//y = y + yS;
		}
	}
	//////--------------


	function setCanvas_xl(chosenChart, startIndx, lastIndx) { //startIndx, lastIndx DONT NEED
		
		var xl = true;
		var biggestValueInArr = 0; ///////////// !!!!!!!!!!!
		var canv = $id("canvas_xl");
		var canvH = canv.height;
		canv.style.transform = "scale("+ 1 +','+ -1 +")";
		var context = canv.getContext("2d");
		var values = getValuesFromChart(chosenChart);
		
		//getNeededIndexes() right here !!!!
		var canvW = canv.width;
		var xStep = canvW / (values.columns[0].length-1);//минус строковый элемент
		//console.log(canvW + " xl canvW");
		//console.log(xStep + " xl xStep");
		//console.log(values.columns[0].length-1  + " xl .length-1");
		var square = $id("square");
		var squareW = square.offsetWidth;
		//console.log(squareW  + " xl squareW");
		var squareOffsetLeft = square.offsetLeft;
		//console.log(squareOffsetLeft  + " xl squareOffsetLeft");
		startIndx = squareOffsetLeft / xStep; //        СОКРАТИТЬ КОД
		startIndx = Math.floor(startIndx);
		//console.log(startIndx + " xl startIndx");
		lastIndx = startIndx + (squareW / xStep); //// !!!!!!!!!!!!
		lastIndx = Math.floor(lastIndx) + 2; //// КАСТЫЛЬ
		//console.log(lastIndx + " xl lastIndx");
		//chosenLinesArr итак массивы c индексами нужных линий и цветов
		var lines = [];
		//var linesCutArr = [];
		var colors = [];
		var i;
		var len = chosenLinesArr.length;
		
		for (i = 0; i < len; i++){
			lines.push(values.columns[chosenLinesArr[i]]);
			//берем нужную часть массива
			lines[i] = lines[i].slice(startIndx, lastIndx);
			colors.push(values.colors["y"+(chosenLinesArr[i]-1)]);
			//console.log(lines[i]);
		}

		for(i = 0; i < len; i++){
			if (typeof lines[i][0] === "string"){
			lines[i].shift(0); }// becouse 0 index is NaN
			var bigest = Math.max.apply(null, lines[i]);
			
			if(biggestValueInArr < bigest){biggestValueInArr = bigest;}
			//console.log(biggestValueInArr);
		}

		for (i = 0; i < len; i++){
			drovLine(lines[i], context, colors[i], canvH, xl,i,biggestValueInArr);
		}
		drowValues(biggestValueInArr);

		// var b = biggestValueInArr;
		// var vS = b / 5;//VALUE STEP

		// ctxVal.clearRect(0,0,100,300);
		
		// for (i = 0, y= 0; i<=5; i++){
		// 	ctxVal.fillText(b, 10, y);
		// 	b = b - vS;
		// 	y = y + yS;
		// }
		//console.log(xStep, 'xStep');
		var indexes = [startIndx, lastIndx, lines, colors];
		//console.log(indexes, 'indexes');
		return indexes;
	}

	setTimeout(setCanvas_xl, 1000,chosenChart, startIndx, lastIndx );//Если добавть параметры то вызываеться вгновенно почемуто можно узнать как запускать таймер с параметрами в ф-ии


	//console.log(lastIndx, 'lastIndx out');

























	//////////////////////////////////////////////
	//DRAG N DROP DRAG N DROP DRAG N DROP DRAG N DROP


	square.onmousedown = function(e) { // ontouchstart
		flag.style.left = -200 +'px'; //ще гдето на кнопках или если будет ф-я перересовки всего туда тоже или только

		var leftDrg=false,rightDrg=false,justMove=false;
		if (e.target.id == "leftDrag")
	  	{
	  		leftDrg = true;
	  	}
	  	else
	  	{
	  		if (e.target.id == "rightDrag")
	  		{
	  			rightDrg = true;
	  		}
	  		else 
	  		{
	  			justMove=true;
	  		}
	  	}

	  var squareW = square.offsetWidth;//нужно изменить 
	  //console.log(squareW, " squareW onmousedown");
	  var squareLeft = square.offsetLeft;// OFFSETLEFT
	  //console.log(squareLeft, " squareLeft onmousedown");
	  var deltaX =  e.pageX - squareLeft; //e.changedTouches[0].pageX 

	  var ePageStart = e.pageX; //e.changedTouches[0].pageX 
	  var squareStartW = squareW;
	  var tupikLeft = squareLeft + squareStartW - minWidthOfSquare;
	  var tupikRight = squareLeft + squareStartW;
	  //var rightBoarder = 0;

	  square.style.zIndex = 100; // 

	  moveAt(e);
	  resizeLeft(e); /// asd
	  resizeRight(e);  //
	  
	  function moveAt(e) {
	    square.style.left =  e.pageX - deltaX + 'px'; //e.changedTouches[0].pageX
	    if (Number(square.style.left.slice(0, - 2)) <= 0){
	    	square.style.left = 0 + 'px';
	    }
	    if (Number(square.style.left.slice(0, - 2)) >= canvasSWidth - squareW){
					square.style.left = canvasSWidth - squareW + 'px';
	    }
	    // if (e.pageY < square.parentNode.offsetTop || e.pageY > square.parentNode.offsetTop+square.offsetHeight || e.pageX < canvasS.parentNode.offsetLeft || e.pageX > canvasS.parentNode.offsetLeft+canvasS.width){
					// var event = new Event("mouseup"); // touchend
					// square.dispatchEvent(event);
	    // }

	    	//input.value =  e.pageX; //e.changedTouches[0].pageX 
	  }
	  function resizeLeft(e){
	  	square.style.left =  e.pageX - deltaX + 'px'; //e.changedTouches[0].pageX
	  	// if (e.pageY < square.parentNode.offsetTop || e.pageY > square.parentNode.offsetTop+square.offsetHeight || e.pageX < canvasS.parentNode.offsetLeft || e.pageX > canvasS.parentNode.offsetLeft+canvasS.width){
				// 	var event = new Event("mouseup"); // touchend
				// 	square.dispatchEvent(event);
	   //  }

	  	if (square.offsetLeft <= 0)
	  	{
	    	square.style.left = 0 + 'px';
	    } 
	    	else 
			{

	    	if(square.offsetLeft >= tupikLeft)
	    		{
	    			square.style.left = tupikLeft + 'px';
	    		}
	    			else
	    				{
	    					square.style.width =  squareStartW + (ePageStart - e.pageX)+ 'px'; //e.changedTouches[0].pageX
	    				}
	    }

	  }
	  function resizeRight(e){
	  	square.style.width =  squareStartW - (ePageStart - e.pageX)+ 'px'; //e.changedTouches[0].pageX
		//console.log("try");
		// if (e.pageY < square.parentNode.offsetTop || e.pageY > square.parentNode.offsetTop+square.offsetHeight || e.pageX < canvasS.parentNode.offsetLeft || e.pageX > canvasS.parentNode.offsetLeft+canvasS.width){
		// 			var event = new Event("mouseup"); // touchend
		// 			square.dispatchEvent(event);
	 	//    }

	  	if (square.offsetWidth+square.offsetLeft < canvasSWidth){
	  		
	  		square.style.width =  squareStartW - (ePageStart - e.pageX)+ 'px'; //e.changedTouches[0].pageX 

	  	}
	  	else{
	  		square.style.width = canvasSWidth - square.offsetLeft+'px';
	  	}

	  	if (square.offsetWidth < minWidthOfSquare){
	  		
	  		square.style.width = minWidthOfSquare+'px'; //
	  	}

	  }

	  document.ontouchmove = function(e) { 
	  	if (leftDrg)
		  	{
		  		 resizeLeft(e);
		  	}
		  	else
		  	{
		  		if (rightDrg)
		  		{
		  			resizeRight(e);
		  		}
		  		else 
		  		{
		  			moveAt(e);
		  		}
		  	}
	    //moveAt(e);
	    if (int == 0)int = setInterval(replaceDatesDiv, 100, chosenChart);
	    if (int2 == 0)int2 = setInterval(setCanvas_xl, 200, chosenChart, startIndx, lastIndx);

	  }
	  document.onmousemove = function(e) { //&&&???? document or canvasS
		  if (leftDrg)
		  	{
		  		 resizeLeft(e);
		  	}
		  	else
		  	{
		  		if (rightDrg)
		  		{
		  			resizeRight(e);
		  		}
		  		else 
		  		{
		  			moveAt(e);
		  		}
		  	}
		
	    if (int == 0)int = setInterval(replaceDatesDiv, 100, chosenChart);
	    if (int2 == 0)int2 = setInterval(setCanvas_xl, 100, chosenChart, startIndx, lastIndx);
	  }
	  document.ontouchend = function() {
	  	setCanvas_xl(chosenChart, startIndx, lastIndx)
	  	clearInterval(int);
	  	clearInterval(int2);
	  	int = 0;
	  	int2 = 0;
	    document.ontouchmove = null;
	    square.ontouchend = null;
	  }
	  canvasS.onmouseup = function() {//&&&???? square or canvasS
	  	setCanvas_xl(chosenChart, startIndx, lastIndx)
	  	clearInterval(int);
	  	clearInterval(int2);
	  	int = 0;
	  	int2 = 0;
	    document.onmousemove = null;
	    square.onmouseup = null;
	  }
	  square.onmouseup = function() {//&&&???? square or canvasS
	  	setCanvas_xl(chosenChart, startIndx, lastIndx)
	  	clearInterval(int);
	  	clearInterval(int2);
	  	int = 0;
	  	int2 = 0;
	    document.onmousemove = null;
	    square.onmouseup = null;
	  }
	}

//////////////////////////////////////////////
//END DRAG N DROP END END END END END END END















	//DRAG 2 N DROP DRAG 2 N DROP 2 DRAG N DROP 2 DRAG N DROP 2
	// var int3 = 0;
	// var EVENT;
	// document.onmousemove = function(e){
	// 	EVENT = e;
	// 	console.log(EVENT);
	// 	//if (int3 == 0)int3 = setInterval(ASDA, 200);
	// 	if (int3 == 0)int3 = setInterval(drowFlag, 200, indxsAndVal, EVENT);
	// }
	// function ASDA(){
	// 	console.log(EVENT.pageX);
	// }
	// console.log(EVENT);

	//var datesArr = getShortDatesFromChart(chosenChart);

	canvasXl.onmousedown = function(e) {  // ontouchstart
		var indxsAndVal = setCanvas_xl(chosenChart, startIndx, lastIndx);//рубо это гэт индексес var indexes = [startIndx, lastIndx, lines, colors];
		var len = indxsAndVal[2][0].length;
		var xsArr=[]; 
		var xStep = canvasSWidth/len;
		var xPageX = 0;
		var z=0;
		var nVArr =[]; //nearValArr
		var diff1;
		var diff2;
		var nearX;
		var indexes=[];
		

		for(i=indxsAndVal[0];i<indxsAndVal[1];i++){
			indexes.push(i);
		}
		//console.log(indexes, ' indexes');


		drowFlag(indxsAndVal, e);
		function drowFlag(indxsAndVal, e){
			//if (!)
			//console.log(indxsAndVal, ' indxsAndVal');
			xPageX = e.pageX - canvasXl.parentNode.offsetLeft;
			for(i=0,x=0;i<len;i++){
				xsArr.push(Math.round(x));
				x+=xStep; //создаем массив Х-ов
			}
			z = Math.floor((xPageX) / xStep);//ближайший меньший индекс массива
			nVArr = [xsArr[z],xsArr[z +1]]; //nearValArr
			diff1 = Math.abs(xPageX - nVArr[0]);
			diff2 = Math.abs(xPageX - nVArr[1]);
			//nearX = (diff1 < diff2) ? nVArr[0] : nVArr[1];
			if (diff1 < diff2){nearX=nVArr[0]}else{nearX=nVArr[1];z=z+1;}
			//щем ближайшее значение по разнице по модулю
			
			var flagV = " ";
			for(i=0; i < indxsAndVal[2].length ;i++){
				flagV += '<span style=\"color:'+indxsAndVal[3][i]+'\">'+indxsAndVal[2][i][z]+'</span></br>';
				//console.log(flagV, ' flagV');
				// '<span style=\"color:'+indxsAndVal[3][i]+'\">'+indxsAndVal[2][i][z]+'</span></br>';
			}
			
			var cx = canvasXl.getContext("2d");
			cx.beginPath();
			cx.moveTo(nearX, canvasXl.offsetHeight);
			cx.lineTo(nearX,0);
			cx.stroke();



			flag.style.left = nearX-20 +'px';
			flag.innerHTML=datesArr[indexes[z]]+'</br>' + flagV;
			//cx.font = "italic 14px Arial";
			//cx.setTransform(1,0,0,-1,0,0);
			//cx.fillText("italic 16px Arial", nearX, canvasXl.offsetHeight-50);
		}
		document.onmousemove = function(e) {
			//EVENT = e;
			setCanvas_xl(chosenChart, startIndx, lastIndx);
			drowFlag(indxsAndVal, e);
			// if (int3 == 0)int3 = setInterval(drowFlag, 200, indxsAndVal, EVENT);
			//console.log(e, "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
		}
		document.onmouseup = function(e) { //&&&???? canvasXL or document!!!!
	  	setCanvas_xl(chosenChart, startIndx, lastIndx)
	  	drowFlag(indxsAndVal, e);

	  	//clearInterval(int3);
	  	 
	  	//int3 = 0;
	    document.onmousemove = null;
	    document.onmouseup = null; //&&&???? canvasXL or document!!!!


	   

	  }

	}

	//GLOBAL on helf
	var body = $id('body');
	body.onmouseup = function(e){ // ontouchend
		if (e.pageY < square.parentNode.offsetTop || e.pageY > square.parentNode.offsetTop+square.offsetHeight || e.pageX < canvasS.parentNode.offsetLeft || e.pageX > canvasS.parentNode.offsetLeft+canvasS.width){
					var event = new Event("mouseup"); // touchend
					
					square.dispatchEvent(event);
	    }
	}
	// ontouchstart
	///////////////////////////////////////////// 2222222222222222
	//END DRAG N DROP 2 END END 2 END END END END END 222222222



	/// CHosing CHART
	var chartsButtonP =  $id('charts_button_parrent');
	var chooseChatrBtn = $id("choose_chatr_btn");

	chooseChatrBtn.onclick = function(e){
		console.log(e.target.innerHTML);
		chartsButtonP.style.left = 0+'px';
		flag.style.left = -200 +'px';
	}
	chartsButtonP.onclick = function(e){
		
			flag.style.left = -200 +'px';

			switch (e.target.id) {
			case 'chart1':
				chosenChart = 0;
			break;
			case 'chart2':
				chosenChart = 1;
				break;
			case 'chart3':
				chosenChart = 2;
				break;
			case 'chart4':
				chosenChart = 3;
				break;
				case 'chart5':
				chosenChart = 4;
				break;
			default:
				//chosenChart = 4;
			}

			// создаем блок кнопок выбора линий и определяем массив нужных линий
			//objWithAllData
			var lineButtons = $id('line_buttons');
			var allData = objWithAllData[chosenChart];
			var len = Object.keys(allData.names).length;
			chosenLinesArr=[];	
			while (lineButtons.firstChild) {
    		lineButtons.removeChild(lineButtons.firstChild);
			}
			for(i=0;i < len; i ++){
				var lineWrap = document.createElement('div');
				lineWrap.className ="lineWrap";
				var lineB = document.createElement('input');
				lineB.type = "checkbox";
				lineB.className ="line_buttons_wr";
				lineB.setAttribute('id', allData.names["y"+i]);
				lineB.setAttribute('checked','checked');
				lineB.setAttribute('color',allData.colors["y"+i]);
				lineB.name = allData.names["y"+i];
				var label = document.createElement('label');
				label.innerHTML = allData.names["y"+i];
				label.setAttribute('for', allData.names["y"+i]);
				lineWrap.appendChild(lineB);
				lineWrap.appendChild(label);
				lineButtons.appendChild(lineWrap);
				//chosenLinesArr
				
				chosenLinesArr.push(i + 1);
			}
			console.log(chosenLinesArr, "chosenLinesArr");
			///////////

			setCanvas_s(chosenChart);
			setCanvas_xl(chosenChart, startIndx, lastIndx);
			chartsButtonP.style.left = -2000+'px';

	} 

	var lineButtons = $id('line_buttons');
	lineButtons.onchange = function(e){
			flag.style.left = -200 +'px'; //ще гдето на кнопках или если будет ф-я перересовки всего туда тоже или только
			var allData = objWithAllData[chosenChart];
			var len = Object.keys(allData.names).length;
			chosenLinesArr=[];
			for(i=0;i < len; i ++){
				$id('#'+i).checked
				console.log($id('#'+i).checked, " $id('#'+i).checked");
				if ($id('#'+i).checked)chosenLinesArr.push([i+1]);
				//console.log(chosenLinesArr, "chosenLinesArr");
			}
console.log(chosenLinesArr, "chosenLinesArr");
setCanvas_s(chosenChart);
			setCanvas_xl(chosenChart, startIndx, lastIndx);
	}

	// chartsButtonP.onclick =  function(){
		
	// }

  

//chosenLinesArr узнать максимальное кол-во... ладно 4 шт после выбора графика у нас есть это значение именно после мы будем вызывать эту ф-ю

// var lineButtons = $id('line_buttons');
// var lineB = document.createElement('button');// span
// var allData = objWithAllData[chosenChart].names;
// console.log(allData, " allData");
// for(){

// }

// var span = document.createElement('span');// span
// 		span.className ="hidden";
// 		span.setAttribute('id', "span"+i);
// 		span.style.cssText = "display: block; text-align: center;";//  text-align: center; width: 100px; height: 25px
// 		span.innerHTML = datesArr[i];
// 		cahrtDiv.appendChild(span);
// cahrtDiv.setAttribute('id', "dates_div"+chosenChartIndex);
// 	cahrtDiv.style.cssText = "display: flex; position: absolute";

}; // ETO SKOBKA ONLOAD VRODE.






