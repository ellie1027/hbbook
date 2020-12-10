---
title: "Resource / Validation"
metaTitle: "스프링코어 | Resource / Validation"
metaDescription: "스프링코어 | 섹션2 | Resource / Validation"
---


# 1) Resource 추상화

- java.net.URL을 추상화 한 것.
  - org.springframework.core.io.Resource로 java.net.URL을 감싸서 row level에 있는 리소스에 접근하는 기능을 만듬.
  - Resource 자체를 추상화한 것.
  - 스프링 내부에서 많이 사용하는 인터페이스.

- 추상화한 이유
  - 기존 java.net.URL 기능에 classpath 기준으로 리소스를 읽어오는 기능이 없음
  - ServletContext 기준으로 상대 경로로 읽어오는 기능 부재
  - 새로운 핸들러를 등록하여 특별한 URL 접미사를 만들어 사용할 수는 있지만 구현이 복잡하고 편의성 메소드가 부족하다.


```java
public class AppRunner implements ApplicationRunner {

  @Autowired
  ResourceLoader resourceLoader;

  public void run(ApplicationArguments args) throws Exception {
    //클래스패스 기준으로 "test.xml" 리소스를 찾아서 빈 설정 파일로 사용함
    var ctx = new ClassPathXmlApplicationContext("test.xml");
    //파일 시스템 경로 기준으로 "test.xml" 리소스를 찾아서 빈 설정 파일로 사용함.
    var ctx2 = new FileSystemXmlApplicationContext("test.xml");

    Resource resource = resourceLoader.getResource("classpath:text.txt");

  }
}
```
- "test.xml"이라는 문자열이 내부적으로 Resource로 변환이 된다.

- **구현체**
  - UrlResource : java.net.URL 참고, 기본으로 지원하는 프로토콜 http, https, ftp, file, jar.
  - ClassPathResource : 지원하는 접두어 'classpath:'
  - FileSystemResource
  - ServletContextResource: 웹 애플리케이션 루트에서 상대 경로로 리소스 찾음.(사실적으로 가장 많이 쓰게 됨.)

- Resource의 타입은 location 문자열과 ApplicationContext의 타입에 따라 결정된다.
  - ClassPathXmlApplicationContext -> ClassPathResource
  - FileSystemXmlApplicationContext -> FileSystemResource
  - WebApplicationContext -> ServletContextResource

- **ApplicationContext의 타입에 상관없이 리소스 타입을 강제하려면 java.net.URL 접두어(+classpath:) 중 하나를 사용할 수 있다.**
  - classpath:me/test/config.xml -> ClassPathResource
  - file:///some/resource/path/config.xml -> FileSystemResource
  - 접두어를 쓰지 않고 getResource("abc.xml") 한다면 ServletContextResource 에서부터 찾게 됨
  - 명시적으로 어떤 리소스 경로인지 볼수 있으므로 이렇게 사용하는 것이 좋음


# 2) Validation 추상화

org.springframework.validation.Validator

특징
- 애플리케이션에서 사용하는 객체 검증용 인터페이스
- 스프링 mvc에서 주로 사용하긴 하지만, 웹 계층에서만 사용하라고 만든 웹 계층 전용 validate는 아니다.
- Bean Validation (자바 표준) 지원
- 어떠한 계층과도 관계가 없다 : 모든 계층(웹, 서비스, 데이터)에서 사용해도 좋다.
- 구현체 중 하나로, JSR-303(Bean Validation 1.0)과 JSR-349(Bean Validation 1.1)을 지원한다(LocalValidatorFactoryBean)
- DataBinder에 들어가 바인딩 할 때 같이 사용되기도 한다.

인터페이스
* 다음과 같은 두가지 메서드를 구현해야 한다

supports(Class clazz)
- 인자로 넘어온 '내가 검증해야 하는 인스턴스의 클래스'가 이 밸리테이터가 지원하는 '검증할 수 있는 클래스'인지 확인해야 함

validate(Object target, Errors errors)
- 실질적으로 검증 작업이 일어나는 곳
- validation utils 같은 라이브러리를 사용하면 편리

```java
public class Event {

    Integer id;
    String title;

    public Integer getId(){
      return id;
    }

    public void setId(Integer id){
      this.id = id;
    }

    public String getTitle(){
      return title;
    }

    public void setTitle(String title){
      this.title = title;
    }

}

public class EventValidator implements Validator{

  @Override
  public boolean supports(Class<?>claszz){
    return Event.class.equals(clazz);
  }

  @Override
  public void validate(Object target, Errors errors){
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "title", "not empty", "Empty title is not allowed.");
    //"title"= field, "not empty"=message Resolver의 key 역할, "Empty title is not allowed."는 디폴트 메시지
    Event event = (Event) target;
    if(event.getTitle() == null){
      //reject: 해당 객체에 대한 전반적인 에러메시지
      //rejectValue: 해당 객체의 특정 필드의 에러메시지
      errors.reject("...");
    }
  }

}

@Component
public class AppRunner implements ApplicationRunner {

   @Override
    public void run(ApplicationArguments args) throws Exception{
      Event event = new Event();
      EventValidator eventValidator = new EventValidator();
      Errors errors = new BeanPropertyBindingResult(event, "event");

      eventValidator.validate(event, errors);

      System.out.println(errors.hasErrors());

      errors.getAllErrors().forEach(e -> {
        System.out.println("=====error code=====");
        Arrays.stream(e.getCodes()).forEach(System.out::println);
        System.out.println(e.getDefaultMessage());
      });
    }
}

/*
결과:
notempty.event.title
notempty.title
notempty.java.lang.String
notempty
Empty title is not allowed
 */
```


스프링 부트 2.0.5 이상 버전을 사용할 때
- LocalValidatorFactoryBean 빈으로 자동 등록
- JSR-380(Bean Validation 2.0.1) 구현체로 hibernate-validator 사용
- https://beanvalidation.org/


LocalValidatorFactoryBean
- Bean Validation 애노테이션을 지원하는 밸리데이터

간단한 벨리데이션 검증은 이런식으로 해도 된다.
다만 복잡한 비즈니스 로직이 있다면 위에서 한 것처럼 따로 밸리에디션 로직을 만들면 좋다.

```java
public class Event {

    Integer id;

    @NotEmpty
    String title;

    @NotNull @Min(0)
    Integer limit;

    @Email
    String email;

    public Integer getId(){
      return id;
    }

    public void setId(Integer id){
      this.id = id;
    }

    public Integer getLimit(){
      return limit;
    }

    public void setLimit(Integer limit){
      this.id = limit;
    }

    public String getTitle(){
      return title;
    }

    public void setTitle(String title){
      this.title = title;
    }

    public String getEmail(){
      return email;
    }

    public void setEmail(String email){
      this.email = email;
    }


}

@Component
public class AppRunner implements ApplicationRunner {

    @Autowired
    Validator validator;

    @Override
    public void run(ApplicationArguments args) throws Exception{
      Event event = new Event();

      event.setEmail("estst");
      event.setLimit(1);

      Errors errors = new BeanPropertyBindingResult(event, "event");

      validator.validate(event, errors);

      System.out.println(errors.hasErrors());

      errors.getAllErrors().forEach(e -> {
        System.out.println("=====error code=====");
        Arrays.stream(e.getCodes()).forEach(System.out::println);
        System.out.println(e.getDefaultMessage());
      });
    }
}


```










