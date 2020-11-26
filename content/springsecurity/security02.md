---
title: 'spring security configuration'
metaTitle: "Spring Security | java configuration"
metaDescription: "Spring Security | java configuration"
---

# 1. 의존성 추가

스프링 시큐리티 라이브러리를 메이븐에 추가하자.
먼저 spring-security-web, spring-security-config 라이브러리를 각 스프링 버전에 맞춰 추가해줘야 한다.
(스프링 MVC 프레임워크용이고 스프링 부트는 다른 라이브러리를 추가해줘야 한다)

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

# 2. SecurityWebInitializer.java

spring boot 같은 경우는 단순히 의존성을 추가해주는 것만으로도 모든 애플리케이션 요청에 보안이 적용되지만
스프링 프레임워크는 의존성 추가 후 스프링 컨테이너를 통하여 웹 서버에 스프링 시큐리티 필터를 등록해주어야 한다.
스프링 시큐리티가 스프링 자체가 가지고 있는 프레임워크가 아니기 때문이다.

java configuration 상에서 스프링 시큐리티 필터를 띄우려면 AbstractSecurityWebApplicationInitializer 클래스를 상속받으면 된다.
스프링에서 자동으로 이 클래스를 감지하여 애플리케이션의 모든 요청에 자동으로 보안을 적용시킨다.

- DelegatingFilterProxy 클래스를 springSecurityFilterChain 라는 필터 이름으로 등록시키는 것이다. (하단 코드 참고)

```java
public class SecurityWebInitializer
        extends AbstractSecurityWebApplicationInitializer
{

}
```
```java
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

이제 프로젝트를 실행하고 ${contextPath}/login으로 접속하면 스프링 시큐리티 기본 로그인 화면이 뜰 것이다.
스프링 시큐리티 상에서 모든 요청에 인증을 요구하기 때문이다. 이제 api에 접근하려면 무조건 로그인을 해야 한다.
단지 의존성을 추가하고, 필터를 띄웠을 뿐인데 모든 요청에 보안 필터가 적용되었다 👍

## 4) WebSecurityConfigurerAdapter 과 @EnableWebSecurity

이제 스프링 시큐리티 기능들을 커스터마이징 할 수 있는 설정 파일을 작성해보자. 스프링 시큐리티는 유연한 프레임워크이다.
설정에 따라서 인증 방식을 정할 수 있으며, 커스텀 로그인 페이지, 로그아웃 페이지, 필터 추가, csrf 대비, session 상태 설정, 에러 핸들링 등
여러가지 스프링 시큐리티 설정을 적용할 수 있다.

설정 페이지는 @EnableWebSecurity 애노테이션을 붙이고 WebSecurityConfigurerAdapter를 상속받아야 한다.(둘 다 해야 함)

```java
@Configuration
@EnableWebSecurity
public class SpringSecurityConfiguration extends WebSecurityConfigurerAdapter {

}
```

WebSecurityConfigurerAdapter 클래스에 있는 configure 메소드를 상속받는다.(매개변수 HttpSecurity)

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

이것이 스프링 시큐리티 기본 설정 파일이다. 자세한 설정은 인증 방식에 따라 달라지므로
다음 포스팅에서 각각의 인증 방식을 설명하며 샘플 코드를 작성하겠다.
또한 스프링 시큐리티에 대한 간략한 개요와 인증, 인가의 개념, 그리고 인증 매커니즘과 그에 따른 설정방식을 알아볼 것이다.

