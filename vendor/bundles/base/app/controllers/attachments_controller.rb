class AttachmentsController < ResourceMultiUpdateController

  def destroy
    @attachment = Attachment.find(params[:id])
    @attachment.destroy

    # TODO 파일 삭제후에 디렉토리를 지워야한다. (Daily CronJob으로 아래 커맨드를 실행한다.)
    #  cd /your/uploads/dir && find . -type d -empty -exec rmdir {} \;
    #
  end

  def download
    @attachment = Attachment.find(params[:id])

    send_file(@attachment.path.path,
          :filename => @attachment.name,
          # :type => @attachment.path.content_type,
          :type => @attachment.mimetype ? @attachment.mimetype : '',
          :disposition => 'attachment',
          :url_based_filename => true)
  end

private
  def resource_params
    [ params.require(:attachment).permit(:path, :name, :on_type, :on_id, :tag) ]
  end
end
