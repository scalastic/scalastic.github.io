module DateFilter
  MONTHS = %w(Janvier Février Mars Avril Mai Juin Juillet Août Septembre Octobre Novembre Décembre)

  def french_date(input)
  	day = input.strftime("%d")
    month = MONTHS[input.strftime("%m").to_i - 1]
    year = input.strftime("%Y")
    day + " " + month + " " + year
  end
end

Liquid::Template.register_filter(DateFilter)