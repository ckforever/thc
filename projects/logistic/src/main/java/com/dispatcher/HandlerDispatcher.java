package com.dispatcher;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.container.BeanContainer;
import com.msgHandler.interf.MsgProcess;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import javax.websocket.Session;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by ck on 2017/10/23.
 */
@Component("dispatcher")
public class HandlerDispatcher {

    public HandlerDispatcher(){
        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>");
    }

    public Object dispatch(JSONObject json, Session session){

        JSONArray pkgs = json.getJSONArray("pkg");

        if(pkgs.size()==1){

            json.put("response" ,this.process(pkgs.getJSONObject(0)));

            json.put("flag","1");

            System.out.println(">>"+json);

            return json;
        }else{

            JSONObject temp = new JSONObject();

            List<Object> list = new ArrayList();

            pkgs.forEach(( item) ->{
                list.add( this.process((JSONObject)item) );
            });
            temp.put("msgId", json.getString("msgId"));

            temp.put("response",list);

            temp.put("flag","1");
            System.out.println("???"+temp);
            return temp;
        }
    }

    private Object process(JSONObject pkg){

        Assert.notNull(pkg,"提交的参数不能缺少pkg");

        String req= pkg.getString("req");

        //根据模块req查找处理类
        MsgProcess handler = (MsgProcess) BeanContainer.get(req);

        return  handler.proc(pkg);

    }
}
