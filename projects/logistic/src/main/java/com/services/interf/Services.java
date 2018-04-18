package com.services.interf;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by ck on 2017/8/21.
 */
public interface Services {

    public <T> T  excute(JSONObject param);

}
