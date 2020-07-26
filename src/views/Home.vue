<template>
    <div class="home">
        <h1>Friedman Family and Friends Boggle!</h1>
        <h3>Dictionary</h3>
        <div>{{ dictionaryMessage }}</div>
        <div>
            <b-btn
                variant="success"
                :disabled="dictionaryIsLoading"
                @click="goToGame"
            >
                Play</b-btn
            >
        </div>
    </div>
</template>

<script>
import Dictionary from "../Dictionary";
import router from "../router";

export default {
    data() {
        return {
            dictionaryIsLoading: true,
            dictionaryIsMissing: false,
        };
    },
    mounted() {
        Dictionary.getDictionaryTrie().then((dictionaryTrie) => {
            this.dictionaryIsLoading = false;
            this.dictionaryIsMissing = !dictionaryTrie;
        });
    },
    computed: {
        dictionaryMessage() {
            if (this.dictionaryIsLoading) {
                return "Loading...";
            } else if (this.dictionaryIsMissing) {
                return "No dictionary data found!";
            }
            return "Dictionary Data Loaded!";
        },
    },
    methods: {
        goToGame() {
            router.push("game");
        },
    },
    name: "Home",
};
</script>
