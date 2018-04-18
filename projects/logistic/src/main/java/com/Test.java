package com;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.*;
import java.net.Socket;
import java.util.Arrays;

/**
 * Created by ck on 2017/9/16.
 */
public class Test {

    public static void mdain(String args[]){
        String path =Test.class.getResource("/").getPath();
        System.out.println(path);
        File file =new File(path+"/context/temp/gt.logfile0");

        File temp =new File(path+"/context/temp/gt1.txt");


        System.out.println(file.getPath());

        String t = new String();

        /*File [] files =file.listFiles();
        for(int i=0;i<files.length;i++){
            System.out.println(files[i].getPath());
        }*/

        try  {
            System.out.println(temp.exists());

            System.out.println(temp.length());

            System.out.println(file.length());

            if(!temp.exists()){
                System.out.println("adfadfd");
                temp.createNewFile();
                temp.setWritable(true);
            }

            BufferedReader br=new BufferedReader(new InputStreamReader(new FileInputStream(file),"unicode"));

            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(temp)));
            String line=null;

            char [] ch ;
            while((line=br.readLine())!=null){

                if(!line.trim().equals("")){
                    System.out.println(line);
                    ch = line.toCharArray();
                    int[] acii =new int[ch.length];

                    for(int i=0;i<ch.length;i++){
                        acii[i] = (int)ch[i];
                        writer.write(ch[i]);
                    }

                    writer.flush();
                    System.out.println(Arrays.toString(ch));



                }

            }
            writer.close();
            br.close();


        }catch (Exception e){
            e.printStackTrace();
        }
    }


    public static void main(String  args[]) throws IOException {


        try (InputStream in = new FileInputStream("")) {


        }catch (Exception e ){

        }

        Socket sk =new Socket();

        sk.getInputStream();

        String json ="{a:[{name:''},{age:''}],b}";

        JSONObject pkg = JSONObject.parseObject(json);

        JSONArray arr = pkg.getJSONArray("a");

        arr.forEach(item->{
            System.out.println(item);
        });


    }
}
