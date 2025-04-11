const randomKey = (len) => {
  var buf = []
    , chars = 'ab0cd1ef2gh3ij4kl5mn6opq7rst8uvw9xyz'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomIntMax = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

export {
  randomKey,
  getRandomInt,
  getRandomIntMax
}