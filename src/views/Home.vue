<template>
    <div class="home">
        <h1>Friedman Family and Friends Boggle!</h1>
        <div style="margin:25vh;">
            <h3>Dictionary</h3>
            <div>{{ dictionaryMessage }}</div>
            <div v-if="dictionaryIsMissing">
                <div style="margin:10px;">
                    <b-btn variant="success" v-b-modal.uploadfile
                        ><b-icon-plus></b-icon-plus>&nbsp; &nbsp; Upload
                        Dictionary File</b-btn
                    >
                </div>
                <div style="margin:10px;">
                    <b-btn @click="goToGame"
                        >Play Boggle without Dictionary</b-btn
                    >
                </div>
                <b-modal id="uploadfile" title="Upload Dictionary File">
                    <b-form-file @change="fileChange"></b-form-file>
                </b-modal>
            </div>
            <div v-else>
                <b-btn
                    variant="success"
                    :disabled="dictionaryIsLoading"
                    @click="goToGame"
                >
                    Play</b-btn
                >
            </div>
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
        Dictionary.getDictionaryTrie()
            .then((dictionaryTrie) => {
                this.dictionaryIsLoading = false;
                this.dictionaryIsMissing = !dictionaryTrie;
            })
            .catch(() => {
                this.dictionaryIsMissing = true;
                this.dictionaryIsLoading = false;
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
        fileChange(event) {
            Dictionary.uploadDictionary(event.target.files[0])
                .then(() => Dictionary.getDictionaryTrie())
                .then((dictionaryTrie) => {
                    this.dictionaryIsLoading = false;
                    this.dictionaryIsMissing = !dictionaryTrie;
                })
                .catch(() => {
                    this.dictionaryIsMissing = true;
                    this.dictionaryIsLoading = false;
                });
        },
    },
    name: "Home",
};
</script>
