export default class StringAPI {
    static Format(string) {
        return string[0].toUpperCase() + string.slice(1);
    }
}