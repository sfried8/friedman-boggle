<template>
    <div class="boggle-board-container">
        <div>
            <div class="boggle-board">
                <div
                    class="boggle-row"
                    :key="row + rowIndex"
                    v-for="(row, rowIndex) in rows"
                >
                    <div
                        class="boggle-cell"
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
                <b-button
                    variant="primary"
                    :disabled="isShuffling"
                    @click="shuffleDice"
                    ><b-icon-shuffle></b-icon-shuffle
                    >&nbsp;&nbsp;Shuffle</b-button
                >
            </div>
        </div>
        <div
            style="width:25%;display:flex;flex-direction:column;justify-content:space-around;"
        >
            <dictionary-tester></dictionary-tester>
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
                            v-for="w in possibleWords"
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
                        <b-list-group-item>
                            View More
                        </b-list-group-item>
                    </b-list-group>
                </b-collapse>
            </div>
        </div>
    </div>
</template>

<script>
import { MakeTrie, BoggleWords } from "../boggle_solver";
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
export default {
    components: { BaseTimer, DictionaryTester, DictionaryEntryPopover },
    data() {
        return {
            rows: [],
            dictionaryTrie: null,
            feliz: null,
            showBestWords: false,
            isShuffling: false,
        };
    },
    mounted() {
        this.feliz = new Audio("FelizNavidad.mp3");
        this.feliz.addEventListener("canplaythrough", () => {
            this.shuffleOnce();
            Dictionary.getDictionary().then((d) => {
                this.dictionaryTrie = new MakeTrie(d);
            });
        });
    },
    methods: {
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
            this.isShuffling = true;
            this.resetClicked();
            this.timerClicked();
            this.feliz.play();
            let done = false;
            setTimeout(() => (done = true), 4000);
            while (!done) {
                this.shuffleOnce();
                await delay(200);
            }
            this.feliz.pause();
            this.timerClicked();
            this.isShuffling = false;
        },
        timerClicked() {
            this.$refs.timer.pause();
        },
        resetClicked() {
            this.$refs.timer.startTimer();
        },
    },
    computed: {
        possibleWords() {
            if (!this.rows.length || !this.dictionaryTrie) {
                return [];
            }
            const words = [
                ...BoggleWords(
                    this.rows.map((r) => r.join("")),
                    this.dictionaryTrie
                ),
            ];
            words.sort((a, b) => {
                if (a.length === b.length) {
                    return a.localeCompare(b);
                }
                return b.length - a.length;
            });
            return words.slice(0, 5).map((w) => w.replace(/Q/, "QU"));
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
</style>
