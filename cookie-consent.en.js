---
layout: null
lang: en
permalink: /cookie-consent.js
sitemap: false
---
window.cookieconsent.initialise({palette:{popup:{background:"#515151",text:"#0f0"},button:{background:"#0f0"}},theme:"edgeless",type:"opt-in",content:{message:"{{ site.data.i18n.cookie-consent }}",href:"{{ site.url }}/en/privacy/"},onInitialise:function(n){var t=this.options.type,o=this.hasConsented();"opt-in"==t&&o&&loadDisqusOnConsent()},onStatusChange:function(n,t){var o=this.options.type,e=this.hasConsented();"opt-in"==o&&e&&loadDisqusOnConsent()},onRevokeChoice:function(){var n=this.options.type;"opt-out"==n&&loadDisqusOnConsent()}});