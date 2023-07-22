[![Build and Deploy to Github Pages](https://github.com/scalastic/scalastic.github.io/actions/workflows/build-jekyll.yml/badge.svg)](https://github.com/scalastic/scalastic.github.io/actions/workflows/build-jekyll.yml)

# Source Code of Scalastic Website

<a href="https://scalastic.io/en">![](assets/img/scalastic_home.gif)</a>

## About

- This is the source code of the Scalastic website
- It is built with Jekyll 4.3.2
- It is deployed with GitHub Actions
- It is hosted on GitHub Pages

## Requirements

- Ruby 3.2.2
- Bundler 2.4.10

## Installation

- Install Ruby and Bundler
- Clone this repository
- Install dependencies:

```bash
bundle install
```

## Usage

- Production build:

```bash
bundle exec jekyll build
```

- Development build:

```bash
bundle exec jekyll server --watch
```

- Development build included drafts:

```bash
bundle exec jekyll server --watch --drafts
```

- Development build included drafts and future posts:

```bash
bundle exec jekyll server --watch --drafts --future
```

- Development build included drafts, future posts and verbose output:

```bash
bundle exec jekyll server --watch --drafts --future --verbose
```

## Jekyll

- More info can be found at [Jekyll Official Website](https://jekyllrb.com)

## Uses Jekyll Plugins

- [nokogiri](https://nokogiri.org): a Rubygem providing HTML, XML, SAX, and Reader parsers with XPath and CSS selector support.
- [jekyll-paginate](https://jekyllrb.com/docs/pagination/): a pagination plugin, so you can automatically generate the appropriate files and folders you need for paginated listings.
- [jemoji](https://github.com/jekyll/jemoji): a plugin that converts emoji shortcodes into emoji images.
- [premonition](https://github.com/lazee/premonition): a plugin that allows you to use markdown for Bootstrap alerts, like warning, info, danger, etc.
- [jekyll-last-modified-at](https://github.com/gjtorikian/jekyll-last-modified-at): a plugin that adds a last modified date to posts and pages.
- [jekyll-polyglot](https://github.com/untra/polyglot): a plugin that allows you to have multiple languages in your Jekyll site.
- [jekyll_picture_tag](https://github.com/rbuchberger/jekyll_picture_tag): a plugin that allows you to easily create responsive images with an easy to use markup.
- And a lot more included in Jekyll...

## Integrates Layouts

- [Bootstrap 4](https://getbootstrap.com/docs/4.6/getting-started/introduction/): a popular CSS Framework for developing responsive and mobile-first websites.
- [Font Awesome 5](https://fontawesome.com/v5.15/how-to-use/on-the-web/setup/using-package-managers): a popular icon set and toolkit.
- [Google Fonts](https://fonts.google.com): a library of 1,000 free, open-source fonts.
- [Compress HTML](https://github.com/penibelst/jekyll-compress-html): a plugin that compresses HTML files.
- [Code snippet highlighting](https://jekyllrb.com/docs/liquid/tags/#code-snippet-highlighting): a Jekyll integrated syntax highlighter (reworked to look like [Carbon Now](https://carbon.now.sh/) images).

## Uses Jekyll Themes

- [Flexible Jekyll](https://github.com/artemsheludko/flexible-jekyll): a simple and clean theme for Jekyll (However, tweaked to my taste)

## GitHub

### Built and Deployed with GitHub Actions

- [GitHub Actions for Jekyll](https://github.com/jeffreytse/jekyll-deploy-action): a GitHub Action for building and deploying Jekyll sites to GitHub Pages.
- [GitHub Actions Official Website](https://docs.github.com/en/actions): the GitHub Actions Official Website.

### Hosted on GitHub Pages

- [GitHub Pages Official Website](https://pages.github.com): the GitHub Pages Official Website.

## License

<a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>, except for components and images integrated into the content of the website, which may have their own licenses indicated where applicable.