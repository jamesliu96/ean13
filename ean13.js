/**
* @author       James Liu http://g.jamesliu.info @jamesliu96 <james@jamesliu.info>
* @copyright    2014 James Liu
* @license      {@link http://james.mit-license.org|MIT License}
*
* @overview
* EAN-13 Code Generator v0.1.5
* github.com/jamesliu96/ean13
*
* By James Liu @jamesliu96
* Copyright (C) 2014 James Liu
*
* Initialize by total 12 digits in any form and any number of arguments:
* var article = new EAN13(69, "01", 234, [5, "67"], 8, 9);
*
* The code and binary code are generated automatically:
* article: {
*     code: '6901234567892',
*     bincode: '10100010110100111011001100110110111101010001101010100111010100001000100100100011101001101100101'
* }
* 
* That's it! {@link http://g.jamesliu.info/ean13|DEMO}
*
* "As far as the laws of mathematics refer to reality, they are not certain."
* "As far as they are certain, they do not refer to reality."
*                                                          -- Albert Einstein
*/

var EAN13 = function() {
    if(arguments.length > 0) {
        this.code = "";
        for(var _arg in arguments)
            this.code += this.format(arguments[_arg]);
        if(this.isEAN13(this.code)) {
            this.code += this.check(this.code);
            this.bincode = this.bin(this.code);
        } else {
            delete this.code;
        }
    } else {
        console.error("Initialization error");
    }
    return;
};

EAN13.prototype.format = function(code) {
    return typeof code != "undefined" && code.toString().replace(/\D/g, "");
};

EAN13.prototype.isEAN13 = function(code) {
    code = this.format(code);
    if(!code)
        return console.error("Code unavailable") || false;
    else if(code.length != 12)
        return console.error("Illegal length") || false;
    return true;
};

EAN13.prototype.check = function(code) {
    code = this.format(code);
    var _odd = _even = 0;
    for(var _i = 0; _i <= 11; _i++)
        _i % 2 == 0 ? _odd += parseInt(code[_i]) : _even += parseInt(code[_i]);
    return ((10 - (_odd + _even * 3) % 10) % 10).toString();
};

EAN13.prototype.bin = function(code) {
    code = this.format(code);
    var _prefix = _left = _right = "";
    var _bin = _end = "101";
    var _separator = "01010";
    var _set = [];
    var _charset = {
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
    };
    var _map = {
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
    };
    _prefix = code.slice(0, 1);
    _left = code.slice(1, 7);
    _right = code.slice(7, 13);
    _set = _charset[_prefix];
    for(var _i = 0; _i <= 5; _i++)
        _bin += _map[_left[_i]][_set[_i]];
    _bin += _separator;
    for(var _j = 0; _j <= 5; _j++)
        _bin += _map[_right[_j]][2];
    _bin += _end;
    return _bin.toString();
};

EAN13.prototype.draw = function(id, size) {
    if(this.bincode) {
        size = size && parseInt(size);
        if(id && size) {
            var _canvas = document.createElement("canvas");
            var _ctx = _canvas.getContext("2d")
            _canvas.width = size * 95;
            _canvas.height = size * 50;
            document.getElementById(id.toString()).appendChild(_canvas);
            for(var _y = 0, _r = 0; _r < 50; _r++) {
                for(var _x = 0, _t = 0; _t < 95; _t++) {
                    this.bincode[_t] == 1 && _ctx.fillRect(_x, _y, size, size)
                    _x += size;
                }
                _y += size;
            }
            return;
        } else {
            return console.error("Invalid argument");
        }
    } else {
        return console.error("Code unavailable");
    }
};
