/**
 * @author Yigithan.lybs
 * @description Logger provides colored simple logs for terminal
 * @param {string} log_type Log Title Type
 * @param {string} log_des Log Description
 * @param {string} log_action Log Action 
 */

// Drop Normal Log to Console Function
function dropLog(log_type = "", log_des = "", log_action = "") {
    console.log("\n" + "\x1b[32m" + " • " + log_type + "\x1b[0m " + log_des + "\x1b[33m " + log_action + "\x1b[0m" + "\n");
}
// Drop Error Log to Console Function
function dropError(log_type = "", log_des = "", log_action = "") {
    console.log("\n" + "\x1b[31m" + " • " + log_type + "\x1b[0m " + log_des + "\x1b[33m " + log_action + "\x1b[0m" + "\n");
}

// Drop Info Log to Console Function
function dropInfo(log_type = "", log_des = "", log_action = "") {
    console.log("\n" + "\x1b[36m" + " • " + log_type + "\x1b[0m " + log_des + "\x1b[33m " + log_action + "\x1b[0m" + "\n");
}

// Export Module
export default {dropLog, dropError, dropInfo};