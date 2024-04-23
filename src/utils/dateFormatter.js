export function formatDate(dateString) {
    // Create a new Date object from the provided string
    var date = new Date(dateString);

    // Get day, month, and year
    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1; // Month starts from 0
    var year = date.getUTCFullYear();

    // Add leading zeros if needed
    day = (day < 10) ? '0' + day : day;
    month = (month < 10) ? '0' + month : month;

    // Return formatted date
    return day + '/' + month + '/' + year;
}