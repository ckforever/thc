package com.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mysql.cj.api.mysqla.result.Resultset;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.mapping.SqlSource;
import org.apache.ibatis.session.SqlSession;
import org.springframework.data.redis.support.atomic.RedisAtomicLong;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.crypto.KeyGenerator;
import java.sql.*;
import java.util.*;
import java.util.concurrent.atomic.LongAdder;

/**
 * Created by ck on 2017/9/3.
 */
@Component
public class DBOpr {

    @Resource
    private SqlSession session;

    @Resource
    private RedisAtomicLong atom;

    @Resource
    private JdbcTemplate jdbc;

    @PostConstruct
    public  void initDBOpr(){

    }

   /*
    *
    *
    */
   public  <K,p>  List<K> getList(String sql,Object param){

       System.out.println("+++++++++++"+param);

       return session.selectList(sql,param);
    }

   public <M,P> M getOne(String sql,Object param){
       return session.selectOne(sql,param);
   }

   public <P> int update(String sql,Object param){
      return  session.update(sql,param);
   }

   public Object excute(String sql , List<Map> arr){

       MappedStatement mapped = session.getConfiguration().getMappedStatement(sql);

       String sqlType = mapped.getSqlCommandType().name();

       Object arg =arr;

       if(arr.size() == 1){
           arg = arr.get(0);
       }else if(arr.size()==0){
           arg = null;
       }

       if(sqlType == "INSERT"){
         return  this.insert(sql,arr,mapped);
       }else if(sqlType == "UPDATE"){
           return this.update(sql,arg);
       }else if(sqlType == "DELETE"){
           return this.delete(sql,arg);
       }else if(sqlType == "SELECT"){
           return this.getList(sql,arg);
       }
       return -1;
   }

   public Object getPage(String sql ,Map<String,Object> param,int index,int size)  {

       MappedStatement mapped = session.getConfiguration().getMappedStatement(sql);

       SqlSource source = mapped.getSqlSource();

       BoundSql bound =source.getBoundSql(param);

       String  dataSql = bound.getSql();

       List<ParameterMapping> list = bound.getParameterMappings();

       dataSql = "select $  from (" +dataSql + ")as t ";

       String totalSql = dataSql.replace("$","count(1) total");

       dataSql = dataSql.replace("$","t.*")+" limit "+(index*size)+","+size;

       System.out.println("分頁sql"+dataSql);

       try{

           Connection connection = jdbc.getDataSource().getConnection();
           //分页的总数
           PreparedStatement resTotal= connection.prepareStatement(totalSql);
           //条数
           PreparedStatement resData = connection.prepareStatement(dataSql);
           //设置参数
           for(int i=0;i<list.size();i++){
               Object temp =param.get(list.get(i).getProperty());
               resData.setObject(i+1,temp);
               resTotal.setObject(i+1,temp);
           }
           //总条数
           resTotal.execute();
           //
           ResultSet set =resTotal.getResultSet();

           int total =0;

           if(set.next()){
                total = set.getInt(1);
           }
           /**
            *
            *
            * */
           resData.execute();

           ResultSet data =resData.getResultSet();

           ResultSetMetaData  meta=data.getMetaData();

           Map<String,Object > row ;

           int column =meta.getColumnCount();

           List<Object> lists = new LinkedList<>();

           while(data.next()){
               row = new HashMap<>();

               for(int i =1;i<column+1;i++){
                   row.put(meta.getColumnName(i).toLowerCase(),data.getObject(i));
               }
               lists.add(row);
           }

           JSONObject jsonRes =new JSONObject();


           jsonRes.put("data",lists);

           jsonRes.put("total",total);

           connection.close();

           return jsonRes;


       }catch(Exception e) {
           e.printStackTrace();
       }
       return null;
   }

   public Object delete(String sqlid,Object param){

       session.delete(sqlid,param);
       return param;
   }
   public Object insert(String sql,List<Map> param,MappedStatement mapped){

      // adder.increment();//atom.getAndIncrement();

      // long id =adder.longValue();

       String [] keys = mapped.getKeyProperties();

       if(keys!=null && keys.length !=0){
           param.forEach(item->{
               item.put(keys[0],String.valueOf(atom.getAndIncrement()));
           });
       }
       session.insert(sql,param.size()==1?param.get(0):param.size()==0?null:param);

       return param;
   }

   private static LongAdder  adder =new LongAdder();

   public static void main(String [] args){
       long d= 9000l;

       System.out.println(Long.toString(d));

       LongAdder adder =new LongAdder();
       for(int i=0;i<10;i++){

           adder.increment();
           long id =adder.longValue();

           System.out.println(id);
       }
   }
}
