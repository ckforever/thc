define(['vue'],function(vue){
    let moduleChannel=new BroadcastChannle('module_channel');


    moduleChannel.onmessage=function(data){



    }

    let model=new vue({

        el:"#main_container",
        data:{

        }
    });

});