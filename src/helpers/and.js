module.exports = function () {
    return Array.prototype.every.call(arguments, Boolean);
}