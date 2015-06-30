 window.onload = function() {
     //照片墙代码部分
     var oDiv1 = document.getElementById('show');
     var oDiv = oDiv1.getElementsByTagName('div');
     var oNear;

     var aLeft = new Array();
     var aTop = new Array();
     var iMinzindex = 2;

     
     var theme = localStorage.getItem(30); //更换主题部分
     if(localStorage.getItem(30)==null)//如果30号里面没有值，那么默认设为主题二
     {
         localStorage.setItem(30,2);
         $('#theme-link').attr('href', 'css/blog.css');
         $('#theme-link-ori').attr('href','');
     }

     if (theme == 1) {
         $('#theme-link').attr('href', '');
          $('#theme-link-ori').attr('href','css/blog-ori.css');
     }
     if (theme == 2) {
         $('#theme-link').attr('href', 'css/blog.css');
         $('#theme-link-ori').attr('href','');
     }
     $('#theme1').click(function(event) {
         /* Act on the event */
         $('#theme-link').attr('href', '');
         $('#theme-link-ori').attr('href','css/blog-ori.css');
         
         localStorage.setItem(30,1);
        
     });
     if ($('#theme2').click(function(event) {
             /* Act on the event */
             $('#theme-link-ori').attr('href','');
             $('#theme-link').attr('href', 'css/blog.css');
             
             localStorage.setItem(30,2);

         }))



         for (i = 0; i < oDiv.length; i++) //把div当前的位置存到数组中 布局转换，把文档流定位转化为绝对定位
         {
             aLeft[i] = oDiv[i].offsetLeft;
             aTop[i] = oDiv[i].offsetTop;

         }

     for (var i = oDiv.length - 1; i >= 0; i--) {
         oDiv[i].style.left = aLeft[i] + 'px';
         oDiv[i].style.top = aTop[i] + 'px';
         oDiv[i].style.position = 'absolute'; //绝对定位一定要写
         oDiv[i].index = i;
     };

     for (var i = oDiv.length - 1; i >= 0; i--) {
         setDrag(oDiv[i]);
     }

     function setDrag(obj) {

         obj.onmousedown = function(ev) {
             obj.style.zIndex = iMinzindex++; //使得当前点击的div永远显示在最上层

             var oEvent = ev || event;
             var disX = oEvent.clientX - obj.offsetLeft;
             var disY = oEvent.clientY - obj.offsetTop;
             document.onmousemove = function(ev) {
                 var oEvent = ev || event;
                 obj.style.left = oEvent.clientX - disX + 'px';
                 obj.style.top = oEvent.clientY - disY + "px";
                 for (i = 0; i < oDiv.length; i++) {
                     oDiv[i].className = '';
                 }
                 oNear = findNearest(obj); //检测碰撞，并且找到最近的碰撞
                 if (oNear) {
                     oNear.className = 'active1'; //最近的被碰的加边框，不要用active命名，因为bootstrap里面有active类，会覆盖                   
                 }
             }
             document.onmouseup = function() { //给document加事件是防止鼠标移出div
                 document.onmousemove = null;
                 document.onmouseup = null;

                 var oNear = findNearest(obj);
                 if (oNear) //如果碰撞 交换位置
                 {
                     oNear.style.zIndex = iMinzindex++;
                     obj.style.zIndex = iMinzindex++;
                     //不用运动框架来做div运动效果，因为开定时器，不会清，会出现抖动现象（在定时器没清时又点击，会再次开启一个定时器，所以抖动，但是没解决了，运动框架见xxphotowall。html）                   
                     $(obj).animate({

                             left: aLeft[oNear.index],
                             top: aTop[oNear.index]
                         },
                         500);
                     $(oNear).animate({
                             left: aLeft[obj.index],
                             top: aTop[obj.index]
                         },
                         500);
                     oNear.className = '';
                     //以上为jquery的animate（）方法，但是jquery的对象才能调用jquery的方法，所以用$()来包起DOM元素，使之成为jquery的对象

                     //交换索引值， 位置交换，索引值也要交换，否则div1移动到div2时仍认为自己是div1
                     var tmp = 0;
                     tmp = obj.index;
                     obj.index = oNear.index;
                     oNear.index = tmp;
                 } else { //没碰撞
                     $(obj).animate({
                             left: aLeft[obj.index],
                             top: aTop[obj.index]
                         },
                         500);
                 }
             }
             return false; //禁止浏览器默认行为，在mousedown里面
         }
     }

     function colTest(obj1, obj2) { //碰撞检测函数
         var l1 = obj1.offsetLeft;
         var r1 = obj1.offsetLeft + obj1.offsetWidth;
         var t1 = obj1.offsetTop;
         var b1 = obj1.offsetTop + obj1.offsetHeight;

         var l2 = obj2.offsetLeft;
         var r2 = obj2.offsetLeft + obj2.offsetWidth;
         var t2 = obj2.offsetTop;
         var b2 = obj2.offsetTop + obj2.offsetWidth;

         if (r1 < l2 || l1 > r2 || b1 < t2 || t1 > b2) //碰不上
         {
             return false;
         } else {
             return true;
         }
     }

     //以下为找到所有碰撞中最近的那个div，其实当时没写找最近时也不会给碰到的都加框，只会给第一个碰到的加框，直到碰不到状态
     function findNearest(obj) {
         var iMin = 999999;
         var iMinindex = -1;
         for (var i = oDiv.length - 1; i >= 0; i--) {
             if (obj == oDiv[i]) {
                 continue;
             } //这句话很重要！一定要判断是否跟自己碰撞，否则会出问题
             if (colTest(obj, oDiv[i])) {
                 var dis = getDis(obj, oDiv[i]);
                 if (dis < iMin) {
                     iMin = dis;
                     iMinindex = i;
                 }

             }
         };
         if (iMinindex == -1) {
             return null;
         } else {
             return oDiv[iMinindex];
         }

     }

     function getDis(obj1, obj2) {
             var disX = obj1.offsetLeft - obj2.offsetLeft;
             var disY = obj1.offsetTop - obj2.offsetTop;
             var distance = Math.sqrt(disX * disX + disY * disY);
             return distance;
         }
         //异步加载日志列表部分代码

     $.ajax({
             url: 'blogdiary.json',
             type: 'GET',
             dataType: 'json',

         })
         .done(function(list) {
             console.log("success", list);
             $('.panel-body').append("<table class='table table-bordered' id='diarytable'></table>"); //用类取没取到。咋回事
             $('#diarytable').append('<tr><td>编号</td><td>日志名称</td><td>时间</td></tr>')
             for (t = 0; t < list.diarylist.length; t++) {
                 $('#diarytable').append("<tr><td>" + list.diarylist[t].number + "</td><td><a href='diary.html'>" + list.diarylist[t].title + "</a></td><td>" + list.diarylist[t].time + "</td></tr>"); //变量不能用双引号引上，一定是标签用双引号引上,注意双引号和单引号区分开，标签双引号，属性单引号
             }
         })

     //音乐播放插件代码
     var arr = ['music/tomorrow.mp3', 'music/moon.mp3', 'music/songbie.mp3', 'music/fly.mp3', 'music/cloud.mp3', 'music/hand.mp3', 'music/river.mp3', 'music/flower.mp3'];
     var musicname = ['明天你好 &nbsp演唱:小雪 小杜', '半个月亮爬上来 &nbsp演唱:小雪 小杜', '送别 &nbsp演唱:小雪 小杜', '我要的飞翔 &nbsp演唱:小雪', '风中有朵雨做的云 &nbsp演唱:小雪', '大手拉小手 &nbsp演唱:小雪 小杜', '外婆的澎湖湾 &nbsp演唱:小雪 小杜', '夜来香 &nbsp演唱:小雪 小杜'];
     var oListen = document.getElementsByClassName('music-feng');
     var oListenImg = document.getElementsByClassName('listen-feng')[0];
     var arrImg = ['img/music-list/1.jpg', 'img/music-list/2.jpg', 'img/music-list/3.jpg', 'img/music-list/4.jpg', 'img/music-list/5.jpg', 'img/music-list/6.jpg', 'img/music-list/7.jpg', 'img/music-list/8.jpg'];
     var oPrevious = document.getElementsByClassName('jp-previousxt');
     var oNext = document.getElementsByClassName('jp-next');
     console.log(oNext);
     $("#jquery_jplayer_1").jPlayer({
         // var that = this;
         ready: function(event) {
             $("#jquery_jplayer_1").jPlayer("setMedia", {
                 title: musicname[0],
                 // m4a: "http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
                 // oga: "http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
                 mp3: arr[0]

             });

             for (x = 0; x < oListen.length; x++) {
                 oListen[x].index = x;
                 oListen[x].onclick = function() {
                     for (y = 0; y < oListen.length; y++) {
                         $(oListen[y]).css('outline', '');
                     }
                     var that = this;
                     $(this).css('outline', '3px ridge pink');
                     oListenImg.src = arrImg[this.index];

                     $("#jquery_jplayer_1").jPlayer("setMedia", {
                         title: musicname[this.index],
                         // m4a: "http://jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
                         // oga: "http://jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
                         mp3: arr[this.index]

                     }).jPlayer('play');
                 }
             }
         },
         swfPath: "js",
         supplied: "m4a, oga,mp3",
         wmode: "window",
         useStateClassSkin: true,
         autoBlur: false,
         smoothPlayBar: true,
         keyEnabled: true,
         remainingDuration: true,
         toggleDuration: true
     });

     //照片点赞部分代码

     var oLove = document.getElementsByClassName('glyphicon glyphicon-heart love');
     var oLoveNum = document.getElementsByClassName('badge lovenum');
     for (var p = 0; p < oLove.length; p++) {
         oLove[p].index = p;
         oLove[p].onclick = function() {
             oLoveNum[this.index].innerHTML = parseInt(oLoveNum[this.index].innerHTML) + 1;
             localStorage.setItem(this.index, oLoveNum[this.index].innerHTML);
         }
         if (!localStorage.getItem(p)) {
             oLoveNum[p].innerHTML = 20;
         } else {
             oLoveNum[p].innerHTML = localStorage.getItem(p);
         }
     }
 }
