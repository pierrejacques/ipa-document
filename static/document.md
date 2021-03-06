## 一、校验方法

### check方法

用来校验一个数据是否符合声明的数据结构，仅在完全符合声明时返回`true`

- 签名：

``` ts
check(input: any, onError?: IPAError => void): boolean
```

- 示例：

```javascript
const validator = new IPA([String]);

validator.check(['a', 'b', 'c']); // true
validator.check({ 0: 'a', 1: 'b', 3: 'c', length: 3 }); // false
```



### guarantee方法

用来处理一个合法性未知的数据，返回一个合法的数据

guarantee方法接受3个输入参数，其中首个必填：

- 签名：

``` ts
guarantee(
    input: any,
    options?: { 
        copy?: boolean = true,
        strict?: boolean = false,
    },
    onError?: IPAError => void,
)
```



- 示例

```javascript
const validator = new IPA({
    username: String,
    password: String,
    repeat: String,
});

validator.guarantee({
    username: 'John Doe',
    password: 123,
    repeat: '123',
});
//  {
//      username: 'John Doe',
//      password: '123',
//      repeat: '123',
//  }

validator.guarantee(null);
//  {
//      username: '',
//      password: '',
//      repeat: '',
// }
```



- 不进行深拷贝：`guarantee`默认会对被校验的数据进行深拷贝后进行保障，将第二个参数的`copy`字段设为`false`关闭深拷贝

```javascript
const schema = new IPA({ prop: String });

const obj = { prop: 123 };

obj === schema.guarantee(obj); // false
obj === schema.guarantee(obj, {
    copy: false
}) ; // true
```



- 使用严格模式：`guarantee`倾向于对类型错误的数据进行转化，将第二个参数的`strict`字段设为`true`开启严格模式。严格模式下不合法的数据会统一被一个合法的默认值替换。

```javascript
const schema = new IPA(Number);

schema.guarantee('123'); // 123
schema.guarantee('123', {
    strict: true,
}); // 0
```


*需要注意的是`guarantee`方法在容错的同时势必存在令数据失真的风险，如果对数据的准确性有较严格要求，应该使用严格模式以减小失真度或改用`check`方法*



### mock方法

生成符合声明的随机数据

- 签名：

``` ts
mock(assignment: Object, isProductionEnv: boolean = false): any
```

- 示例：

第一个参数为数组长度占位符赋值

```javascript
const schema = new IPA([Number, 'len']);

// 不指定时，len的值将在1-10间随机生成
schema.mock(); //  [4, 2, 7, 10, 5, 2] 

// 指定len的值为3
schema.mock({ len: 3 }); // [6, 8, 1]
```

将第二个参数设为`true`使用生产环境行为：不再随机地生成数据，而是给出尽可能基本的具有合法结构的数据

```javascript
const schema = new IPA([Number]);

schema.mock(); // [2,9,4,3,6]
schema.mock({}, true); // []
```



## 二、校验规则声明

### 数字
#### Number

用`Number`声明一个数字类型。

guarantee在数据类型不符以及mock时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |
| --- | --- | --- |
| guarantee | 尝试强转数字并返回，如结果为`NaN`或`Infinite`，返回`0` | 返回`0` |
| mock | 随机生成一个`0-10`之间的整数 | 返回`0` |


```javascript
const num = new IPA(Number);

num.guarantee('123'); // 123
num.guarantee('123', true, true); // 0
num.mock(); // 4 (随机值)
num.mock({}, true); // 0
```

#### 数字默认值

用 _一个数字_ 声明一个具有默认值的数字类型。

在guarantee类型不符以及mock时，按如下规则返回：


| 方法 | 一般模式/开发环境 | 严格模式/生产环境 |
| ------------ | ------------ | ------------ |
| guarantee | 返回默认值 | 返回默认值 |
| mock | 随机生成一个`0-10`之间的整数 | 返回默认值 |

```javascript
const num = new IPA(-1);

num.guarantee('123'); // -1
num.guarantee('123', true, true); // -1
num.mock(); // 8 (随机值)
num.mock({}, true); // -1
```


