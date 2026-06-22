function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function showAlert(message, type) {
  const container = document.getElementById('alert-container');
  const alert = document.createElement('div');
  alert.className = 'alert ' + type;
  alert.textContent = message;
  container.innerHTML = '';
  container.appendChild(alert);
  setTimeout(function() { alert.remove(); }, 3000);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    showAlert('已复制到剪贴板', 'success');
  }).catch(function() {
    showAlert('复制失败', 'error');
  });
}

function initUUIDGenerator() {
  var quantityInput = document.getElementById('quantity');
  var inputText = document.getElementById('input-uuids');
  var outputText = document.getElementById('output-uuids');
  var generateBtn = document.getElementById('generate-btn');
  var copyAllBtn = document.getElementById('copy-all-btn');
  var clearBtn = document.getElementById('clear-btn');

  function generateUUIDs() {
    var quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1 || quantity > 100) {
      showAlert('请输入 1-100 之间的数量', 'error');
      return;
    }
    var existingUUIDs = inputText.value.split('\n').filter(function(l) { return l.trim(); }).filter(function(l) {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(l.trim());
    });
    var newUUIDs = [];
    for (var i = 0; i < quantity; i++) newUUIDs.push(generateUUID());
    var allUUIDs = existingUUIDs.concat(newUUIDs);
    outputText.value = allUUIDs.join('\n');
    if (newUUIDs.length > 0) showAlert('生成了 ' + newUUIDs.length + ' 个新 UUID', 'success');
  }

  function copyAllUUIDs() {
    var val = document.getElementById('output-uuids').value;
    if (!val) { showAlert('没有可复制的 UUID', 'error'); return; }
    copyToClipboard(val);
  }

  function clearAll() {
    document.getElementById('quantity').value = '1';
    document.getElementById('input-uuids').value = '';
    document.getElementById('output-uuids').value = '';
    document.getElementById('alert-container').innerHTML = '';
  }

  generateBtn.addEventListener('click', generateUUIDs);
  copyAllBtn.addEventListener('click', copyAllUUIDs);
  clearBtn.addEventListener('click', clearAll);
}

function encodeBase64(text) { return btoa(unescape(encodeURIComponent(text))); }

function decodeBase64(base64) {
  try { return decodeURIComponent(escape(atob(base64))); } catch (e) { throw new Error('无效的 Base64 字符串'); }
}

function initBase64() {
  var modeSelect = document.getElementById('mode');
  var inputText = document.getElementById('input-text');
  var outputText = document.getElementById('output-text');
  var convertBtn = document.getElementById('convert-btn');
  var copyBtn = document.getElementById('copy-output-btn');
  var clearBtn = document.getElementById('clear-btn');

  function convert() {
    var mode = modeSelect.value;
    var text = inputText.value.trim();
    if (!text) { showAlert('请输入文本', 'error'); return; }
    try {
      var result = mode === 'encode' ? encodeBase64(text) : decodeBase64(text);
      outputText.value = result;
      showAlert(mode === 'encode' ? '编码成功' : '解码成功', 'success');
    } catch (e) { showAlert('错误：' + e.message, 'error'); }
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', function() {
    if (outputText.value) copyToClipboard(outputText.value);
    else showAlert('没有可复制的内容', 'error');
  });
  clearBtn.addEventListener('click', function() {
    inputText.value = '';
    outputText.value = '';
    document.getElementById('alert-container').innerHTML = '';
  });
}

