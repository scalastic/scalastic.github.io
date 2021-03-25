module Jekyll
  class PostPagination < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      data = text.split('|')
      @prev_url = data[0]
      @prev_title = data[1]
      @next_url = data[2]
      @next_title = data[3]
    end

    def render(context)

    	tags = %(<div class="article-navigation">)	
			tags += %(<a class="prev" href="#{@prev_url}">
			  	<div class="article-nav article-nav-prev">
			    	<i class="fas fa-angle-double-left"></i> Article Précédent
			    	<h4 class="article-nav-title">#{@prev_title}</h4>
			  	</div>
			  </a>) if !@prev_url.nil? && !@prev_url.empty?
			tags += %(<a class="next" href="#{@next_url}">
				  <div class="article-nav article-nav-next">
				    Article Suivant <i class="fas fa-angle-double-right"></i>
				    <h4 class="article-nav-title">#{@next_title}</h4>
				  </div>
			  </a>) if !@next_url.nil? && !@next_url.empty?
			tags += %(</div>)
			tags
		# "1:" + @prev_url + ":2:" +@prev_title + ":3:" +@next_url + ":4:" + @next_title
    end

  end
end

Liquid::Template.register_tag('post_pagination', Jekyll::PostPagination)