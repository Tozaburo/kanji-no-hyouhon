var currentSection = "main";
var sectionList = ["main", "list", "collect", "yomi", "on", "kun", "status"]
var kankenLevel = ["10", "9", "8", "7", "6", "5", "4", "3", "準2", "2", "準1", "1"];
var collected = ["0"];
var level = "-1";
var levelKanji = [];
var collectedKanji = [];
var flattenKanji = [];
var answerKanji = "";
var onKanji = [];

window.addEventListener("DOMContentLoaded", function () {
    if (location.href.includes("#")) {
        var url = location.href.split("#");
        if (url[1] != "" && sectionList.includes(url[1])) {
            showSection(url[1]);
        } else {
            location.href = url[0];
        }
    }
    var cookies = getCookiesAsArray();
    collected = "";
    if (!cookies[0].includes("collected")) {
        makeCookie("collected", "0,0,0,0,0,0,0,0,0,0,0,0");
        collected = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    } else {
        collected = cookies[1][cookies[0].indexOf("collected")].split(",");
    }
    if (!cookies[0].includes("level")) {
        makeCookie("level", "1");
        level = "1";
    } else {
        level = cookies[1][cookies[0].indexOf("level")];
    }
    // collected = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    // level = "2";

    collectedKanji = [];
    for (var n = 0; n < collected.length; n++) {
        var tck = Number(parseInt(collected[n], 36)).toString(2);
        var repeat = kanji[n].length - tck.length;
        for (var m = 0; m < repeat; m++) {
            tck += "0";
        }
        collectedKanji.push(tck);
    }

    levelKanji = [];
    for (var n = 0; n < Number(level); n++) {
        levelKanji.push([]);
        for (var m = 0; m < Number(kanji[n].length); m++) {
            levelKanji[levelKanji.length - 1].push(kanji[n][m][0]);
        }
    }
});

function showSection(id) {
    flattenKanji = kanji[0].concat(kanji[1]);
    if (currentSection === id) return;
    document.getElementById(currentSection).classList.add('hidden');
    setTimeout(() => {
        document.getElementById(currentSection).style.display = "none";
        document.getElementById(id).classList.remove('hidden');
        document.getElementById(id).style.display = "flex";
        currentSection = id;
        if (id == "list") {
            loadList();
        }
        if (id == "collect") {
            document.querySelector("#class").innerHTML = "現在の級：" + kankenLevel[Number(level) - 1] + "級";
        }
        if (id == "on") {
            onQuestion();
        }
        if (id == "correct") {
            document.querySelector("#on-kanji-description").innerHTML = "「" + answerKanji + "」をゲットしました！"
            for (var n = 0; n < kanji.length; n++) {
                for (var m = 0; m < kanji[n].length; m++) {
                    if (kanji[n][m][0] == answerKanji) {
                        console.log(collectedKanji)
                        collectedKanji.splice('' + n, 1, collectedKanji[n].substr(0, m) + 1 + collectedKanji[n].substr(m + 1))
                        saveCollected();
                        console.log(collectedKanji)
                        break;
                    }
                }
            }
        }
    }, 500);
}

function makeCookie(title, data) {
    var cookieValue = title + "=" + data + ";path=/;max-age=" + (10 * 365 * 24 * 60 * 60); // 10年間有効
    document.cookie = cookieValue;
}

function getCookiesAsArray() {
    var allCookies = document.cookie.split('; ');
    var names = [];
    var values = [];

    for (var i = 0; i < allCookies.length; i++) {
        var cookiePair = allCookies[i].split('=');
        names.push(cookiePair[0]);
        values.push(cookiePair[1]);
    }

    return [names, values];
}

function saveCollected() {
    collected = [];
    for (var n = 0; n < collectedKanji.length; n++) {
        collected.splice(n, 1, parseInt(collectedKanji[n], 2).toString(32));
    }
    makeCookie("collected", collected.join(","));
    console.log(collected.join(","))
}

