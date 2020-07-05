<template>
    <div>
        <div v-if="dictionary">
            <input type="text" v-model="query" />
            <div>{{ definition }}</div>
        </div>
        <div v-else>Loading dictionary data</div>
    </div>
</template>

<script>
import Dictionary from "../Dictionary";
export default {
    data() {
        return {
            dictionary: null,
            query: "",
            definition: "",
            loadingMessage: "Loading dictionary data...",
        };
    },
    mounted() {
        Dictionary.getDictionary().then((d) => {
            this.dictionary = d;
        });
    },
    watch: {
        query: function() {
            Dictionary.getDefinition(this.query).then(
                (d) => (this.definition = d)
            );
        },
    },
    computed: {
        isValid() {
            return this.query && this.dictionary.has(this.query.toUpperCase());
        },
    },
};
</script>

<style></style>
