require "rouge"

module Rouge
  module Formatters
    # Transforms a token stream into HTML output.
    class HTMLLegacy < Formatter
      tag 'html_legacy'

      DEFAULT_OPTS = {
        css_class: 'highlight',
        line_numbers: false,
        linewise: false,
        inline_theme: nil,
        wrap: true
      }

      def initialize(opts = {})
        opts = DEFAULT_OPTS.merge(opts)
        @formatter = select_formatter(opts)
      end

      private

      def select_formatter(opts)
        formatter = opts[:inline_theme] ? HTMLInline.new(opts[:inline_theme]) : HTML.new
        formatter = HTMLLinewise.new(formatter, opts) if opts[:linewise]
        formatter = HTMLTable.new(formatter, opts) if opts[:line_numbers]
        formatter = HTMLPygments.new(formatter, opts.fetch(:css_class, 'codehilite')) if opts.fetch(:wrap, true)
        formatter
      end
    end
  end
end

module Jekyll
  module Tags
    class HighlightBlock < Liquid::Block
      include Liquid::StandardFilters

      OPTIONS_REGEX = %r!(?:\w="[^"]*"|\w=\w|\w)+!
      SYNTAX = %r!^([a-zA-Z0-9_+-]+)\s*(\S.*)?$!

      def initialize(tag_name, markup, tokens)
        super
        if markup.strip =~ SYNTAX
          @lang = Regexp.last_match(1).downcase
          @highlight_options = parse_options(Regexp.last_match(2) || "")
        else
          raise SyntaxError, "Syntax Error in tag 'highlight' while parsing: #{markup.strip}. Valid syntax: highlight <lang> [linenos] [linedivs]"
        end
      end

      def render(context)
        code = super.to_s.strip
        is_safe = !!context.registers[:site].safe

        output = case context.registers[:site].highlighter
                 when "pygments"
                   render_pygments(code, is_safe)
                 when "rouge"
                   render_rouge(code)
                 else
                   render_codehighlighter(code)
                 end

        rendered_output = add_code_tag(output)
        "#{prefix_html}#{rendered_output}#{suffix_html}"
      end

      def sanitized_opts(opts, is_safe)
        if is_safe
          opts.slice(:startinline, :hl_lines, :linenos, :linedivs, :encoding, :cssclass).compact
        else
          opts
        end
      end

      private

      def parse_options(input)
        options = {}
        return options if input.empty?

        input.scan(OPTIONS_REGEX) do |opt|
          key, value = opt.split("=", 2)
          # Si la valeur est une chaîne entre guillemets
          if value && value.include?('"')
            value.delete!('"')
            value = value.split
          end
          options[key.to_sym] = value || true
        end

        options[:linenos] = "inline" if options[:linenos] == true
        options
      end

      def render_rouge(code)
        formatter = ::Rouge::Formatters::HTMLLegacy.new(
          line_numbers: @highlight_options[:linenos],
          linewise: @highlight_options[:linedivs],
          wrap: false,
          css_class: "highlight",
          gutter_class: "gutter",
          code_class: "code"
        )
        lexer = ::Rouge::Lexer.find_fancy(@lang, code)
        unless lexer
          lexer = Rouge::Lexers::PlainText
          puts "Warning: Language '#{@lang}' not found. Defaulting to plain text."
        end
        formatter.format(lexer.lex(code))
      end

      def prefix_html
        <<~HTML
          <div class="code-container">
              <div class="code-window">
                  <div class="window-header">
                      <div class="window-controls">
                          <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14">
                              <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
                                  <circle cx="6" cy="6" r="6" fill="#EC6A5E" stroke="#EC6A5E" stroke-width=".5" />
                                  <circle cx="26" cy="6" r="6" fill="#F4BF4F" stroke="#F4BF4F" stroke-width=".5" />
                                  <circle cx="46" cy="6" r="6" fill="#61C554" stroke="#61C554" stroke-width=".5" />
                              </g>
                          </svg>
                      </div>
                      <div class="window-copy">
                          <svg xmlns="http://www.w3.org/2000/svg" class="window-copy-icon" height="24" width="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path class="with-check" stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                            <path class="without-check" stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                          </svg>
                      </div>
                  </div>
        HTML
      end

      def suffix_html
        <<~HTML
                  <div class="code-label">
                      #{@lang.capitalize}
                  </div>
              </div>
          </div>
        HTML
      end
    end
  end
end

Liquid::Template.register_tag("highlight", Jekyll::Tags::HighlightBlock)