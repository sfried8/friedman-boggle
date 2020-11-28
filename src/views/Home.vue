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
                    <b-btn variant="warn" @click="getWordListWithoutDefinitions"
                        ><b-icon-plus></b-icon-plus>&nbsp; &nbsp; Get words
                        without definitions</b-btn
                    >
                </div>
                <div style="margin:10px;">
                    <b-btn @click="goToGame"
                        >Play Boggle without Dictionary</b-btn
                    >
                </div>
                <b-modal id="uploadfile" title="Upload Dictionary File">
                    <b-form-file
                        v-if="!dictionaryIsLoading"
                        @change="(f) => fileChange(f)"
                    ></b-form-file>
                    <div v-else>
                        <div>
                            Uploading, please wait...
                        </div>
                        <div>
                            This will take a little while, but you'll only need
                            to do it once!
                        </div>
                        <b-progress
                            :value="dictionaryUploadProgress"
                            :max="100"
                            animated
                        ></b-progress>
                    </div>
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
            dictionaryUploadProgress: 0,
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
            this.dictionaryIsLoading = true;
            Dictionary.uploadDictionary(event.target.files[0], (progress) => {
                this.dictionaryUploadProgress = progress * 100;
            })
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
        getWordListWithoutDefinitions() {
            Dictionary.getWordListWithoutDefinitions()
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
