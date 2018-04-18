require(['vue','tree','db','alert'],function(vue,tree){

    let menus=[];

    let db = Channel.connect('service');

    let model=new vue({
        el:'#container',
        data:{
            user:{
                name:'ck',
                company:{},
                menus:menus
            },
            modules:[]
        },
        watch:{
            modules:function(){

            }
        },
        methods:{
            open:function(item,e){
                let cur = nav_bar.querySelector(`#nav_${item.id}`);

                if(!cur){
                    cur = this.append(item);
                }
                cur.click();
            },
            remove:function(c){
                document.querySelector(`#nav_${c.id}`).remove();
                document.querySelector(`#ifr_${c.id}`).remove();
            },
            append:function(item){

                let li =document.createElement("li");

                li.style.backgroundImage = `url(data:image/jpg;base64,${item.icon})`;

                li.id = `nav_${item.id}` ;

                li.innerHTML = `<span>${item.name}</span><i></i>`;

                li.onclick = function(e){
                    model.clickLi(item,e);
                };
                document.getElementById("nav_bar").appendChild(li);

                //
                let iff= document.createElement("li");

                let ifr =document.createElement("iframe");

                iff.id =`ifr_${item.id}`;



                ifr.onload= function(){
                    ifr.contentWindow.Channel = Channel;
                };

                ifr.src = item.src;

                ifr.onbeforeunload = function(){
                    Channel.disconnect("");
                }

                iff.appendChild(ifr);

                document.getElementById("main_sec").appendChild(iff);

                return li;
            },
            clickLi:function(item,e){
                let navBar =document.querySelector("#nav_bar");
                let manSec =document.querySelector("#main_sec");

                if (e.target.tagName != 'I') {
                    let active = navBar.querySelector("li.active");

                    active && active.classList.remove("active");

                    let acifr = manSec.querySelector("li.active");

                    acifr && acifr.classList.remove("active");

                    navBar.querySelector(`#nav_${item.id}`).classList.add("active");
                    manSec.querySelector(`#ifr_${item.id}`).classList.add("active");

                } else {
                    this.remove(item);

                    if(e.target.parentNode.classList.contains("active")){
                        let temp = navBar.querySelector("li:first-child");

                        temp && temp.classList.add("active");

                        temp = manSec.querySelector("li:first-child");

                        temp && temp.classList.add("active");
                    }


                }
            }
        }

    });

    //初始化菜单
    setTimeout(function(){
        db.post({
            sqlId:'get_user_menus'
        }).then(function(data){
            let menus = parseData(data);
            model.user.menus = menus;
        });
        let leftCon=document.querySelector("section.left_menu");

        window.onclick=function(){
           let lis = leftCon.querySelectorAll("li.active");

           [].forEach.call(lis,(item,index)=>{
               item.classList.remove("active");
           },true);
        }
    },2000);

    function  parseData(data,key){

        key = key || {};
        let id =key.id= key.id || 'id';
        let pid =key.pid= key.pid || 'pid';

        let name=key.name  = key.name || 'name';


        data = data  || [];

        let _map=new Map();

        data.forEach(function(item){//循环n次
            item[id]=item[id]+'';
            item[pid]=item[pid]+'';
            _map.set(item[id],item);
        });
        //刷选出所有的子元素时间复杂度 n
        data.forEach(item =>{
            //搜索用
            let x=_map.get(item[pid]);
            if(x){
                x.child || (x.child = []);
                x.child.push(item);
            }
        });
        //去除重复
        data=data.filter(item =>{//循环n次
            if(!_map.get(item[pid])){
                return true;
            }
        });

        _map =null;
        return data;
    }

});