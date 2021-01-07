---
title: "angular fundamentals"
metaTitle: "angular fundamentals"
metaDescription: "angular fundamentals"
---

# 1. 설치

* npm이 먼저 설치되어 있어야 한다.

```shell
npm install -g @angular/cli
```

설치 후 프로젝트 폴더를 하나 만들고

```shell
ng new ang01
```

프로젝트 폴더로 옮긴 후

```shell
cd ang01
ng serve --open
```

서버를 실행한다.

# 2. 데이터바인딩

크게 3가지로 분류될 수 있다.
### 2.1 One-way from data source to view target [단방향 데이터소스 -> 뷰]

```angular2html
  <!-- interpolation -->
  {{ expression }}
  <div> {{ getTitle() }}</div>

  <!--  property binding  -->
  <input #myinput [property]="expression">

- 값이 동적으로 변하므로 실제 DOM에는 값이 지정되지 않음.

  <!--  attribute binding-->
  <input #myinput2 [attr.value]="myValue">

  <!-- class binding -->
  <div [class.visible]="isVisible()">Hello</div>

  <!-- ngClass Directive를 이용한 것과 같은 효과 -->
  <div [ngClass]="{'visible': isVisible()}">Hello</div>

- 식(expression)에 true/false에 따라 지정한 클래스가 삽입될 지 결정.

  <!-- style binding-->
  <!-- Data 소스의 Field로 인식하지 않고 문자열로 인식하기 위해 ''로 감싸야 한다. -->
  <div [style.backgroud-color]="'cyan'">...</div>

```

### 2.2 One-way from view target to data source [단방향 뷰 -> 데이터소스]

```angular2html
<button (onClick)="showMyAction()">Click me!</button>
```

###2.3 Two Way [양방향]

- 프로퍼티 바인딩 + 이벤트 바인딩

- 양방향으로 데이터를 바인딩 하기 위해서는 FormsModule이 필요하다.
```typescript
import { FormsModule } from '@angular/forms'

@NgModule({
  ...
  imports: [ FormsModule, ... ]
})
```
```angular2html
<input  [{ngModel}]="name">
```

##### Directives
지시자.

###### Structural Directives
DOM Tree를 동적으로 조작하여 화면의 구조를 변경할 때 사용.

```angular2html

```


### Augular Module
- 관련되어 있는, 공통적인 부분을 묶을 때 모듈을 사용한다.
- 예를 들면 html페이지를 navbar(header), sidebar(content), footer로 나누었을 때 각 영역을 모듈로 볼 수 있다.
- 코드의 역할과 책임을 나누어 코드의 품질을 높인다.
- 페이지 로딩 속도를 높이기 위하여 사용한다.
- 모듈 내에 컴포넌트 여러개를 만들어 화면을 나눌 수 있다.

* 모듈 만들기
```shell
ng g module nav
```
* 컴포넌트 만들기
```shell
ng g c nav/navbar
```

















