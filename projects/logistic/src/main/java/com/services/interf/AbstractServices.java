package com.services.interf;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ck on 2017/10/23.
 */
public abstract class AbstractServices implements  Services{

    public abstract Object excute(JSONObject pkg);

    public Object excute(JSONArray pkgs){

        List list = new ArrayList<>();

        pkgs.forEach(item->{
            list.add(this.excute((JSONObject) item));
        });

        return list;
    }

}
