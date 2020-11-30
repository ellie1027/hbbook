---
title: "그런 REST API로 괜찮은가?"
metaTitle: "Restful API 정리"
metaDescription: "Restful API 정리"
---

# API
- 소프트웨어가 다른 소프트웨어로부터 지정된 형식으로 요청, 명령을 받을 수 있는 수단.

# 그런 REST API로 괜찮은가? 정리

a way of providing interoperability between computer systems on the Internet.

Rest api 의 시작

# web (1991)

어떻게 인터넷에서 정보를 공유할 것인가?
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


**왜 uniform interface가 필요한가?**
- 독립적 진화
    - 서버와 클라이언트가 각각 독립적으로 진화한다.
    - 서버의 기능이 변경되어도 클라이언트를 업데이트할 필요가 없다.
    - REST를 만들게 된 계기("어떻게 내가 웹을 망가뜨리지 않고 http를 발전시킬수 있을까?")

따라서 uniform interface를 지켜야만 REST API라고 할 수 있다.


**WEB**
- 웹 페이지를 변경했다고 웹 브라우저를 업데이트할 필요는 없다.
- 웹 브라우저를 업데이트 했다고 웹 페이지를 변경할 필요도 없다.
- HTTP 명세가 변경되어도 웹은 잘 동작한다
- HTML 명세가 변경되어도 웹은 잘 동작한다







