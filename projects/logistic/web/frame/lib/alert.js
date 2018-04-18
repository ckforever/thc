define(['channel'],function(){

    let msgCon;

    let dialog = new Map();

    let getType = Object.prototype.toString;
    //连接到管道
    let tip = Channel.connect("alert");
    //监听消息
    tip.message(function(param){
        //弹出层
        if(getType.call(param) =='[object Object]'){//弹出框

            let dialoglabel = this.id.split('_')[0]+param.target;

            let temp = dialog.get(dialoglabel);

            if(temp){
                temp.show();
                temp.dialog.focus();
            }else{
                temp =new Dialog(this,param);

                dialog.set(dialoglabel,temp);

                let currentWindow = temp.dialog.ownerDocument.defaultView;

                currentWindow &&(  currentWindow.addEventListener('unload',function(e){
                    this.dialogSet.forEach((item)=>{
                        dialog.delete(item);
                    });
                }),

                !currentWindow.dialogSet && (currentWindow.dialogSet =[]),

                currentWindow.dialogSet.push(dialoglabel));
            }
            return temp;
        }else{//提示层
            msgCon?new MSG(this,param):initMessageCont();
        }
    },'all');

    function initMessageCont(){
        msgCon = document.createElement("section");
        document.body.appendChild(msgCon);
        msgCon.id = "msgCon";
        msgCon.classList.add('message');

        return msgCon;
    }

    let MSG =function(scope,param){
        //消息名称，详细，类型，时间
        let [msg ,detail,callback,sec] =Array.isArray(param)?param:[param];

        // this.id = scope.id;
        // this.param = param;
        this.init(msg ,detail,callback,sec);
       // this.show();
    };

    MSG.prototype ={
        constructor:MSG,
        init(msg ,detail,callback,sec){

            let message = document.createElement("section");

            message.classList.add('tip');

            this.message = message;

            let callF = typeof callback == 'function';

            let img =document.querySelector("#nav_bar li.active");
            //如果是个方法则显示确定和取消按钮
            message.innerHTML =`<i ${img ? 'style="background-image:'+img.style.backgroundImage+'"':''}></i><div><p>${msg || ''}</p><p>${detail || ''}</p></div>${callF ? '<div class ="opr"><button>确定</button><button>取消</button></div>':''}`;
            img && ( message.children[0].style.backgroundImage =img.style.backgroundImage);
            if(callF){
                message.style.animation ='shows .5s   forwards';
                message.onclick = function(e){
                    let target = e.target;
                    if(target.tagName  =='BUTTON'){
                        if(target.nextElementSibling){//确定
                            callback(e,message);
                        }
                        message.style.animation = `unShow 1s forwards`;
                    }
                }
            }else{
                message.style.animation =`shows .4s   forwards,unShow 1s ${ sec || 3}s 1 forwards`;
            }
            if(!msgCon){
                initMessageCont();
            }
            msgCon.appendChild(message);

            message.addEventListener('animationend',function(e){
                if(e.animationName == 'unShow'){
                    message.remove();
                }
            })
        },
        show(){
            //this.message.style.animation ='unshow';
        },
        remove(){
            //this.message.style.animation ='unshow';
        }
    };

    let Dialog=function(scope,param){

        this.id = scope.id;
        this.param = param;

        this.init(param);

        this.show();

        this.dialog.focus();

    };

    Dialog.prototype={

        constructor:Dialog,

        initEvent:function(){

            let _this= this;

            //拖动事件
            let left ,top;
            _this.dialog.ondragstart = function(e){
                // console.log(e.dataTransfer);
                // e.dataTransfer.effectAllowed ='none';
                // console.log(e.dataTransfer);
                let pos = _this.dialog.getBoundingClientRect();
                left = Math.abs(e.x - pos.x);
                top  = Math.abs(e.y - pos.y);
            };
            _this.dialog.ondrag = function(e){
                if(e.x<1)return;
                _this.dialog.style.left = e.x -left+ 'px';
                _this.dialog.style.top = e.y -top+ 'px';
            };

            //关闭事件
            let buttons = _this.dialog.querySelector('div.title');

            buttons.onclick = function(e){
                let target = e.target;
                if(target.classList.contains('close')){
                    _this.close();
                }else if(target.classList.contains('max')){
                    _this.max();
                }else if(target.classList.contains('min')){
                    _this.min();
                }

            };
        },
        initHead:function(){

            let title = document.createElement('div');

            title.draggable=true;

            title.classList.add('title');

            title.innerHTML =`<p><i>${this.param.title || '请输入标题'}</i></p><p><span class="min"></span><span class="max"></span><span class="close"></span></p>`;

            this.dialog.appendChild(title);

            this.initBody();

        },
        initBody:function(){

            let dialogBody = this.scope.document.createElement('div');

            let con = this.param.target ;

            if(getType.call(con) =='[object String]'){
                con = this.scope.document.querySelector(con) || null;
                if(!con){
                    con =document.querySelector(this.param.target);

                }
            }

            con && dialogBody.appendChild(con);

            dialogBody.classList.add('body');

            this.dialog.appendChild(dialogBody);

        },
        init:function(param){

            let dialogd = document.createElement('section');

            dialogd.tabIndex ='-1';

            if(param.style){
                let sharedS ="";
                for(let key in param.style){
                    sharedS = sharedS + `${key}:${param.style[key]};`
                }
                dialogd.style = sharedS;
            }
            let tempIfr = document.querySelector('ul#main_sec >li.active');

            if(tempIfr){
                this.scope= tempIfr.children[0].contentWindow;
            }else {
                this.scope =window;
            }
            dialogd.id = this.id;

            dialogd.classList.add('dialog');

            this.param.type =='outer'?top.document.body.appendChild(dialogd):this.scope.document.body.appendChild(dialogd);

            this.dialog = dialogd;

            this.initHead();

            this.initEvent();

        },
        show:function(){
            this.dialog.classList.add("show");
        },
        close:function(){
            this.dialog.classList.remove("show");
        },
        max:function(){
            this.dialog.style.height ='100%';
            this.dialog.style.width ='100%';
            this.dialog.style.left ='0px';
            this.dialog.style.top ='0px';
            this.dialog.querySelector('span.max').style.display= 'none';
        },
        min:function(){
            this.dialog.style.height ='';
            this.dialog.style.width ='';
            this.dialog.style.left ='';
            this.dialog.style.top ='';
            this.dialog.querySelector('span.max').style.display= 'inline-block';
        }
    }
});
