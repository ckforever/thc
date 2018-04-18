package com.msgHandler.moduleHandler;


import com.msgHandler.interf.MsgProcess;
import org.springframework.stereotype.Component;

import javax.websocket.Session;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

/**
 * Created by ck on 2017/8/25.
 */
@Component("icon")
public class ICON implements MsgProcess {

    //@Value("${imgs}")
    private String imgs ="/css/images/icon";


    @Override
    public <T> Object proc(T pkg) {
        String path = this.getClass().getResource("").getPath().replaceAll("%20","");

        path = path.substring(0,path.indexOf("/WEB-INF"));

        File file =new File(path+imgs);

        System.out.println(file.getPath());


        File[] files =file.listFiles();

        InputStream in ;


        List<String> list =new ArrayList<>();

        byte [] arr ;
        for(int i=0;i<files.length;i++){
            try{
                in = new FileInputStream(files[i]);
                arr =new byte[(int)files[i].length()];
                in.read(arr);

                list.add(Base64.getEncoder().encodeToString(arr));


            }catch (Exception e){

            }

        }

        return list;
    }


    public static void main(String [] arg){
        System.out.println(System.getProperties());
    }


}

