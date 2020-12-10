---
title: "데이터 바인딩 추상화 : PropertyEditor"
metaTitle: "스프링코어 | Resource / Validation"
metaDescription: "스프링코어 | 섹션2 | Resource / Validation"
---


# 1) 데이터 바인딩이란?
- 어떤 프로퍼티에 값을 타겟 객체에 설정하는 기능
- 사용자가 입력한 값을 애플리케이션 도메인 객체에 동적으로 할당하는 기능
  - 왜 데이터 바인딩이 필요한가? 사용자가 입력하는 값은 주로 문자열인데, **그 문자열을 객체마다 가지고 있는 다양한 프로퍼티 타입(int, date, boolean..혹은 도메인 객체 타입 자체로 변환해야 하는 경우 등)으로 변환하여 넣어주어야 하기 때문이다.**

# 2) org.springframework.validation.DataBinder
- 오래된 인터페이스
- 웹 MVC에서 주로 사용하긴 하지만, 프로퍼티 에디터를 사용하는 이 데이터 바인더라는 인터페이스는 스프링 xml 설정 시 사용하던 문자열을 빈이 가지고 있는 적절한 타입으로 변환해서 넣어줄때도 사용했음
- 스프링 익스프레션 랭귀지라는 것에서도 사용됨

# 3) 사용 예시

- int 타입으로 들어오는 id를 이벤트 클래스 타입으로 변환하여 넣어야 한다.

```java
import java.beans.PropertyEditorSupport;public class Event {

  private Integer id;
  private String title;

  public Event(Integer id){
    this.id = id;
  }

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

  @Override
  public String toString(){
    return "Event{"+
        "id=" + id +
        ", title='" + title + '\'' +
        '}';
  }
}
```

```java
@RestController
public class EventController{

  @GetMapping("/event/{event}")
  public String getEvent(@PathVariable Event event){
    System.out.println(event);
    return event.getId().toString();
  }
}
```

- PropertyEditor을 직접 구현해도 되지만 PropertyEditorSupport를 쓰면 필요한 메서드만 구현할 수 있다.

```java
public class EventEditor extends PropertyEditorSupport {

    //보통 프로퍼티 에디터 서포트의 메소드 중 이 두개를 구현하면 된다.
    @Override
    public String getAsText() {
        Event event = (Event)getValue();
        return event.getId().toString();
    }

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        setValue(new Event(Integer.parseInt(text)));
    }
}
```

- getValue(), setValue() 메소드에서 공유하고 있는 value는 **프로퍼티 에디터에서 가지고 있는 값**이다. 그래서 이 값은 서로 다른 쓰레드에게 공유가 된다. 따라서 이 값은 상태정보를 저장하고 있다.(stateful 함)
  - 따라서 쓰레드 세이프 하지 않다.
  - 다시 말하자면, 프로퍼티 에디터 구현체들은 여러 쓰레드에 공유해서 쓰면 안된다.
    - **즉, 프로퍼티 에디터의 구현체는 싱글톤 빈으로 등록해서 쓰면 안된다.**
    - 단, 쓰레드 스코프(한 쓰레드 내에서만 유효한)의 빈으로 만들면 그나마 괜찮지만, 아예 빈으로 등록하지 않는 편이 안전하다.


# 4. 프로퍼티 에디터를 어떻게 등록하는가?

- @InitBinder 애노테이션으로 등록한다.

```java
@RestController
public class EventController{

  @InitBinder
  public void init(WebDataBinder webDataBinder){
    //이벤트 클래스 타입을 처리할 프로퍼티 에디터를 등록한다.
    webDataBinder.resisterCustomEditor(Event.class, new EventEditor());
  }

  @GetMapping("/event/{event}")
  public String getEvent(@PathVariable Event event){
    System.out.println(event);
    return event.getId().toString();
  }
}

```

- 그런데 프로퍼티 에디터를 이용해 변환하는 방법은 구현하기도 어렵고 빈으로 등록하기도 어렵기 때문에 추천하지 않는다.
- 스프링 3 부터 이용할 수 있는 Converter와 Formatter가 있다.


