//提示
var tip = [];
var tipindex = 0;
//时间
var mybeta = 0;
var myalpha = 0;
var t1 = -1;
var hit = document.getElementById("hit");
var passnumber = 1; //第几关
var nowpass = 'Checkpoint1';  //关卡名字
var imgname = ["disinfectant", "gloves", "plastic", "Syringe", "mask", "soap"];  //方块集合
//var imgname = ["disinfectant", "gloves", "plastic", "Syringe", "mask", "soap","virus"];  //方块集合
var nowFilters = {
    Checkpoint1: { condition: [{ name: "mask", value: 3, type: 5 }], time: 250 },
    Checkpoint2: { condition: [{ name: "soap", value: 4, type: 6 }], time: 300 },
    Checkpoint3: { condition: [{ name: "gloves", value: 6, type: 2 }], time: 300 },
    Checkpoint4: { condition: [{ name: "Syringe", value: 6, type: 4 }], time: 500 },
    Checkpoint5: { condition: [{ name: "mask", value: 6, type: 5 }, { name: "soap", value: 3, type: 6 }], time: 600 },
    Checkpoint6: { condition: [{ name: "disinfectant", value: 6, type: 1 }, { name: "plastic", value: 6, type: 3 }], time: 600 },
    Checkpoint7: { condition: [{ name: "mask", value: 7, type: 5 }], time: 600 },
    Checkpoint8: { condition: [{ name: "gloves", value: 6, type: 2 }, { name: "Syringe", value: 3, type: 4 }], time: 400 },
    Checkpoint9: { condition: [{ name: "disinfectant", value: 6, type: 1 }, { name: "soap", value: 3, type: 6 }], time: 500 },
    Checkpoint10: { condition: [{ name: "gloves", value: 6, type: 2 }, { name: "mask", value: 6, type: 5 }], time: 900 },
}; //闯关条件以及关数
var ALLTIME = nowFilters.Checkpoint1.time;

var allKindScore = [
    { name: "disinfectant", value: 0, type: 1 },
    { name: "gloves", value: 0, type: 2 },
    { name: "plastic", value: 0, type: 3 },
    { name: "Syringe", value: 0, type: 4 },
    { name: "mask", value: 0, type: 5 },
    { name: "soap", value: 0, type: 6 },
    { name: "virus", value: 0, type: 7 }
];  //当前关卡各种方块消除成绩的记录

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var x; //鼠标当前移动到的位置
var y;

var BLOCK_ROWS = 8; // 每行每列8个方块
var BLOCK_COLS = 8;
var BLOCK_TYPE = 6; // 方块的种类
var BLOCK_WIDTH = 40; // 每个格子的宽
var BLOCK_HEIGHT = 40; // 每个格子的高
var MOVE_PIXEL = 10; // 每单位时间移动的像素
var DROP_PIXEL = 10; // 每单位时间下落的像素
var MOVE_TIME = 20; // 方块移动的单位时间
var BLAST_TIME = 20; // 方块消除单位时间
var DROP_TIME = 10; // 方块下落单位时间
var TYPE = 0;
var CHECK_TYPE = null; //当前选中的类型


var is_move_time = false; // 当前是否有方块正在移动
var is_blast_time = false; // 当前是否有方块正在消除 
var is_drop_time = false; // 当前是否有方块正在下落
var is_time = false;
var is_restart = false;
var is_tips = false;
var is_music = true;

var is_press = false; // 判断鼠标是否为按下状态
var is_key_down = false; // 判断键盘按键是否按下状态
var now_rows = -1; //当前点击的坐标
var now_cols = -1;

var focus_rows = -1; // 选中状态的方块坐标
var focus_cols = -1;

var SCORE = 0; // 游戏得分
var ALL_SUM = 0; // 累计消除方块数量
var ONE_SUM = 0; // 单次最多消除方块数量
var ADDITION = 1; // 分数加成权值
var block; //用于保存每个方块的类型

//个人信息
var wxName = '';
var wxAvatar = '';
var userid = '0';
var rankList = [];
var nowProbability = 0;
var isWin = 2;


if (localStorage.getItem("count") == null) {
    localStorage.setItem("count", 0);
}

block = new Array();
for (var i = -3; i < BLOCK_ROWS + 3; i++) {
    block[i] = new Array();
    for (var j = -3; j <= BLOCK_COLS + 3; j++) {
        block[i][j] = -1;
    }
}




function hidePassBg() {
    $('.game_pass_img').css('display', 'none');
    $('.next_pass_button_area').css('z-index', 8);
    $('.next_pass_button').css('display', 'none');
    $('.restart_game_button').css('display', 'none');
    $('.towin_game_button').css('display', 'none');
}
function start(passtime) {
    hidePassBg();
    renderCondition();
    // tip = [];
    // tipindex = 0;
    // SCORE = 0;
    // ALL_SUM = 0;
    // ONE_SUM = 0;
    ALLTIME = passtime;
    var cardimg = './png/card'+passnumber+'.png';
    $('.top_function_center_center_img').attr("src", cardimg);


    allKindScore = [
        { name: "disinfectant", value: 0, type: 1 },
        { name: "gloves", value: 0, type: 2 },
        { name: "plastic", value: 0, type: 3 },
        { name: "Syringe", value: 0, type: 4 },
        { name: "mask", value: 0, type: 5 },
        { name: "soap", value: 0, type: 6 },
        { name: "virus", value: 0, type: 7 }
    ];
    ctx.clearRect(0, 0, BLOCK_WIDTH * BLOCK_COLS, BLOCK_HEIGHT * BLOCK_ROWS);
    for (var i = 0; i < BLOCK_ROWS; i++) {
        for (var j = 0; j < BLOCK_COLS; j++) {
            rand = parseInt(Math.random() * BLOCK_TYPE) + 1;
            block[i][j] = rand;
        }
    }
    if (check_blast(-1, -1, -1, -1, -1, -1, true)) {
        start(ALLTIME);
    } else {
        for (var i = 0; i < BLOCK_ROWS; i++) {
            for (var j = 0; j < BLOCK_COLS; j++) {
                shape(block[i][j], j * BLOCK_WIDTH, i * BLOCK_WIDTH, 1);
            }
        }
    }

    if (is_restart) {
        if (t1 != -1) {
            cleartime();
            clearInterval(t1);
            is_time = false;
        }
        is_restart = false;
    }
    if (!is_time && TYPE == 1) countDown();

    $(".score").html(SCORE);
}

function renderCondition() {
    var nowpass1 = 'Checkpoint' + passnumber;
    var nowfilter1 = nowFilters[nowpass1].condition;
    if (nowfilter1.length <= 1) {
        var fimg1 = "svg/" + nowfilter1[0].name + ".png";
        var fvalue1 = 'x' + nowfilter1[0].value;
        $('.top_function_center_bottom_condition_icon').attr("src", fimg1);
        $(".top_function_center_bottom_condition_text").html(fvalue1);
        $('.top_function_center_bottom_condition_area2').css('opacity', 0);
        $('.top_function_center_bottom_condition_area').css('opacity', 1);
    } else {
        var fimg2 = "svg/" + nowfilter1[0].name + ".png";
        var fimg3 = "svg/" + nowfilter1[1].name + ".png";
        var fvalue2 = 'x' + nowfilter1[0].value;
        var fvalue3 = 'x' + nowfilter1[1].value;
        $('.top_function_center_bottom_condition_icon2').attr("src", fimg2);
        $(".top_function_center_bottom_condition_text2").html(fvalue2);
        $('.top_function_center_bottom_condition_icon3').attr("src", fimg3);
        $(".top_function_center_bottom_condition_text3").html(fvalue3);
        $('.top_function_center_bottom_condition_area').css('opacity', 0);
        $('.top_function_center_bottom_condition_area2').css('opacity', 1);
    }

}

