var currentSection = "main";
var sectionList = ["main", "list", "collect", "yomi", "on", "kun", "bushu", "status", "source", "setting"]
var kankenLevel = ["10", "9", "8", "7", "6", "5", "4", "3", "準2", "2", "準1", "1"];
var collected = ["0"];
var level = "-1";
var onf = 0;
var levelKanji = [];
var collectedKanji = [];
var collectedKanjiList = [];
var flattenCollectedKanjiList = [];
var flattenKanji = [];
var answerKanji = "";
var answerBushu = "";
var onKanji = [];
var kunKanji = [];
var bushuKanji = [];
var collectedKanjiNum = 0;
var question = "";
var page = [];

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let animationId;
function textDraw() {
    loadKanji();

    if (Math.round(getRandomIntInclusive(1, 10)) == 1) {
        var num = Number(document.querySelector(".particle").dataset.num);
        var width = window.innerWidth;
        document.querySelector(".particle").dataset.num = String(num + 1);
        document.querySelector(".particle").innerHTML += `<p id="text${document.querySelector(".particle").dataset.num}" style="top: 0vh; left: ${getRandomIntInclusive(0, width)}px; font-size: ${getRandomArbitrary(1, 10)}vh;">${flattenCollectedKanjiList[Math.floor(Math.random() * flattenCollectedKanjiList.length)]}</p>`;
    }

    var num = Number(document.querySelector(".particle").dataset.num);

    for (var n = 1; n < num + 1; n++) {
        var element = document.querySelector(`#text${String(n)}`);
        if (element != null) {
            element.style.top = String(Number(element.style.top.replace("vh", "")) + Number(element.style.fontSize.replace("vh", "")) / 10) + "vh";
            if (Number(element.style.top.replace("vh", "")) > 100) {
                element.remove();
            }
        }
    }
    animationId = requestAnimationFrame(textDraw);
}



function loadFlattenKanji() {
    flattenKanji = [];
    for (var n = 0; n < Number(level) + 1; n++) {
        flattenKanji = flattenKanji.concat(kanji[n]);
    }
}

function kanjiData() {
    collected = "";
    if (localStorage.getItem("collected") == null) {
        localStorage.setItem("collected", "1,1,1,1,1,1,1,1,1,1,1,1");
        collected = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"];
    } else {
        collected = localStorage.getItem("collected").split(",");
    }
    if (localStorage.getItem("level") == null) {
        localStorage.setItem("level", "0");
        level = "0";
    } else {
        level = localStorage.getItem("level");
    }

    collectedKanji = [];
    for (var n = 0; n < collected.length; n++) {
        var tck = convertBase(collected[n], 36, 2);
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
}

function convertBase(value, fromBase, toBase) {
    const decimalValue = new BigNumber(value, fromBase);
    return decimalValue.toString(toBase);
}

function showSection(id) {
    page.push(id);
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
        if (id == "bushu") {
            bushuQuestion();
        }
        if (id == "correct") {
            countCollected();
            loadFlattenKanji();
            if (collectedKanjiNum == flattenKanji.length) {
                document.querySelector(".popup").style.display = "flex";
                level = String(Number(level) + 1);
                document.querySelector("#popup-p").innerHTML = `あなたのレベルが${kankenLevel[level - 1]}級から${kankenLevel[level]}級になりました！`;
            }
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
            loadFlattenKanji();
            document.querySelector("#status-class").innerHTML = kankenLevel[Number(level)] + "級";
            document.querySelector("#status-next-class").innerHTML = String(flattenKanji.length - collectedKanjiNum) + "/" + String(flattenKanji.length);
            document.querySelector(".graph").style.background = `linear-gradient(to right, #af263e ${String((collectedKanjiNum / flattenKanji.length) * 100)}%, #b0b0b0 ${String((collectedKanjiNum / flattenKanji.length) * 100)}%)`
        }
    }, 500);
}

function saveCollected() {
    collected = [];
    for (var n = 0; n < collectedKanji.length; n++) {
        collected.push(convertBase(collectedKanji[n], 2, 36));
    }
    localStorage.setItem("collected", collected.join(","));
    localStorage.setItem("level", level);
}

