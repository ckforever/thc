require(['vue','table','tree','select'],function(vue,tab,tree){

    let db = Channel.connect('service');

    let tip = Channel.connect('alert');

    let roleTree;
    let fncTree;
    //请求部门树
    db.post([{sqlId:'get_uer_role'},{sqlId:'get_menus'}]).then(function(data){
        let roles = data[0];
        let fns = data[1];
        //角色树形
        roleTree = new tree({
            el:'tree',
            data:roles,
            callback:{
                click(dom,node){
                    model.role.role_type = node.id;
                },
                dbClick(dom,node){
                    Channel.modelData(model.role,node);
                }
            }
        });
        //操作树形
        fncTree = new tree({
            el:'fnc_tree',
            key:{id:'sys_id',pid:'sys_pid',name:'sys_name'},
            checkbox:true,
            data:fns
        });
    });

    let model = new vue({
        el:'#container',
        data:{
            role:{
                role_id:'',
                role_name:'',
                role_type:'',
                role_permission_level:'',
                role_desc:'',
                role_used:'',
                role_crte_time:'',
                role_crte_id:'0'
            }
        },
        methods:{
            async1(data){
                model.role.role_type = data.id;
            },
            async(data){
                model.role.role_permission_level = data.id;
            },
            clear(){

            },
            remove(){

            },
            save(){
                if(validate())return;

                db.post([{sqlId:'add_role',data:model.role}]).then(function(data){

                    let mens = fncTree.getChecked();

                    let fncs = mens.map(item=>{
                        return {srm_role_id:data.role_id,srm_menu_id:item.sys_id};
                    });

                    fncs.length &&  db.post({sqlId:'add_role_mens',data:fncs}).then(function(){
                        alert(11);
                    });
                });
            }
        }
    });

    function validate(){
        console.log(11111);
        return !model.role.role_name && tip.post('请输入角色名称')||
               !model.role.role_type && tip.post('请选择角色分类')||
               !model.role.role_permission_level && tip.post('请选择改角色的数据权限');
    }
});