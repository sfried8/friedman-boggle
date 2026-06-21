<template>
  <b-popover :target="target" triggers="hover" placement="right">
    {{ precedentRejection ? "🚫 " : "" }}{{ word }} - {{ definition }}
  </b-popover>
</template>

<script>
import Dictionary from "../Dictionary";
export default {
  props: ["target", "word"],
  data() {
    return {
      definition: "",
      precedentRejection: false,
    };
  },
  watch: {
    word: {
      handler: function () {
        this.definition = "Loading...";
        Dictionary.getDefinition(this.word).then((r) => {
          this.definition = r.definition;
          this.precedentRejection = r.precedentRejection;
        });
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
