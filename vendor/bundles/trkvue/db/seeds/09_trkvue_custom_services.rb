#encoding: utf-8 

event_simulation = DiyService.create!(:name => 'event', :description => 'Event Service', :script_type => 'DSL', :active_flag => true, :atomic_flag => true)
event_simulation.service_logic = <<-END
require 'open3'

fid = params[:fid]
etm = params[:etm]
fvr = params[:fvr]
kct = params[:kct]
vlc = params[:vlc]
lat = params[:lat]
lng = params[:lng]
svr = params[:svr]
typ = params[:typ]
gx  = params[:gx]
gy  = params[:gy]
gz  = params[:gz]
url = params[:url]

command = "curl -k -d 'etm=\#{etm}&fid=\#{fid}&fvr=\#{fvr}&kct=\#{kct}&svr=\#{svr}&typ=\#{typ}&vlc=\#{vlc}&lat=\#{lat}&lng=\#{lng}&gx=\#{gx}&gy=\#{gy}&gz=\#{gz}' \#{url}"
result, success, output, std_str, err_str = nil, false, "", "", ""      
begin
    Open3.popen3(command) do |stdin, stdout, stderr, wait_thr|
        stdout.each { |line| std_str << line }
        stderr.each { |line| err_str << line }
    end
        
    puts err_str
    result = JSON.parse(std_str)
rescue ::Exception => e
    result = { "success" => false, "interval" => 5, "msg" => e.to_s }
end

result
END

event_simulation.save!

tracking_simulation = DiyService.create!(:name => 'tracking', :description => 'Tracking Service', :script_type => 'DSL', :active_flag => true, :atomic_flag => true)
tracking_simulation.service_logic = <<-END
require 'open3'

fid = params[:fid]
ttm = params[:ttm]
fvr = params[:fvr]
kct = params[:kct]
vlc = params[:vlc].to_i + rand(-20..40)
lat = params[:lat]
lng = params[:lng]
dst = params[:dst]
gx  = params[:gx]
gy  = params[:gy]
gz  = params[:gz]
url = params[:url]

command = "curl -k -v --form 'fid=\#{fid}' --form 'ttm=\#{ttm}' --form 'fvr=\#{fvr}' --form 'kct=\#{kct}' --form 'vlc=\#{vlc}' --form 'dst=\#{dst}' --form 'lat=\#{lat}' --form 'lng=\#{lng}' --form 'gx=\#{gx}' --form 'gy=\#{gy}' --form 'gz=\#{gz}' \#{url}"
result, success, output, std_str, err_str = nil, false, "", "", ""
      
begin
    Open3.popen3(command) do |stdin, stdout, stderr, wait_thr|
        stdout.each { |line| std_str << line }
        stderr.each { |line| err_str << line }
    end
        
    #puts std_str
    puts err_str
    result = JSON.parse(std_str)
rescue ::Exception => e
    result = { "success" => false, "interval" => 5, "msg" => e.to_s }
end

result
END

tracking_simulation.save!