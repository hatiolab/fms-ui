module Transactionable
  extend ActiveSupport::Concern

  #
  # controller method 수행
  #
  def transaction_by_controller
    resource_class.transaction do
      return self.send(params[:tran_name])
    end
  end
    
  #
  # model method 수행
  #
  def transaction_by_model
    if('instance' == params[:logic_type])
      resource = resource_class.find(params[:instance_id])
      return resource.send(params[:tran_name], params)
    else
      return resource_class.send(params[:tran_name], params);
    end    
  end
  
  #
  # entity logic 수행
  #
  def transaction_by_logic
    resource_class.transaction do
      if('instance' == params[:logic_type])
        resource = resource_class.find(params[:instance_id])
        return resource.run_instance_logic(params[:tran_name], params)
      else
        return resource_class.run_class_logic(params[:tran_name], params);
      end
    end
  end
  
end