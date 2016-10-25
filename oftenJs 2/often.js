/*全选*/
$(document).on('click','.check_all',function(){
    if($(this).find('i').hasClass('checked')){
        $(this).find('i').removeClass('checked');
        $('.check_box i').removeClass('checked');
    }
    else{
        $(this).find('i').addClass('checked');
        $('.check_box i').addClass('checked');
    }
});
$(document).on('click','.check_box',function(){
    if($(this).find('i').hasClass('checked')){
        $(this).find('i').removeClass('checked');
    }
    else{
        $(this).find('i').addClass('checked');
    }
});





/*分页*/
    // /*get*/
    paginationBykkpage.makePagination("/mall/MyOrderDetail/list","get",{"page":1},doPageDataList,false,"");      

    // post
    paginationBykkpage.makePagination("/mall/MyOrderDetail/list","post",{"_token":token,"page":1},doPageDataList,false,"");  



/*只允许输入数字*/
$(document).on('keyup','input',function(){
    $(this).val($(this).val().replace(/[^\d]/g,''));
});



/*弹窗*/
layer.showLayer({type:"success",content:"保存成功",ok:function(){
    layer.close();
}});
layer.showLayer({type:"error",content:"保存成功",ok:function(){
    layer.close();
}});
layer.showLayer({type:"makeSure",content:"确定要删除吗",ok:function(){
    layer.close();
}});




/*只允许输入数字*/
$(document).on('keyup','input',function(){
    $(this).val($(this).val().replace(/[^\d]/g,''));
});

/*显示序号*/
var curr=info.current_page;
var everyP=info.per_page;
var no=0;
for(var i=0;i<arrayStrReg.length;i++){
    no=everyP*(curr-1)+(i+1);
    strTbody+='<tr><td regId="'+arrayStrReg[i].ID+'">'+no+'</td><td class="regNum"><input type="text" value="'+arrayStrReg[i].SUGGEST+'" class="form-control"></td><td><span class="trDelNew" ></span></td></tr>';
}

/*搜索*/
function btnSearch(){
    var inputVal= $('#modsearch').val();
    paginationBykkpage.makePagination("/mall/typeAndinventory/pageList","get",{"page":1,"search":inputVal},doPageDataList,false,"");
}
$('#modsearch').keydown(function(event) {
    if(event.keyCode==13){
        btnSearch();
    }
});

/*批量上传*/
function deleteList(){
    var checked_i= $('#playTable tr .check_box i.checked');
    if(checked_i.size()==0){
        layer.showLayer({type:"error",content:"请选择要删除的文件",ok:function(){
            layer.close();
        }});
    }
    else if(checked_i.size()>0){
        layer.showLayer({type:"makeSure",content:"确定要删除吗",ok:function(){
            layer.close();
            var url ='/playList/delete';
            var arrayDe=new Array();
            checked_i.each(function(){
                arrayDe.push($(this).parents('tr').find('.key').attr('list_id'));
            });
            var datas={'ROOM_ID':list.ID,'ID':arrayDe}
            var objData=kyUtil.getJson(url,datas,'get');
            if(objData.code){
                var datas={'ID':list.ID};
                var url='/playList/list';
                var objData=kyUtil.getJson(url,datas,'get');
                if(objData.code){
                    showPlayList(objData.info);
                }
            }
        }});
    }
}


var url='/mall/cart/add';
var datas={};
var objData=kyUtil.getJson(url,datas,'get');
if(objData.code){
    layer.showLayer({type:"success",content:"",ok:function(){
        layer.close();
    }});
}
else{
    if(objData.info.msg==undefined){
        layer.showLayer({type:"error",content:objData.info,ok:function(){
            layer.close();
        }}); 
    }
    else{
        layer.showLayer({type:"error",content:objData.info.msg,ok:function(){
            layer.close();
        }});
    }
}

/*上传*/
function expUploadIcon(obj){
    var ajaxFile = obj.siblings(".scrollAjaxFile");
    ajaxFile.trigger("click");
}
function uploadImg(obj){
    var ajaxFile = obj;
    // var divUrl = obj.siblings(".scroll_img_url");
    // var uploadHtml = obj.siblings(".upload_file1");
    // var tdImg = obj.closest('tr').find(".scroll_img_div");
    var fileForm = obj.closest(".scrollFile");
    var imgPath=ajaxFile.attr("name");
    var imgName=$('#bgflieUpLoad').val();
    var imgs=kyUtil.subStrLast(imgName,'.');
    if(imgs.toLowerCase()!='jpg'&&imgs.toLowerCase()!='png'){
        layer.showLayer({type:"error",content:'只能上传格式为jpg,png格式的图片',ok:function(){
            layer.close();
        }});
        return;
    }
    fileForm.ajaxSubmit({
        type:'post',
        data:{'_token':_token,'uploadFile':imgPath},
        url:"/file/upload",
        success:function(r){
            //console.log(r)
            if(r.code!=0)
            {
                // var src = '/file/download?name='+r.info;
                // tdImg.html('<img class="uploadExpHead uploadPreview" width="33px;" height="32px;" src='+src+'>');
                // uploadHtml.html('重新上传');
                $('.gods-img-now img').attr('src','/file/download?name='+r.info+'');
                $('#img_new_name').val(r.info);
            }
        }
    });
}