function beginFromOne() {
    $('.towin_game_button_but_fail').css('display', 'none');
    imgname = ["disinfectant", "gloves", "plastic", "Syringe", "mask", "soap"];
    BLOCK_TYPE = 6
    hidePassBg();
    ALLTIME = nowFilters.Checkpoint1.time;
    SCORE = 0;
    passnumber = 1;
    nowpass = 'Checkpoint1';
    renderCondition();
    allKindScore = [
        { name: "disinfectant", value: 0, type: 1 },
        { name: "gloves", value: 0, type: 2 },
        { name: "plastic", value: 0, type: 3 },
        { name: "Syringe", value: 0, type: 4 },
        { name: "mask", value: 0, type: 5 },
        { name: "soap", value: 0, type: 6 }
    ];
    ctx.clearRect(0, 0, BLOCK_WIDTH * BLOCK_COLS, BLOCK_HEIGHT * BLOCK_ROWS);
    for (var i = 0; i < BLOCK_ROWS; i++) {
        for (var j = 0; j < BLOCK_COLS; j++) {
            rand = parseInt(Math.random() * BLOCK_TYPE) + 1;
            block[i][j] = rand;
        }
    }
    if (check_blast(-1, -1, -1, -1, -1, -1, true)) {
        start(ALLTIME);
    } else {
        for (var i = 0; i < BLOCK_ROWS; i++) {
            for (var j = 0; j < BLOCK_COLS; j++) {
                shape(block[i][j], j * BLOCK_WIDTH, i * BLOCK_WIDTH, 1);
            }
        }
    }

    if (is_restart) {
        if (t1 != -1) {
            cleartime();
            clearInterval(t1);
            is_time = false;
        }
        is_restart = false;
    }
    if (!is_time && TYPE == 1) countDown();

    $(".score").html(SCORE);
}





function check_blast(obj_rows, obj_cols, obj_type, orl_rows, orl_cols, orl_type, mode) { // mode如果为true 那么返回可以消除方块的数量，否则直接执行消除，用于初始化地图做判断
    if (is_blast_time) return false;
    var i = 0;
    var j = 0;
    var turn = false;
    var num = 0;
    var array_rows = new Array(); //待消除列表
    var array_cols = new Array();
    if (obj_type == -1) { // 参数全为-1则为全图检测
        var vertical_rows = new Array();
        var vertical_cols = new Array();
        var flat_rows = new Array();
        var flat_cols = new Array();

        for (var k = 0; k < BLOCK_ROWS; k++)
            for (var l = 0; l < BLOCK_COLS; l++) {
                type = block[k][l];
                vertical_rows = [];
                vertical_cols = [];
                flat_rows = [];
                flat_cols = [];

                i = 0;
                while (block[k][l + i] == type) {
                    flat_rows[i] = k;
                    flat_cols[i] = l + i;
                    i++;
                }

                i = 0;
                while (block[k + i][l] == type) {
                    vertical_rows[i] = k + i;
                    vertical_cols[i] = l;
                    i++;
                }

                check_repeat(flat_rows, flat_cols, vertical_rows, vertical_cols);

                if (flat_rows.length >= 3)
                    for (var m = 0; m < flat_rows.length; m++) {
                        if (flat_rows[m] != -1) {
                            array_rows[num] = flat_rows[m];
                            array_cols[num] = flat_cols[m];
                            num++;
                        }
                    }

                if (vertical_rows.length >= 3)
                    for (var m = 0; m < vertical_rows.length; m++) {
                        if (flat_rows[m] != -1) {
                            array_rows[num] = vertical_rows[m];
                            array_cols[num] = vertical_cols[m];
                            num++;
                        }
                    }
            }
        if (mode) return num;

    } else {
        var orl_vertical_rows = new Array();
        var orl_vertical_cols = new Array();
        var orl_flat_rows = new Array();
        var orl_flat_cols = new Array();
        var obj_vertical_rows = new Array();
        var obj_vertical_cols = new Array();
        var obj_flat_rows = new Array();
        var obj_flat_cols = new Array();
        while (true) {
            if (block[orl_rows][orl_cols + i] == orl_type) {
                orl_flat_rows[j] = orl_rows;
                orl_flat_cols[j] = orl_cols + i;
                j++;
            } else {
                if (turn) break;
                turn = true;
                i = 0;
            }
            if (!turn) i++;
            else i--;
        }

        i = 0;
        j = 0;
        turn = false;
        while (true) { //上下

            if (block[orl_rows + i][orl_cols] == orl_type) {
                orl_vertical_rows[j] = orl_rows + i;
                orl_vertical_cols[j] = orl_cols;
                j++;
            } else {
                if (turn) break;
                turn = true;
                i = 0;
            }
            if (!turn) i++;
            else i--;
        }

        i = 0;
        j = 0;
        turn = false;
        while (true) {
            if (block[obj_rows][obj_cols + i] == obj_type) {
                obj_flat_rows[j] = obj_rows;
                obj_flat_cols[j] = obj_cols + i;
                j++;
            } else {
                if (turn) break;
                turn = true;
                i = 0;
            }
            if (!turn) i++;
            else i--;
        }

        i = 0;
        j = 0;
        turn = false;
        while (true) {
            if (block[obj_rows + i][obj_cols] == obj_type) {
                obj_vertical_rows[j] = obj_rows + i;
                obj_vertical_cols[j] = obj_cols;
                j++;
            } else {
                if (turn) break;
                turn = true;
                i = 0;
            }
            if (!turn) i++;
            else i--;
        }

        // 去掉重复的坐标
        check_repeat(orl_flat_rows, orl_flat_cols, orl_vertical_rows, orl_vertical_cols);
        check_repeat(obj_flat_rows, obj_flat_cols, obj_vertical_rows, obj_vertical_cols);
        var needType = null;
        if (orl_flat_rows.length >= 3)
            for (var k = 0; k < orl_flat_rows.length; k++) {
                if (orl_flat_rows[k] != -1) {
                    array_rows[num] = orl_flat_rows[k];
                    array_cols[num] = orl_flat_cols[k];
                    num++;
                }
            }
        if (orl_vertical_rows.length >= 3)
            for (var k = 0; k < orl_vertical_rows.length; k++) {
                if (orl_flat_cols[k] != -1) {
                    array_rows[num] = orl_vertical_rows[k];
                    array_cols[num] = orl_vertical_cols[k];
                    num++;
                }
            }
        if (obj_flat_rows.length >= 3)
            for (var k = 0; k < obj_flat_rows.length; k++) {
                if (obj_flat_rows[k] != -1) {
                    array_rows[num] = obj_flat_rows[k];
                    array_cols[num] = obj_flat_cols[k];
                    num++;
                }
            }
        if (obj_vertical_rows.length >= 3)
            for (var k = 0; k < obj_vertical_rows.length; k++) {
                if (obj_vertical_rows[k] != -1) {
                    array_rows[num] = obj_vertical_rows[k];
                    array_cols[num] = obj_vertical_cols[k];
                    num++;
                }
            }
        if (mode) return num;
    }
    // if(array_rows.length>=3){
    //     add_score(array_rows.length,array_rows[0]);
    // }

    if (num == 0) {
        move(obj_rows, obj_cols, orl_rows, orl_cols, false);
    } else {
        //if(is_music) {
        hit.play();

        // wx.ready(function() {
        //     var globalAudio=document.getElementById("hit");
        //     setTimeout(function(){
        //        globalAudio.play();
        //         document.addEventListener("WeixinJSBridgeReady", function () { 
        //            globalAudio.play();
        //         }, false); 
        //     },10)




        // });
        //}
        if (TYPE == 1) {
            // if (array_rows.length == 3) addtime(ALLTIME / 30); //2s
            // else if (array_rows.length == 4) addtime(ALLTIME / 12); //5s
            // else if (array_rows.length >= 5) addtime(ALLTIME / 6); //10s
        }

        var time = 1;
        var change = false; // 用于判断放大还是缩小
        timer_blast = setInterval(function () {
            if (time > 0) {
                is_blast_time = true;

                for (var k = 0; k < array_cols.length; k++) {
                    ctx.clearRect(array_cols[k] * BLOCK_WIDTH - 2, array_rows[k] * BLOCK_WIDTH - 2, BLOCK_HEIGHT + 5, BLOCK_WIDTH + 5);
                    off = parseInt(BLOCK_WIDTH * 0.5 * (1 - time));
                    shape(block[array_rows[k]][array_cols[k]], 1 / time * (array_cols[k] * BLOCK_WIDTH + off), 1 / time * (array_rows[k] * BLOCK_WIDTH + off), time);
                }
                if (!change && (time < 1.15)) {
                    time += 0.05;
                    if (time >= 1.15) change = true;
                } else {
                    time -= 0.1;
                }
            } else {
                //再清除一次图形
                for (var k = 0; k < array_cols.length; k++) {
                    ctx.clearRect(array_cols[k] * BLOCK_WIDTH - 2, array_rows[k] * BLOCK_WIDTH - 2, BLOCK_HEIGHT + 5, BLOCK_WIDTH + 5);
                }

                is_blast_time = false;
                clearInterval(timer_blast);
                for (var m = 0; m < array_rows.length; m++) {
                    if (block[array_rows[m]][array_cols[m]] != 7) {
                        add_score2(1)
                    }
                    allKindScore = allKindScore.map(item => {
                        return item.type == block[array_rows[m]][array_cols[m]] ? { ...item, value: item.value + 1 } : item
                    })
                    if(nowFilters[nowpass].condition.length == 1){
                        var exactNumber = allKindScore.filter(item =>{
                           return  item.type == nowFilters[nowpass].condition[0].type
                        })
                        var nowNumber =  nowFilters[nowpass].condition[0].value- exactNumber[0].value
                        if(nowNumber <=0){
                            var needRender1 = 0;
                        }else{
                            var needRender1 = nowNumber;
                        }
                        $(".top_function_center_bottom_condition_text").html('x'+needRender1);
                    }else{
                        var exactNumber1 = allKindScore.filter(item =>{
                            return  item.type == nowFilters[nowpass].condition[0].type
                         })
                         var exactNumber2 = allKindScore.filter(item =>{
                            return  item.type == nowFilters[nowpass].condition[1].type
                         })
                         var nowNumber1 =  nowFilters[nowpass].condition[0].value- exactNumber1[0].value;
                         var nowNumber2 =  nowFilters[nowpass].condition[1].value- exactNumber2[0].value
                         if(nowNumber1 <=0){
                             var needRender2 = 0;
                         }else{
                             var needRender2 = nowNumber1;
                         }
                         if(nowNumber2 <=0){
                            var needRender3 = 0;
                        }else{
                            var needRender3 = nowNumber2;
                        }
                        $(".top_function_center_bottom_condition_text2").html('x'+needRender2);
                        $(".top_function_center_bottom_condition_text3").html('x'+needRender3);
                    }
                   
                    block[array_rows[m]][array_cols[m]] = 0;
                    ctx.clearRect(array_cols[m] * BLOCK_WIDTH, array_rows[m] * BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH);
                }
                drop();
            }
        },
            BLAST_TIME);
    }
}

