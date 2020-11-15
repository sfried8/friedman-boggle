<template>
    <div class="boggle-board-container">
        <div>
            <div class="boggle-board">
                <div
                    class="boggle-row"
                    :key="JSON.stringify(row) + rowIndex"
                    v-for="(row, rowIndex) in rows"
                >
                    <div
                        :class="{
                            'boggle-cell': true,
                            'boggle-cell-highlighted':
                                highlightedCells[letterIndex][rowIndex],
                        }"
                        :key="letter + letterIndex"
                        v-for="(letter, letterIndex) in row"
                    >
                        {{ letter
                        }}<span v-if="letter === 'Q'" class="boggle-cell-qu"
                            >u</span
                        >
                    </div>
                </div>
            </div>
        </div>
        <div
            style="width:25%;display:flex;flex-direction:column;justify-content:space-around;"
        >
            <div>
                <base-timer
                    ref="timer"
                    @click.native="timerClicked"
                ></base-timer>
                <b-button @click="resetClicked"
                    ><b-icon-arrow-clockwise></b-icon-arrow-clockwise
                    >&nbsp;&nbsp;Restart Timer</b-button
                >
            </div>
            <div>
                <div v-if="!isShuffling">
                    <div>Difficulty: {{ difficultyRating }}</div>
                    <div>Possible Words: {{ numPossible }}</div>
                    <div>Max Score: {{ possibleScore }}</div>
                </div>
                <br />
                <div>
                    <input
                        type="checkbox"
                        name="allowEasy"
                        v-model="allowedDifficultyEasy"
                    /><label for="allowEasy">Easy</label>
                    <input
                        type="checkbox"
                        name="allowNormal"
                        v-model="allowedDifficultyNormal"
                    /><label for="allowNormal">Normal</label>
                    <input
                        type="checkbox"
                        name="allowTough"
                        v-model="allowedDifficultyTough"
                    /><label for="allowTough">Tough</label>
                    <input
                        type="checkbox"
                        name="allowVeryHard"
                        v-model="allowedDifficultyVeryHard"
                    /><label for="allowVeryHard">Very Hard</label>
                </div>
                <b-button
                    variant="primary"
                    :disabled="isShuffling || allowedDifficulties.length === 0"
                    @click="shuffleDice"
                    ><b-icon-shuffle></b-icon-shuffle
                    >&nbsp;&nbsp;Shuffle</b-button
                >
                <br />
                <b-button
                    variant="primary"
                    :disabled="isShuffling || !undoStack.length"
                    @click="undo"
                    ><b-icon-arrow-left-short></b-icon-arrow-left-short
                    >&nbsp;&nbsp;</b-button
                >
                <b-button
                    variant="primary"
                    :disabled="isShuffling || !redoStack.length"
                    @click="redo"
                    ><b-icon-arrow-right-short></b-icon-arrow-right-short
                    >&nbsp;&nbsp;</b-button
                >
                <!-- <b-button
                    variant="primary"
                    :disabled="isShuffling"
                    @click="shuffleOnce"
                    ><b-icon-shuffle></b-icon-shuffle>&nbsp;&nbsp;Shuffle
                    Once</b-button
                > -->
                <input type="file" @change="felizChange" v-if="!feliz" />
            </div>
        </div>
        <div
            v-if="dictionaryTrie"
            style="width:25%;display:flex;flex-direction:column;justify-content:space-around;"
        >
            <dictionary-tester
                @changeword="mouseEnterDictEntry"
            ></dictionary-tester>
            <div>
                <b-button
                    style="width:100%"
                    variant="outline-secondary"
                    @click="showBestWords = !showBestWords"
                >
                    <b-icon
                        :icon="'chevron-' + (showBestWords ? 'up' : 'down')"
                    ></b-icon>
                    {{ (showBestWords ? "  Hide" : "  Show") + " best words" }}
                </b-button>
                <b-collapse v-model="showBestWords">
                    <b-list-group>
                        <b-list-group-item
                            v-for="w in bestWords"
                            @mouseenter="mouseEnterDictEntry(w)"
                            @mouseleave="mouseLeaveDictEntry"
                            :key="w"
                            :id="'bestwords-entry-' + w"
                        >
                            {{ w }}
                            <dictionary-entry-popover
                                :target="'bestwords-entry-' + w"
                                :word="w"
                            >
                            </dictionary-entry-popover>
                        </b-list-group-item>
                    </b-list-group>
                </b-collapse>
            </div>
        </div>
    </div>
