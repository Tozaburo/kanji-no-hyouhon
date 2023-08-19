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
var kunKanji = [];
var collectedKanjiNum = 0;

for (var n = 0; n < Number(level) + 1; n++) {
    flattenKanji = flattenKanji.concat(kanji[n]);
}

var cookies = getCookiesAsArray();
collected = "";
if (!cookies[0].includes("collected")) {
    makeCookie("collected", "10000000000000000,100000000000000000000000000000000,10000000000000000000000000000000000000000,40000000000000000000000000000000000000000,800000000000000000000000000000000000000,200000000000000000000000000000000000000,800000000000000000000000000000000000000000000000000000000000000,g00000000000000000000000000000000000000000000000000000000,800000000000000000000000000000000000000000000000000000000000000000,80000000000000000000000000000000000000,200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,0");
    collected = ["10000000000000000", "100000000000000000000000000000000", "10000000000000000000000000000000000000000", "40000000000000000000000000000000000000000", "800000000000000000000000000000000000000", "200000000000000000000000000000000000000", "800000000000000000000000000000000000000000000000000000000000000", "g00000000000000000000000000000000000000000000000000000000", "800000000000000000000000000000000000000000000000000000000000000000", "80000000000000000000000000000000000000", "200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "0"];
} else {
    collected = cookies[1][cookies[0].indexOf("collected")].split(",");
}
if (!cookies[0].includes("level")) {
    makeCookie("level", "0");
    level = "0";
} else {
    level = cookies[1][cookies[0].indexOf("level")];
}

collectedKanji = [];
for (var n = 0; n < collected.length; n++) {
    var tck = convertBase(collected[n], 32, 2);
    var repeat = kanji[n].length - tck.length + 1;
    for (var m = 0; m < repeat; m++) {
        tck += "0";
    }
    collectedKanji.push(tck);
}
saveCollected();

levelKanji = [];
for (var n = 0; n < Number(level) + 1; n++) {
    levelKanji.push([]);
    for (var m = 0; m < Number(kanji[n].length); m++) {
        levelKanji[levelKanji.length - 1].push(kanji[n][m][0]);
    }
}

for (var n = 0; n < Number(level) + 1; n++) {
    flattenKanji = flattenKanji.concat(kanji[n]);
}

window.addEventListener("DOMContentLoaded", function () {
    if (location.href.includes("#")) {
        var url = location.href.split("#");
        if (url[1] != "" && sectionList.includes(url[1])) {
            showSection(url[1]);
        } else {
            location.href = url[0];
        }
    }
});

function convertBase(numStr, fromBase, toBase) {
    var decimalNumber = parseInt(numStr, fromBase);
    return decimalNumber.toString(toBase);
}

function showSection(id) {
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
            document.querySelector("#class").innerHTML = "現在の級：" + kankenLevel[Number(level)] + "級";
        }
        if (id == "on") {
            onQuestion();
        }
        if (id == "kun") {
            kunQuestion();
        }
        if (id == "correct") {
            document.querySelector("#correct-description").innerHTML = "「" + answerKanji + "」をゲットしました！"
            for (var n = 0; n < kanji.length; n++) {
                for (var m = 0; m < kanji[n].length; m++) {
                    if (kanji[n][m][0] == answerKanji) {
                        collectedKanji[n] = replaceAt(collectedKanji[n], m + 1, "1");
                        saveCollected();
                        break;
                    }
                }
            }
        }
        if (id == "status") {
            countCollected();
            document.querySelector("#status-class").innerHTML = "現在の級：" + kankenLevel[Number(level)] + "級";
            document.querySelector("#status-next-class").innerHTML = "次級に行くために必要な漢字：" + String(collectedKanjiNum) + "/" + String(flattenKanji.length);
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
        collected.push(convertBase(collectedKanji[n], 2, 32));
    }
    makeCookie("collected", collected.join(","));
}

function countCollected() {
    collectedKanjiNum = 0;
    for (var n = 0; n < levelKanji.length; n++) {
        for (var m = 0; m < levelKanji[n].length; m++) {
            if (collectedKanji[n][m + 1] != 1) {
                collectedKanjiNum += 1;
            }
        }
    }
}

function loadList() {
    for (var n = 0; n < levelKanji.length; n++) {
        for (var m = 0; m < levelKanji[n].length; m++) {
            if (collectedKanji[n][m + 1] != 1) {
                levelKanji[n].splice(m, 1, "？");
            }
        }
    }

    document.querySelector("#kanji-list").innerHTML = "";
    var count = 0;
    for (var n = 0; n < levelKanji.length; n++) {
        if (n != 0) {
            document.querySelector("#kanji-list").innerHTML += "<li><div class='line'></div></li>";
        }
        for (var m = 0; m < levelKanji[n].length; m++) {
            document.querySelector("#kanji-list").innerHTML += "<li><a onclick='kanjiDescription(" + count + ")'>" + levelKanji[n][m] + "</a></li>";
            count += 1;
        }
    }
}

