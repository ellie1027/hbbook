---
title: "스프링코어 | Resource / Validation"
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

스프링 mvc에서 주로 사용하긴 하지만, 웹 계층에서만 사용하라고 만든 웹 계층 전용 validate는 아니다.















