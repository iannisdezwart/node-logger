"use strict";
exports.__esModule = true;
var worker_threads_1 = require("worker_threads");
var chalk = require("chalk");
var fs = require("fs");
var options = worker_threads_1.workerData;
var padWithLeadingZeroes = function (str, len) {
    return '0'.repeat(Math.max(len - str.length, 0)) + str;
};
var getTimestamp = function () {
    var now = new Date();
    var year = now.getFullYear();
    var month = padWithLeadingZeroes(now.getMonth().toString(), 2);
    var date = padWithLeadingZeroes(now.getDate().toString(), 2);
    var hour = padWithLeadingZeroes(now.getHours().toString(), 2);
    var minutes = padWithLeadingZeroes(now.getMinutes().toString(), 2);
    var seconds = padWithLeadingZeroes(now.getSeconds().toString(), 2);
    var milliseconds = padWithLeadingZeroes(now.getMilliseconds().toString(), 3);
    var datePart = chalk.cyan(year + "-" + month + "-" + date);
    var timePart = chalk.magenta(hour + ":" + minutes + ":" + seconds + "." + milliseconds);
    return datePart + " " + timePart;
};
var logPrefixMap = new Map([
    ['i', chalk.green('✔')],
    ['w', chalk.yellow('!')],
    ['e', chalk.red('✗')],
]);
worker_threads_1.parentPort.on('message', function (input) {
    if (input == 'exit') {
        process.exit(0);
    }
    else {
        var prefix = logPrefixMap.get(input.level);
        var timestamp = getTimestamp();
        var line = prefix + " [ " + timestamp + " ]: " + input.message;
        if (options.console) {
            console.log(line);
        }
        if (options.file != null) {
            var lineWithoutColours = line.replace(/\x1b\[[0-9]*m/g, '') + '\n';
            fs.appendFileSync(options.file, lineWithoutColours);
        }
    }
});