function check_repeat(flat_rows, flat_cols, vertical_rows, vertical_cols) {
    var flat_len = 0;
    var vertical_len = 0;
    // 去掉重复的坐标
    for (var i = 0; i < flat_rows.length; i++) {
        for (var j = 0; j < i; j++) {
            if ((flat_rows[i] == flat_rows[j]) && (flat_cols[i] == flat_cols[j])) {
                flat_rows[i] = -1;
                flat_cols[i] = -1;
            }
        }
    }
    for (var i = 0; i < vertical_rows.length; i++) {
        for (var j = 0; j < i; j++) {
            if ((vertical_rows[i] == vertical_rows[j]) && (vertical_cols[i] == vertical_cols[j])) {
                vertical_rows[i] = -1;
                vertical_cols[i] = -1;
            }
        }
    }

    for (var i = 0; i < flat_rows.length; i++) {
        if (flat_rows[i] != -1) flat_len++;
    }
    for (var i = 0; i < vertical_rows.length; i++) {
        if (vertical_rows[i] != -1) vertical_len++;
    }
}

function move(obj_rows, obj_cols, orl_rows, orl_cols, check) {
    if (obj_rows < 0 || obj_rows > 7 || obj_cols < 0 || obj_cols > 7 || orl_rows < 0 || orl_rows > 7 || orl_cols < 0 || orl_cols > 7) {
        return false
    }
    set_focus("cancel", focus_rows, focus_cols);
    var mode;
    cols = orl_cols * BLOCK_WIDTH;
    cols2 = obj_cols * BLOCK_WIDTH;
    rows = orl_rows * BLOCK_WIDTH;
    rows2 = obj_rows * BLOCK_WIDTH;
    orl_type = block[orl_rows][orl_cols];
    obj_type = block[obj_rows][obj_cols];
    if (obj_rows == orl_rows) { // 横向交换
        if (obj_cols > orl_cols) { //向右换
            timer = setInterval(function () {
                if (obj_cols * BLOCK_WIDTH >= cols) {
                    is_move_time = true;
                    ctx.clearRect(orl_cols * BLOCK_WIDTH, orl_rows * BLOCK_WIDTH, 2 * BLOCK_HEIGHT, BLOCK_WIDTH); //Clear the canvas
                    shape(obj_type, cols2, rows2, 1);
                    shape(orl_type, cols, rows, 1);
                    cols += MOVE_PIXEL;
                    cols2 -= MOVE_PIXEL;
                } else {
                    is_move_time = false;
                    clearInterval(timer);
                    block[orl_rows][orl_cols] = obj_type;
                    block[obj_rows][obj_cols] = orl_type;
                    if (check) check_blast(orl_rows, orl_cols, block[orl_rows][orl_cols], obj_rows, obj_cols, block[obj_rows][obj_cols], false);
                }
            },
                MOVE_TIME);
        } else { //向左换
            timer = setInterval(function () {
                if (obj_cols * BLOCK_WIDTH <= cols) {
                    is_move_time = true;
                    ctx.clearRect(obj_cols * BLOCK_WIDTH, obj_rows * BLOCK_WIDTH, 2 * BLOCK_HEIGHT, BLOCK_WIDTH); //Clear the canvas
                    shape(obj_type, cols2, rows2, 1);
                    shape(orl_type, cols, rows, 1);
                    cols -= MOVE_PIXEL;
                    cols2 += MOVE_PIXEL;
                } else {
                    is_move_time = false;
                    clearInterval(timer); //Stop setInterval() when it arrives
                    block[orl_rows][orl_cols] = obj_type;
                    block[obj_rows][obj_cols] = orl_type;
                    if (check) check_blast(orl_rows, orl_cols, block[orl_rows][orl_cols], obj_rows, obj_cols, block[obj_rows][obj_cols], false);
                }
            },
                MOVE_TIME);
        }
    } else if (obj_cols == orl_cols) { // 纵向交换
        if (obj_rows > orl_rows) { //向下换
            timer = setInterval(function () {
                if (obj_rows * BLOCK_WIDTH >= rows) {
                    is_move_time = true;
                    ctx.clearRect(orl_cols * BLOCK_WIDTH, orl_rows * BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH * 2); //Clear the canvas
                    shape(obj_type, cols2, rows2, 1);
                    shape(orl_type, cols, rows, 1);
                    rows += MOVE_PIXEL;
                    rows2 -= MOVE_PIXEL;
                } else {
                    is_move_time = false;
                    clearInterval(timer); //Stop setInterval() when it arrives
                    block[orl_rows][orl_cols] = obj_type;
                    block[obj_rows][obj_cols] = orl_type;
                    if (check) check_blast(orl_rows, orl_cols, block[orl_rows][orl_cols], obj_rows, obj_cols, block[obj_rows][obj_cols], false);
                }
            },
                MOVE_TIME);
        } else { // 向上换
            timer = setInterval(function () {
                if (obj_rows * BLOCK_WIDTH <= rows) {
                    is_move_time = true;
                    ctx.clearRect(obj_cols * BLOCK_WIDTH, obj_rows * BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH * 2); //Clear the canvas
                    shape(obj_type, cols2, rows2, 1);
                    shape(orl_type, cols, rows, 1);
                    rows -= MOVE_PIXEL;
                    rows2 += MOVE_PIXEL;
                } else {
                    is_move_time = false;
                    clearInterval(timer);
                    block[orl_rows][orl_cols] = obj_type;
                    block[obj_rows][obj_cols] = orl_type;
                    if (check) check_blast(orl_rows, orl_cols, block[orl_rows][orl_cols], obj_rows, obj_cols, block[obj_rows][obj_cols], false);
                }
            },
                MOVE_TIME);
        }
    }
}

