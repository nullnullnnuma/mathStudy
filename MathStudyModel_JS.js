document.addEventListener("DOMContentLoaded", () =>{
//------必要変数定義------
//正解数
const correctNumberEL = document.getElementById('correct');
//出題数の初期化
let questionNumber = 0;
//タイマー動作中かどうか
let timerFlug = false
//タイマーの動きを監視するための変数
    let interval = null;

//問題を表示する場所
const questionArea = document.getElementById("questionArea");

//タイマーを表示する場所
    const countDown = document.getElementById('countdown');
//これ何……後で調べて……
    let timerSelectValue = null;

let nowStyleValue = null;


//localStorage関連(どこでも使えるようにするため)
let zenZenkaiCorrects = "-"
let zenZenkaiQuestions = "-"
let zenkaiCorrects = "-"
let zenkaiQuestions = "-"
let totalCorrects = 0
let totalQuestions = 0


//ここからダッシュボード用
if(
    localStorage.getItem('zenkaiCorrectsData') != null &&
    localStorage.getItem('zenkaiQuestionsData') != null
){
    //前々回分　
    zenZenkaiCorrects = localStorage.getItem('zenZenkaiCorrectsData');
    if (zenZenkaiCorrects !== null) zenZenkaiCorrects = Number(zenZenkaiCorrects);
    else zenZenkaiCorrects = "-"
    zenZenkaiQuestions = localStorage.getItem('zenZenkaiQuestionsData');
    if (zenZenkaiQuestions !== null) zenZenkaiQuestions = Number(zenZenkaiQuestions);
    else zenZenkaiQuestions = "-"

    document.getElementById('zenZenkaiSeikaisu').textContent = zenZenkaiCorrects;
    document.getElementById('zenZenkaiMondaisu').innerHTML = zenZenkaiQuestions;

    //前回分
    zenkaiCorrects = localStorage.getItem('zenkaiCorrectsData')
    if (zenkaiCorrects !== null) zenkaiCorrects = Number(zenkaiCorrects);
    else zenkaiCorrects = "-"
    zenkaiQuestions = localStorage.getItem('zenkaiQuestionsData');
    if(zenkaiQuestions !== null) zenkaiQuestions = Number(zenkaiQuestions);
    else zenkaiQuestions = "-"

    document.getElementById('zenkaiSeikaisu').textContent = zenkaiCorrects
    document.getElementById('zenkaiMondaisu').textContent = zenkaiQuestions

    //累計分
    totalCorrects = Number(localStorage.getItem('ruikeiSeikaisuData'))|| 0
    totalQuestions = Number(localStorage.getItem('ruikeiMondaisuData')) || 0

    document.getElementById('ruikeiSeikaisu').textContent = totalCorrects
    document.getElementById('ruikeiMondaisu').textContent = totalQuestions

}else{
    document.getElementById('zenZenkaiSeikaisu').textContent = "-";
    document.getElementById('zenZenkaiMondaisu').textContent = "-";

    document.getElementById('zenkaiSeikaisu').textContent = "-";
    document.getElementById('zenkaiMondaisu').textContent = "-";

    //累計正解数
    totalCorrects = 0;
    document.getElementById('ruikeiSeikaisu').innerHTML = totalCorrects
    //累計問題数
    totalQuestions = 0;
    document.getElementById('ruikeiMondaisu').innerHTML = totalQuestions
}

//------モード管理------


//スタート関数
function start(){
    //タイマーが動いていないなら
    if (!timerFlug){
     //現在のモードの取得
    const nowStyle = document.getElementById('styleSelect');
    nowStyleValue = nowStyle.value;
    //まずタイマー設定　制限時間の取得
    const timerselect = document.getElementById('timeSelect');
    timerSelectValue = (parseInt(timerselect.value, 10) * 1000);
    //制限時間取得終わり

    //正解数初期化
    correctNumberEL.innerHTML = '0';
    //ついでに出題数も初期化しとくか
    questionNumber = 0;
    //タイマー開始
    timerStart(timerSelectValue);
    //問題生成処理
    if(nowStyleValue === 'まぜこぜモード'){
    //まぜこぜモードを選択しているなら
    MazekozeQuestionCreate();}else{
    if(nowStyleValue === '二進数→十進数モード'){
        //二進数から十進数モードを選択しているなら
        twoToTenQuestionCreate();
    }else{
        //上記2つの条件に当てはまらないなら(十進数から二進数モードを選択しているなら)
        tenToTwoQuestionCreate();
    }
}
}else{;}//タイマーが作動しているなら動かさない
}

//このセクションの変数一覧
//nowStyle = モードセレクトメニュー
//nowStyleValue = セレクトメニューで選択されているもの
//timerSelect  = 制限時間メニュー
//teimerSelectValue = 現在設定されている時間制限(を、コンピューター用に計算して桁数増やしたもの)


//------問題生成・判定------
//タイマー関数
//タイマーの表示場所
function timerStart(timerSelectValue){
    timerFlug = true
    const targetTime = new Date().getTime() + timerSelectValue;

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
             '【選択したモード】' + nowStyleValue + '\n' +
             '【選択した制限時間】' + (timerSelectValue / 1000)  + '秒' + '\n' +
             '【出題数】' + questionNumber + '\n' +
             '【正解数】' + correctNumberEL.textContent
        );
        DataKousin();
        questionArea.innerHTML = ""
        correctNumberEL.innerHTML = 0;
        questionNumber = 0;
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
function Stop(teimerSelectValue){
    if(timerFlug){
        stopTimer()
        countDown.textContent = '00:00:00';
        questionArea.innerHTML = "おわりでーす";
        alert(
            '中断しました！\n' +
             '記録：\n' +
             '【選択したモード】' + nowStyleValue + '\n' +
             '【選択した制限時間】' + (timerSelectValue / 1000)  + '秒' + '\n' +
             '【出題数】' + questionNumber + '\n' +
             '【正解数】' + correctNumberEL.textContent
        );

        DataKousin();
        questionArea.innerHTML = ""
        correctNumberEL.innerHTML = 0;
        questionNumber = 0;
        timerFlug = false;
    }
}


//問題生成関数
function MazekozeQuestionCreate(){
    let questionVarious = Math.floor(Math.random() * 2);
    if(questionVarious === 1){
        twoToTenQuestionCreate()
      }else{
        tenToTwoQuestionCreate()
         }
}

//二進数の問題(二進数→十進数)
function twoToTenQuestionCreate(){
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
    <div class="mathQuestion">${twoQuestion}</div>
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
        if(Number(choice) === Question){
            correctNumberEL.textContent = parseInt(correctNumberEL.textContent) + 1;
            questionNumber = questionNumber + 1;
            if(timerFlug === true){
                if(nowStyleValue === 'まぜこぜモード'){
    //まぜこぜモードを選択しているなら
    MazekozeQuestionCreate();}else{
    if(nowStyleValue === '二進数→十進数モード'){
        //二進数から十進数モードを選択しているなら
        twoToTenQuestionCreate();
    }}}
        }else{
            questionNumber = questionNumber + 1;
            if(timerFlug === true){
                if(nowStyleValue === 'まぜこぜモード'){
    //まぜこぜモードを選択しているなら
    MazekozeQuestionCreate();}else{
    if(nowStyleValue === '二進数→十進数モード'){
        //二進数から十進数モードを選択しているなら
        twoToTenQuestionCreate();
    }}}
        }
    })
})
}



