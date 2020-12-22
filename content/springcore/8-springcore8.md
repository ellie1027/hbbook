---
title: "데이터 바인딩 추상화 : Converter와 Formatter"
metaTitle: "데이터 바인딩 추상화 : Converter와 Formatter"
metaDescription: "데이터 바인딩 추상화 : Converter와 Formatter"
---

# 1. Converter
  데이터 바인딩은 서로 다른 타입 간을 변환하는 작업이다. 프로퍼티 에디터는 오브젝트와 스트링만 바인딩이 가능한 것에 비해, 컨버터는 좀 더 제너럴한 바인딩이 가능한 인터페이스이다.

  - S 타입을 T 타입으로 변환할 수 있는 매우 일반적인 변환기.
  - 상태 정보 없음(Stateless, 쓰레드세이프)
  - ConverterRegistry에 등록하여 사용.
    - 스프링 mvc를 쓴다면(부트 없이), java configuration을 쓴다고 가정하면

## 1.1 등록 방법
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry){
        registry.addConverter(new EventConverter.StringToEventConverter());

    }
}
```

## 1.2 예시
```java
public class EventConverter {

    //상태 정보가 없으므로 빈으로 등록하여 사용해도 아무 문제가 없다.

    //스트링 타입을 이벤트 타입으로 변환
    public static class StringToEventConverter implements Converter<String, Event> {

        @Override
        public Event convert(String source) {
          return new Event(Integer.parseInt(source));
        }

    }

    //이벤트 타입을 스프링 타입으로 변환
    public static class EventToStringConverter implements Converter<String, Event> {

      @Override
      public String convert(Event source) {
        return source.getId().toString();
      }

    }
}

@RestController
public class EventController{

  @GetMapping("/event/{event}")
  public String getEvent(@PathVariable Event event){
    System.out.println(event);
    return event.getId().toString();
  }
}
```

물론 모든 타입에 이러한 컨버터를 만들 필요가 있는 것은 아니다. Integer등의 클래스는 이미 기본으로 제공되는 컨버터나 포매터가 있으므로, 필요 시 그것을 사용하면 된다.
스프링에 기본적으로 등록되어있지 않은 것을 만들어 사용하면 되는 것이다.


# 2. Formatter

- 웹 쪽에 특화되어 있는 인터페이스
- PropertyEditor 대체제
- Object와 String 간의 변환을 담당한다.
- 문자열을 Locale에 따라서 다국화하는 기능도 제공한다(optional)
- FormatterRegistry에 등록해서 사용
- 빈으로 등록할 수 있다.(빈으로 등록가능하다면, 다른 빈을 주입받는 것도 가능하다.)

## 2.1 등록 방법
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry){
        registry.addConverter(new EventFommatter());
    }
}
```

## 2.2 예제
```java
import java.text.ParseException;

public class EventFormatter implements Formatter<Event> {

  //  @Autowired
  //  MessageSource messageSource;
  //Formatter로 처리할 타입 하나를 준다.
  //프로퍼티 에디터와 유사하게 메소드 두개를 상속받아 작성하면 된다.

  //Locale 정보를 기반으로 변환할 수 있다.
  @Override
  public Event parse(String text, Locale locale) throws ParseException {
    return new Event(Integer.parseInt(text));
  }

  @Override
  public String print(Event Object, Locale locale) {
     //messageSource.getMessage("title", locale);

    return Object.getId().toString();
  }
}
```

# 3. ConversionService
클래스 타입을 변환하는 작업은, 데이터 바인더 대신에 컨버터와 포매터를 활용할 수 있도록 컨버젼 서비스가 일을 하게 된다.
프로퍼티 에디터를 데이터 바인더를 통하여 사용하였다면, 컨버젼 서비스를 통하여 컨버터와 포매터를 쓸 수 있다.
컨버터와 포매터에 등록되는 클래스는 실제로는 컨버젼 서비스에 등록되는 것이다.

- 실제 변환 작업은 이 인터페이스를 통해서 쓰레드 세이프하게 사용할 수 있음.
- 스프링 mvc, 빈(value) 설정, SpEl에서 사용한다.
- DefaultFormattingConversionService(스프링이 제공해주는 여러가지 컨버터 구현체 중 빈으로 자주 쓰이는 것)
  - FormatterRegistry 기능
  - ConversionService 기능
  - 둘 다 사용할 수 있으므로 유용하다.
  - 여러 기본 컨버터와 포매터들의 등록이 되어 있음.(String to Int etc..)


![컨버젼서비스](/content/springcore/images/conversionservice_01.png)

```java
import java.text.ParseException;

public class AppRunner implements ApplicationRunner {

    @Autowired
    ConversionService conversionService;

    @Override
    public void run(Application args) throws Exception {
        System.out.println(conversionService.getClass().toString());
    }
}
```

### 스프링부트일 경우
  - 웹 애플리케이션인 경우에 DefaultFormattingConversionService를 상속하여 만든 WebConversionService를 빈으로 등록해 준다.
  - Formatter와 Converter 빈을 찾아 자동으로 등록해준다.(@Component로 빈으로 등록)

```java
@RunWith(SpringRunner.class)
@WebMvcTest({
  EventConverter.StringToEventConverter.class,
  EventConverter.class
})
public class EventConverter {

  @Component
  public static class StringToEventConverter implements Converter<String, Event> {
    @Override
    public Event convert(String source) {
      return new Event(Integer.parseInt(source));
    }

  }

  @Component
  public static class EventToStringConverter implements Converter<String, Event> {
    @Override
    public String convert(Event source) {
      return source.getId().toString();
    }

  }

}
```

## 등록되어있는 컨버터를 전부 보는 방법

```java
import java.text.ParseException;

public class AppRunner implements ApplicationRunner {

    @Autowired
    ConversionService conversionService;

    @Override
    public void run(Application args) throws Exception {
      System.out.println(conversionService);
      System.out.println(conversionService.getClass().toString());
    }
}
```


## 추천하는 방법
보통 데이터 바인딩을 만들 때 웹과 관련하여 만들기 때문에 포매터를 사용하는 것을 추천한다.





