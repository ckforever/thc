package com.test;

import java.io.FileInputStream;
import java.net.Socket;
import java.net.SocketAddress;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Created by ck on 2017/8/27.
 */
public class Test {

    public static  void main (String[] args)  {


        try(CKT t = new CKT()){
            t.aysnc();

        }catch (Exception e){

            System.out.println("+++++");
        }




    }
}
