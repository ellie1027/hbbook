---
title: "스프링 IoC 컨테이너 #1"
metaTitle: "스프링코어 | 섹션1 | 스프링 IoC 컨테이너와 빈"
metaDescription: "스프링코어 | 섹션1 | 스프링 IoC 컨테이너와 빈"
---

# 1) IoC, Bean Factory

Inversion of Control
: 의존 관계 주입(Dependency Injection)이라고도 하며, 어떤 객체가 사용하는 의존 객체를 **직접 만들어 사용하는게 아니라, 주입 받아** 사용하는 방법을 말함

```java
class BookService {

    BookRepository bookRepository = new BookRepository();
    BookService bookService = new BookService(bookRepository);

    //이런식으로 의존 객체를 직접 만드는 대신 어떤 장치(ex. 생성자)를 사용하여 주입받아 사용하는 것
    //스프링이 없어도 저런 장치만 마련되어 있으면 만들 수 있다.

    private BookRepository bookRepository;

    public BookService(BookRepository bookRepository){
        this.bookRepository = bookRepository;
    }
}
```

그런데 위와 같은 방법을 사용하지 않고, 제어역전에 IoC 컨테이너를 사용하는 이유는 스프링 초기부터 여러 개발자들의 논의와 노하우가 쌓인 결과로 이러한 방식이 더 효율적이라고
여겨져 만들어진 프레임워크이기 때문이다.



**스프링 IoC 컨테이너**
: 'Bean'들을 담고 있는 IoC 기능을 가지고 있는 컨테이너.



**스프링 IoC 컨테이너의 역할**
* 빈 인스턴스 생성
* 의존 관계 설정
* 빈 제공




**Bean**
: 스프링 IoC 컨테이너가 관리하는 객체.


**BeanFactory**
: IoC컨테이너 중 가장 최상위에 있는 인터페이스이자 가장 핵심적인 클래스이다. 다양한 빈 팩토리 라이프사이클 인터페이스들이 여러 기능을 제공한다.
  애플리케이션 컴포넌트의 중앙 저장소이며, 빈 설정 소스로부터 빈 정의를 읽어들이고, 빈을 구성하고 제공한다.



* **장점**
  * 의존성 관리 - 의존성 관리를 하려면 빈이여야 함. 빈이기 때문에 의존성을 알아서 관리해줌.
  * 스코프
    * 싱글톤타입 : '하나' 만 만들어서 그걸 계속 사용하는 것
        * 빈을 만들때 아무런 애노테이션을 붙이지 않았다면, 그 빈들은 모두 싱글톤 스코프로 등록됨.
        * **애플리케이션 전반에서 컨테이너로부터 서비스,레파지토리 등를 받아서 사용한다면 그 인스턴스들은 항상 '같은 객체' 일 것이다. 메모리, 런타임 시 성능최적화에도 유리하다.**
    * 프로포토타입 : 매번 만들어서 계속 다른 객체를 사용하는 것
    * 라이프사이클 인터페이스를 지원함 : 스프링 IoC 컨테이너에 등록된 빈에 국한함.


* **단점**
  * 의존성 관리때문에 단위테스트 만들기 힘듬(예를 들면, bookService에 bookRepository를 의존성 주입했을 때, bookRepository의 메소드를 완성해야만 bookService를 테스트할 수 있음)



그런데 실질적으로 개발자들이 많이 쓰는 것은 BeanFactory를 상속받아 쓰는 ApplicationContext다.



# 2) ApplicationContext

**ApplicationContext**
: IoC의 기능을 가지고 있으면서도, EventPublisher, EnviromentCapable, HierarchicalBeanFactory, ListableBeanFactory, MessageSource(메세지 다국화), ResourceLoader(classpath에 있는 특정한 파일, 파일시스템에 있는 파일, 웹에 있는 파일 등을 리소스라고 하는데 이것들을 읽어오는 기능), ResourcePatternResolver 기능도 가지고 있다.
 **정리하자면, 빈팩토리에 비해 다양한 기능을 추가로 더 가지고 있는 빈 팩토리를 상속받은 인터페이스.**



**대표적인 ApplicationContext와 해당 ApplicationContext가 가지고 있는 Bean 설정파일**
* ClassPathXmlApplicationContext(XML)
* AnnotationConfigApplicationContext(Java)



스프링 Ioc 컨테이너는 Bean 설정 파일이 필요하다. Bean을 ApplicationText에 등록하기 위해 필요한 설정 파일이다.

다음은 아주 고전적인 xml 기반 스프링 설정 파일이다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:beans="http://www.springframework.org/schema/beans"
       xmlns:beans="http://www.w3.org/2001/xmlschema-instance"
	xsi:schemaLocation="
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

    <bean id="bookService"
          class="mypackage.name.BookService">
        <property name="bookRepository" ref="bookRepository"></property>    <!-- ref : 다른 빈을 참조할 때 쓰는 것. 항상 빈의 id가 와야 한다. -->
    </bean>

    <bean id="bookRepository"
          class="mypackage.name.BookRepository">
    </bean>
</beans:beans>
```



그런데 이렇게 일일히 빈을 등록하는 것은 아주 비효율적이고 힘든 방법이다.
따라서 컴포넌트 스캔이 등장하였다. package를 지정하여 그 패키지부터 스캐닝을 하여 빈을 등록하는 방법이다.
기본적으로 @Component라는 애노테이션을 쓸 수 있고 이를 확장한 @Service, @Repository 등도 있다.
그 애노테이션과 함께 @Autowired, @Inject 등을 써야 빈을 등록해줄 수 있다.



>애노테이션 기반의 빈 등록 방식 - 스프링 2.5 버전부터 가능



```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:beans="http://www.springframework.org/schema/beans"
       xmlns:beans="http://www.w3.org/2001/xmlschema-instance"
	xsi:schemaLocation="
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

    <context:component-scan base-package="${myPackageName}"></context:component-scan>

</beans:beans>
```



java configuration으로 하는 방법도 있다. xml 기반 설정보다 java로 설정할 시 좀 더 유연하고 확장성이 있는 코딩이 가능하다.


>java configuration - 스프링 3.0 버전부터 가능



```java
@Configuration
public class ApplicationConfig{

    @Bean
    public BookRepository bookRepository(){
        return new BookRepository();
    }

    @Bean
    public BookService bookService(){
        //의존성 주입
        BookService bookService = new BookService();
        bookService.setBookRepository(bookRepository());
        return bookService;
    }

}

public class DemoApplication(){

    public static void main(String[] args){
        ApplicationContext context =
            new AnnotationConfigApplicationContext(ApplicationConfig.class);
        //ApplicationConfig.class 파일을 자바 설정 파일로 사용하겠다는 의미
    }
}
```


```java
@Configuration
@ComponentScan(basePackageClasses = DemoApplication.class) //이 클래스가 위치한 곳부터 컴포넌트 스캐닝을 하라는 뜻. 좀 더 type-safe한 방법.
public class ApplicationConfig{

    @Bean
    public BookRepository bookRepository(){
        return new BookRepository();
    }

    @Bean
    public BookService bookService(){
        //의존성 주입
        BookService bookService = new BookService();
        bookService.setBookRepository(bookRepository());
        return bookService;
    }

}

@SpringBootApplication
//스프링 부트를 사용할 시, 이 애노테이션을 붙이면 ApplicationContext를 새로 생성할 필요가 없다. ApplicationConfig 파일을 만들 필요도 없다. 이 파일 자체가 설정 파일이기 때문이다.
public class DemoApplication(){
    public static void main(String[] args){

    }
}
```



