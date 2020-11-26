---
title: 'spring security 내부 인증 과정'
metaTitle: "Spring Security | java configuration"
metaDescription: "Spring Security | java configuration"
---

# 1. 인증 과정

다음은 스프링 시큐리티의 인증이 완료되는 과정을 나타낸 그림이다.

![](./images/springsecurity_basicauth_02.png)


인증과정을 간단하게 설명하자면

* 사용자로부터 받은 리퀘스트를 Authentication Filter (List) 를 거쳐 인증을 완료 후(1~9)
* 생성된 Authentication 객체를 SecurityContext에 저장한다.(10)

✨ 사용자는 SecurityContext에 저장된 인증정보를 필요할 때마다 꺼내어 사용할 수 있다.

**AuthenticationFilter가 어떤 순서로 동작하는지 더 자세하게 파고들어보자.**

* 클라이언트로 부터 온 HTTP Request는 먼저 ApplicationFilter(스프링 시큐리티 필터 아닌 다른 필터)를 돈 후 **springSecurityFilterChain**을 거치게 된다.
* springSecurityFilterChain은 **'스프링 시큐리티의 Filter 리스트'**를 가지고 있는 객체이다.

<details>
    <summary>더보기 - 스프링 시큐리티 필터 리스트와 순서</summary>

![](./images/springsecurity_filterlist_05.png)
</details>

* 스프링 시큐리티 필터 체인은 '사용자의 HTTP 리퀘스트'를 가지고 **순서대로** 필터 리스트를 순회하며 필터링을 한다.
* 필터 중 하나에 인증이 되었다면 인증이 완료된 것이고, 마지막까지 인증이 되지 않았다면 인증 실패라고 여긴다.

| **주요 필터 이름**                         | **하는 일**                              |
|---------------------------------|------------------------------------|
|SecurityContextPersistenceFilter | SecurityContext 가 없으면 만들어주는 필터 |
|HeaderWriterFilter               | 응답(Response)에 Security와 관련된 헤더 값을 설정해주는 필터 |
|CsrfFilter | CSRF 공격을 방어하는 필터 |
|LogoutFilter| 로그아웃 요청을 처리하는 필터 |
|BasicAuthenticationFilter | HttpBasic Authentication을  처리하는 필터 |
|UserNamePasswordAuthenticationFilter | form-based Authentication을 처리하는 필터 |
|RequestCacheAwareFilter | 인증 후 원래 Request 정보로 재구성하는 필터 |
|AnonymousAuthenticationFilter | 이 필터에 올 때까지 사용자 정보가 인증되지 않았다면 이 요청은 익명의 사용자가 보낸 것으로 판단함(Authentication 객체를 새로 생성)  |
|SessionManagementFilter | 세션 변조 공격 방지, 유효하지 않은 세션으로 접근했을 때 URL 핸들링, 세션 생성 전략 설정, 최대 세션 수 설정 |
|ExceptionTranslationFilter | 앞 선 필터에서 예외가 발생할 경우 캐치하여 처리하는 필터 |
|FilterSecurityInterceptor | 인가(Authorization)를 결정하는 AccessDecisionManager에게 접근 권한이 있는지 확인하고 처리하는 필터 |

* 인증 방식에 따라서 최종 인증이 완료되는 필터가 다르다. basic authentication은 BasicAuthenticationFilter에서 인증이 완료되고,
Form Based Authentication 같은 경우 UserNamePasswordAuthenticationFilter 필터에서 인증이 완료된다.

* 인증 시


























