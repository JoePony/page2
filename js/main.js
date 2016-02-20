var outputEle = document.getElementById('output');             //获取输出结果元素
var clearEle = document.getElementById('clear');               //获取清楚按钮
var equalEle = document.getElementById('equal');               //获取等号按钮

var inputNEle = document.getElementById('numbers').getElementsByTagName('span');         //获取数字按钮集合

var charactersEle = document.getElementById('characters');     //获取+-*/按钮父元素
var inputCEle = charactersEle.getElementsByTagName('span');  //获取+-*/按钮集合

var charactersTEle = document.getElementById('charactersT');   //获取右侧按钮父元素
var charactersTIEle = document.getElementById('charactersTI'); //获取sin/cos/ = 的父元素
var itemC = charactersTEle.getElementsByTagName('span');     //获取右侧按钮集合

var sinOrCos = document.getElementById('sinOrCos');        //获取sin/cos父元素
var sinOrCosItems = sinOrCos.getElementsByTagName('span'); //获取sin/cos按钮集合

var subtractEle = document.getElementById('subtract');

var firstN;                //声明第一个计算数字
var secondN;               //声明第二个计算数字
var calculaterTrue;        //声明实际运算符变量
var calculaterNew;         //声明新键入运算符变量
var currResult;            //声明结果

var cTyped = 0;                 //声明是否已按计算符号
var nTyped = 0;                 //声明是否已按数字符号(防止连续按运算符)
var equaled = 0;                //声明是否已按等号
var continuity = 0;             //声明是否连续按计算符号按钮

/*
*遍历数字按钮，并添加onlick、mousedown、mouseup事件*
*/
var i;                                                //统一声明增量,避免后面重复声明
for(i = 0; i < inputNEle.length; i++){               
    inputNEle[i].onclick = function(e){                  //数字按钮点击事件
        nTyped++;                                     //防止连续按运算符
        var self=this;                                //提高可读性
        if(cTyped > 0){                                   //如果计算符号已按
            outputEle.value = '';                        //输出结果清空
            cTyped=0;
        }
        //如果按.超过1个(防止出现多个.)
        if(self.innerHTML == '.'  &&  output.value.indexOf('.') !== -1){ 
            outputEle.value += '';
        //如果只按.
        }else if(self.innerHTML == '.'  &&  outputEle.value == ''){
            outputEle.value = '0.';
        //如果只按-后紧接着按.
        }else if(self.innerHTML == '.'  &&  outputEle.value == '-'){
            outputEle.value = '-';
        //如果按正常数字
        }else if(self.innerHTML == '0'  &&  outputEle.value == '0'){
            outputEle.value += '';
        }else{
            if(outputEle.value.length < 12){    
                outputEle.value += self.innerHTML; 
            }else{
                outputEle.value = outputEle.value;    //超过12位屏蔽点按
            }
        }
    };   
    inputNEle[i].onmousedown = function(e){        //点击时添加按下的样式
        this.id = 'click';
    };
    inputNEle[i].onmouseup = function(e){          //取消按下的样式
        this.id = '';
    };
}

/*
*遍历+-*÷运算符，并添加onlick、mousedown、mouseup事件*
*/
for(i = 0; i < inputCEle.length; i++){      
    inputCEle[i].onclick = function(e){
        var self2 = this;                                     //提高可读性
        if(outputEle.value == ''  &&  self2.innerHTML == '-'){
            outputEle.value = '-';                   //只允许输入一个负号
            continuity = 0;
        }
        // console.log(nTyped);
        if(nTyped > 0){                         //与nTyped = 0;防止连续按运算符
            continuity++;                       //如果连续按运算符
            cTyped = 1;                         //标记元素符已按,防止按数字键时出现bug
            if(firstN == undefined){            //第一次运算时
                firstN = outputEle.value;  
            }else{                            
                secondN = outputEle.value;      
                //不按=而直接连续运算时为第二个运算数字赋值
            }
            
            if(calculaterTrue == undefined){
                    //第一次运算时实际运算符赋值
                    calculaterTrue = self2.innerHTML;  
            }else{
                if(calculaterNew == undefined){ 
                    calculaterNew = self2.innerHTML;      //新运算符赋值赋值
                }else{
                    //前一次运算结束,实际运算符赋值给新键入的运算符
                    calculaterTrue = calculaterNew;       
                    calculaterNew = self2.innerHTML;      //新运算符变量赋值
                }
            }
            if(firstN !== undefined  &&  calculaterTrue !== undefined  &&  secondN !== undefined){
                if(continuity > 0){           //第二次按运算符时开启运算功能
                    calculate();                           //调用运算方法
                    if(currResult === Infinity){           //判断结果是否是无穷大
                        outputEle.value = '超出范畴'; 
                    }else if(currResult !== currResult){    //判断结果是否是NaN
                        outputEle.value = '非数值类型';
                    }
                    else{
                        outputEle.value = currResult;      //输出结果
                    }   
                    equaled = 0;                 //等号已按增量归零
                }
            }
            nTyped = 0;                                          //数字键已按增量归零
        }
        // else{
        //     calculaterTrue = self2.innerHTML; //本想做连续按运算符改运算符的功能，但是发现会有问题，懒得做了
        // }
    };
    inputCEle[i].onmousedown = function(e){        //点击时添加按下的样式
        this.id  =  'click';
    };
    inputCEle[i].onmouseup = function(e){          //取消按下的样式
        this.id  =  '';
    };
}

