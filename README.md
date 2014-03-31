EAN13
======

Introduction
------

JavaScript EAN13 code generator. [DEMO](http://g.jamesliu.info/ean13/)

Use the code
------

- `ean13.js` (main library)

V2EX Post
------

周末闲得没事干，偶然看见了一个包装袋上的条形码，觉得很有意思，之前写过一个PDF417的生成器，大体上原理差不多，这次用JavaScript写了段EAN13条形码的生成器，可以得到二进制码，从而进行Canvas绘图。

代码在这里：https://github.com/jamesliu96/ean13/blob/master/ean13.js

Demo地址：http://g.jamesliu.info/ean13

EAN13是European Article Number 13的缩写，正如其名，它拥有13位数字，是国际上普遍使用的商品标识码。

EAN13码的结构大体上是这样的：

- 前3位：国家码，我国可以使用的是690到699。
- 之后4位：生产商代码，如3943。
- 后5位：产品代码，如03457。

最后一位是生成的校验码，算法如下：

假设前12位是690123456789，遍历将奇数位和偶数位分别求和：
```
1. 奇数位和 = 6 + 0 + 2 + 4 + 6 + 8 = 26
2. 偶数位和 = 9 + 1 + 3 + 5 + 7 + 9 = 34
```
奇数位和和偶数位和的3倍相加，得到总和：
```
总和 = 奇数位和 + 偶数位和 * 3 = 26 + 34 * 3 = 128
```
取总和的个位数：
```
个位 = 总和 % 10 = 8
```
将10与个位相减，得到校验位：
```
校验位 = 10 - 个位 = 2
//注意：如果个位为0，校验位不是10 - 0 = 10而是0
```
我们可以使用判断但是这里有一个更好的算法就是将相减之后的数再除以10取余：
```
校验位 = (10 - 个位) % 10 = 2
```
这样我们就得到了整个EAN13码：`6901234567892`

接下来就是生成二进制的码。

生成二进制码的时候我们将第一位(e.g. 6)看作前置码，来决定使用的码集。

- 索引：
```JavaScript
{
    0: [0, 0, 0, 0, 0, 0],
    1: [0, 0, 1, 0, 1, 1],
    2: [0, 0, 1, 1, 0, 1],
    3: [0, 0, 1, 1, 1, 0],
    4: [0, 1, 0, 0, 1, 1],
    5: [0, 1, 1, 0, 0, 1],
    6: [0, 1, 1, 1, 0, 0],
    7: [0, 1, 0, 1, 0, 1],
    8: [0, 1, 0, 1, 1, 0],
    9: [0, 1, 1, 0, 1, 0]
}
```
- 码集：
```JavaScript
{
    0: ["0001101", "0100111", "1110010"],
    1: ["0011001", "0110011", "1100110"],
    2: ["0010011", "0011011", "1101100"],
    3: ["0111101", "0100001", "1000010"],
    4: ["0100011", "0011101", "1011100"],
    5: ["0110001", "0111001", "1001110"],
    6: ["0101111", "0000101", "1010000"],
    7: ["0111011", "0010001", "1000100"],
    8: ["0110111", "0001001", "1001000"],
    9: ["0001011", "0010111", "1110100"]
}
```

如果前置码是6，我们就用[0, 1, 1, 1, 0, 0]这个码集。

前6位码得到的二进制码就是：`000101101001110110011001101101111010100011`

同样后6位则是：`100111010100001000100100100011101001101100`

前面加上`101`起始符后面加上`101`终止符，前6位和后6位之间加上`01010`分隔符即可。

代码地址： https://github.com/jamesliu96/ean13/blob/master/ean13.js

Demo地址： http://g.jamesliu.info/ean13

欢迎来访 jamesliu96@Github

Copyright (C) 2014 James Liu

http://g.jamesliu.info

欢迎转载，转载请署名。

License
------

[The MIT License](http://james.mit-license.org/) (MIT)

Copyright (c) 2014 James Liu

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
