---
title: "스프링 IoC 컨테이너 #2"
metaTitle: "스프링코어 | 섹션1 | 스프링 IoC 컨테이너와 빈"
metaDescription: "스프링코어 | 섹션1 | 스프링 IoC 컨테이너와 빈"
---

# 1) @Autowired

* BookService와 BookRepository가 있다고 가정해보자. BookService에 BookRepository의 의존성 주입을 하려면 세 가지 방법이 있다.

**사용할 수 있는 위치**


    * 생성자(스프링 4.3부터는 생략 가능) - 빈을 만들때도 관여하기 때문에 optional한 설정을 못함
    * 세터
    * 필드


```java
@Repository
public class BookRepository{

}

@Service
public class BookService{

    //1. 생성자를 이용하여 의존성 주입 - 빈을 만들때도 관여하기 때문에 optional한 설정을 못함
    BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository){
        this.bookRepository = bookRepository;
    }

    //2. 세터를 이용한 의존성 주입
    @Autowired(requried = false) //해당하는 빈의 타입을 못찾거나, 의존성 주입을 할 수 없는 경우에는 애플리케이션 구동이 제대로 되지 않음. 그럴때 optional로 설정을 해줌.
    public void setBookRepository(BookRepository bookRepository){
        this.bookRepository = bookRepository;
    }

    //3. 필드를 이용한 의존성 주입
    @Autowired(requried = false)
    BookRepository bookRepository;

}
```

지금까지 해당 타입의 빈이 한 개 있거나 혹은 없을 때 의존성 생성을 optional하게 해주는 법을 배웠다. 그런데 같은 타입의 빈이 여러 개 이면 어떻게 의존성을 주입해주어야 할까?

**경우의 수**
* 해당 타입의 빈이 없는 경우
* 해당 타입의 빈이 한 개인 경우
* 해당 타입의 빈이 여러 개인 경우
    * 빈 이름으로 시도
    * 같은 이름의 빈 찾으면 해당 빈 사용
    * 같은 이름 못 찾으면 실패



```java
@Repository
public class BookRepository{

}
@Repository @Primary //1. @Primary로 무조건 이 빈을 주입하게 하기
public class MyBookRepository implements BookRepository{

}

@Service
public class BookService{

    @Autowired
    BookRepository bookRepository;

}
```

```java
@Repository
public class BookRepository{

}
@Repository
public class MyBookRepository implements BookRepository{

}

@Service
public class BookService{

    @Autowired @Qualifier("myBookRepository") //2. @Qualifier로 지정해주기
    BookRepository bookRepository;

}
```

```java
@Repository
public class BookRepository{

}
@Repository
public class MyBookRepository implements BookRepository{

}

@Service
public class BookService{

    @Autowired //3. 해당 타입의 빈 모두 주입 받기
    List<BookRepository> bookRepository;

}

```

**같은 타입의 빈이 여러 개 일때**
    * **@Primary** - 이 애노테이션을 쓰면 무조건  Bean을 주입해야 한다. 다른 방법에 비해 좀 더 type safe한 방법이다.
    * **Qualifier(빈 이름)**
    * 해당 타입의 빈 모두 주입 받기



**그렇다면 이런 동작을 하는 원리는 무엇일까?**
* Bean Post Processor 라는 'lifeCycle Interface' 의 구현체에 의해 동작



**Bean Post Processor**
: 빈을 만든 다음(로운 bean instance를 initialize  후) 이전 혹은 이후에 부가적인 작업을 할수있는 또다른 라이프사이클 콜백



**initialization이란?**
: 해당 Bean이 만들어진 후 해야 할 일이다. @PostConstruct 같은 애노테이션을 붙여서 정의할 수 있다.



>결국 @Autowired 라는 애노테이션을 붙였을 때, Bean이 자동으로 주입되는 이유는
>Bean initiallize 전 **AutoWiredAnnotationBeanPostProcessor 클래스**가 Bean을 찾아서 주입해주기 때문이다.



**AutowiredAnnotationBeanPostProcessor extends BeanPostProcessor**
    * 스프링이 제공하는 @Autowired 와 @Value 애노테이션 그리고 JSR-330의 @Inject 애노테이션을 지원하는 애노테이션 처리기
    * Bean으로 등록이 되어있다. 따라서 BeanPostProcessor에서 AutowiredAnnotationBeanPostProcessor를 찾아서 작동시키는 것이다.


