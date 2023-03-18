import Dexie from "dexie";
import { MakeTrie } from "./boggle_solver";
let _dictionaryTrie = null;
let _db = null;
async function indexDictionary() {
  if (!_db) {
    _db = new Dexie("boggledictionary");
    _db.version(3).stores({
      words: "word",
      sounds: "name",
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
const uploadWords = async (wordsAndDefinitions, progressCallback) => {
  await indexDictionary();
  const commonWords = new Set(
    (
      await (
        await fetch(
          "https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt"
        )
      ).text()
    ).split("\n")
  );

  const wordsArr = [];

  let newEntries = [];
  const numWords = wordsAndDefinitions.length;

  for (const line of wordsAndDefinitions) {
    const { word, definition } = line;
    const isCommon = commonWords.has(word.toLowerCase());
    newEntries.push({ word, definition, isCommon });
    wordsArr.push(word);
    if (newEntries.length > 10000) {
      await _db.words.bulkAdd(newEntries);
      newEntries = [];
      progressCallback(wordsArr.length / numWords);
    }
  }
  await _db.words.bulkAdd(newEntries);
  localStorage.setItem("words", JSON.stringify(wordsArr));
  _dictionaryTrie = new MakeTrie(new Set(wordsArr));
};
export default {
  uploadSound: async (file) => {
    if (!_db) {
      _db = new Dexie("boggledictionary");
      _db.version(3).stores({
        words: "word",
        sounds: "name",
      });
      await _db.on("ready");
    }
    await _db.sounds.add({ name: "shake", content: file });
  },
  getSound: async (name) => {
    if (!_db) {
      _db = new Dexie("boggledictionary");
      _db.version(3).stores({
        words: "word",
        sounds: "name",
      });
      await _db.on("ready");
    }
    return await _db.sounds.where("name").equalsIgnoreCase(name).first();
  },
  uploadDictionary: async (file, progressCallback) => {
    // await indexDictionary();
    const wordsStr = await file.text();
    const wordsAndDefinitions = wordsStr.split("\r\n").map((line) => {
      const [word, definition] = line.split("\t");
      return { word, definition };
    });
    return uploadWords(wordsAndDefinitions, progressCallback);
    // const commonWords = new Set(
    //     (
    //         await (
    //             await fetch(
    //                 "https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt"
    //             )
    //         ).text()
    //     ).split("\n")
    // );

    // const wordsArr = [];

    // let newEntries = [];
    // const allWords = wordsStr.split("\r\n");
    // const numWords = allWords.length;

    // for (const line of allWords) {
    //     const [word, definition] = line.split("\t");
    //     const isCommon = commonWords.has(word.toLowerCase());
    //     newEntries.push({ word, definition, isCommon });
    //     wordsArr.push(word);
    //     if (newEntries.length > 10000) {
    //         await _db.words.bulkAdd(newEntries);
    //         newEntries = [];
    //         progressCallback(wordsArr.length/numWords)
    //     }
    // }
    // await _db.words.bulkAdd(newEntries);
    // localStorage.setItem("words", JSON.stringify(wordsArr));
    // _dictionaryTrie = new MakeTrie(new Set(wordsArr));
  },
  getWordListWithoutDefinitions: async (progressCallback) => {
    const wordsArr = (
      await (
        await fetch(
          "https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt"
        )
      ).text()
    ).split("\r\n");

    const wordsAndDefinitions = wordsArr.map((w) => ({
      word: w,
      definition: "",
    }));

    return uploadWords(wordsAndDefinitions, progressCallback);
  },
  getWordSet: async () => {
    if (!_db) {
      await indexDictionary();
    }
    return (await _db.words.toArray()).map((w) => w.word);
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
  getCommon: async (listOfWords) => {
    if (!_db) {
      await indexDictionary();
    }
    const entries = (
      await _db.words.where("word").anyOfIgnoreCase(listOfWords).toArray()
    ).filter((w) => w.isCommon);
    return entries.map((e) => e.word);
  },
};
