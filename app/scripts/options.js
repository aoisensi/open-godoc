'use strict';

function saveOptions() {
  var accessCheck = document.getElementById('accessCheck').value;
  chrome.storage.sync.set({
    accessCheck: accessCheck
  }, function () {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    accessCheck: true
  }, function (items) {
    document.getElementById('accessCheck').value = items.accessCheck;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
//# sourceMappingURL=options.js.map
