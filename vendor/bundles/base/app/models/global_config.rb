class GlobalConfig
  
  attr_accessor :name, :value
  
  cattr_accessor :hatio_configs

  @cached_configs = {}
  @@hatio_configs = YAML::load(File.open("#{Rails.root}/config/global_config.yml"))
  Dir["#{Rails.root}/vendor/bundles/*/config/global_config.yml"].each do |yml|
    @@hatio_configs.merge! YAML::load_file(yml)
  end
  
  @@hatio_configs.each do |name, params|
    src = <<-END_SRC
    def self.#{name}
      self[:#{name}]
    end  
    END_SRC
    class_eval src, __FILE__, __LINE__
  end
  
  public
  
  # Returns the value of the setting named name
  def self.[](name)
    name = name.to_s
    v = @cached_configs[name]
    return v if v
    
    if(@@hatio_configs.has_key?(name))
      (@cached_configs[name] = @@hatio_configs[name])
      return @cached_configs[name]
    end
  end
    
end
