class StringLib {
    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    static lowerCaseFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }
}
module.exports = StringLib;