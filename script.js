//全局变量
var me = true; //黑棋先手 
var over = false; //判断游戏是否结束
//棋盘落子情况初始化为空
var chessBoard = new Array();

var init = function(){
    for (var i=0; i<15; i++) {
        chessBoard[i] = [];
        for(var j=0; j<15; j++){
            chessBoard[i][j] = 0;
        }
    }
}

//制作棋盘
var chess = document.getElementById('chess');
var ctx = chess.getContext('2d');
ctx.strokeStyle = "#000000";

//载入背景图片
var logo = new Image();
logo.src = "logo.jpg";
logo.onload = function(){
    ctx.drawImage(logo,0,0,450,450);
    drawChessBoard();
    init();
}

var newgame = function(){
    location.reload();
}

//绘制棋盘线
var drawChessBoard = function(){
    for(var i=0; i<15; i++){
        //画棋盘竖线
        ctx.moveTo(15+i*30, 15);
        ctx.lineTo(15+i*30, 435);
        ctx.stroke(); 
        //画棋盘横线
        ctx.moveTo(15, 15+i*30);
        ctx.lineTo(435, 15+i*30);
        ctx.stroke();  
    }    
}

//制作黑白棋子
var oneStep = function(i, j, me){
    //画圆
    ctx.beginPath();
    ctx.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI);
    ctx.closePath();
    //渐变
    var grd = ctx.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0); 
    if(me){ //黑棋
        grd.addColorStop(0, "#0A0A0A");
        grd.addColorStop(1, "#636766");
    }
    else{  //白棋
        grd.addColorStop(0, "#D1D1D1");
        grd.addColorStop(1, "#F9F9F9");
    }   
    ctx.fillStyle = grd;
    ctx.fill();
}

//点击棋盘落子
chess.onclick = function(e){
    if(over){
        return ;
    }
    if(!me){
        return ;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    if(chessBoard[i][j] == 0){
        oneStep(i, j, me);
        chessBoard[i][j] = 1;   //黑棋落子为1
     
        for(var k=0; k<count; k++){
            if(wins[i][j][k]){
                myWin[k]++;
                computerWin[k] = 6; //设置成比5大的数都不会加分
                if(myWin[k] == 5){
                    window.alert("You Win !");
                    over = true;
                }
            }
        }
        if(!over){
            me = !me;
            computerAI();
        }
    }
}
//计算机下棋
var computerAI = function(){
    var myScore = [];
    var computerScore = [];
    var max = 0;
    var u = 0, v = 0;
    for(var i=0; i<15; i++){
        myScore[i] = [];
        computerScore[i] =[];
        for(var j=0; j<15; j++){
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for(var i=0; i<15; i++){
        for(var j=0; j<15; j++){
            if(chessBoard[i][j] == 0){
                for(var k=0; k<count; k++){
                    if(wins[i][j][k]){
                        if(myWin[k] == 1){
                            myScore[i][j] += 200;
                        }else if(myWin[k] == 2){
                            myScore[i][j] += 400;
                        }else if(myWin[k] == 3){
                            myScore[i][j] += 2000;
                        }else if(myWin[k] == 4){
                            myScore[i][j] += 10000;
                        }

                        if(computerWin[k] == 1){
                            computerScore[i][j] += 220;
                        }
                        else if(computerWin[k] == 2){
                            computerScore[i][j] += 420;
                        }
                        else if(computerWin[k] == 3){
                            computerScore[i][j] += 2100;
                        }
                        else if(computerWin[k] == 4){
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                if(myScore[i][j] > max){
                    max = myScore[i][j];
                    u = i;
                    v = j;                  
                }
                else if(myScore[i][j] == max){
                    if(computerScore[i][j] > computerScore[u][v]){
                        u = i;
                        v = j;                      
                    }
                }

                if(computerScore[i][j] > max){
                    max = computerScore[i][j];
                    u = i;
                    v = j;                  
                }
                else if(computerScore[i][j] == max){
                    if(myScore[i][j] > myScore[u][v]){
                        u = i;
                        v = j;                      
                    }
                }
            }
        }
    }
    oneStep(u, v, false);
    chessBoard[u][v] = 2;  
    
    for(var k = 0; k < count; k++){
        if(wins[u][v][k]){
            computerWin[k]++;
            myWin[k] = 6;
            if(computerWin[k] == 5){
                window.alert("Computer Win !")
                over = true;
            }
        }
    }
    if(!over){
        me = !me;
    }    
}


//更改鼠标指针样式
chess.onmousemove = function(e){
    chess.style.cursor = "default";
    var x = e.offsetX;
    var y = e.offsetY;
    for(var i=0; i<15; i++){
        for(var j=0; j<15; j++){
            var a = x - (15+i*30);
            var b = y - (15+j*30);
            var distance = Math.hypot(a, b);
            var chessRange = Math.sqrt(25, 2);
            //在交叉处半径为5的范围内，鼠标变成手指样式
            if(distance < chessRange){
                chess.style.cursor = "pointer";
            }
        }
    }
}


//赢法数组
var wins = new Array();

//定义赢法的三维数组
for(var i=0; i<15; i++){
    wins[i] = [];
    for(var j=0; j<15; j++){
        wins[i][j] = [];
    }
}
var count = 0;

//横线赢法
for(var i=0; i<15; i++){
    for(var j=0; j<11; j++){
        for(var k=0; k<5; k++){
            wins[i][j+k][count] = true;  
        }
        count++;
    }
}

//竖线赢法
for(var i=0; i<15; i++){
    for(var j=0; j<11; j++){
        for(var k=0; k<5; k++){
            wins[j+k][i][count] = true;  
        }
        count++;
    }
}

//斜线赢法
for(var i=0; i<11; i++){
    for(var j=0; j<11; j++){
        for(var k=0; k<5; k++){
            wins[i+k][j+k][count] = true;  
        }
        count++;
    }
}

//反斜线赢法
for(var i = 0; i < 11; i++){
    for(var j= 14; j > 3; j--){
        for(var k = 0; k < 5; k++){
            wins[i+k][j-k][count] = true;
        }
        count++;
    }
}
console.log(count);


//赢法统计数组
var myWin = [];
var computerWin = [];

//赢法统计数组初始化
for(var i=0; i<count; i++){
    myWin[i] = 0;
    computerWin[i] = 0;
}