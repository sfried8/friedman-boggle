/**
 * Created by mack0242 on 6/04/17.
 */
const TrieNode = function(parent, value) {
    this.parent = parent;
    this.children = new Array(26);
    this.isWord = false;
    if (parent !== undefined) {
        parent.children[value.charCodeAt(0) - 97] = this;
    }
};
export const MakeTrie = function(dict) {
    const root = new TrieNode(undefined, "");
    // console.log(root);
    for (let word of dict.values()) {
        let curNode = root;

        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            const ord = letter.charCodeAt(0);
            if (97 <= ord < 123) {
                // console.log(curNode);
                let nextNode = curNode.children[ord - 97];
                if (nextNode === undefined) {
                    nextNode = new TrieNode(curNode, letter);
                }
                curNode = nextNode;
            }
        }
        curNode.isWord = true;
    }
    return root;
};
export const BoggleWords = function(grid, dict, mustHave) {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [];
    const words = new Set();
    const wordToPositions = {};
    for (let y = 0; y < cols; y++) {
        for (let x = 0; x < rows; x++) {
            const c = grid[y][x];
            const ord = c.charCodeAt(0);

            let node0 = dict.children[ord - 97];
            if (c.charAt(0) === "Q") {
                node0 = node0.children["U".charCodeAt(0) - 97];
            }
            const node = node0;
            if (node !== undefined) {
                queue.push([x, y, c, node, [[x, y]]]);
            }
        }
    }
    while (queue.length !== 0) {
        const [x, y, s, node, h] = queue.pop();
        for (let [dx, dy] of [
            [1, 0],
            [1, -1],
            [0, -1],
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
        ]) {
            const [x2, y2] = [x + dx, y + dy];
            if (
                h.find(function(el) {
                    return el[0] === x2 && el[1] === y2;
                }) !== undefined
            ) {
                continue;
            }
            // console.log(x2,y2, h);
            if (0 <= x2 && x2 < cols && 0 <= y2 && y2 < rows) {
                const newHist = h.slice();
                newHist.push([x2, y2]);
                const s2 = s + grid[y2][x2];
                const node2 = node.children[grid[y2][x2].charCodeAt(0) - 97];
                if (node2 !== undefined) {
                    // console.log(s2);
                    if (node2.isWord) {
                        if (
                            mustHave === undefined ||
                            s2.indexOf(mustHave) !== -1
                        )
                            words.add(s2);
                        wordToPositions[s2.replace(/Q/, "QU")] = [
                            [x2, y2],
                            ...h,
                        ];
                        // console.log(newHist, s2);
                    }
                    queue.push([x2, y2, s2, node2, newHist]);
                }
            }
        }
    }
    return wordToPositions;
};
/*Example usage:
var df = require('./en_au_dict.js');
var d = new MakeTrie(df);
var board = [
    'fxie',
    'amlo',
    'ewbx',
    'astu'
];
console.log(BoggleWords(board, d));
*/
