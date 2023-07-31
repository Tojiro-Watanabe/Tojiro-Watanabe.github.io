const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ゲーム範囲の作成
let x = canvas.width / 2;
let y = canvas.height - 30;

// ボールの位置と動き
const ballR = 10; // ボールの半径
let dx = -1;
let dy = -1;

// パドルの作成
const PH = 15;
const PW = 75;
let PP = canvas.width / 2;
let right = false;
let left = false;

//ブロックの情報
const brockrow = 3; // ブロックの行数
const brockcolumn = 8; //ブロックが何列あるか
const brockwidth = 75;
const brockheight = 10;
const brockmargin = 10; // ブロック同士の間隔
const brockpositionH = 30; // 初期y軸のマージン
const brockpositionW = 30; //初期x軸のマージン
//ブロックの作成
let brocks = [];
for(let column = 0; column < brockcolumn; column++){
    brocks[column] = [];
    for(let row = 0; row < brockrow; row++){
        brocks[column][row] = {x:0, y:0, status:1}; //x座標とy座標の初期化。status は 1 が描画で 0 が非表示。

    }
}

// キーが押されたらパドルが動くよ！
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// イベントオブジェクト(e)を使ってみる
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      right = true;
    } 
    
    else if (e.key == "Left" || e.key == "ArrowLeft") {
      left = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      right = false;
    } 
    
    else if (e.key == "Left" || e.key == "ArrowLeft") {
      left = false;
    }
}


// ボールの挙動
function ball() {
    ctx.beginPath();
    ctx.arc(x, y, ballR, 0, Math.PI * 2); // Math.PI は 円周率
    ctx.fillStyle = "Blue";
    ctx.fill();
    x += dx;
    y += dy;

    // 壁・パドルに当たったら反射する。
    if(x < (0 + ballR)  || (canvas.width - ballR) < x){
        dx = -dx;
    }

    if(y < (0 + ballR)){
        dy = -dy;
    }
    //下についた時、パドルの内側にボールがあるなら反射・違うならゲームオーバー
    else if((canvas.height - ballR) < y){ 
        if(PP < x && x < PP + PW){
            dy = -dy;
        }
        else{
            alert("げーむ　おーばーです。");
            document.location.reload(); //ページの更新
            clearInterval(interval); //setinterval の解除
        }

    ctx.closePath();

    }
}

//パドルの挙動
function Paddle(){
    ctx.beginPath();
    ctx.rect(PP, canvas.height - PH, PW, PH);
    ctx.fillStyle = "Red";
    ctx.fill();

    //パドルの移動量
    if(right){
        PP += 3;
        if(canvas.width - PW < PP){
            PP = canvas.width - PW;
        }
    }
    else if(left){
        PP -= 3;
        if(PP < 0){
            PP = 0;
        }
    }

    ctx.closePath();
}

//ブロックの表示
function Brocks(){
    for(let column = 0; column < brockcolumn; column++){
        for(let row = 0; row < brockrow; row++){
            if(brocks[column][row].status == 1){ // 1 なら描画や
                //各ブロックの座標は 列(行)番号*ブロック幅(高さ)+マージン に初期ポジションを足すことで出てくる。
                const brockX = (column * (brockwidth + brockmargin)) + brockpositionW;
                const brockY = (row * (brockheight + brockheight)) + brockpositionH;

                //それぞれの座標を入れていくよ
                brocks[column][row].x = brockX;
                brocks[column][row].y = brockY;

                //ブロック描画
                ctx.beginPath();
                ctx.rect(brockX, brockY, brockwidth, brockheight);
                ctx.fillStyle = "gold";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//ボールがブロックに衝突する
function Syoutotsu(){
    for(let column = 0; column < brockcolumn; column++){
        for(let row = 0; row < brockrow; row++){
            const brock = brocks[column][row]; //いちいち書くの面倒なので

            if(brock.status == 1){
                //ブロックのx座標+幅 と y座標+高さ の中にボールの中心があると（ブロックの中にボールの中心がある）衝突してるやんな？
                if(brock.x < x && x < brock.x + brockwidth && brock.y < y && y < brock.y + brockheight){
                    dy = -dy; //衝突したら跳ね返る...
                    brock.status = 0; //非表示にするで
                }
            }
        }
    }
}

function main() {
    // キャンバス内を初期化する。(軌道が消える。)
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ball();
    Paddle();
    Brocks();
    Syoutotsu();
}


//  一定時間ごとに処理をするよ。
const interval = setInterval(main, 5);