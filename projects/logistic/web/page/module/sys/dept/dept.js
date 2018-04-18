require(['vue','table','tree','select'],function(vue,tab,tree){

    let db = Channel.connect('service');

    let tip = Channel.connect('alert');

    let dialog;

    let subTree;
    //
    let model = new vue({
        el:'#dialog',
        data:{
            dept:{
                dept_id :'',
                dept_name  :'',
                dept_pid :'' ,
                dept_desc  :'',
                dept_crte_time :'' ,
                dept_crte_id :''
            },
            treeData:[]
        },
        methods:{
            ckTree(tree){
                subTree = tree;
            },
            async(id){
                this.dept.dept_pid = id;
            },
            save(){
                if(validate()){//验证不通过
                    return;
                }
                if(model.dept.dept_id){
                    db.post({
                        sqlId:'update_dept',
                        data:model.dept
                    }).then(()=>{

                        table.refresh();
                        depTree.updateNode(model.dept);
                        subTree && subTree.updateNode(model.dept);
                        Channel.modelData(model.dept);
                    });
                }else{
                    db.post({
                        sqlId:'add_dept',
                        data:model.dept
                    }).then((data)=>{

                        console.log('???????',data);
                        model.dept.dept_id =data.dept_id;
                        depTree.addNode(model.dept);
                        subTree && subTree.addNode(model.dept);
                        table.refresh();
                        Channel.modelData(model.dept);
                    });
                }
                dialog.close();
            },
            clear(){
                Channel.modelData(this.dept);
            },
            close(){
                dialog.close();
            }
        }
    });

    let depTree;
    //请求部门树
    db.post({sqlId:'select_dept'}).then(function(data){

        model.treeData = data;

        depTree = new tree({
            el:'tree',
            data:data,
            key:{id:'dept_id',pid:'dept_pid',name:'dept_name'},
            callback:{
                click(dom,node){

                    table.refresh({
                        data:{
                            dept_id:node.dept_id
                        }
                    });
                },
                dbClick(dom,node){
                    Channel.modelData(model.dept,node);
                    dialog =tip.post({
                        title:'修改部门',
                        target:'#dialog',//document.querySelector('#dialog'),
                        w:'70%',
                        h:'55%',
                        top:'10%'
                    });
                }
            }
        });

    });

    //
    let table = new tab({
        el:'#table',
        req:{
            sqlId:'select_dept'
        },
        search:[{
            title: '部门名称',
            field: 'dept_name',
            placeholder: '请输入常量组'
        },{
            title: '部门职能',
            field: 'dept_desc',
            placeholder: '请输入常量组'
        }],
        button:[
            {
                title:'新增',
                type:'add',
                handle:function(data){
                    Channel.modelData(model.dept);
                    dialog =tip.post({
                        title:'新增部门',
                        target:'#dialog',//document.querySelector('#dialog'),
                        w:'70%',
                        h:'55%',
                        top:'10%'
                    });
                }
            },{
                title:'修改',
                type:'edit',
                handle:function(data){
                    Channel.modelData(model.dept,data);
                    dialog =tip.post({
                        title:'修改部门',
                        target:'#dialog',//document.querySelector('#dialog'),
                        w:'70%',
                        h:'55%',
                        top:'10%'
                    });
                }
            },{
                title:'删除',
                type:'delete',
                handle:function(data){
                    let _this = this;

                    if(!_this.index){
                        tip.post('错误','请先选择要删除的常量');
                        return;
                    }
                    tip.post('提示','删除后不可恢复，确认删除？',function(e,param){
                        _this.deleteRow('delete_dept');
                        depTree.removeNode(data);
                        subTree && subTree.addNode(model.dept);
                    });
                }
            }],
        callback:{
            ondblclick:function(data){
                Channel.modelData(model.dept,data);
                dialog =tip.post({
                    title:'新增部门',
                    target:'#dialog',//document.querySelector('#dialog'),
                    w:'70%',
                    h:'55%',
                    top:'10%'
                });
            }
        },
        column:[
            {
                title:'#ID',
                field:'dept_id',
                itemStyle:{
                    width:'60px',
                    color:'red',
                    background:'#5958a5'
                }
            },
            {
                title:'上级部门',
                field:'dept_pname'
            },
            {
                title:'部门名称',
                field:'dept_name'
            },
            {
                title:'部门职能',
                field:'dept_desc',
                itemStyle:{
                    width:'40%'
                }
            },
            {
                title:'创建时间',
                field:'dept_crte_time'
            }

        ]
    });

    function validate(){
        return !model.dept.dept_name && tip.post('错误','部门名称不能为空')||
                model.dept.dept_name.length>50 && tip.post('错误','部门名称请保持在50个字符内');
    }
});