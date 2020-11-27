---
title: 'spring security 내부 인증 과정'
metaTitle: "Spring Security | java configuration"
metaDescription: "Spring Security | java configuration"
---

# Summary

다음은 스프링 시큐리티의 인증이 완료되는 과정을 나타낸 그림이다.

![](./images/springsecurity_basicauth_02.png)


인증과정을 간단하게 설명하자면

* 사용자로부터 받은 리퀘스트를 Authentication Filter (List) 를 거쳐 인증을 완료 후(1~9)
* 생성된 Authentication 객체를 SecurityContext에 저장한다.(10)

✨ 사용자는 SecurityContext에 저장된 인증정보를 필요할 때마다 꺼내어 사용할 수 있다.

# AuthenticationFilter 동작 방식

클라이언트로 부터 온 HTTP Request는 먼저 ApplicationFilter(스프링 시큐리티 필터 아닌 다른 필터)를 돈 후 **springSecurityFilterChain**을 거치게 된다.

springSecurityFilterChain은 **'스프링 시큐리티의 Filter 리스트'**를 가지고 있는 객체이다.

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


# 인증 완료 과정

UserNamePasswordAuthenticationFilter 소스를 보면 사용자의 리퀘스트에서 유저네임과 패스워드를 가져와 AuthenticationManager 인터페이스로 전달한다.

```java

public class UsernamePasswordAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

     //...
     public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
            //.....
            UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
            this.setDetails(request, authRequest);
            return this.getAuthenticationManager().authenticate(authRequest);
     }
}
    //...
```

AuthenticationManager는 인터페이스로, ProviderManager 클래스가 그 구현체이다.

```java
public class ProviderManager implements AuthenticationManager, MessageSourceAware, InitializingBean {
  //.........

  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    //..........
     while(var8.hasNext()) {
            AuthenticationProvider provider = (AuthenticationProvider)var8.next();
            if (provider.supports(toTest)) {
                try {

                    result = provider.authenticate(authentication);

                    if (result != null) {
                        this.copyDetails(authentication, result);
                        break;
                    }
                } catch (InternalAuthenticationServiceException | AccountStatusException var13) {
                    this.prepareException(var13, authentication);
                    throw var13;
                } catch (AuthenticationException var14) {
                    lastException = var14;
                }
            }
        }
     //............
    }

}
```

ProviderManager는 AuthenticationProvider 리스트를 순회하며 인증을 위임할 프로바이더를 찾는다.

**AuthenticationProvider는 그 인증 객체를 이용하여 DB에서 가져온 사용자의 정보와 사용자가 입력한 정보를 비교한. 그러니까 실질적인 인증은 AuthenticationProvider에서 이루어지는 셈이다.**

AuthenticationProvider 인터페이스의 구현체는 개발자 스스로 구현해도 되고
(AbstractUserDetailsAuthenticationProvider.class 상속받아서), 스프링 시큐리티에서 기본적으로 제공해주는 클래스를 사용해도 된다.

✨ 혹시 커스텀 AuthenticationProvider을 사용할 경우엔, 스프링 시큐리티 설정파일에서 configure(AuthenticationManagerBuilder auth) 메소드를 상속받아서 등록하면 된다.

AuthenticationManagerBuilder 클래스의 authenticationProvider 메소드는 authenticationProvider(ArrayList)에 add를 해준다.
ProviderManage가 순회하는 AuthenticationProvider 리스트에 내가 만든 프로바이더를 넣어주는 것이다.

```java
public class AppSecurityConfig extends WebSecurityConfigurerAdapter {

    //.....
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(appUserService);
        return provider;
    }
    //....
}
```

내가 만든 커스텀 프로바이더는 아니지만 AbstractUserDetailsAuthenticationProvider를 상속받은 DaoAuthenticationProvider를 보자.
(스프링에서 기본적으로 제공해주는 클래스이며 아무 설정도 안했을시 이 프로바이더를 사용한다)

설정 파일에서 passwordEncoder과 UserDetails 인터페이스의 구현체인 UserDetailsService 를 set 해준다.
UserDetails는 데이터베이스에서 유저 정보를 검색할때 쓰는 스프링 시큐리티의 인터페이스이다. 추후에 살펴보자.