</template>

<script>
import { BoggleWords } from "../boggle_solver";
import BaseTimer from "./BaseTimer.vue";
import DictionaryEntryPopover from "./DictionaryEntryPopover.vue";
import DictionaryTester from "./DictionaryTester.vue";
import Dictionary from "../Dictionary";
const BOGGLE_DICE = [
    "AAEEGN",
    "ABBJOO",
    "ACHOPS",
    "AFFKPS",
    "AOOTTW",
    "CIMOTU",
    "DEILRX",
    "DELRVY",
    "DISTTY",
    "EEGHNW",
    "EEINSU",
    "EHRTVW",
    "EIOSST",
    "ELRTTY",
    "HIMNQU",
    "HLNNRZ",
];
const DIFFICULTY_RATING = {
    EASY: "Easy",
    NORMAL: "Normal",
    TOUGH: "Tough",
    VERY_HARD: "Very Hard",
};
const backlog = {
    [DIFFICULTY_RATING.EASY]: [],
    [DIFFICULTY_RATING.NORMAL]: [],
    [DIFFICULTY_RATING.TOUGH]: [],
    [DIFFICULTY_RATING.VERY_HARD]: [],
};
function shuffle(array) {
    let currentIndex = array.length;

    while (0 !== currentIndex) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        const temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
function delay(ms) {
    return new Promise((res) => {
        return setTimeout(res, ms);
    });
}
function score(word) {
    if (!word || word.length < 4) {
        return 0;
    }
    if (word.length === 4) {
        return 1;
    } else if (word.length === 5) {
        return 2;
    } else if (word.length === 6) {
        return 3;
    } else if (word.length === 7) {
        return 5;
    } else {
        return 11;
    }
}
let dictionaryTrie = null;
export default {
    components: { BaseTimer, DictionaryTester, DictionaryEntryPopover },
    data() {
        return {
            rows: [
                ["F", "R", "I", "E"],
                ["D", "M", "A", "N"],
                ["B", "O", "G", "G"],
                ["L", "E", "!", "!"],
            ],
            dictionaryTrie: false,
            feliz: null,
            showBestWords: false,
            isShuffling: false,
            commonWords: [],
            difficultyRating: "",
            highlightedCells: [
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false],
            ],
            undoStack: [],
            redoStack: [],
            allowedDifficultyEasy: true,
            allowedDifficultyNormal: true,
            allowedDifficultyTough: true,
            allowedDifficultyVeryHard: true,
        };
    },
    mounted() {
        const storage = window.localStorage.getItem("history");
        if (storage) {
            const { undoStack, redoStack, boardString } = JSON.parse(storage);
            this.undoStack = undoStack || [];
            this.redoStack = redoStack || [];
            if (boardString) {
                this.setBoardFromString(boardString);
            }
        }
        this.initializeFeliz().then(() => this.initializeDictionary());
    },
    methods: {
        async initializeFeliz() {
            const s = await Dictionary.getSound("shake");
            if (s) {
                return new Promise((res) => {
                    const felizAudio = new Audio(
                        URL.createObjectURL(s.content)
                    );
                    felizAudio.addEventListener("canplaythrough", () => {
                        this.feliz = felizAudio;
                        res();
                    });
                });
            }
        },

        async initializeDictionary() {
            dictionaryTrie = await Dictionary.getDictionaryTrie();
            this.dictionaryTrie = true;
        },
        felizChange(e) {
            Dictionary.uploadSound(e.target.files[0]).then(() =>
                this.initializeFeliz()
            );
        },
        mouseEnterDictEntry(w) {
            this.mouseLeaveDictEntry();
            setTimeout(() => {
                if (this.possibleWords[w]) {
                    for (const location of this.possibleWords[w]) {
                        this.highlightedCells[location[0]][location[1]] = true;
                        this.highlightedCells = JSON.parse(
                            JSON.stringify(this.highlightedCells)
                        );
                    }
                }
            }, 0);
        },
        mouseLeaveDictEntry() {
            this.highlightedCells = [
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false],
            ];
        },
        shuffleOnce() {
            this.showBestWords = false;
            this.rows = [];
            const letters = BOGGLE_DICE.map((d) =>
                d.charAt(~~(Math.random() * 6))
            );
            shuffle(letters);
            for (let i = 0; i < 4; i++) {
                this.rows.push([]);
                for (let j = 0; j < 4; j++) {
                    const letter = letters[4 * i + j];
                    this.rows[i].push(letter);
                }
            }
        },
        async shuffleDice() {
            this.difficultyRating = "";
            this.isShuffling = true;
            this.resetClicked();
            this.timerClicked();
            this.redoStack = [];
            this.undoStack.push(this.boardString);
            if (this.feliz) {
                this.feliz.play();
            }
            this.mouseLeaveDictEntry();
            let done = false;
            setTimeout(() => (done = true), 4000);
            while (!done) {
                const currentTime = Date.now();
                this.shuffleOnce();
                const currentBoardString = this.boardString;
                const commonWords = await Dictionary.getCommon(
                    Object.keys(this.possibleWords)
                );
                this.commonWords = commonWords;
                this.updateDifficulty();
                const difficultyBacklog = backlog[this.difficultyRating];
                if (difficultyBacklog.length < 20) {
                    difficultyBacklog.push(currentBoardString);
                }

                // }
                await delay(Math.max(0, 200 - (Date.now() - currentTime)));
            }

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const commonWords = await Dictionary.getCommon(
                    Object.keys(this.possibleWords)
                );
                this.commonWords = commonWords;
                this.updateDifficulty();
                if (!this.allowedDifficulties.includes(this.difficultyRating)) {
                    const nextBoard = backlog[
                        this.getRandomAllowedDifficulty()
                    ].pop();
                    if (nextBoard) {
                        this.setBoardFromString(nextBoard);
                        break;
                    } else {
                        console.log(backlog);
                        this.shuffleOnce();
                    }
                } else {
                    break;
                }
            }
            if (this.feliz) {
                this.feliz.pause();
            }
            this.isShuffling = false;
            Object.keys(this.possibleWords).forEach((w) => {
                console.log(w + " (" + score(w) + ")");
            });
            // this.shuffleOnce();
            this.timerClicked();
            // window.localStorage.setItem(J);
            // this.difficultyRating = numCommon + "/" + possibleWords.length;
        },
        undo() {
            const lastBoard = this.undoStack.pop();
            this.redoStack.push(this.boardString);
            this.setBoardFromString(lastBoard);
        },
        redo() {
            const nextBoard = this.redoStack.pop();
            this.undoStack.push(this.boardString);
            this.setBoardFromString(nextBoard);
        },
        setBoardFromString(boardString) {
            const newRows = [];
            for (let i = 0; i < 4; i++) {
                newRows.push([]);
                for (let j = 0; j < 4; j++) {
                    newRows[i].push(boardString.charAt(4 * i + j));
                }
            }
            this.rows = newRows;
        },
        updateDifficulty() {
            if (!this.dictionaryTrie) {
                this.difficultyRating = "";
                return;
            }
            const possibleWords = Object.keys(this.possibleWords).filter(
                (w) => w.length > 3
            );
            let numCommon = this.commonWords.filter((w) => w.length > 3).length;
            if (possibleWords.length < 1) {
                this.difficultyRating = "No valid words found!";
            } else if (possibleWords.length < 10 || numCommon < 8) {
                this.difficultyRating = DIFFICULTY_RATING.VERY_HARD;
            } else if (numCommon < 17) {
                this.difficultyRating = DIFFICULTY_RATING.TOUGH;
            } else if (numCommon > 40) {
                this.difficultyRating = DIFFICULTY_RATING.EASY;
            } else {
                this.difficultyRating = DIFFICULTY_RATING.NORMAL;
            }
        },
        timerClicked() {
            this.$refs.timer.pause();
        },
        resetClicked() {
            this.$refs.timer.startTimer();
        },
        getRandomAllowedDifficulty() {
            const diffs = this.allowedDifficulties;
            const index = Math.floor(Math.random() * diffs.length);
            return diffs[index];
        },
    },
    watch: {
        possibleWords() {
            if (!this.isShuffling) {
                Dictionary.getCommon(Object.keys(this.possibleWords)).then(
                    (c) => {
                        this.commonWords = c;
                        this.updateDifficulty();
                    }
                );
            }
        },
        boardString(val) {
            window.localStorage.setItem(
                "history",
                JSON.stringify({
                    boardString: val,
                    undoStack: this.undoStack,
                    redoStack: this.redoStack,
                })
            );
        },
    },
    computed: {
        allowedDifficulties() {
            const r = [];
            if (this.allowedDifficultyEasy) {
                r.push(DIFFICULTY_RATING.EASY);
            }
            if (this.allowedDifficultyNormal) {
                r.push(DIFFICULTY_RATING.NORMAL);
            }
            if (this.allowedDifficultyTough) {
                r.push(DIFFICULTY_RATING.TOUGH);
            }
            if (this.allowedDifficultyVeryHard) {
                r.push(DIFFICULTY_RATING.VERY_HARD);
            }
            return r;
        },
        possibleWords() {
            if (!this.rows.length || !this.dictionaryTrie) {
                return {};
            }
            const allWords = BoggleWords(
                this.rows.map((r) => r.join("")),
                dictionaryTrie
            );
            const validWords = {};
            for (const w in allWords) {
                if (w.length > 3) {
                    validWords[w] = allWords[w];
                }
            }
            return validWords;
        },
        bestWords() {
            const best = this.commonWords.filter((w) => w.length > 3);
            best.sort((a, b) => {
                if (a.length === b.length) {
                    return a.localeCompare(b);
                }
                return b.length - a.length;
            });
            const bestWord = Object.keys(this.possibleWords)
                .filter((w) => w.length > 3)
                .sort((a, b) => {
                    if (a.length === b.length) {
                        return a.localeCompare(b);
                    }
                    return b.length - a.length;
                })[0];
            // return bestWord;
            const top5 = best.slice(0, 5);
            if (
                bestWord &&
                top5.length > 0 &&
                !top5.includes(bestWord) &&
                bestWord.length > top5[0].length
            ) {
                top5.splice(0, 0, bestWord);
            } else {
                top5.push(best[5]);
            }
            return top5;
        },
        numPossible() {
            return Object.keys(this.possibleWords).length;
        },
        possibleScore() {
            return Object.keys(this.possibleWords).reduce(
                (a, x) => a + score(x),
                0
            );
        },
        boardString() {
            const s = this.rows.map((r) => r.join("")).join("");
            if (!s || s.length != 16) {
                return "";
            }

            return s;
        },
    },
};
</script>

<style>
.boggle-board-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.boggle-board {
    font-size: 14.4vh;
    vertical-align: middle;
    width: 80vh;
    height: 80vh;
    margin: 0 5vh 5vh 5vh;
}
.boggle-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    line-height: 133%;
    /* height: calc(25% - 6px); */
}
.boggle-cell {
    width: calc(25% - 6px);
    /* height: calc(100% - 6px); */
    border: 3px solid grey;
}
.boggle-cell-qu {
    font-size: 12.5vh;
}
.boggle-cell-highlighted {
    background-color: rgb(85, 204, 151);
}
</style>
