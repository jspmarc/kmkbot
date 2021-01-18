"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const thisCentury = 21;
class Event {
    constructor(title, date, desc) {
        this._title = title;
        this._date = date;
        this._desc = desc;
        this.makeDateStr();
    }
    getPrintString() {
        let retStr = `${this._title} ---- ${this._dateStr}`;
        if (this._desc != null) {
            retStr += '\n\n';
            retStr += this._desc;
            retStr += '\n';
        }
        return retStr;
    }
    /**
     * Fungsi yang mengembalikan tanggal (D), bulan (M), dan tahun (Y)
     * dari suatu Event
     */
    getDMY() {
        const year = (thisCentury - 1) * 100 + Math.floor(this._date / 10000);
        const month = Math.floor((this._date % 10000) / 100);
        const day = this._date % 100;
        return {
            D: day,
            M: month,
            Y: year,
        };
    }
    /**
     * Format date string: Day monthName (Indo) Year
     * Example: 20 Januari 2021
     */
    makeDateStr() {
        const DMY = this.getDMY();
        const monthName = getMonthName(DMY.M);
        this._dateStr = `${DMY.D} ${monthName} ${DMY.Y}`;
    }
}
exports.Event = Event;
/**
 * function that returns the month name from a given month number (m)
 * or null if m is an invalid month number
 */
const getMonthName = (m) => {
    let monthName;
    switch (m) {
        case 1:
            monthName = 'Januari';
            break;
        case 2:
            monthName = 'Februari';
            break;
        case 3:
            monthName = 'Maret';
            break;
        case 4:
            monthName = 'April';
            break;
        case 5:
            monthName = 'Mei';
            break;
        case 6:
            monthName = 'Juni';
            break;
        case 7:
            monthName = 'Juli';
            break;
        case 8:
            monthName = 'Agustus';
            break;
        case 9:
            monthName = 'September';
            break;
        case 10:
            monthName = 'Oktober';
            break;
        case 11:
            monthName = 'November';
            break;
        case 12:
            monthName = 'Desember';
            break;
        default:
            monthName = null;
    }
    return monthName;
};
