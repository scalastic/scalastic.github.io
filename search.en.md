---
layout: post
title: Search articles and keywords
date: 2021-07-18 00:00:00 +0200
description: Full-text search in articles' contents and their keywords
img: page-search.jpg
fig-caption: Photo by <a href="https://unsplash.com/@prevailz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sean Pierce</a> on <a href="https://unsplash.com/s/photos/desert-landscape?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
lang: en
comments: false
metadata: false
permalink: /search/
---

<article class="article-page">
  <div class="page-content">
    <div class="wrap-content">
      <div class="search-container">
        <form class="search-form" name="search-hero" onsubmit="return false;">
          <span class="search-icon"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="9" cy="9" r="7"></circle><path fill="none" stroke="#000" stroke-width="1.1" d="M14,14 L18,18 L14,14 Z"></path></svg></span>
          <input id="search-input" class="search-input" type="search" placeholder="Type your search..." autofocus>
        </form>
      </div>
      <div id="search-result" class="page-recomm"></div>
    </div>
  </div>
</article>

<script src="/search.min.js" type="text/javascript"></script>
<script>
SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('search-result'),
  json: '/en/search.json',
  searchResultTemplate: '<div class="recomm"><a class="recomm" href="{url}"><h5>{title}</h5>{img}</a></div>',
  noResultsText: 'No result found.',
  limit: 20,
  fuzzy: false,
})
</script>
