import moment from 'moment';
let dateFormat = 'DD MMM YYYY';
//convert mongo date to string 
export const fromUTCToFormat = (data, fmt) => {
    let dtFmt = fmt || dateFormat;
    return moment.utc(data).format(dtFmt);
};