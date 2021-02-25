var now = new Date();
export var sessionStartTime = now.getTime();
var timeOflastHistoryUpload = new Date();

export function getLastHistoryUpload() {
    return timeOflastHistoryUpload.getTime();
}

export function setGetLastHistoryUpload() {
    return timeOflastHistoryUpload;
}

export function getTimeSinceLastUpload() {
    now = new Date();
    var difference = timeOflastHistoryUpload.getTime() - now.getTime();
    return difference;
}

