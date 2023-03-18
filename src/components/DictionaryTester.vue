<template>
  <div>
    <div v-if="dictionaryIsInitialized">
      <b-form-input
        @submit="submit"
        @keypress.enter="submit"
        placeholder="Check Dictionary"
        v-model="query"
      />
      <div>{{ definition }}</div>
      <div class="point-total">{{ pointTotal }}</div>
    </div>
    <div v-else-if="needsDictionaryUpload">
      No Dictionary Data Found
      <input
        type="file"
        ref="dictionaryfileinput"
        @change="fileChange"
        name="dictfile"
      />
    </div>
    <div v-else>Loading dictionary data</div>
  </div>
</template>

<script>
import Dictionary from "../Dictionary";
export default {
  props: ["show-score"],
  data() {
    return {
      query: "",
      definition: "",
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
    },
  },
  watch: {
    query: function () {
      this.$emit("changeword", this.query.toUpperCase());
      Dictionary.getDefinition(this.query).then((d) => (this.definition = d));
    },
  },
  computed: {
    pointTotal() {
      if (this.definition && this.showScore) {
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
  },
};
</script>

<style>
.point-total {
  font-size: 3rem;
}
</style>
