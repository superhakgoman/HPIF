var HPIF = function () {
    try{
        var charset = document.charset || document.characterSet;
        if(charset !== "UTF-8"){
            throw new Error("HPIF는 UTF-8에서만 동작합니다.");
        }
    } catch(error) {
        console.error(error.name + " : " + error.message);
        return;
    }

    //                  ㄱ      ㄲ       ㄴ       ㄷ      ㄸ      ㄹ      ㅁ       ㅂ       ㅃ      ㅅ       ㅆ       ㅇ       ㅈ      ㅉ      ㅊ      ㅋ        ㅌ      ㅍ      ㅎ
    var ChoSeong = [0x3131, 0x3132, 0x3134, 0x3137, 0x3138, 0x3139, 0x3141, 0x3142, 0x3143, 0x3145, 0x3146, 0x3147, 0x3148, 0x3149, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e];
    //                  ㅏ      ㅐ       ㅑ       ㅒ      ㅓ      ㅔ      ㅕ       ㅖ       ㅗ      ㅘ       ㅙ       ㅚ       ㅛ      ㅜ      ㅝ      ㅞ        ㅟ      ㅠ      ㅡ        ㅢ       ㅣ
    var JungSeong = [0x314f, 0x3150, 0x3151, 0x3152, 0x3153, 0x3154, 0x3155, 0x3156, 0x3157, 0x3158, 0x3159, 0x315a, 0x315b, 0x315c, 0x315d, 0x315e, 0x315f, 0x3160, 0x3161, 0x3162, 0x3163];
    //               받침없음      ㄱ      ㄲ      ㄳ       ㄴ       ㄵ      ㄶ      ㄷ       ㄹ       ㄺ      ㄻ       ㄼ       ㄽ      ㄾ       ㄿ      ㅀ      ㅁ       ㅂ       ㅄ      ㅅ       ㅆ      ㅇ       ㅈ       ㅊ      ㅋ       ㅌ       ㅍ      ㅎ
    var JongSeong = [0x0000, 0x3131, 0x3132, 0x3133, 0x3134, 0x3135, 0x3136, 0x3137, 0x3139, 0x313a, 0x313b, 0x313c, 0x313d, 0x313e, 0x313f, 0x3140, 0x3141, 0x3142, 0x3144, 0x3145, 0x3146, 0x3147, 0x3148, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e];
    //                   받침없음      ㄳ       ㄵ      ㄶ       ㄺ      ㄻ       ㄼ       ㄽ      ㄾ       ㄿ      ㅀ       ㅄ
    var DoubleBatchim = [0x0000, 0x3133, 0x3135, 0x3136, 0x313a, 0x313b, 0x313c, 0x313d, 0x313e, 0x313f, 0x3140, 0x3144];

    var C$Parser = function(){
        function endedWithVowel(str) {
            try {
                if (typeof str === "string") {
                    var lastJaso = toJaso(str.charAt(str.length - 1)).pop();
                    if (lastJaso.charCodeAt(0) >= 0x314f && lastJaso.charCodeAt(0) <= 0x3163) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    throw new TypeError("문자열 이외에는 처리할 수 없습니다.");
                }
            }
            catch (error) {
                console.error(error.name + " : " + error.message);
            }
        }

        function toJaso(str) {
            try {
                if (typeof str === "string") {
                    str = str.replace(/[^가-힣]/g, '');
                    var cho, jung, jong;
                    var result = [];
                    for (var i = 0; i < str.length; i++) {
                        var ch = str.charCodeAt(i);
                        if (ch >= 0xAC00 && ch <= 0xD7A3) {
                            jong = ch - 0xAC00;
                            cho = jong / (21 * 28);
                            jong = jong % (21 * 28);
                            jung = jong / 28;
                            jong = jong % 28;

                            result.push(String.fromCharCode(ChoSeong[parseInt(cho)]), String.fromCharCode(JungSeong[parseInt(jung)]));
                            if (jong !== 0) {
                                result.push(String.fromCharCode(JongSeong[parseInt(jong)]));
                            }
                        }
                    }
                    return result;
                }
                else {
                    throw new TypeError("문자열 이외에는 처리할 수 없습니다.");
                }
            } catch (error) {
                console.error(error.name + " : " + error.message);
            }
        }

        function toChoseongChe(str){
            try {
                if (typeof str === "string") {
                    str = str.replace(/[^가-힣]/g, '');
                    var result = [];
                    for(var i = 0; i < str.length; i++){
                        var ch = str.charCodeAt(i);
                        if (ch >= 0xAC00 && ch <= 0xD7A3) {
                            result.push(String.fromCharCode(ChoSeong[parseInt((ch - 0xAC00) / (21 * 28))]));
                        }
                    }
                    return result;
                }
                else {
                    throw new TypeError("문자열 이외에는 처리할 수 없습니다.");
                }
            } catch (error) {
                console.error(error.name + " : " + error.message);
            }
        }

        return {
            endedWithVowel : endedWithVowel,
            toJaso : toJaso,
            toChoseongChe: toChoseongChe,
        };
    }();



    function anagram(str) {
        try {
            if (typeof str === "string") {
                str = str.replace(/[^가-힣]/g, '');
                var result = "";
                while (result.length !== str.length) {
                    result = function () {
                        var cho, jung, jong;
                        var choArr = [];
                        var jungArr = [];
                        var jongArr = [];
                        var anagramString = "";

                        for (var i = 0; i < str.length; i++) {
                            var ch = str.charCodeAt(i);
                            if (ch >= 0xAC00 && ch <= 0xD7A3) {
                                jong = ch - 0xAC00;
                                cho = jong / (21 * 28);
                                jong = jong % (21 * 28);
                                jung = jong / 28;
                                jong = jong % 28;

                                choArr.push(ChoSeong[parseInt(cho)], JongSeong[parseInt(jong)]);
                                jongArr.push(ChoSeong[parseInt(cho)], JongSeong[parseInt(jong)]);
                                jungArr.push(JungSeong[parseInt(jung)]);
                            }
                        }

                        while (choArr.length > 0 && jungArr.length > 0 && jongArr.length > 0) {
                            var randIndex = Math.floor(Math.random() * choArr.length);
                            cho = choArr[randIndex];
                            if (DoubleBatchim.indexOf(cho) !== -1) {
                                choArr.splice(randIndex, 1);
                                // cho가 겹받침이거나 0x0000인 경우
                                continue;
                            }
                            choArr.splice(randIndex, 1);
                            jongArr.splice(jongArr.indexOf(cho), 1);

                            randIndex = Math.floor(Math.random() * jungArr.length);
                            jung = jungArr[randIndex];
                            jungArr.splice(randIndex, 1);

                            randIndex = Math.floor(Math.random() * jongArr.length);
                            jong = jongArr[randIndex];
                            jongArr.splice(randIndex, 1);
                            choArr.splice(choArr.indexOf(jong), 1);
                            var ch = 0xAC00 + ( (ChoSeong.indexOf(cho) * 21) + JungSeong.indexOf(jung) ) * 28 + JongSeong.indexOf(jong);

                            anagramString = anagramString + String.fromCharCode(ch);

                        }
                        return anagramString;
                    }();
                }
                if (result.length === 0) {
                    return "그런 건 없다";
                } else {
                    return result;
                }
            }
            else {
                throw new TypeError("문자열 이외에는 처리할 수 없습니다.");
            }
        } catch (error) {
            console.error(error.name + " : " + error.message);
        }
    }

    var C$AddJosa = function () {
        function eulleul(str) {
            if (C$Parser.endedWithVowel(str)) {
                return str + "를";
            } else {
                return str + "을";
            }
        }

        function eunneun(str) {
            if (C$Parser.endedWithVowel(str)) {
                return str + "는";
            } else {
                return str + "은";
            }
        }

        function iga(str) {
            if (C$Parser.endedWithVowel(str)) {
                return str + "가";
            } else {
                return str + "이";
            }
        }

        return {
            eulleul: eulleul,
            eunneun: eunneun,
            iga: iga
        };
    }();


    return {
        anagram: anagram,
        addJosa: C$AddJosa,
        parser : C$Parser
    };
}();