### 字符串
#### String

用`String`声明一个字符串类型。

guarantee在数据类型不符以及mock时，按如下规则返回：

方法 | 一般模式/开发环境 | 严格模式/生产环境
--- | --- | ---
guarantee | 尝试强转字符串并返回 | 返回`''`
mock | 随机生成一个字符串 | 返回`''`


```javascript
const str = new IPA(String);

str.guarantee(123); // '123'
str.guarantee(123, true, true); // ''
str.mock(); // 'ad' (随机值)
str.mock({}, true); // ''
```

#### 字符串默认值

用 _一个字符串_ 声明一个具有默认值的字符串类型。

在guarantee类型不符以及mock时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |
| --- | --- | --- |
| guarantee | 返回默认值 | 返回默认值 |
| mock | 随机生成一个字符串 | 返回默认值 |

```javascript
const str = new IPA('--');

str.guarantee(123); // '--'
str.guarantee(123, true, true); // '--'
str.mock(); // 'ad' (随机值)
str.mock({}, true); // '--'
```

### 布尔
#### Boolean

用`Boolean`声明一个布尔类型。

guarantee在数据类型不符以及mock时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |
| --- | --- | --- |
| guarantee | 强转布尔 | 返回`false` |
| mock | 随机产生`true`或`false` | 返回`false` |

```javascript
const bool = new IPA(Boolean);

bool.guarantee(123); // true
bool.guarantee(123, true, true); // false
bool.mock(); // true (随机值)
bool.mock({}, true); // false
```

#### 布尔默认值

用 _一个布尔值_ 声明一个具有默认值的布尔类型。

在guarantee类型不符以及mock时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |
| --- | --- | --- |
| guarantee | 返回默认值 | 返回默认值 |
| mock | 随机产生`true`或`false` | 返回默认值 |

```javascript
const bool = new IPA(true);

bool.guarantee(123); // true
bool.guarantee(123, true, true); // true
bool.mock(); // false (随机值)
bool.mock({}, true); // true
```

### 对象
#### Object

用`Object`生明一个对象类型，即PlainObject。

在guarantee方法下数据不是PlainObject时，或mock方法下，无论模式环境，一律返回一个空对象：

```javascript
const obj = new IPA(Object);

obj.check([]); // false
obj.guarantee(123); // {}
obj.guarantee(123, true, true); // {}
obj.mock(); // {}
obj.mock({}, true); // {}
```

#### 对象属性校验

用一个普通对象嵌套声明对对象属性的要求。check方法只在属性全部合法时返回`true`，guarantee和mock方法都对每个属性迭代执行校验。没有声明结构的属性将不受影响。

```javascript
const obj = new IPA({ name: String, value: -1 });

obj.check({ name: 123, value: 10 }); // false
obj.guarantee({ name: 123, value: 10 }); // { name: '123', value: 10 }
obj.guarantee({ name: 123, value: 10 }, true, true); // { name: '', value: 10 }
obj.mock(); // { name: 'quot', value: 8 } (随机值)
obj.mock({}, true); // { name: '', value: -1 }
```

### 数组
#### Array

用`Array`生明一个数组类型。

在guarantee方法下数据不是数组和mock方法下，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |
| --- | --- | --- |
| guarantee | 尝试强转数组并返回 | 返回`[]` |
| mock | 返回`[]` | 返回`[]` |


```javascript
const arr = new IPA(Array);

arr.check({}); // false
arr.guarantee(123); // ['1', '2', '3']
arr.guarantee(123, true, true); // []
arr.mock(); // []
arr.mock({}, true); // []
```

#### 通项校验

通过一个数组级其**首项**声明对数组的每一项的数据要求。
check方法逐一检查输入数组的每一项（如果是数组的话），在全部合法时返回`true`。
guarantee方法在输入数据不是数组时返回`[]`，否则逐一对输入数组的每一项执行相应模式下的guarantee方法
mock方法在开发环境下生成随机长度的合法数组，在生产环境下返回空数组

