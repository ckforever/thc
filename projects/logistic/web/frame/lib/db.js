define(['channel'],function(){

    let config={
        url:'192.168.3.16:8080/ws'
    };

    let flag =false;

    let service = Channel.connect("service");//服务器通道

    let tip = Channel.connect("alert");

    connect(true);

    function connect(reconnect){
        if(!flag){
            let ws=new WebSocket("ws://"+config.url);
            ws.onopen=function(e){
                connectSuccess(ws);
            };
            setTimeout(function(){
                !reconnect && tip.post('系统已断开','尝试重连中。。。');
                connect();
            },10000);
        }
    }
    function connectSuccess(ws){
        flag =true;

        tip.post('服务器连接成功');

        ws.onclose=function(e){
            tip.post('服务器连接断开','未知错误，请联系ck');
            flag = false;
            //尝试重连
            connect();
        };

        ws.onerror=function(e){
            tip.post('服务器连接断开','未知错误，请联系ck');
            flag = false;
            //尝试重连
            reConnect();
        };

        ws.onmessage=function(e){//消息到达pkg:{module:'',fnc:'',flag:''}i

           
            let data=e.data;

            data = JSON.parse(data);

            if(data.flag){
                service.post(data);//data:{flag:'',data:[],msgId:''}
            }else{
                tip.post("服务器错误",data.tip);//后台发生错误
            }
        };

        service.message(function(msg){//向服务器发送数据

            tip.post('数据请求中','请稍后。。。');
            let form ;
            //每个消息对象的唯一标识符
            let id = this.id;

            form = JSON.stringify({pkg:Array.isArray(msg)?msg:[msg],msgId:id});

            ws.send(form);

        },'all');
    }

});