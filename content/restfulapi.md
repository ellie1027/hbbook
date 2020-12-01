---
title: "그런 REST API로 괜찮은가?"
metaTitle: "Restful API 정리"
metaDescription: "Restful API 정리"
---
# 그런 REST API로 괜찮은가? 정리

# API
- 소프트웨어가 다른 소프트웨어로부터 지정된 형식으로 요청, 명령을 받을 수 있는 수단.
- a way of providing interoperability between computer systems on the Internet.

# Rest api 의 시작

# web (1991)

# 어떻게 인터넷에서 정보를 공유할 것인가?
- 정보들을 하이퍼텍스트로 연결한다.
- 표현 형식: HTML
- 식별자: URI
- 전송 방법: HTTP

# HTTP/1.0 (1994-1996)
로이 필딩 : 어떻게 내가 웹을 망가뜨리지 않고 http를 발전시킬수 있을까?

# REST API
REST 아키텍쳐 스타일을 따르는 API

# REST
분산 하이퍼미디어 시스템(예: 웹)을 위한 아키텍쳐 스타일

# 아키텍쳐 스타일
제약조건들의 집합

 이 제약조건들을 모두 따라야 비로소 REST API를 지켰다고 말할 수 있다

#  REST를 구성하는 스타일
- client-server
- stateless
- cache
- **uniform interface**
- layered system
- code-on-demand (optional) : 서버에서 코드를 클라이언트로 보내서 실행할 수 있어야 한다(ex: java script)

