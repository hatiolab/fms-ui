class DomainResourcesController < InheritedResources::Base
  
  include Basic
  include Importable
  include Exportable
  include Transactionable

  respond_to :xml, :json, :xls

  before_filter :authenticate_user!, :set_current_user
  
  around_filter :scope_current_domain

  public
  
  def index
    conditions, include_arr, order_str, limit, offset = search_filter resource_class
    @total_count = collection.where(conditions).count
    @collection = collection.includes(include_arr).where(conditions).order(order_str).limit(limit).offset(offset)
  end
  
  def show_by_name
    name = params[:name]
    set_resource_ivar(resource_class.find_by(name: name))

    respond_with(resource) do |format|
      format.xml  { render 'show' }
      format.json { render 'show' }
    end
  end
  
  def show
    show!
  end
  
  def create
    create!
  end
  
  def update
    update!
  end
  
  def destroy
    destroy!
  end
  
  def import
    import_excel(current_domain, resource_class, params[:file])
    
    respond_to do |format|
      format.xml  { render :xml => { :success => true, :msg => :success } }
      format.json { render :json => { :success => true, :msg => :success } }
    end
  end
  
  def export
    params[:limit], params[:start], params[:page] = GlobalConfig.export_limit_size, 0, 1
    @collection = export_excel(resource_class, collection, params)
    
    respond_to do |format|
      format.json { render :json => @collection }
      format.xml  { render :xml => @collection }
      format.xls
      format.xlsx {
        render_xlsx(resource_class.name, @collection)
      }
    end
  end
  
  #
  # 클라이언트 화면에서 보내주는대로 엑셀 출력 
  #
  def export_screen
    @collection = build_screen_export_data(JSON.parse(params[:xlsGridInfo]))
    
    respond_to do |format|
      format.json { render :json => @collection }
      format.xml { render :xml => @collection }
      format.xls
      format.xlsx {
        render_xlsx(resource_class.name, @collection)
      }
    end    
  end
  
  #
  # POST resources/transaction
  #
  def transaction
    call_type, result = params[:call_type], nil
    
    # controller 
    if('controller' == call_type)
      result = transaction_by_controller
    # model
    elsif('model' == call_type)
      result = transaction_by_model
    # entity logic
    else
      result = transaction_by_logic
    end
    
    respond_to do |format|
      format.xml  { render :xml => { :success => true, :msg => :success, :result => result } }
      format.json { render :json => { :success => true, :msg => :success, :result => result } }
    end
  end
  
end