class TerminologiesController < ResourceMultiUpdateController

public 
	def upsert
		obj = params['terminology']
		debug_print obj
		conds = ["description = ? and locale = ? and category = ? and name = ?", obj['description'], obj['locale'], obj['category'], obj['name']]
		@terminology = Terminology.where(conds).first

		unless(@terminology)
			@terminology = Terminology.create(name: obj['name'], description: obj['description'], locale: obj['locale'], category: obj['category'], display: obj['display'])
		else
			@terminology.display = obj['display']
			@terminology.save!
		end
	end

  def locale_resource
    @terminologies = Terminology.to_resource(params['locale'])
    
    respond_to do |format|
      format.json { render json: @terminologies, status: :ok }
    end
  end

private
  def resource_params
    [ params.require(:terminology).permit(:name, :description, :locale, :category, :display, :display_short) ]
  end
end
