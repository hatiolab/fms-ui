class DictionariesController < ResourceMultiUpdateController

public 
	def upsert
		obj = params['dictionary']
		conds = ["locale = ? and category = ? and name = ?", obj['locale'], obj['category'], obj['name']]
		@dictionary = Dictionary.where(conds).first

		unless(@dictionary)
			@dictionary = Dictionary.create(name: obj['name'], locale: obj['locale'], category: obj['category'], display: obj['display'])
		else
			@dictionary.display = obj['display']
			@dictionary.save!
		end
	end

private
  def resource_params
    [ params.require(:dictionary).permit(:name,:description,:locale,:category,:display) ]
  end
end