```javascript
const arr = new IPA([Number]);

arr.check(['1', 2]); // false
arr.guarantee(['1', 2]); // [1, 2]
arr.guarantee(['1', 2], true, true); // [0, 2]
arr.mock(); // [3, 1, 5, 8] (随机值)
arr.mock({}, true); // []
```

#### 长度校验

通过一个数组的**第二项**声明对数组的长度要求。长度参数可以是一个字符串也可以是一个非负整数。后者将声明一个具有固定长度的数组校验规则，前者将表明一种长度相等的关系。长度的check、guarantee和mock都将在对数据的其他校验都执行完后进行。

```javascript
const fixed = new IPA([undefined, 3]);
fixed.check(['', 1, true]); // true

const square = new IPA([[Number, 'size'], 'size']);
square.check([[1, 2], [3, 4], [5, 6]]); // false
```

在面对具有同一个长度参数的数组的长度不一致时，guarantee方法将根据当前实例的策略来进行合法化。IPA支持如下的四种策略：

1. shortest（默认）: 取具有同一长度参数的最短的数组的长度作为目标长度
1. longest：取具有同一长度参数的最长的数组的长度作为目标长度
1. average：取具有统一长度参数的平均长度（向上取整）作为目标长度
1. most：取具有统一长度参数的长度众数作为目标长度

对长度不足的数组，对数组通项的guarantee方法输入`undefined`来获得合法的增添项。

```javascript
const tbody = new IPA([[Number, 'cols'], 'rows']);
const data = [
    [1, 2, 3],
    [1, 2, 3],
    [1, 2],
    [1, 2, 3, 4]
];

tbody.strategy = 'shortest'; // 默认值
tbody.guarantee(data); // [[1, 2], [1, 2], [1, 2], [1, 2]]

tbody.strategy = 'longest';
tbody.guarantee(data); // [[1, 2, 3, 0], [1, 2, 3, 0], [1, 2, 0, 0], [1, 2, 3, 4]]

tbody.strategy = 'average';
tbody.guarantee(data); // [[1, 2, 3], [1, 2, 3], [1, 2, 0], [1, 2, 3]]

tbody.strategy = 'most';
tbody.guarantee(data); // [[1, 2, 3], [1, 2, 3], [1, 2, 0], [1, 2, 3]]
```

mock方法优先根据输入的setting对象来对长度参数进行赋值，对未赋值的长度参数，在开发环境下进行随机赋值，在生产环境下赋为`0`。然后逐一根据通项的规则mock每一项。需要注意的是在使用IPA嵌套语法时，被嵌套的实例的长度参数也会污染到当前实例中，在使用中需要格外注意。

```javascript
const table = new IPA({
    thead: [String, 'cols'],
    tbody, // tbody中的长度参数cols和rows也会在当前实例起作用
});

table.mock({ cols: 2, rows: 3 });
//  {
//      thead: ['et', 'ad'],
//      tbody: [[5, 2], [7, 1], [3, 4]],
//  }

table.mock({}, true);  //  { thead: [], body: [] }
```

### 函数

通过声明`Function`来要求指定字段必须是函数（方法）。

``` javascript
const func = new IPA(Function);

func.check(() => console.log('test')); // true
func.guarantee(undefined); // () => {}
func.mock(); // () => {}
```



### 可缺省

通过在字段名后加上`?`来表示可缺省（可为`null`或`undefined`）的字段。

``` js
const obj = new IPA({
    requiredProp: Number,
    'unrequiredProp?': Number,
});

obj.check({
    requiredProp: 12,
    unrequiredProp: null,
}); // true
```



通过`\?`来表示必填的带问号的字段。

``` js
const obj = new IPA({
    'stillRequiredProp\\?': Number, 
});

obj.check({
    'stillRequiredProp?': 12,
}); // true
```



### 旁通规则

#### null

通过声明`null`来要求数据不能是`undefined`。在guarantee遇到`undefined`的时候返回`null`。mock直接返回`null`。

```javascript
const required = new IPA(null);

required.check(undefined); // false
required.guarantee(undefined); // null
required.mock(); // null
```

