    define(function(){

        if(window.Channel || window.top.Channel){
            return Channel || window.top.Channel;
        }

        let Message=function(channel,sec){

            this.channel = channel;//channel为一个数组的引用

            this.id = `${sec}_${new Date().getTime()}`;//每个message 来自于哪里

        };

        Message.prototype={

            constructor:Message,

            post:function(...params){

                params = params.length==1 ? params[0] : params;

                let _this = this;

                let msgId = params.msgId;

                let returnData;

                console.log(params);
                if(msgId){
                    let callB = _this.channel.get(msgId);
                    if(callB){
                        let temp = params.response ? (params.response.length==1  ? params.response[0] : params.response):params;
                        returnData = callB.resolve ? callB.resolve(temp):(callB.callback && callB.callback(temp));
                        callB.resolve = null;
                    }
                }else{
                    _this.channel.forEach(function(obj,key){
                        if(key ==_this.id) return;//忽略自己

                        if(  ( obj.receive && (obj.receive.includes('all') || obj.receive.includes(key)) ) && (  obj.callback || obj.resolve  )){
                            let temp = params.response ? (params.response.length==1  ? params.response[0] : params.response):params;
                            returnData = obj.resolve ? obj.resolve(temp):(obj.callback ? obj.callback.call(_this,temp) : null);
                        }
                    });
                }
                return returnData ? returnData : _this;
            },
            then:function(callback){

                let _this = this;

                new Promise(function(resolve){
                    let temp = _this.channel.get(_this.id);
                    if(temp){
                        temp.resolve = resolve;
                    }else{
                        _this.channel.set(_this.id,{resolve:resolve,callback:callback});
                    }
                }).then(function(param){

                    callback && callback.call(_this,param);
                });

            },
            message:function(callback,revices){

                this.channel.set(this.id,{callback:callback,receive:[revices]});
            },
            disconnect:function(){
                this.channel.delete(this.id);
            }
        };
        let channel={

            map:new Map(),//管道集合

            connect:function(channel){//返回一个message对象

                let nameSpace = this.connect.caller && this.connect.caller.toString() || arguments.callee.toString();

                let sec='', reg=/[a-z|A-Z|\d]/g;
                //计算源
                for (let len =nameSpace.length,i=7; i<14;i++){

                    let t = nameSpace[Math.floor(len%i)];

                    if (reg.test(t)){
                        sec = sec + t;
                    }else {
                        i--;
                    }
                    len= Math.abs(len - i);
                }

                let pipeline =this.map.get(channel);

                if(!pipeline){
                    pipeline =new Map();
                    this.map.set(channel,pipeline);
                }

                return new Message(pipeline,sec);
            },
            remove:function(channel){
                this.map.delete(channel);
            },
            modelData:function(target,source,avoid){

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

        };

        window.Channel=channel;
    });