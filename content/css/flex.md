---
title: 'flex'
metaTitle: ""
metaDescription: ""
---


# FLEX 기본 정리

```css
.container {
    display: flex;
}
```
container에 사용하여, 그 안의 자식 item들을 배치, 정렬한다.

## container에 사용하는 속성

## Flex-direction 
1. row (기본값) 
2. column  
3. row-reverse
4. column-reverse

**item들의 방향을 결정한다.**

## Flex-wrap 
1. nowrap (기본값)                      
2. wrap - container가 줄어들면 item이 뚝 떨어진다.
3. wrap-reverse - 순서가 변경되서 item이 떨어짐  

**container가 item의 폭보다 줄어들었을때 어떤 값을 주느냐에 따라 위치가 달라진다.**


* justify : item들을 축 방향으로 정렬해줌(양 옆으로 움직임) 

## justify-content
1. flex-start
2. flex-end  
3. center
4. space-between - item 중간에 여백을 똑같이 나눠 가진다. 
5. space-around - 

* align : item들을 축의 수직 방향으로 정렬해줌(위,아래로 움직임)

## align-items
1. stretch
2. flex-start
2. center
3. flex-end


**아이템들을 정 가운데로 하고 싶을 때**

```css
.container {
    display:flex;
    align-items: center;
    justify-content: center;
}
```

## align-content
- flex-wrap: wrap인 상태여야 함(반응형)

1. flex-start
2. flex-end
3. center
4. space-between
5. space-around


## item에 사용하는 속성

## flex-grow 

- 컨테이너가 아이템의 길이보다 넓어질때, 여백의 비율을 결정함(width가 아니라, flex-grow를 정의하기 전 이미 가지고 있었던 여백의 비율)
- 결정된 여백의 비율만큼 아이템이 늘어남

```css
.item{
    /* flex-grow: 1; */
}
.item:nth-child(1){
    flex-grow: 1;
}
.item:nth-child(2){
    flex-grow: 2;
}
.item:nth-child(3){
    flex-grow: 1;
}
```


## flex-basis

```css
    .item{
        flex-basis: 0;
    }
```

## flex-shrink

- 컨테이너가 아이템의 길이보다 좁아질때, 여백의 비율을 결정함

```css
    .item{
        flex-shrink: 0;
    }
```

**flex 속성에 숫자를 부여한다는 것 자체가 아이템에게 신축성을 준다는 것이다.** 


## align-self

- 아이템 각각 정렬하기

1. flex-start
2. center
3. flex-end

## order

- 아이템 순서 정하기
- 숫자로 넣어주면 됨


