import Dexie from "dexie";
let _dictionary = null;
let _db = null;
async function indexDictionary() {
    _db = new Dexie("boggledictionary");
    _db.version(1).stores({
        words: "++id,word,definition",
    });
    await _db.on("ready");

    const count = await _db.words.count();
    if (count > 0) {
        console.log("Already populated");
        return;
    }
    const newEntries = [];
    const wordsStr = await (await fetch("dictionarydefinitions.txt")).text();

    for (const line of wordsStr.split("\r\n")) {
        const [word, definition] = line.split("\t");
        newEntries.push({ word, definition });
    }

    return _db.words.bulkAdd(newEntries);
}
async function initDictionary() {
    let wordsStr = localStorage.getItem("words");
    if (!wordsStr) {
        wordsStr = await (await fetch("dictionarycontent.txt")).text();
        localStorage.setItem("words", wordsStr);
    }
    indexDictionary();
    _dictionary = new Set(wordsStr.split("\r\n"));
}
export default {
    getDictionary: async () => {
        if (!_dictionary) {
            await initDictionary();
        }
        return _dictionary;
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
