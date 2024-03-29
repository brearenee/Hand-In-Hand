
//input date in format YYY-MM-DDD
//timeZoneOffSetMinutes for Devner standard time is -420.
function dateToTimestampWithTz(dateString, timezoneOffsetMinutes) {
    const [year, month, day] = dateString.split("-");
    const parsedDate = new Date(year, month - 1, day);
    const offsetMilliseconds = timezoneOffsetMinutes * 60 * 1000;
    const timestampWithTimeZone = parsedDate.getTime() - offsetMilliseconds;
    const dateWithOffset = new Date(timestampWithTimeZone);
    const formattedTimestamp = dateWithOffset.toISOString();
    return formattedTimestamp;
}

function timestamptzToYyyyMmDd(timestamptz) {
    const utcDate = new Date(timestamptz);
    const yyyy = utcDate.getFullYear();
    const mm = String(utcDate.getMonth() + 1).padStart(2, "0"); // January is 0 in JavaScript
    const dd = String(utcDate.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy} ${mm} ${dd}`;
    return formattedDate;
}
module.exports = {dateToTimestampWithTz, 
    timestamptzToYyyyMmDd};
