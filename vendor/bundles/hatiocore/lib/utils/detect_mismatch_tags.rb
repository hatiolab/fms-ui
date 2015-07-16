require 'find'
require 'active_record'

def countl(target, to)
  i = 0
  a = ""
  target.each_byte do |x|
    a << x
    a = "" unless to.index(a) == 0
    i = i + 1 if a == to
    a = "" if a == to
  end
  i
end

def find_mismatches dir, tags='{,['
  tags.split(',').each { |x| find_mismatch dir, x }
end

def find_mismatch dir, tag
  dir = File.join(Rails.root, dir)
  excludes = ["theme", "js", "touch"]
  
  openTag = tag
  closeTag = getCloseTag(tag)
  
  Find.find(dir) do |path|
    if FileTest.directory?(path)
      if excludes.include?(File.basename(path))
        Find.prune       # Don't look any further into this directory.
      else
        next
      end
    else
      next unless path.end_with?('.js')
      open = 0
      close = 0
      File.open(path).each do |line|
        open += countl(line, openTag)
        close += countl(line, closeTag)
      end
      puts "#{openTag} - #{path} : #{open} - #{close} = #{open - close}" unless open - close == 0
    end
  end
end

def getCloseTag tag
  if(tag == '{')
    return '}'
  elsif(tag == '[')
    return ']'
  elsif(tag == '(')
    return ')'
  else
    raise "Not support tag #{tag}!"
  end
end
