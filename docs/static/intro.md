```bash
$ npm i ipa.js
```


### 基本用法

IPA.js是一个javascript声明式数据结构校验库，可以运行于浏览器端和node环境。它通过一种类似[Mongoose Schemas](http://mongoosejs.com/docs/guide.html)的语法来声明对数据的校验规则并创建实例：

```javascript
import IPA from 'ipa.js';

const personSchema = new IPA({
    name: String,
    age: Number,
    girlfriends: [String],
});
```

IPA依赖[Lodash](https://lodash.com)进行基础类型的校验与转换。它的实例通过**check**，**guarantee**，**mock**三种方法来分别实现对数据的深层**校验**，**保障**和**自动生成**：

- [check方法](#/doc#校验方法-check方法)校验数据结构的合法性：

```javascript
personSchema.check({
    name: '李雷',
    age: 13,
    girlfriends: ['韩梅梅', '钟梅梅', '李梅梅'],
    location: '上海',
}); // true
```

- [guarantee方法](#/doc#校验方法-guarantee方法)保障数据的合法性，给予系统一定的容错能力：

```javascript
personSchema.guarantee({
    name: '李雷',
    age: '13',
    girlfiends: null,
    location: '上海',
});

// { 
//     name: '李雷',
//     age: 13,
//     girlfriends: [],
//     location: '上海',
// }
```

- [mock方法](#/doc#校验方法-mock方法)生成随机的合法数据，方便开发：

```javascript
personSchema.mock();

// { 
//     name: 'magna',
//     age: 13,
//     girlfriends: ['ipsum', 'ad', 'veniam']
// }
```

IPA还针对[数组长度](#/doc#校验规则声明-数组-长度校验)提供了强大的校验、保障和生成机制。
如下声明的表格数据格式，要求其表头的列数和每一行的列数一致：

```javascript
const tableSchema = new IPA({
    thead: [String, 'cols'],
    tbody: [[Number, 'cols'], 'rows'],
});

const table = {
    thead: ['列1', '列2'],
    tbody: [[3, 10], [2, 4, 6], [8, 9]],
}

tableSchema.check(table); // false

tableSchema.guaratee(table);
// {
//     thead: ['列1', '列2'],
//     tbody: [[3, 10], [2, 4], [8, 9]],
// }

tableSchema.mock({ cols: 3, rows: 2 }); // 指定长度参数的值
// {
//     thead: ['irure', 'mollit', 'aute'],
//     tbody: [[6, 1, 7], [2, 9, 4]],
// }
```

通过上述核心功能，IPA能够：

- 完成繁琐易漏的数据结构校验
- 帮助增强模块的容错能力
- 增强代码的可读性
- 提升端对端/多模块开发效率

### 扩展规则

为了方便在多种场景下实现对复杂数据结构的校验，IPA提供了一系列易用的内置类型校验和默认值校验，并且支持实例间的相互嵌套：

例如：

```javascript
const { or, Range, Integer } = IPA;

const unitSchema = new IPA({
    id: or(String, Number),
    value: 0,
    count: Integer,
    type: Range(1, 4),
});

const listSchema = new IPA([
    unitSchema,
]);
```

### 自定义规则

IPA还支持具有高扩展性的[规则自定义](#/doc#校验规则声明-自定义校验)，并支持构造自定义的嵌套规则。

如下示例了一个可以对校验规则进行 _**与操作**_ 的函数，并基于此生成了一个可以用来校验是否是合法的ASCII码值的校验器：

```javascript
function and (...templates) {
    return (compile) => {
        const rules = templates.map(template => compile(template));
        return { 
            check: val => rules.every(rule => rule.check(val)),
        };
    }
}

function RangeInt (min, max) {
    return and(IPA.Range(min, max), IPA.Integer);
}

const ASCIICodeSchema = new IPA(RangeInt(0, 127));
```

如下示例了一个自定义的HTTP响应数据的基本结构，以及针对不同响应类型的扩展结构：

```javascript
const Res = (subtemplate = Object) => {
    return (compile) => {
        return compile({
            code: Number,
            msg: String,
            data: subtemplate,
        });
    };
};

const dataSchema1 = new IPA(Res(String));
const dataSchema2 = new IPA(Res([{
    name: String,
    value: Number
}]));
```

### 工程化

由于使用场景多是大型的 **端对端/多模块** 工程，IPA提供了如[全局注入](#/doc#工程化-实例的全局注入与调用)和[开发环境设置](#/doc#工程化-mock与生产环境)等功能来贴合工程化开发场景中的需求，更多IPA的语法细节和工程化用法请见[工程化](#/doc#工程化)。
