module ApplicationHelper
  def var_subs(content, on)
    subs = content
    vmap = {}
    content.scan(/\$\{[\w ]*\}/).each do |v|
      if vmap[v].nil?
        var = Variable.find_by_name(v[2..-2])
        vmap[v] = var.nil? ? v : var.execute(on)
        subs.gsub!(v, vmap[v].nil? ? '' : vmap[v].to_s)
      end
    end
    
    return subs
  end
end
