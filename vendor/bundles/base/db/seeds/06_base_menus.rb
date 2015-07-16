#encoding: utf-8 

Menu.setup :System, {:rank => 9000} do
  submenu :SystemManagement, {:rank => 9100, :menu_type => 'SEPARATOR'}
  submenu :Domain, {:rank => 9110, :template => 'Base.view.domain.DomainItem'}
  submenu :Calendar, {:rank => 9120, :template => 'Base.view.calendar.Calendar'}
  submenu :User, {:rank => 9130, :template => 'Base.view.user.User'}
  submenu :Role, {:rank => 9140, :template => 'Base.view.role.Role'}
  submenu :CommonCode, {:rank => 9150, :template => 'Base.view.common_code.CommonCode'}
  submenu :ExpansionCode, {:rank => 9160, :template => 'Base.view.expansion_code.ExpansionCode'}
  submenu :CodeExpansion, {:rank => 9170, :template => 'Base.view.code_expansion.CodeExpansion'}
  submenu :Menu, {:rank => 9180, :template => 'Base.view.menu.Menu'}
  submenu :Entity, {:rank => 9190, :template => 'Base.view.entity.Entity'}
  submenu :RemTrace, {:rank => 9200, :template => 'Base.view.rem_trace.RemTrace'}
  submenu :ErrorLog, {:rank => 9210, :template => 'Base.view.error_log.ErrorLog'}
  submenu :Customizable, {:rank => 9220, :menu_type => 'SEPARATOR'}
  submenu :DiyService, {:rank => 9230, :template => 'Base.view.diy_service.DiyService'}
  submenu :DiySelection, {:rank => 9240, :template => 'Base.view.diy_selection.DiySelection'}
  submenu :DiyReport, {:rank => 9250, :template => 'Base.view.diy_report.DiyReport'}
  submenu :Attachment, {:rank => 9260, :template => 'Base.view.attachment.Attachment'}
  submenu :Property, {:rank => 9270, :template => 'Base.view.property.Property'}
  submenu :Terminology, {:rank => 9280, :template => 'Base.view.terminology.Terminology'}
  submenu :Variable, {:rank => 9290, :template => 'Base.view.variable.Variable'}
  submenu :Infographic, {:rank => 9300, :template => 'Base.view.infographic.Infographic'}
  submenu :Contact, {:rank => 9310, :template => 'Base.view.contact.Contact'}
  submenu :Report, {:rank => 9320, :template => 'Base.view.report.Report'}
  submenu :Chit, {:rank => 9330, :template => 'Base.view.chit.Chit'}
end
