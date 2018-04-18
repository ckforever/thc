define(['vue','tree'],function(Vue,tree){

    let template =' <div tabindex="-1" class="down" :tip="tip">'+
        '<input  v-model="tempName"  :placeholder="placeholder || tip" />'+
        '<section tabindex="-2" class="down_list" >'+
        '<ul><li v-for="item in arrData" @click="select(item)">{{item[fields.name]}}</li></ul>'+
        '</section>'+
        '</div>';

    let select = Vue.extend({
        props:['req','data','placeholder','tip','id','keys'],
        template:template,
        data(){

            if(!this.data){
                return {
                    tempName:'',
                    fields : this.keys || {id:'id',name:'name'},
                    arrData:[]
                };
            }else{
                return {
                    fields : this.keys || {id:'id',name:'name'},
                    tempName:'',
                };
            }
        },
        watch:{
            tempName(val,old){
                if(this.flag){
                    this.flag = false;
                    return;
                }
                if(val){
                    let _this= this;
                    this.arrData = this.cacheData.filter(function(item){
                        if(item[_this.fields.name].indexOf(val)>-1)return true;
                    });
                }else{
                    this.arrData = this.cacheData;
                }
            },
            id(val){
                if(val){
                    let _this= this;
                    let temp =this.arrData.find(item=>{
                        if(item[_this.fields.id] == val)return true;
                    });
                    this.tempName = temp ?  temp[_this.fields.name] :'';

                }else{
                    this.tempName ='';
                }
                this.flag = true;
            }
        },

        methods:{
            select(item){

                this.tempName = item[this.fields.name];

                this.$emit('async',item);

                this.flag = true;
            }
        },
        created(){
            if(!this.data){
                let _this = this;
                console.log(this);
                Channel.connect('service').post(this.req).then(function(data){
                    _this.cacheData = _this.arrData  = data;
                });
            }else{
                this.cacheData = this.data;
            }
            this.flag = false;

        }
    });

    Vue.component('ck-select',select);

    //树形下拉

    let treeTemplate =' <div tabindex="-1" class="down" :tip="tip">'+
                        '<input  v-model="tempName"  :placeholder="placeholder || tip" />'+
                        '<section tabindex="-2" class="down_list" >'+
                            '<ul :id="treeId" class="tree" :name="tip">'+
                            '  </ul>'+
                        '</section>'+
                        '</div>';

    let treeSelect = Vue.extend({
        props:['req','data','placeholder','tip','id','keys'],
        template:treeTemplate,
        data(){
            return {
                tempName:'',
                treeId:'tree_'+(new Date().getTime()>>17)
            };
        },
        watch:{
            id(val){
                if(this.flag){
                    return;
                }
                if(val){
                    let temp =this.tree.getNode(val);
                    this.tempName= temp?temp[this.keys['name']]:'';
                }else{
                    this.tempName ='';
                }
                this.flag= true;
            },tempName(val,old){
                if(this.flag){
                    this.flag = false;
                    return;
                }
                if(val){
                    this.tree.search(val,'name');
                }else{
                    this.tree.search();
                }
            }
        },
        mounted(){
            let _this = this;
            _this.keys = _this.keys || {id:'id',pid:'pid',name:'name'};
            if(!this.data){
                console.log(this);
                Channel.connect('service').post(this.req).then(function(data){
                    _this.tree = new tree({
                        el:_this.treeId,
                        data:data,
                        key:_this.keys,
                        callback:{
                            click(dom,node){
                                _this.tempName = node[_this.keys.name];
                                _this.$emit('async',node[_this.keys.id]);
                                _this.flag = true;
                            }
                        }
                    });
                    _this.$emit('reftree',_this.tree);
                });
            }else{
                function initTree(data){
                    console.error(data);
                    _this.tree = new tree({
                        el:_this.treeId,
                        data:data,
                        key:_this.keys,
                        callback:{
                            click(dom,node){
                                _this.tempName = node[_this.keys.name];
                                _this.$emit('async',node[_this.keys.id]);
                                _this.flag = true;
                            }
                        }
                    });
                    _this.$emit('reftree',_this.tree);
                }
                _this.data.length && initTree(_this.data);
                _this.$watch("data",function(val,old){
                    initTree(val);
                });

            }
            this.flag = false;
        }
    });

    Vue.component('ck-tree-select',treeSelect);
});