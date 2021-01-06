---
title: "SpEL (스프링 Expression Language)"
metaTitle: "SpEL (스프링 Expression Language)"
metaDescription: "SpEL (스프링 Expression Language)"
---

# 스프링 EL이란?
- 객체 그래프를 조회하고 조작하는 기능을 제공한다.
- United EL과 비슷하지만, 메소드 호출을 지원하며 문자열 템플릿 기능도 제공한다.
- OGNL, MVEL, JBOss EL 등 자바에서 사용할 수 있는 여러 EL이 있지만, SpEL은 모든 스프링 프로젝트 전반에 걸쳐 사용할 EL로 만들었다.
- 스프링 3.0 부터 지원

# 문법

* 현재 '#'을 쓸 경우 h1함수로 감싸도록 되어있어서 그런 의도가 아닐 시 #를 쓸때는 '' 를 붙여 '#'이렇게 표현한다.~~~~

- '#'{""}
- ${""}
- 표현식은 프로퍼티를 가질 수 있지만, 반대는 안 된다.
  - '#'{${my.data} + 1}

# SpEL 구성
```java

@Component
public class AppRunner implements ApplicationRunner {

    //표현식을 사용하는 방법
    @Value("#{1 + 1}")
    int value;

    @Value("#{'hello ' + 'world'}")
    String greeting;

    @Value("#{1 eq 1}")
    boolean trueOrFalse;

    @Value("hello")
    String hello;

    //프로퍼티를 참고하는 방법
    @Value("${my.value}")
    int myValue;

    @Value("#{${my.value} eq 100}")
    int isMyValue100;

    //빈으로 등록한
    @Value("#{sample.data}")
    int sampleData;

    //레퍼런스 참고하기 !!

  @Override
  public void run(Application args) throws Exception {

      //프로그래밍하여 사용할 수도 있다.
      ExpressionParser parser = new SpelExpressionParser();
      Expression expression = parser.parseExpression("2 + 100");
      Integer value = expression.getValue(Integer.class);


  }
}
```

# 실제로 어디서 쓸까?
- @Value 애노테이션
- @ConditioanlOnExpression
  - 선택적으로 어떤 빈을 등록하거나 빈 설정파일을 등록할 때 사용하는 애노테이션.
  - 스프링 익스프레션 기반으로 선별적으로 빈을 등록할 수 있음
- 스프링 시큐리티
  - xml 기반의 설정에서 hasRole, hasPermission 등의 함수는 EvaluationContext로부터 온다.
  - (StandardEvaluationContext context = new Standard**EvaluationContext**(bean))
  - StandardEvaluationContext에서 Bean을 만들어주면 Bean이 제공하는 함수를 사용할 수 있다.
  - 메소드 시큐리티, @PreAuthorize, @PostAuthorize, @PreFilter, @PostFilter
  - XML 인터셉터 URL

- 스프링 데이터
  - @Query 애노테이션

- Thymeleaf

