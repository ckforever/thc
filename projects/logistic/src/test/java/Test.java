import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.nio.NioEventLoop;
import io.netty.channel.nio.NioEventLoopGroup;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisTemplate;

import java.io.IOException;
import java.io.InputStream;

import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Created by ck on 2018/1/9.
 */
 class Test implements Cloneable{

    public Test() {
    }

    @org.junit.Test
    public void name() throws Exception {
    }

    public static void main(String args[]) throws IOException, InterruptedException {

//
//       ApplicationContext app = new ClassPathXmlApplicationContext("context/spring.xml");
//
//       RedisTemplate redis =(RedisTemplate) app.getBean("redisTemplate");
//
//       redis.watch("ws");
//
//
//       String channel = "test";
//
//       Object ob = new Object();
//
//       String msg = "hello world";
//
//        RedisConnection con = redis.getConnectionFactory().getConnection();
//
//       for(int i=0;;i++){
//
//           System.out.println(">>>"+i);
//           con.publish(channel.getBytes(),msg.getBytes());
//       }
//
//       //redis.getConnectionFactory().getConnection().publish();

//        BlockingQueue queue = new ArrayBlockingQueue(10);
//
//        ThreadPoolExecutor pool = new ThreadPoolExecutor(10,10,10, TimeUnit.SECONDS,queue);
//
//
//        ServerSocket server = new ServerSocket(80);
//
//
//        Queue<Socket>  sockets = new LinkedList<>() ;
//
//        while(true){
//            Socket socket = server.accept();
//
//            sockets.add(socket);
//
//        }


        NioEventLoopGroup boss = new NioEventLoopGroup();

        ServerBootstrap server = new ServerBootstrap();

        server.group(boss);



        Socket socket = new Socket("192.168.3.18",80);

       System.out.println(socket.isConnected());

        OutputStreamWriter witer = new OutputStreamWriter(socket.getOutputStream());


        OutputStream out = socket.getOutputStream();





       while(socket.isConnected()){

           //Thread.sleep(100);
           System.out.println("发送消息");

           String msg = "{name:'ck',age:'29',sendTime:'2018-03-29',sender:'ck'}";


           ByteBuffer bf = ByteBuffer.allocate(4+msg.length());

           bf.putInt(msg.length());
           bf.put(msg.getBytes());

           out.write(bf.array());


           witer.flush();
       }

    }
}
