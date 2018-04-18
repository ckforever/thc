package com.services;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.dao.DBOpr;
import com.services.interf.Services;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.annotation.Resource;
import java.sql.SQLException;

/**
 * Created by ck on 2017/10/2.
 */
@Service
public class PageService implements Services {

    @Resource
    DBOpr opr;


    @Transactional(rollbackFor = Exception.class,propagation = Propagation.NESTED)

    public Object excute(JSONObject param) {

        String  sqlId = param.getString("sqlId");

        Assert.notNull(sqlId,"sqlId不能为空");
        JSONObject page = param.getJSONObject("page");

        Assert.notNull(page,"page不能为空");

        JSONObject data = param.getJSONObject("data");

        return opr.getPage(sqlId,data,page.getInteger("index"),page.getInteger("size"));
    }

    public Object excute(JSONArray pkgs){

        return null;
    }
}