/*
*遍历sin/cos按钮元素，并添加onlick*
*/
for(i = 0; i < sinOrCosItems.length; i++){     
    sinOrCosItems[i].onclick = function(e){
        var r;
        var ov = outputEle.value;
        //如果不是非正常数字则开始运算
        if(ov !== ''  &&  ov !== '0.'  &&  ov !== '-'){  
            if(this.innerHTML == 'sin'){
                r = Math.sin(outputEle.value);
            }else{
                r = Math.cos(outputEle.value);
            }
            if(r === Infinity){              //判断结果是否是无穷大
                outputEle.value = '超出范畴';
            }else if(r !== r){      //判断结果是否是NaN
                outputEle.value = '非数值类型';
            }
            else{
                outputEle.value = parseFloat(r.toFixed(10)); //parseFloat(r).toFixed(10)能保证位数，如果末尾有0也不会省略
            }   
            //精确到小数10位,并以规范格式输出结果
        }
    };
}

/*
*遍历右侧运算按钮元素，并添加mousedown、mouseup事件**
*/
for(i = 0; i < itemC.length; i++){       
    itemC[i].onmousedown = function(e){        //点击时添加按下的样式
        this.id = 'clickT';
    };
    itemC[i].onmouseup = function(e){          //取消按下的样式
        this.id = '';
    };
}

/* 清除按钮的点击事件 */
clearEle.onclick = function(e){                   
    outputEle.value = '';                         //清空相关运算值
    firstN = undefined;
    secondN = undefined;
    calculaterTrue = undefined;
    calculaterNew = undefined;
    nTyped = 0;
    cTyped = 0;
}

/* 等号按钮的点击事件 */
equalEle.onclick = function(e){                   
    equaled++;
    continuity = 0; 
    // if(firstN !== undefined  &&  calculaterTrue !== undefined  &&  secondN !== undefined){
        calculate();                                         //开始计算
        outputEle.value = currResult;
        if(currResult === Infinity){                         //判断结果是否是无穷大
            outputEle.value = '超出运算范畴';
        }else if(currResult !== currResult){                 //判断结果是否是NaN
            outputEle.value = '非数值类型';
        }
        else{
            outputEle.value = currResult;   //输出规范化结果
        }           
    calculaterTrue = undefined;         //按=后意味着重新开始计算
    calculaterNew = undefined;
    firstN = undefined;    //按=后意味着重新开始计算
    secondN =undefined;    //按=后意味着重新开始计算,只有nTyped不重置,因为此时显示输出结果,相当于第一次运算时已键入第一运算数字
    cTyped = 0;
    // }
}

/*
*四则运算方法*
*/
function calculate(){      
    if(firstN !== undefined  &&  continuity == 0){
        secondN = outputEle.value;                //为第二运算数字赋值
    }
    if(firstN !== undefined  &&  calculaterTrue !== undefined  &&  secondN !== undefined){  //满足条件开始运算
        firstN = parseFloat(firstN);
        secondN = parseFloat(secondN);
        switch(calculaterTrue){
            case '×':
                currResult = firstN * secondN;
                break;
            case '÷':
                currResult = firstN / secondN;
                break;
            case '+':
                currResult = firstN + secondN;
                break;
            case '-':
                currResult = firstN - secondN;
                break;
        }
        cTyped = 1;                               //运算符已按
        calculaterTrue=(calculaterNew == undefined) ? calculaterTrue : calculaterNew; //运算结束,新键入的运算符赋值给实际运算符变量
        currResult = parseFloat(currResult.toFixed(10));  //输出规范化结果
        firstN = currResult;                     //将结果赋给第一运算数字,便于继续运算
        return currResult;                     //返回运算结果
    }
}

outputEle.onkeydown=function(e){
    return false;                   //禁用键盘输入
}