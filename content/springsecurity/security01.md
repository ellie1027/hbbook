---
title: 'java configuration'
metaTitle: "Spring Security | Java configuration"
metaDescription: "Spring Security | Java configuration"
---

# Introduction
토이 프로젝트를 하면서 로그인 기능을 추가해야겠다고 생각했는데, 마침 스프링 기반 프로젝트를 하는 김에 스프링 시큐리티를 공부하며 적용해보았다.
확실히 로그인 모듈을 스스로 만들어보면, 프레임워크가 어떻게 동작하는지 잘 알 수 있는 것 같다. 😄

이왕 하는 김에 basic auth나 form-based 인증보다는 JWT 토큰 기반의 인증 시스템을 구현해보기로 했다.

# GOAL
rest api, ajax 기반의 스프링 MVC 프레임워크에서 스프링 시큐리티 프레임워크를 사용하여 Oauth 2.0방식의 Jwt Token 로그인 모듈을 구축해보자.

# 프로젝트 환경
- framework version : spring 5.2.7
- jdk : java 1.8
- ide : intellij
- was : tomcat 8.5
- build : maven

# 1. Java Configuration

기존 프로젝트 설정은 xml 기반이었는데, 스프링 시큐리티를 적용하면서 모든 설정을 java configuration으로 변경하였다.
확장성과 개발의 편리함 측면에서 좋은 선택이었던 것 같다. 리팩토링 첫 시도였으므로, java configuration으로 변경한 기록도 남기고자 한다.

### 1.1 java configuration란?
스프링 프레임워크의 기존 xml기반 설정 파일을 프레임워크 레벨에서 java로 설정할 수 있도록 바꾸는 것이다.
스프링 3.1 버전부터 제공하며 개발하기 편리하다.

### 1.2 java configuration 과정

기존 xml 기반 설정을 따라가며 어떻게 java configuration으로 바꿨는지 알아보자.

#### 1.2.1 if xml..?
- 웹 어플리케이션이 실행되면 WAS에 의해 web.xml이 로딩된다.
- web.xml에 등록되어 있는 ContextLoaderListener가 메모리에 생성된다.
- ContextLoaderListener클래스는 ApplicationContext를 생성한다.
- ContextLoaderListener는 root config 관련 파일을 로딩한다.(주로 db, log 등의 common beans)
- 최초의 웹 어플리케이션 요청이 오면 DispatcherServlet 가 생성되고, servlet config 관련 파일을 로딩한다.

>**ContextLoaderListener?**
>Servlet의 생명주기를 관리해준다.(Servlet을 사용하는 시점에 Servlet Context에 ApplicationContext 등록, Servlet이 종료되는 시점에 ApplicationContext 삭제)

>**DispatcherServlet?**
>FrontController의 역할을 수행. 어플리케이션으로 들어오는 요청을 받아 알맞은 Controller에게 전달 후 응답을 받아, 요청에 따른 응답을 어떻게 할지 결정함.

#### 1.2.2 java..?

java configuration은 프레임워크 레벨에서 서블릿 초기화 작업을 할 수 있도록 두 개의 컴포넌트를 제공하고 있다.

- WebApplicationInitializer.class : DispatcherServlet과 ContextLoaderListener 등록을 모두 구현해주어야 함.
- **AbstractAnnotationConfigDispatcherServletInitializer.class** : 내부적으로 서블릿 컨텍스트 초기화 작업이 이미 구현되어 있음.

AbstractAnnotationConfigDispatcherServletInitializer 클래스는 스프링 3.2 버전부터 사용이 가능한데,
상속만 받으면 컨텍스트 로더와 디스패쳐 서블릿 등록을 구현하지 않아도 되므로 간편하게 쓸 수 있다.
이 클래스를 상속받으면 다음과 같은 메서드를 사용할 수 있다.

1. getRootConfigClasses() : root application context 설정파일을 등록한다.
2. getServletConfigClasses() : dispatcher servlet application context 설정파일을 등록한다.
3. getServletMappings() : 브라우저에서 요청한 주소 패턴을 보고 스프링에서 처리할지 말지를 결정하는 메서드.
배열 형식이므로 요청 주소를 여러개 등록할 수 있다.

다음은 내가 작성한 코드이다.

# 2. WebConfig.java
```java
//sample code
@Configuration
public class WebConfig
        extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{ RootConfig.class, DatabaseConfig.class };
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{ ServletConfig.class };
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
}
```

>설정파일이 없다면 그냥 null을 리턴시키면 된다. 나는 나중에 aop, log 설정을 해주기 위하여 rootconfig를 만들어두었다.

# 3. Root Config.java

```java
//sample code
@Configuration //스프링 설정파일
@ComponentScan(basePackages= {"your packages"}) //스캔할 패키지
public class RootConfig {

}
```

# 4. ServletConfig.java

ServletConfig 파일은 WebMvcConfigurer 클래스를 상속받아 resourceHandler, ViewResolver 등 dispatcher servlet
의 여러 빈들을 등록한다.
어려울 것 없이, servelt-context.xml 파일에 있는 그대로 Bean들을 등록해주면 된다.

* WebMvcConfigurer 클래스는 @EnableWebMvc 어노테이션과 함께 사용하며,
* java configuration 상에서 커스터마이징을 위한 callback method를 재정의하도록 제공해주는 클래스이다.

>현재 프로젝트에서 기본 ViewResolver 대신 Tiles를 사용하고 있으므로, Tiles ViewResolver 를 먼저 등록해주었다.

```java
//sample code
@EnableWebMvc
@ComponentScan(basePackages= {"your packages"})
public class ServletConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
    }

    @Bean
    public UrlBasedViewResolver tilesViewResolver() {
        UrlBasedViewResolver urlBasedViewResolver = new UrlBasedViewResolver();
        urlBasedViewResolver.setViewClass(TilesView.class);
        urlBasedViewResolver.setOrder(1);
        return urlBasedViewResolver;
    }

    @Bean
    public TilesConfigurer tilesConfigurer() {
        TilesConfigurer tilesConfigurer = new TilesConfigurer();
        tilesConfigurer.setDefinitions("/WEB-INF/views/layout/tiles-layout.xml");
        return tilesConfigurer;
    }

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        InternalResourceViewResolver bean = new InternalResourceViewResolver();
        bean.setViewClass(JstlView.class);
        bean.setPrefix("/WEB-INF/views/");
        bean.setSuffix(".jsp");
        registry.viewResolver(bean);
    }

    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
        resolver.setDefaultEncoding("utf-8");
        return resolver;
    }
}
```




# 5. DatabaseConfig

```java
@Configuration
public class DatabaseConfig {

    @Autowired
    private ApplicationContext applicationContext;

    @Bean
    public DriverManagerDataSource dataSource() {
        DriverManagerDataSource source = new DriverManagerDataSource();
        source.setDriverClassName("your class name");
        source.setUrl("your url");
        source.setUsername("your id");
        source.setPassword("your password");

        return source;
    }

    @Bean
    public SqlSessionFactory sqlSession() throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource());
        sqlSessionFactoryBean.setConfigLocation(applicationContext.getResource("classpath:config/context-mybatis.xml")); //마이바티스 등록
        sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath*:*mapper*/**/*.xml"));

        return sqlSessionFactoryBean.getObject();
    }


    @Bean
    public SqlSessionTemplate sqlSessionTemplate() throws Exception {
        SqlSessionTemplate sqlSession = new SqlSessionTemplate(sqlSession());
        return sqlSession;
    }


}
```






