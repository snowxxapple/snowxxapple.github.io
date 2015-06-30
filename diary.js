window.onload=function(){
    
if(localStorage.getItem(30)==1)
 {
    $('#theme-link').attr('href', '');
    $('#theme-link-ori').attr('href','css/blog-ori.css');
 }
 if(localStorage.getItem(30)==2)
 {
     $('#theme-link').attr('href', 'css/blog.css');
     $('#theme-link-ori').attr('href','');
 }
    var oBack = document.getElementsByClassName('pull-right back-color');
    var oLi = document.getElementsByClassName('list-group-item');
    //主题风格
    if(theme==1){
        $('#theme-link').attr('href', '');
    }
    if(theme==2){
        $('#theme-link').attr('href', 'css/blog.css');
    }


    $.ajax({ //加载日志列表
            url: 'diarylist.json',
            type: 'GET',
            dataType: 'json',

        })
        .done(function(dylist) {
            console.log("success");

            for (j = 1; j < dylist.list.length; j++) {
                $('.list-group').append("<li class='list-group-item'><a class='file-name'>" + dylist.list[j - 1].name + "</a></li>"); //append在所选元素的内部，追加内容
               var oFileName = document.getElementsByClassName('file-name');
               oFileName[0].style.fontWeight=700;
            };

        })
    $.ajax({ //加载日志内容，即日志面板里的内容，这里为初始界面，即显示第一篇日志
            url: 'diary.json',
            type: 'GET',
            dataType: 'json',
        })
        .done(function(file) {
            console.log("success");
            $('#diary-head').html(file.diary[0].name);
            $('.panel-body').append("<div style='height:570px;overflow:auto;padding:10px;padding-left:18px;' class='diary-back'><p id='content'>" + file.diary[0].content + "</p></div>");
            var oDiaryBack = document.getElementsByClassName('diary-back')[0];
            if (localStorage.getItem(21) == null) {//判断localstorage21是否存在，若不存在，则给日志赋予背景
                oDiaryBack.style.background = 'url(img/diary-back/1.jpg)';
            } 
            else {
                oDiaryBack.style.background = localStorage.getItem(21);
            }
            for (n = 0; n < oBack.length; n++) { //所有的日志背景都是一样的
                oBack[n].index = n;
                var oDiaryBack = document.getElementsByClassName('diary-back')[0];
                oBack[n].onclick = function() {
                    if (this == oBack[5]) {
                        oDiaryBack.style.background = 'white';
                    } else {
                        oDiaryBack.style.background = 'url(img/diary-back/' + (oBack.length - this.index - 2) + '.jpg)';
                    }
                    localStorage.setItem(21, oDiaryBack.style.background);
                }
            }
            for (m = 1; m < oLi.length; m++) //序号为0的是日志列表的表头,该循环为点击列表里的日志名称，会相应的在日志面板里面显示日志内容
            {
                oLi[m].index = m - 1;
                var oFileName = document.getElementsByClassName('file-name');
                oLi[m].onclick = function() {
                    var that = this; //必须要把当前的this存下来，不能再下面ajax中直接用this
                    for (p = 0; p < oFileName.length; p++) {
                        oFileName[p].style.fontWeight = 400;
                    }
                    oFileName[this.index].style.fontWeight = 700;
                    $.ajax({
                            url: 'diary.json',
                            type: 'GET',
                            dataType: 'json',
                        })
                        .done(function(file) {
                            console.log("success");
                            $('#diary-head').html(file.diary[that.index].name);
                            $('#content').html(file.diary[that.index].content);
                        })
                }
            }
        })
}
