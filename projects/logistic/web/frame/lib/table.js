define([],function(){

    let channel =Channel.connect('service');

    let table =function(param){
        this.param =param;

        let tempCon =document.querySelector(`${param.el}`);

        if(!tempCon || tempCon.tagName !='TABLE'){
            return;
        }
        this.container = tempCon.parentNode;

        tempCon.remove();

        this.param.data =this.param.data || [];

        this.init(param);
    }
    table.prototype ={

        constructor:table,

        init:function(){
            let _this = this;
            _this.param.search= _this.param.search || [];//{title:'',key:''}
            _this.param.button = _this.param.button ||[];//{type:'add',title:'添加'，handle:function,class:''}
            _this.param.column =_this.param.column || [];
            _this.param.data =_this.param.data || {};

            let page = _this.param.req.page || {};
            _this.param.req = {
                sqlId:_this.param.req.sqlId || '',
                data:_this.param.req.data ||{},
                req:'page',
                page:{
                    size:page.size ||10,
                    index:page.index-1||0
                }
            };
            //后台返回数据处理
            channel.message(function(data){

                if(!data.data)return;

                _this.param.data = data.data;

                _this.initBody();

                if(_this.param.req.total != data.total){
                    _this.param.req.total = data.total;
                    _this.initPageNav();
                }
            });
            //如果没有传进来数据则需要去后台请求
            _this.param.req.total || channel.post(_this.param.req);

            //初始化头部
            _this.param.req.total =_this.param.data.length;
            _this.initHead();

            let buttonS = new Map();

            _this.param.button.forEach(function(item){
               item.type && buttonS.set(item.type,item.handle);
            });

            //设置回调函数
            let click = _this.param.callback && _this.param.callback.onclick;

            //设置点击事件
            _this.container.onclick=function(e){
                let target = e.target;
                let tagName = target.tagName;

                if(tagName == 'BUTTON'){//按钮
                    let type = buttonS.get(target.dataset['type']);

                    let data = _this.index ? _this.param.data[_this.index-1]:'';

                    type && type.call(_this,data,e);

                }else if(tagName == 'TR' || tagName =='TD'){

                    _this.timer && clearTimeout(_this.timer);

                    let temp = _this.container.querySelector("tr.active");

                    temp && temp.classList.remove('active');

                    _this.timer = setTimeout(function(){
                        let index =0;

                        if(tagName =='TR'){
                            index = target.rowIndex;
                            target.classList.add('active');
                        }else {
                            index = target.parentNode.rowIndex;
                            target.parentNode.classList.add('active');
                        }
                        _this.index = index;
                        click && click.call(_this,_this.param.data[index-1],_this.param.data,target);

                    },150);

                }
            };
            //双击事件
            let dbclick = _this.param.callback && _this.param.callback.ondblclick;

            _this.container.ondblclick = function(e){
                _this.timer && clearTimeout(_this.timer);
                let index =0;
                let target = e.target;
                let tagName = target.tagName;
                if(tagName =='TR'){
                    index = target.rowIndex;
                }else if(tagName =='TD'){
                    index = target.parentNode.rowIndex;
                }else{
                    return;
                }
                _this.index = index;

                dbclick && dbclick.call(_this,_this.param.data[index-1],_this.param.data,target);
            };

            this.container.onselectstart =function(){return false;};
            //分页点击
            this.container.querySelector("div.pageNav").onclick=function(e){
                let target = e.target;
                if(target.tagName =='LI'){
                    if(target.classList.contains('active')){
                        return;
                    }
                    let active =target.parentNode.querySelector("li.active");

                    active && active.classList.remove('active');

                    target.classList.add('active');

                    //当前活动的tr index
                    let index = target.dataset.index;

                    if( index =='next' && active){
                        index = active.dataset.index + 1;
                        active.nextElementSibling.click();
                        return;
                    }else if( index =='prev' && active){
                        index = active.dataset.index -1;
                        active.previousElementSibling.click();
                        return;
                    }
                    channel.post({
                        sqlId:_this.param.req.sqlId,
                        data:_this.param.req.data,
                        req:'page',
                        page:{
                            size:page.size ||10,
                            index: index || 0
                        }
                    });
                }
            };
            //宽度变化监听
            window.onresize= function(){
                _this.setWidth();
            }

            delete _this.param.button;
            delete _this.param.callback;
        },
        initHead:function(){

            let height = this.container.clientHeight;

            this.container.style.overflow ='hidden';

            let data = this.param.data;

            let head='<tr>';

            let shareStyle = '<colgroup>';

            let columns =this.param.column;

            for(let i=0,clen=columns.length;i<clen;i++){
                let col = columns[i];

                let itemStyle = col.itemStyle || {};

                let sharedS ="";
                for(let key in itemStyle){
                    sharedS = sharedS + `${key}:${itemStyle[key]};`
                }
                shareStyle = shareStyle + (sharedS ? `<col style ="${sharedS}">`: '<col>');

                head =head + `<th><i>${columns[i]['title']}</i></th>`;
            }

            shareStyle =shareStyle +"</colgroup>";

            head = head +'</tr>';

            let body = this.initBody();

            let search = this.param.search;

            let buttons = this.param.button;

            let searchS = search.map(function(item){
                return `<p><label>${item['title']}</label><input data-field="${item.field}" placeholder="${ item['placeholder'] ||'请输入搜索关键字'}" class="search"/></p>`;
            }).join('');

            let oprButtion =buttons.map(function(item){
                return `<p><button data-type="${item.type}" class="${item.type}">${item.title}</button></p>`;
            }).join('');

            let html = `<div class="tableMask" style ="height:${height}px">`+
                            '<div class="tool-bar">'+
                                `${searchS ?   '<div class="searchDiv">'+searchS+'</div>':''}`+
                                `${oprButtion? '<div class="buttonDiv">'+oprButtion+'</div>':''}`+
                            '</div>'+
                            '<div class ="table">'+
                                '<table class="head">'+
                                `${shareStyle} <thead id="${this.param.el}_header">${head}</thead>`+ //${shareStyle}
                                '</table>'+
                                '<table class="content">'+
                                ` ${shareStyle}  <thead id="${this.param.el}_body">${head}</thead>`+
                                `   <tbody>${body}</tbody>`+
                                '</table>'+
                            '</div>'+
                            '<div class="pageNav" >'+
                            '</div>'+
                        '</div>';

            this.container.innerHTML = html;

            let _this = this;
            this.initPageNav();
            //
            let ses = this.container.querySelectorAll("div.searchDiv input.search");

            ses && [].forEach.call(ses,(item)=>{
                item.oninput=function(){
                    let $this = this;
                    _this.timer && clearTimeout(_this.timer);
                    _this.param.req.data[$this.dataset.field] = $this.value;
                    _this.timer = setTimeout(function(){
                        //组织查询参数
                        // let temp='';
                        // for(let key in _this.param.req.data){
                        //     temp = temp+ _this.param.req.data[key];
                        // }
                        // temp &&
                        _this.refresh();
                    },900);
                }
            });
        },
        initPageNav:function(){

            let pageSize = this.param.req.page.size;

            let total = this.param.req.total/pageSize;

            let pageNum = total>parseInt(total.toFixed(0))? parseInt(total.toFixed(0))+1:total;

            let pageNavHtml ='<ul><li data-index="0"></li><li data-index="prev"></li>';

            if(pageNum<5){
                for(let i =1;i<pageNum;i++){
                    pageNavHtml += `<li  class="${i==1?'active':''}" data-index ="${i}">${i}</li>`;
                }
            }else{
                for(let i=1;i<3;i++){
                    pageNavHtml += `<li data-index ="${i}">${i}</li>`;
                }
                pageNavHtml += `<li>...</li>`;

                for(let i =pageNum-2;i<pageNum;i++){
                    pageNavHtml += `<li data-index ="${i}">${i}</li>`;
                }
            }

            pageNavHtml += `<li data-index ="next"></li><li data-index ="${pageNum-1}"></li></ul>`;

            this.container.querySelector("div.pageNav").innerHTML = pageNavHtml;

        },
        initBody:function(){

            let columns  = this.param.column;

            let tBody ='';

            let data =this.param.data;

            let temp;

            let clen = columns.length;



            for(let i=0,len =data.length;i<len;i++){//循环出行

                temp  = data[i];

                let tds ='',col;

                for(let j=0;j<clen;j++){//循环出列
                    col =columns[j];
                    //td
                    //tds.push([`<td>${col.formatter ? col.formatter(temp[col['field']],data) :temp[col['field']]}</td>`,colNum]);
                    tds =tds +`<td>${col.formatter ? col.formatter(temp[col['field']],data) :temp[col['field']]}</td>`;
                }
                tBody = tBody+ '<tr>'+tds+'</tr>';

            }

            //对数据进行分组
            function groupData(data,col){
                let resData =[];

                let group;

                for(let i =0,len = col.length;i<len;i++){
                    group = col[i];
                }
            }

            let bHtml = this.container.querySelector('tbody');

            this.tbody = bHtml || this.container;

            bHtml && (bHtml.innerHTML = tBody);

            this.setWidth();

            return tBody;

        },
        setWidth:function(){
            let ths = this.container.querySelectorAll('table.head th');

            let heads = this.container.querySelectorAll('table.content th');

            ths[ths.length-2] = null;

            [].forEach.call(ths,function(item,index){
                heads[index].style.width = item.clientWidth + 'px';
            });
            this.container.children.length && (this.container.children[0].style.height = this.container.clientHeight+'px');
        },
        initNav:function(){

        },
        refresh:function(param){

            let req = param ? param :this.param.req;
            channel.post({
                sqlId:req.sqlId || this.param.req.sqlId,
                data:req.data || this.param.req.data,
                req:'page',
                page:{
                    size:req.page && req.page.size || this.param.req.page.size,
                    index:req.page && req.page.index || 0
                }
            });

        },
        addRow:function(sqlId,param){

            let _this = this;

            channel.post({
                data:  param ,
                sqlId: sqlId || ''

            }).then(function(data){

                _this.refresh();
                return;

                let tbody = _this.tbody;

                let tr = document.createElement('tr');

                let tds ='';

                _this.param.column.forEach(function(item){

                    tds =tds +`<td>${param[item['field']]}</td>`;

                });

                _this.param.data.unshift(data);

                tr.innerHTML = tds;

                tbody.childElementCount ? tbody.insertBefore(tr,tbody.children[0]):tbody.parentNode.appendChild(tr);

            });
        },
        updateRow:function(sqlId,data,index){

            //根据data 查找需要修改的item
            let _this = this;
            let arrs = _this.param.data;

            index = index || _this.index && _this.index - 1 || 0;

            arrs[index] = data;

            let tempTr = _this.container.querySelector("tbody").children[index];

            let tds ='';

            _this.param.column.forEach(function(item){

                tds =tds +`<td>${data[item['field']]}</td>`;

            });
            tempTr.innerHTML = tds;
            //所有数据
            channel.post({
                sqlId:sqlId,
                data:data
            }).then(function(){
                _this.refresh();
            });
            _this.setWidth();
        },
        deleteRow:function(sqlId,data){
            if(data){
                let pos = this.param.data.indexOf(data);
                this.param.data.split(pos,1);
            }else{
                let index = this.index && this.index-1;
                data = this.param.data.splice(index,1)[0];
            }
            //this.container.querySelector('tbody').children[index].remove();

            let _this = this;

            channel.post({
                sqlId:sqlId,
                data:data
            }).then(function(){
                _this.refresh();
                _this.setWidth();
            });

        }
    }

    return table;
});