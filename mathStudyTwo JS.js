// ===== クイズ部分 =====

document.addEventListener("DOMContentLoaded", () => {
//正解数
const correctNumber = document.getElementById('correct');
let questionNumber = 0;
let timerFlug = false
//タイマーの動きを監視するための変数
    let interval = null;

//問題を表示する場所
const questionArea = document.getElementById("questionArea");

//タイマーを表示する場所
    const countDown = document.getElementById('countdown');

    let timerselectvalue = null;

//スタート関数
function start(){
    if (!timerFlug){
    //まずタイマー設定　制限時間の取得
    const timerselect = document.getElementById('timeSelect');
    timerselectvalue = (parseInt(timerselect.value, 10) * 1000);
    //制限時間取得終わり

    //正解数初期化
    correctNumber.innerHTML = '0';
    //タイマー開始
    timerStart(timerselectvalue);
    //問題生成処理
    questionCreate();} else{;}
}

//タイマー関数
//タイマーの表示場所
function timerStart(timerselectvalue){
    timerFlug = true
    const targetTime = new Date().getTime() + timerselectvalue;

    interval = setInterval(updateCountDown, 1000);

    //new Date()オブジェクト/新しい日付オブジェクトの作成と現在の日付と時刻を取得
    //getTime()メゾット/Dateオブジェクトからミリ秒単位のタイムスタンプを取得するメソッド。

    //残り時間の計算
    function updateCountDown(){
        const now = new Date().getTime();
        const distance = targetTime - now;

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countDown.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if(distance < 0){
        stopTimer();
        countDown.textContent = '00:00:00';
        alert(
            '終了しました！\n' +
             '記録：\n' +
             '【選択した制限時間】' + (timerselectvalue / 1000)  + '秒' + '\n' +
             '【出題数】' + questionNumber + '\n' +
             '【正解数】' + correctNumber.textContent
        );
        questionArea.innerHTML = ""
        correctNumber.innerHTML = 0;
        }
    }
    updateCountDown();
}

//タイマー中断関数
function stopTimer(){
    clearInterval(interval);
    timerFlug = false;
    interval = null;
}

//中断関数
function Stop(){
    if(timerFlug){
        stopTimer()
        countDown.textContent = '00:00:00';
        questionArea.innerHTML = "おわりでーす";
        alert(
            '終了しました！\n' +
             '記録：\n' +
             '【選択した制限時間】' + (timerselectvalue / 1000)  + '秒' + '\n' +
             '【出題数】' + questionNumber + '\n' +
             '【正解数】' + correctNumber.textContent
        );
        questionArea.innerHTML = ""
        correctNumber.innerHTML = 0;
    }
}

//問題生成関数
function questionCreate(){
     twoSinsu();
}

//二進数の問題(二進数→十進数)
function twoSinsu(){
    let Question = Math.floor(Math.random() * 31) + 1;
    let twoQuestion = Question.toString(2);

    //不正解選択肢生成
    let sentakusi1 = Question + 1
    let sentakusi2 = Question + 8
    let sentakusi3 = Question - 3
    //以下選択肢を格納する空の配列
    const choices = [];

    //不正解選択肢を配列に追加
    choices.push(sentakusi1, sentakusi2, sentakusi3, Question);

        //問題生成
    const questionNakami = questionArea.innerHTML = `
    <span id="mondaibun">これを十進数にするといくつになりますか</span><br>
    <div>${twoQuestion}</div>
    <div id="buttonGroup"></div>
    `



    //配列シャッフル
    //取り出す範囲(箱の中)を末尾から狭める繰り返し
for(let i = choices.length -1;i>0;i--){
    //乱数生成を使ってランダムに取り出す値を決める
    let r = Math.floor(Math.random()*(i+1));
    //取り出した値と箱の外の先頭の値を交換する
    let tmp = choices[i];
    choices[i] = choices[r];
    choices[r] = tmp;
}

choices.forEach((choice) => {
    const sentakusiBox = document.createElement('button')
    sentakusiBox.className ='sentakusi';

    document.getElementById('buttonGroup').appendChild(sentakusiBox);
    sentakusiBox.textContent = choice;
    sentakusiBox.addEventListener('click', () => {
        if(choice === Question){
            correctNumber.textContent = parseInt(correctNumber.textContent) + 1;
            questionNumber = questionNumber + 1;
            if(timerFlug === true){
            questionCreate();}
        }else{
            questionNumber ; 1;
            if(timerFlug === true){
            questionCreate()}
        }
    })
})
}


    //イベントリスナー
    document.getElementById("start").addEventListener("click", () => start());
    document.getElementById("stop").addEventListener("click", () => Stop());
});//DOMcontentloaded　終了

//変数一覧
//correctNumberSpace　正解数を表示する場所
//correctNumber　正解数
//countdown　タイマーを表示しているdiv
//timeselect　選択している制限時間


//修正箇所
//リザルト画面の変数代入がおかしいところ