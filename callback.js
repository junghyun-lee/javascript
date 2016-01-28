//#1
function alram(min, callback) {
    var isCall = false;
    setInterval(function() {
        var date = new Date();
        var nowMin = date.getMinutes();

        if(nowMin == min && !isCall) {
            isCall = true;
            callback(nowMin);
        }
    }, 1000);
}

onload=function() {
    alram(15, function(min) {
        window.open("현재 Minutes는'" + min + "' 입니다.");
    });
}

//#2
function alram(min){
    var isCall = false;
    setInterval(function() {
        var date = new Date();
        var nowMin = date.getMinutes();

        if(nowMin == min && !isCall) {
            isCall = true;
            alert(nowMin);
        }
    }, 1000);
}

onload = function(){
    alram(15);
}
//

//#1의 경우 alram() 함수는 하나의 기능만을 위해 만들어짐
//기능 추가 시 alram2() 함수를 하나 더 만들어야함

//#2의 경우는 여러 목적을 고려하여 만들어짐
//아래처럼 콜백함수를 이용하여 다양한 기능 추가 용이 재사용성 향상
alram(1, function(result){
    console.log(result);
})

alram(1, function(result){
    alert(result);
})
