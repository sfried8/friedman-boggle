export function shuffle(array) {
    let currentIndex = array.length;

    while (0 !== currentIndex) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        const temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
export function delay(ms) {
    return new Promise((res) => {
        return setTimeout(res, ms);
    });
}
export function isEqualSet(setA, setB) {
    return setA.size === setB.size && [...setA].every(v=> setB.has(v))
}