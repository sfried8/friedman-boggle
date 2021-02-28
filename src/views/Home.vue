<template>
    <div class="home">
        <b-overlay
            :show="dictionaryIsUploading"
            no-wrap
            blur="15px"
            variant="dark"
        >
            <template #overlay>
                <div class="text-center p-4 text-light rounded">
                    <div>
                        Parsing Dictionary, please wait...
                    </div>
                    <div class="p-3">
                        This will take a little while, but you'll only need to
                        do it once!
                    </div>
                    <div>
                        <b-progress
                            :value="dictionaryUploadProgress"
                            :max="100"
                            animated
                        ></b-progress>
                    </div>
                </div>
            </template>
        </b-overlay>
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
                    <b-btn
                        variant="warning"
                        @click="getWordListWithoutDefinitions"
                        ><b-icon-plus></b-icon-plus>&nbsp; &nbsp; Get words
                        without definitions</b-btn
                    >
                </div>
                <div style="margin:10px;">
                    <b-btn @click="goToGame"
                        >Play Boggle without Dictionary</b-btn
                    >
                </div>
                <b-modal
                    id="uploadfile"
                    title="Upload Dictionary File"
                    @ok="fileChange"
                    @cancel="pendingFile = null"
                    :ok-disabled="!pendingFile"
                >
                    <b-form-file
                        v-if="!dictionaryIsLoading"
                        @change="(f) => (pendingFile = f.target.files[0])"
                    ></b-form-file>
                </b-modal>
            </div>
            <div v-else>
                <b-btn
                    variant="success"
                    :disabled="dictionaryIsLoading"
                    @click="goToGame"
                >
                    Play Boggle</b-btn
                >
                <br />
                <br />
                <b-btn
                    variant="success"
                    :disabled="dictionaryIsLoading"
                    @click="$router.push('bee')"
                >
                    NYT Spelling Bee</b-btn
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
            dictionaryIsUploading: false,
            dictionaryIsMissing: false,
            dictionaryUploadProgress: 0,
            pendingFile: null,
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
            if (!this.pendingFile) {
                event.preventDefault();
                return;
            }
            this.dictionaryIsUploading = true;
            Dictionary.uploadDictionary(this.pendingFile, (progress) => {
                this.dictionaryUploadProgress = progress * 100;
            })
                .then(() => Dictionary.getDictionaryTrie())
                .then((dictionaryTrie) => {
                    this.dictionaryIsLoading = false;
                    this.dictionaryIsUploading = false;

                    this.dictionaryIsMissing = !dictionaryTrie;
                })
                .catch(() => {
                    this.dictionaryIsMissing = true;
                    this.dictionaryIsLoading = false;
                    this.dictionaryIsUploading = false;
                });
        },
        getWordListWithoutDefinitions() {
            this.dictionaryIsUploading = true;

            Dictionary.getWordListWithoutDefinitions((progress) => {
                this.dictionaryUploadProgress = progress * 100;
            })
                .then(() => Dictionary.getDictionaryTrie())
                .then((dictionaryTrie) => {
                    this.dictionaryIsLoading = false;
                    this.dictionaryIsUploading = false;

                    this.dictionaryIsMissing = !dictionaryTrie;
                })
                .catch(() => {
                    this.dictionaryIsMissing = true;
                    this.dictionaryIsLoading = false;
                    this.dictionaryIsUploading = false;
                });
        },
    },
    name: "Home",
};
</script>