function timestampToDate(timestamp) {
  var date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function dateToTimestamp(dateStr) {
  var date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new Error('日期格式无效');
  return Math.floor(date.getTime() / 1000);
}

function initTimestamp() {
  var modeSelect = document.getElementById('mode');
  var inputValue = document.getElementById('input-value');
  var outputValue = document.getElementById('output-value');
  var convertBtn = document.getElementById('convert-btn');
  var copyBtn = document.getElementById('copy-output-btn');
  var clearBtn = document.getElementById('clear-btn');
  var nowBtn = document.getElementById('now-btn');
  var nowTimestampBtn = document.getElementById('now-timestamp-btn');

  function convert() {
    var mode = modeSelect.value;
    var value = inputValue.value.trim();
    if (!value) { showAlert('请输入值', 'error'); return; }
    try {
      var result = mode === 'timestamp-to-date' ? timestampToDate(value) : dateToTimestamp(value);
      outputValue.value = String(result);
      showAlert('转换成功', 'success');
    } catch (e) { showAlert('错误：' + e.message, 'error'); }
  }

  function getCurrentDate() {
    inputValue.value = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  function getCurrentTimestamp() {
    inputValue.value = String(Math.floor(Date.now() / 1000));
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', function() {
    if (outputValue.value) copyToClipboard(outputValue.value);
    else showAlert('没有可复制的内容', 'error');
  });
  clearBtn.addEventListener('click', function() {
    inputValue.value = '';
    outputValue.value = '';
    document.getElementById('alert-container').innerHTML = '';
  });
  nowBtn.addEventListener('click', getCurrentDate);
  nowTimestampBtn.addEventListener('click', getCurrentTimestamp);
}

function encodeURL(text) { return encodeURIComponent(text); }

function decodeURL(encoded) {
  try { return decodeURIComponent(encoded); } catch (e) { throw new Error('URL 编码无效'); }
}

function initURLEncoder() {
  var modeSelect = document.getElementById('mode');
  var inputText = document.getElementById('input-text');
  var outputText = document.getElementById('output-text');
  var convertBtn = document.getElementById('convert-btn');
  var copyBtn = document.getElementById('copy-output-btn');
  var clearBtn = document.getElementById('clear-btn');
  var encodeExampleBtn = document.getElementById('encode-example-btn');
  var decodeExampleBtn = document.getElementById('decode-example-btn');

  function convert() {
    var mode = modeSelect.value;
    var text = inputText.value.trim();
    if (!text) { showAlert('请输入文本', 'error'); return; }
    try {
      var result = mode === 'encode' ? encodeURL(text) : decodeURL(text);
      outputText.value = result;
      showAlert(mode === 'encode' ? '编码成功' : '解码成功', 'success');
    } catch (e) { showAlert('错误：' + e.message, 'error'); }
  }

  function loadEncodeExample() {
    modeSelect.value = 'encode';
    inputText.value = 'Hello World! Special chars: @#$%^&*()';
  }

  function loadDecodeExample() {
    modeSelect.value = 'decode';
    inputText.value = 'Hello%20World%21%20Special%20chars%3A%20%40%23%24%25%5E%26%2A%28%29';
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', function() {
    if (outputText.value) copyToClipboard(outputText.value);
    else showAlert('没有可复制的内容', 'error');
  });
  clearBtn.addEventListener('click', function() {
    inputText.value = '';
    outputText.value = '';
    document.getElementById('alert-container').innerHTML = '';
  });
  encodeExampleBtn.addEventListener('click', loadEncodeExample);
  decodeExampleBtn.addEventListener('click', loadDecodeExample);
}

function formatJSON(jsonString) {
  try { return JSON.stringify(JSON.parse(jsonString), null, 2); } catch (e) { throw new Error('JSON 解析错误：' + e.message); }
}

function minifyJSON(jsonString) {
  try { return JSON.stringify(JSON.parse(jsonString)); } catch (e) { throw new Error('JSON 解析错误：' + e.message); }
}

function validateJSON(jsonString) {
  try { JSON.parse(jsonString); return true; } catch (e) { throw new Error('JSON 校验错误：' + e.message); }
}

function getJSONStats(jsonString) {
  var parsed = JSON.parse(jsonString);
  var count = 0;
  function countNodes(obj) {
    if (Array.isArray(obj)) { count++; obj.forEach(function(i) { countNodes(i); }); }
    else if (obj && typeof obj === 'object') { count++; Object.values(obj).forEach(function(v) { countNodes(v); }); }
  }
  countNodes(parsed);
  return count;
}

