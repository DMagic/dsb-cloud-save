var encKeys = function(obj, str) {
  return JSON.stringify(obj).split('"').reverse().map(function(str, i, token, sorted, enc, len, tmpvals, str2) {
    str2 = str + '@' + str;
    str = str + '@';
    token = str.split('').reverse();
    enc = token.map(function() { return '' });
    sorted = token.slice().sort();
    len = sorted.length;
    for (i = 1; i < len; ++i) {
      tmpvals = {};
      sorted = sorted.map(function(curr, idx, newval, times) {
        if (/@$/.test(curr)) enc[idx] = token[i];
        idx = -1;
        times = 0;
        do {
          ++idx;
          ++times;
          idx = str2.indexOf(curr, idx);
          newval = str[(idx - 1 + len) % len] + curr;
        } while (undefined != tmpvals[newval] && times <= tmpvals[newval]);
        tmpvals[newval] = times;
        return newval;
      }).sort();
      enc[enc.indexOf('')] = '@';
    }
    return enc.join('');
  }).join('%');
}
