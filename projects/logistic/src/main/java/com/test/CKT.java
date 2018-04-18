package com.test;

import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;

/**
 * Created by ck on 2018/1/13.
 */
public class CKT  implements Closeable{

    public static void main(String args[]){


        char B ='b';


        Charset charset = Charset.forName("Utf-8");

         System.out.println();
    }



    public  void  aysnc() throws Exception {

        System.out.println("??????");
        throw new Exception();

    }


    @Override
    public void close(){

        System.out.print(">>>>>>>");
    }
}
