#encoding: utf-8

domain_name = (ENV['domain'] || 'System').capitalize;
subdomain = domain_name.downcase

Domain.current_domain = Domain.where(name: domain_name).first_or_create(
  system_flag: true,
  timezone: 'Beijing',
  subdomain: subdomain,
  brand_name: 'Things System',
  brand_image: File.open(Base::Engine.root.join('app', 'assets', 'images', 'site_brand.png')),
  content_image: File.open(Base::Engine.root.join('app', 'assets', 'images', 'caffeine_content.jpg'))
)

['site_brand.png', 'caffeine_content.jpg'].each do |filename|
  Attachment.create!(
    path: File.open(Base::Engine.root.join('app', 'assets', 'images', filename)),
    on: Domain.current_domain,
    tag: 'brand'
  )
end