function toFullString(number) {
    return number.toLocaleString('fullwide', { useGrouping: false });
}

function countCollected() {
    loadFlattenKanji();
    collectedKanjiNum = flattenKanji.length;
    for (var n = 0; n < levelKanji.length; n++) {
        for (var m = 0; m < levelKanji[n].length; m++) {
            if (collectedKanji[n][m + 1] != 1) {
                collectedKanjiNum -= 1;
            }
        }
    }
}

function loadKanji() {
    collectedKanjiList = [];
    kanjiData();
    for (var n = 0; n < levelKanji.length; n++) {
        for (var m = 0; m < levelKanji[n].length; m++) {
            if (collectedKanji[n][m + 1] != 1) {
                levelKanji[n].splice(m, 1, "？");
            }
        }
    }

    flattenCollectedKanjiList = [];
    for (var n = 0; n < levelKanji.length; n++) {
        flattenCollectedKanjiList = flattenCollectedKanjiList.concat(levelKanji[n]);
    }

    flattenCollectedKanjiList = flattenCollectedKanjiList.filter(function (kanji) {
        return kanji !== "？";
    });

}

function loadList() {
    // 外部関数への依存を明示
    loadKanji();

    var kanjiListElement = document.querySelector("#kanji-list");
    kanjiListElement.innerHTML = ''; // リストを初期化
    var fragment = document.createDocumentFragment(); // ドキュメントフラグメントを作成
    var count = 0;

    for (var n = 0; n < levelKanji.length; n++) {
        if (n != 0) {
            var lineDiv = document.createElement('div');
            lineDiv.classList.add('line');
            var lineItem = document.createElement('li');
            lineItem.appendChild(lineDiv);
            fragment.appendChild(lineItem);
        }
        for (var m = 0; m < levelKanji[n].length; m++) {
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            link.setAttribute('onclick', 'kanjiDescription(' + count + ')');
            link.textContent = levelKanji[n][m];
            listItem.appendChild(link);
            fragment.appendChild(listItem);

            count += 1;
            if (levelKanji[n][m] != "？") {
                collectedKanjiList.push(levelKanji[n][m]);
            }
        }
    }

    kanjiListElement.appendChild(fragment); // フラグメントを一度にDOMに挿入
}