#### undefined

通过声明`undefined`获得一个真正意义上的旁通规则*bypass*，规则如下：

```javascript
const bypass = {
    check: () => true,
    guarantee: v => v,
    mock: () => undefined,
};
```

### 实例嵌套
IPA允许在规则声明中嵌套使用IPA实例，其本质与直接正常的声明语法没有区别。即：

```javascript
const sub = new IPA([Number, 'cols']);
const schema = new IPA([sub, 'rows']);
```

与

```javascript
const sub = new IPA([Number, 'cols']);
const schema = new IPA([[Number, 'cols'], 'rows']);
```

在行为上完全一致。

在需要复用一部分声明时，建议使用前者的做法，可以一定程度减少IPA重复编译声明。

需要注意的是在使用IPA嵌套语法时，被嵌套的实例的长度参数也会污染到当前实例中，在使用中需要格外注意。



### 自定义校验

#### 规则函数

为了方便理解自定义规则的写法，这里首先要介绍一下IPA嵌套规则校验的实现细节。

在IPA中，所有的**规则声明语法**最终都会被转换成具有统一结构的**规则函数**，然后通过传入一个IPA上下文对象（IPAContext）来作为参数得到一个可以直接执行check、guarantee和mock方法的**规则对象**。最后为其封装一层实例层面的接口来实现对这三个方法的间接访问。



`IPAContext`对象包含了一系列产生规则对象可能需要的工具，包括编译函数`compile`，错误捕获器`catcher`，缓存`cache`。



如下的**规则声明**经过编译，会得到具有下图所示结构的**IPA实例**：

```javascript
{
    id: IPA.or(Number, String),
    name: String,
    value: Number,
    type: IPA.Range(1, 4),
    data: [{
        name: String,
        value: 0,
        amount: IPA.Integer,
    }],
}
```

![image](/ipa-document/static/mach.svg)

下面的伪代码以一个简化了的数组通项校验的**规则函数**为例，说明规则函数的结构和编译细节，其中template为规则声明：

```javascript
function arraySimple ({ compile }) { // 传入编译函数
    // 编译阶段执行的代码，通常用于递归编译子模板，形成闭包
    const subRule = compile(template[0]); // 取首项作为子声明，并编译成规则对象
    // 返回具有check，guarantee和mock方法的规则对象
    return {
        check(data) { // 参数：输入数据
            // check的实现
            return isArray(data) && data.every(i => subRule.check(i));
        },
        guarantee(data, strict) { // 参数一：输入数据；参数二：是否严格模式
            // guarantee的实现
            const arr = isArray(val) ? data : [];
            arr.forEach(i => subRule.guarantee(i, strict));
            return arr;
        },
        mock(prod) { // 参数：是否是生产环境
            // mock的实现
            return [];
        },
    };
}
```



#### 自定义规则函数

自定义规则只需遵循上述**规则函数**的结构，提供到**规则声明**中即可。如下示例了一个约定的HTTP响应数据的基本结构，以及针对不同响应类型的扩展结构：

```javascript
const Res = (subtemplate = Object) => {
    return ({ compile }) => {
        return compile({
            code: Number,
            msg: String,
            data: subtemplate,
        });
    };
};

const dataSchema1 = new IPA(Res(String));
const dataSchema2 = new IPA(Res({
    name: String,
    value: Number,
}));
```

