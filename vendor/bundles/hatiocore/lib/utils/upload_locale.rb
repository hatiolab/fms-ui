def upload_locale(upload_bundle = nil)
  require 'v8'

  def traverse_terms terms, category, cxt
    terms.each do |name, value|
      if value.is_a? String
        if name.ends_with?('.short')
          Terminology.where({
            domain_id: Domain.current_domain.id,
            name: name[0..-7],
            locale: cxt['locale'],
            category: category
          }).first_or_create.update({
            display_short: value
          })
        else
          Terminology.where({
            domain_id: Domain.current_domain.id,
            name: name,
            locale: cxt['locale'],
            category: category
          }).first_or_create.update({
            display: value
          })
        end
  
      else
        traverse_terms value, name, cxt
      end
    end
  end  

  V8::Context.new do |cxt|
    
    cxt['T'] = lambda do |this, terms|
      traverse_terms terms, 'global', cxt
    end

    Hatio::Bundle.ordered_bundle_list.each do |bundle|
      bundle_name = bundle.name
      
      next if(upload_bundle && upload_bundle != bundle_name)
  
      spec = Gem::Specification.find_by_name(bundle_name)
      gem_root = spec.gem_dir

      Dir[gem_root + '/app/assets/javascripts/**/locale/??-??.js'].each do |termfile|
        puts "[LOCALE FILE] #{termfile}"
        locale = termfile.split('/').last.split('.').first

        cxt['locale'] = locale

        cxt.load(termfile);
      end
    end
    
    Dir[Rails.root.to_path + '/app/assets/javascripts/**/locale/??-??.js'].each do |termfile|
      puts "[LOCALE FILE] #{termfile}"
      locale = termfile.split('/').last.split('.').first
    
      cxt['locale'] = locale
    
      cxt.load(termfile);
    end

  end
end