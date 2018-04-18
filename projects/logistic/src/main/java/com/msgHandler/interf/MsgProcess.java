package com.msgHandler.interf;

import com.alibaba.fastjson.JSONObject;

import javax.websocket.Session;
import java.io.InputStream;

/**
 * Created by ck on 2017/8/21.
 */
public interface MsgProcess {

    //处理json数据
    public <T> Object  proc(T json);

}
