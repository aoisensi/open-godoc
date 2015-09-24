'use strict';

var services = {
  'github.com': (pathes) => {
    if (pathes.length < 3) {
      return null;
    }
    var ignores = ['issues', 'pulls', 'explore', 'settings', 'blog', 'account'];
    if (ignores.indexOf(pathes[1]) !== -1) {
      return null;
    }
    return 'github.com/' + pathes[1] + '/' + pathes[2];
  }
};

function parse(urls) {
  var url = new URL(urls);
  var service = services[url.hostname];
  if (service === undefined) {
    return null;
  }
  var pathes = url.pathname.split('/');
  var name = service(pathes);
  var http = new XMLHttpRequest();
  http.open('GET', 'http://godoc.org/' + name, false);
  http.send();
  if (http.status !== 200) {
    return null;
  }
  return name;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (parse(tab.url) !== null) {
    chrome.pageAction.show(tabId);
  }
});

chrome.pageAction.onClicked.addListener(tab => {
  var url = 'http://godoc.org/' + parse(tab.url);
  chrome.tabs.create({
    url: url
  });
});
