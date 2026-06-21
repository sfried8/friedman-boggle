<template>
    <div class="settings-modal">
        <div class="settings-modal-column">
            <div @click="$emit('close')" class="close-button">X</div>
            <h1>Settings</h1>
            <div>
                <h2>Timer</h2>
                <b-form-input v-model="timerLength" @submit="saveSettings" @keypress.enter="saveSettings"
                    placeholder="Timer Length" name="timerLength" style="width: 250px;" /><label
                    for="timerLength">Seconds</label>
            </div>
            <div>
                <h3>Difficulties</h3>
                <div class="difficulty-settings">

                    <span>Easy</span>
                    <input type="checkbox" name="allowEasy" v-model="allowedDifficultyEasy" />
                    <b-form-input v-model="thresholdEasy" @submit="saveSettings" @keypress.enter="saveSettings"
                        style="width: 100px;" />
                </div>
                <div class="difficulty-settings">

                    <span>Normal</span>
                    <input type="checkbox" name="allowNormal" v-model="allowedDifficultyNormal" />
                    <b-form-input v-model="thresholdNormal" @submit="saveSettings" @keypress.enter="saveSettings"
                        style="width: 100px;" />
                </div>
                <div class="difficulty-settings">

                    <span>Tough</span>
                    <input type="checkbox" v-model="allowedDifficultyTough" />
                    <b-form-input v-model="thresholdTough" @submit="saveSettings" @keypress.enter="saveSettings"
                        style="width: 100px;" />
                </div>
                <div class="difficulty-settings">

                    <span>Hard</span>
                    <input type="checkbox" v-model="allowedDifficultyVeryHard" />
                    <div style="width: 100px;"></div>
                </div>
            </div>
        </div>
        <div>
            <h2>Rejected Words</h2>
            <div class="rejected-words"></div>
            <div v-if="rejectedWords === null">Loading...</div>
            <div v-else-if="rejectedWords.length" v-for="word in rejectedWords" :key="word"> {{ word }} <b-button
                    @click="unrejectWord(word)">👍</b-button>
            </div>
            <div v-else>No rejected words</div>
        </div>
    </div>
</template>

<script>
import Dictionary from '../Dictionary';

const DEFAULT_SETTINGS = {

    timerLength: 180,
    allowedDifficultyEasy: true,
    thresholdEasy: 1300,
    allowedDifficultyNormal: true,
    thresholdNormal: 900,
    allowedDifficultyTough: true,
    thresholdTough: 500,
    allowedDifficultyVeryHard: true,

}
export default {
    name: "SettingsModal",
    data() {
        return {
            timerLength: 180,
            allowedDifficultyEasy: true,
            thresholdEasy: 1300,
            allowedDifficultyNormal: true,
            thresholdNormal: 900,
            allowedDifficultyTough: true,
            thresholdTough: 500,
            allowedDifficultyVeryHard: true,
            rejectedWords: null,
        }
    },
    watch: {
        settings: {
            handler() {
                this.saveSettings();
            },
            deep: true,
        }
    },
    methods: {
        saveSettings() {
            window.localStorage.setItem("boggleSettings", JSON.stringify(this.settings));
            this.$emit("settings-changed");
        },
        unrejectWord(word) {
            Dictionary.setPrecedentRejection(word, false);
            this.rejectedWords = this.rejectedWords.filter(w => w !== word);
        }
    },
    computed: {
        settings() {
            return {
                timerLength: this.timerLength,
                allowedDifficultyEasy: this.allowedDifficultyEasy,
                thresholdEasy: this.thresholdEasy,
                allowedDifficultyNormal: this.allowedDifficultyNormal,
                thresholdNormal: this.thresholdNormal,
                allowedDifficultyTough: this.allowedDifficultyTough,
                thresholdTough: this.thresholdTough,
                allowedDifficultyVeryHard: this.allowedDifficultyVeryHard,
            }
        }
    },
    mounted() {
        const boggleSettingsString = window.localStorage.getItem("boggleSettings");
        const settings = boggleSettingsString ? JSON.parse(boggleSettingsString) : DEFAULT_SETTINGS;
        if (settings) {
            this.timerLength = settings.timerLength;
            this.allowedDifficultyEasy = settings.allowedDifficultyEasy;
            this.allowedDifficultyNormal = settings.allowedDifficultyNormal;
            this.allowedDifficultyTough = settings.allowedDifficultyTough;
            this.allowedDifficultyVeryHard = settings.allowedDifficultyVeryHard;
            this.thresholdEasy = settings.thresholdEasy;
            this.thresholdNormal = settings.thresholdNormal;
            this.thresholdTough = settings.thresholdTough;
        }
        this.saveSettings();
        Dictionary.getRejectedWords().then((rejectedWords) => {
            this.rejectedWords = rejectedWords
        })
    }

}
</script>

<style>
.settings-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    color: white;
}

.settings-modal-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 75%;
}

.difficulty-settings {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 300px;
}

.difficulty-settings * {
    width: 100px;
}

.close-button {
    position: absolute;
    top: 0;
    right: 0;
    margin: 1rem;
    font-size: 2rem;
    cursor: pointer;
}
</style>