function kanjiDescription(num) {
    var flattenLevelKanji = [];
    for (var n = 0; n < Number(level) + 1; n++) {
        flattenLevelKanji = flattenLevelKanji.concat(levelKanji[n]);
    }
    showSection("kanjiDescription");
    if (flattenLevelKanji[num] == "？") {
        document.querySelector("#kanjiDescription").innerHTML = `
<h1 class="title" id="kanjiDescriptionTitle">まだこの漢字をゲットしていないようです...</h1>
<ul class="section-menu">
<li>
    <a href="#main" onclick="showSection('main')">ホーム</a>
</li>
<li>
</li>
</ul>`;
    } else {
        document.querySelector("#kanjiDescription").innerHTML = `
<div class="list-title">
<h1 class="title" id="kanjiDescriptionTitle">漢字「」について</h1>
</div>
<div class="descriptionContainer">
<div id="kanji-description">漢字：</div>
<div id="on-description">音読み：</div>
<div id="kun-description">訓読み：</div>
<div id="bushu-description">部首：</div>
<div id="kakusu-description">画数：</div>
</div>`
        document.querySelector("#kanjiDescriptionTitle").innerHTML = "漢字「" + flattenKanji[num][0] + "」について";
        document.querySelector("#kanji-description").innerHTML = `<p>漢字</p><p>${flattenKanji[num][0]}</p>`;
        if (typeof flattenKanji[num][3] == "object") {
            document.querySelector("#on-description").innerHTML = `<p>音読み</p><p>${flattenKanji[num][3].join("・")}</p>`;
        } else {
            document.querySelector("#on-description").innerHTML = `<p>音読み</p><p>${flattenKanji[num][3]}</p>`;
        }
        if (typeof flattenKanji[num][4] == "object") {
            document.querySelector("#kun-description").innerHTML = `<p>訓読み</p><p>${flattenKanji[num][4].join("・")}</p>`;
        } else {
            document.querySelector("#kun-description").innerHTML = `<p>訓読み</p><p>${flattenKanji[num][4]}</p>`;
        }
        document.querySelector("#bushu-description").innerHTML = `<p>部首</p><p>${flattenKanji[num][1]}</p>`;
        document.querySelector("#kakusu-description").innerHTML = `<p>画数</p><p>${flattenKanji[num][2]}</p>`;
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
    question = "on";
    loadFlattenKanji();
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
    question = "kun";
    loadFlattenKanji();
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

function bushuQuestion() {
    question = "bushu";
    loadFlattenKanji();
    var answerBushu = "";
    while (answerBushu == "") {
        var randomAnswer = Math.floor(Math.random() * flattenKanji.length);
        answerKanji = flattenKanji[randomAnswer][0]
        answerBushu = flattenKanji[randomAnswer][1];
    }
    var random = 0;
    bushuKanji = [];
    bushuKanji.push(answerKanji);
    for (var n = 0; n < 8;) {
        random = Math.floor(Math.random() * flattenKanji.length);
        if (!flattenKanji[random][1].includes(answerBushu) && !bushuKanji.includes(flattenKanji[random][0])) {
            bushuKanji.push(flattenKanji[random][0])
            n += 1;
        }

    }
    bushuKanji = arrayShuffle(bushuKanji);
    document.querySelector("#bushu-kanji-question").innerHTML = "次のうち「" + removeParenthesisContent(answerBushu) + "」が部首である漢字を1つ選べ";
    document.querySelector("#bushu-kanji-list").innerHTML = "";
    for (var n = 0; n < 9; n++) {
        document.querySelector("#bushu-kanji-list").innerHTML += "<li><a onclick='bushuKanjiJudgment(" + n + ")'>" + bushuKanji[n] + "</a></li>";
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

function bushuKanjiJudgment(num) {
    if (answerKanji == bushuKanji[num]) {
        showSection("correct");
    } else {
        showSection("wrong");
    }
}

function replaceAt(str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

function removeParenthesisContent(str) {
    return str.replace(/（.*?）/g, '');
}

function back() {
    showSection(question);
}

function backPage() {
    if (page.length != 1) {
        page.pop();
        showSection(page[page.length - 1]);
        if (sectionList.includes(page[page.length - 1])) {
            location.href = "#" + page[page.length - 1];
        }
    }
}

window.addEventListener("DOMContentLoaded", function () {
    kanjiData();

    loadFlattenKanji();


    loadFlattenKanji();


    if (location.href.includes("#")) {
        var url = location.href.split("#");
        if (url[1] != "" && sectionList.includes(url[1])) {
            showSection(url[1]);
        } else {
            location.href = url[0];
            page.push("main");
        }
    }
});


document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("onf") == null) {
        localStorage.setItem("onf", 0);
        onf = 0;
    } else {
        onf = localStorage.getItem("onf");
    }
    if (onf == "0") {
        document.querySelector('#onf').checked = false;
        document.querySelector('.toggle').classList.remove('checked');
        document.querySelector(".particle").style.display = "none";
    } else {
        document.querySelector('#onf').checked = true;
        document.querySelector('.toggle').classList.add('checked');
        animationId = requestAnimationFrame(textDraw);
        document.querySelector(".particle").style.display = "block";
    }

    document.querySelector('.toggle').addEventListener('click', function () {
        this.classList.toggle('checked');
        if (!document.querySelector('#onf').checked) {
            document.querySelector('#onf').checked = true;
            animationId = requestAnimationFrame(textDraw);
            document.querySelector(".particle").style.display = "block";
            onf = 1;
            localStorage.setItem("onf", 1);
        } else {
            document.querySelector('#onf').checked = false;
            document.querySelector(".particle").style.display = "none";
            cancelAnimationFrame(animationId);
            onf = 0;
            localStorage.setItem("onf", 0);
        }
    });
})