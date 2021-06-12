
import Dictionary from "../Dictionary";
import { shuffle, isEqualSet } from "../common"
let wordSet = null;
export default {
    data() {
        return {
            letterA: "",
            letterB: "",
            letterC: "",
            letterD: "",
            letterE: "",
            letterF: "",
            letterG: "",
            wordSetInitialized: false,
            foundWords: [],
            pangrams: [],
            showAnswers: false,
            previousWord: "",
        };
    },
    mounted() {
        Dictionary.getWordSet().then((w) => {
            wordSet = w;
            this.wordSetInitialized = true;
        });
    },
    methods: {
        keyup(letterTyped) {
            const currentLetter = this["letter" + letterTyped];
            if (currentLetter.length) {
                if (letterTyped === "A") {
                    this.$refs.letterBInput.focus();
                    this.$refs.letterBInput.select();
                }
                if (letterTyped === "B") {
                    this.$refs.letterCInput.focus();
                    this.$refs.letterCInput.select();
                }
                if (letterTyped === "C") {
                    this.$refs.letterDInput.focus();
                    this.$refs.letterDInput.select();
                }
                if (letterTyped === "D") {
                    this.$refs.letterEInput.focus();
                    this.$refs.letterEInput.select();
                }
                if (letterTyped === "E") {
                    this.$refs.letterFInput.focus();
                    this.$refs.letterFInput.select();
                }
                if (letterTyped === "F") {
                    this.$refs.letterGInput.focus();
                    this.$refs.letterGInput.select();
                }
                if (letterTyped === "G") {
                    this.$refs.letterAInput.focus();
                    this.$refs.letterAInput.select();
                }
            }
        },
        findWords() {
            this.previousWord = this.currentWord;
            const letterSet = new Set(this.letters);
            const requiredLetter = this.letterD.toUpperCase();
            const resultingWords = wordSet.filter((w) => {
                if (w.length < 4) {
                    return false;
                }
                const wordLetterSet = new Set([...w]);
                if (!wordLetterSet.has(requiredLetter)) {
                    return false;
                }
                return [...w].every((l) => letterSet.has(l));
            });
            resultingWords.sort((a, b) => {
                const aSet = new Set([...a]);
                const bSet = new Set([...b]);
                if (aSet.size === 7 && bSet.size !== 7) {
                    return -1;
                }
                if (bSet.size === 7 && aSet.size !== 7) {
                    return 1;
                }
                if (a.length !== b.length) {
                    return b.length - a.length;
                }
                return a.localeCompare(b);
            });
            this.foundWords = resultingWords;
            this.pangrams = this.foundWords.filter((w) => {
                const l = new Set([...w]).size;
                console.log(w + ": " + l);
                return l === 7;
            });
        },
        shuffleLetters() {
            const lettersToShuffle = [this.letterA, this.letterB, this.letterC, this.letterE, this.letterF, this.letterG];
            shuffle(lettersToShuffle);
            [this.letterA, this.letterB, this.letterC, this.letterE, this.letterF, this.letterG] = lettersToShuffle
        }
    },
    computed: {
    currentWord() {
    return new Set(this.letters)
    },
    shouldShowGoButton() {
        return !isEqualSet(this.currentWord, this.previousWord)
    },
        letters() {
            return [
                this.letterA.toUpperCase(),
                this.letterB.toUpperCase(),
                this.letterC.toUpperCase(),
                this.letterD.toUpperCase(),
                this.letterE.toUpperCase(),
                this.letterF.toUpperCase(),
                this.letterG.toUpperCase(),
            ];
        },
        allLettersSet() {
            return (
                this.letterA.length === 1 &&
                this.letterB.length === 1 &&
                this.letterC.length === 1 &&
                this.letterD.length === 1 &&
                this.letterE.length === 1 &&
                this.letterF.length === 1 &&
                this.letterG.length === 1
            );
        },
    },
};