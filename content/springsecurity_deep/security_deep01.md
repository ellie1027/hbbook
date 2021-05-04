---
title: 'spring security authentication'
metaTitle: "Spring Security | Authentication"
metaDescription: "Spring Security | Authentication"
---


# Authentication

## Architecture Components(구성 부품)

**SecurityContextHolder**

- SecurityContextHolder에 만약 값이 존재한다면 현재 인증된 유저로 인식된다. 직접적으로 넣든 어떻게 넣었는지는 중요하지 않다.
- 기본적으로 쓰레드 로컬에 SecurityContext를 보관한다. 같은 쓰레드라면 언제든 SecurityContext를 사용할 수 있다.    
- 시작 시 쓰레드 로컬에 SecurityContext가 어떻게 저장될지 명시하는 전략을 설정할 수 있다. 
    - 독립된 애플리케이션이라면 **SecurityContextHolder.MODE_GLOBAL** 전략을 쓸 수 있다.
    - secure thread에서 생성된 쓰레드가 secure thread와 동일한 security identity를 갖기를 원한다면 **SecurityContextHolder.MODE_INHERITABLETHREADLOCAL**를 쓸 수 있다. 
 - 대개는 기본 모드를 그냥 사용하지만, 쓰레드 로컬 모드를 바꿀 수도 있다. 첫 번째는 시스템 프로퍼티를 세팅하는 경우이고, 두 번째는 SecurityContextHolder에서 static 메서드를 호출하는 것이다.(자세한 것은 javaDoc참조)

 **SecurityContext**

- 인증객체를 포함하고 있다.

**Authentication**

- Authentication은 스프링 시큐리티 범위 내에서 두가지 주요 목적을 제공한다.
    - 현재 자격을 가진 사용자 정보를 제공한다.
    - 사용자가 인증하기 위하여 입력한 자격 증명(아이디, 비밀번호..)을 제공하는 AuthenticationManager에 대한 입력이다.

- principal: 인증 주체
- credentials: 비밀번호 
- authorities: 인증 주체가 가진 권한

**GrantedAuthority**

- Authentication.getAuthorities() 로 제공된다. 'Collection'으로 이루어져 있다.  

    
    



