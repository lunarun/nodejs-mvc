var gm = require('gm');
var imageMagick = gm.subClass({imageMagick: true});

const RANDOM_STR = '2345678abcdefhijkmnpqrstuvwxyzABCDEFGHJKLMNPQRTUVWXY';
const CODE_SET = '2345678abcdefhijkmnpqrstuvwxyz';
// 十六进制颜色值的正则表达式
const REG_RGB_COLOR = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;

module.exports.generate = generate;

function generate(callback) {
  var verifyCode = _randomStr();
  var width = 80;
  var height = 30;
  var fontSize = 20;

  var img = imageMagick(width, height, '#fff')
    .fill("#fff")
    .stroke("black", 1)
    .autoOrient();

  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 5; j++) {
      var rgb = "RGB(" + _.random(150, 255) + ", " + _.random(150, 255) +
        ", " + _.random(150, 255) + ")";
      var col = _colorHex(rgb);
      img.stroke(col);
      img.drawText(_.random(-10, width), _.random(-10, height), CODE_SET[_.random(
        0,
        29)]);
    }
  }
  img.stroke("#ffffff");
  for (var i = 0; i < verifyCode.length; i++) {
    img.font('./ttfs/' + _.random(1, 6) + '.ttf', fontSize);
    var textRgb = "RGB(" + _.random(1, 150) + ", " + _.random(1, 150) + ", " +
      _.random(1, 150) + ")";
    var col = _colorHex(textRgb);
    img.stroke(col);

    img.drawText(5 + i * 18, 22, verifyCode[i]);
  }

  img.toBuffer('png', function (err, buffer) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, {
      code: verifyCode,
      image: buffer
    });
  });
}

/*RGB颜色转换为16进制*/
function _colorHex(str) {
  if (/^(rgb|RGB)/.test(str)) {
    var aColor = str.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
    var strHex = '#';
    for (var i = 0; i < aColor.length; i++) {
      var hex = Number(aColor[i]).toString(16);
      if (hex === '0') {
        hex += hex;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = str;
    }
    return strHex;
  } else if (REG_RGB_COLOR.test(str)) {
    var aNum = str.replace(/#/, '').split('');
    if (aNum.length === 6) {
      return str;
    } else if (aNum.length === 3) {
      var numHex = '#';
      for (var i = 0; i < aNum.length; i += 1) {
        numHex += (aNum[i] + aNum[i]);
      }
      return numHex;
    }
  } else {
    return str;
  }
}

function _randomStr(length) {
  length = length || 4;
  var buffer = [];
  for (var i = 0; i < length; i++) {
    buffer[i] = RANDOM_STR.charAt(Math.floor(Math.random() * RANDOM_STR.length));
  }
  return buffer.join('');
}
