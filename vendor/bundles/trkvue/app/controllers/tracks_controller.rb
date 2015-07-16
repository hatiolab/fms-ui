class TracksController < MongoController
  
  public
  
  def index
    respond_to do |format|
      format.xml { render :xml => searching(Track, params) } 
      format.json { render :json => searching(Track, params) }
    end
  end
  
  def show
    @track = Track.find(params[:id])
  end
  
  def update_multiple
    respond_to do |format|
      format.xml { render :xml => update_multiple_data(Track, params) } 
      format.json { render :json => update_multiple_data(Track, params) }
    end
  end
  
  private
  
  def resource_params
    [ params.require(:track).permit(:fid,:fvr,:tid,:bid,:did,:stm,:ttm,:ctm,:kct,:vlc,:a_vlc,:dst,:lat,:lng,:p_lat,:p_lng,:gx,:gy,:gz,:f_img,:r_img) ]
  end
  
end
