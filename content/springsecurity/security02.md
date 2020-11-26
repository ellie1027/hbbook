---
title: 'spring security configuration'
metaTitle: "Spring Security | java configuration"
metaDescription: "Spring Security | java configuration"
---

## GOAL
rest api 기반의 ajax를 쓰는 프로젝트에서 jwt 토큰을 사용하여 spring security 구현

## 1) Sptring Security Configuration

지난 1편에서 간단하게 자바 설정에 관하여 포스팅했지만, 스프링 시큐리티 설정은 다루지 않았다.
spring boot 같은 경우는 단순히 의존성을 추가해주는 것만으로도 모든 애플리케이션 요청에 보안이 적용되지만
스프링 프레임워크는 의존성 추가 후 스프링 컨테이너를 통하여 자바 웹 서버에 DelegatingFilterProxy를 등록해주어야 한다.
스프링 시큐리티가 필터 기반으로 동작하는 프레임워크기 때문이다.

## 2) SecurityWebInitializer.java

먼저 spring-security-web, spring-security-config 라이브러리를 각 스프링 버전에 맞춰 추가해준다.

```xml

<!-- spring security -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
    <version>${your version}</version>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-config</artifactId>
    <version>${your version}</version>
</dependency>
```



## 3) AbstractSecurityWebApplicationInitializer

java configuration 상에서 DelegatingFilterProxy를 웹서버에 등록시키려면 AbstractSecurityWebApplicationInitializer 클래스를 상속받으면 된다.
스프링에서 자동으로 이 클래스를 감지하여 애플리케이션의 모든 요청에 자동으로 보안을 적용시킨다.



```java
public class SecurityWebInitializer
        extends AbstractSecurityWebApplicationInitializer
{

}

//AbstractSecurityWebApplicationInitializer.class를 살펴보면......
public abstract class AbstractSecurityWebApplicationInitializer implements WebApplicationInitializer {
//.....
    private void insertSpringSecurityFilterChain(ServletContext servletContext) {
        String filterName = "springSecurityFilterChain";
        DelegatingFilterProxy springSecurityFilterChain = new DelegatingFilterProxy(filterName);
        String contextAttribute = this.getWebApplicationContextAttribute();
        if (contextAttribute != null) {
            springSecurityFilterChain.setContextAttribute(contextAttribute);
        }

        this.registerFilter(servletContext, true, filterName, springSecurityFilterChain);
    }
}
//.....
```


프로젝트를 실행 시 /login으로 접속했을 때 스프링 시큐리티 기본 로그인 화면이 뜨면 서비스가 정상적으로 올라간 것이다.

![중간 이미지](/images/spring_security_2_00.png)


## 4) WebSecurityConfigurerAdapter 과 @EnableWebSecurity

이제 스프링 시큐리티 기능들을 커스터마이징 할 수 있는 설정 파일을 작성해보자.



```java
@Configuration
@EnableWebSecurity
public class SpringSecurityConfiguration extends WebSecurityConfigurerAdapter {

}
```

스프링 설정 파일이므로 @Configuration을 붙여 주고, @EnableWebSecurity을 붙여서 스프링 시큐리티 설정 파일로 만든다.


그리고 WebSecurityConfigurerAdapter 클래스에 있는 configure 메소드를 상속받는다.


이 메소드를 사용하여 csrf 대비, session 상태 설정, 보안 인증 방식 설정(basic auth, formlogin, jwt token 등..), 필터 추가, 에러 핸들링 등 여러가지 스프링 시큐리티 설정을 적용할 수 있다.



```java
@Configuration
@EnableWebSecurity
public class SpringSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
           //.....
    }

}
```


이제 설정은 끝났다.
다음 포스팅에서는 스프링 시큐리티에 대한 간략한 개요와 인증, 인가의 개념, 그리고 인증 매커니즘과 그에 따른 설정방식에 대하여 알아보자.

