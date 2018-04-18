require(['vue','table','select'],function(vue,tab){

    let tip = Channel.connect('alert');

    let dialog ,groupDialog;

    let model = new vue({
        el:'#dialogcon',
        data:{
            sysConst:{
                const_group_id:'',
                const_name:'',
                const_value:'',
                const_crt_user:'1',
                const_id:''
            },
            sysGroup:{
                const_group_id:'',
                const_group_label:'',
                const_group_name:'',
                const_group_desc:''
            }
        },
        methods:{
            async:function(id){
                this.sysConst.const_group_id = id;
            },
            saveGroup(){
                if(model.sysGroup.const_group_id){
                    groupTable.updateRow('update_const_group',model.sysGroup);
                }else{
                    groupTable.addRow('add_const_group',model.sysGroup);
                }
                groupDialog.close();
            },
            closeGroup(){
                groupDialog.close();
            },
            clearGroup(){
                Channel.modelData(model.sysGroup);
            },
            save:function(flag){

                let sqlId ='update_const';

                if((model.sysConst.const_id+'').length){//修改
                    table.updateRow(sqlId,model.sysConst);
                }else{//保存
                    sqlId = 'insert_conset_by_page';
                    table.addRow(sqlId,model.sysConst);
                }
                dialog.close();
            },
            clear:function(){
                modelData(model.sysConst,['const_crt_user'])
            },
            close:function(){
                dialog.close();
            }
        }
     });

    let groupTable;

    let table = new tab({
        el:'#table',
        req:{
            sqlId:'select_const_by_page'
        },
        search:[{
            title: '常量组',
            field: 'const_group',
            placeholder: '请输入转换值'
        },{
            title: '转换值',
            field: 'const_value',
            placeholder: '请输入常量组'
        }
        ],
        button:[
            {
                title:'常量组',
                type:'const_group',
                handle:function(data){
                    if(!groupTable){
                        initGroupTable();
                    }
                    groupDialog =tip.post({
                        title:'常量组',
                        target:'#table_group_dialog',//document.querySelector('#dialog'),
                        style:{
                            width:'85%',
                            left:'7.5%'
                        }
                    });
                }
            },
            {
                title:'新增常量',
                type:'add',
                handle:function(data){
                    modelData(model.sysConst,['const_crt_user']);

                    dialog =tip.post({
                        title:'新增常量',
                        target:'#dialog',//document.querySelector('#dialog'),
                        style:{
                            width:'70%',
                            height:'55%',
                            top:'10%'
                        }
                    });
                }
            },{
            title:'修改',
            type:'edit',
            handle:function(data){
                if(!data){
                    tip.post('错误','请先选择常量组');
                    return;
                }


                modelData(model.sysConst,data);

                dialog =tip.post({
                    title:'修改',
                    target:'#dialog',
                    style:{
                        width:'70%',
                        height:'55%',
                        top:'10%'
                    }
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
                        _this.deleteRow('delete_const');
                    });

                }
            }],
        callback:{
            ondblclick:function(data){

                modelData(model.sysConst,data);

                console.log(model.sysConst.const_group);

                dialog =tip.post({
                    title:'编辑',
                    target:'#dialog',//document.querySelector('#dialog'),
                    style:{
                        width:'70%',
                        height:'55%',
                        top:'10%'
                    }
                });
            }
        },
        column:[
            {
                title:'#ID',
                field:'const_id',
                itemStyle:{
                    width:'60px',
                    color:'red',
                    background:'#34556d'
                }
            },
            {
                title:'常量组',
                field:'const_group_name',
                itemStyle:{
                    background:'#70772e'
                }
            },
            {
                title:'转换值',
                field:'const_value'
            },
            {
                title:'常量值',
                field:'const_name',
                itemStyle:{
                    background:'rgba(21, 90, 52, 0.95)',

                }
            },
            {
                title:'创建时间',
                field:'const_crt_time'
            }

        ]
    });

    function initGroupTable(){
        groupTable= new tab({
            el:'#table_group',
            req:{
                sqlId:'select_cost_group'
            },
            search:[{
                title: '常量组',
                field: 'const_group',
                placeholder: '请输入转换值'
            },{
                title: '用途',
                field: 'const_value',
                placeholder: '请输入常量组'
            }
            ],
            callback:{
                ondblclick:function(data){
                    modelData(model.sysGroup,data);
                    groupDialog =tip.post({
                        title:'修改常量组',
                        target:'#dialogg',//document.querySelector('#dialog'),
                        style:{
                            width:'50%',
                            height:'40%',
                            top:'18%',
                            left:'25%'
                        }
                    });
                }
            },
            button:[
                {
                    title:'新增常量组',
                    type:'add',
                    handle:function(data){

                        modelData(model.sysGroup);

                        groupDialog =tip.post({
                            title:'新增常量组',
                            target:'#dialogg',//document.querySelector('#dialog'),
                            style:{
                                width:'50%',
                                height:'40%',
                                top:'18%',
                                left:'25%'
                            }
                        });
                    }
                },{
                    title:'删除',
                    type:'delete',
                    handle:function(data){

                        let _this = this;

                        if(!_this.index){
                            tip.post('错误','请先选择要删除的常量组');
                            return;
                        }
                        tip.post('提示','删除后不可恢复，确认删除？',function(e,param){
                            _this.deleteRow('delete_const_group');
                        });

                    }
                }
            ],
            column:[
                {
                    title:'#ID',
                    field:'const_group_id',
                    itemStyle:{
                        width:'60px',
                        color:'red',
                        background:'#6d5046'
                    }
                },
                {
                    title:'常量组',
                    field:'const_group_name'
                },
                {
                    title:'标识符',
                    field:'const_group_label'
                },
                {
                    title:'用途',
                    field:'const_group_desc'
                }
            ]
        });
    }
    function modelData(target,source,avoid){

        let flag =Array.isArray(source);

        avoid = avoid || ( flag && source) || [];
        if(arguments.length <2 || flag){
            for(let i in target){
                avoid.indexOf(i) < 0 && ( target[i] ='');
            }

        }else {
            for(let i in source){
                avoid.indexOf(i) < 0 && (target.hasOwnProperty(i) && ( target[i] = source[i] ));
            }
        }
    }
});