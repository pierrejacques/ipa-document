### 安装

``` bash
npm install ipa.js
```



### 声明数据结构

要实现数据结构的校验，首先要通过声明数据结构，创建IPA实例：

- 简单数据类型：

``` js
new IPA(Number); // 数字
new IPA(String); // 字符串
new IPA(Boolean); // 布尔
new IPA(Function); // 函数
new IPA(Array); // 数组
new IPA(Object); // 普通对象
```



- 带默认值的简单类型：

``` js
new IPA(200); // 默认值为200的Number
new IPA('success'); // 默认值为success的String
new IPA(true); // 默认值为true的Boolean
```



- 对象和数组的多层嵌套结构：

``` js
new IPA([{
    name: String,
    data: [{
        x: Number,
        y: Number,
    }]，
    isDeleted: false,
}]);
```



- 可缺省（可为`null`或`undefined`）的属性

``` js
new IPA({
    name: String,
    'height?': Number,
    'weight?': Number,
    'age?': Number,
});
```



- 数组长度声明：

``` js
new IPA([Number, 3]); // 长度为3的数字数组
new IPA([{
    name: String,
    value: Number
}, '<30']); // 长度小于30的对象数组
new IPA([Boolean, '>=1']); // 长度大于等于1的布尔数组
new IPA({
    thead: [String, 'cols'],
    tbody: [[Number, 'cols'], 'rows'],
    isDeleted: [Boolean, 'rows'],
}); // 通过占位字符串声明长度应该相等的数组
```



- 内置类型语法糖：

```js
import IPA, {Integer, or, From, Range, recurse} from 'ipa.js';

new IPA(Integer); // 整数
new IPA(or(Number, String)); // 数字|字符串
new IPA(From(200, 400, 500)); // 200, 400, 500中的一个（如简易的HTTP状态码）
new IPA(Range(0, 10)); // 区间[0, 10]范围内的整数
new IPA(recurse([{
    name: String,
    value: Number,
    children: '$$', // 迭代字段标记
}])); // 迭代树状结构
```





### 校验数据

- 首先通过数据结构声明创建实例

``` js
const validator = new IPA([{
    name: String,
    'age?': Number,
}, 'len']);
```



- 通过check方法校验数据的合法性

```js
validator.check([{
    name: 'John Lennon'，
    age: 18,
}, {
    name: 'Paul McCartney',
}]); 

// 返回：true
```



- 通过guarantee方法通过最小的改动来保障数据的合法性

```js
validator.guarantee([{
    name: 'George Harrison',
    age: '19',
}]); 

// 返回：
// [{ 
//     name: 'George Harrison,
//     age: 19,
// }];
```



- 通过mock方法随机生成符合声明的数据，通过对长度占位符的赋值来控制生成的数组长度

```js
validator.mock({ len: 1 }); 

// 返回：
// [{
//     name: 'et',
//     age: 8,
// }]
```



### 错误捕捉

在`check`或是`guarantee`方法发现数据不符合声明的结构时会触发报错钩子函数，抛出精确到字段的错误信息，为API数据错误打点提供便利。



报错钩子函数`onError`可以设置在全局、实例和方法三个不同位置，并按 **方法** => **实例** => **全局** 的顺序依次冒泡执行：

```js
// 设置全局钩子
IPA.onError(err => console.log('from global: ', err));

// 设置实例钩子
const instance = new IPA(Number).onError(err => console.log('from instance: ', err));

// 设置方法钩子
instance.check('12', (err) => console.log('from method: ', err));

// 控台输出:
// from method: exceptions: Object {input: "should be a number"}
//              input: "12"
//              method: "check"
// from instance: exceptions: Object {input: "should be a number"}
//              input: "12"
//              method: "check"
// from global: exceptions: Object {input: "should be a number"}
//              input: "12"
//              method: "check"
```



在错误信息冒泡执行的过程中，可通过错误对象上的`stopPropagation`方法阻止其继续冒泡：

``` js
IPA.onError(err => console.log('from global: ', err));

const instance = new IPA(Number).onError(err => {
    console.log('from instance: ', err);
    err.stopPropagation(); // 阻止冒泡
});

instance.check('12', (err) => console.log('from method: ', err));

// 控台输出:
// from method: exceptions: Object {input: "should be a number"}
//              input: "12"
//              method: "check"
// from instance: exceptions: Object {input: "should be a number"}
//                input: "12"
//                method: "check"
```





### 应用示例

IPA适用于需要与外部发生数据交换的使用场景，对于内部数据交换的数据校验，建议使用Typescript等编译时解决方案，使用IPA可能会造成无谓的运行时性能浪费。

- [作为ajax拦截器使用（以axios为例）](#/doc#应用示例-作为Ajax拦截器使用（以axios为例）)
- [在Promise回调中进行mock](#/doc#应用示例-在Promise回调中进行mock)
- [实例的全局注入与调用](#/doc#应用示例-实例的全局注入与调用)
