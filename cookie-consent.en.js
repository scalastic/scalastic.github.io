---
lang: en
permalink: /cookie-consent.js
---
window.cookieconsent.initialise({
  "palette": {
    "popup": {
      "background": "#515151",
      "text": "#0f0"
    },
    "button": {
      "background": "#0f0"
    }
  },
  "theme": "edgeless",
  "type": "opt-in",
  "content": {
    "message": "{{ site.data.i18n.cookie-consent }}",
    "href": "{{ site.url }}/privacy/"
  },
  onInitialise: function (status) {
    var type = this.options.type;
    var didConsent = this.hasConsented();
    if (type == 'opt-in' && didConsent) {
      // enable cookies
      loadGAonConsent();
      loadDisqusOnConsent();
    }
    if (type == 'opt-out' && !didConsent) {
      // disable cookies
    }
  },
  onStatusChange: function(status, chosenBefore) {
    var type = this.options.type;
    var didConsent = this.hasConsented();
    if (type == 'opt-in' && didConsent) {
      // enable cookies
      loadGAonConsent();
      loadDisqusOnConsent();
    }
    if (type == 'opt-out' && !didConsent) {
      // disable cookies
    }
  },
  onRevokeChoice: function() {
    var type = this.options.type;
    if (type == 'opt-in') {
      // disable cookies
    }
    if (type == 'opt-out') {
      // enable cookies
      loadGAonConsent();
      loadDisqusOnConsent();
    }
  }
});