function initJSONFormatter() {
  var modeSelect = document.getElementById('mode');
  var inputJSON = document.getElementById('input-json');
  var outputJSON = document.getElementById('output-json');
  var convertBtn = document.getElementById('convert-btn');
  var copyBtn = document.getElementById('copy-output-btn');
  var clearBtn = document.getElementById('clear-btn');
  var sampleBtn = document.getElementById('sample-btn');
  var statsContainer = document.getElementById('stats-container');
  var statsElement = document.getElementById('json-stats');

  function convert() {
    var mode = modeSelect.value;
    var jsonString = inputJSON.value.trim();
    if (!jsonString) { showAlert('请输入 JSON 数据', 'error'); return; }
    try {
      var result;
      if (mode === 'format') {
        result = formatJSON(jsonString);
        statsContainer.style.display = 'none';
      } else if (mode === 'validate') {
        validateJSON(jsonString);
        result = '✓ 有效 JSON';
        statsContainer.style.display = 'block';
        statsElement.textContent = '1 个根对象，共 ' + getJSONStats(jsonString) + ' 个节点';
      } else {
        result = minifyJSON(jsonString);
        statsContainer.style.display = 'none';
      }
      outputJSON.value = result;
      showAlert(mode === 'format' ? 'JSON 格式化成功' : mode === 'validate' ? 'JSON 校验通过' : 'JSON 压缩成功', 'success');
    } catch (e) {
      showAlert('错误：' + e.message, 'error');
      outputJSON.value = '';
      statsContainer.style.display = 'none';
    }
  }

  function loadSample() {
    inputJSON.value = '{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com",\n  "isActive": true,\n  "hobbies": ["reading", "coding", "hiking"],\n  "address": {\n    "street": "123 Main St",\n    "city": "New York",\n    "zip": "10001"\n  },\n  "phoneNumbers": ["+1-555-0123", "+1-555-0456"]\n}';
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', function() {
    var val = document.getElementById('output-json').value;
    if (val && val !== '✓ 有效 JSON') copyToClipboard(val);
    else showAlert('没有可复制的内容', 'error');
  });
  clearBtn.addEventListener('click', function() {
    inputJSON.value = '';
    outputJSON.value = '';
    document.getElementById('alert-container').innerHTML = '';
    document.getElementById('stats-container').style.display = 'none';
  });
  sampleBtn.addEventListener('click', loadSample);
}

