package com.services;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.dao.DBOpr;
import com.services.interf.AbstractServices;
import com.services.interf.Services;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ck on 2017/8/21.
 */
@Service
public class DefaultServices extends AbstractServices {

    @Resource
    private DBOpr db;

    @Transactional(rollbackFor = Exception.class,propagation = Propagation.NESTED)

    @Override
    public Object excute(JSONObject param){

        String  sqlId = param.getString("sqlId");

        Assert.notNull(sqlId,"sqlId不能为空");

        //data 有可能是json 对象也有可能是json 数组
        String dataParam = param.getString("data");

        List<Map> data = new ArrayList<>();

        if(dataParam !=null){
            System.out.println("提交的参数："+dataParam);
            if(dataParam.startsWith("[{") || dataParam.startsWith("[")){//data:[{}，{}]多个参数

                data = JSONArray.parseArray(dataParam,Map.class);
            }else{
                data.add(JSONObject.parseObject(dataParam,Map.class));
            }
        }

        //Assert.notNull(data,"提交的数据为空");

        return db.excute(sqlId,data);
    }

}