function kanjiDescription(num) {
    var flattenLevelKanji = [];
    for (var n = 0; n < Number(level) + 1; n++) {
        flattenLevelKanji = flattenLevelKanji.concat(levelKanji[n]);
    }
    showSection("kanjiDescription");
    console.log(flattenLevelKanji[num])
    if (flattenLevelKanji[num] == "？") {
        document.querySelector("#kanjiDescription").innerHTML = `
<h1 class="title" id="kanjiDescriptionTitle">まだこの漢字をゲットしていないようです...</h1>
<ul class="section-menu">
    <li>
        <a href="#main" onclick="showSection('main')">ホーム</a>
    </li>
    <li>
    <a href="#main" onclick="window.location.reload();">戻る</a>
    </li>
</ul>`;
    } else {
        document.querySelector("#kanjiDescription").innerHTML = `
<div class="list-title">
    <h1 class="title" id="kanjiDescriptionTitle">漢字「」について</h1>
    <a href="#main" class="home" onclick="showSection('main')">ホーム</a>
    <a href="#main" class="home" onclick="window.location.reload();">戻る</a>
</div>
<div class="descriptionContainer">
    <p id="kanji-description">漢字：</p>
    <p id="on-description">音読み：</p>
    <p id="kun-description">訓読み：</p>
    <p id="bushu-description">部首：</p>
    <p id="kakusu-description">画数：</p>
</div>`
        document.querySelector("#kanjiDescriptionTitle").innerHTML = "漢字「" + flattenKanji[num][0] + "」について";
        document.querySelector("#kanji-description").innerHTML = "漢字：" + flattenKanji[num][0];
        if (typeof flattenKanji[num][3] == "object") {
            document.querySelector("#on-description").innerHTML = "音読み：" + flattenKanji[num][3].join("・");
        } else {
            document.querySelector("#on-description").innerHTML = "音読み：" + flattenKanji[num][3];
        }
        if (typeof flattenKanji[num][4] == "object") {
            document.querySelector("#kun-description").innerHTML = "訓読み：" + flattenKanji[num][4].join("・");
        } else {
            document.querySelector("#kun-description").innerHTML = "訓読み：" + flattenKanji[num][4];
        }
        document.querySelector("#bushu-description").innerHTML = "部首：" + flattenKanji[num][1];
        document.querySelector("#kakusu-description").innerHTML = "画数：" + flattenKanji[num][2];
    }
}

function arrayShuffle(array) {
    for (var n = (array.length - 1); 0 < n; n--) {

        var r = Math.floor(Math.random() * (n + 1));

        var tmp = array[n];
        array[n] = array[r];
        array[r] = tmp;
    }
    return array;
}

function onQuestion() {
    var answerYomi = "";
    while (answerYomi == "") {
        var randomAnswer = Math.floor(Math.random() * flattenKanji.length);
        answerKanji = flattenKanji[randomAnswer][0]
        if (typeof flattenKanji[randomAnswer][3] == "object") {
            var answerYomi = flattenKanji[randomAnswer][3][Math.floor(Math.random() * flattenKanji[randomAnswer][3].length)];
        } else {
            answerYomi = flattenKanji[randomAnswer][3];
        }
    }
    var random = 0;
    onKanji = [];
    onKanji.push(answerKanji);
    for (var n = 0; n < 8;) {
        random = Math.floor(Math.random() * flattenKanji.length);
        if (!flattenKanji[random][3].includes(answerYomi) && !onKanji.includes(flattenKanji[random][0])) {
            onKanji.push(flattenKanji[random][0])
            n += 1;
        }

    }
    onKanji = arrayShuffle(onKanji);
    document.querySelector("#on-kanji-question").innerHTML = "次のうち「" + answerYomi + "」と音読みで読むものを1つ選べ";
    document.querySelector("#on-kanji-list").innerHTML = "";
    for (var n = 0; n < 9; n++) {
        document.querySelector("#on-kanji-list").innerHTML += "<li><a onclick='onKanjiJudgment(" + n + ")'>" + onKanji[n] + "</a></li>";
    }
}

function kunQuestion() {
    var answerYomi = "";
    while (answerYomi == "") {
        var randomAnswer = Math.floor(Math.random() * flattenKanji.length);
        answerKanji = flattenKanji[randomAnswer][0]
        if (typeof flattenKanji[randomAnswer][4] == "object") {
            var answerYomi = flattenKanji[randomAnswer][4][Math.floor(Math.random() * flattenKanji[randomAnswer][4].length)];
        } else {
            answerYomi = flattenKanji[randomAnswer][4];
        }
    }
    var random = 0;
    kunKanji = [];
    kunKanji.push(answerKanji);
    for (var n = 0; n < 8;) {
        random = Math.floor(Math.random() * flattenKanji.length);
        if (!flattenKanji[random][4].includes(answerYomi) && !kunKanji.includes(flattenKanji[random][0])) {
            kunKanji.push(flattenKanji[random][0])
            n += 1;
        }

    }
    kunKanji = arrayShuffle(kunKanji);
    document.querySelector("#kun-kanji-question").innerHTML = "次のうち「" + answerYomi + "」と訓読みで読むものを1つ選べ";
    document.querySelector("#kun-kanji-list").innerHTML = "";
    for (var n = 0; n < 9; n++) {
        document.querySelector("#kun-kanji-list").innerHTML += "<li><a onclick='kunKanjiJudgment(" + n + ")'>" + kunKanji[n] + "</a></li>";
    }
}

function onKanjiJudgment(num) {
    if (answerKanji == onKanji[num]) {
        showSection("correct");
    } else {
        showSection("wrong");
    }
}

function kunKanjiJudgment(num) {
    if (answerKanji == kunKanji[num]) {
        showSection("correct");
    } else {
        showSection("wrong");
    }
}

function replaceAt(str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

function goBack() {
    history.back(-1)
    window.location.reload();
}
