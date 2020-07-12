<template>
    <div>
        <div v-if="dictionaryIsInitialized">
            <b-form-input placeholder="Check Dictionary" v-model="query" />
            <div>{{ definition }}</div>
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
    },
    watch: {
        query: function() {
            this.$emit("changeword", this.query.toUpperCase());
            Dictionary.getDefinition(this.query).then(
                (d) => (this.definition = d)
            );
        },
    },
};
</script>

<style></style>
