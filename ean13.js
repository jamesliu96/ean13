/*
    EAN-13 Code Generator v0.1.2
    github.com/jamesliu96/ean13
    Copyright (C) 2014 James Liu. http://james.mit-license.org/
    http://g.jamesliu.info/
*/

var EAN13 = function(a, b, c) {
    this.isEAN13 = function(code) {
        code = code.toString().replace(/\D/g, "");
        if(!code) {
            console.error("Code unavailable");
            return false;
        } else if(code.length != 12) {
            console.warn("Illegal length");
            return false;
        } else {
            return true;
        }
    };
    this.check = function(code) {
        code = code.toString().replace(/\D/g, "");
        var _odd = _even = _check = 0;
        for(var _i = 0; _i <= 11; _i++) {
            if(_i % 2 == 0) {
                _odd += parseInt(code[_i]);
            } else {
                _even += parseInt(code[_i]);
            }
        }
        _check = (10 - (_odd + _even * 3) % 10) % 10;
        return _check.toString();
    };
    this.bin = function(code) {
        code = code.toString().replace(/\D/g, "");
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
        for(var _i = 0; _i <= 5; _i++) {
            _bin += _map[_left[_i]][_set[_i]];
        }
        _bin += _separator;
        for(var _j = 0; _j <= 5; _j++) {
            _bin += _map[_right[_j]][2];
        }
        _bin += _end;
        return _bin.toString();
    };
    if(typeof a == "undefined" || typeof b == "undefined" || typeof c == "undefined") {
        this.code = undefined;
        console.error("Initialization error");
    } else {
        this.code = (a.toString() + b.toString() + c.toString()).replace(/\D/g, "");
    }
    if (this.isEAN13(this.code)) {
        this.code += this.check(this.code);
        this.bincode = this.bin(this.code);
    } else {
        this.code = undefined;
    }
};
