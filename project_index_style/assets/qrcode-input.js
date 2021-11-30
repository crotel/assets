"use strict";
var app;
var logs = (e)=>{
console.log(e);
}
(function (app) {
    function initialize() {
        var elems = document.querySelectorAll("input[type=text]");
        getElem("text-input").oninput = redrawQrCode;
        redrawQrCode();
    }
    function redrawQrCode() {
        var canvas = getElem("qrcode-canvas");
        var svg = document.getElementById("qrcode-svg");
        canvas.style.display = "none";
        svg.style.display = "none";
		var ecl = qrcodegen.QrCode.Ecc.HIGH;
        var text = getElem("text-input").value;
        var segs = qrcodegen.QrSegment.makeSegments(text);
        var minVer = 1;
        var maxVer = 40;
        var mask = -1;
        var boostEcc = true;
        var qr = qrcodegen.QrCode.encodeSegments(segs, ecl, minVer, maxVer, mask, boostEcc);
        var border = 4;
            var code = qr.toSvgString(border);
            var viewBox = / viewBox="([^"]*)"/.exec(code)[1];
            var pathD = / d="([^"]*)"/.exec(code)[1];
            svg.setAttribute("viewBox", viewBox);
            svg.querySelector("path").setAttribute("d", pathD);
            svg.style.removeProperty("display");

        function describeSegments(segs) {
            if (segs.length == 0)
                return "none";
            else if (segs.length == 1) {
                var mode = segs[0].mode;
                var Mode = qrcodegen.QrSegment.Mode;
                if (mode == Mode.NUMERIC)
                    return "numeric";
                if (mode == Mode.ALPHANUMERIC)
                    return "alphanumeric";
                if (mode == Mode.BYTE)
                    return "byte";
                if (mode == Mode.KANJI)
                    return "kanji";
                return "unknown";
            }
            else
                return "multiple";
        }

        function countUnicodeChars(str) {
            var result = 0;
            for (var i = 0; i < str.length; i++, result++) {
                var c = str.charCodeAt(i);
                if (c < 0xD800 || c >= 0xE000)
                    continue;
                else if (0xD800 <= c && c < 0xDC00 && i + 1 < str.length) {
                i++;
                    var d = str.charCodeAt(i);
                    if (0xDC00 <= d && d < 0xE000)
                    continue;
                }
                throw "Invalid UTF-16 string";
            }
            return result;
        }
               let statistics = "QR Code version = " + qr.version + ",\n" +
            ("mask pattern = " + qr.mask + ",\n") +
            ("character count = " + countUnicodeChars(text) + ",\n") +
            ("encoding mode = " + describeSegments(segs) + ",\n") +
            ("error correction = level " + "LMQH".charAt(qr.errorCorrectionLevel.ordinal) + ",\n") +
            ("data bits = " + qrcodegen.QrSegment.getTotalBits(segs, qr.version) + ".");
            logs(statistics);
    }
    function getElem(id) {
        var result = document.getElementById(id);
        if (result instanceof HTMLElement)
            return result;
        throw "Assertion error";
    }
    function getInput(id) {
        var result = getElem(id);
        if (result instanceof HTMLInputElement)
            return result;
        throw "Assertion error";
    }
    initialize();
    
})(app || (app = {}));