//十進数の問題(十進数→二進数)
function tenToTwoQuestionCreate(){
    let tenQuestion = Math.floor(Math.random() * 31) + 1;
    //正解選択肢生成
    let tenQuestionSentakusi = tenQuestion.toString(2);

    //不正解選択肢生成
    let sentakusi1 = (tenQuestion + 1).toString(2);
    let sentakusi2 = (tenQuestion + 8).toString(2);
    let sentakusi3 = (tenQuestion - 3).toString(2);
    //以下選択肢を格納する空の配列
    const choices = [];

    //不正解選択肢を配列に追加
    choices.push(sentakusi1, sentakusi2, sentakusi3, tenQuestionSentakusi);

        //問題生成
    const questionNakami = questionArea.innerHTML = `
    <span id="mondaibun">これを二進数にするといくつになりますか</span><br>
    <div class="mathQuestion">${tenQuestion}</div>
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
        if(choice === tenQuestionSentakusi){
            correctNumberEL.textContent = parseInt(correctNumberEL.textContent) + 1;
            questionNumber = questionNumber + 1;
            if(timerFlug === true){
                if(nowStyleValue === 'まぜこぜモード'){
    //まぜこぜモードを選択しているなら
    MazekozeQuestionCreate();}else{
        //上記2つの条件に当てはまらないなら(十進数から二進数モードを選択しているなら)
        tenToTwoQuestionCreate();
    }}
        }else{
            questionNumber = questionNumber + 1;
            if(timerFlug === true){
            if(nowStyleValue === 'まぜこぜモード'){
    //まぜこぜモードを選択しているなら
    MazekozeQuestionCreate();}else{
        //上記2つの条件に当てはまらないなら(十進数から二進数モードを選択しているなら)
        tenToTwoQuestionCreate();
    }}
        }
    })
})
}


//データ更新関数
function DataKousin(){
        //前回のデータを前々回のデータにする
        localStorage.setItem('zenZenkaiCorrectsData', zenkaiCorrects);
        localStorage.setItem('zenZenkaiQuestionsData', zenkaiQuestions);
        zenZenkaiCorrects = zenkaiCorrects;
        zenZenkaiQuestions = zenkaiQuestions;
        //インナーhtml
        document.getElementById('zenZenkaiSeikaisu').textContent = zenZenkaiCorrects;
        document.getElementById('zenZenkaiMondaisu').textContent = zenZenkaiQuestions;

        //今回の記録を前回のデータにする
        localStorage.setItem('zenkaiCorrectsData', Number(correctNumberEL.textContent));
        localStorage.setItem('zenkaiQuestionsData', questionNumber);
        zenkaiCorrects = Number(correctNumberEL.textContent)
        zenkaiQuestions = questionNumber; 
        //インナーhtml
        document.getElementById('zenkaiSeikaisu').textContent = zenkaiCorrects
        document.getElementById('zenkaiMondaisu').textContent = zenkaiQuestions


        //累計正解数
        totalCorrects = totalCorrects + Number(correctNumberEL.textContent);
        localStorage.setItem('ruikeiSeikaisuData', totalCorrects)
        document.getElementById('ruikeiSeikaisu').textContent = totalCorrects
        //累計問題数
        totalQuestions = totalQuestions + questionNumber;
        localStorage.setItem('ruikeiMondaisuData', totalQuestions)
        document.getElementById('ruikeiMondaisu').textContent = totalQuestions

}


    //イベントリスナー
    const startBtn = document.getElementById("start")
    startBtn.onclick = () => start()
    const stopBtn = document.getElementById("stop")
    stopBtn.onclick = () => Stop()
})//DomContentLoadedおわり

//変数一覧
//correctNumberSpace　正解数を表示する場所
//correctNumberEL　正解数
//countdown　タイマーを表示しているdiv
//timeselect　選択している制限時間


//修正箇所
//リザルト画面の変数代入がおかしいところ
