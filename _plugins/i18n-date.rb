module Jekyll

	module DateFilter

	  FR_MONTHS = %w(Janvier Février Mars Avril Mai Juin Juillet Août Septembre Octobre Novembre Décembre)
	  EN_MONTHS = %w(January February March April May June July August September October November December)


	  def i18n_date(input, arg1)
	  	
  		day = input.strftime("%d")
    	year = input.strftime("%Y")
	    	
	    if (arg1 == "fr")
	    	month = FR_MONTHS[input.strftime("%m").to_i - 1]
	    	return day + " " + month + " " + year
	    else
	    	month = EN_MONTHS[input.strftime("%m").to_i - 1]
	    	return month + " " + day + ", " + year
	    end
	  end

	end

end

Liquid::Template.register_filter(Jekyll::DateFilter)