package com.msgHandler.interf;

import java.lang.annotation.*;

/**
 * Created by ck on 2017/8/25.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Fnc {
     String value() default "";
}
