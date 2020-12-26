---
title: 'Linked List'
date: 2020-10-28 16:21:13
category: 'datastructure'
draft: false
---

# Linked List

# 1. 개요
  - 컴퓨터에 자료를 저장하는 구조의 한 종류
  - **일렬로 연결된 데이터**를 저장할 때 사용함
  - 길이가 정해지지 않은, 데이터의 연결된 집
  - 데이터를 저장할 공간이 있으면, 그 안에 다음 데이터의 주소를 가지고 있는 구조
  - 배열은 배열방들이 물리적으로 한 곳에 몰려있고, 배열방의 크기를 정하면 늘리거나 줄일 수 없는데, 링크드 리스트는 중간에 데이터를 넣고 싶으면 앞의 노드가 가지고 있던 주소를 자신이 갖고, 앞의 노드에게
    자신의 주소를 알려주면 된다.(데이터가 가지고 있는 주소만 바꿔주면 됨)
  - 일일히 주소를 찾아다녀야 하므로 배열보다 속도가 느릴 수 있음
  - 그런데 삽입, 삭제 등의 기능을 배열로 구현해야 한다면 노드가 하나 추가될때마다 배열방을 통째로 다시 선언하여 이전 내용을 다시 복사해야 하므로 길이가 정해지지 않은 데이터를 다뤄야 할 때는 링크드 리스트가 좋음

# 2. 단방향, 양방향 Linked List 개념
  - 단방향 : 한 방향으로만 이동할 수 있는 링크드 리스트. 헤더 주소 하나만 포인터를 저장하고 있다.
  - 양방향 : 양 방향으로 이동할 수 있는 링크드 리스트. 양쪽 끝에 포인터를 저장하고 있다. 맨 끝에 노드를 삽입할 때 끝까지 찾아가는 수고로움을 줄일 수 있다.

![단방향,양방향 링크드 리스트](/content/datastructure/images/linkedlist_01.png)

# 3. 단방향 Linked List 간단한 구현

```java
class Node {

  int data;
  Node next = null;

  Node(int d) {
    this.data = d;
  }

  //원래 추가 후 성공했는지 실패했는지 boolean 타입을 리턴해야 함.

  //단방향 링크드 리스트에 데이터를 추가하는 함수
  void append(int d) {
    Node end = new Node(d); //받은 인자값으로 새로운 노드 생성
    Node n = this; //포인터를 생성하여 첫번째 노드를 가리키게 함.

    while(n.next != null) {
      n = n.next;   //포인터가 마지막 노드에 도착할때까지(마지막 노드에 도착하면 다음 포인터가 null일 것이므로)
    }

    //새롭게 만든 노드가 마지막에 가서 붙는다
    n.next = end;
  }

  //단방향 링크드 리스트에 데이터를 삭제하는 함수
  void delete(int d) {
    //임의의 포인터를 만들어서 첫번째 노드를 가리키게 함.
    Node n = this;

    //마지막 노드가 아닐 때까지
    while(n.next != null) {
      //다음 노드의 데이터가 삭제할 데이터와 같은지 확인후 지울지 말지 판단
      if(n.next.data == d) {
        //내 다음 노드의 데이터가 삭제할 데이터라면 내 다음 노드를 내 다다음 노드로 바꿈
        n.next = n.next.next;
      //값이 다른 경우에는 다음 노드로 옮기며 계속 찾음
      }else {
        n = n.next;
      }
      //그런데 n.next 값만 보므로 첫번째 노드는 삭제를 못함.

    }
  }

  //값을 보여주는 함수
  void retrieve() {
    //포인터 선언
    Node n = this;

    while(n.next != null) {
      System.out.print(n.data + " -> ");
      n = n.next;
    }
    //마지막 데이터
    System.out.println(n.data);
  }

}

public class SinglyLinkedList {

  public static void main(String[] args) {
    //test
    //헤드 노드(시작하는 처음 노드)
    Node head = new Node(1);
    head.append(2);
    head.append(3);
    head.append(4);
    head.retrieve();
    head.delete(2);
    head.retrieve();
  }

}
```

# 4. LinkedListNode 클래스의 구현

'#3' 에서 구현한 간단한 단방향 링크드 리스트의 경우, 헤더 값이 더이상 필요없어져서 삭제할때, 어떤 오브젝트가 헤더 값을 갖고 있다면 에러가 난다.
이러한 문제를 해결하기 위하여 노드 클래스를 링크드 리스트라는 클래스로 감싸서 링크드 리스트의 헤더를 '데이터'가 아닌 '링크드 리스트의 시작을 알려주는 용도'로만 쓰도록 저장을 한다.
그리고 그 안에 노드 클래스를 만든다.

