package com.aop.msgAop;

import com.alibaba.fastjson.JSONObject;
import com.container.SessionContainer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import javax.websocket.Session;
import java.util.logging.Handler;

/**
 * Created by ck on 2017/8/22.
 */
@Component
@Aspect
public class HandlerAop {


    private Log log = LogFactory.getLog(Handler.class);



    public HandlerAop(){
        log.info("监视器启动");
    }
    //定义关注点
    @Pointcut(value = "execution(* com.dispatcher.HandlerDispatcher.dispatch(..)) && args(json,session)",argNames = "json,session")
    protected void any(JSONObject json,Session session){}

//    @Before(value = "any(session)",argNames = "session")
//    public void  before(Session session){
//        System.out.println("????????????????"+json);
//    }

    //
    @After(value = "any(json,session)",argNames = "json,session")
    public void after(JSONObject json, Session session){
        System.out.println("》》》》》》》》》》");
    }

    @AfterReturning(value = "any(json,session)",argNames = "json,session,red",returning="red")
    public void red(JSONObject json, Session session,Object red ) throws InterruptedException {

        log.info("返回值"+red);

        SessionContainer.getAll().forEach(se->{
            log.info("发送到用户"+se);
            if(se.isOpen()){
                se.send(red.toString());
            }else{
                System.out.println("???");
                SessionContainer.remove(se.getId());
            }
        });
    }

    @AfterThrowing(value="any(json,session)",argNames = "json,session,ex",throwing = "ex")
    public void handlerException(JSONObject json,Session session,Throwable ex){

       log.info("处理器发生异常");

        JSONObject error = new JSONObject();

        error.put("flag","0");//
        error.put("tip","数据库操作异常");

        SessionContainer.getAll().forEach(se->{
            se.send(error.toJSONString());
        });

    }
}