不过自定义规则允许更为宽松的语法，不强制要求**规则函数**返回所有的三种方法，对没有返回的方法，IPA会自动为它增添`undefined`声明下的[旁通规则](#/doc#校验规则声明-旁通规则)：

比如下面自定义的**与规则**，只定义了`check`方法的执行规则：

```javascript
function and (...templates) {
    return ({ compile }) => {
        const rules = templates.map(template => compile(template));
        return {
            check(val) {
                return rules.every(rule => rule.check(val) === false);
            } 
        }
    }
}；
```



## 三、扩展规则

为了适应更多的数据校验场景，IPA还内建了一些扩展规则。本质上，这是一系列由IPA本身提供的自定义方法，可通过`IPA[<方法名>]`来获得。

### 整型：Integer

整型的校验规则与`Number`非常相似

在它的guarantee方法在的输入数据不是整型，和调用mock方法时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |
| --- | --- | --- |
| guarantee | 尝试强转整数并返回 | 返回`0` |
| mock | 随机生成一个`0-10`之间的整数 | 返回`0` |


```javascript
const { Integer } = IPA;
const int = new IPA(Integer);

num.guarantee('123.4'); // 123
num.guarantee(123.4, true, true); // 0
num.mock(); // 4 (随机值)
num.mock({}, true); // 0
```



### 数值范围：Range

Range函数用来生成一个数字范围的校验规则。它接受三个参数：`Range(min:number, max:number [, isFloat:boolean = false ]);`
前两个参数min和max分别用来界定范围的最小和最大值（范围为闭区间），第三个参数isFloat用来改变mock行为，控制它是否生成浮点数，但它**不影响**check和guarantee的行为。

在它的guarantee方法在的输入数据不在范围中时，和调用mock方法时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |
| --- | --- | --- |
| guarantee | 非数字先转数字，过小返回`min`，过大返回`max` | 非数字先转`0`，过小返回`min`，过大返回`max` |
| mock | 根据`isFloat`随机生成一个范围内的整数或浮点数 | 返回`min` |

```javascript
const { Range } = IPA;
const range = new IPA(Range(100, 110));

range.check(90); // false
range.check(105.5); // true
range.guarantee('105'); // 105
range.guarantee('105', true, true); // 100
range.mock(); // 107 (随机值)
range.mock({}, true); // 100

const percentage = new IPA(Range(0, 1, true));
percentage.mock(); // 0.13 (随机值)

percentage.mock({}, true); // 0
```



### 枚举：From

当要求数据必须来自一个特定的有限的集合时，采用From规则。From规则接受任意多个参数组成集合。只要被校验的数据与集合中的某一值相等（对于对象，采用深度比较，只要两个对象的每个属性都一致即认为相等），check方法就返回`true`。

在它的guarantee方法在的输入数据不与集合中的任何项目相同时，以及调用mock方法时，按如下规则返回：

| 方法 |一般模式/开发环境 | 严格模式/生产环境 |
| --- | --- | --- |
| guarantee | 返回集合任意值的深拷贝 | 返回集合内首个声明的值 |
| mock | 返回集合任意值的深拷贝 | 返回集合内首个声明的值 |

```javascript
const codes = new Set([{
    label: 'OK',
    value: 200,
}, {
    label: 'Not Modified',
    value: 300,
}, {
    label: 'Client Error',
    value: 400,
}, {
    label: 'Server Error',
    value: 500,
}]);

const { From } = IPA;
const codeSchema = new IPA(From(...codes));
codeSchema.check({ label: 'OK', value: 200 }); // true
codeSchema.guarantee(null); // { label: 'Client Error', value: 300 } （随机值）
codeSchema.guarantee(null, true, true); // { label: 'OK', value: 200 } （首项）
codeSchema.mock(null); // { label: 'Server Error', value: 500 } （随机值）
codeSchema.mock({}, true); // { label: 'OK', value: 200 } （首项）
```



### 字典：Dict

Dict函数声明一种类似Python中Dict的概念的对象，要求改对象的每个值具有特定的数据结构。它的输入参数即用于声明这种结构：
check方法只在所有属性合法时返回`true`，guarantee方法遍历所有存在的属性，mock方法在开发环境下返回一个具有随机属性名和属性个数的合法对象，在生产环境下返回一个空对象。

```javascript
const { Dict } = IPA;
const strDict = new IPA(Dict(String));

strDict.check({ a: 'a', b: 'b' }); // true
strDict.guarantee({ b: 123, c: 'c' }); // { b: '123', c: 'c' }
strDict.guarantee({ b: 123, c: 'c' }, true, true); // { b: '', c: 'c' }
strDict.mock(); // { 'cillum': 'quis', 'et': 'magna'}（随机值）
strDict.mock({}, true); // {}
```



### 数组逐项校验：Each

数组逐项规则逐项校验一个数组的每一项，用于数组的每项的数据类型不一致的情况下。它接受两个输入参数：`Each(template:array [, strictLength:boolean = true])`。第一个参数为数组的逐项规则声明，第二个参数为一个布尔值，表明是否对数组的长度进行严格要求，默认值为`true`。

```javascript
const { Each } = IPA;
const each = new IPA(Each([Number, String]));
const firsts = new IPA(Each([Number, String], false));

each.check([1, '1']); // true
each.check([1, '1', 2]); // false
firsts.check([1, '1', 2]); // true
each.guarantee(['1', 1, 2]); // [1, '1']
firsts.guarantee(['1', 1, 2]); // ['1', 1, 2]
each.guarantee(['1', 1, 2], true, true); // [0, '']
firsts.guarantee(['1', 1, 2], true, true); // [0, '', 2]
each.mock(); // [4, 'ad']（随机值）
each.mock({}, true); // [0, '']
```



### 递归结构：recurse

由于预编译的特性，IPA不能直接接受包含循环引用的对象作为数据结构声明。可以通过`IPA.recurse`来表示一个具有任意深度的树状递归结构：

``` js
const tree = new IPA(IPA.recurse([{
    value: Number,
    children: '$$'
}]));
```

递归结构的第二个参数是递归的配置项，结构如下:

``` ts
{
    marker: string = '$$'; // 递归字段的标记
    border: any = IPA.From(null); // 边界的声明，默认取null
    condition: any => boolean; // 对边界情况的判定。
}
```

上述较复杂的是`condition`函数。在IPA对`recurse`结构进行`guarantee`并遇到既不符合递归结构声明结构也不符合边界声明的数据时就无法判断应该是向边界进行转换还是按照递归结构进行转换，此时IPA会将数据传给`condition`函数来进行判断，返回`true`表示向边界进行转换。

对于`condition`字段缺省的情况，`IPA`可以通过对模板收敛性的考量自己决定用什么`condition`函数并能满足绝大部分使用场景。



### 或规则：or

或规则允许数据符合多条规则。check方法在符合任意一条规则时即返回`true`，guarantee和mock方法都服从输入的第一条规则。

```javascript
const { or } = IPA;
const numOrStr = new IPA(or(Number, String));

numOrStr.check(1); // true
numOrStr.check('a'); // true
numOrStr.guarantee(null); // 0
numOrStr.mock(); // 7（随机值）
```



### 类校验：asClass

类校验用于标示把输入的函数当成一个类来进行校验。第一个参数为类构造函数，后面的参数为默认输入到这个构造函数的参数。在guarantee输入数据不是该类的实例或mock时，一律返回由默认值构造的实例。

```javascript
class Person {
    constructor(fn, ln) {
        this.fn = fn;
        this.ln = ln;
    }
}

const { asClass } = IPA;
const p1 = new Person('John', 'Doe');
const p2 = { fn: 'Pierre', ln: 'Jacques' };

const personSchema = new IPA(asClass(Person, 'John', 'Doe'));
personSchema.check(p1); // true
personSchema.check(p2); // false
personSchema.guarantee(p2); // Person{fn:'John',ln:'Doe'}
personSchema.mock(); // Person{fn:'John',ln:'Doe'}
```



### 组合校验器：assemble

assemble用于组合几个校验模板的方法，生成新的模版：

``` typescript
assemble(checkProvider : IPATemplate, guaranteeProvider : IPATemplate, mockProvider : IPATemplate) : IPATemplate`
```

在一些场景中，我们希望快速组合几不同的IPA校验器的check，guarantee和mock方法，比如我们希望一个校验器具有String和Number的check方法，但是使用Integer的guarantee和mock方法（即赋予它一定的数据转换能力），那么可以如下创建校验器：

``` javascript
const { Integer, or, assemble } = IPA;

const intTransfer = new IPA(assemble(
    or(String, Integer),
    Integer,
    Integer,
));

intTransfer.check('1'); // true
intTransfer.check(1.2); // true
intTransfer.guarantee('1'); // 1
intTransfer.guarantee(1.2); // 1
intTransfer.mock(); // 5 (随机整数)
```



## 四、应用示例

IPA适用于需要与外部发生数据交换的使用场景，对于内部数据交换的数据校验，建议使用Typescript等编译时解决方案，使用IPA可能会造成无谓的运行时性能浪费。

### 作为Ajax拦截器使用（以axios为例）

``` js
import IPA, { recurse } from 'ipa.js';

// 校验器设置
const validators = {
    'api/menu/list': recurse([{
        name: String,
        path: String,
        children: '$$',
    }]),
    'api/menu/detail': {
        name: String,
        path: String,
        table: {
            thead: [String, 'cols'],
            tbody: [[Number, 'cols']],
        },
        'isEditable?': Boolean,  
    },
};

// 创建实例和设置报错钩子
Object.entries(validators).forEach(([url, template]) => {
    validators[url] = new IPA(template).onError((err) => {
        console.warn(`IPA Exception @${url}`, err);
        err.stopPropagation();
    });
});

// 拦截设置
axios.interceptors.response.use((res) => {
    const validator = validators.get(res.config.url); // 根据url查询IPA校验器
    if (validator) {
        res.data = validator.guarantee(res.data); // 保障数据
    }
    return res;
});
```


### 在Promise回调中进行mock

若另一端接口还在开发阶段，可以在Promise的reject回调中使用：

```javascript
IPA.isProductionEnv = process.env === 'production';

// ...

somePromise.then(res => {
    this.data = dataSchema.guarantee(res.data); // 或用check
    // 其他操作
}, err => {
    this.data = dataSchema.mock();
    // 其他报错处理
});

// ...
```

通过配值`IPA.isProductionEnv`来全局配置当前的运行环境。`true`表示在生产环境，`false`表示在开发环境（默认为`false`）从而实现代码无删改上线。对设置了第二个参数的`mock`调用，全局配置不起作用。

```javascript
const arr = new IPA([Number, 'len']);
arr.mock(); // [7, 1, 5, 8, 3]（随机值）
arr.mock({ len: 3 }); // [4, 6, 8]（给定长度）

IPA.isProductionEnv = true; // 通过webpack等配置

arr.mock(); // []
arr.mock({ len: 3 }); // [0, 0, 0]
```



### 实例的全局注入与调用

通过IPA.inject方法来全局注入一个实例，第一个参数表示注入实例的键名，第二个参数为规则声明：

```javascript
const { or, Integer } = IPA;
IPA.inject('id', or(Integer, String));
```

通过getInstance方法来获得一个全局实例。该方法返回一个行为与IPA实例完全一致的代理 *Proxy*，该代理在被首次调用时，才会去尝试获取真正的IPA实例。所以使用时不必担心模块的加载顺序导致的无法获取实例的问题，只需要保证首次调用的时候实例已被注入即可：

```javascript
// a.js，先被执行
import IPA from 'ipa.js';
export default IPA.getInstance('numOrStr');

// b.js，后被执行
import IPA from 'ipa.js';
const { or, Integer } = IPA;

IPA.inject('numOrStr', or(Integer, String))

// index.js, 主模块
import numOrStr from './a';
import './b';

Ajax.get(url).then(
    res => {
        numOrStr.check(res.data); // 调用在注入之后即可
    }
);

```

IPA的一个重要的使用场景是在端对端项目中用于校验和保障来自另一端的数据。IPA的全局注入功能使得对API接口数据结构的“集中声明分散调用”和“分散声明集中调用”的使用方式更简便。

```javascript
// API.js
import IPA from 'ipa.js';

IPA.inject('/api/getList', [Number]);
IPA.inject('/api/getDetail', {
    name: String,
    value: Number,
});


// index.js
import IPA from 'IPA';
import Ajax from 'ajax'; // 某个异步请求库

const url = '/api/getList';
Ajax.get(url).then(
    res => {
        this.data = IPA.getInstance(url).guarantee(res.data);
    }
);
```
