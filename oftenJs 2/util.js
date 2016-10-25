var kyUtil = { 
    getJson: function(url, infoData, getOrPost) {
        // var url='/room/getList';
        // var data='';
        // var getOrPost='get';
        var results = '';
        $.ajax({
            'cache': false,
            'async': false,
            'url': url,
            'type': getOrPost,
            'dataType': 'json',
            'data': infoData,
            success: function(result) {
                results = result;
            }
        });
        return results;
    },
    getJsonP: function(url, datas, getOrPost) {
        var results = '';
        $.ajax({
            'cache': false,
            'async': false,
            'url': url,
            'type': getOrPost,
            'dataType': 'jsonp',
            'data': datas,
            success: function(result) {
                results = result;
            }
        });
        var results = '';
    },
    //截取.jpg .text .doc等后缀(截取特殊符号到最后之间的字符)
    subStrLast: function(oldStr, speStr) {
        var localStr = oldStr.lastIndexOf(speStr);
        var lastStr='';
        if(localStr!=-1){
            lastStr = oldStr.substring(localStr + 1);
        }
        return lastStr;
    },
    //截取字符串（从头到特殊符号）
    subStrStart:function(oldStr, speStr){
        var localStr = oldStr.indexOf(speStr);
        var lastStr='';
        if(localStr!=-1){
            var lastStr = oldStr.substr(0,localStr);
        }
        return lastStr;
    },
    addComma:function(moneyTotal){
        var len = moneyTotal.length;
        var step=3;
        var splitor=",";
        if(len > step) {
            var l1 = len%step,l2 = parseInt(len/step),arr = [],first = moneyTotal.substr(0, l1);
            if(first != '') {
                arr.push(first);
            };
            for(var i=0; i<l2 ; i++) {
                arr.push(moneyTotal.substr(l1 + i*step, step));    
            };
            moneyTotal = arr.join(splitor);
        }; 
        return moneyTotal;
    },
    showLastComma:function(oldStr,speStr){
        var startStr=this.subStrStart(oldStr,speStr);
        var lastStr=this.subStrLast(oldStr,speStr);
        var strComma=this.addComma(startStr);
        var endStr=strComma+'.'+lastStr;
        return endStr;
    },
    /* 将数据用特殊符号链接起来
     **@argument arrays(数组) symbol(特殊符号) 
     **
     */
    strJoin: function(arrays, symbol) {
        var str = '';
        if (arrays.length > 0) {
            for (var i; i < arrays.length; i++) {
                if (i == (arrays.length - 1)) {
                    str += arrays[i];
                } else {
                    str += arrays[i] + symbol;
                }
            }
        }
        return str;
    },
    /*
    *@argument 
    *outerObj(外框的类名)
    *innerObj(内容内部元素直接传入元素,获取他的位置)
    *diaObj(内部弹窗类名)
    *setDiaObj(传入设定好的弹出要偏移的left，top对象)
    *pointObj(指向元素的类名,如果是false的话就没有，不是就传入样式名)
    *setPos(指向元素，传入一个设定好的要偏移的宽高，(left,top)的对象数组，0,左上，1又上，2左下，3右下)
    *rightOrLeft(判断内部弹出left：固定px，还是right：0px;)
    */
    diaPos:function(outerObj,innerObj,diaObj,setDiaObj,pointObj,setPos,rightOrLeft){
        var outerO=$(outerObj);
        var outerW=outerO.width();
        var outerH=outerO.height();
        var innerO=innerObj;//直接传入元素
        var innerW=innerO.width();
        var innerH=innerO.height();
        var innerL=innerO.offset().left;
        var innerT=innerO.offset().top;
        var diaW=$(diaObj).width();
        var diaH=$(diaObj).height();
        if(pointObj!=''){
            if(outerW-innerL>=diaW){
                if(outerH-innerH>=diaH){
                    if(rightOrLeft=='left'){
                        $(diaObj).css({'left':setDiaObj.w,'top':setDiaObj.h});
                    }
                    else{
                        $(diaObj).css({'right':-parseFloat(diaW)+parseFloat(setDiaObj.w)+'px','top':setDiaObj.h});
                    }
                    //设置指向箭头的位置
                    $(pointObj).css({'top':setPos[0].t,'left':setPos[0].l});//左上
                }
                else{
                    if(rightOrLeft=='left'){
                        $(diaObj).css({'left':setDiaObj.w,'top':parseFloat(innerT)-parseFloat(diaH)+parseFloat(setDiaObj.h)+'px'});
                    }
                    else{
                        $(diaObj).css({'right':setDiaObj.w,'top':parseFloat(innerT)-parseFloat(diaH)+parseFloat(setDiaObj.h)+'px'});
                    }
                    $(pointObj).css({'top':setPos[2].t,'left':setPos[2].l});//左下
                }    
            }
            else{
                if(outerH-innerH>=diaH){
                    $(diaObj).css({'left':parseFloat(innerL)-parseFloat(diaW)+parseFloat(setDiaObj.w)+'px','top':setDiaObj.h});
                    //设置指向箭头的位置
                    $(pointObj).css({'top':setPos[1].t,'left':setPos[0].l});//右上
                }
                else{
                    $(diaObj).css({'left':parseFloat(innerL)-parseFloat(diaW)+parseFloat(setDiaObj.w)+'px','top':parseFloat(innerT)-parseFloat(diaH)+parseFloat(setDiaObj.h)+'px'});
                    $(pointObj).css({'top':setPos[3].t,'left':setPos[0].l});//右下

                }
            }
        }
        else{
            if(outerW-innerL>=diaW){
                if(outerH-innerH>=diaH){
                    if(rightOrLeft=='left'){
                        $(diaObj).css({'left':setDiaObj.w,'top':setDiaObj.h});
                    }
                    else{
                        $(diaObj).css({'right':setDiaObj.w,'top':setDiaObj.h});
                    }
                }
                else{
                    if(rightOrLeft=='left'){
                        $(diaObj).css({'left':setDiaObj.w,'top':innerT-diaH+setDiaObj.h});
                    }
                    else{
                        $(diaObj).css({'right':setDiaObj.w,'top':innerT-diaH+setDiaObj.h});
                    }
                }    
            }
            else{
                if(outerH-innerH>=diaH){
                    $(diaObj).css({'left':innerL-diaW+setDiaObj.w,'top':setDiaObj.h});
                }
                else{
                    $(diaObj).css({'left':innerL-diaW+setDiaObj.w,'top':innerT-diaH+setDiaObj.h});
                }
            }
        }
    },
    /*var d= new Date(timestamp1*1000);//将毫秒值转换成时间
    *将时间戳转换成时间然后将时间转换成2010-12-15 12:20:00
    *getFamatDate(d);
    *@argument now 传一个时间进去，strY(判断需要返回的是年月日，还是时分秒)
    *return 返回一个固定格式的字符串
    */
    getFamatDate:function(now,strY){
        var year=now.getFullYear(); 
        var week=now.getDay();//星期几
        var month=now.getMonth()+1; 
        var date=now.getDate(); 
        var hour=now.getHours(); 
        var minute=now.getMinutes(); 
        var seconds=now.getSeconds();
        if(month<10){
            month='0'+month;
        }
        if(date<10){
            date='0'+date;
        }
        if(hour<10){
            if(hour==0){
                hour='00';
            }
            else{
                hour='0'+hour;
            }
        }
        if(minute<10){
            if(minute==0){
                minute='00';
            }
            else{
                minute='0'+minute;
            }
        }
        if(seconds<10){
            if(seconds==0){
                seconds='00';
            }
            else{
                seconds='0'+seconds;
            }
        }
        //年
        if(strY=='y'){
            return year;
        }
        //月
        if(strY=='mt'){
            return month;
        }
        //日（几号）
        if(strY=='d'){
            return date;
        }
        //小时
        if(strY=='h'){
            return hour;
        }
        //分钟
        if(strY=='ms'){
            return minute;
        }
        //秒
        if(strY=='s'){
            return seconds;
        }
        //年-月-日
        if(strY=='ymd'){
            return year+"-"+month+"-"+date;
        }
        if(strY=='hm'){
            return hour+":"+minute;
        }
        //时分秒
        if(strY=='hms'){
            return hour+":"+minute+":"+seconds;
        }
        if(strY=='w'){
            return week;
        }
        if(strY=='all'){
            return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+seconds;
        }
    },
    //将时间转换成毫秒值(时间戳)
    timeStamp:function(time){
        return Date.parse(new Date(time))/1000;
    },
    stampToTime:function(timestamp){
        return new Date(timestamp*1000);
    }
}
//全选
$(document).on('click', '.check_all i', function() {
    if ($(this).hasClass('checked')) {
        $(this).removeClass('checked');
        $('.check_box i').removeClass('checked');
    } else {
        $(this).addClass('checked');
        $('.check_box i').addClass('checked');
    }
});
//全选
$(document).on('click', '.check_box i', function() {
    if ($(this).hasClass('checked')) {
        $(this).removeClass('checked');
    } else {
        $(this).addClass('checked');
    }
});
//删除
var deletedArray=new Array();
var obdDetail={};
$(document).on('click','.opt-td .able-opt',function(){
    var $this=$(this);
    layer.showLayer({type:"makeSure",content:"确定要删除吗",ok:function(){
        layer.close();  
        var id=$this.attr('evedetailid');
        if(id!=undefined){
            obdDetail.ID=id
            deletedArray.push(obdDetail);
        }
        if($this.parents('tr').find('.eve-money-real').val()!=''){
            var delEveMoney= parseFloat($this.parents('tr').find('.eve-money-real').val());
            var totalMoney=$('#total-money-real').val();
            var lastRealTotalMoney=totalMoney-delEveMoney;
            $('#total-money-real').val(lastRealTotalMoney);
            lastRealTotalMoney=lastRealTotalMoney.toFixed(2);
            var returnValLastTotal=kyUtil.subStrLast(lastRealTotalMoney,'.');//截取.以后的字符
            var returnValStartTotal=kyUtil.subStrStart(lastRealTotalMoney,'.');//截取.之前的字符
            var addCommaTotal=kyUtil.addComma(returnValStartTotal);//给金额加上，
            $('#total-money-comma').html(addCommaTotal+'.'+returnValLastTotal);
        }
        $this.parents('tr').remove();
        $('.delete-tr tbody tr').each(function(index){
            $(this).find('.key').html(index+1);
        })
    }});    
});
//复选框
$(document).on('click','.span_check_box_2',function(){
    if($(this).find('b').hasClass('checked')){
        $(this).find('b').removeClass('checked');
    }
    else{
        $(this).find('b').addClass('checked');
    }
})

//选人的删除
$(document).on('click','.peo_wrap b',function(){
    $(this).parent('.peo_wrap').remove();
})

/*用，代替空格*/
// var outerPeo=outerPeo.replace(/ /g,',');
/*将日期转换成时间戳*/
// var timestamp1 = Date.parse( new Date('2016-6-30 14:20:00'));
// console.log(timestamp1);
/*将时间戳转换成 2016-6-30 14:20:00 日期格式*/

// var d=new Date(timestamp1);
// formatDate(d);
// function formatDate(now) { 
//     var year=now.getYear(); 
//     var month=now.getMonth()+1; 
//     var date=now.getDate(); 
//     var hour=now.getHours(); 
//     var minute=now.getMinutes(); 
//     var second=now.getSeconds(); 
//     return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
// }  




