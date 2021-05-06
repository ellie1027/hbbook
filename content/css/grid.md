---
title: 'grid'
metaTitle: ""
metaDescription: ""
---


```css
.container {
    display: grid;
    /* grid-template-columns: 40% 60%; */
    /* grid-template-columns: 4fr 6fr; */
    /* grid-template-columns: repeat(3, 1fr); = grid-template-columns: 1fr 1fr 1frs */
    grid-template-columns: 200px 1fr;
    grid-gap: 1rem;
}
```

각 item이 높이가 다를시 맞춰주려면..

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* grid-auto-rows: 200px; */
    grid-auto-rows: minmax(200px, auto);
    grid-gap: 1rem;
}
```

정렬 방법 1)

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* grid-auto-rows: 200px; */
    grid-auto-rows: minmax(200px, auto);
    grid-gap: 1rem;
    justify-items: center; /* start, end */
}
```

정렬 방법 2)

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* grid-auto-rows: 200px; */
    grid-auto-rows: minmax(200px, auto);
    grid-gap: 1rem;
    align-items: center; /* start, end */
}
```

각각 정렬하는 방법

```css
.item:nth-child(5) {
    justify-self: start;
    align-self: center;
}
```



각 컬럼 너비,길이들을 각각 조정하는 법

```css
.item:nth-child(1) {
    grid-column: 1/4;
}
```

```css
.item:nth-child(4) {
    grid-column: 3;
    grid-row: 2/4;
}
```