function drop() {
    //初始化
    var need = new Array(); // 二维数组，用来表示每个位置需要下降的高度
    var need_max = new Array(); // 需求的最大值 不会递减
    var is_do = new Array(); // 在动画中标记已经走到的位置
    var list = new Array(); // 待加入地图的新方块列表
    var list_need = new Array(); // 这个新方块需要下落的高度
    var is_drop_line = new Array(); //一维数组 用来记录当前这列是否是下落状态
    var is_line_draw = new Array(); // 一维数组 用来记录当前这列是否绘制过
    var line_times = new Array();
    var is_drop_block = new Array(); // 二维数组，是否需要下落刷新
    for (var i = -1; i <= BLOCK_ROWS; i++) {
        need[i] = new Array();
        need_max[i] = new Array();
        is_do[i] = new Array();
        list[i] = new Array();
        is_drop_block[i] = new Array();
    }

    for (var i = 0; i < BLOCK_ROWS; i++) {
        for (var j = 0; j < BLOCK_COLS; j++) {
            need[i][j] = 0;
            need_max[i][j] = 0;
            is_do[i][j] = 0;
            list[i][j] = 0;
            is_drop_block[i][j] = true;
        }
        is_drop_line[i] = false;
        is_line_draw[i] = 0;
        line_times[i] = 0;
        list_need[i] = 0;
    }


    //初始化下落方块数据
    var max_drop = 0;
    for (var i = 0; i < BLOCK_ROWS; i++) {
        for (var j = 0; j < BLOCK_COLS; j++) {
            if (block[i][j] == 0) {
                for (var k = 0; k < i; k++) {
                    if (block[k][j] != 0) {
                        need[k][j] += BLOCK_HEIGHT;
                        need_max[k][j] += BLOCK_HEIGHT;
                        if (need[k][j] > max_drop) max_drop = need[k][j];
                    }
                }
                need[i][j] = -1;
                need_max[i][j] = -1;
                line_times[j]++;
            }
        }
    }
    //判断是否空位置要比某个下落的位置多，为了解决消除第一行不显示动画的问题
    for (var i = 0; i < BLOCK_COLS; i++) {
        if (line_times[i] * BLOCK_WIDTH > max_drop) max_drop = line_times[i] * BLOCK_WIDTH;
    }

    //按需求生成新方块
    var line_max = new Array();
    var list_max = new Array();
    for (var i = 0; i < BLOCK_ROWS; i++) {
        line_max[i] = 0;
        list_max[i] = 0;
        for (var j = 0; j < BLOCK_COLS; j++) {
            if (need[j][i] == -1) {
                line_max[i] += BLOCK_HEIGHT;
                list_max[i] += BLOCK_HEIGHT;
                list_need[i] += BLOCK_HEIGHT;
            }

        }
        if (line_max[i] > 0) is_drop_line[i] = true;
    }
    for (var j = 0; j < BLOCK_COLS; j++) {
        for (var i = BLOCK_ROWS - 1; i >= 0; i--) {
            if (need_max[i][j] == 0) is_drop_block[i][j] = false;
            else break;
        }
    }
    //将每列需求的方块个数装入新方块数组中
    for (var i = 0; i < BLOCK_COLS; i++) {
        var j = 0;
        while (line_max[i] > 0) {
            list[i][j] = parseInt(Math.random() * BLOCK_TYPE) + 1;
            line_max[i] -= BLOCK_WIDTH;
            j++;
        }
    }
    timer_drop = setInterval(function () {
        is_drop_time = true;
        if (max_drop > 0) {
            for (var i = 0; i < BLOCK_ROWS; i++)
                for (var j = 0; j < BLOCK_COLS; j++)
                    if (is_drop_block[i][j]) ctx.clearRect(j * BLOCK_WIDTH, i * BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_WIDTH);

            for (var i = 0; i < BLOCK_ROWS; i++) is_line_draw[i] = 0;

            for (var i = 0; i < BLOCK_ROWS; i++)
                for (var j = 0; j < BLOCK_COLS; j++)
                    if (is_drop_block[i][j])
                        if (need[i][j] > 0) { // 处于下落中的方块
                            if (is_do[i][j] < need_max[i][j]) is_do[i][j] += DROP_PIXEL;
                            shape(block[i][j], j * BLOCK_WIDTH, i * BLOCK_WIDTH + is_do[i][j], 1);
                        } else if (need[i][j] == 0) // 已经停止的方块
                            shape(block[i][j], j * BLOCK_WIDTH, i * BLOCK_WIDTH, 1);
                        else if ((need[i][j] == -1) && (is_line_draw[j] == 0)) { // 对于被消除的方块而言，新生成的方块
                            is_line_draw[j] = 1;
                            if (is_do[i][j] < list_need[j]) is_do[i][j] += DROP_PIXEL;
                            for (var k = 0; k < parseInt(list_max[j] / BLOCK_WIDTH); k++)
                                if (list[j][k] > 0) {
                                    shape(list[j][k], j * BLOCK_WIDTH, is_do[i][j] - (k + 1) * BLOCK_WIDTH, 1)
                                }
                        }
            max_drop -= DROP_PIXEL;
        } else {
            is_drop_time = false;
            clearInterval(timer_drop);
            for (var i = BLOCK_ROWS - 1; i >= 0; i--)
                for (var j = BLOCK_COLS - 1; j >= 0; j--) {
                    if (block[i][j] == 0) { // 对消除后的方块的状态进行转移，正确调整至下落后的状态
                        var k = 0;
                        var sum = 0;
                        while (sum == 0) {
                            k++;
                            if (i - k < 0) { // 如果是第一行的，那么就从list中取新生成的方块
                                sum = list[j][0];
                                for (var l = 1; l < list[j].length; l++) list[j][l - 1] = list[j][l];
                            } else { // 否则就拿上一行的方块
                                sum = block[i - k][j];
                            }
                        }

                        if (i - k < 0) {
                            block[i][j] = sum;
                        } else {
                            block[i][j] = block[i - k][j];
                            block[i - k][j] = 0;
                        }
                    }
                }
            check_blast(-1, -1, -1, -1, -1, -1, false);
            check_over();
        }
    },
        DROP_TIME);
}

