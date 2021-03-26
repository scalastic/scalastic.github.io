require 'html-proofer'

module Jekyll
    module HtmlProofer
        # run after any other hook
        HIGHEST_PRIORITY = Jekyll::Hooks::PRIORITY_MAP[:high] + 1000

        def self.keys_to_symbols(hash)
            Hash[hash.map{|(k,v)| [k.to_sym,v]}]
        end

        def self.parse_regexp_values(strings)
            strings.map do |v|
                if v.start_with?('/') && v.end_with?('/') then
                    Regexp.new(v[1..-2])
                else
                    v
                end
            end
        end

        Jekyll::Hooks.register(:site, :post_write, priority: HIGHEST_PRIORITY) do |site|
            config = keys_to_symbols(site.config['html_proofer'] || {})

            # Convert Regexp values
            [ :alt_ignore, :file_ignore, :url_ignore ].each do |k|
                config[k] = parse_regexp_values(config[k] || [])
            end
            
            begin
                HTMLProofer.check_directory(site.dest, config).run
            rescue Exception => e
                # throwing an exception stops jekyll
                # => catch exceptions while watching
                # => rethrow otherwiese to make jekyll report non-zero exit status
                if site.config['watch']
                    STDERR.puts e
                else
                    raise e
                end
            end
        end
    end
end