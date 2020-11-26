---
title: '인증 과정과 용어 설명'
metaTitle: "Spring Security | java configuration"
metaDescription: "Spring Security | java configuration"
---

## GOAL
rest api 기반의 ajax를 쓰는 프로젝트에서 jwt 토큰을 사용하여 spring security 구현

**세부목표**
1. jwt 토큰을 사용한 로그인
2. 일반회원과 매니저가 나뉘도록 권한 설정
3. 메뉴별 권한 다르게 설정

## 목차
1. java configuration
2. spring security configuration
3. spring security란??**
4.
4. spring security - jwt token을 이용한 인증
5. csrf



><strong>프로젝트 환경</strong>
>framework version : spring 5.2.7
>jdk : java 1.8
>ide : intellij
>was : tomcat 8.5
>build : maven




### [3] 인증 과정



![](./images/springsecurity_basicauth_02.png)



>**SecurityContextHolder** : 쓰레드 로컬에 SecurityContext를 보관한다.
>**SecurityContext** : 인증 정보(Authentication)를 보관하는 일종의 저장소. 현재 사용자에 대한 Authentication 객체를 구할때 SecretContext로 부터 구한다.
>**Authentication** : principal(인증 주체)를 확인하고 정보를 담는다. 인증 요청 시, 요청 정보를 담는다.
>**AuthenticationManager** : 인증 처리 후, 인증 정보를 담고 있는 Authentication 객체를 리턴한다. 스프링 시큐리티는 리턴한 Authentication 객체를 SecurityContext에 보관한다.
>**AuthenticationProvider** : 유저가 입력한 username과 password를 DB에서 가져온 사용자의 정보(UserDetailsService)를 비교해주는 인터페이스.
>**GrantedAuthority** : principal(인증 주체)에 부여된 어플리케이션 차원의 권한
>**UserDetails** : 데이터베이스에서 가져온 데이터로 인증을 구축하는데 중요한 정보를 제공.
>**UserDetailsService** : String 타입의 usrename(또는 인증된 ID 등)으로 정보를 가져오는 UserDetails를 생성.



### [2] UserDetails

스프링 시큐리티에서의 실제로 데이터베이스에 저장된 유저 정보를 검색할 때 이용하는 인터페이스다.

> username(must be unique)
> password(must be encoded)
> roles(ROLE_NAME)
> authorities(permissions)
> ...


UserDetails는 스프링 시큐리티의 핵심 인터페이스이다.

스프링 시큐리티는 UserDetails 인터페이스를 사용해 데이터베이스에서 가져온 유저 정보로 SecurityContextHolder를 구축한다.
기본적으로 유저이름, 패스워드, 롤, 권한 등의 필드가 있다.(부가적인 유저 정보를 담으려면 User 클래스를 상속받아 새로운 클래스를 만들자.)

UserDetailsService 인터페이스에는 단 하나의 메소드가 있는데, (대개)username을 매개변수로 받아서 유저 정보를 가져오는 메소드이다.
이 메소드는 스프링 시큐리티 내에서 사용자의 정보를 가져오는 가장 일반적인 방법이며, 사용자 정보가 필요할 때마다 프레임워크 전체에서 사용될 수 있다.

```java
package org.springframework.security.core.userdetails;

public interface UserDetailsService {
    UserDetails loadUserByUsername(String var1) throws UsernameNotFoundException;
}
```




