# Uniform Interface의 제약조건
- identification of resources : 리소스가 uri로 식별되면 된다
- manipulation of resources through representations : representation 전송을 통하여 리소스를 조작해야 한다.(리소스를 조작시 )
- self-descriptive messages :
    예) get / http / 1.1 / **host: www.example.org**
    예) http / 1.1 200 ok / **content-type : application/json-patch+json** [{"op":""remove", "path":"/a/b/c"}]
    - 메세지만 보고도 완벽하게 해석할 수 있어야 한다
- hypermedia as the engine of application state(HATEOAS) : '애플리케이션의 상태'는 Hyperlink를 이용해 전이되어야 한다.
    예) HTTP/ 1.1 200 OK
        Content-Type: application/json
        Link: </articles/1>; rel="previous",
              </articles/3>; rel="next";
        {
            "title": "The second article",
            "contents": "blah blah..."
        }


# 왜 'uniform interface'가 필요한가?
- 독립적 진화
    - 서버와 클라이언트가 각각 독립적으로 진화한다.
    - 서버의 기능이 변경되어도 클라이언트를 업데이트할 필요가 없다.
    - REST를 만들게 된 계기("어떻게 내가 웹을 망가뜨리지 않고 http를 발전시킬수 있을까?")

따라서 uniform interface를 지켜야만 REST API라고 할 수 있다.


# WEB
- 웹 페이지를 변경했다고 웹 브라우저를 업데이트할 필요는 없다.
- 웹 브라우저를 업데이트 했다고 웹 페이지를 변경할 필요도 없다.
- HTTP 명세가 변경되어도 웹은 잘 동작한다
- HTML 명세가 변경되어도 웹은 잘 동작한다


# 상호운용성(interoperability)에 대한 집착
- 하위호환성

# REST가 웹의 독립적 진화에 도움을 주었나?
- HTTP에 지속적으로 영향을 줌
- Host 헤더 추가
- 길이 제한을 다루는 방법이 명시(414 URL Too Long 등)
- URI에서 리소스의 정의가 추상적으로 변경됨: "식별하고자 하는 무언가"
- 기타 HTTP와 URI에 많은 영향을 줌
- HTTP/1.1 명세 최신판에서 REST에 대한 언급이 들어감

# 그렇다면 REST는 성공했는가?
- REST는 웹의 독립적 진화를 위해 만들어졌다.
- 웹은 독립적으로 진화하고 있다.

# REST API는 저 제약조건들을 다 지켜야 할까?
- 하이퍼텍스트를 포함한 self-descriptive한 메시지의 uniform interface를 통해 리소스에 접근하는 API

# REST API 구현하고 REST API라고 부르기

### 왜 API는 REST가 잘 안되나 일반적인 웹과 비교해보자
- 웹 페이지는 사람과 기계간의 커뮤니케이션(Media Type : HTML)이지만 HTTP API(Media Type : JSON)는 기계와 기계 간의 커뮤니케이션이다.
- 웹 페이지는 하이퍼링크가 되지만(a 태그 등), JSON은 정의되어있지 않음
- 웹 페이지는 Self-discriptive가 되지만(HTML 명세), JSON은 불완전함.(문법 해석은 가능하지만 해석하려면 별도로 문서가(API 문서 등) 필요하다.)


### self-descriptive와 HATEOAS는 어떻게 독립적인 진화에 도움이 될까?
- self-descriptive(확장 가능한 커뮤니케이션) : 서버나 클라이언트가 변경되더라도 오고가는 메시지는 언제나 self-descriptive하므로 언제나 해석이 가능하다
- HATEOAS : 애플리케이션 상태 전이의 late binding
    - 어디서 어디로 전이가 가능한지 미리 결정되지 않는다. 어떤 상태로 전이가 완료되고 나서야 그 다음 전이될 수 있는 상태가 결정된다.(링크는 동적으로 변경될 수 있)


### self-descriptive
- 방법1 : Media type
    - 미디어 타입을 하나 정의한다.
    - 미디어 타입 문서를 작성한다. 이 문서에 id, title 등이 뭔지 의미를 정의한다.
    - IANA에 미디어 타입을 등록한다. 이때 만든 문서를 미디어 타입의 명세로 등록한다.
    - 이제 이 메시지를 보는 사람은 명세를 찾아갈 수 있으므로 이 메시지의 의미를 온전히 해석할 수 있다.
    - 하지만 이 방법을 쓴다면 매번 Media type을 정의해야한다.

- 방법2 : Profile
    - "id"가 뭐고 "title"이 뭔지 의미를 정의한 명세를 작성한다.
    - Link 헤더에 profile relation으로 해당 명세를 링크한다.
    - 이제 메시지를 보는 사람은 명세를 찾아갈 수 있으므로 이 문서의 의미를 온전히 해석할 수 있다.
    - 단 클라이언트가 Link 헤더(RFC 5988)와 profile(RFC 6906)을 이해해야 한다.
    - Content negotiation을 할 수 없다.

### HATEOAS
- 방법1 : data로
    - data에 다양한 방법으로 하이퍼링크를 표현한다.
    - 링크를 표현하는 방법을 직접 정의해야 한다.
    - JSON으로 하이퍼링크를 표현하는 방법을 정의한 명세들을 활용한다.
        - JSON API
        - HAL
        - UBER
        - Siren
        - COLLECTION+json
        - ...
    - 기존 API를 많이 고쳐야 한다.
- 방법2 : HTTP 헤더로
    - Link, Location 등의 헤더로 링크를 표현한다.

data와 헤더 모두 활용하면 좋다.


### 하이퍼링크는 반드시 uri여야 하는가?
- 하이퍼링크라는 것만 표시된다면 상대주소, 절대주소 등 다 가능함.

### media type 등록은 필수인가?
- 하면 좋음. 누구나 쉽게 사용할 수 있고, 이름 충돌을 피할 수 있다.


# 정리
- 오늘날 대부분의 "REST API"는 사실 REST를 따르지 않고 있다.
- REST의 제약조건 중에서 특히 Self-descriptive와 HATEOAS를 잘 만족하지 못한다.
- REST는 긴 시간에 걸쳐 진화하는 웹 애플리케이션을 위한 것이다.
- REST를 따를 것인지는 API를 설계하는 이들이 스스로 판단하여 결정해야 한다.
- REST를 따르겠다면, Self-descriptive와 HATEOAS를 만족시켜야 한다.
    - Self-descriptive는 custom media type이나 profile link relation 등으로 만족시킬 수 있다.
    - HATEOAS는 HTTP 헤더나 본문에 링크를 담아 만족시킬 수 있다

















