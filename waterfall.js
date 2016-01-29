/**
 * Created by leejunghyun on 16. 1. 28..
 */
//@@@@@async.whilst
//async.whilst()는 비동기 프로그래밍의 반복 처리 제어 기능을 제공,
//async.whilst(test, fn, callback)
//test가 true를 리턴하면 반복적으로 fn을 호출한다. 에러가 발생하거나 반복을 종료하면 callback이 호출된다.
var async = require('async');
var uuid = require('uuid');

var arr = [1,2,3,4,5];
async.map(arr, function(item, callback){        // arr에 데이터를 한번씩 순환해서 데이터가 있으면 여기로 진
        var photoArr = [];
        var count = 0;
        async.whilst(
            function(){                          // 테스트 함수(여기서 true일 경우 다음 함수 진입)
                console.log('test : '+ count);
                return count < 3;
            },
            function(callback){                        // 테스트가 true일 경우
                console.log('task');
                count++;
                photoArr.push(/photos/ + uuid.v4() +'jpg');
                callback();
            },
            function(err){                       // Callback함수
                console.log('err');
                if(err){
                    callback(err);
                }
                callback(null, {id:item, photos:photoArr});  // 정상일 경우 3개의 원소 포함한 배열 반환
            }
        );
    },
    function(err,results){
        if(err){
            return console.log(err);
        }
        console.log(results);
    }
);
////////////////

//@@@@@async.parallel()
//async.parallel()은 태스크의 병렬 실행이 필요할 때 사용하는 흐름제어 함수로 태스크 실행은 서로 독립적으로 진행된다.
//callback(err, results) –
//이 선택적인 callback은 모든 함수가 수행되고 나면 호출된다. 이 함수는 배열 또는 객체 results에 tasks의 함수들의 콜백에 전달된 값들이 저장되어 있다.
var async = require('async');

async.parallel([
        function task1(callback){
            setTimeout(function(){
                console.log("task1");
                callback(null, "one");      // 콜백 함수로 에러로그와 result인 "one"을 전달하면 콜백함수는 이를 배열에 저장한다.
            },1000);
        },
        function task2(callback){
            setTimeout(function(){
                console.log("task2");
                callback(null,"two");       // 콜백 함수로 에러로그와 result인 "one"을 전달하면 콜백함수는 이를 배열에 저장한다.
            }, 3000);
        },
        function task3(callback){
            setTimeout(function(){
                console.log("task3");
                callback(null, "three");    // 콜백 함수로 에러로그와 result인 "one"을 전달하면 콜백함수는 이를 배열에 저장한다.
            }, 2000);
        }],
    function(err,results){          // Callback함수(기존 작업이 모두 종료되어야만 호출된다.)
        if(err){
            return console.log(err);
        }
        console.log(results);
    }
);
///////////////////

//@@@@@async.waterfall
//callback(err,results) –
//이 선택적인 callback은 모든 함수가 수행되고 나면 호출된다. 이 함수의 선택적인 인자 results에는 tasks이 마지막 함수의 결과 값이 전달된다.
//async.waterfall()은 태스크의 순차적 실행이 필요할 때 사용하는 흐름제어 함수로
//async.series()와 다르게 이전 태스트 실행의 결과를 다음 태스크 함수의 인자로 전달할 수 있다.

var async = require('async');
async.waterfall([
        function task1(callback){               // 첫번째 작업 시작
            console.log("task1");
            callback(null, 1, 2);               // 에러가 없으므로 null과 두번째 작업함수에서 전달받을 매개변수 1,2를 함께 리턴
        },
        function task2(arg1, arg2, callback){   // task1로부터 1,2를 전달받아 다시 덧셈과 곱셈을 하여 리턴
            console.log("task2");
            callback(null, arg1 + arg2, arg1 * arg2);
        },
        function task3(arg1, arg2, callback){   // task2로부터 3,2를 전달받아 배열에 넣고 callback함수로 매개변수로 담아 리턴
            console.log("task3");
            var arr = [];
            arr.push(arg1);
            arr.push(arg2);
            callback(null, arr);
        }
    ],
    function(err,result){
        if(err){
            return console.log(err);
        }
        // task3으로부터 2개 원소가 있는 배열을 전달받음
        console.log(result);
    }
);
var async = require('async');
async.waterfall([
        function(callback) {
            console.log('--- async.waterfall #1 ---');
            // 여기서도 series, parallel과 마찬가지로
            // callback의 실행은 다음 task 으로 넘기기 위한것입니다.
            //
            // parallel의 다른점은
            // callback의 결과가 다음 task으로 전달되는 점입니다.
            callback(null, 'one', 'two');
        },
        // 첫번째 task에서 전달된 one, two 값을 인자로 받게 됩니다.
        function(arg1, arg2, callback) {
            console.log('--- async.waterfall #2 ---');
            console.log(arguments);
            callback(null, 'three');
        },
        function(arg1, callback) {
            console.log('--- async.waterfall #3 ---');
            console.log(arguments);
            // 마지막 task의 callback에 전달한 인수값이
            // 마지막 callback에 전달됩니다.
            callback(null, 'done');
        }
    ],
// 마지막 함수에서 callback으로 전달한 인자가 넘어옵니다.
    function(err, results) {
        console.log('--- async.waterfall result #1 ---');
        console.log(arguments);
    });
////////////////////////////

//@@@@async.series
//아무리 시간 지정을 해도 순차적으로 진행
//callback(err, results) –
// 이 선택적인 callback은 모든 함수가 수행되고 나면 호출된다. 이 함수는 배열 또는 객체 results에 tasks의 함수들의 콜백에 전달된 값들이 저장되어 있다.
var async = require('async');

async.series({
        one: function(callback) {
            setTimeout(function() {
                console.log('--- async series::ste#1-1 ---');
                callback(null, 200);
            }, 200);
        },
        two: function(callback) {
            setTimeout(function() {
                console.log('--- async series::ste#1-2 ---');
                callback(null, 100);
            }, 100);
        }
    },
    function(err, results) {
        console.log('--- async series result ---');
        console.log(results);
    });

async.series([
        function task1(callback){
            console.log("task1");
            callback(null, "one");
        },
        function task2(callback){
            console.log("task2");
            callback(null,"two");
        },
        function task3(callback){
            console.log("task3");
            callback(null,"three");
        }
    ],
    function(err,results){
        if(err){
            return console.log(err);
        }
        console.log(results);
    }
);
/////////////////////////////