import moment from 'moment'

export function formatTime2Date(timestamp){
    if (timestamp == undefined) {
        return "";
    }
    return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * 
 * @param {Long} timestamp 
 * 
 */
export function formatTime2Date2(timestamp){
    if (timestamp == undefined) {
        return "";
    }
    return moment(timestamp).format("YYYY-MM-DD");
}