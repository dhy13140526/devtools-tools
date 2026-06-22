// Main JavaScript functionality for devtools-tools

// UUID Generator
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
  alert.className = `alert ${type}`;
  alert.textContent = message;
  container.innerHTML = '';
  container.appendChild(alert);

  // Auto hide after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showAlert('Copied to clipboard!', 'success');
  }).catch(err => {
    showAlert('Failed to copy to clipboard', 'error');
  });
}

// Initialize UUID Generator
function initUUIDGenerator() {
  const quantityInput = document.getElementById('quantity');
  const inputText = document.getElementById('input-uuids');
  const outputText = document.getElementById('output-uuids');
  const generateBtn = document.getElementById('generate-btn');
  const copyAllBtn = document.getElementById('copy-all-btn');
  const clearBtn = document.getElementById('clear-btn');

  function generateUUIDs() {
    const quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1 || quantity > 100) {
      showAlert('Please enter a number between 1 and 100', 'error');
      return;
    }

    // Parse existing UUIDs from input
    const existingUUIDs = inputText.value.split('\n')
      .filter(line => line.trim())
      .filter(line => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(line.trim()));

    // Generate new UUIDs
    const newUUIDs = [];
    for (let i = 0; i < quantity; i++) {
      newUUIDs.push(generateUUID());
    }

    // Combine existing and new UUIDs
    const allUUIDs = [...existingUUIDs, ...newUUIDs];
    outputText.value = allUUIDs.join('\n');

    if (newUUIDs.length > 0) {
      showAlert(`Generated ${newUUIDs.length} new UUID(s)`, 'success');
    }
  }

  function copyAllUUIDs() {
    const outputText = document.getElementById('output-uuids').value;
    if (!outputText) {
      showAlert('No UUIDs to copy', 'error');
      return;
    }
    copyToClipboard(outputText);
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

// Base64 Encoder/Decoder
function encodeBase64(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeBase64(base64) {
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    throw new Error('Invalid Base64 string');
  }
}

function initBase64() {
  const modeSelect = document.getElementById('mode');
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const convertBtn = document.getElementById('convert-btn');
  const copyBtn = document.getElementById('copy-output-btn');
  const clearBtn = document.getElementById('clear-btn');

  function convert() {
    const mode = modeSelect.value;
    const text = inputText.value.trim();
    
    if (!text) {
      showAlert('Please enter some text', 'error');
      return;
    }

    try {
      let result;
      if (mode === 'encode') {
        result = encodeBase64(text);
      } else {
        result = decodeBase64(text);
      }
      outputText.value = result;
      showAlert(`Successfully ${mode === 'encode' ? 'encoded' : 'decoded'}`, 'success');
    } catch (e) {
      showAlert(`Error: ${e.message}`, 'error');
    }
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', () => {
    if (outputText.value) {
      copyToClipboard(outputText.value);
    } else {
      showAlert('No output to copy', 'error');
    }
  });
  clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    document.getElementById('alert-container').innerHTML = '';
  });
}

// Timestamp Converter
function timestampToDate(timestamp) {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function dateToTimestamp(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return Math.floor(date.getTime() / 1000);
}

function initTimestamp() {
  const modeSelect = document.getElementById('mode');
  const inputValue = document.getElementById('input-value');
  const outputValue = document.getElementById('output-value');
  const convertBtn = document.getElementById('convert-btn');
  const copyBtn = document.getElementById('copy-output-btn');
  const clearBtn = document.getElementById('clear-btn');
  const nowBtn = document.getElementById('now-btn');
  const nowTimestampBtn = document.getElementById('now-timestamp-btn');

  function convert() {
    const mode = modeSelect.value;
    const value = inputValue.value.trim();
    
    if (!value) {
      showAlert('Please enter a value', 'error');
      return;
    }

    try {
      let result;
      if (mode === 'timestamp-to-date') {
        result = timestampToDate(value);
      } else {
        result = dateToTimestamp(value);
      }
      outputValue.value = result;
      showAlert('Conversion successful', 'success');
    } catch (e) {
      showAlert(`Error: ${e.message}`, 'error');
    }
  }

  function getCurrentDate() {
    const now = new Date();
    inputValue.value = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function getCurrentTimestamp() {
    const now = Math.floor(Date.now() / 1000);
    inputValue.value = now.toString();
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', () => {
    if (outputValue.value) {
      copyToClipboard(outputValue.value);
    } else {
      showAlert('No output to copy', 'error');
    }
  });
  clearBtn.addEventListener('click', () => {
    inputValue.value = '';
    outputValue.value = '';
    document.getElementById('alert-container').innerHTML = '';
  });
  nowBtn.addEventListener('click', getCurrentDate);
  nowTimestampBtn.addEventListener('click', getCurrentTimestamp);
}

// URL Encoder/Decoder
function encodeURL(text) {
  return encodeURIComponent(text);
}

function decodeURL(encoded) {
  try {
    return decodeURIComponent(encoded);
  } catch (e) {
    throw new Error('Invalid URL encoding');
  }
}

function initURLEncoder() {
  const modeSelect = document.getElementById('mode');
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const convertBtn = document.getElementById('convert-btn');
  const copyBtn = document.getElementById('copy-output-btn');
  const clearBtn = document.getElementById('clear-btn');
  const encodeExampleBtn = document.getElementById('encode-example-btn');
  const decodeExampleBtn = document.getElementById('decode-example-btn');

  function convert() {
    const mode = modeSelect.value;
    const text = inputText.value.trim();
    
    if (!text) {
      showAlert('Please enter some text', 'error');
      return;
    }

    try {
      let result;
      if (mode === 'encode') {
        result = encodeURL(text);
      } else {
        result = decodeURL(text);
      }
      outputText.value = result;
      showAlert(`Successfully ${mode === 'encode' ? 'encoded' : 'decoded'}`, 'success');
    } catch (e) {
      showAlert(`Error: ${e.message}`, 'error');
    }
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
  copyBtn.addEventListener('click', () => {
    if (outputText.value) {
      copyToClipboard(outputText.value);
    } else {
      showAlert('No output to copy', 'error');
    }
  });
  clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    document.getElementById('alert-container').innerHTML = '';
  });
  encodeExampleBtn.addEventListener('click', loadEncodeExample);
  decodeExampleBtn.addEventListener('click', loadDecodeExample);
}