function initPasswordGenerator() {
  var lengthInput = document.getElementById('password-length');
  var lengthValue = document.getElementById('length-value');
  var output = document.getElementById('password-output');
  var generateBtn = document.getElementById('generate-btn');
  var copyBtn = document.getElementById('copy-btn');

  function generatePassword() {
    var length = parseInt(lengthInput.value);
    var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var lowercase = 'abcdefghijklmnopqrstuvwxyz';
    var numbers = '0123456789';
    var symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    var chars = '';
    if (document.getElementById('use-uppercase').checked) chars += uppercase;
    if (document.getElementById('use-lowercase').checked) chars += lowercase;
    if (document.getElementById('use-numbers').checked) chars += numbers;
    if (document.getElementById('use-symbols').checked) chars += symbols;
    if (!chars) { showAlert('请至少选择一种字符类型', 'error'); return; }
    var result = '';
    for (var i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
    output.value = result;
    showAlert('密码已生成', 'success');
  }

  lengthInput.addEventListener('input', function() { lengthValue.textContent = lengthInput.value; });
  generateBtn.addEventListener('click', generatePassword);
  copyBtn.addEventListener('click', function() {
    if (output.value) copyToClipboard(output.value);
    else showAlert('没有可复制的内容', 'error');
  });
  generatePassword();
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(function(x) {
    var hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error('HEX 格式无效');
  return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  var r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    var hue2rgb = function(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function parseRgb(str) {
  var m = str.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (m) return { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]) };
  m = str.match(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/);
  if (m) return { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]) };
  throw new Error('RGB 格式无效，请使用格式: 255, 255, 255');
}

function parseHsl(str) {
  var m = str.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i);
  if (m) return { h: parseInt(m[1]), s: parseInt(m[2]), l: parseInt(m[3]) };
  m = str.match(/^(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%$/);
  if (m) return { h: parseInt(m[1]), s: parseInt(m[2]), l: parseInt(m[3]) };
  throw new Error('HSL 格式无效，请使用格式: 239, 84%, 67%');
}

function initColorConverter() {
  var hexInput = document.getElementById('hex-input');
  var rgbInput = document.getElementById('rgb-input');
  var hslInput = document.getElementById('hsl-input');
  var preview = document.getElementById('color-preview');
  var updating = false;

  function updateFromHex() {
    if (updating) return;
    try {
      var rgb = hexToRgb(hexInput.value);
      var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      updating = true;
      rgbInput.value = rgb.r + ', ' + rgb.g + ', ' + rgb.b;
      hslInput.value = hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%';
      preview.style.background = hexInput.value;
      updating = false;
    } catch (e) {
      showAlert('HEX 格式无效，请使用 #RRGGBB 格式', 'error');
    }
  }

  function updateFromRgb() {
    if (updating) return;
    try {
      var rgb = parseRgb(rgbInput.value);
      var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      updating = true;
      hexInput.value = hex;
      hslInput.value = hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%';
      preview.style.background = hex;
      updating = false;
    } catch (e) {
      showAlert('RGB 格式无效，请使用 255, 255, 255', 'error');
    }
  }

  function updateFromHsl() {
    if (updating) return;
    try {
      var hsl = parseHsl(hslInput.value);
      var rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      updating = true;
      hexInput.value = hex;
      rgbInput.value = rgb.r + ', ' + rgb.g + ', ' + rgb.b;
      preview.style.background = hex;
      updating = false;
    } catch (e) {
      showAlert('HSL 格式无效，请使用 239, 84%, 67%', 'error');
    }
  }

  hexInput.addEventListener('input', updateFromHex);
  rgbInput.addEventListener('input', updateFromRgb);
  hslInput.addEventListener('input', updateFromHsl);
}

function initRegexTester() {
  var patternInput = document.getElementById('regex-pattern');
  var testText = document.getElementById('test-text');
  var matchResult = document.getElementById('match-result');
  var flagG = document.getElementById('flag-g');
  var flagI = document.getElementById('flag-i');
  var flagM = document.getElementById('flag-m');

  function testRegex() {
    var pattern = patternInput.value.trim();
    var text = testText.value;
    if (!pattern) { matchResult.value = '请输入正则表达式'; return; }
    if (!text) { matchResult.value = '请输入测试文本'; return; }
    try {
      var flags = '';
      if (flagG.checked) flags += 'g';
      if (flagI.checked) flags += 'i';
      if (flagM.checked) flags += 'm';
      var regex = new RegExp(pattern, flags);
      var matches = text.match(regex);
      if (!matches) { matchResult.value = '未找到匹配 (共 0 个)'; return; }
      var lines = [];
      if (flagG.checked) {
        lines.push('找到 ' + matches.length + ' 个匹配：');
        for (var i = 0; i < matches.length; i++) {
          lines.push('  [' + (i + 1) + '] ' + matches[i]);
        }
      } else {
        lines.push('找到 ' + matches.length + ' 个匹配（全局模式可能更多）：');
        for (var j = 0; j < matches.length; j++) {
          lines.push('  [' + (j + 1) + '] ' + matches[j]);
        }
      }
      matchResult.value = lines.join('\n');
    } catch (e) {
      matchResult.value = '正则表达式错误：' + e.message;
    }
  }

  patternInput.addEventListener('input', testRegex);
  testText.addEventListener('input', testRegex);
  flagG.addEventListener('change', testRegex);
  flagI.addEventListener('change', testRegex);
  flagM.addEventListener('change', testRegex);
}

function computeDiff(text1, text2) {
  var lines1 = text1.split('\n');
  var lines2 = text2.split('\n');
  var result = [];
  var maxLen = Math.max(lines1.length, lines2.length);
  for (var i = 0; i < maxLen; i++) {
    var l1 = i < lines1.length ? lines1[i] : null;
    var l2 = i < lines2.length ? lines2[i] : null;
    if (l1 === null) {
      result.push('+ ' + l2);
    } else if (l2 === null) {
      result.push('- ' + l1);
    } else if (l1 !== l2) {
      result.push('- ' + l1);
      result.push('+ ' + l2);
    } else {
      result.push('  ' + l1);
    }
  }
  return result.join('\n');
}

function initTextDiff() {
  var textLeft = document.getElementById('text-left');
  var textRight = document.getElementById('text-right');
  var diffResult = document.getElementById('diff-result');
  var compareBtn = document.getElementById('compare-btn');
  var clearBtn = document.getElementById('clear-btn');

  function compare() {
    var t1 = textLeft.value;
    var t2 = textRight.value;
    if (!t1 && !t2) { showAlert('请输入需要对比的文本', 'error'); return; }
    var diff = computeDiff(t1, t2);
    diffResult.value = diff;
    if (t1 === t2) showAlert('两段文本完全相同', 'success');
    else showAlert('对比完成，发现差异', 'warning');
  }

  function clearAll() {
    textLeft.value = '';
    textRight.value = '';
    diffResult.value = '';
    document.getElementById('alert-container').innerHTML = '';
  }

  compareBtn.addEventListener('click', compare);
  clearBtn.addEventListener('click', clearAll);
}

function initHTMLEncoder() {
  var modeSelect = document.getElementById('mode');
  var inputText = document.getElementById('input-text');
  var outputText = document.getElementById('output-text');
  var convertBtn = document.getElementById('convert-btn');
  var copyBtn = document.getElementById('copy-output-btn');
  var clearBtn = document.getElementById('clear-btn');

  function encode(str) {
    var map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
    return str.replace(/[&<>"']/g, function(c) { return map[c]; });
  }

  function decode(str) {
    var map = {'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'", '&#x2F;': '/'};
    return str.replace(/&(?:amp|lt|gt|quot|#39|#x27|#x2F);/g, function(m) { return map[m] || m; });
  }

  function convert() {
    var mode = modeSelect.value;
    var text = inputText.value.trim();
    if (!text) { showAlert('请输入文本', 'error'); return; }
    try {
      outputText.value = mode === 'encode' ? encode(text) : decode(text);
      showAlert(mode === 'encode' ? '编码成功' : '解码成功', 'success');
    } catch (e) { showAlert('错误：' + e.message, 'error'); }
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', function() {
    if (outputText.value) copyToClipboard(outputText.value);
    else showAlert('没有可复制的内容', 'error');
  });
  clearBtn.addEventListener('click', function() {
    inputText.value = ''; outputText.value = ''; document.getElementById('alert-container').innerHTML = '';
  });
}

function initCaseConverter() {
  var inputText = document.getElementById('input-text');
  var convertBtn = document.getElementById('convert-btn');
  var clearBtn = document.getElementById('clear-btn');

  function convert() {
    var text = inputText.value;
    if (!text) { showAlert('请输入文本', 'error'); return; }
    document.getElementById('output-uppercase').value = text.toUpperCase();
    document.getElementById('output-lowercase').value = text.toLowerCase();
    document.getElementById('output-title').value = text.replace(/\w\S*/g, function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); });
    document.getElementById('output-camel').value = text.replace(/[^a-zA-Z0-9]+(.)/g, function(_, c) { return c.toUpperCase(); }).replace(/^[A-Z]/, function(c) { return c.toLowerCase(); });
    document.getElementById('output-snake').value = text.replace(/[^a-zA-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').toLowerCase();
    document.getElementById('output-kebab').value = text.replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
    showAlert('转换完成', 'success');
  }

  convertBtn.addEventListener('click', convert);
  clearBtn.addEventListener('click', function() {
    inputText.value = '';
    ['uppercase','lowercase','title','camel','snake','kebab'].forEach(function(id) {
      document.getElementById('output-' + id).value = '';
    });
    document.getElementById('alert-container').innerHTML = '';
  });
  document.querySelectorAll('.copy-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = document.getElementById(this.getAttribute('data-target'));
      if (target && target.value) copyToClipboard(target.value);
      else showAlert('没有可复制的内容', 'error');
    });
  });
}

function initWordCounter() {
  var inputText = document.getElementById('input-text');
  function update() {
    var text = inputText.value;
    document.getElementById('stat-chars').textContent = text.length;
    document.getElementById('stat-chars-no-space').textContent = text.replace(/\s/g, '').length;
    document.getElementById('stat-words').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('stat-lines').textContent = text ? text.split('\n').length : 0;
    document.getElementById('stat-paragraphs').textContent = text ? text.split(/\n\s*\n/).filter(function(p) { return p.trim(); }).length : 0;
  }
  inputText.addEventListener('input', update);
}

function initBaseConverter() {
  var fromBase = document.getElementById('from-base');
  var toBase = document.getElementById('to-base');
  var inputValue = document.getElementById('input-value');
  var outputValue = document.getElementById('output-value');
  var swapBtn = document.getElementById('swap-btn');
  var copyBtn = document.getElementById('copy-btn');
  var clearBtn = document.getElementById('clear-btn');

  function convert() {
    var value = inputValue.value.trim();
    if (!value) { outputValue.value = ''; return; }
    try {
      var decimal = parseInt(value, parseInt(fromBase.value));
      if (isNaN(decimal)) { outputValue.value = '无效输入'; return; }
      outputValue.value = decimal.toString(parseInt(toBase.value)).toUpperCase();
    } catch (e) { outputValue.value = '无效输入'; }
  }

  function swap() {
    var temp = fromBase.value;
    fromBase.value = toBase.value;
    toBase.value = temp;
    convert();
  }

  inputValue.addEventListener('input', convert);
  fromBase.addEventListener('change', convert);
  toBase.addEventListener('change', convert);
  swapBtn.addEventListener('click', swap);
  copyBtn.addEventListener('click', function() {
    if (outputValue.value) copyToClipboard(outputValue.value);
    else showAlert('没有可复制的内容', 'error');
  });
  clearBtn.addEventListener('click', function() {
    inputValue.value = ''; outputValue.value = ''; document.getElementById('alert-container').innerHTML = '';
  });
}

function renderMarkdown(md) {
  var html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^-{3,}/gm, '<hr>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%">')
    .replace(/^```([\s\S]*?)```$/gm, function(_, code) { return '<pre><code>' + code.trim() + '</code></pre>'; })
    .replace(/^```\w*$/gm, '')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  var lines = html.split('\n');
  var result = [];
  var inList = false;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line === '<li>') {
      if (!inList) { result.push('<ul>'); inList = true; }
      result.push(line + '</li>');
    } else {
      if (inList) { result.push('</ul>'); inList = false; }
      if (line.trim() && !line.match(/^<(h[123]|blockquote|hr|pre|ul|ol|li|<)/)) line = '<p>' + line + '</p>';
      result.push(line);
    }
  }
  if (inList) result.push('</ul>');
  return result.join('\n');
}

function initMarkdownEditor() {
  var mdInput = document.getElementById('md-input');
  var preview = document.getElementById('md-preview');
  var loadSampleBtn = document.getElementById('load-sample-btn');
  var clearBtn = document.getElementById('clear-btn');
  var copyHtmlBtn = document.getElementById('copy-html-btn');

  function update() {
    var text = mdInput.value;
    preview.innerHTML = text ? renderMarkdown(text) : '<p style="color:var(--text-muted);padding:20px;text-align:center;">输入 Markdown 后实时预览</p>';
  }

  function loadSample() {
    mdInput.value = '# 欢迎使用 Markdown\n\n这是一段 **示例文本**，展示了 Markdown 的常用语法。\n\n## 标题\n\n### 三级标题\n\n**粗体** 和 *斜体* 文字。\n\n## 列表\n\n- 项目一\n- 项目二\n- 项目三\n\n## 代码\n\n行内代码 `const a = 1;`\n\n代码块：\n```\nfunction hello() {\n  console.log("Hello World!");\n}\n```\n\n## 链接和引用\n\n> 这是一段引用文字\n\n[访问 GitHub](https://github.com)\n\n---\n\n完成！';
    update();
  }

  var updateTimer = null;
  mdInput.addEventListener('input', function() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(update, 100);
  });
  loadSampleBtn.addEventListener('click', loadSample);
  clearBtn.addEventListener('click', function() {
    mdInput.value = ''; update(); document.getElementById('alert-container').innerHTML = '';
  });
  copyHtmlBtn.addEventListener('click', function() {
    if (preview.innerHTML && !preview.innerHTML.includes('输入 Markdown')) {
      copyToClipboard(preview.innerHTML);
    } else { showAlert('没有可复制的内容', 'error'); }
  });
  loadSample();
}

function initDropdown() {
  document.querySelectorAll('.nav-dropdown').forEach(function(dropdown) {
    var content = dropdown.querySelector('.nav-dropdown-content');
    var timer;
    dropdown.addEventListener('mouseenter', function() {
      clearTimeout(timer);
      content.style.display = 'block';
    });
    dropdown.addEventListener('mouseleave', function() {
      timer = setTimeout(function() { content.style.display = ''; }, 300);
    });
    content.addEventListener('mouseenter', function() { clearTimeout(timer); });
    content.addEventListener('mouseleave', function() {
      timer = setTimeout(function() { content.style.display = ''; }, 300);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initDropdown();
  var path = window.location.pathname;
  if (document.getElementById('generate-btn') && path.includes('uuid-generator')) initUUIDGenerator();
  if (document.getElementById('mode')) {
    if (path.includes('base64')) initBase64();
    else if (path.includes('timestamp')) initTimestamp();
    else if (path.includes('url-encoder')) initURLEncoder();
    else if (path.includes('json-formatter')) initJSONFormatter();
    else if (path.includes('html-encoder')) initHTMLEncoder();
  }
  if (document.getElementById('password-length')) initPasswordGenerator();
  if (document.getElementById('color-preview')) initColorConverter();
  if (document.getElementById('regex-pattern')) initRegexTester();
  if (document.getElementById('text-left')) initTextDiff();
  if (document.getElementById('output-uppercase')) initCaseConverter();
  if (document.getElementById('stat-chars')) initWordCounter();
  if (document.getElementById('from-base')) initBaseConverter();
  if (document.getElementById('md-input')) initMarkdownEditor();
});
