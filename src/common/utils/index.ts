/**
 * 阿拉伯数字转中文数字方法
 * @param num 传入数字
 * @returns 返回大写数字
 */
export const numberToChinese = (num: number): string =>
  String(num)
    .split('')
    .reverse()
    .map((digit, index, arr) => {
      const unit = ['', '十', '百', '千', '万', '亿'][index];
      const char = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'][Number(digit)];
      return char === '零' && unit !== '' && arr[index - 1] !== '0' ? char : char + unit;
    })
    .reverse()
    .join('');
