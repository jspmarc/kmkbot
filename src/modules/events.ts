export class Event {
  private _title: string;
  private _date: number;
  private _desc: string;

  /*
  get title(): string {
    return this._title;
  }
  get date(): number {
    return this._date;
  }
  get desc(): string {
    return this._desc;
  }

  set title(newTitle: string) {
    this._title = newTitle;
  }
  set date(newDate: number) {
    this._date = newDate;
  }
  set desc(newDesc: string) {
    this._desc = newDesc;
  }
  */

  constructor(title: string, date: number, desc: string) {
    this._title = title;
    this._date = date;
    this._desc = desc;
  }

  getPrint(): string {
    return `${this._title}\t\t${this._date}\t\t${this._desc}`;
  }

  /**
   * Fungsi yang mengembalikan tanggal (D), bulan (M), dan tahun (Y)
   * dari suatu Event
   */
  getDMY(): { D: number; M: number; Y: number } {
    const year: number = 1; // TODO
    const month: number = 1; // TODO
    const day: number = 1; // TODO

    return {
      D: day,
      M: month,
      Y: year,
    };
  }
}
