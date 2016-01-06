define(["require", "exports"], function (require, exports) {
    /**
     *  Class contains the keycodes for keys on your keyboard.
     *
     * @module Temple
     * @namespace temple.utils.keys
     * @class KeyCode
     */
    var KeyCode = (function () {
        function KeyCode() {
        }
        /**
         * @static
         * @property TAB
         * @type number
         * @default 9
         */
        KeyCode.TAB = 9;
        /**
         * @static
         * @property CAPS_LOCK
         * @type number
         * @default 20
         */
        KeyCode.CAPS_LOCK = 20;
        /**
         * @static
         * @property SHIFT
         * @type number
         * @default 16
         */
        KeyCode.SHIFT = 16;
        /**
         * @static
         * @property CONTROL
         * @type number
         * @default 17
         */
        KeyCode.CONTROL = 17;
        /**
         * @static
         * @property SPACE
         * @type number
         * @default 32
         */
        KeyCode.SPACE = 32;
        /**
         * @static
         * @property DOWN
         * @type number
         * @default 40
         */
        KeyCode.DOWN = 40;
        /**
         * @static
         * @property UP
         * @type number
         * @default 38
         */
        KeyCode.UP = 38;
        /**
         * @static
         * @property LEFT
         * @type number
         * @default 37
         */
        KeyCode.LEFT = 37;
        /**
         * @static
         * @property RIGHT
         * @type number
         * @default 39
         */
        KeyCode.RIGHT = 39;
        /**
         * @static
         * @property ESCAPE
         * @type number
         * @default 27
         */
        KeyCode.ESCAPE = 27;
        /**
         * @static
         * @property F1
         * @type number
         * @default 112
         */
        KeyCode.F1 = 112;
        /**
         * @static
         * @property F2
         * @type number
         * @default 113
         */
        KeyCode.F2 = 113;
        /**
         * @static
         * @property F3
         * @type number
         * @default 114
         */
        KeyCode.F3 = 114;
        /**
         * @static
         * @property F4
         * @type number
         * @default 115
         */
        KeyCode.F4 = 115;
        /**
         * @static
         * @property F5
         * @type number
         * @default 116
         */
        KeyCode.F5 = 116;
        /**
         * @static
         * @property F6
         * @type number
         * @default 117
         */
        KeyCode.F6 = 117;
        /**
         * @static
         * @property F7
         * @type number
         * @default 118
         */
        KeyCode.F7 = 118;
        /**
         * @static
         * @property F8
         * @type number
         * @default 119
         */
        KeyCode.F8 = 119;
        /**
         * @static
         * @property F9
         * @type number
         * @default 120
         */
        KeyCode.F9 = 120;
        /**
         * @static
         * @property F10
         * @type number
         * @default 121
         */
        KeyCode.F10 = 121;
        /**
         * @static
         * @property F11
         * @type number
         * @default 122
         */
        KeyCode.F11 = 122;
        /**
         * @static
         * @property F12
         * @type number
         * @default 123
         */
        KeyCode.F12 = 123;
        /**
         * @static
         * @property INSERT
         * @type number
         * @default 45
         */
        KeyCode.INSERT = 45;
        /**
         * @static
         * @property HOME
         * @type number
         * @default 36
         */
        KeyCode.HOME = 36;
        /**
         * @static
         * @property PAGE_UP
         * @type number
         * @default 33
         */
        KeyCode.PAGE_UP = 33;
        /**
         * @static
         * @property PAGE_DOWN
         * @type number
         * @default 34
         */
        KeyCode.PAGE_DOWN = 34;
        /**
         * @static
         * @property DELETE
         * @type number
         * @default 46
         */
        KeyCode.DELETE = 46;
        /**
         * @static
         * @property END
         * @type number
         * @default 35
         */
        KeyCode.END = 35;
        /**
         * @static
         * @property ENTER
         * @type number
         * @default 13
         */
        KeyCode.ENTER = 13;
        /**
         * @static
         * @property BACKSPACE
         * @type number
         * @default 8
         */
        KeyCode.BACKSPACE = 8;
        /**
         * @static
         * @property NUMPAD_0
         * @type number
         * @default 96
         */
        KeyCode.NUMPAD_0 = 96;
        /**
         * @static
         * @property NUMPAD_1
         * @type number
         * @default 97
         */
        KeyCode.NUMPAD_1 = 97;
        /**
         * @static
         * @property NUMPAD_2
         * @type number
         * @default 98
         */
        KeyCode.NUMPAD_2 = 98;
        /**
         * @static
         * @property NUMPAD_3
         * @type number
         * @default 99
         */
        KeyCode.NUMPAD_3 = 99;
        /**
         * @static
         * @property NUMPAD_4
         * @type number
         * @default 100
         */
        KeyCode.NUMPAD_4 = 100;
        /**
         * @static
         * @property NUMPAD_5
         * @type number
         * @default 101
         */
        KeyCode.NUMPAD_5 = 101;
        /**
         * @static
         * @property NUMPAD_6
         * @type number
         * @default 102
         */
        KeyCode.NUMPAD_6 = 102;
        /**
         * @static
         * @property NUMPAD_7
         * @type number
         * @default 103
         */
        KeyCode.NUMPAD_7 = 103;
        /**
         * @static
         * @property NUMPAD_8
         * @type number
         * @default 104
         */
        KeyCode.NUMPAD_8 = 104;
        /**
         * @static
         * @property NUMPAD_9
         * @type number
         * @default 105
         */
        KeyCode.NUMPAD_9 = 105;
        /**
         * @static
         * @property NUMPAD_DIVIDE
         * @type number
         * @default 111
         */
        KeyCode.NUMPAD_DIVIDE = 111;
        /**
         * @static
         * @property NUMPAD_ADD
         * @type number
         * @default 107
         */
        KeyCode.NUMPAD_ADD = 107;
        /**
         * @static
         * @property NUMPAD_ENTER
         * @type number
         * @default 13
         */
        KeyCode.NUMPAD_ENTER = 13;
        /**
         * @static
         * @property NUMPAD_DECIMAL
         * @type number
         * @default 110
         */
        KeyCode.NUMPAD_DECIMAL = 110;
        /**
         * @static
         * @property NUMPAD_SUBTRACT
         * @type number
         * @default 109
         */
        KeyCode.NUMPAD_SUBTRACT = 109;
        /**
         * @static
         * @property NUMPAD_MULTIPLY
         * @type number
         * @default 106
         */
        KeyCode.NUMPAD_MULTIPLY = 106;
        /**
         * @static
         * @property SEMICOLON
         * @type number
         * @default 186
         */
        KeyCode.SEMICOLON = 186;
        /**
         * @static
         * @property EQUAL
         * @type number
         * @default 187
         */
        KeyCode.EQUAL = 187;
        /**
         * @static
         * @property COMMA
         * @type number
         * @default 188
         */
        KeyCode.COMMA = 188;
        /**
         * @static
         * @property MINUS
         * @type number
         * @default 189
         */
        KeyCode.MINUS = 189;
        /**
         * @static
         * @property PERIOD
         * @type number
         * @default 190
         */
        KeyCode.PERIOD = 190;
        /**
         * @static
         * @property SLASH
         * @type number
         * @default 191
         */
        KeyCode.SLASH = 191;
        /**
         * @static
         * @property BACKQUOTE
         * @type number
         * @default 192
         */
        KeyCode.BACKQUOTE = 192;
        /**
         * @static
         * @property LEFTBRACKET
         * @type number
         * @default 219
         */
        KeyCode.LEFTBRACKET = 219;
        /**
         * @static
         * @property BACKSLASH
         * @type number
         * @default 220
         */
        KeyCode.BACKSLASH = 220;
        /**
         * @static
         * @property RIGHTBRACKET
         * @type number
         * @default 221
         */
        KeyCode.RIGHTBRACKET = 221;
        /**
         * @static
         * @property QUOTE
         * @type number
         * @default 222
         */
        KeyCode.QUOTE = 222;
        /**
         * @static
         * @property ALT
         * @type number
         * @default 18
         */
        KeyCode.ALT = 18;
        /**
         * @static
         * @property COMMAND
         * @type number
         * @default 15
         */
        KeyCode.COMMAND = 15;
        /**
         * @static
         * @property NUMPAD
         * @type number
         * @default 21
         */
        KeyCode.NUMPAD = 21;
        /**
         * @static
         * @property A
         * @type number
         * @default 65
         */
        KeyCode.A = 65;
        /**
         * @static
         * @property B
         * @type number
         * @default 66
         */
        KeyCode.B = 66;
        /**
         * @static
         * @property C
         * @type number
         * @default 67
         */
        KeyCode.C = 67;
        /**
         * @static
         * @property D
         * @type number
         * @default 68
         */
        KeyCode.D = 68;
        /**
         * @static
         * @property E
         * @type number
         * @default 69
         */
        KeyCode.E = 69;
        /**
         * @static
         * @property F
         * @type number
         * @default 70
         */
        KeyCode.F = 70;
        /**
         * @static
         * @property G
         * @type number
         * @default 71
         */
        KeyCode.G = 71;
        /**
         * @static
         * @property H
         * @type number
         * @default 72
         */
        KeyCode.H = 72;
        /**
         * @static
         * @property I
         * @type number
         * @default 73
         */
        KeyCode.I = 73;
        /**
         * @static
         * @property J
         * @type number
         * @default 74
         */
        KeyCode.J = 74;
        /**
         * @static
         * @property K
         * @type number
         * @default 75
         */
        KeyCode.K = 75;
        /**
         * @static
         * @property L
         * @type number
         * @default 76
         */
        KeyCode.L = 76;
        /**
         * @static
         * @property M
         * @type number
         * @default 77
         */
        KeyCode.M = 77;
        /**
         * @static
         * @property N
         * @type number
         * @default 78
         */
        KeyCode.N = 78;
        /**
         * @static
         * @property O
         * @type number
         * @default 79
         */
        KeyCode.O = 79;
        /**
         * @static
         * @property P
         * @type number
         * @default 80
         */
        KeyCode.P = 80;
        /**
         * @static
         * @property Q
         * @type number
         * @default 81
         */
        KeyCode.Q = 81;
        /**
         * @static
         * @property R
         * @type number
         * @default 82
         */
        KeyCode.R = 82;
        /**
         * @static
         * @property S
         * @type number
         * @default 83
         */
        KeyCode.S = 83;
        /**
         * @static
         * @property T
         * @type number
         * @default 84
         */
        KeyCode.T = 84;
        /**
         * @static
         * @property U
         * @type number
         * @default 85
         */
        KeyCode.U = 85;
        /**
         * @static
         * @property V
         * @type number
         * @default 86
         */
        KeyCode.V = 86;
        /**
         * @static
         * @property W
         * @type number
         * @default 87
         */
        KeyCode.W = 87;
        /**
         * @static
         * @property X
         * @type number
         * @default 88
         */
        KeyCode.X = 88;
        /**
         * @static
         * @property Y
         * @type number
         * @default 89
         */
        KeyCode.Y = 89;
        /**
         * @static
         * @property Z
         * @type number
         * @default 90
         */
        KeyCode.Z = 90;
        /**
         * @static
         * @property NUM_0
         * @type number
         * @default 48
         */
        KeyCode.NUM_0 = 48;
        /**
         * @static
         * @property NUM_1
         * @type number
         * @default 49
         */
        KeyCode.NUM_1 = 49;
        /**
         * @static
         * @property NUM_2
         * @type number
         * @default 50
         */
        KeyCode.NUM_2 = 50;
        /**
         * @static
         * @property NUM_3
         * @type number
         * @default 51
         */
        KeyCode.NUM_3 = 51;
        /**
         * @static
         * @property NUM_4
         * @type number
         * @default 52
         */
        KeyCode.NUM_4 = 52;
        /**
         * @static
         * @property NUM_5
         * @type number
         * @default 53
         */
        KeyCode.NUM_5 = 53;
        /**
         * @static
         * @property NUM_6
         * @type number
         * @default 54
         */
        KeyCode.NUM_6 = 54;
        /**
         * @static
         * @property NUM_7
         * @type number
         * @default 55
         */
        KeyCode.NUM_7 = 55;
        /**
         * @static
         * @property NUM_8
         * @type number
         * @default 56
         */
        KeyCode.NUM_8 = 56;
        /**
         * @static
         * @property NUM_9
         * @type number
         * @default 57
         */
        KeyCode.NUM_9 = 57;
        /**
         * @static
         * @property SUBSTRACT
         * @type number
         * @default 189
         */
        KeyCode.SUBSTRACT = 189;
        /**
         * @static
         * @property ADD
         * @type number
         * @default 187
         */
        KeyCode.ADD = 187;
        return KeyCode;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KeyCode;
});
