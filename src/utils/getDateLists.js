/**
 * Generates dates starting on 01/21/2020. 
 * @category Utils/Data
 * @returns {DateLists}
 */
const getDateLists = () => {
  const stripLeadingZero = (str) => (str[0] !== '0' ? str : str.slice(1));
  const isoToUsDate = (date) =>
    stripLeadingZero(date.slice(5, 7)) +
    '/' +
    stripLeadingZero(date.slice(8, 10)) +
    '/' +
    date.slice(2, 4);
  // eslint-disable-next-line no-extend-native
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  let todayDate = new Date();
  let initialDate = new Date('01/21/2020');
  let dateList = [];
  let isoDateList = [];
  let usDateList = [];

  while (initialDate < todayDate) {
    dateList.push(initialDate);
    let isoDate = initialDate.toISOString().slice(0, 10);
    isoDateList.push(isoDate);
    usDateList.push(isoToUsDate(isoDate));
    initialDate = initialDate.addDays(1);
  }

  return { isoDateList, usDateList };
};

export { getDateLists };

/**
 * @typedef {Object} DateLists
 * @property {DateList} isoDateList 'YYYY-MM-DD
 * @property {DateList} usDateList 'MM/DD/YYYY'
 * 
 */

/**
 * @typedef {string[]} DateList
 */