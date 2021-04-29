module Jekyll

	module PostPagination

		def pagination(input, label_previous, label_next)

		    @data = input.split('|')

			tags = %(<div class="article-navigation">)
			tags += %(<a class="prev" rel="prev" href="#{@data[0]}">
					<div class="article-nav article-nav-prev">
						<i class="fas fa-angle-double-left"></i> #{label_previous}
						<h4 class="article-nav-title">#{@data[1]}</h4>
					</div>
				</a>) if !@data[0].nil? && !@data[0].empty?
			tags += %(<a class="next" rel="next" href="#{@data[2]}">
					<div class="article-nav article-nav-next">
						#{label_next} <i class="fas fa-angle-double-right"></i>
						<h4 class="article-nav-title">#{@data[3]}</h4>
					</div>
				</a>) if !@data[2].nil? && !@data[2].empty?
			tags += %(</div>)

		end

	end
end

Liquid::Template.register_filter(Jekyll::PostPagination)