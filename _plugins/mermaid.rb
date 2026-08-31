# Rend un diagramme Mermaid en SVG statique, inline dans la page.
#
#   {% mermaid nom-du-schema caption="Légende facultative" %}
#   flowchart TB
#       A --> B
#   {% endmermaid %}
#
# Le SVG est produit par mmdc (@mermaid-js/mermaid-cli) puis versionné dans
# assets/img/diagrams/. Le rendu n'a lieu que lorsque la source change : le SVG
# porte l'empreinte de la source qui l'a produit, et un build qui retrouve la
# même empreinte réutilise le fichier tel quel. Une machine sans mmdc, comme le
# conteneur d'intégration, se contente donc de relire les SVG versionnés.
#
# Les couleurs du thème Mermaid sont rendues avec des teintes sentinelles, puis
# remplacées ici par des variables CSS. Le SVG étant inline, il hérite des
# variables de :root et suit la bascule clair/sombre du site sans re-rendu.

require 'cgi'
require 'digest'
require 'fileutils'
require 'json'
require 'open3'
require 'tmpdir'

module Jekyll
  module Mermaid
    OUTPUT_DIR = 'assets/img/diagrams'.freeze

    # Toute modification du thème ou des options de rendu doit faire évoluer ce
    # numéro : il entre dans l'empreinte et invalide donc les SVG existants.
    RENDER_VERSION = 2

    # Teintes improbables injectées comme couleurs de thème, puis reconnues dans
    # le SVG produit pour être converties en variables CSS. Mermaid n'émet aucune
    # couleur en attribut inline : tout passe par le bloc <style> du SVG.
    SENTINELS = {
      '#f0f1f2' => '--diagram-node-bg',
      '#f0f1f3' => '--diagram-text',
      '#f0f1f4' => '--diagram-node-border',
      '#f0f1f5' => '--diagram-line',
      '#f0f1f6' => '--diagram-alt-bg',
      '#f0f1f7' => '--diagram-accent-bg',
      '#f0f1f8' => '--diagram-bg',
      '#f0f1f9' => '--diagram-cluster-bg',
      '#f0f1fa' => '--diagram-cluster-border',
      '#f0f1fb' => '--diagram-label-bg'
    }.freeze

    # Valeurs de repli inscrites dans le var() : ce sont les couleurs du thème
    # clair, pour qu'un SVG ouvert hors du site reste lisible.
    FALLBACKS = {
      '--diagram-node-bg' => '#f4f4f4',
      '--diagram-text' => '#515151',
      '--diagram-node-border' => '#b4b4b4',
      '--diagram-line' => '#8c8c8c',
      '--diagram-alt-bg' => '#ececec',
      '--diagram-accent-bg' => '#e4e4e4',
      '--diagram-bg' => 'transparent',
      '--diagram-cluster-bg' => '#efefef',
      '--diagram-cluster-border' => '#c9c9c9',
      '--diagram-label-bg' => '#fbfbfb'
    }.freeze

    THEME = {
      'theme' => 'base',
      # Sans cette option au niveau racine, Mermaid enferme chaque libellé dans
      # un foreignObject dont la largeur est figée à la mesure du rendu. La
      # police du site étant absente du navigateur de mmdc, le texte affiché est
      # légèrement plus large que cette mesure et sa dernière lettre est rognée.
      # Les libellés en <text> n'ont pas de largeur imposée et tolèrent l'écart.
      'htmlLabels' => false,
      'themeVariables' => {
        'fontFamily' => 'Mulish, sans-serif',
        'fontSize' => '15px',
        'background' => '#f0f1f8',
        'primaryColor' => '#f0f1f2',
        'primaryTextColor' => '#f0f1f3',
        'primaryBorderColor' => '#f0f1f4',
        'lineColor' => '#f0f1f5',
        'secondaryColor' => '#f0f1f6',
        'tertiaryColor' => '#f0f1f7',
        'mainBkg' => '#f0f1f2',
        'nodeBorder' => '#f0f1f4',
        'textColor' => '#f0f1f3',
        'titleColor' => '#f0f1f3',
        'clusterBkg' => '#f0f1f9',
        'clusterBorder' => '#f0f1fa',
        'edgeLabelBackground' => '#f0f1fb',
        'nodeTextColor' => '#f0f1f3'
      },
      'flowchart' => { 'htmlLabels' => false, 'curve' => 'basis', 'padding' => 14 },
      'sequence' => { 'useMaxWidth' => true },
      'themeCSS' => '.node rect, .node polygon, .cluster rect { rx: 4; ry: 4; }'
    }.freeze

    # Renvoie le chemin de mmdc, ou nil s'il est introuvable. La recherche
    # privilégie l'installation locale du dépôt pour que la version de Mermaid
    # soit celle épinglée dans package.json.
    def self.mmdc_path(site)
      @mmdc_path ||= {}
      return @mmdc_path[site.source] if @mmdc_path.key?(site.source)

      candidates = [site.config.dig('mermaid', 'mmdc'),
                    File.join(site.source, 'node_modules', '.bin', 'mmdc')]
      candidates += ENV.fetch('PATH', '').split(File::PATH_SEPARATOR).map { |dir| File.join(dir, 'mmdc') }
      @mmdc_path[site.source] = candidates.compact.find { |path| File.executable?(path) }
    end

    # Langue de la passe de localisation en cours. Polyglot construit le site une
    # fois par langue, dans des processus concurrents ; un diagramme traduit
    # n'est pas le même diagramme, il a ses propres libellés et sa propre
    # légende. La langue entre donc dans le nom du fichier, ce qui donne à chaque
    # passe sa cible et évite que deux d'entre elles écrivent au même endroit.
    def self.active_lang(site, context)
      lang = site.active_lang if site.respond_to?(:active_lang)
      lang ||= context['page'] && context['page']['lang']
      lang ||= site.config['default_lang']
      (lang || 'fr').to_s
    end

    # Empreinte de tout ce qui influe sur le SVG produit.
    def self.digest_for(source, lang)
      Digest::SHA256.hexdigest([RENDER_VERSION, lang, THEME.to_json, source].join("\x00"))
    end

    def self.stored_digest(svg_path)
      return nil unless File.exist?(svg_path)

      File.foreach(svg_path).first(2).join[/mermaid-source-sha256:\s*([0-9a-f]{64})/, 1]
    end

    # Appelle mmdc et renvoie le SVG produit, ou lève une RuntimeError décrivant
    # l'échec pour que l'appelant puisse dégrader proprement.
    def self.render(site, source, svg_id)
      mmdc = mmdc_path(site)
      raise 'mmdc introuvable' unless mmdc

      Dir.mktmpdir('jekyll-mermaid') do |tmp|
        input = File.join(tmp, 'diagram.mmd')
        output = File.join(tmp, 'diagram.svg')
        config = File.join(tmp, 'config.json')
        puppeteer = File.join(site.source, '_mermaid', 'puppeteer.json')

        File.write(input, source)
        File.write(config, THEME.to_json)

        cmd = [mmdc, '-i', input, '-o', output, '-c', config,
               '-b', 'transparent', '-I', svg_id, '-q']
        cmd += ['-p', puppeteer] if File.exist?(puppeteer)

        _out, err, status = Open3.capture3(*cmd)
        raise "mmdc a échoué (#{status.exitstatus}) : #{err.strip.lines.last(3).join(' ')}" unless status.success?
        raise 'mmdc n\'a produit aucun SVG' unless File.exist?(output)

        File.read(output)
      end
    end

    # Substitue les teintes sentinelles par des variables CSS et retire le
    # prologue XML, inutile et invalide une fois le SVG inline dans du HTML.
    def self.themize(svg)
      svg = svg.sub(/\A\s*<\?xml.*?\?>\s*/m, '').sub(/\A\s*<!DOCTYPE[^>]*>\s*/m, '')

      # Mermaid dérive une variante translucide de la couleur de fond des
      # étiquettes d'arêtes ; elle se reconnaît à sa composante alpha.
      svg = svg.gsub(/rgba\(\s*240,\s*241,\s*251,\s*[\d.]+\s*\)/,
                     "var(--diagram-label-bg, #{FALLBACKS['--diagram-label-bg']})")

      SENTINELS.each do |hex, var|
        svg = svg.gsub(/#{Regexp.escape(hex)}\b/i, "var(#{var}, #{FALLBACKS[var]})")
      end

      svg.strip
    end

    class Block < Liquid::Block
      CAPTION = /caption\s*=\s*"([^"]*)"/.freeze

      def initialize(tag_name, markup, tokens)
        super
        # La légende est injectée en HTML et échappe donc à la conversion
        # typographique de Kramdown, qui s'applique au reste de l'article.
        # Sans cette substitution, elle afficherait une apostrophe droite au
        # milieu d'un texte qui n'en comporte aucune.
        @caption = markup[CAPTION, 1]&.tr("'", '’')
        @name = markup.gsub(CAPTION, '').strip[/\A[\w-]+/]
      end

      def render(context)
        site = context.registers[:site]
        source = super.strip
        return '' if source.empty?

        lang = Mermaid.active_lang(site, context)
        digest = Mermaid.digest_for(source, lang)
        slug = "#{@name || digest[0, 10]}.#{lang}"
        svg_id = "diagram-#{slug.tr('.', '-')}"
        rel_path = File.join(Mermaid::OUTPUT_DIR, "#{slug}.svg")
        abs_path = File.join(site.source, rel_path)

        svg = cached_svg(abs_path, digest) || build_svg(site, source, svg_id, abs_path, digest)
        return fallback(source) unless svg

        figure(Mermaid.themize(svg))
      end

      private

      def cached_svg(abs_path, digest)
        return nil unless Mermaid.stored_digest(abs_path) == digest

        File.read(abs_path).sub(/\A<!--.*?-->\n/m, '')
      end

      # Produit le SVG et le dépose sur disque. L'écriture passe par un fichier
      # temporaire renommé : une lecture concurrente voit l'ancien fichier ou le
      # nouveau, jamais un fichier à moitié écrit.
      def build_svg(site, source, svg_id, abs_path, digest)
        svg = Mermaid.render(site, source, svg_id)
        FileUtils.mkdir_p(File.dirname(abs_path))
        tmp = "#{abs_path}.#{Process.pid}.tmp"
        File.write(tmp, "<!-- mermaid-source-sha256: #{digest} -->\n#{svg}")
        File.rename(tmp, abs_path)
        Jekyll.logger.info 'Mermaid:', "rendu #{File.basename(abs_path)}"
        svg
      rescue StandardError => e
        Jekyll.logger.warn 'Mermaid:', "#{File.basename(abs_path)} non rendu (#{e.message})"
        nil
      end

      # Sans SVG disponible ni moyen d'en produire un, la source reste affichée
      # plutôt que de laisser un trou dans l'article.
      def fallback(source)
        "<pre class=\"diagram-fallback\"><code>#{CGI.escapeHTML(source)}</code></pre>"
      end

      def figure(svg)
        svg = svg.sub(/<svg\b/, "<svg role=\"img\" aria-label=\"#{CGI.escapeHTML(@caption)}\"") if @caption
        caption = @caption ? "<figcaption>#{CGI.escapeHTML(@caption)}</figcaption>" : ''
        "<figure class=\"diagram\">#{svg}#{caption}</figure>"
      end
    end
  end
end

Liquid::Template.register_tag('mermaid', Jekyll::Mermaid::Block)
