(function() {
  var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      for (var j = 0; j < mutations[i].addedNodes.length; j++) {
        var node = mutations[i].addedNodes[j];
        if (node.nodeType === 1 && node.id && node.id.indexOf('pronounce') !== -1) {
          node.parentNode && node.parentNode.removeChild(node);
        }
        if (node.nodeType === 1 && node.querySelector) {
          var el = node.querySelector('[id*="pronounce"]');
          if (el) el.parentNode && el.parentNode.removeChild(el);
        }
      }
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(function() { observer.disconnect(); }, 3000);
})();