function loadList() {
    var cookies = getCookiesAsArray();
    collected = "";
    if (!cookies[0].includes("collected")) {
        makeCookie("collected", "0,0,0,0,0,0,0,0,0,0,0,0");
        collected = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    } else {
        collected = cookies[1][cookies[0].indexOf("collected")].split(",");
    }
    if (!cookies[0].includes("level")) {
        makeCookie("level", "1");
        level = "1";
    } else {
        level = cookies[1][cookies[0].indexOf("level")];
    }
    // collected = ["0", "50", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    // level = "2";

    collectedKanji = [];
    for (var n = 0; n < collected.length; n++) {
        var tck = Number(parseInt(collected[n], 36)).toString(2);
        var repeat = kanji[n].length - tck.length;
        for (var m = 0; m < repeat; m++) {
            tck += "0";
        }
        collectedKanji.push(tck);
    }

    levelKanji = [];
    for (var n = 0; n < Number(level); n++) {
        levelKanji.push([]);
        for (var m = 0; m < Number(kanji[n].length); m++) {
            levelKanji[levelKanji.length - 1].push(kanji[n][m][0]);
        }
    }

    var count = 0;
    for (var n = 0; n < levelKanji.length; n++) {
        for (var m = 0; m < levelKanji[n].length; m++) {
            if (collectedKanji[n][m] != 1) {
                levelKanji[n].splice(m, 1, "？");
            }
            count += 1;
        }
    }

    document.querySelector("#kanji-list").innerHTML = "";
    var count = 0;
    for (var n = 0; n < levelKanji.length; n++) {
        if (n != 0) {
            document.querySelector("#kanji-list").innerHTML += "<li><div class='line'></div></li>";
        }
        for (var m = 0; m < levelKanji[n].length; m++) {
            document.querySelector("#kanji-list").innerHTML += "<li><a href='#kanjiDescription' onclick='kanjiDescription(" + count + ")'>" + levelKanji[n][m] + "</a></li>";
            count += 1;
        }
    }
}

function kanjiDescription(num) {
    showSection("kanjiDescription");
    flattenKanji = kanji[0].concat(kanji[1]);
    document.querySelector("#kanjiDescriptionTitle").innerHTML = "漢字「" + flattenKanji[num][0] + "」について";
    document.querySelector("#kanji-description").innerHTML = "漢字：" + flattenKanji[num][0];
    if (flattenKanji[num][3].includes("・")) {
        document.querySelector("#on-description").innerHTML = "音読み：" + flattenKanji[num][3].join("・");
    } else {
        document.querySelector("#on-description").innerHTML = "音読み：" + flattenKanji[num][3];
    }
    if (flattenKanji[num][4].includes("・")) {
        document.querySelector("#kun-description").innerHTML = "訓読み：" + flattenKanji[num][4].join("・");
    } else {
        document.querySelector("#kun-description").innerHTML = "訓読み：" + flattenKanji[num][4];
    }
    document.querySelector("#bushu-description").innerHTML = "部首：" + flattenKanji[num][1];
    document.querySelector("#kakusu-description").innerHTML = "画数：" + flattenKanji[num][2];
}

function arrayShuffle(array) {
    for (let i = (array.length - 1); 0 < i; i--) {

        let r = Math.floor(Math.random() * (i + 1));

        let tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
    }
    return array;
}

function onQuestion() {
    var randomAnswer = Math.floor(Math.random() * flattenKanji.length);
    answerKanji = flattenKanji[randomAnswer][0]
    if (typeof flattenKanji[randomAnswer][3] == "object") {
        var answerYomi = flattenKanji[randomAnswer][3][Math.floor(Math.random() * flattenKanji[randomAnswer][3].length)];
    } else {
        var answerYomi = flattenKanji[randomAnswer][3];
    }
    var random = 0;
    onKanji = [];
    onKanji.push(answerKanji);
    for (var n = 0; n < 8;) {
        random = Math.floor(Math.random() * flattenKanji.length);
        if (!flattenKanji[random][3].includes(answerYomi)) {
            onKanji.push(flattenKanji[random][0])
            n += 1;
        }

    }
    console.log(answerKanji)
    console.log(answerYomi)
    onKanji = arrayShuffle(onKanji);
    console.log(onKanji);
    document.querySelector("#on-kanji-question").innerHTML = "次のうち「" + answerYomi + "」と読むものを1つ選べ";
    document.querySelector("#on-kanji-list").innerHTML = "";
    for (var n = 0; n < 9; n++) {
        document.querySelector("#on-kanji-list").innerHTML += "<li><a onclick='onKanjiJudgment(" + n + ")'>" + onKanji[n] + "</a></li>";
    }
}

function onKanjiJudgment(num) {
    if (answerKanji == onKanji[num]) {
        showSection("correct");
    } else {
        showSection("wrong");
    }
}
