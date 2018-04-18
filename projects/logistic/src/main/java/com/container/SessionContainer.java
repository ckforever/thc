package com.container;

import com.message.WebMessage;
import org.springframework.stereotype.Component;

import javax.websocket.Session;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by ck on 2017/8/21.
 */
@Component
public class SessionContainer {

    private static Map<String,WebMessage> map = new HashMap<String,WebMessage>();

    public static void addSession(String id,WebMessage session){
        map.put(id,session);
    }

    public static WebMessage get(String id){
        return map.get(id);
    }

    public static List<WebMessage> getAll(){

        List list = new ArrayList<WebMessage>();

        SessionContainer.map.forEach((key,WebMessage)->{
            list.add(WebMessage);
        });

        return list;
    }
    public static void remove(String id){
        map.remove(id);
    }
}
