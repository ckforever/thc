define(function(){

    let tree= function(param){
        if(!param.el)return;

        this.param=param;

        this.container=document.querySelector(`#${param.el}`);

        if(!this.container){
            console.error("错误");
            return;
        }
        this.map=new Map();

        this.init();
    };
    let Node=function(param,_this){
        this.tree = _this;
        for(let key in param){
           key !='child' && (this[key] = param[key]);
        }

    };
    Node.prototype={
        constructor:Node,
        click:function(){

        },
        remove:function(){

            let id = this[this.tree.param.key.id];

            let temp = this.tree.container.querySelector(`#ck_${id}`);

            if(temp){

                let p = temp.parentNode;

                let pp =p.parentNode;

                if(pp.childElementCount==1){
                    pp.remove();
                }else{
                    p.remove();
                }

                this.tree.map.delete(id);
            }

        },
        addChild:function(node){

            let key =this.tree.param.key;

            let id = this[key.id];

            let self =this.tree.container.querySelector(`#ck_${id}`);

            let p =self ? self.nextElementSibling : this.tree.container;

            if(p && p.tagName =='UL'){

                let li = document.createElement('li');
                li.innerHTML = `<i id="ck_${node[key.id]}">${node[key.name]}</i>`;
                p.appendChild(li);

            }else{
                let ul = document.createElement('ul');
                ul.innerHTML = `<li><i id="ck_${node[key.id]}">${node[key.name]}</i></li>`;
                self.parentNode.appendChild(ul);
            }

            this.tree.map.set(node[key.id]+'',node);

            return this.tree.initNode(node[key.id]);

        },
        getParent:function(){
            return this.tree.map.get(this[this.tree.param.key.pid])|| {};
        },
        expand:function(){
           let node = this.tree.container.querySelector(`#ck_${this[this.tree.param.key.id]}`);
           let next = node && node.nextElementSibling;
           next && next.classList.add("expand");
        },
        update:function(){
            let key = this.tree.param.key;

            let id = this[key.id];

            let self =this.tree.container.querySelector(`#ck_${id}`);

            let p = self.parentNode;

            let pid =p && p.parentNode && p.parentNode.previousElementSibling && p.parentNode.previousElementSibling.id;

            if(!pid || `ck_${this[key.pid]}` != pid){

                let newP =this.tree.container.querySelector(`#ck_${this[key.pid]}`)|| null;


                let nextP =newP ? newP.nextElementSibling : null;

                let oldP = p.parentNode || null;
                if(nextP){
                    nextP.appendChild(p);
                }else if(newP){
                   let ul = document.createElement('ul');
                   ul.append(p);
                   newP.parentNode.append(ul);
                }
                if(oldP.childElementCount == 0){
                    oldP.remove();
                }
            }
            self.innerHTML = this[key.name];

            this.tree.map.set(id,this);
        }
    };

    tree.prototype={
        constructor:tree,

        getNode:function(id,key){//
            id || console.error('id不能为空');

            if(key){
                let entries = this.map.entries();
                let flag =true;
                let res;
                while(flag){
                    let item = entries.next();
                    if((item[key]+'').indexOf(id)){
                        res = item;
                        flag =false;
                    }
                }
                return res;
            }else{
                return this.map.get(id);
            }
            return '';
        },
        updateNode:function(data){

            let node;
            if(typeof data =='string' || typeof data =='number'){
                node =this.initNode(data);
            }else{
                node =new Node(data,this);
            }
           node &&  node.update();
        },
        removeNode(data){
            let node;
            if(typeof data =='string' || typeof data =='number'){
                node = this.initNode(data);
            }else{
                node =new Node(data,this);
            }
            node && node.remove();
        },
        getChecked:function(){
            let checkeds =  this.container.querySelectorAll("i.checked");
            let _this = this;

            let res =[];
            [].filter.call(checkeds,item=>{
                res.push(_this.map.get(item.id.replace("ck_","")));
            });
            return res;
        },
        getSelect:function(){
            let _this =this;
            let ids = _this.container.querySelectorAll("i.active");

            return [].map.call(ids,function(item){
                return _this.map.get(item.id.replace('ck_',''));
            });
        },
        addNode:function(data){

            let key = this.param.key;

            let pNode = this.initNode(data[key.pid]);

            pNode.expand();

            return pNode.addChild(data);

        },
        initNode:function(id){
            id || console.error('id不能为空');

            id =(id+'').replace('ck_','');

            let node = this.map.get(id);

            if(node instanceof  Node){
                node = node;
            }else {
                node =new Node(node,this);
                this.map.set(id,node);
            }
            return node;
        },
        search:function(value,key){
            key = key || this.param.key.name || '';
            let tempData = value ? this.param.data.filter(function(item,index){
                    if((item[key]+'').includes(value+'')){
                        return true;
                    }
            }) : null;
            this.parseData(tempData);
        },
        init:function(){
            let _this=this;

            this.parseData();

            if(this.param.callback){
                _this.beforeClick =this.param.callback.beforeClick;

                _this.click =this.param.callback.click;

                _this.afterClick =this.param.callback.afterClick;

                _this.dbClick = this.param.callback.dbClick;

                _this.timer =null;

            }
            //注册click事件
            this.container.onclick=function(e){

                _this.timer && clearTimeout(_this.timer);

                _this.timer =setTimeout(function(){
                    let target=e.target;
                    if(target.tagName=='I'){
                        let temp = _this.container.querySelector("i.active");

                        temp && temp.classList.remove("active");

                        target.classList.add("active");

                        let node = _this.initNode(target.id);


                        _this.beforeClick && _this.beforeClick(target,node,_this);//点击之前触发

                        _this.click && _this.click(target,node,_this);//点击事件

                        _this.afterClick &&_this.afterClick(target,node,_this);//点击之后

                        if(getComputedStyle(target,"::before").content.length){
                            let pos = target.getBoundingClientRect();

                            if( (e.x > pos.x && e.x <( pos.x+ 20 ) ) &&  (e.y > pos.y && e.y < (pos.y + 20))){
                                target.classList.toggle("checked");
                            }

                        }

                        console.log("???????"+target.style.paddingLeft);

                    }else if(target.tagName == 'UL'){
                        if(!target.classList.contains("tree")){

                            let prev = target.previousElementSibling;

                            target.parentNode.parentNode.style.height ='100%';

                            let totalH =0;
                            [].forEach.call(target.children,(item)=>{
                                totalH =totalH + item.clientHeight +2;
                            });

                            //收起放下
                            if(target.style.height == '100%'){

                                target.style.height = totalH +'px';

                                target.style.height ='';
                            }else{

                                target.style.height =prev.classList.contains("expand")? (prev.classList.remove("expand"),target.style.height=totalH +'px',''): (prev.classList.add("expand"), totalH+'px');
                            }

                            return false;
                        }
                    }
                },250);
                return false;
            }
            this.container.onselectstart =function(){return false;};

            this.container.ondblclick=function(e){

                _this.timer && clearTimeout(_this.timer);
                let target=e.target;
                if(target.tagName == 'I'){

                    let temp = _this.container.querySelector("i.active");
                    temp && temp.classList.remove("active");
                    target.classList.add("active");

                    let node = _this.initNode(target.id);

                    _this.dbClick && _this.dbClick(target,node,_this);
                }
                return false;
            }
            //this.param.data = null;
        },
        parseData:function(data){

            let key = this.param.key || {};
            let id =key.id= key.id || 'id';
            let pid =key.pid= key.pid || 'pid';

            let name=key.name  = key.name || 'name';

            let checkbox = 'checkbox';

            data = data || this.param.data || [];

            let _map=this.map;
            let flag =true;
            data.forEach(function(item){//循环n次
                item[id]=item[id]+'';
                item[pid]=item[pid]+'';
                item.child && (flag =false);
                _map.set(item[id],item);
            });
            //刷选出所有的子元素时间复杂度 n
            flag && data.forEach(item =>{
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

            //总共执行次数n*(1+1+1)
            function initTree(childs){
                let html='';
                for(let i=0,len=childs.length;i<len;i++){

                    let t=childs[i];

                    if(childs[i].child && childs[i].child.length){

                        html =`${html}<li><i id="ck_${t[id]}" ${{t:[checkbox]&&'uncheck'}}> ${t[name]} </i><ul>${initTree(t.child)}</ul></li>`;

                    }else{
                        html=`${html}<li><i id="ck_${t[id]}"> ${t[name]} </i></li>`;
                    }
                }
                return html;
            }
            //汇总html
            this.param.checkbox && this.container.classList.add("checkbox");
            this.container.innerHTML =`<i id="-1">${this.container.getAttribute('name') || '根节点'}</i>${ initTree(data)}`;
        }
    };
    return tree;
});