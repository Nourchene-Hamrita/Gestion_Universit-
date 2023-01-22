class ArrayLib {
    static Sort(array, options = { reverse: false }) {
        const { reverse } = options
        if (array.length < 1) return array
        const item = array[0]
        switch (typeof item) {
            case "string":
                return array.sort((a, b) => {
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                    if (a == b) return 0
                    if (!reverse)
                        return a < b ? 1 : -1;
                    return a < b ? -1 : 1;
                })
            default:
                console.warn("ArrayLib.Sort", typeof item);
                return array.sort((a, b) => !reverse ? (b - a) : (a - b))
        }
    }
    static allSubSets(array) {
        if (array.length == 0) return [[]]
        const [head, ...rest] = array
        const noHeadSubsets = this.allSubSets(rest)
        const headSubsets = []
        for (const subSet of noHeadSubsets) {
            headSubsets.push([head, ...subSet])
        }
        return [...headSubsets, ...noHeadSubsets]
    }
    static Paths(item, paths, unique = false, solveArray = false) {
        var result = []
        if (!item)
            return result
        if (Array.isArray(item)) {
            for (const _item of item) {
                result.push(...this.Paths(_item, paths, unique, solveArray))
            }
            if (unique)
                result = [...new Set(result)]
            return result
        }
        for (const path of paths) {
            const keys = path.split(".")
            const key = keys[0]
            const restPath = keys.slice(1).join(".")
            if (keys.length == 1 && key in item) {
                if (solveArray && Array.isArray(item[key]))
                    result.push(...item[key])
                else
                    result.push(item[key])
            } else {
                result.push(...this.Paths(item[key], [restPath], unique, solveArray))
            }
        }
        if (unique)
            result = [...new Set(result)]
        return result

    }
    static FilterDuplicates(items, key) {
        const keys = key.split(".")
        var noDuplicates = []
        var noDuplicates_key = []
        for (const item of items) {
            var target = item
            for (const key of keys) {
                target = target[key]
            }
            if (!noDuplicates_key.includes(target)) {
                noDuplicates_key.push(target)
                noDuplicates.push(item)
            }
        }
        return noDuplicates
    }
    static IncludesOne(array, items) {
        for (const item of items) {
            if (array.includes(item))
                return true
        }
        return false
    }
    static Array_key(items, key) {
        return Array.from(items, item => item[key])
    }
    static intersection(sourceArr, targetArr) {
        let out = []
        for (const source of sourceArr) {
            for (const target of targetArr) {
                if (source == target)
                    out.push(source)
            }
        }
        return out
    }
    static minus(source, target) {
        return source.filter(_source => {
            for (const _target of target) {
                if (_source == _target)
                    return false
            }
            return true
        })
    }
    static groupBy(array, key, options = { unique: false, ignoreUndefined: false, ignoreNull: false }) {
        const { unique = false, ignoreUndefined = false, ignoreNull = false } = options
        let out = {}
        for (const item of array) {
            const value = typeof key == "function" ? key(item) : item[key]
            if (value == null && ignoreNull)
                continue
            if (value == undefined && ignoreUndefined)
                continue
            if (unique) {
                out[value] = item
            } else {
                out[value] = out[value] || []
                out[value].push(item)
            }
        }
        return out
    }
    static Array_path(items, path) {
        const keys = path.split(".")
        var out = items
        for (const key of keys) {
            out = this.Array_key(out, key)
        }
        return out
    }
    static ToKey(items, key) {
        return Array.from(items, item => {
            if (typeof item == "object") {
                return item
            }
            var obj = {}
            obj[key] = item
            return obj
        })
    }
    static Array_keyFiltered(items, key) {
        return Array.from(items, item => item ? item[key] : null).filter(value => value)
    }
}
module.exports = ArrayLib;