```java
public class DaoAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {
   //.....
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
        if (authentication.getCredentials() == null) {
            this.logger.debug("Authentication failed: no credentials provided");
            throw new BadCredentialsException(this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        } else {
            String presentedPassword = authentication.getCredentials().toString();
            if (!this.passwordEncoder.matches(presentedPassword, userDetails.getPassword())) {
                this.logger.debug("Authentication failed: password does not match stored value");
                throw new BadCredentialsException(this.messages.getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
            }
        }
    }
    //.....
}
```

이 부분이 핵심적으로 인증을 책임지는 부분이다.

<code>
this.passwordEncoder.matches(presentedPassword, userDetails.getPassword())
</code>

* presentedPassword : 유저가 입력한 패스워드
* userDetails.getPassword() : 디비에서 가져온 패스워드

matches 함수를 통해 암호가 같은지 검증한 후, 검증 실패시 BadCredentialsException 을 띄운다.
검증 성공시 Authentication 객체를 return 한다. (createSuccessAuthentication 메소드 참조)


```java
public class DaoAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {

    protected Authentication createSuccessAuthentication(Object principal, Authentication authentication, UserDetails user) {
        boolean upgradeEncoding = this.userDetailsPasswordService != null && this.passwordEncoder.upgradeEncoding(user.getPassword());
        if (upgradeEncoding) {
            String presentedPassword = authentication.getCredentials().toString();
            String newPassword = this.passwordEncoder.encode(presentedPassword);
            user = this.userDetailsPasswordService.updatePassword(user, newPassword);
        }

        return super.createSuccessAuthentication(principal, authentication, user);
    }
}

public abstract class AbstractUserDetailsAuthenticationProvider implements AuthenticationProvider, InitializingBean, MessageSourceAware {

   protected Authentication createSuccessAuthentication(Object principal, Authentication authentication, UserDetails user) {
     UsernamePasswordAuthenticationToken result = new UsernamePasswordAuthenticationToken(principal, authentication.getCredentials(), this.authoritiesMapper.mapAuthorities(user.getAuthorities()));
     result.setDetails(authentication.getDetails());
     return result;
   }

}
```


✨ 검증 시 DB에서 유저 정보를 가져올때는 UserDetail 인터페이스를 이용한다. UserDetail의 구현체인 UserDetailService를 만들어서 필수적인 값들을 데이터베이스에서 가져와야한다.
필수적인 값이란 다음과 같다.

- username(must be unique)
- password(must be encoded)
- roles(ROLE_NAME)
- authorities(permissions)
- ...

이 값들 말고도 커스텀 값을 추가 할 수 있다. 부가적인 유저 정보를 담으려면 User 클래스를 상속받아 새로운 클래스를 만들자.

UserDetailsService 인터페이스에는 단 하나의 메소드가 있는데, username을 매개변수로 받아서 유저 정보를 가져오는 메소드이다.
이 메소드는 스프링 시큐리티 내에서 사용자의 정보를 가져오는 가장 일반적인 방법이며, 사용자 정보가 필요할 때마다 프레임워크 전체에서 사용될 수 있다. 😍

```java
package org.springframework.security.core.userdetails;

public interface UserDetailsService {
    UserDetails loadUserByUsername(String var1) throws UsernameNotFoundException;
}
```

이 인터페이스의 구현체를 만들어서 디비에서 값을 가져오면 된다.


리턴받은 Authentication 객체는 SecurityContext에 보관된다.


# 용어 정리

- **SecurityContextHolder** : 쓰레드 로컬에 SecurityContext를 보관한다.
- **SecurityContext** : 인증 정보(Authentication)를 보관하는 일종의 저장소.
- **Authentication** : principal(인증 주체)를 확인하고 정보를 담는다. 인증 요청 시, 요청 정보를 담는다.
- **AuthenticationManager** : 인증 처리 후, 인증 정보를 담고 있는 Authentication 객체를 리턴한다.
- **AuthenticationProvider** : 유저가 입력한 username과 password를 DB에서 가져온 사용자의 정보(UserDetailsService)를 비교해주는 인터페이스.
- **UserDetails** : 데이터베이스에서 가져온 데이터로 인증을 구축하는데 중요한 정보를 제공.
- **UserDetailsService** : String 타입의 usrename(또는 인증된 ID 등)으로 정보를 가져오는 UserDetails를 생성.
