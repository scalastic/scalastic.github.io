module Jekyll
  class PostPagination < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @data = text.split('|')
    end

    def render(context)

    	tags = %(<div class="article-navigation">)	
			tags += %(<a class="prev" href="#{@data[0]}">
			  	<div class="article-nav article-nav-prev">
			    	<i class="fas fa-angle-double-left"></i> Article Précédent
			    	<h4 class="article-nav-title">#{@data[1]}</h4>
			  	</div>
			  </a>) if !@data[0].nil? && !@data[0].empty?
			tags += %(<a class="next" href="#{@data[2]}">
				  <div class="article-nav article-nav-next">
				    Article Suivant <i class="fas fa-angle-double-right"></i>
				    <h4 class="article-nav-title">#{@data[3]}</h4>
				  </div>
			  </a>) if !@data[2].nil? && !@data[2].empty?
			tags += %(</div>)

    end

  end
end

Liquid::Template.register_tag('post_pagination', Jekyll::PostPagination)