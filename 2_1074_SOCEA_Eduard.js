var _videoPlayer;
var _paths = new Array();
var _canvasWidth;
var _canvasHeight;
var _progressBarX = 180;
var _timerWidth = 80;
var _ctx;
var _videoFiles = new Array();
var _videoFileName;
var _borderColor = "#BDBDBD";
var _fillColor = "#37474F";
var _buttons = {
    PLAY: 0,
    PAUSE: 1,
    PREVIOUS: 2,
    NEXT: 3,
    STOP: 4,
    PLUS: 5,
    MINUS: 6
}

//enum pentri filtre
var _filter = {
    GRAYSCALE: "Grayscale",
    SEPIA: "Sepia",
    SATURATION: "Saturation",
    BRIGHTNESS: "Brightness",
    CONTRAST: "Contrast"
}

//Initializare chenar pentru play/pause button
var playShape = new Button(_buttons.PLAY, 30, 0, 30, 30);

function Button(key, x, y, w, h) {
    this.key = key;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

$(document).ready(function () {

    InitializeVideoPlayer(); //Initializare Video Player;

    $(".nav-icon").click(function () {
        $(".nav-items").toggle('slide', { direction: 'right' }, 300);
    }); // initializare toggle pentru butonul de meniu;

    $(".left-nav").find('span').toArray().forEach(function (e) {
        _videoFiles.push(e.getAttribute('name'));
    }); //initializare vector cu denumirile filmelor

    _videoFileName = _videoPlayer.currentSrc.split('/');
    _videoFileName = _videoFileName[_videoFileName.length - 1]; // obtinere denumire video curent;

    InitializeSliderAction(); // initializare slider pentru efecte;
    InitializeApplyFilter(); // initializare functie de filtru;
    InitializeResetFilter();
})


function InitializeVideoPlayer() {
    _videoPlayer = document.getElementById("media-container"); //obtine DOM al videoPlayer-urului
    _videoPlayer.controls = false;

}

function drawVideoNav() {
    //initializare canvas
    var canvas = document.getElementById("video-navigation");
    canvas.width = $("#media-container").width();
    _canvasWidth = canvas.width;
    _canvasHeight = canvas.height;
    // var hiddenCanvas = document.getElementById("video-navigation")
    // hiddenCanvas.width = $("#media-container").width();

    //initializare dimensiuni canvas;
    var canvasOffSet = $("#video-navigation").offset();
    var offsetX = canvasOffSet.left;
    var offsetY = canvasOffSet.top;

    if (canvas.getContext) {
        _ctx = canvas.getContext('2d'); // get canvas context
        drawVideoNavigationBar(_paths); // deseneaza navigarea pentru video;
        //adauga event listner pentru click event pentru canvas
        canvas.addEventListener("click", function (e) {
            var clientX = parseInt(e.clientX - offsetX);
            var clientY = parseInt(e.clientY - offsetY);
            _paths.forEach(function (p) {
                //obtinere locatia de click al mouse-ului
                if (clientX > p.x && clientX < p.x + p.w
                    && clientY > p.y && clientY < p.y + p.h) {
                    videoAction(p); //get action pentru click event;
                }

            });

            videoEnded(); // event pentru terminarea filmului
            fillProgressBar(); //fill progress bar

        })

    }
}

function drawVideoNavigationBar(_paths) {
    //draw borders;
    drawBorders(_paths);

    //draw previous button
    _ctx.beginPath();
    _ctx.moveTo(4, 15);
    _ctx.lineTo(17, 4);
    _ctx.lineTo(17, 26);
    _ctx.moveTo(12, 15);
    _ctx.lineTo(26, 4);
    _ctx.lineTo(26, 26);
    _ctx.fill();


    //draw play button
    _ctx.beginPath();
    _ctx.moveTo(34, 4);
    _ctx.lineTo(34, 26);
    _ctx.lineTo(56, 15)
    _ctx.fill();

    //draw next button
    _ctx.beginPath();
    _ctx.moveTo(64, 4);
    _ctx.lineTo(77, 15);
    _ctx.lineTo(64, 26);
    _ctx.moveTo(72, 4);
    _ctx.lineTo(86, 15);
    _ctx.lineTo(72, 26);
    _ctx.fill();

    //draw stop button
    _ctx.beginPath();
    _ctx.rect(94, 4, 22, 22);
    _ctx.fill();

    //draw plusSound button
    _ctx.beginPath();
    _ctx.moveTo(133, 4);
    _ctx.lineTo(133, 13);
    _ctx.lineTo(124, 13);
    _ctx.lineTo(124, 17);
    _ctx.lineTo(133, 17);
    _ctx.lineTo(133, 26);
    _ctx.lineTo(137, 26);
    _ctx.lineTo(137, 17);
    _ctx.lineTo(146, 17);
    _ctx.lineTo(146, 13);
    _ctx.lineTo(137, 13);
    _ctx.lineTo(137, 4);
    _ctx.fill();


    //draw minusSound button
    _ctx.beginPath();
    _ctx.rect(154, 13, 22, 4);
    _ctx.fill();
}

function drawBorders(_paths) {
    var xCoord = 0;
    var yCoord = 0;
    var width = 30;
    var height = 30;

    //draw previous border
    _ctx.beginPath();
    _ctx.strokeStyle = _borderColor;
    _ctx.fillStyle = _fillColor;
    _ctx.rect(xCoord, yCoord, width, height);
    _ctx.stroke();
    _paths.push(new Button(_buttons.PREVIOUS, xCoord, yCoord, width, height));

    xCoord += 30;

    //draw play/pause border
    _ctx.beginPath();
    _ctx.rect(xCoord, yCoord, width, height);
    _ctx.stroke();

    _paths.push(new Button(_buttons.PLAY, xCoord, yCoord, width, height));
    xCoord += 30;

    //draw next border
    _ctx.beginPath();
    _ctx.rect(xCoord, yCoord, width, height);
    _ctx.stroke();

    _paths.push(new Button(_buttons.NEXT, xCoord, yCoord, width, height));
    xCoord += 30;

    //draw stop border
    _ctx.beginPath();
    _ctx.rect(xCoord, yCoord, width, height);
    _ctx.stroke();

    _paths.push(new Button(_buttons.STOP, xCoord, yCoord, width, height));
    xCoord += 30;

    //draw plusSound border
    _ctx.beginPath();
    _ctx.rect(xCoord, yCoord, width, height);
    _ctx.stroke();

    _paths.push(new Button(_buttons.PLUS, xCoord, yCoord, width, height));
    xCoord += 30;

    //draw minusSound border
    _ctx.beginPath();
    _ctx.rect(xCoord, yCoord, width, height);
    _ctx.stroke();

    _paths.push(new Button(_buttons.MINUS, xCoord, yCoord, width, height));
    xCoord += 30;

    //draw progress barr;
    _ctx.beginPath();
    _ctx.rect(_progressBarX, yCoord, _canvasWidth - _progressBarX - _timerWidth, height)
    _ctx.stroke();
}

function videoAction(shape) {
    switch (shape.key) {
        case _buttons.PLAY:
            playAction(shape);
            break;
        case _buttons.PAUSE:
            pauseAction(shape);
            break
        case _buttons.PREVIOUS:
            previousAction();
            break;
        case _buttons.NEXT:
            nextAction();
            break;
        case _buttons.STOP:
            stopAction();
            clearPause(playShape);
            clearProgress();
            clearTimer();
            break;
        case _buttons.PLUS:
            volumeUpAction();
            break;
        case _buttons.MINUS:
            volumeDownAction();
            break;
        default:
            break;

    }
}

//Begin VideoActions

function playAction(shape) {
    _videoPlayer.play();
    _ctx.clearRect(shape.x, shape.y, shape.w, shape.h);
    drawPause();

    if (_videoPlayer.currentTime == 0) {
        clearProgress();
    }
}

function pauseAction(shape) {
    _videoPlayer.pause();
    clearPause(shape);
}

function stopAction() {
    _videoPlayer.load();
}

function volumeUpAction() {
    _videoPlayer.volume += 0.1;
}

function volumeDownAction() {
    _videoPlayer.volume -= 0.1;
}

function previousAction() {
    for (var i = 0; i < _videoFiles.length; ++i) {
        if (_videoFiles[i] == _videoFileName) {
            if (i == 0) {
                _videoPlayer.src = createVideoFilePath(_videoFiles[_videoFiles.length - 1]);
                _videoPlayer.load();
                _videoFileName = _videoFiles[_videoFiles.length - 1];
                clearProgress();
                clearPause(playShape);
                break;
            }
            else {
                _videoPlayer.src = createVideoFilePath(_videoFiles[i - 1]);
                _videoPlayer.load();
                _videoFileName = _videoFiles[i - 1];
                clearProgress();
                clearPause(playShape);
                break;
            }
        }
    }
}

function nextAction() {
    for (var i = 0; i < _videoFiles.length; ++i) {
        if (_videoFiles[i] == _videoFileName) {
            if (i == _videoFiles.length - 1) {
                _videoPlayer.src = createVideoFilePath(_videoFiles[0]);
                _videoPlayer.load();
                _videoFileName = _videoFiles[0];
                clearProgress();
                clearPause(playShape);
                break;
            }
            else {
                _videoPlayer.src = createVideoFilePath(_videoFiles[i + 1]);
                _videoPlayer.load();
                _videoFileName = _videoFiles[i + 1];
                clearProgress();
                clearPause(playShape);
                break;
            }
        }
    }
}

function fillProgressBar() {
    clearTimer();
    _ctx.font = "15px serif";
    var timeDuration = parseInt(_videoPlayer.duration); //obtinere durata video
    mmDuration = parseInt(timeDuration / 60); //durata video in minute;
    ssDuration = parseInt(timeDuration - mmDuration * 60); // durata video in secunde;
    if (mmDuration.toString().length == 1) mmDuration = "0" + mmDuration; //formateaza minute pentru 2 cifre
    if (ssDuration.toString().length == 1) ssDuration = "0" + ssDuration; //formatare secunde pentru 2 cifre

    var duration = _videoPlayer.duration;
    //event pentru timpul in care video ruleaza
    _videoPlayer.ontimeupdate = function () {
        var progress = _videoPlayer.currentTime;
        var timeWidth = (_canvasWidth - _progressBarX - _timerWidth) / duration;
        _ctx.beginPath();
        _ctx.rect(_progressBarX, 0, progress * timeWidth, _canvasHeight);
        _ctx.fill();
        fillCurrentTime(mmDuration, ssDuration);

    }
}

function fillCurrentTime(mmDuration, ssDuration) {
    clearTimer();
    var timeCurrent = parseInt(_videoPlayer.currentTime)
    var mmCurrent = parseInt(timeCurrent / 60);
    var ssCurrent = parseInt(timeCurrent - mmCurrent * 60);
    if (mmCurrent.toString().length == 1) mmCurrent = "0" + mmCurrent;
    if (ssCurrent.toString().length == 1) ssCurrent = "0" + ssCurrent;
    var timeString = mmCurrent + ":" + ssCurrent + "/" + mmDuration + ":" + ssDuration;
    _ctx.fillText(timeString, _canvasWidth - _timerWidth + 4, 20);
}

function clearTimer() {
    _ctx.clearRect(_canvasWidth - _timerWidth, 0, _timerWidth, _canvasHeight);
}
//End VideoActions

function videoEnded() {
    _videoPlayer.onended = function () {
        clearPause(playShape);
        clearTimer();
        nextAction();
    }
}

function drawPause() {

    _ctx.beginPath();
    _ctx.rect(30, 0, 30, 30);
    _ctx.stroke();

    _paths.forEach(function (e) {
        if (e.key == _buttons.PLAY) {
            e.key = _buttons.PAUSE;
        }
    })

    _ctx.beginPath();
    _ctx.rect(34, 4, 10, 22);
    _ctx.fill();
    _ctx.rect(46, 4, 10, 22);
    _ctx.fill();
}

function drawPlay() {
    _ctx.beginPath();
    _ctx.rect(30, 0, 30, 30);
    _ctx.stroke();

    _paths.forEach(function (e) {
        if (e.key == _buttons.PAUSE) {
            e.key = _buttons.PLAY;
        }
    })

    _ctx.beginPath();
    _ctx.moveTo(34, 4);
    _ctx.lineTo(34, 26);
    _ctx.lineTo(56, 15)
    _ctx.fill();


}

function clearPause(shape) {
    _ctx.clearRect(shape.x, shape.y, shape.w, shape.h);
    drawPlay();
}

function clearProgress() {

    _ctx.clearRect(_progressBarX, 0, _canvasWidth - _progressBarX - _timerWidth, _canvasHeight);
    _ctx.beginPath();
    _ctx.rect(_progressBarX, 0, _canvasWidth - _progressBarX - _timerWidth, _canvasHeight)
    _ctx.stroke();
}

function loadVideo(file) {
    _videoPlayer.src = file;
    _videoPlayer.load();
    clearPause(playShape);
    clearProgress()
}

//functie ce creaza path-ul fisierului video;
function createVideoFilePath(file) {
    return "media/" + file;
}

function InitializeSliderAction() {
    $(".slider").toArray().forEach(function (e) {
        console.log($(e).val());
        $(e).siblings(".slider-value").val($(e).val());
    })

    $(".slider").change(function () {
        $(this).siblings("input").val($(this).val());
    })
}

//functia ce aplica filtru
function InitializeApplyFilter() {
    $(".apply-filter").click(function () { //event onClick 
        var combinedFilter = "";
        $(".nav-items").find(".slider-container").toArray().forEach(function (e) {
            var filterValue = $(e).find(".slider-value").val();
            switch ($(e).find(".filter-name").text()) {
                case _filter.GRAYSCALE:
                    combinedFilter += "grayscale(" + filterValue + ")";
                    break;
                case _filter.SEPIA:
                    combinedFilter += " sepia(" + filterValue + ")";
                    break;
                case _filter.BRIGHTNESS:
                    combinedFilter += " brightness(" + filterValue + ")";
                    break;
                case _filter.SATURATION:
                    combinedFilter += " saturate(" + filterValue + ")";
                    break;
                case _filter.CONTRAST:
                    combinedFilter += " contrast(" + filterValue + ")";
                    break;
                default:
                    break;
            }
        });

        $("#media-container").css("filter", combinedFilter); 
        $("#media-container").css("-webkit-filter", combinedFilter); //forMozilla
    });
}

function InitializeResetFilter(){
    $(".reset-filter").click(function(){
         $(".nav-items").find(".slider-container").toArray().forEach(function (e) {
            switch ($(e).find(".filter-name").text()) {
                case _filter.GRAYSCALE:
                        $(e).find(".slider-value").val(0);
                    break;
                case _filter.SEPIA:
                    $(e).find(".slider-value").val(0);
                    break;
                case _filter.BRIGHTNESS:
                    $(e).find(".slider-value").val(1);
                    break;
                case _filter.SATURATION:
                    $(e).find(".slider-value").val(1);
                    break;
                case _filter.CONTRAST:
                    $(e).find(".slider-value").val(1);
                    break;
                default:
                    break;
            }
        });
        
        var  filter = "grayscale(0) sepia(0) brightness(1) saturate(1) contrast(1)";
         $("#media-container").css("filter", filter);
         $("#media-container").css("-webkit-filter", filter);
    })
}
