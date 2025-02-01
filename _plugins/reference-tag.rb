module Jekyll
  class ReferenceTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @params = parse_params(markup)
    end

    def parse_params(markup)
      params = {}
      markup.scan(/(\w+)\s*=\s*"([^"]*)"/) do |key, value|
        params[key] = value
      end
      params
    end

    def render(context)
      type = @params["type"] || "book"
      image = @params["image"] || ""
      title = @params["title"] || ""
      author = @params["author"] || ""
      summary = @params["summary"] || ""
      collection = @params["collection"] || ""
      publisher = @params["publisher"] || ""
      date = @params["date"] || ""
      pages = @params["pages"] || ""
      format = @params["format"] || ""
      language = @params["language"] || ""
      isbn = @params["isbn"] || ""

      if type == "book"
        render_book(image, title, author, collection, publisher, date, pages, format, language, isbn)
      elsif type == "author"
        render_author(image, title, summary)
      else
        "<p>Type inconnu</p>"
      end
    end

    def render_book(image, title, author, collection, publisher, date, pages, format, language, isbn)
      <<~HTML
      <div class="reference">
        <img src="#{image}" alt="#{title}" class="reference-image">
        <div class="reference-details">
          <div class="reference-title"><i>#{title}</i></div>
          <p><strong>#{author}</strong></p>
          <p><i>#{[collection, publisher].reject(&:empty?).join(", ")}</i></p>
          <p>#{[date, ("#{pages} pages" unless pages.empty?), format, language].reject(&:empty?).join(", ")}</p>
          <p>#{isbn.empty? ? "" : "ISBN: #{isbn}"}</p>
        </div>
      </div>
      HTML
    end  

    def render_author(image, name, bio)
      <<~HTML
      <div class="reference">
        <img src="#{image}" alt="#{name}" class="reference-image">
        <div class="reference-details">
          <div class="reference-title">#{name}</div>
          <p><i>#{bio}</i></p>
        </div>
      </div>
      HTML
    end
  end
end

Liquid::Template.register_tag('reference', Jekyll::ReferenceTag)
