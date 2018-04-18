require(['tree','vue'],function(tree,vue){

    let channel = Channel;
    //弹窗
    let tip =  channel.connect("alert");

    //后台服务
    let service = channel.connect("service");

    let model =new vue({
        el:'#container',
        data:{
            search:'',
            fnc:{
                pname:'',
                sys_id         :''                 ,
                sys_pid        :'-1'               ,
                sys_name       :''                 ,
                sys_icon       :''                 ,
                sys_used       :''                 ,
                sys_url        :''                 ,
                sys_remark     :''
            },
            img:{
                imgs:[],
                show:false
            }
        },
        methods:{
            save:function(){
                if(validation())return;

                let msg={
                    data:this.fnc,
                    sqlId:'insert_fnc'
                };
                if(model.fnc.sys_id){
                    msg.sqlId = 'update_sys_menu';
                }
                service.post(msg).then(function(data){

                    data.sys_id && (model.fnc.sys_id = data.sys_id);

                    if(data.sys_id){

                        let node = tempTree.addNode(data);

                        node.expand();

                    }else{
                        tempTree.updateNode(model.fnc);
                    }

                    tip.post(model.fnc.sys_name,'成功');

                    model.clear();
                });
            },
            remove:function(){
                    let nodes = tempTree.getSelect();
                    if(!nodes.length){
                        tip.post('错误','请先选择要删除的菜单');
                        return;
                    }

                    let ids =nodes.map(function(node){
                        return node.sys_id;
                    });
                    service.post({
                        data:{ids:ids},
                        sqlId:'remove_sys_men'
                    }).then(function(res){
                        nodes.forEach(function(item){
                            item.remove();
                        });
                        tip.post('删除完成','');

                        model.clear();
                    });
            },
            choseIcon:function(){
                if(model.img.imgs.length){
                    model.img.show = true
                }else{
                    let msg={
                        req:'icon'
                    };
                    service.post(msg).then(function(data){

                        model.img.imgs = data;

                        model.img.show = true;

                    })
                }

            },
            chose:function(icon){
                model.img.show= false;

                model.fnc.sys_icon = icon;

                let temp = document.querySelector("#icon_down");

                temp.style.backgroundImage=`url(data:image/jpg;base64,${icon})`;
                temp.placeholder ='';
            },
            clear:function(){
                for(let i in model.fnc){
                    model.fnc[i] ='';
                }
                model.fnc.sys_pid ='-1';
                this.chose('');
            }
        }
    });

    let tempTree;
    function init (){
        let msg={
            sqlId:'get_menus'
        };
        service.post(msg).then(function(data){

            console.log(data);

            tempTree=new tree({el:'tree',data:data,key:{id:'sys_id',pid:'sys_pid',name:'sys_name'},callback:{

                click:function(e,node){

                    model.fnc.pname=node.sys_name;

                    model.fnc.sys_pid=node.sys_id;
                },
                dbClick:function(e,node){

                    model.fnc.pname = node.getParent().sys_name;

                    model.fnc.sys_name = node.sys_name;

                    model.fnc.sys_id =node.sys_id;

                    model.fnc.sys_pid =node.sys_pid;

                    model.fnc.sys_name =node.sys_name;

                    model.fnc.sys_url =node.sys_url;

                    model.fnc.sys_icon = node.sys_icon;

                    model.fnc.sys_used = node.sys_used;

                    model.chose(node.sys_icon);

                }
            }});
            model.$watch('search',function(val){
                tempTree.search(val,'sys_name');
            })
        });
    }

    init();

    function validation (){
        return  !model.fnc.sys_name && tip.post('提交错误','请输入菜单名称');

    }
});