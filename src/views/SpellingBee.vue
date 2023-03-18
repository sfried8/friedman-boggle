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

    <b-btn
      id="go-button"
      variant="success"
      @click="findWords"
      :disabled="!wordSetInitialized || !allLettersSet"
    >
      GO
    </b-btn>
    <div
      v-for="w in foundWords"
      :key="w"
      :class="{ pangram: pangrams.includes(w) }"
    >
      {{ w }}
    </div>
  </div>
</template>

<script>
import Dictionary from "../Dictionary";
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
  },
  computed: {
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
</script>

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
