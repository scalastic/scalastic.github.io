# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# Modified version from source code: https://privacy.apache.org/guides/jekyll-youtube-plugin.html

module Jekyll
    class YouTube < Liquid::Tag
      def initialize(tag_name, text, tokens)
        super
        @text = text.strip
      end
  
      def render(context)
        video_id, image_url = @text.split(' ')
        site = context.registers[:site]
        lang = context["page.lang"] || site.config["default_lang"] || "en"
        if (lang == "fr")
          youtube_notice = "En cliquant sur cette image, la vidéo se chargera et des données seront échangées avec YouTube/Google."
        else
          youtube_notice = "Clicking on this image will load the video and send data from and to YouTube/Google."
        end

        <<~HTML
          <div class="youtube-placeholder yt-container-#{video_id}" style="cursor: pointer;">
            <img src="#{image_url}" alt="Video thumbnail" class="youtube-thumbnail">
            <svg class="youtube-play-button" viewBox="0 0 68 48" width="68" height="48">
              <path class="youtube-play-button-bg" d="M66.52 7.66c-.78-2.92-3.08-5.22-6-6C55.08 0 34 0 34 0S12.92 0 7.48 1.66c-2.92.78-5.22 3.08-6 6C0 13.92 0 24 0 24s0 10.08 1.48 16.34c.78 2.92 3.08 5.22 6 6C12.92 48 34 48 34 48s21.08 0 26.52-1.66c2.92-.78 5.22-3.08 6-6C68 34.08 68 24 68 24s0-10.08-1.48-16.34z"></path>
              <path class="youtube-play-button-icon" d="M45 24l-15-9v18"></path>
            </svg>
          </div>
          <div class="youtube-placeholder-description">
          #{youtube_notice}
          </div>
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              var container = document.querySelector('.yt-container-#{video_id}');
              function addElement() {
                var iframe = document.createElement('iframe');
                iframe.setAttribute('width', '560');
                iframe.setAttribute('height', '315');
                iframe.setAttribute('src', 'https://www.youtube-nocookie.com/embed/#{video_id}?autoplay=1');
                iframe.setAttribute('title', 'YouTube video player');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('allowfullscreen', '');
                container.innerHTML = '';
                container.appendChild(iframe);
              }
              container.addEventListener('click', addElement);
            });
          </script>
        HTML
      end
    end
  end
  
  Liquid::Template.register_tag('youtube', Jekyll::YouTube)