```java
//링크드 리스트의 헤더를 데이터가 아닌 링크드 리스트의 시작을 알리는 용도로 만듬
//헤더가 삭제되었을시 헤더의 주소를 가지고 있는 데이터가 없도록 하기를 위함
class LinkedList {

  //헤더 노드 선언
	Node header;

	//노드 선언(
	static class Node {
		int data;
		//다음 노드, 초기 값은 널
		Node next = null;
	}

	//링크드 리스트 생성할 시 헤더 노드를 생성
	LinkedList() {
		header = new Node();
	}

	//단방향 링크드 리스트에 데이터 추가
	void append(int d) {
		Node end = new Node();
		//추가할 데이터를 끝 노드의 데이터로 붙인다
		end.data = d;
		Node n = header;

		while(n.next != null) {
			n = n.next;
		}

		//새롭게 만든 노드가 마지막에 가서 붙는다
		n.next = end;
	}


	//단방향 링크드 리스트에 데이터 삭제
	void delete(int d) {
		Node n = header;

		while(n.next != null) {
			if(n.next.data == d) {
				//내 다음 노드를 내 다다음 노드로 바꿈
				n.next = n.next.next;
			}else {
				n = n.next;
			}
		}

	}

	void retrieve() {
	  //헤더는 데이터가 아닌 관리용도이므로 헤더의 다음 노드를 노드 n으로 둬서 n부터 출력되도록 한다.
		Node n = header.next;

		while(n.next != null) {
			System.out.print(n.data + " > ");
			n = n.next;
		}

		System.out.println(n.data);
	}

  void removeDups(){
	    Node n = header;
	    //마지막 노드는 next값이 없으므로 반복문을 타지 말아야 하기 때문에
	    while (n != null && n.next != null) {
	      Node r = n;
	      while(r.next != null) {
	          if(n.data == r.next.data) {
	              //다음 노드의 데이터가 중복일 경우 현재 노드가 가진 다음 노드의 주소를 다음 노드의 주소를 다다음 노드의 주소로 바꾼다.
	              r.next = r.next.next;
            }else{
	              //중복이 아닐 경우 다음 노드로 간다.
	              r = r.next;
            }
         }
      }
  }
}

public class LinkedListNode {
	public static void main(String[] args) {
		LinkedList ll = new LinkedList();
		ll.append(1);
		ll.append(2);
		ll.append(3);
		ll.append(2);
		ll.append(2);
		ll.append(3);
		ll.retrieve();
		ll.delete(1);
		ll.retrieve();
	}
}
```

# 5. 정렬되어 있지 않은 링크드 리스트의 중복되는 값을 제거하시오. 단, 별도의 버퍼를 사용하지 않아야 한다)
(위의 removeDups 메서드 참조)

## 1) 버퍼 사용시
버퍼 - hashset 이용 (key값을 가지고 데이터를 찾는데 1이라는 시간밖에 안 걸린다.)
- space: O(N)
- time: O(N)

## 2) 포인터 사용시
n이 리스트 길이만큼 돌고, r이 n의 제곱만큼 돈다.
**따라서 시간효율성은 더 들지만 공간효율성이 있는 알고리즘이다.**
- space: O(1)
- time: O(N^2^)

# 6. 단방향 링크드 리스트 뒤부터 세기(뒤에서부터 K번째 노드 찾기)

## 1) 전체 노드 갯수 카운트 하여 k번째 노드 찾기

k = 1 일시 전체 리스트 갯수는 4 이므로 4 - 1 = 3이 나온다.
그런데 리스트 전체 갯수는 0번째 부터 세므로, 3 + 1을 해줘야 K번째 노드를 찾을 수 있다.

## 2) 재귀 호출

첫번째 노드를 가지고 함수를 호출한다. 이 함수는 자기가 받은 노드의 다음 노드를 가지고 자기 자신을 또 호출한다.
노드가 널이 될때까지 계속 자신을 호출한다. 노드가 널일시, 0을 반환한다. 반환한 값에 1을 더해서 계속 반환한다.

링크드 리스트의 길이를 n으로 볼때 O(N)의 공간을 사용하는 알고리즘이며,
시간은 최악의 경우 링크드리스트의 끝까지 갔다가 다시 앞까지 와야하므로 O(N)이다.

- space: O(N)
- time: O(N)

## 3) 포인터
포인터 두개(p1, p2)를 만들고, k = 3 일때 p2는 첫번째 자리에 두고, k만큼 p1을 보낸다.
포인터를 둘이 동시에 한 칸씩 이동하는데, 먼저 간 p1이 null을 만나면 뒤에 따라오던 포인터의 값이 k번째가 된다.

이렇게 포인터를 활용한 알고리즘은 O(N)의 시간이 걸리고
공간은 별도의 버퍼를 사용하지 않으므로 O(1)이 된다.

- space: O(N)
- time: O(1)

```java
public class KthToLast {

  //실행
  public static void main(String[] args) {
    int k = 1;
    Node kth = KthToLast(first, k);
  }

  private static Node KthToLast (Node first,int k){
    Node n = first;
    itn total = 1;

    while (n.next != null) {
      total++;
      n = n.next;
    }

    n = first;
    for (int i = 1; i < total - k + 1; i++) {
      n = n.next;
    }

    return n;
  }

  //방법 2. 재귀 호출

  //참조 값
  static class Reference {
    public int count = 0;
  }

  private static Node KthToLast_2(Node n, int k, Reference r) {
    //마지막 노드 전까지 갔을 때 return null
    //카운트는 reference에 저장하고 노드를 리턴하기 때문
    if(n == null) {
      return null;
    }

    //다음노드까지 세면서 k번째 노드를 찾는다
    Node found = KthToLast_2(n.next, k, r);
    r.count++;
    if(r.count == k) {
      return n;
    }
    return found;
  }

  //방법 3. 포인터
  public static Node KthToLast_3(Node first, int k) {
    Node p1 = first;
    Node p2 = first;

    //p1을 k번째 노드로 이동시킴
    for(int i = 0; i < k; i++) {
      //p1이 null일 경우 뒤에서 K번째 함수가 없다는 뜻으로 함수를 종료한다.
      if(p1 == null) return null;
      p1 = p1.next;
    }

    //p1이 마지막 노드로 갈 때까지 p2를 이동시킴
    while(p1 != null) {
      p1 = p1.next;
      p2 = p2.next;
    }

    return p2;

  }
}
```

