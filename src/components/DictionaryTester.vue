<template>
  <div>
    <div class="dictionary-tester" v-if="dictionaryIsInitialized">
      <b-form-input @submit="submit" @keypress.enter="submit" placeholder="Check Dictionary" v-model="query" />
      <div class="query" v-if="definitionToShow">{{ precedentRejectionToShow }}{{
        wordToShow.toUpperCase() }} {{ definition && !overriddenDefinition && pointTotal ? `(${pointTotal})` : "" }}
      </div>
      <div class="definition">{{ definitionToShow }}</div>
      <b-button v-if="query && definition && !overriddenDefinition" @click="toggleRejection">{{ !precedentRejection ?
        "Reject?" : "Accept?" }}</b-button>
    </div>
    <div v-else-if="needsDictionaryUpload">
      No Dictionary Data Found
      <input type="file" ref="dictionaryfileinput" @change="fileChange" name="dictfile" />
    </div>
    <div v-else>Loading dictionary data</div>
  </div>
</template>

<script>
import Dictionary from "../Dictionary";
export default {
  props: ["show-score", "force-definition"],
  data() {
    return {
      query: "",
      definition: "",
      overriddenDefinition: "",
      precedentRejection: false,
      overriddenPrecedentRejection: false,
      loadingMessage: "Loading dictionary data...",
      dictionaryIsInitialized: false,
      needsDictionaryUpload: false,
    };
  },
  mounted() {
    this.tryInitializing();
  },
  methods: {
    tryInitializing() {
      Dictionary.getDictionaryTrie()
        .then(() => {
          this.dictionaryIsInitialized = true;
          this.needsDictionaryUpload = false;
        })
        .catch(() => {
          this.needsDictionaryUpload = true;
        });
    },
    fileChange(event) {
      Dictionary.uploadDictionary(event.target.files[0]).then(() =>
        this.tryInitializing()
      );
    },
    submit() {
      this.$emit("submit-guess", this.query);
      this.query = "";
      this.definition = "";
      this.precedentRejection = false;
    },
    toggleRejection() {
      Dictionary.setPrecedentRejection(this.query, !this.precedentRejection);
      this.precedentRejection = !this.precedentRejection;
    },

  },
  watch: {
    query: function () {
      this.$emit("changeword", this.query.toUpperCase());
      Dictionary.getDefinition(this.query).then((d) => {
        this.definition = d.definition;
        this.precedentRejection = d.precedentRejection;
      });
    },
    forceDefinition() {
      if (this.forceDefinition) {
        Dictionary.getDefinition(this.forceDefinition).then(
          (d) => {
            this.overriddenDefinition = d.definition;
            this.overriddenPrecedentRejection = d.precedentRejection;
          }
        );
      } else {
        this.overriddenDefinition = "";
        this.overriddenPrecedentRejection = false;
      }
    },
  },
  computed: {
    pointTotal() {
      if (this.showScore && !this.forceDefinition) {
        const qLen = this.query.length;
        if (qLen < 4) {
          return "0";
        }
        if (qLen === 4) {
          return "1";
        }
        if (qLen === 5) {
          return "2";
        }
        if (qLen === 6) {
          return "3";
        }
        if (qLen === 7) {
          return "5";
        }
        if (qLen >= 8) {
          return "11";
        }
      }
      return "";
    },
    wordToShow() {
      return this.forceDefinition || this.query;
    },
    definitionToShow() {
      return this.overriddenDefinition || this.definition;
    },
    precedentRejectionToShow() {
      const isRejected = this.overriddenDefinition ? this.overriddenPrecedentRejection : this.precedentRejection;
      return isRejected ? "🚫 " : "";
    },
  },
};
</script>

<style>
.point-total,
.query {
  font-size: 3rem;
}

.dictionary-tester {
  height: 30vh;
  overflow-y: auto;
}
</style>
