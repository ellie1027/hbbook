---
title: "스프링코어 | 스프링 IoC 컨테이너 #5"
metaTitle: "스프링코어 | 섹션1 | 스프링 IoC 컨테이너와 빈"
metaDescription: "스프링코어 | 섹션1 | 스프링 IoC 컨테이너와 빈"
---

# ApplicationContext가 상속받고 있는 여러 인터페이스

```java
public interface ApplicationContext extends EnvironmentCapable, ListableBeanFactory, HierarchicalBeanFactory,
		MessageSource, ApplicationEventPublisher, ResourcePatternResolver {
//...
}
```

# MessageSource

* 국제화(i18n) 기능을 제공하는 인터페이스.
* getMessage(String code, Object[] args, String, default, Locale, loc)

```java
public class AppRunner implements ApplicationRunner {

    @Autowired
    MessageSource messageSource;

    //* message.properties, message_ko_KR.properties 등 프로퍼티 파일을 만들어서 메세지를 쓴다.
    // (스프링 부트라면 이미 빈으로 등록이 되어 있어서 자동적으로 인식됨)

    @Override
    public void run(ApplicationArguments args){
        System.out.println(messageSource.getmessage("greeting", new String[]{"test"}, (Locale).KOREA));
        System.out.println(messageSource.getmessage("greeting", new String[]{"test"}, (Locale).getDefault()));
    }


}
```

* 릴로딩 기능이 있는 메시지 소스 사용하기


```java

@SpringBootApplication
public class DemoSpring51Application{

    public static void main(String[] args){
        SpringApplication.run(DemoSpring51Application.class, args);
    }

    @Bean
    public MessageSource messageSource(){
        //프로퍼티에 있는 메세지를 중간에 바꾸고(안녕 -> 안녕하세요) 빌드하면 그대로 반영된다.(Reloadable)
        var messageSource = new ReloadableResourceBundleMessageSource();

        messageSource.setBasename("classpath:/messages");
        messageSource.setDefaultEncoding("UTF-8"); //한글
        return messageSource;

    }
}
```

# ApplicationEventPublisher 인터페이스

* 옵저버 패턴의 구현체
* 이벤트 기반의 프로그래밍을 할 때 유용한 인터페이스


### 스프링 4.2 이전의 이벤트 기반 프로그래밍

```java

@SpringBootApplication
public class DemoSpring51Application{

    public static void main(String[] args){
        SpringApplication.run(DemoSpring51Application.class, args);
    }

}

public class MyEvent extends ApplicationEvent {

    private int data;

    public myEvent(Object source){
        super(source);
    }
    //이벤트 발생 시 데이터를 같이 전송할 수 있음
    public myEvent(Object source, int data){
        super(source);
        this.data = data;
    }

    public int getData(){
        return data;
    }

}

@Component
public class AppRunner implements ApplicationRunner {

    @Autowired
    ApplicationEventPublisher publishEvent;

    @Override
    public void run(ApplicationArguments args) throws Exception{
        //이벤트 발생 시키는 방법
        publishEvent.publishEvent(new MyEvent(this, 100));
    }

}

//ApplicationLister<이벤트> 구현한 클래스 만들어 빈으롣 ㅡㅇ록하기
@Component
public class myEventHandler implements ApplicationListener<MyEvent> {

    @Override
    public void onApplicationEvent(MyEvent event) {
        System.out.println("이벤트 받았다. 데이터는 " + event.getData());
    }

}

```

### 스프링 4.2 이후의 이벤트 기반 프로그래밍
*스프링이 추구하는 가치 - 비침투성, transparent, POJO에 맞음
*스프링 소스 소스가 개발자가 작성한 코드에 들어가 있지 않은 것(노출되지 않는 것)
*깔끔한 POJO 소스가 유지보수할때도 더 쉬워진다

```java

@SpringBootApplication
public class DemoSpring51Application{

    public static void main(String[] args){
        SpringApplication.run(DemoSpring51Application.class, args);
    }

}

//4.2 이후로 ApplicationEvent를 상속받지 않아도 이벤트로 사용할 수 있다.
public class MyEvent  {

    private int data;
    private Object source;

    //이벤트 발생 시 데이터를 같이 전송할 수 있음
    public myEvent(Object source, int data){
        this.source = source;
        this.data = data;
    }

    public Object getSource(){
        return source;
    }

    public int getData(){
        return data;
    }

}

@Component
public class AppRunner implements ApplicationRunner {

    @Autowired
    ApplicationEventPublisher publishEvent;

    @Override
    public void run(ApplicationArguments args) throws Exception{
        //이벤트 발생 시키는 방법
        publishEvent.publishEvent(new MyEvent(this, 100));
    }

}


@Component
public class myEventHandler {

    @EventListener
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public void handle(MyEvent event) {
        System.out.println("이벤트 받았다. 데이터는 " + event.getData());
    }

}

@Component
public class myAnotherEventHandler {

    @EventListener
    @Order(Ordered.HIGHEST_PRECEDENCE + 2)
    public void handle(MyEvent event) {
        System.out.println("Another 이벤트 받았다. 데이터는 " + event.getData());
    }

}

```


### 이벤트 처리하는 방법
* 기본적으로는 synchronized 함
* 순서를 정하고 싶다면 @Order와 함께 사용
* 비동기적으로 실행하고 싶다면 @Async와 함께 사용 (with @EnableAsync 애노테이션)


### 스프링이 제공하는 기본 이벤트
* ContextRefreshedEvent : ApplicationContext를 초기화했거나 리프레시 했을 때 발생
* ContextStartedEvent : ApplicationContext를 start()하여 라이프사이클 빈들이 시작 신호를 받은 시점에 발생
* ContextStoppedEvent : ApplicationContext를 stop()하여 라이프사이클 빈들이 정지 신호를 받은 시점에 발생
* ContextClosedEvent : ApplicationContext를 close()하여 싱글톤 빈 소멸되는 시점에 발생
* RequestHandledEvent : HTTP 요청을 처리했을 때 발생

```java

@Component
public class myEventHandler {

    @EventListener
    @Async
    public void handle(MyEvent event) {
        System.out.println("이벤트 받았다. 데이터는 " + event.getData());
    }

    @EventListener
    @Async
    public void handle(ContextRefreshedEvent event) {
        System.out.println(Thread.currentThread().toString());
        System.out.println("이벤트 받았다. 데이터는 " + event.getData());
    }

    @EventListener
    @Async
    public void handle(ContextClosedEvent event) {
        System.out.println(Thread.currentThread().toString());
        System.out.println("이벤트 받았다. 데이터는 " + event.getData());
    }
}

```

# ResourceLoader 인터페이스

* 리소스를 읽어오는 기능을 제공하는 인터페이스

```java
public class AppRunner implements ApplicationRunner {

    @Autowired
    ResourceLoader resourceLoader;

    @Override
    public void run(ApplicationArguments args){
        Resource resource = resourceLoader.getResource("classpath:test.txt"); //location
        System.out.println(resource.exists());
        System.out.println(resource.getDescription());
        System.out.println(Files.readString(Path.of(resource.getURI()))); //java 11
    }

}
```


### 리소스 읽어오기
* 파일 시스템에서 읽어오기
* 클래스패스에서 읽어오기
* URL로 읽어오기
* 상대/절대 경로로 읽어오기



















