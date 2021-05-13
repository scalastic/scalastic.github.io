module Jekyll

	module PostPagination

		def pagination(input, label_previous, label_next)

		    @data = input.split('|')

			tags = %(<div class="article-navigation">)
			tags += %(<a class="prev" rel="prev" href="#{@data[0]}">
					<div class="article-nav article-nav-prev">
						<span>
						<svg width="15.75" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z"></path></svg>
						</span> #{label_previous}
						<h4 class="article-nav-title">#{@data[1]}</h4>
					</div>
				</a>) if !@data[0].nil? && !@data[0].empty?
			tags += %(<a class="next" rel="next" href="#{@data[2]}">
					<div class="article-nav article-nav-next">
						#{label_next} <span>
						<svg width="15.75" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"></path></svg></span>
						<h4 class="article-nav-title">#{@data[3]}</h4>
					</div>
				</a>) if !@data[2].nil? && !@data[2].empty?
			tags += %(</div>)

		end

	end
end

Liquid::Template.register_filter(Jekyll::PostPagination)