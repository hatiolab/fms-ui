class Role < ActiveRecord::Base
  
  include Multitenant
    
  stampable
  strip_cols [:name]
  removing_trackable

  has_and_belongs_to_many :users, :join_table => "users_roles"
  has_many :permissions
  
  validates_presence_of :name, :strict => true
  validates :name, length: { maximum: 60 }, :strict => true
  validates :description, length: { maximum: 255 }, :strict => true
  validates_uniqueness_of :name, :strict => true, :scope => :domain_id
  
  # getter for resources
  def resources
    res = Array.new
    self.roles_resources.each do |resource|
      res << resource.resource
    end
    return res
  end
  
  # setter for resources
  def resources=(resource)
    self.roles_resources.create(:resource => resource)
  end
  
  def allows?(permission, resource)
    return true if self.name == 'Admin'
    d = self.permissions.find_by_resource_type_and_resource_id_and_method_name(resource.class.to_s, resource.id, permission)
    return !d.nil?
  end
  
  def get_actions(controller_name, method)
    action_list = {}
    routes = ActionController::Routing::Routes.routes.inject({}){|s, r|
    action_list.merge!({r.requirements[:action] => r.conditions[:method]})
    s.merge({r.requirements[:controller] => action_list})
    }
    
    action_list = routes[controller_name]
    result_action = []
    action_list.each do |key, value|
      if value.to_s == method
        result_action << key
      end  
    end
    result_action
  end
  
  # "permissions"=>{
  #   "Menu"=>{
  #     "6b851c74-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}, 
  #     "6b9f1f48-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}, 
  #     "6ba07a3c-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}, 
  #     "6ba186ca-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}, 
  #     "6ba2ba40-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}, 
  #     "6ba3f37e-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}, 
  #     "6ba50250-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}, 
  #     "6ba623ce-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}, 
  #     "6ba75384-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}, 
  #     "6ba87692-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}, 
  #     "6ba9c5f6-63b4-11e2-b9b4-002608fffe0f"=>{"show"=>true, "create"=>true, "update"=>true, "delete"=>true}
  #   }
  # }
  # 체크된 퍼미션 리스트만 넘어온다.
  def permissions=(attributes)
    attributes.each do |resource_type, record_attributes|
      # 이전 퍼미션 데이터를 모두 삭제
      Permission.destroy_all(:resource_type => resource_type, :role_id => self.id)
      record_attributes.each do |resource_id, action_attributes|
        action_attributes.each do |action_name, value|
          Permission.create!({:resource_type => resource_type,
                            :resource_id => resource_id,
                            :action_name => action_name, 
                            :role_id => self.id}) if (value == true)
        end
      end
    end
  end
  
  def roles_users=(roleUserList)
    transaction do
      delete_list, create_list = [], []
      roleUserList.each do |data|
        cud_flag = data.delete('_cud_flag_')
        delete_list << data if(cud_flag == "d")
        create_list << data if(cud_flag == "c")
      end
      
      delete_list.each { |user| UsersRoles.delete_all({:role_id => self.id, :user_id => user['id']}) } unless(delete_list.empty?)
      create_list.each do |user| 
        existCnt = UsersRoles.where("role_id = ? and user_id = ?", self.id, user['id']).count
        UsersRoles.create!({:role_id => self.id, :user_id => user['id']}) if(existCnt == 0)
      end unless(create_list.empty?)
    end
  end
  
end
