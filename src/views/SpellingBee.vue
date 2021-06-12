<template>
    <div>
        <ul id="grid" class="clear">
            <li></li>
            <li>
                <div class="hexagon">
                    <input
                        type="text"
                        v-model="letterA"
                        ref="letterAInput"
                        @keypress.enter="findWords"
                        @keyup="keyup('A')"
                        maxlength="1"
                    />
                </div>
            </li>
            <li>
                <div class="hexagon">
                    <input
                        type="text"
                        v-model="letterB"
                        ref="letterBInput"
                        @keypress.enter="findWords"
                        @keyup="keyup('B')"
                        maxlength="1"
                    />
                </div>
            </li>
            <li>
                <div class="hexagon">
                    <input
                        type="text"
                        v-model="letterC"
                        ref="letterCInput"
                        @keypress.enter="findWords"
                        @keyup="keyup('C')"
                        maxlength="1"
                    />
                </div>
            </li>
            <li>
                <div class="hexagon required-hexagon">
                    <input
                        type="text"
                        v-model="letterD"
                        ref="letterDInput"
                        @keypress.enter="findWords"
                        @keyup="keyup('D')"
                        maxlength="1"
                    />
                </div>
            </li>
            <li>
                <div class="hexagon">
                    <input
                        type="text"
                        v-model="letterE"
                        ref="letterEInput"
                        @keypress.enter="findWords"
                        @keyup="keyup('E')"
                        maxlength="1"
                    />
                </div>
            </li>
            <li></li>
            <li>
                <div class="hexagon">
                    <input
                        type="text"
                        v-model="letterF"
                        ref="letterFInput"
                        @keypress.enter="findWords"
                        @keyup="keyup('F')"
                        maxlength="1"
                    />
                </div>
            </li>
            <li>
                <div class="hexagon">
                    <input
                        type="text"
                        v-model="letterG"
                        ref="letterGInput"
                        @keypress.enter="findWords"
                        @keyup="keyup('G')"
                        maxlength="1"
                    />
                </div>
            </li>
        </ul>

        <br />
        <br />
        <br />
        <b-btn id="shuffle-button" variant="success" @click="shuffleLetters">
            Shuffle Letters
        </b-btn>
        <br />
        <b-btn
            v-if="shouldShowGoButton"
            id="go-button"
            variant="success"
            @click="findWords"
            :disabled="!wordSetInitialized || !allLettersSet"
        >
            GO
        </b-btn>
        <br />
        <b-btn
            v-if="foundWords.length"
            id="show-answers-button"
            variant="warning"
            @click="showAnswers = !showAnswers"
        >
            {{ showAnswers ? "Hide Answers" : "Show Answers" }}
        </b-btn>
        <div v-if="showAnswers">
            <div
                v-for="w in foundWords"
                :key="w"
                :class="{ pangram: pangrams.includes(w) }"
            >
                {{ w }}
            </div>
        </div>
    </div>
</template>

<script src="./SpellingBee.js"></script>

<style>
#grid {
    position: relative;
    width: 30%;
    margin: 0 auto;
    padding: 0; /* Clears unordered list default of 40px */
    -o-transform: rotate(30deg);
    -moz-transform: rotate(30deg);
    -webkit-transform: rotate(30deg);
    -ms-transform: rotate(30deg);
    transform: rotate(30deg);
}
#go-button {
    margin-top: 30px;
    margin-left: 3.46%;
}
.clear:after {
    content: "";
    display: block;
    clear: both;
}
#grid li {
    list-style-type: none;
    position: relative;
    float: left;
    width: 27.85714285714286%;
    padding: 0 0 32.16760145166612% 0;
    -o-transform: rotate(-60deg) skewY(30deg);
    -moz-transform: rotate(-60deg) skewY(30deg);
    -webkit-transform: rotate(-60deg) skewY(30deg);
    -ms-transform: rotate(-60deg) skewY(30deg);
    transform: rotate(-60deg) skewY(30deg);
    background: #fd005f;
    overflow: hidden;
    visibility: hidden;
}
#grid li:nth-child(3n + 2) {
    margin: 0 1%;
}
#grid li:nth-child(6n + 4),
#grid li:nth-child(6n + 5),
#grid li:nth-child(6n + 6) {
    margin-top: -6.9285714285%;
    margin-bottom: -6.9285714285%;
    -o-transform: translateX(50%) rotate(-60deg) skewY(30deg);
    -moz-transform: translateX(50%) rotate(-60deg) skewY(30deg);
    -webkit-transform: translateX(50%) rotate(-60deg) skewY(30deg);
    -ms-transform: translateX(50%) rotate(-60deg) skewY(30deg);
    transform: translateX(50%) rotate(-60deg) skewY(30deg);
}
#grid li * {
    visibility: visible;
}
#grid li .hexagon {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #dddddd;
    -o-transform: skewY(-30deg) rotate(60deg);
    -moz-transform: skewY(-30deg) rotate(60deg);
    -webkit-transform: skewY(-30deg) rotate(60deg);
    -ms-transform: skewY(-30deg) rotate(60deg);
    transform: skewY(-30deg) rotate(60deg);
    overflow: hidden;
}
#grid li .hexagon.required-hexagon {
    background: #fdbf00;
}
#grid li .hexagon input {
    position: relative;
    height: 100%;
    width: 100%;
    left: 3px;
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    -webkit-appearance: none;
    outline: none;
    background: #dddddd;
    -o-transform: rotate(-30deg);
    -moz-transform: rotate(-30deg);
    -webkit-transform: rotate(-30deg);
    -ms-transform: rotate(-30deg);
    transform: rotate(-30deg);
    border-top-style: hidden;
    border-right-style: hidden;
    border-left-style: hidden;
    border-bottom-style: hidden;
    background-color: transparent;
}
#grid li .hexagon input:focus {
    outline: none;
}
.pangram {
    background: #fdbf00;
}
</style>
