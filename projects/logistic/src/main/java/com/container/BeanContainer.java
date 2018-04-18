package com.container;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * Created by ck on 2017/8/21II.
 */
@Component
public class BeanContainer implements ApplicationContextAware {

    private static Log log= LogFactory.getLog(BeanContainer.class);

    private static ApplicationContext context;
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {

        log.info("设置容器");

        this.context = applicationContext;

    }

    public static Object get(String id){
        if(id==null || "".equals(id)){

            //log.error("未找到相关处理器，转发到默认处理器");

            id="defaultHandler";
        }
        return context.getBean(id);
    }
}
