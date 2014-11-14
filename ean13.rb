#!/usr/bin/ruby
#
#  _______   ________  ________     _____  ________      ________  ________     
# |\  ___ \ |\   __  \|\   ___  \  / __  \|\_____  \    |\   __  \|\   __  \    
# \ \   __/|\ \  \|\  \ \  \\ \  \|\/_|\  \|____|\ /_   \ \  \|\  \ \  \|\ /_   
#  \ \  \_|/_\ \   __  \ \  \\ \  \|/ \ \  \    \|\  \   \ \   _  _\ \   __  \  
#   \ \  \_|\ \ \  \ \  \ \  \\ \  \   \ \  \  __\_\  \ __\ \  \\  \\ \  \|\  \ 
#    \ \_______\ \__\ \__\ \__\\ \__\   \ \__\|\_______\\__\ \__\\ _\\ \_______\
#     \|_______|\|__|\|__|\|__| \|__|    \|__|\|_______\|__|\|__|\|__|\|_______|
#
#
# @version      0.1.6
# @author       James Liu http://jamesliu.info @jamesliu96 <j@jamesliu.info>
# @copyright    2014 James Liu
# @license      MIT License
#
# @overview
# EAN13 Code Generator v0.1.6
# github.com/jamesliu96/ean13
#
# By James Liu @jamesliu96
# Copyright (C) 2014 James Liu
#
# Initialize by total 12 digits:
# ```
# require "ean13"
# include BC
# ean13 = EAN13.new "690123456789"
# ```
#
# The code and binary code are generated automatically:
# ```
# ean13 = {
#     code => "6901234567892",
#     bincode => "10100010110100111011001100110110111101010001101010100111010100001000100100100011101001101100101"
# }
# ```
#
# And can be accessed by `ean13.code` and `ean13.bincode`
#
# "As far as the laws of mathematics refer to reality, they are not certain."
# "As far as they are certain, they do not refer to reality."
#                                                          -- Albert Einstein

module BC
    class EAN13
        attr_reader :code
        attr_reader :bincode
        def initialize code = "690123456789"
            @code = code
            @bincode = toBin
        end
        def toBin
            isEAN13? {processCode}
        end
        private
        def isEAN13?
            yield if @code.length == 12
        end
        def getCheck
            odd, even = 0, 0
            for i in 0..11
                i % 2 == 0 ? odd += @code[i].to_i : even += @code[i].to_i
            end
            ((10 - (odd + even * 3) % 10) % 10).to_s
        end
        def processCode
            @code += getCheck
            bin, ending, separator = "101", "101", "01010"
            charset = {
                0 => [0, 0, 0, 0, 0, 0],
                1 => [0, 0, 1, 0, 1, 1],
                2 => [0, 0, 1, 1, 0, 1],
                3 => [0, 0, 1, 1, 1, 0],
                4 => [0, 1, 0, 0, 1, 1],
                5 => [0, 1, 1, 0, 0, 1],
                6 => [0, 1, 1, 1, 0, 0],
                7 => [0, 1, 0, 1, 0, 1],
                8 => [0, 1, 0, 1, 1, 0],
                9 => [0, 1, 1, 0, 1, 0]
            }
            map = {
                0 => ["0001101", "0100111", "1110010"],
                1 => ["0011001", "0110011", "1100110"],
                2 => ["0010011", "0011011", "1101100"],
                3 => ["0111101", "0100001", "1000010"],
                4 => ["0100011", "0011101", "1011100"],
                5 => ["0110001", "0111001", "1001110"],
                6 => ["0101111", "0000101", "1010000"],
                7 => ["0111011", "0010001", "1000100"],
                8 => ["0110111", "0001001", "1001000"],
                9 => ["0001011", "0010111", "1110100"]
            }
            prefix = @code.slice 0, 1
            left = @code.slice 1, 7
            right = @code.slice 7, 13
            set = charset[prefix.to_i]
            for i in 0..5
                bin += map[left[i].to_i][set[i]]
            end
            bin += separator
            for j in 0..5
                bin += map[right[j].to_i][2]
            end
            bin += ending
            bin.to_s
        end
    end
end
