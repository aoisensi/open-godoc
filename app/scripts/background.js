'use strict';

var services = {
  'github.com': function githubCom(pathes) {
    var pkg = (function () {
      if (pathes.length < 3) {
        return null;
      }
      var ignores = ['issues', 'pulls', 'explore', 'settings', 'blog', 'account'];
      if (ignores.indexOf(pathes[1]) !== -1) {
        return null;
      }
      var pkg = ['github.com'];
      [].push.apply(pkg, pathes.slice(1, 3));
      if (pathes.length === 3) {
        return pkg;
      }
      switch (pathes[3]) {
        case 'tree':
          [].push.apply(pkg, pathes.slice(5));
          return pkg;
        case 'blob':
          [].push.apply(pkg, pathes.slice(5, -1));
          return pkg;
      }
      return pkg;
    })();
    if (pkg === null) {
      return null;
    }
    if (pkg.length >= 5 && pkg[1] === 'golang' && pkg[2] === 'go' && pkg[3] === 'src' && pkg[4] !== 'cmd') {
      pkg = pkg.slice(4);
    }
    return pkg.join('/');
  }
};

function parse(urls, doit) {
  var url = new URL(urls);
  var service = services[url.hostname];
  if (service === undefined) {
    return null;
  }
  var path = url.pathname;
  if (path === null) {
    return;
  }
  var pathes = path.split('/');
  //remove last slash
  if (pathes[-1] === '') {
    pathes = pathes.slice(0, -1);
  }
  var name = service(pathes);
  if (name === null) {
    return;
  }
  //Can i stop showing 404 error console message?
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', 'http://godoc.org/' + name);
  xhr.onloadend = function () {
    if (xhr.status === 200) {
      doit(name);
    }
  };
  xhr.send();
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  parse(tab.url, function () {
    chrome.pageAction.show(tabId);
  });
});

chrome.pageAction.onClicked.addListener(function (tab) {
  parse(tab.url, function (pkg) {
    var url = 'http://godoc.org/' + pkg;
    chrome.tabs.create({ url: url });
  });
});
//# sourceMappingURL=background.js.map
