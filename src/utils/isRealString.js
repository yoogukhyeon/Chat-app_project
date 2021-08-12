//문자열 검사 로직 
let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0
};

module.exports = {isRealString}