#encoding: utf-8 

DiySelection.setup :Bundle, {:script_type => 'DSL'} do
  @service_logic = <<-EOS
  Hatio::Bundle.ordered_bundle_list.map do |bundle|
    {
      id: bundle.name,
      name: bundle.name,
      description: "\#{bundle.name} V\#{bundle.version}"
    }
  end
  EOS
  
  out_params :id
  out_params :name
  out_params :description
end


