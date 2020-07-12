import Dexie from "dexie";
import { MakeTrie } from "./boggle_solver";
let _dictionaryTrie = null;
let _db = null;
async function indexDictionary() {
    if (!_db) {
        _db = new Dexie("boggledictionary");
        _db.version(1).stores({
            words: "++id,word,definition",
        });
        await _db.on("ready");
    }
    if (!_dictionaryTrie) {
        const count = await _db.words.count();
        if (count > 0) {
            const wordsstr = localStorage.getItem("words");
            _dictionaryTrie = new MakeTrie(new Set(JSON.parse(wordsstr)));
        }
    }
}

export default {
    uploadDictionary: async (file) => {
        await indexDictionary();
        const newEntries = [];
        const wordsStr = await file.text();
        const wordsArr = [];
        for (const line of wordsStr.split("\r\n")) {
            const [word, definition] = line.split("\t");
            newEntries.push({ word, definition });
            wordsArr.push(word);
        }
        localStorage.setItem("words", JSON.stringify(wordsArr));
        _dictionaryTrie = new MakeTrie(new Set(wordsArr));

        return _db.words.bulkAdd(newEntries);
    },
    getDictionaryTrie: async () => {
        if (!_dictionaryTrie) {
            await indexDictionary();
            if (!_dictionaryTrie) {
                throw new Error("No dictionary data found");
            }
        }
        return _dictionaryTrie;
    },
    getDefinition: async (word) => {
        if (!_db) {
            await indexDictionary();
        }
        try {
            const entry = await _db.words
                .where("word")
                .equalsIgnoreCase(word)
                .first();
            return entry.definition;
        } catch (error) {
            return;
        }
    },
};
