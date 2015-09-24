'use strict';

function saveOptions() {
  var accessCheck = document.getElementById('accessCheck').value;
  chrome.storage.sync.set({
    accessCheck: accessCheck
  }, () => {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    accessCheck: true
  }, (items) => {
    document.getElementById('accessCheck').value = items.accessCheck;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
