var ld = {


_currentPanel: '#root',

  get currentPanel() {
    return this._currentPanel;
  },

  set currentPanel(hash) {
    if (!hash.startsWith('#')) {
      hash = '#' + hash;
    }

    if (hash == this._currentPanel) {
      return;
    }

    var oldPanelHash = this._currentPanel;
    var oldPanel = document.querySelector(this._currentPanel);
    this._currentPanel = hash;
    var newPanelHash = this._currentPanel;
    var newPanel = document.querySelector(this._currentPanel);
    oldPanel.className = newPanel.className ? 'peek' : 'peek previous forward';
    newPanel.className = newPanel.className ? 'current peek' : 'peek current forward';

    if ((window.scrollX !== 0) || (window.scrollY !== 0)) {
      window.scrollTo(0, 0);
    }
window.addEventListener('transitionend', function paintWait() {
      window.removeEventListener('transitionend', paintWait);

      // We need to wait for the next tick otherwise gecko gets confused
      setTimeout(function nextTick() {
        oldPanel.classList.remove('peek');
        oldPanel.classList.remove('forward');
        newPanel.classList.remove('peek');
        newPanel.classList.remove('forward');

        // When multiple visible panels are present,
        // they are not painted correctly. This appears to fix the issue.
        // Only do this after the first load
        if (oldPanel.className === 'current')
          return;

        oldPanel.addEventListener('transitionend', function onTransitionEnd(e) {
          oldPanel.removeEventListener('transitionend', onTransitionEnd);
          var detail = {
            previous: oldPanelHash,
            current: newPanelHash
          };
          var event = new CustomEvent('panelready', {detail: detail});
          window.dispatchEvent(event);
        });
      });
    });
  },
  init : function(){
	ld.currentPanel="root";
  }


}
window.addEventListener('load', function loadSettings() {
  window.removeEventListener('load', loadSettings);
  
document.addEventListener('click', function settings_sectionOpenClick(e) {
    var target = e.target;
    var nodeName = target.nodeName.toLowerCase();
    if (nodeName != 'a') {
      return;
    }

    var href = target.getAttribute('href');
    // skips the following case:
    // 1. no href, which is not panel
    // 2. href is not a hash which is not a panel
    // 3. href equals # which is translated with loadPanel function, they are
    // external links.
    if (!href || !href.startsWith('#') || href === '#') {
      return;
    }

    ld.currentPanel = href;
    e.preventDefault();
  });
  
  });