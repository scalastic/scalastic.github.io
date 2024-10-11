[![Build and Deploy to Github Pages](https://github.com/scalastic/scalastic.github.io/actions/workflows/build-jekyll.yml/badge.svg)](https://github.com/scalastic/scalastic.github.io/actions/workflows/build-jekyll.yml)

# Scalastic Website Source Code

[![Scalastic Website](assets/img/scalastic_home.gif)](https://scalastic.io/en)

## Overview

This repository contains the source code for the Scalastic website, a project built with Jekyll version 4.3.2. The website is deployed using GitHub Actions and hosted on GitHub Pages.

## Prerequisites

To work with this project, ensure you have the following installed:

- Ruby 3.2.2
- Bundler 2.4.10

## Installation

Follow these steps to set up the project on your local machine:

1. Install Ruby and Bundler.
2. Clone this repository.
3. Install project dependencies by running:

```bash
bundle install
```

## Usage

Use the following commands to build and serve the website:

- Production build:

```bash
bundle exec jekyll build
```

- Development build:

```bash
bundle exec jekyll server --incremental
```

- Development build with drafts:

```bash
bundle exec jekyll server --incremental --drafts
```

- Development build with drafts and future posts:

```bash
bundle exec jekyll server --incremental --drafts --future
```

- Development build with drafts, future posts, and verbose output:

```bash
bundle exec jekyll server --incremental --drafts --future --verbose
```

## Jekyll

For more information about Jekyll, visit the [Jekyll Official Website](https://jekyllrb.com).

## Utilizes Jekyll Plugins

The project uses various Jekyll plugins, including:

- [nokogiri](https://nokogiri.org): A Ruby gem for parsing HTML and XML.
- [jekyll-paginate](https://jekyllrb.com/docs/pagination/): A pagination plugin.
- [jemoji](https://github.com/jekyll/jemoji): A plugin for converting emoji shortcodes into emoji images.
- [premonition](https://github.com/lazee/premonition): A plugin for creating Bootstrap-style alerts in Markdown.
- [jekyll-last-modified-at](https://github.com/gjtorikian/jekyll-last-modified-at): A plugin for adding last modified date information to posts and pages.
- [jekyll-polyglot](https://github.com/untra/polyglot): A plugin for managing multiple languages in a Jekyll site.
- [jekyll_picture_tag](https://github.com/rbuchberger/jekyll_picture_tag): A plugin for creating responsive images.
- And more included in Jekyll's extensive plugin ecosystem.

## Incorporates Layouts

The website integrates the following layouts:

- [Bootstrap 4](https://getbootstrap.com/docs/4.6/getting-started/introduction): A popular CSS framework for responsive and mobile-first design.
- [Font Awesome 5](https://fontawesome.com/v5.15/how-to-use/on-the-web/setup/using-package-managers): A widely-used icon set and toolkit.
- [Google Fonts](https://fonts.google.com): A library of 1,000 free, open-source fonts.
- [Compress HTML](https://github.com/penibelst/jekyll-compress-html): A plugin for HTML compression.
- Code snippet highlighting: A Jekyll integrated syntax highlighter, styled like [Carbon Now](https://carbon.now.sh/) images.
- GitHub Card: A Jekyll tag, displaying GitHub repo details as GitHub does.

## Utilizes Jekyll Themes

The project is based on the [Flexible Jekyll](https://github.com/artemsheludko/flexible-jekyll) theme, a clean and customizable Jekyll theme tailored to specific preferences.

## GitHub Integration

### Built and Deployed with GitHub Actions

The website is built and deployed using [GitHub Actions for Jekyll](https://github.com/jeffreytse/jekyll-deploy-action), a GitHub Action specifically designed for building and deploying Jekyll sites to GitHub Pages. For more details on GitHub Actions, refer to the [GitHub Actions Official Website](https://docs.github.com/en/actions).

### Hosted on GitHub Pages

The Scalastic website is hosted on [GitHub Pages](https://pages.github.com), the official platform for publishing and sharing web content through GitHub.

## License

[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/), except for components and images integrated into the content of the website, which may have their own licenses indicated where applicable.