function addtips(x1, y1, x2, y2) {
    var index = (x1 * BLOCK_COLS + y1) * 100 + (x2 * BLOCK_COLS + y2);
    var i;
    for (i = 0; i < tip.length; i++) {
        if (tip[i] == index) break;
    }
    if (i == tip.length) tip[tip.length] = index;
}

function check_over() {
    var sum = 0;
    var this_type = -1;
    tip = [];
    tipindex = 0;
    for (var i = 0; i < BLOCK_ROWS; i++)
        for (var j = 0; j < BLOCK_COLS; j++) {
            this_type = block[i][j];
            if (this_type == block[i - 1][j]) {
                sum++;
                if (this_type == block[i + 1][j + 1]) {
                    addtips(i + 1, j, i + 1, j + 1);
                } else if (this_type == block[i + 1][j - 1]) {
                    addtips(i + 1, j, i + 1, j - 1);
                } else if (this_type == block[i - 2][j - 1]) {
                    addtips(i - 2, j, i - 2, j - 1);
                } else if (this_type == block[i - 2][j + 1]) {
                    addtips(i - 2, j, i - 2, j + 1);
                } else if (this_type == block[i + 2][j]) {
                    addtips(i + 1, j, i + 2, j);
                } else if (this_type == block[i - 3][j]) {
                    addtips(i - 2, j, i - 3, j);
                } else if (this_type == block[i - 2][j]) {

                } else {
                    sum--;
                }
            }
            if (this_type == block[i][j - 1]) {
                sum++;
                if (this_type == block[i + 1][j + 1]) {
                    addtips(i, j + 1, i + 1, j + 1);
                } else if (this_type == block[i - 1][j + 1]) {
                    addtips(i, j + 1, i - 1, j + 1);
                } else if (this_type == block[i + 1][j - 2]) {
                    addtips(i, j - 2, i + 1, j - 2);
                } else if (this_type == block[i - 1][j - 2]) {
                    addtips(i, j - 2, i - 1, j - 2);
                } else if (this_type == block[i][j + 2]) {
                    addtips(i, j + 1, i, j + 2);
                } else if (this_type == block[i][j - 3]) {
                    addtips(i, j - 2, i, j - 3);
                } else if (this_type == block[i][j - 2]) {

                } else {
                    sum--;
                }
            }
            if (this_type == block[i - 2][j]) {
                sum++;
                if (this_type == block[i - 1][j - 1]) {
                    addtips(i - 1, j, i - 1, j - 1);
                } else if (this_type == block[i - 1][j + 1]) {
                    addtips(i - 1, j, i - 1, j + 1);
                } else {
                    sum--;
                }
            }
            if (this_type == block[i][j - 2]) {
                sum++;
                if (this_type == block[i - 1][j - 1]) {
                    addtips(i, j - 1, i - 1, j - 1);
                } else if (this_type == block[i + 1][j - 1]) {
                    addtips(i, j - 1, i + 1, j - 1);
                } else {
                    sum--;
                }
            }
        }
    if (sum == 0) {
        gameover(SCORE, ALL_SUM, ONE_SUM, 0);
    }
}

function add_score(n) {
    if (n == 3) SCORE += 300;
    else if (n == 4) SCORE += 500;
    else SCORE += 200 * n;
    // if(n>=3){
    //     SCORE += 100 * n;
    // }
    if (n > ONE_SUM) ONE_SUM = n;
    ALL_SUM += n;
    $(".score").html(SCORE);
}


function add_score2(n) {
    SCORE += 100 * n;
    $(".score").html(SCORE);
}

function shape(type, x, y, scale) {
    ctx.globalCompositeOperation = "source-over";
    var img = new Image();
    img.src = "svg/" + imgname[type - 1] + ".png";
    var fakeBLOCK_WIDTH = 2 * BLOCK_WIDTH;
    var fakeBLOCK_HEIGHT = 2 * BLOCK_HEIGHT;
    if (img.complete) {
        ctx.drawImage(img, x * scale, y * scale, BLOCK_WIDTH * scale, BLOCK_HEIGHT * scale);
    } else {
        img.onload = function () {
            ctx.drawImage(img, x * scale, y * scale, BLOCK_WIDTH * scale, BLOCK_HEIGHT * scale);
        };
    }
}

function mouse_touch_down(x, y) {
    if (is_move_time || is_blast_time || is_drop_time || is_tips) return false;

    is_press = true;
    now_cols = parseInt(x / BLOCK_HEIGHT);
    now_rows = parseInt(y / BLOCK_WIDTH);

    if (focus_rows == -1) {
        set_focus("add", now_rows, now_cols);
    } else {
        if ((focus_rows == now_rows) && (focus_cols == now_cols)) {
            set_focus("cancel", focus_rows, focus_cols);
        } else if (Math.abs(focus_rows - now_rows + focus_cols - now_cols) == 1) {
            move(now_rows, now_cols, focus_rows, focus_cols, true);
        } else {
            set_focus("cancel", focus_rows, focus_cols);
            set_focus("add", now_rows, now_cols);
        }
    }
}

function mouse_touch_move(x, y) {
    if (!is_press || is_move_time || is_blast_time || is_drop_time || is_tips) return false;

    var this_cols = parseInt(x / BLOCK_WIDTH);
    var this_rows = parseInt(y / BLOCK_WIDTH);

    if (this_rows == focus_rows) {
        if ((this_cols > focus_cols) && (focus_cols < 7)) // 向右
            move(focus_rows, focus_cols, focus_rows, focus_cols + 1, true);
        else if ((this_cols < focus_cols) && (focus_cols > 0)) move(focus_rows, focus_cols, focus_rows, focus_cols - 1, true);
    } else if (this_cols == focus_cols) {
        if ((this_rows > focus_rows) && (focus_rows < 7)) move(focus_rows, focus_cols, focus_rows + 1, focus_cols, true);
        else if ((this_rows < focus_rows) && (focus_rows > 0)) move(focus_rows, focus_cols, focus_rows - 1, focus_cols, true);
    }
}

function mouse_touch_end() {
    if (is_tips) return false;
    set_focus("cancel", focus_rows, focus_cols);
    focus_rows = -1;
    focus_cols = -1;
    is_press = false;
}

function mouse_down(event) {
    mouse_touch_down(event.offsetX, event.offsetY);
}

function mouse_move(event) {
    mouse_touch_move(event.offsetX, event.offsetY);
}