// JSON Formatter/Validator
function formatJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    throw new Error(`JSON parsing error: ${e.message}`);
  }
}

function minifyJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (e) {
    throw new Error(`JSON parsing error: ${e.message}`);
  }
}

function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    throw new Error(`JSON validation error: ${e.message}`);
  }
}

function getJSONStats(jsonString) {
  const parsed = JSON.parse(jsonString);
  let count = 0;
  
  function countNodes(obj) {
    if (Array.isArray(obj)) {
      count++;
      obj.forEach(item => countNodes(item));
    } else if (obj && typeof obj === 'object') {
      count++;
      Object.values(obj).forEach(value => countNodes(value));
    }
  }
  
  countNodes(parsed);
  return count;
}

function initJSONFormatter() {
  const modeSelect = document.getElementById('mode');
  const inputJSON = document.getElementById('input-json');
  const outputJSON = document.getElementById('output-json');
  const convertBtn = document.getElementById('convert-btn');
  const copyBtn = document.getElementById('copy-output-btn');
  const clearBtn = document.getElementById('clear-btn');
  const sampleBtn = document.getElementById('sample-btn');
  const statsContainer = document.getElementById('stats-container');
  const statsElement = document.getElementById('json-stats');

  function convert() {
    const mode = modeSelect.value;
    const jsonString = inputJSON.value.trim();
    
    if (!jsonString) {
      showAlert('Please enter some JSON data', 'error');
      return;
    }

    try {
      let result;
      if (mode === 'format') {
        result = formatJSON(jsonString);
      } else if (mode === 'validate') {
        validateJSON(jsonString);
        result = '✓ Valid JSON';
        statsContainer.style.display = 'block';
        statsElement.textContent = `1 object/array with ${getJSONStats(jsonString)} nodes`;
      } else {
        result = minifyJSON(jsonString);
      }
      
      outputJSON.value = result;
      
      if (mode === 'format') {
        showAlert('JSON formatted successfully', 'success');
      } else if (mode === 'validate') {
        showAlert('JSON is valid', 'success');
      } else {
        showAlert('JSON minified successfully', 'success');
      }
    } catch (e) {
      showAlert(`Error: ${e.message}`, 'error');
      outputJSON.value = '';
      statsContainer.style.display = 'none';
    }
  }

  function loadSample() {
    const sampleJSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true,
  "hobbies": ["reading", "coding", "hiking"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "phoneNumbers": [
    "+1-555-0123",
    "+1-555-0456"
  ]
}`;
    inputJSON.value = sampleJSON;
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', () => {
    const outputJSON = document.getElementById('output-json').value;
    if (outputJSON && outputJSON !== '✓ Valid JSON') {
      copyToClipboard(outputJSON);
    } else {
      showAlert('No output to copy', 'error');
    }
  });
  clearBtn.addEventListener('click', () => {
    inputJSON.value = '';
    outputJSON.value = '';
    document.getElementById('alert-container').innerHTML = '';
    document.getElementById('stats-container').style.display = 'none';
  });
  sampleBtn.addEventListener('click', loadSample);
}

// Initialize all tools when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize each tool based on the current page
  if (document.getElementById('generate-btn')) {
    initUUIDGenerator();
  }
  if (document.getElementById('mode') && document.getElementById('convert-btn')) {
    const currentPage = window.location.pathname;
    if (currentPage.includes('base64')) {
      initBase64();
    } else if (currentPage.includes('timestamp')) {
      initTimestamp();
    } else if (currentPage.includes('url-encoder')) {
      initURLEncoder();
    } else if (currentPage.includes('json-formatter')) {
      initJSONFormatter();
    }
  }
});
