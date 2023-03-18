<template>
  <b-popover :target="target" triggers="hover" placement="right">
    {{ word }} - {{ definition }}
  </b-popover>
</template>

<script>
import Dictionary from "../Dictionary";
export default {
  props: ["target", "word"],
  data() {
    return {
      definition: "",
    };
  },
  watch: {
    word: {
      handler: function () {
        this.definition = "Loading...";
        Dictionary.getDefinition(this.word).then((r) => (this.definition = r));
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
