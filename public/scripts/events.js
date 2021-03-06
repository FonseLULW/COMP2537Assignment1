function getFormattedTime(currentTimestamp) {
    let hrs = currentTimestamp.getHours().toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false});
    let mins = currentTimestamp.getMinutes().toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false});
    let secs = currentTimestamp.getSeconds().toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false});
    return `${hrs}:${mins}:${secs}`;
}

function getFormattedDate(currentTimestamp) {
    let year = currentTimestamp.getFullYear().toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false});
    let month = (currentTimestamp.getMonth()+1).toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false});
    let day = currentTimestamp.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false});
    return `${year}-${month}-${day}`;
}

async function fireProfileEvent(pokeName, timestamp) {
    $.ajax({
        url: `/events/insertEvent`,
        type: `put`,
        data: {
            text: `Accessed ${pokeName}'s profile`,
            date: getFormattedDate(timestamp),
            time: getFormattedTime(timestamp),
            hits: 1
        },
    });
}

async function fireSearchEvent(searchType, searchValue, timestamp) {
    $.ajax({
        url: `/events/insertEvent`,
        type: `put`,
        data: {
            text: `Searched for ${searchType} ${searchValue}`,
            date: getFormattedDate(timestamp),
            time: getFormattedTime(timestamp),
            hits: 1
        },
    });
}

async function fireClearHistoryEvent(timestamp) {
    $.ajax({
        url: `/events/insertEvent`,
        type: `put`,
        data: {
            text: `Cleared search history`,
            date: getFormattedDate(timestamp),
            time: getFormattedTime(timestamp),
            hits: 1
        },
    });
}

async function fireDeleteFromHistoryEvent(historyType, historyValue, timestamp) {
    $.ajax({
        url: `/events/insertEvent`,
        type: `put`,
        data: {
            text: `Deleted search history item {${historyType}: ${historyValue}}`,
            date: getFormattedDate(timestamp),
            time: getFormattedTime(timestamp),
            hits: 1
        },
    });
}

async function fireRestoreSearchEvent(historyType, historyValue, timestamp) {
    $.ajax({
        url: `/events/insertEvent`,
        type: `put`,
        data: {
            text: `Accessed search history item {${historyType}: ${historyValue}}`,
            date: getFormattedDate(timestamp),
            time: getFormattedTime(timestamp),
            hits: 1
        },
    });
}

async function fireWinEvent(rows, cols, seconds, pokes, timestamp) {
    $.ajax({
        url: `/events/insertEvent`,
        type: `put`,
        data: {
            text: `Won the ${seconds}s ${rows}x${cols} Pokemon Game with ${pokes} Pokemon!`,
            date: getFormattedDate(timestamp),
            time: getFormattedTime(timestamp),
            hits: 1
        },
    });
}

async function fireLoseEvent(rows, cols, seconds, pokes, timestamp) {
    $.ajax({
        url: `/events/insertEvent`,
        type: `put`,
        data: {
            text: `Lost the ${seconds}s ${rows}x${cols} Pokemon Game with ${pokes} Pokemon!`,
            date: getFormattedDate(timestamp),
            time: getFormattedTime(timestamp),
            hits: 1
        },
    });
}

function setup() {
    console.log("Events have been loaded!");
}

document.addEventListener("DOMContentLoaded", setup);