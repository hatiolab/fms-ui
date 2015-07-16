#encoding: utf-8 

Dir[File.join(File.dirname(__FILE__), 'codes', '*.rb')].sort.each do |seed|
  puts "  Code : #{seed}"
  load seed
end

CommonCode.setup :LOCALE, {:description => 'Locale code'} do
  code 'en-US' => 'English'
  code 'ko-KR' => '한글'
  code 'zh-CN' => '中文'
  code 'th-TH' => 'ไทย'
end

CommonCode.setup :TERMS_CATEGORY, {:description => 'Terminology categories'} do
  code 'button' => 'Button'
  code 'label' => 'Label'
  code 'text' => 'Text'
  code 'error' => 'Error'
  code 'format' => 'Format'
  code 'menu' => 'Menu'
  code 'setting' => 'Setting'
  code 'title' => 'Title'
  code 'tooltip' => 'Tooltip'
end

CommonCode.setup :MENU_TYPE, {:description => 'Menu type'} do
  code :MENU => 'Menu'
  code :SCREEN => 'Screen'
  code :TEMPLATE => 'Template'
  code :SEPARATOR => 'SEPARATOR'
end

CommonCode.setup :MENU_CATEGORY, {:description => 'STANDARD OR TERMINAL'} do
  code :STANDARD => 'STANDARD'
  code :TERMINAL => 'TERMINAL'
end

CommonCode.setup :SCRIPT_TYPE, {:description => 'Script type'} do
  code 'JSON' => 'Json data'
  code 'SQL' => 'Database Query'
  code 'DSL' => 'Business Logic'
  code 'DSL-SQL' => 'Query Made by Logic'
end

CommonCode.setup :ENTITY_REF_TYPE, {:description => 'Entity Reference Type'} do
  code :CommonCode => 'CommonCode'
  code :Entity => 'Entity'
end

CommonCode.setup :ENTITY_FIELD_TYPE, {:description => 'Entity Field Type'} do
  code :string => 'string'
  code :text => 'text'
  code :integer => 'integer'
  code :float => 'float'
  code :decimal => 'decimal'
  code :date => 'date'
  code :datetime => 'datetime'
  code :timestamp => 'timestamp'
  code :time => 'time'
  code :boolean => 'boolean'
  code :binary => 'binary'
end

CommonCode.setup :VARIABLE_CATEGORY, {:description => 'Variable Category'} do
  code :SYSTEM => 'SYSTEM'
  code :SESSION => 'SESSION'
  code :ITEM => 'ITEM'
end

CommonCode.setup :INFOGRAPHIC_TYPE, {:description => 'Lable Type'} do
  code :type1 => 'type1'
  code :type2 => 'type2'
end

CommonCode.setup :PRINTER_TYPE, {:description => 'Printer Type'} do
  code :zebra => 'zebra'
  code :datamax => 'datamax'
  code :printronix => 'printronix'
end