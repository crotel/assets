"use strict";
var qrcodegen;
(function (qrcodegen) {
    var QrCode = /** @class */ (function () {
        function QrCode(
            version, 
            errorCorrectionLevel, dataCodewords, 
            mask) {
            this.version = version;
            this.errorCorrectionLevel = errorCorrectionLevel;
            this.mask = mask;
            this.modules = [];
            this.isFunction = [];
            if (version < QrCode.MIN_VERSION || version > QrCode.MAX_VERSION)
                throw "Version value out of range";
            if (mask < -1 || mask > 7)
                throw "Mask value out of range";
            this.size = version * 4 + 17;
            var row = [];
            for (var i = 0; i < this.size; i++)
                row.push(false);
            for (var i = 0; i < this.size; i++) {
                this.modules.push(row.slice());
                this.isFunction.push(row.slice());
            }
            this.drawFunctionPatterns();
            var allCodewords = this.addEccAndInterleave(dataCodewords);
            this.drawCodewords(allCodewords);
            if (mask == -1) {                 
                var minPenalty = 1000000000;
                for (var i = 0; i < 8; i++) {
                    this.applyMask(i);
                    this.drawFormatBits(i);
                    var penalty = this.getPenaltyScore();
                    if (penalty < minPenalty) {
                        mask = i;
                        minPenalty = penalty;
                    }
                    this.applyMask(i);                 }
                }
                if (mask < 0 || mask > 7)
                    throw "Assertion error";
                this.mask = mask;
                this.applyMask(mask);             
                this.drawFormatBits(mask);             
                this.isFunction = [];
            }
            QrCode.encodeText = function (text, ecl) {
                var segs = qrcodegen.QrSegment.makeSegments(text);
                return QrCode.encodeSegments(segs, ecl);
            };

            QrCode.encodeBinary = function (data, ecl) {
                var seg = qrcodegen.QrSegment.makeBytes(data);
                return QrCode.encodeSegments([seg], ecl);
            };
            QrCode.encodeSegments = function (segs, ecl, minVersion, maxVersion, mask, boostEcl) {
                if (minVersion === void 0) { minVersion = 1; }
                if (maxVersion === void 0) { maxVersion = 40; }
                if (mask === void 0) { mask = -1; }
                if (boostEcl === void 0) { boostEcl = true; }
                if (!(QrCode.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= QrCode.MAX_VERSION)
                    || mask < -1 || mask > 7)
                    throw "Invalid value";
                var version;
                var dataUsedBits;
                for (version = minVersion;; version++) {
                    var dataCapacityBits_1 = QrCode.getNumDataCodewords(version, ecl) * 8;
                    var usedBits = QrSegment.getTotalBits(segs, version);
                    if (usedBits <= dataCapacityBits_1) {
                        dataUsedBits = usedBits;
                        break;                 }
                        if (version >= maxVersion)                     
                break;//throw "Data too long";
        }
        for (var _i = 0, _a = [QrCode.Ecc.MEDIUM, QrCode.Ecc.QUARTILE, QrCode.Ecc.HIGH]; _i < _a.length; _i++) {
            var newEcl = _a[_i];
            if (boostEcl && dataUsedBits <= QrCode.getNumDataCodewords(version, newEcl) * 8)
                ecl = newEcl;
        }
        var bb = [];
        for (var _b = 0, segs_1 = segs; _b < segs_1.length; _b++) {
            var seg = segs_1[_b];
            appendBits(seg.mode.modeBits, 4, bb);
            appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);
            for (var _c = 0, _d = seg.getData(); _c < _d.length; _c++) {
                var b = _d[_c];
                bb.push(b);
            }
        }
        if (bb.length != dataUsedBits)
            throw "Assertion error";
        var dataCapacityBits = QrCode.getNumDataCodewords(version, ecl) * 8;
        if (bb.length > dataCapacityBits)
            throw "Assertion error";
        appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
        appendBits(0, (8 - bb.length % 8) % 8, bb);
        if (bb.length % 8 != 0)
            throw "Assertion error";
        for (var padByte = 0xEC; bb.length < dataCapacityBits; padByte ^= 0xEC ^ 0x11)
            appendBits(padByte, 8, bb);
        var dataCodewords = [];
        while (dataCodewords.length * 8 < bb.length)
            dataCodewords.push(0);
        bb.forEach(function (b, i) {
            return dataCodewords[i >>> 3] |= b << (7 - (i & 7));
        });
        return new QrCode(version, ecl, dataCodewords, mask);
    };
    QrCode.prototype.getModule = function (x, y) {
        return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
    };
    QrCode.prototype.drawCanvas = function (scale, border, canvas) {
        if (scale <= 0 || border < 0)
            throw "Value out of range";
        var width = (this.size + border * 2) * scale;
        canvas.width = width;
        canvas.height = width;
        var ctx = canvas.getContext("2d");
        for (var y = -border; y < this.size + border; y++) {
            for (var x = -border; x < this.size + border; x++) {
                ctx.fillStyle = this.getModule(x, y) ? "#000000" : "#FFFFFF";
                ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
            }
        }
    };
    QrCode.prototype.toSvgString = function (border) {
        if (border < 0)
            throw "Border must be non-negative";
        var parts = [];
        for (var y = 0; y < this.size; y++) {
            for (var x = 0; x < this.size; x++) {
                if (this.getModule(x, y))
                    parts.push("M" + (x + border) + "," + (y + border) + "h1v1h-1z");
            }
        }
        return "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 " + (this.size + border * 2) + " " + (this.size + border * 2) + "\" stroke=\"none\">\n\t<rect width=\"100%\" height=\"100%\" fill=\"#FFFFFF\"/>\n\t<path d=\"" + parts.join(" ") + "\" fill=\"#000000\"/>\n</svg>\n";
    };

    QrCode.prototype.drawFunctionPatterns = function () {
        for (var i = 0; i < this.size; i++) {
            this.setFunctionModule(6, i, i % 2 == 0);
            this.setFunctionModule(i, 6, i % 2 == 0);
        }
        this.drawFinderPattern(3, 3);
        this.drawFinderPattern(this.size - 4, 3);
        this.drawFinderPattern(3, this.size - 4);
        var alignPatPos = this.getAlignmentPatternPositions();
        var numAlign = alignPatPos.length;
        for (var i = 0; i < numAlign; i++) {
            for (var j = 0; j < numAlign; j++) {
                if (!(i == 0 && j == 0 || i == 0 && j == numAlign - 1 || i == numAlign - 1 && j == 0))
                    this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
            }
        }
        this.drawFormatBits(0);
        this.drawVersion();
    };
    QrCode.prototype.drawFormatBits = function (mask) {
        var data = this.errorCorrectionLevel.formatBits << 3 | mask;
        var rem = data;
        for (var i = 0; i < 10; i++)
            rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
        var bits = (data << 10 | rem) ^ 0x5412;             
        if (bits >>> 15 != 0)
            throw "Assertion error";
        for (var i = 0; i <= 5; i++)
            this.setFunctionModule(8, i, getBit(bits, i));
        this.setFunctionModule(8, 7, getBit(bits, 6));
        this.setFunctionModule(8, 8, getBit(bits, 7));
        this.setFunctionModule(7, 8, getBit(bits, 8));
        for (var i = 9; i < 15; i++)
            this.setFunctionModule(14 - i, 8, getBit(bits, i));
        for (var i = 0; i < 8; i++)
            this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
        for (var i = 8; i < 15; i++)
            this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
        this.setFunctionModule(8, this.size - 8, true);
    };
    QrCode.prototype.drawVersion = function () {
        if (this.version < 7)
            return;
        var rem = this.version;             
        for (var i = 0; i < 12; i++)
            rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
        var bits = this.version << 12 | rem;             
        if (bits >>> 18 != 0)
            throw "Assertion error";
        for (var i = 0; i < 18; i++) {
            var color = getBit(bits, i);
            var a = this.size - 11 + i % 3;
            var b = Math.floor(i / 3);
            this.setFunctionModule(a, b, color);
            this.setFunctionModule(b, a, color);
        }
    };
    QrCode.prototype.drawFinderPattern = function (x, y) {
        for (var dy = -4; dy <= 4; dy++) {
            for (var dx = -4; dx <= 4; dx++) {
                var dist = Math.max(Math.abs(dx), Math.abs(dy));                     			
                var xx = x + dx;
                var yy = y + dy;
                if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size)
                    this.setFunctionModule(xx, yy, dist != 2 && dist != 4);
            }
        }
    };
    QrCode.prototype.drawAlignmentPattern = function (x, y) {
        for (var dy = -2; dy <= 2; dy++) {
            for (var dx = -2; dx <= 2; dx++)
                this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
        }
    };
    QrCode.prototype.setFunctionModule = function (x, y, isBlack) {
        this.modules[y][x] = isBlack;
        this.isFunction[y][x] = true;
    };

    QrCode.prototype.addEccAndInterleave = function (data) {
        var ver = this.version;
        var ecl = this.errorCorrectionLevel;
        if (data.length != QrCode.getNumDataCodewords(ver, ecl))
            throw "Invalid argument";
        var numBlocks = QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
        var blockEccLen = QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
        var rawCodewords = Math.floor(QrCode.getNumRawDataModules(ver) / 8);
        var numShortBlocks = numBlocks - rawCodewords % numBlocks;
        var shortBlockLen = Math.floor(rawCodewords / numBlocks);
        var blocks = [];
        var rsDiv = QrCode.reedSolomonComputeDivisor(blockEccLen);
        for (var i = 0, k = 0; i < numBlocks; i++) {
            var dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
            k += dat.length;
            var ecc = QrCode.reedSolomonComputeRemainder(dat, rsDiv);
            if (i < numShortBlocks)
                dat.push(0);
            blocks.push(dat.concat(ecc));
        }
        var result = [];
        var _loop_1 = function (i) {
            blocks.forEach(function (block, j) {
               if (i != shortBlockLen - blockEccLen || j >= numShortBlocks)
                result.push(block[i]);
        });
        };
        for (var i = 0; i < blocks[0].length; i++) {
            _loop_1(i);
        }
        if (result.length != rawCodewords)
            throw "Assertion error";
        return result;
    };
    QrCode.prototype.drawCodewords = function (data) {
        if (data.length != Math.floor(QrCode.getNumRawDataModules(this.version) / 8))
            throw "Invalid argument";
        var i = 0;
        for (var right = this.size - 1; right >= 1; right -= 2) {                 
            if (right == 6)
                right = 5;
            for (var vert = 0; vert < this.size; vert++) {
                for (var j = 0; j < 2; j++) {
                    var x = right - j;
                    var upward = ((right + 1) & 2) == 0;
                    var y = upward ? this.size - 1 - vert : vert;
                    if (!this.isFunction[y][x] && i < data.length * 8) {
                        this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
                        i++;
                    }
                }
            }
        }
        if (i != data.length * 8)
            throw "Assertion error";
    };
    QrCode.prototype.applyMask = function (mask) {
        if (mask < 0 || mask > 7)
            throw "Mask value out of range";
        for (var y = 0; y < this.size; y++) {
            for (var x = 0; x < this.size; x++) {
                var invert = void 0;
                switch (mask) {
                    case 0:
                    invert = (x + y) % 2 == 0;
                    break;
                    case 1:
                    invert = y % 2 == 0;
                    break;
                    case 2:
                    invert = x % 3 == 0;
                    break;
                    case 3:
                    invert = (x + y) % 3 == 0;
                    break;
                    case 4:
                    invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0;
                    break;
                    case 5:
                    invert = x * y % 2 + x * y % 3 == 0;
                    break;
                    case 6:
                    invert = (x * y % 2 + x * y % 3) % 2 == 0;
                    break;
                    case 7:
                    invert = ((x + y) % 2 + x * y % 3) % 2 == 0;
                    break;
                    default: throw "Assertion error";
                }
                if (!this.isFunction[y][x] && invert)
                    this.modules[y][x] = !this.modules[y][x];
            }
        }
    };
    QrCode.prototype.getPenaltyScore = function () {
        var result = 0;
        for (var y = 0; y < this.size; y++) {
            var runColor = false;
            var runX = 0;
            var runHistory = [0, 0, 0, 0, 0, 0, 0];
            for (var x = 0; x < this.size; x++) {
                if (this.modules[y][x] == runColor) {
                    runX++;
                    if (runX == 5)
                        result += QrCode.PENALTY_N1;
                    else if (runX > 5)
                        result++;
                }
                else {
                    this.finderPenaltyAddHistory(runX, runHistory);
                    if (!runColor)
                        result += this.finderPenaltyCountPatterns(runHistory) * QrCode.PENALTY_N3;
                    runColor = this.modules[y][x];
                    runX = 1;
                }
            }
            result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * QrCode.PENALTY_N3;
        }
        for (var x = 0; x < this.size; x++) {
            var runColor = false;
            var runY = 0;
            var runHistory = [0, 0, 0, 0, 0, 0, 0];
            for (var y = 0; y < this.size; y++) {
                if (this.modules[y][x] == runColor) {
                    runY++;
                    if (runY == 5)
                        result += QrCode.PENALTY_N1;
                    else if (runY > 5)
                        result++;
                }
                else {
                    this.finderPenaltyAddHistory(runY, runHistory);
                    if (!runColor)
                        result += this.finderPenaltyCountPatterns(runHistory) * QrCode.PENALTY_N3;
                    runColor = this.modules[y][x];
                    runY = 1;
                }
            }
            result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * QrCode.PENALTY_N3;
        }
        for (var y = 0; y < this.size - 1; y++) {
            for (var x = 0; x < this.size - 1; x++) {
                var color = this.modules[y][x];
                if (color == this.modules[y][x + 1] &&
                    color == this.modules[y + 1][x] &&
                    color == this.modules[y + 1][x + 1])
                    result += QrCode.PENALTY_N2;
            }
        }
        var black = 0;
        for (var _i = 0, _a = this.modules; _i < _a.length; _i++) {
            var row = _a[_i];
            black = row.reduce(function (sum, color) { return sum + (color ? 1 : 0); }, black);
        }
        var total = this.size * this.size;
        var k = Math.ceil(Math.abs(black * 20 - total * 10) / total) - 1;
        result += k * QrCode.PENALTY_N4;
        return result;
    };
    /*-- Private helper functions --*/
    QrCode.prototype.getAlignmentPatternPositions = function () {
        if (this.version == 1)
            return [];
        else {
            var numAlign = Math.floor(this.version / 7) + 2;
            var step = (this.version == 32) ? 26 :
            Math.ceil((this.size - 13) / (numAlign * 2 - 2)) * 2;
            var result = [6];
            for (var pos = this.size - 7; result.length < numAlign; pos -= step)
                result.splice(1, 0, pos);
            return result;
        }
    };
    QrCode.getNumRawDataModules = function (ver) {
        if (ver < QrCode.MIN_VERSION || ver > QrCode.MAX_VERSION)
            throw "Version number out of range";
        var result = (16 * ver + 128) * ver + 64;
        if (ver >= 2) {
            var numAlign = Math.floor(ver / 7) + 2;
            result -= (25 * numAlign - 10) * numAlign - 55;
            if (ver >= 7)
                result -= 36;
        }
        if (!(208 <= result && result <= 29648))
            throw "Assertion error";
        return result;
    };
    QrCode.getNumDataCodewords = function (ver, ecl) {
        return Math.floor(QrCode.getNumRawDataModules(ver) / 8) -
        QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] *
        QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
    };
    QrCode.reedSolomonComputeDivisor = function (degree) {
        if (degree < 1 || degree > 255)
            throw "Degree out of range";
        var result = [];
        for (var i = 0; i < degree - 1; i++)
            result.push(0);
        result.push(1);
        var root = 1;
        for (var i = 0; i < degree; i++) {
            for (var j = 0; j < result.length; j++) {
                result[j] = QrCode.reedSolomonMultiply(result[j], root);
                if (j + 1 < result.length)
                    result[j] ^= result[j + 1];
            }
            root = QrCode.reedSolomonMultiply(root, 0x02);
        }
        return result;
    };
    QrCode.reedSolomonComputeRemainder = function (data, divisor) {
        var result = divisor.map(function (_) { return 0; });
        var _loop_2 = function (b) {
            var factor = b ^ result.shift();
            result.push(0);
            divisor.forEach(function (coef, i) {
                return result[i] ^= QrCode.reedSolomonMultiply(coef, factor);
            });
        };
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var b = data_1[_i];
            _loop_2(b);
        }
        return result;
    };
    QrCode.reedSolomonMultiply = function (x, y) {
        if (x >>> 8 != 0 || y >>> 8 != 0)
            throw "Byte out of range";
        var z = 0;
        for (var i = 7; i >= 0; i--) {
            z = (z << 1) ^ ((z >>> 7) * 0x11D);
            z ^= ((y >>> i) & 1) * x;
        }
        if (z >>> 8 != 0)
            throw "Assertion error";
        return z;
    };
    QrCode.prototype.finderPenaltyCountPatterns = function (runHistory) {
        var n = runHistory[1];
        if (n > this.size * 3)
            throw "Assertion error";
        var core = n > 0 && runHistory[2] == n && runHistory[3] == n * 3 && runHistory[4] == n && runHistory[5] == n;
        return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0)
        + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
    };
    QrCode.prototype.finderPenaltyTerminateAndCount = function (currentRunColor, currentRunLength, runHistory) {
        if (currentRunColor) {                 this.finderPenaltyAddHistory(currentRunLength, runHistory);
            currentRunLength = 0;
        }
        currentRunLength += this.size;             this.finderPenaltyAddHistory(currentRunLength, runHistory);
        return this.finderPenaltyCountPatterns(runHistory);
    };
    QrCode.prototype.finderPenaltyAddHistory = function (currentRunLength, runHistory) {
        if (runHistory[0] == 0)
            currentRunLength += this.size;
        runHistory.pop();
        runHistory.unshift(currentRunLength);
    };
    /*-- Constants and tables --*/
    QrCode.MIN_VERSION = 1;
    QrCode.MAX_VERSION = 40;
    QrCode.PENALTY_N1 = 3;
    QrCode.PENALTY_N2 = 3;
    QrCode.PENALTY_N3 = 40;
    QrCode.PENALTY_N4 = 10;
    QrCode.ECC_CODEWORDS_PER_BLOCK = [
                        //0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
                        [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
                        [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
                        [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
                        [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
                        ];
                        QrCode.NUM_ERROR_CORRECTION_BLOCKS = [
                        //0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
                        [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
                        [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
                        [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
                        [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
                        ];
                        return QrCode;
                    }());
qrcodegen.QrCode = QrCode;
function appendBits(val, len, bb) {
    if (len < 0 || len > 31 || val >>> len != 0)
        throw "Value out of range";
    for (var i = len - 1; i >= 0; i--)
        bb.push((val >>> i) & 1);
}
function getBit(x, i) {
    return ((x >>> i) & 1) != 0;
}

var QrSegment = (function () {
    function QrSegment(
        mode, 
        numChars, 
        bitData) {
        this.mode = mode;
        this.numChars = numChars;
        this.bitData = bitData;
        if (numChars < 0)
            throw "Invalid argument";
        this.bitData = bitData.slice();         }
        /*-- Static factory functions (mid level) --*/
        QrSegment.makeBytes = function (data) {
            var bb = [];
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var b = data_2[_i];
                appendBits(b, 8, bb);
            }
            return new QrSegment(QrSegment.Mode.BYTE, data.length, bb);
        };
        QrSegment.makeNumeric = function (digits) {
            if (!this.NUMERIC_REGEX.test(digits))
                throw "String contains non-numeric characters";
            var bb = [];
            for (var i = 0; i < digits.length;) {
                var n = Math.min(digits.length - i, 3);
                appendBits(parseInt(digits.substr(i, n), 10), n * 3 + 1, bb);
                i += n;
            }
            return new QrSegment(QrSegment.Mode.NUMERIC, digits.length, bb);
        };
        QrSegment.makeAlphanumeric = function (text) {
            if (!this.ALPHANUMERIC_REGEX.test(text))
                throw "String contains unencodable characters in alphanumeric mode";
            var bb = [];
            var i;
            for (i = 0; i + 2 <= text.length; i += 2) {
                var temp = QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
                temp += QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
                appendBits(temp, 11, bb);
            }
            if (i < text.length)
                appendBits(QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
            return new QrSegment(QrSegment.Mode.ALPHANUMERIC, text.length, bb);
        };
        QrSegment.makeSegments = function (text) {
            if (text == "")
                return [];
            else if (this.NUMERIC_REGEX.test(text))
                return [QrSegment.makeNumeric(text)];
            else if (this.ALPHANUMERIC_REGEX.test(text))
                return [QrSegment.makeAlphanumeric(text)];
            else
                return [QrSegment.makeBytes(QrSegment.toUtf8ByteArray(text))];
        };
        QrSegment.makeEci = function (assignVal) {
            var bb = [];
            if (assignVal < 0)
                throw "ECI assignment value out of range";
            else if (assignVal < (1 << 7))
                appendBits(assignVal, 8, bb);
            else if (assignVal < (1 << 14)) {
                appendBits(2, 2, bb);
                appendBits(assignVal, 14, bb);
            }
            else if (assignVal < 1000000) {
                appendBits(6, 3, bb);
                appendBits(assignVal, 21, bb);
            }
            else
                throw "ECI assignment value out of range";
            return new QrSegment(QrSegment.Mode.ECI, 0, bb);
        };
        /*-- Methods --*/
        QrSegment.prototype.getData = function () {
            return this.bitData.slice();         };
            QrSegment.getTotalBits = function (segs, version) {
                var result = 0;
                for (var _i = 0, segs_2 = segs; _i < segs_2.length; _i++) {
                    var seg = segs_2[_i];
                    var ccbits = seg.mode.numCharCountBits(version);
                    if (seg.numChars >= (1 << ccbits))
                        return Infinity;
                    result += 4 + ccbits + seg.bitData.length;
                }
                return result;
            };
            QrSegment.toUtf8ByteArray = function (str) {
                str = encodeURI(str);
                var result = [];
                for (var i = 0; i < str.length; i++) {
                    if (str.charAt(i) != "%")
                        result.push(str.charCodeAt(i));
                    else {
                        result.push(parseInt(str.substr(i + 1, 2), 16));
                        i += 2;
                    }
                }
                return result;
            };
            /*-- Constants --*/
            QrSegment.NUMERIC_REGEX = /^[0-9]*$/;
            QrSegment.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/;
            QrSegment.ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
            return QrSegment;
        }());
qrcodegen.QrSegment = QrSegment;
})(qrcodegen || (qrcodegen = {}));
/*---- Public helper enumeration ----*/
(function (qrcodegen) {
    var QrCode;
    (function (QrCode) {
        /*
         * The error correction level in a QR Code symbol. Immutable.
         */
         var Ecc = /** @class */ (function () {
            /*-- Constructor and fields --*/
            function Ecc(
                ordinal, 
                formatBits) {
                this.ordinal = ordinal;
                this.formatBits = formatBits;
            }
            /*-- Constants --*/
            Ecc.LOW = new Ecc(0, 1);
            Ecc.MEDIUM = new Ecc(1, 0);
            Ecc.QUARTILE = new Ecc(2, 3);
            Ecc.HIGH = new Ecc(3, 2);
            return Ecc;
        }());
         QrCode.Ecc = Ecc;
     })(QrCode = qrcodegen.QrCode || (qrcodegen.QrCode = {}));
 })(qrcodegen || (qrcodegen = {}));
 /*---- Public helper enumeration ----*/
 (function (qrcodegen) {
    var QrSegment;
    (function (QrSegment) {
        /*
         * Describes how a segment's data bits are interpreted. Immutable.
         */
         var Mode = /** @class */ (function () {
            /*-- Constructor and fields --*/
            function Mode(
                modeBits, 
                numBitsCharCount) {
                this.modeBits = modeBits;
                this.numBitsCharCount = numBitsCharCount;
            }
            /*-- Method --*/
            Mode.prototype.numCharCountBits = function (ver) {
                return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
            };
            /*-- Constants --*/
            Mode.NUMERIC = new Mode(0x1, [10, 12, 14]);
            Mode.ALPHANUMERIC = new Mode(0x2, [9, 11, 13]);
            Mode.BYTE = new Mode(0x4, [8, 16, 16]);
            Mode.KANJI = new Mode(0x8, [8, 10, 12]);
            Mode.ECI = new Mode(0x7, [0, 0, 0]);
            return Mode;
        }());
         QrSegment.Mode = Mode;
     })(QrSegment = qrcodegen.QrSegment || (qrcodegen.QrSegment = {}));
 })(qrcodegen || (qrcodegen = {}));