function mouse_up(event) {
    is_press = false;
}

function set_focus(mode, rows, cols) {
    if (rows < 0 || rows > 7 || cols < 0 || cols > 7) {
        return false
    }
    var this_x = cols * BLOCK_WIDTH;
    var this_y = rows * BLOCK_HEIGHT;
    if (mode == "add") {
        focus_rows = now_rows;
        focus_cols = now_cols;
        ctx.strokeStyle = "#FD7418";
        ctx.globalCompositeOperation = "source-over";
    } else if (mode = "cancel") {
        focus_rows = -1;
        focus_cols = -1;
        ctx.strokeStyle = "#EEEEEE";
        ctx.globalCompositeOperation = "destination-out";
    }
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this_x + 1, this_y + 15);
    ctx.lineTo(this_x + 1, this_y + 1);
    ctx.moveTo(this_x + 0, this_y + 1);
    ctx.lineTo(this_x + 15, this_y + 1);
    ctx.moveTo(this_x + 25, this_y + 1);
    ctx.lineTo(this_x + 39, this_y + 1);
    ctx.moveTo(this_x + 39, this_y + 0);
    ctx.lineTo(this_x + 39, this_y + 15);
    ctx.moveTo(this_x + 39, this_y + 25);
    ctx.lineTo(this_x + 39, this_y + 39);
    ctx.moveTo(this_x + 39, this_y + 39);
    ctx.lineTo(this_x + 25, this_y + 39);
    ctx.moveTo(this_x + 15, this_y + 39);
    ctx.lineTo(this_x + 1, this_y + 39);
    ctx.moveTo(this_x + 1, this_y + 39);
    ctx.lineTo(this_x + 1, this_y + 25);
    ctx.stroke();
}




function gameover(score, all_sum, one_sum, type) {
    // var over = document.getElementById("over");
    // over.load();
    // over.play();

    // var count = parseInt(localStorage.getItem("count")) + 1;
    // localStorage.setItem("count", count);
    // localStorage.setItem(count, "" + score + "," + (new Date()).valueOf());
    // var info = type == 0 ? "无法移动" : "时间结束";
    hidePassBg();
    var nowfilter = nowFilters[nowpass].condition;
    if (TYPE == 1 && type == 0 && t1 != -1) {
        clearInterval(t1);
        is_time = false;
    }
    var compareArr = []
    for (var a = 0; a < nowfilter.length; a++) {
        compareArr.push(allKindScore.map(item => {
            return item.name == nowfilter[a].name ? { ...item, expect: nowfilter[a].value } : { name: 'needcancel' }
        }))
    }
    for (var b = 0; b < compareArr.length; b++) {
        compareArr[b] = compareArr[b].filter(item => {
            return item.name != 'needcancel'
        })
    }
    var compareResult = compareArr.map(item => {
        return item[0].value - item[0].expect
    })
    function check(number) {
        return number >= 0;
    }
    var whtherPass = compareResult.every(check)
    if (whtherPass) {
        var ssnumber = passnumber + 1;
        var sss = './png/pass' + ssnumber + '.png'
        if (ssnumber < 11) {
            preloadTheImg(sss)
        }

        if (ssnumber == 10) {
            preloadTheImg('./png/success.png');
        }
        if (passnumber <= Object.keys(nowFilters).length - 1) {
            var needimg = './png/pass' + passnumber + '.png';
            $('.game_pass_img').attr("src", needimg);
            $('.game_pass_img').css('display', 'block');
            $('.next_pass_button_area').css('z-index', 12);
            $('.next_pass_button').css('display', 'block');
            passnumber += 1;
            if (passnumber >= 7) {
                imgname = ["disinfectant", "gloves", "plastic", "Syringe", "mask", "soap", "virus"];  //方块集合
                BLOCK_TYPE = 7
            }
            nowpass = 'Checkpoint' + passnumber;
            var nextPassTime = nowFilters[nowpass].time;
            ALLTIME = nextPassTime;
        } else {
            saveScore();
            var needimg = './png/success.png';
            $('.game_pass_img').attr("src", needimg);
            $('.game_pass_img').css('display', 'block');
            $('.next_pass_button_area').css('display', 'none');
            $('.next_pass_button_area_success').css('z-index', 12);
            $('.next_pass_button_area_success').css('display', 'block');
            $('.next_pass_button_area_success').css('display', 'flex');
            setTimeout(function () {
                $('.towin_game_button').css('display', 'block');
            }, 15)



        }
    } else {
        if(passnumber>=6){
            $('.towin_game_button_but_fail').css('display', 'block');
            saveScore();
        }
        var needimg = './png/pass_fail.png';
        $('.game_pass_img').attr("src", needimg);
        $('.game_pass_img').css('display', 'block');
        $('.next_pass_button_area').css('z-index', 12);
        $('.restart_game_button').css('display', 'block');
        
    }



};

function toWin() {
    //window.location = 'https://www.wenjuan.com/s/VRFr6zt/'
    //saveScore();
    if(canForturn){
        fortureResult()
    }else{
        var willimg = './png/only_one_chance.png';
        $('.fail_money_area').css('display', 'block');
        $('.fail_money_area').css('z-index', 999999999999999999999999999);
        setTimeout(function(){
            $('.fail_money_area_img').attr("src", willimg);
            $('.fail_money_area_img').css('display', 'block');
        },50)
    }
}



function  cllbackPassimg(){
    $('.fail_money_area').css('display', 'none');
    $('.success_money_area').css('display', 'none');
}



function validatePhone(){
    var phone = document.getElementById("success_money_area_bg_fake_input").value
    if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(phone))){ 
        alert("手机号码有误，请重填");  
        return false; 
    }else{
        return true
    }
    
}


function getWInMoney(){
    $.ajax({
        url: 'https://sss.hemajia.net/jk/user/oauth2',
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(info),
        dataType: 'json',
        success: function (res) {
            wxName = res.data.nickname;
            wxAvatar = res.data.headimgurl;
            userid = res.data.userid
        }
    })
    
}


function getprobability(){
    $.ajax({
        url: 'https://sss.hemajia.net/jk/user/selectByGailv  ',
        type: "post",
        data:'',
        contentType: 'application/json',
        dataType: 'json',
        success: function (res) {
            nowProbability = res.data[0].zjglv;
        }
    })
}


function fortureResult(){
    $.ajax({
        url: 'https://sss.hemajia.net/jk/user/selectByGailv',
        type: "post",
        data:'',
        contentType: 'application/json',
        dataType: 'json',
        success: function (res) {
            nowProbability = res.data[0].zjglv;
            var wheprobability = nowProbability/100;
            if(Math.random()<=wheprobability){
                isWin = 1;
                var willimg = './png/no_change.png';
                $('.success_money_area').css('display', 'block');
                $('.success_money_area').css('z-index', 999999999999999999999999999); 
                canForturn = false;
                var info = {
                    'openid': userid,
                    'phone':'',
                    isWin,
                }
                $.ajax({
                    url: 'https://sss.hemajia.net/jk/user/insert',
                    type: "post",
                    data:info,
                    contentType:  'application/x-www-form-urlencoded;charset=UTF-8' ,
                    dataType: 'json',
                    success: function (res) {
                        
                    }
                })
            }else{
                isWin = 2;
                var willimg = './png/no_change.png';
                $('.fail_money_area').css('display', 'block');
                $('.fail_money_area').css('z-index', 999999999999999999999999999);
                var info = {
                    'openid': userid,
                    'phone':'',
                    isWin,
                }
                $.ajax({
                    url: 'https://sss.hemajia.net/jk/user/insert',
                    type: "post",
                    data:info,
                    contentType:  'application/x-www-form-urlencoded;charset=UTF-8' ,
                    dataType: 'json',
                    success: function (res) {
                        
                    }
                })
                setTimeout(function(){
                    $('.fail_money_area_img').attr("src", willimg);
                    $('.fail_money_area_img').css('display', 'block');
                    canForturn = false
                },50)
            }







        }
    })


}

