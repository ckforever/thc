package com.msgHandler;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.msgHandler.interf.MsgProcess;
import com.services.DefaultServices;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.websocket.Session;

/**
 * Created by ck on 2017/8/21.
 */
@Component
public class DefaultHandler implements MsgProcess{

    @Resource
    DefaultServices service;

    @Override
    public <T> Object proc(T pkg ){
        return  service.excute((JSONObject)pkg);
    }
}

