---
layout: null
lang: fr
permalink: /cookie-consent.js
sitemap: false
---
window.cookieconsent.initialise({palette:{popup:{background:"#515151",text:"#0f0"},button:{background:"#0f0"}},theme:"edgeless",type:"opt-in",content:{message:"{{ site.data.i18n.cookie-consent }}",href:"{{ site.url }}/privacy/"},onInitialise:function(t){var n=this.options.type,o=this.hasConsented();"opt-in"==n&&o&&loadDisqusOnConsent()},onStatusChange:function(t,n){var o=this.options.type,e=this.hasConsented();"opt-in"==o&&e&&loadDisqusOnConsent()},onRevokeChoice:function(){var t=this.options.type;"opt-out"==t&&loadDisqusOnConsent()}});