function searchFirst(){
    var whether =  localStorage.getItem("nowCode1");
    var info = {
        'openid': userid,
    };
    $.ajax({
        url: 'https://sss.hemajia.net/jk/user/checkByOpenid',
        type: "post",
        data:JSON.stringify(info),
        contentType: 'application/json',
        dataType: 'json',
        success: function (res) {
            canForturn = res.flag;
        }
    })
   
}


function saveFortureInfo(){
    var whether =  localStorage.getItem("nowCode1");
    var phone1 = document.getElementById("success_money_area_bg_fake_input").value;
    if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(phone1))){ 
        alert("手机号码有误，请重填");  
        return false; 
    }
    var info = {
        'openid': userid,
        'phone':phone1,
        isWin,
    }
    $.ajax({
        url: 'https://sss.hemajia.net/jk/user/insert',
        type: "post",
        data:info,
        contentType:  'application/x-www-form-urlencoded;charset=UTF-8' ,
        dataType: 'json',
        success: function (res) {
            if(res.flag){
                alert('领取成功，后续工作人员将为您充值');
                cllbackPassimg();
            }else{
                alert('领取失败，请重新进入游戏');
            }
        }
    })
}

function toRank() {
    getRank()
    $('.game_pass_img_rank').css('display', 'block');
    $('.game_pass_img_rank').css('display', 'flex');
    $('.game_pass_img_rank').css('justify-content', 'center');
    $('.game_pass_img_rank').css('align-items', 'center');
}

function hideRank() {
    $('.game_pass_img_rank').css('display', 'none');
}



function getCode() { // 非静默授权，第一次有弹框
    var code = ''
    var local = window.location.href // 获取页面url
    var appid = 'wxd380519f6d1d8516'
    code = getUrlCode().code // 截取code;
    if (code == null || code === '') { // 如果没有code，则去请求
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd380519f6d1d8516&redirect_uri=https://sss.hemajia.net/duiduipeng&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`
    } else {
        // 处理code
        localStorage.setItem('nowCode1', code);
        console.log(typeof code, 222222222222)
        var info = {
            'code': code,
        };
        $.ajax({
            url: 'https://sss.hemajia.net/jk/user/oauth2',
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify(info),
            dataType: 'json',
            success: function (res) {

                console.log(res.data,66666666666666666666666)
                if(res.flag){
                    wxName = res.data.nickname;
                    wxAvatar = res.data.headimgurl;
                    userid = res.data.userid;
                }else{
                   window.location.href = 'https://sss.hemajia.net/duiduipeng/index.html'
                }

            }
        })
    }

}





function getUrlCode() { // 截取url中的code方法
    var nnn = window.location.href;
    //var nnn = 'http://sss.hemajia.net/duiduipeng/index.html?code=031cPn0005u2zK18wo100peLqE4cPn08&state=STATE';
    var url = nnn;
    var winUrl = url
    var theRequest = new Object()
    if (url.indexOf("?") != -1) {
        var str = url.substr(1)
        var strs = str.split("&")
        var newarr = [];
        for (let j = 0; j < strs.length; j++) {
            if (strs[j].indexOf("?") != -1) {
                var index = strs[j].lastIndexOf("?")
                newarr.push(strs[j].substring(index + 1, strs[j].length))
            } else {
                newarr.push(strs[j])
            }
        }


        for (var i = 0; i < newarr.length; i++) {
            theRequest[newarr[i].split("=")[0]] = (newarr[i].split("=")[1])
        }
    }
    return theRequest

}

//获取排行榜
function getRank() {
    $.ajax({
        url: 'https://sss.hemajia.net/jk/user/list',
        type: "post",
        data: '{}',
        contentType: 'application/json',
        success: function (res) {
            rankList = res.data
            var topTen = rankList.slice(0, 10);
            for (let i = 0; i < topTen.length; i++) {
                var nowitem_avatar = '#rank_avatar' + (i + 1);
                var nowitem_name = '#rank_name' + (i + 1);
                var nowitem_score = '#rank_score' + (i + 1);
                $(nowitem_avatar).attr("src", topTen[i].headimgurl);
                $(nowitem_name).html(topTen[i].nickname);
                $(nowitem_score).html(topTen[i].integral);
            }
        }
    })
}



//保存积分
function saveScore() {
    var info = {
        "integral": JSON.stringify(SCORE),  //积分
        "userid": userid    //用户id
    };
    $.ajax({
        url: 'https://sss.hemajia.net/jk/user/addByUserid',
        type: "post",
        data: JSON.stringify(info),
        contentType: 'application/json',
        success: function (res) {


        }
    })
}



function music() {
    // wx.ready(function() {
    //     var globalAudio=document.getElementById("bgm");
    //     setTimeout(function(){
    //        globalAudio.play();
    //         document.addEventListener("WeixinJSBridgeReady", function () { 
    //            globalAudio.play();
    //         }, false); 
    //     },10)




    // });
    // if (bgm.paused) {
    //     bgm.play();
    //     is_music = true;
    // } else {
    //     bgm.pause();
    //     is_music = false;
    // }
};

// function rank() {
//     var count = parseInt(localStorage.getItem("count"));
//     var content = "<div style=\"overflow-y:scroll;width:100%;height:100%\">" + "<table class=\"bordered\"><thead><tr><th>排名</th><th>分数</th><th>时间</th></tr></thead>";
//     var data = new Array(count);
//     for (var i = 0; i < count; i++) {
//         data[i] = localStorage.getItem(i + 1).split(",");
//     }
//     data.sort(function (a, b) {
//         if (parseInt(a[0]) > parseInt(b[0]) || (parseInt(a[0]) == parseInt(b[0]) && a[1] <= b[1])) return -1;
//         else return 1;
//     });
//     for (var i = 0; i < count; i++) {
//         var score = data[i][0];
//         var time = date(data[i][1]);
//         content += "<tr><td>" + (i + 1) + "</td><td>" + score + "</td><td>" + time + "</td></tr>";
//     }
//     content += "</table></div>";
//     layer.open({
//         type: 1,
//         title: '排行榜',
//         shift: 3,
//         area: ["600px", "400px"],
//         content: content
//     });
// }

// function scorehistory() {
//     var count = parseInt(localStorage.getItem("count"));
//     var content = "<div style=\"overflow-y:scroll;width:100%;height:100%\">" + "<table class=\"bordered\"><thead><tr><th>分数</th><th>时间</th></tr></thead>";
//     var data = new Array(count);
//     for (var i = 0; i < count; i++) {
//         data[i] = localStorage.getItem(i + 1).split(",");
//     }
//     data.sort(function (a, b) {
//         if (a[1] >= b[1]) return -1;
//         else return 1;
//     });
//     for (var i = 0; i < count; i++) {
//         var score = data[i][0];
//         var time = date(data[i][1]);
//         content += "<tr><td>" + score + "</td><td>" + time + "</td></tr>";
//     }
//     content += "</table></div>";
//     layer.open({
//         type: 1,
//         title: '历史数据',
//         shift: 3,
//         area: ["600px", "400px"],
//         content: content
//     });
// }

