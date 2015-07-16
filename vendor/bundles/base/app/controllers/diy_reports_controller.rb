require 'open3'

class DiyReportsController < ResourceMultiUpdateController
  
  public
  
    #
    # post domains/:domain_id/entities/:id/generate_views.json
    #
    def generate_views
      commandStr = "rails g hatio_resource_view #{params[:resource_name]} #{params[:runtime_option]} --domain_id=#{params[:domain_id]} --bundle=#{params[:bundle]} --view_type=report --diy_selection_id=#{params[:diy_selection_id]} --parent_menu=#{params[:parent_menu]}"
      debug_print commandStr
      puts commandStr
      run_command(commandStr)
    end
  
  protected
  
    def run_command(commandStr)
      begin
        output, stdStr, errStr = "", "", ""
        Open3.popen3(commandStr) do |stdin, stdout, stderr, wait_thr|
          stdout.each { |line| stdStr << line }
          stderr.each { |line| errStr << line }
        end
      
        resultArr = stdStr.split("\n")
        resultStr = resultArr.pop
        successFlag = (resultStr == 'Success') ? true : false
        output = successFlag ? stdStr : ((!errStr || errStr.empty?) ? stdStr : errStr)
        
        respond_to do |format|
          format.json { render :json => {:success => true, :result => successFlag, :msg => output} }
        end
      rescue ::Exception => e
        respond_to do |format|
          format.json { render :json => {:success => false, :msg => e.to_s}, :status => 'Invalid command' }
        end
      end
    end
  
  private
  
    def resource_params
        [ params.require(:diy_report).permit(:name,:description,:diy_selection_id) ]
    end  
  
end
