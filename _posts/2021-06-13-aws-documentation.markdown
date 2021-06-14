---
layout: post
title: Extraction de la documentation AWS
date: 2021-06-13 09:00:00 +0200
description: L'extraction de la documentation de Amazon Web Services (AWS) sur une seule page avec le code source pour générer un export au format JSON.
img: aws-documentation.jpg
fig-caption: Photo de <a href="https://unsplash.com/@luliricciardi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Lucía Ricciardi</a> sur <a href="https://unsplash.com/images/nature/beach?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
tags: [AWS, Documentation, JSON, Scraper]
lang: fr
permalink: /aws-documentation/
status: finished
---

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/json2html/2.1.0/json2html.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>

<div class="container-fluid">

<script>
  $.getJSON( "{{ site.url }}{{ site.baseurl }}/assets/full-documentation.json", function( data ) {
    
    json2html.component.add('main-header',
    {'<>':'section','html':[
        {'<>':'h1','text':'${title}','class':'text-muted'},
        {'<>':'p','text':'${abstract}','class':'lead'},
        {'[]':'panels','obj':function(){return(this.panels)}}
    ]});
    
    json2html.component.add('panels',
    {'<>':'section','html':[
      {'<>':'header','html':[
        {'<>':'div','class':'accordion accordion-flush','id':'accordion-panels'},
        {'<>':'div','class':'accordion-item','html':[
          {'<>':'h2','class':'accordion-header','id':'heading-${id}','html':[
            {'<>':'button','text':'${title}','class':'accordion-button collapsed','type':'button','data-bs-toggle':'collapse','data-bs-target':'#collapse-${id}','aria-expande':'false','aria-controls':'collapse-${id}'}
          ]},
          {'<>':'div','id':'collapse-${id}','class':'accordion-collapse collapse','aria-labelledby':'heading-${id}','data-bs-parent':'#accordion-panels','html':[
            {'<>':'div','class':'accordion-body'},
              {'<>':'div','class':'row g-2','html':[
                {'[]':'service','obj':function(){return(this.services.service)}}
              ]}
          ]}
        ]}
      ]}
    ]});

    json2html.component.add('service',
      {'<>':'div','class':'col-6','html':[
        {'<>':'div','class':'p-3 border bg-light','html':[
          {'<>':'section','html':[
          {'<>':'header','html':[
            {'<>':'div','class':'accordion accordion-flush','id':'accordion-service'},
            {'<>':'div','class':'accordion-item','html':[
              {'<>':'h3','class':'accordion-header','id':'heading-${id}','html':[
                {'<>':'button','class':'accordion-button collapsed','type':'button','data-bs-toggle':'collapse','data-bs-target':'#collapse-${id}','aria-expande':'false','aria-controls':'collapse-${id}','html':[
                    {'<>':'span','class':'text-muted','html':'${prefix}'},
                    {'html':'&nbsp;${name}'}
                  ]},
              ]},
              {'<>':'div','id':'collapse-${id}','class':'accordion-collapse collapse','aria-labelledby':'heading-${id}','data-bs-parent':'#accordion-service','html':[
                {'<>':'div','class':'accordion-body','html':[
                  {'[]':'service-href','obj':function(){return(this.href)}}
                ]}
              ]}
            ]}
          ]}
        ]}
      ]}
    ]});

    json2html.component.add('service-href',
      {'<>':'div','class':'card','html':[
        {'<>':'div','class':'card-header','text':'${abstract}'},
        {'[]':'sections','obj':function(){return(this.sections)}}
      ]}
    );

    json2html.component.add('sections',
      {'html':[
        {'<>':'div','class':'card-body','html':[
          {'<>':'h4','class':'card-title','html':'${title}'}
        ]},
        {'[]':'tiles','obj':function(){return(this.tiles)}}
      ]}
    );

    json2html.component.add('tiles',
      {'[]':'tile','obj':function(){return(this.tile)}}
    );

    json2html.component.add('tile',
      {'<>':'div','class':'card text-dark bg-light mb-3','html':[
        {'<>':'h5','class':'card-header','text':'${title}'},
        {'<>':'div','class':'card-body','html':[
          {'<>':'p','class':'card-text','html':'${abstract}'},
          {'<>':'div','class':'d-flex flex-row mb-3 justify-content-evenly','html':[
            {'[]':'amazon','obj':function(){return(this)}},
            {'[]':'pdf','obj':function(){return(this)}},
            {'[]':'github','obj':function(){return(this)}}
          ]}
        ]}
      ]}
    );

    json2html.component.add('amazon',
      {'<>':'div','class':function(){if(!!this.href) return("p-2"); else return("visually-hidden");},'html':[
        {'<>':'a','rel':'noopener noreferrer nofollow','href':'${href}','data-bs-toggle':'tooltip','data-bs-placement':'top','title':'More on AWS website','html':[
          {'<>':'span','html':[
            {'<>':'svg','width':'22.5','height':'18','xmlns':'http://www.w3.org/2000/svg','viewBox':'0 0 640 512','html':[
              {'<>':'path', 'd':'M180.41 203.01c-.72 22.65 10.6 32.68 10.88 39.05a8.164 8.164 0 0 1-4.1 6.27l-12.8 8.96a10.66 10.66 0 0 1-5.63 1.92c-.43-.02-8.19 1.83-20.48-25.61a78.608 78.608 0 0 1-62.61 29.45c-16.28.89-60.4-9.24-58.13-56.21-1.59-38.28 34.06-62.06 70.93-60.05 7.1.02 21.6.37 46.99 6.27v-15.62c2.69-26.46-14.7-46.99-44.81-43.91-2.4.01-19.4-.5-45.84 10.11-7.36 3.38-8.3 2.82-10.75 2.82-7.41 0-4.36-21.48-2.94-24.2 5.21-6.4 35.86-18.35 65.94-18.18a76.857 76.857 0 0 1 55.69 17.28 70.285 70.285 0 0 1 17.67 52.36l-.01 69.29zM93.99 235.4c32.43-.47 46.16-19.97 49.29-30.47 2.46-10.05 2.05-16.41 2.05-27.4-9.67-2.32-23.59-4.85-39.56-4.87-15.15-1.14-42.82 5.63-41.74 32.26-1.24 16.79 11.12 31.4 29.96 30.48zm170.92 23.05c-7.86.72-11.52-4.86-12.68-10.37l-49.8-164.65c-.97-2.78-1.61-5.65-1.92-8.58a4.61 4.61 0 0 1 3.86-5.25c.24-.04-2.13 0 22.25 0 8.78-.88 11.64 6.03 12.55 10.37l35.72 140.83 33.16-140.83c.53-3.22 2.94-11.07 12.8-10.24h17.16c2.17-.18 11.11-.5 12.68 10.37l33.42 142.63L420.98 80.1c.48-2.18 2.72-11.37 12.68-10.37h19.72c.85-.13 6.15-.81 5.25 8.58-.43 1.85 3.41-10.66-52.75 169.9-1.15 5.51-4.82 11.09-12.68 10.37h-18.69c-10.94 1.15-12.51-9.66-12.68-10.75L328.67 110.7l-32.78 136.99c-.16 1.09-1.73 11.9-12.68 10.75h-18.3zm273.48 5.63c-5.88.01-33.92-.3-57.36-12.29a12.802 12.802 0 0 1-7.81-11.91v-10.75c0-8.45 6.2-6.9 8.83-5.89 10.04 4.06 16.48 7.14 28.81 9.6 36.65 7.53 52.77-2.3 56.72-4.48 13.15-7.81 14.19-25.68 5.25-34.95-10.48-8.79-15.48-9.12-53.13-21-4.64-1.29-43.7-13.61-43.79-52.36-.61-28.24 25.05-56.18 69.52-55.95 12.67-.01 46.43 4.13 55.57 15.62 1.35 2.09 2.02 4.55 1.92 7.04v10.11c0 4.44-1.62 6.66-4.87 6.66-7.71-.86-21.39-11.17-49.16-10.75-6.89-.36-39.89.91-38.41 24.97-.43 18.96 26.61 26.07 29.7 26.89 36.46 10.97 48.65 12.79 63.12 29.58 17.14 22.25 7.9 48.3 4.35 55.44-19.08 37.49-68.42 34.44-69.26 34.42zm40.2 104.86c-70.03 51.72-171.69 79.25-258.49 79.25A469.127 469.127 0 0 1 2.83 327.46c-6.53-5.89-.77-13.96 7.17-9.47a637.37 637.37 0 0 0 316.88 84.12 630.22 630.22 0 0 0 241.59-49.55c11.78-5 21.77 7.8 10.12 16.38zm29.19-33.29c-8.96-11.52-59.28-5.38-81.81-2.69-6.79.77-7.94-5.12-1.79-9.47 40.07-28.17 105.88-20.1 113.44-10.63 7.55 9.47-2.05 75.41-39.56 106.91-5.76 4.87-11.27 2.3-8.71-4.1 8.44-21.25 27.39-68.49 18.43-80.02z'}
            ]}
          ]}
        ]}
      ]});

    json2html.component.add('pdf',
      {'<>':'div','class':function(){if(!!this.pdf) return("p-2"); else return("visually-hidden");},'html':[
        {'<>':'a','rel':'noopener noreferrer nofollow','href':'${pdf}','data-bs-toggle':'tooltip','data-bs-placement':'top','title':'Download PDF','html':[
          {'<>':'span','html':[
            {'<>':'svg','width':'13.5','height':'18','xmlns':'http://www.w3.org/2000/svg','viewBox':'0 0 384 512','html':[
              {'<>':'path','d':'M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm250.2-143.7c-12.2-12-47-8.7-64.4-6.5-17.2-10.5-28.7-25-36.8-46.3 3.9-16.1 10.1-40.6 5.4-56-4.2-26.2-37.8-23.6-42.6-5.9-4.4 16.1-.4 38.5 7 67.1-10 23.9-24.9 56-35.4 74.4-20 10.3-47 26.2-51 46.2-3.3 15.8 26 55.2 76.1-31.2 22.4-7.4 46.8-16.5 68.4-20.1 18.9 10.2 41 17 55.8 17 25.5 0 28-28.2 17.5-38.7zm-198.1 77.8c5.1-13.7 24.5-29.5 30.4-35-19 30.3-30.4 35.7-30.4 35zm81.6-190.6c7.4 0 6.7 32.1 1.8 40.8-4.4-13.9-4.3-40.8-1.8-40.8zm-24.4 136.6c9.7-16.9 18-37 24.7-54.7 8.3 15.1 18.9 27.2 30.1 35.5-20.8 4.3-38.9 13.1-54.8 19.2zm131.6-5s-5 6-37.3-7.8c35.1-2.6 40.9 5.4 37.3 7.8z'}
            ]}
          ]}
        ]}
      ]});

    json2html.component.add('github',
      {'<>':'div','class':function(){if(!!this.github) return("p-2"); else return("visually-hidden");},'html':[
        {'<>':'a','rel':'noopener noreferrer nofollow','href':'${github}','data-bs-toggle':'tooltip','data-bs-placement':'top','title':'See source code on Github','html':[
          {'<>':'span','html':[
            {'<>':'svg','width':'17.5','height':'18','xmlns':'http://www.w3.org/2000/svg','viewBox':'0 0 496 512','html':[
              {'<>':'path','d':'M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'}
            ]}
          ]}
        ]}
      ]});
    
    let template = [
      {'[]':'main-header'}];
    
    $('.container-fluid').json2html(data,template);
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  });
</script>

> info "Code source"
> Les sources du scraper sont dans [https://github.com/scalastic/aws-documentation-scraper](https://github.com/scalastic/aws-documentation-scraper){:target="_blank" rel="noopener noreferrer nofollow"}