function date(time) {
    var d = new Date(parseInt(time));
    var Y = d.getFullYear();
    var M = parseInt(d.getMonth());
    M = (M + 1) < 10 ? ("0" + (M + 1)) : (M + 1);
    var D = parseInt(d.getDate());
    D = D < 10 ? ("0" + D) : D;
    var h = parseInt(d.getHours());
    h = h < 10 ? ("0" + h) : h;
    var m = parseInt(d.getMinutes());
    m = m < 10 ? ("0" + m) : m;
    var s = parseInt(d.getSeconds());
    s = s < 10 ? ("0" + s) : s;
    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
}



function restart() {
    if (is_move_time || is_blast_time || is_drop_time) return false;
    is_restart = true;
    is_tips = false;
    start(ALLTIME);
}

function sleep(obj, iMinSecond) {
    if (window.eventList == null) window.eventList = new Array();
    var ind = -1;
    for (var i = 0; i < window.eventList.length; i++) {
        if (window.eventList[i] == null) {
            window.eventList[i] = obj;
            ind = i;
            break;
        }
    }
    if (ind == -1) {
        ind = window.eventList.length;
        window.eventList[ind] = obj;
    }
    setTimeout("GoOn(" + ind + ")", 1000);
}

function GoOn(ind) {
    var obj = window.eventList[ind];
    window.eventList[ind] = null;
    if (obj.NextStep) obj.NextStep();
    else obj();
}

function tips() {
    if (is_press || is_move_time || is_blast_time || is_drop_time || is_tips) return false;
    if (tip.length == 0) check_over();
    var index = tip[tipindex];
    if (tipindex == tip.length - 1) tipindex = 0;
    else tipindex++;

    var first = parseInt(index / 100);
    var second = index % 100;

    var x1 = parseInt(first / BLOCK_COLS);
    var y1 = first % BLOCK_COLS;
    var x2 = parseInt(second / BLOCK_COLS);
    var y2 = second % BLOCK_COLS;

    is_tips = true;
    set_focus("add", x1, y1);
    sleep(this, 10);
    this.NextStep = function () {
        set_focus("cancel", x1, y1);
        sleep(this, 10);
        this.NextStep = function () {
            if (is_tips) {
                set_focus("add", x2, y2);
                sleep(this, 10);
                this.NextStep = function () {
                    set_focus("cancel", x2, y2);
                    is_tips = false;
                }
            }
        }
    }
}

function normal() {
    if (is_move_time || is_blast_time || is_drop_time) return false;
    TYPE = 0;
    restart();
}

function timerial(ttt) {
    if (is_move_time || is_blast_time || is_drop_time) return false;
    TYPE = 1;
    start(ttt);
}

function starttime() {
    if (ALLTIME - 10 >= 0) {
        ALLTIME -= 10;
    }
    $(".innter_time").html(ALLTIME / 10 + 's');
    if (ALLTIME / 10 <= 0) {
        mybeta = 0;
        clearInterval(t1);
        is_time = false;
        gameover(SCORE, ALL_SUM, ONE_SUM, 1);
    }
}

function addtime(times) {
    var addbeta = -360 / ALLTIME * times;
    var newbeta = mybeta + addbeta;
    myalpha = newbeta >= 0 ? addbeta : (-mybeta);
    if (mybeta > 180 && newbeta < 180) {
        $(".pie2").css("-o-transform", "rotate(0deg)");
        $(".pie2").css("-moz-transform", "rotate(0deg)");
        $(".pie2").css("-webkit-transform", "rotate(0deg)");
        $(".pie2").css("backgroundColor", "#fff");
    }
}

function cleartime() {
    $(".pie1").css("-o-transform", "rotate(0deg)");
    $(".pie1").css("-moz-transform", "rotate(0deg)");
    $(".pie1").css("-webkit-transform", "rotate(0deg)");
    $(".pie2").css("backgroundColor", "#fff");
    $(".pie2").css("-o-transform", "rotate(0deg)");
    $(".pie2").css("-moz-transform", "rotate(0deg)");
    $(".pie2").css("-webkit-transform", "rotate(0deg)");
    mybeta = 0;
    myalpha = 0;
}

function countDown() {
    cleartime();
    t1 = setInterval("starttime()", 1000);
    is_time = true;
}


function changeRuleShow(value) {
    value == true ? $('.black_rule_explain').css('display', 'block') : $('.black_rule_explain').css('display', 'none');
}


window.onload = function () {
    var  numq = 10;
    var imageObj = new Image();
    $(".innter_time").html(ALLTIME / 10 + 's');
    imageObj.src = './png/index.png';
    // if(numq<=100){
    // setInterval(function(){
    //     numq+=5;
    //     if(numq<=100){
    //          $(".pre_load").html('加载图片'+numq+'%,请稍后');
    //     }
    // },100)
    // }

    imageObj.onload = function (e) {
        // $(".pre_load").html('加载图片100%');
        // numq = 0;
        //getCode()
        $('.pre_load').css('display', 'none');
        $('.start_index_img').css('display', 'block');
    }
    preloadTheImg('./png/pass1.png');
    preloadTheImg('./png/pass_fail.png');
    getShare()

}

function preloadTheImg(src) {
    var preimg = new Image();
    preimg.src = src;
    preimg.onload = function () {

    }
}

function getShare() {
    //var nowurl = window.location.href;
    var nowurl = window.location.href;
    $.ajax({
        url: 'https://sss.hemajia.net/ddp/share/getShareData',
        type: "post",
        data: { url: nowurl },
        dataType: "json",
        success: function (res) {
            var timestamp = res.data.timestamp;
            var nonceStr = res.data.nonceStr;
            var signature = res.data.signature;
            wx.config({
                debug: false,
                appId: 'wxd380519f6d1d8516',
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: [
                    'onMenuShareAppMessage',  //旧的接口，即将废弃
                    'onMenuShareTimeline', //旧的接口，即将废弃
                    'updateAppMessageShareData',
                    'updateTimelineShareData'

                ]// 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
                // var str = window.location.href;
                // str = str.match(/(\S*)code/)[1];
                // var shareUrl =  str.slice(0,str.length-1) + 'index.html'
                var shareUrl ='https://sss.hemajia.net/duiduipeng/index.html';
                var iconImg = 'https://duiduipeng.oss-cn-beijing.aliyuncs.com/e4ce20bdb9f87573b0598fbb1e864e5.png'
                var iconText = '健康对对碰';
                wx.onMenuShareAppMessage({

                    title: '健康对对碰', // 分享标题

                    desc: '对对碰闯关成功可以抽取话费~', // 分享描述

                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致

                    imgUrl: iconImg, // 分享图标

                    type: '', // 分享类型,music、video或link，不填默认为link

                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空

                    success: function () {

                        // 用户点击了分享后执行的回调函数

                    }

                });
                wx.onMenuShareTimeline({
                    title: '健康对对碰', // 分享标题
                    link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: iconImg, // 分享图标
                    success: function () {
                        // 用户点击了分享后执行的回调函数
                    }
                });
            });


        }
    })
}




function hideIndex() {
    $('.start_index').css('display', 'none');
    $('.sblack_rule_explain').css('display', 'none');
    $('.start_index_btn_area').css('display', 'none');
    $('.start_index_btn').css('display', 'none');
    timerial(ALLTIME);
}










