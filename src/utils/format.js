import moment from 'moment'

export function formatTime2Date(timestamp){
    if (timestamp == undefined) {
        return "";
    }
    return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
}