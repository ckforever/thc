package com.msgHandler.moduleHandler;

/**
 * Created by ck on 2017/9/23.
 */

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.msgHandler.interf.MsgProcess;
import com.services.PageService;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.websocket.Session;
@Component("page")
public class PageNav implements MsgProcess{

    @Resource
    PageService service;

    @Override
    public <T> Object proc(T pkg) {
        if(pkg instanceof JSONObject){
            return service.excute((JSONObject)pkg);
        }else if(pkg instanceof JSONArray){
            return  service.excute((JSONArray)pkg);
        }
        return "1";
    }
}
