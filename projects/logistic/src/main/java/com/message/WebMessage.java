package com.message;

import com.dispatcher.HandlerDispatcher;
import com.alibaba.fastjson.JSONObject;
import com.container.SessionContainer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

/**
 * Created by ck on 2017/8/5.
 */
@Component
@ServerEndpoint("/ws")
public class WebMessage {

    private Session session;

    @Resource @Qualifier("dispatcher")
    private HandlerDispatcher dispatcher =new HandlerDispatcher();

    @OnOpen
    public void onOpen(Session session){

        System.out.println("连接已经打开");
        this.session=session;

        SessionContainer.addSession(session.getId(),this);
    }

    @OnClose
    public void onClose(Session session){

        System.out.println("连接已经断开"+session.getId());
        SessionContainer.remove(session.getId());

    }

    @OnError
    public void onError(Session session, Throwable error){

        System.out.println("发生错误"+session.getId());
        SessionContainer.remove(session.getId());
        error.printStackTrace();
    }

    @OnMessage
    public void onMessage(byte [] binary,Session session){//接收文件

//        session.getMessageHandlers();
        MessageHandler handler ;//= session.getMessageHandlers();
        System.out.println("???"+binary);

        try{
            session.getBasicRemote().sendText("come  back");
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    /*
        处理json类型的数据
     */
    @OnMessage
    public void processJSON(String arg,Session session) throws IOException, EncodeException {

        JSONObject json =  JSONObject.parseObject(arg);

        Object  res = dispatcher.dispatch(json,session);

        session.getBasicRemote().sendText(res.toString());
    }
    /*
        返回的数据格式为：{success:true,msg:'提示信息'，model:'模块号',data:[]}
     */
    public  void send(String data){
        System.out.println("线程ID"+Thread.currentThread().getId());
        try{
            this.session.getBasicRemote().sendText(data);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public boolean isOpen(){
        boolean open = this.session.isOpen();
        return open;
    }

    public String getId(){
        return this.session.getId();
    }
}
