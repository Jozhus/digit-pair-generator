const pool = "123456";
const testInput = [
    /*"123",
    "543",
    "612",
    "213",
    "456",
    "246",
    "245",
    "154",
    "132",
    "126",
    "416",*/
    "123",
    "213",
    "456",
    "546",
    "612",
    "231",
    "365"
];

function bruteForcePair(input, pool) {
    const good = [];

    input.forEach((trio1, i) => {
        let newPool = pool;

        trio1.split('').forEach(char => newPool = newPool.replace(char, ''));

        input.slice(i + 1).forEach(trio2 => {
            if (trio1[0] !== trio2[0] && trio2.split('').every(char => newPool.includes(char))) {
                good.push([trio1, trio2]);
            }
        });
    });

    return good;
}

function permutator(input, pool) {
    var results = [];

    function permute(arr, memo) {
        var cur, memo = memo || [];

        for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1);
            if (arr.length === 0) {
                const newVal = memo.concat(cur).join('').match(/.{1,3}/g)
                // Get rid of reverse duplicates
                if (newVal.every(val => input.includes(val)) && !results.some(val => val[0] === newVal[1] && val[1] === newVal[0])) {
                    results.push(newVal);
                }
            }
            permute(arr.slice(), memo.concat(cur));
            arr.splice(i, 0, cur[0]);
        }

        return results;
    }

    return permute(pool.split(''));
}

function bruteForceSubset(input, length, pool) {
    if (length === 0) {
        return [];
    }

    const good = []

    function subset(arr, left, pool, memo) {
        memo = memo || [];

        arr.forEach((l, i) => {
            const solution = memo.concat(l);
            const seenTwice = pool.split('').filter(num => solution.join('').split(num).length === 3);

            if (left === 1 &&
                pool.split('').every(num => seenTwice.includes(num)) &&
                good.every(sol => sol.sort().join('') !== solution.sort().join(''))) {
                console.log(solution);
                good.push(solution);
            }

            subset(arr.filter(el => el[0] !== l[0] && el.split('').every(ell => !seenTwice.includes(ell))), left - 1, pool, solution);
        });

        return good;
    }

    return subset([... new Set(input)], length, pool);
}

function bruteForceSubsetV2(input, halfPool, max, verbose) {
    const good = []
    const dontCares = [... new Set(input.join('').split(''))].filter(n => !halfPool.includes(n));
    input = input.filter(l => !l.split('').every(el => dontCares.includes(el)));

    function subset(arr, pool, memo) {
        memo = memo || [];

        arr.forEach((l) => {
            const solution = memo.concat(l);
            let localPool = pool;
            l.split('').forEach(num => localPool = localPool.replace(new RegExp(`${num}`), ''));

            if (localPool.length === 0 && solution.length <= max && good.every(sol => sol.sort().join('') !== solution.sort().join(''))) {
                if (verbose) console.log(solution);
                good.push(solution);
            }

            subset(arr.filter(el => el[0] !== l[0] && el.split('').every(ell => localPool.concat(dontCares).includes(ell))), localPool, solution);
        });

        return good;
    }

    return subset([... new Set(input)], halfPool + halfPool);
}

// It's a miracle this works.
function* generateNextTrio(input, halfPool, max, verbose) {
    const good = []
    const dontCares = [... new Set(input.join('').split(''))].filter(n => !halfPool.includes(n));
    input = input.filter(l => !l.split('').every(el => dontCares.includes(el)));

    function* subset(arr, pool, memo) {
        memo = memo || [];

        for (var l of arr) {
            const solution = memo.concat(l);
            let localPool = pool;
            l.split('').forEach(num => localPool = localPool.replace(new RegExp(`${num}`), ''));
            if (verbose) console.log(solution);

            if (localPool.length === 0 && solution.length <= max && good.every(sol => sol.sort().join('') !== solution.sort().join(''))) {
                good.push(solution);
                yield solution;
            }

            yield* subset(arr.filter(el => el[0] !== l[0] && el.split('').every(ell => localPool.concat(dontCares).includes(ell))), localPool, solution);
        }
    }

    yield* subset([... new Set(input)], halfPool + halfPool);
}

var strLetters = "a,b,c,d,e,f,g,h";
var arrLetters = strLetters.split(",");
var comboDepth = 3

function LoopIt(depth, baseString, arrLetters) {
    var returnValue = "";
    for (var i = 0; i < arrLetters.length; i++) {
        returnValue += (depth == 1 ? "," + baseString + arrLetters[i] : LoopIt(depth - 1, baseString + arrLetters[i], arrLetters));
    }
    return returnValue;
}

const test = LoopIt(3, "", pool.split('')).slice(1).split(',').filter(num => {
    const seen = [];

    return num.split('').every(d => {
        if (seen.includes(d)) {
            return false
        }

        seen.push(d);
        return true;
    })
})

//console.log(bruteForceSubsetV2(test, "123", 3, true));

let a = generateNextTrio(test, "123456", 4, false);
let result = a.next();
while (!result.done) {
    console.log(result.value);
    result = a.next();
}
//console.log(isASolution(["561", "423", "123", "645"], "123456"));
//console.log(bruteForceSubset(test, 5, "1234"));
//console.log(permutator(testInput, pool))
//console.log(bruteForcePair(testInput, pool));
