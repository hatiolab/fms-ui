# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150828015604) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "attachments", force: :cascade do |t|
    t.integer  "domain_id",                null: false
    t.string   "name",        limit: 64,   null: false
    t.string   "description", limit: 255
    t.string   "mimetype",    limit: 10
    t.integer  "file_size"
    t.string   "path",        limit: 2000
    t.integer  "on_id"
    t.string   "on_type",     limit: 255
    t.string   "tag",         limit: 2000
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "attachments", ["domain_id", "on_type", "on_id", "tag", "name"], name: "ix_attach_0", unique: true, using: :btree

  create_table "batches", force: :cascade do |t|
    t.string  "tid",   limit: 255, null: false
    t.float   "vlc",               null: false
    t.float   "a_vlc",             null: false
    t.float   "dst",               null: false
    t.float   "s_lat",             null: false
    t.float   "s_lng",             null: false
    t.float   "lat",               null: false
    t.float   "lng",               null: false
    t.integer "c_off",             null: false
    t.integer "c_idl",             null: false
    t.integer "c_low",             null: false
    t.integer "c_nml",             null: false
    t.integer "c_hgh",             null: false
    t.integer "c_ovr",             null: false
    t.integer "stm",               null: false
    t.integer "etm",               null: false
    t.integer "utm",               null: false
  end

  add_index "batches", ["id"], name: "ix_batch_0", unique: true, using: :btree

  create_table "calendar_dates", force: :cascade do |t|
    t.integer  "domain_id",                                         null: false
    t.integer  "calendar_id",                                       null: false
    t.string   "description",  limit: 255
    t.date     "sys_date",                                          null: false
    t.integer  "julian_day"
    t.integer  "plan_year"
    t.integer  "plan_quarter"
    t.integer  "plan_month"
    t.integer  "plan_week"
    t.integer  "iso_year"
    t.integer  "start_time"
    t.decimal  "work_hours",               precision: 15, scale: 3
    t.datetime "shift1_start"
    t.datetime "shift1_end"
    t.datetime "shift2_start"
    t.datetime "shift2_end"
    t.datetime "shift3_start"
    t.datetime "shift3_end"
    t.datetime "shift4_start"
    t.datetime "shift4_end"
    t.integer  "week_day"
    t.boolean  "dayoff_flag"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "calendar_dates", ["calendar_id", "plan_year", "plan_month"], name: "ix_calendar_date_1", using: :btree
  add_index "calendar_dates", ["calendar_id", "sys_date"], name: "ix_calendar_date_0", unique: true, using: :btree

  create_table "calendars", force: :cascade do |t|
    t.integer  "domain_id",                 null: false
    t.string   "name",          limit: 64,  null: false
    t.string   "description",   limit: 255
    t.boolean  "day1_off_flag"
    t.boolean  "day2_off_flag"
    t.boolean  "day3_off_flag"
    t.boolean  "day4_off_flag"
    t.boolean  "day5_off_flag"
    t.boolean  "day6_off_flag"
    t.boolean  "day7_off_flag"
    t.float    "day1_workhour"
    t.float    "day2_workhour"
    t.float    "day3_workhour"
    t.float    "day4_workhour"
    t.float    "day5_workhour"
    t.float    "day6_workhour"
    t.float    "day7_workhour"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "calendars", ["domain_id", "name"], name: "ix_calendar_0", unique: true, using: :btree

  create_table "chits", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.integer  "entity_id"
    t.string   "name",        limit: 64,  null: false
    t.string   "description", limit: 255, null: false
    t.text     "template"
    t.text     "logic"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "chits", ["domain_id", "entity_id", "name"], name: "ix_chits_0", unique: true, using: :btree

  create_table "code_expansions", force: :cascade do |t|
    t.integer  "domain_id",                     null: false
    t.integer  "expansion_code_id"
    t.string   "data_1",            limit: 255, null: false
    t.string   "data_2",            limit: 255
    t.string   "data_3",            limit: 255
    t.string   "data_4",            limit: 255
    t.string   "data_5",            limit: 255
    t.string   "data_6",            limit: 255
    t.string   "data_7",            limit: 255
    t.string   "data_8",            limit: 255
    t.string   "data_9",            limit: 255
    t.string   "data_10",           limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "code_expansions", ["domain_id", "expansion_code_id"], name: "ix_code_exp_0", using: :btree

  create_table "common_codes", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",        limit: 64,  null: false
    t.string   "description", limit: 255
    t.integer  "parent_id"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "common_codes", ["domain_id", "parent_id", "name"], name: "ix_common_cd_0", unique: true, using: :btree
  add_index "common_codes", ["domain_id", "parent_id"], name: "ix_common_cd_1", using: :btree

  create_table "contacts", force: :cascade do |t|
    t.integer  "domain_id",                null: false
    t.string   "name",         limit: 255, null: false
    t.string   "description",  limit: 255
    t.string   "family_name",  limit: 255
    t.string   "given_name",   limit: 255
    t.string   "alias",        limit: 255
    t.string   "company",      limit: 255
    t.string   "department",   limit: 255
    t.string   "title",        limit: 255
    t.string   "email",        limit: 255
    t.string   "phone_office", limit: 255
    t.string   "phone_mobile", limit: 255
    t.string   "fax",          limit: 255
    t.string   "address",      limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "contacts", ["domain_id", "name"], name: "ix_contacts_0", using: :btree

  create_table "dictionaries", force: :cascade do |t|
    t.integer  "domain_id",                null: false
    t.string   "name",        limit: 255,  null: false
    t.string   "description", limit: 1000
    t.string   "locale",      limit: 10,   null: false
    t.string   "category",    limit: 20,   null: false
    t.string   "display",     limit: 1000
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "dictionaries", ["domain_id", "locale", "category", "name"], name: "ix_dic_0", unique: true, using: :btree
  add_index "dictionaries", ["domain_id", "locale", "category"], name: "ix_dic_2", using: :btree
  add_index "dictionaries", ["domain_id", "locale"], name: "ix_dic_1", using: :btree

  create_table "diy_reports", force: :cascade do |t|
    t.integer  "domain_id",                    null: false
    t.string   "name",             limit: 64,  null: false
    t.string   "description",      limit: 255
    t.integer  "diy_selection_id"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "diy_reports", ["diy_selection_id"], name: "ix_diy_report_1", using: :btree
  add_index "diy_reports", ["domain_id", "name"], name: "ix_diy_report_0", using: :btree

  create_table "diy_selections", force: :cascade do |t|
    t.integer  "domain_id",                 null: false
    t.string   "name",          limit: 64,  null: false
    t.string   "description",   limit: 255
    t.string   "script_type",   limit: 10
    t.text     "service_logic"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "diy_selections", ["domain_id", "name"], name: "ix_diy_sel_0", unique: true, using: :btree

  create_table "diy_services", force: :cascade do |t|
    t.integer  "domain_id",                 null: false
    t.string   "name",          limit: 64,  null: false
    t.string   "description",   limit: 255
    t.string   "script_type",   limit: 10
    t.boolean  "active_flag"
    t.text     "service_logic"
    t.boolean  "atomic_flag"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "diy_services", ["domain_id", "name"], name: "ix_diy_svc_0", unique: true, using: :btree

  create_table "domains", force: :cascade do |t|
    t.string   "name",          limit: 32,  null: false
    t.string   "description",   limit: 255
    t.string   "timezone",      limit: 255
    t.boolean  "system_flag"
    t.string   "subdomain",     limit: 32
    t.string   "brand_name",    limit: 64
    t.string   "brand_image",   limit: 255
    t.string   "content_image", limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "status",        limit: 20
    t.string   "reason",        limit: 255
    t.string   "approver_id",   limit: 64
    t.datetime "approved_at"
    t.string   "email",         limit: 64
    t.string   "address",       limit: 255
    t.string   "service_grade", limit: 10
    t.float    "lat"
    t.float    "lng"
  end

  create_table "drivers", force: :cascade do |t|
    t.integer  "domain_id",                            null: false
    t.string   "code",       limit: 32,                null: false
    t.string   "name",       limit: 64,                null: false
    t.string   "social_id",  limit: 32
    t.string   "email",      limit: 64
    t.string   "title",      limit: 32
    t.string   "division",   limit: 32
    t.string   "phone_no",   limit: 32
    t.string   "mobile_no",  limit: 32
    t.string   "address",    limit: 255
    t.integer  "point",                  default: 0
    t.string   "img",        limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "work_time",              default: 0.0
    t.float    "distance",               default: 0.0
  end

  add_index "drivers", ["domain_id", "code"], name: "ix_drivers_0", unique: true, using: :btree
  add_index "drivers", ["domain_id", "division"], name: "ix_drivers_3", using: :btree
  add_index "drivers", ["domain_id", "social_id"], name: "ix_drivers_1", using: :btree
  add_index "drivers", ["domain_id", "title"], name: "ix_drivers_2", using: :btree

  create_table "entities", force: :cascade do |t|
    t.integer  "domain_id",                       null: false
    t.string   "name",                limit: 64,  null: false
    t.string   "description",         limit: 255
    t.string   "bundle",              limit: 64,  null: false
    t.integer  "list_infographic_id"
    t.integer  "item_infographic_id"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "entities", ["domain_id", "name"], name: "ix_entity_0", unique: true, using: :btree

  create_table "entity_columns", force: :cascade do |t|
    t.integer "entity_id",                              null: false
    t.string  "name",        limit: 32,                 null: false
    t.string  "description", limit: 255
    t.string  "term",        limit: 128
    t.string  "col_type",    limit: 20,                 null: false
    t.integer "col_size"
    t.boolean "nullable",                default: true
    t.string  "def_val",     limit: 255
    t.integer "uniq_rank",               default: 0
    t.string  "ref_type",    limit: 20
    t.string  "ref_name",    limit: 64
    t.integer "list_rank",               default: 0
    t.integer "disp_rank",               default: 0
  end

  add_index "entity_columns", ["entity_id"], name: "ix_entity_column_0", using: :btree

  create_table "entity_logics", force: :cascade do |t|
    t.integer  "entity_id",               null: false
    t.string   "name",        limit: 64,  null: false
    t.string   "description", limit: 255
    t.string   "level",       limit: 10
    t.text     "logic"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "entity_logics", ["entity_id", "name"], name: "ix_entity_logic_0", using: :btree

  create_table "entity_properties", force: :cascade do |t|
    t.integer "entity_id",                                  null: false
    t.string  "name",           limit: 64,                  null: false
    t.string  "description",    limit: 255
    t.string  "attribute_type", limit: 20,                  null: false
    t.string  "ref_type",       limit: 20
    t.string  "ref_name",       limit: 64
    t.boolean "editable",                   default: false
    t.integer "disp_rank",                  default: 0
  end

  add_index "entity_properties", ["entity_id"], name: "ix_entity_prop_0", using: :btree

  create_table "error_logs", force: :cascade do |t|
    t.integer  "domain_id",                null: false
    t.date     "issue_date",               null: false
    t.string   "status",      limit: 16
    t.string   "error_type",  limit: 128
    t.string   "uri",         limit: 1000
    t.text     "message"
    t.text     "params"
    t.text     "stack_trace"
    t.integer  "creator_id"
    t.datetime "created_at"
  end

  add_index "error_logs", ["domain_id", "created_at"], name: "ix_error_log_1", using: :btree
  add_index "error_logs", ["domain_id", "issue_date"], name: "ix_error_log_0", using: :btree

  create_table "event_group_summaries", force: :cascade do |t|
    t.integer  "domain_id",                             null: false
    t.integer  "fleet_group_id"
    t.string   "sum_day",        limit: 10,             null: false
    t.string   "sum_year",       limit: 4,              null: false
    t.string   "sum_month",      limit: 2,              null: false
    t.string   "sum_week",       limit: 3,              null: false
    t.integer  "impact",                    default: 0
    t.integer  "geofence",                  default: 0
    t.integer  "emergency",                 default: 0
    t.integer  "gsensor",                   default: 0
    t.integer  "overspeed",                 default: 0
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "event_group_summaries", ["domain_id", "fleet_group_id", "sum_day"], name: "ix_event_group_sum_0", unique: true, using: :btree
  add_index "event_group_summaries", ["domain_id", "fleet_group_id"], name: "ix_event_group_sum_1", using: :btree
  add_index "event_group_summaries", ["domain_id", "sum_day"], name: "ix_event_group_sum_2", using: :btree
  add_index "event_group_summaries", ["domain_id", "sum_year", "sum_month"], name: "ix_event_group_sum_3", using: :btree

  create_table "event_summaries", force: :cascade do |t|
    t.integer  "domain_id",                         null: false
    t.integer  "fleet_id"
    t.string   "sum_day",    limit: 10,             null: false
    t.string   "sum_year",   limit: 4,              null: false
    t.string   "sum_month",  limit: 2,              null: false
    t.string   "sum_week",   limit: 3,              null: false
    t.integer  "impact",                default: 0
    t.integer  "geofence",              default: 0
    t.integer  "emergency",             default: 0
    t.integer  "gsensor",               default: 0
    t.integer  "overspeed",             default: 0
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "event_summaries", ["domain_id", "fleet_id", "sum_day"], name: "ix_event_sum_0", unique: true, using: :btree
  add_index "event_summaries", ["domain_id", "fleet_id"], name: "ix_event_sum_1", using: :btree
  add_index "event_summaries", ["domain_id", "sum_day"], name: "ix_event_sum_2", using: :btree
  add_index "event_summaries", ["domain_id", "sum_year", "sum_month"], name: "ix_event_sum_3", using: :btree

  create_table "events", force: :cascade do |t|
    t.string  "dom",   limit: 16,  null: false
    t.string  "fid",   limit: 32,  null: false
    t.string  "fvr",   limit: 16,  null: false
    t.string  "did",   limit: 32,  null: false
    t.string  "tid",   limit: 32,  null: false
    t.string  "bid",   limit: 32,  null: false
    t.string  "gid",   limit: 32,  null: false
    t.integer "otm",               null: false
    t.integer "ctm",               null: false
    t.integer "kct"
    t.string  "typ",   limit: 255
    t.float   "vlc"
    t.string  "svr",   limit: 255
    t.float   "lat",               null: false
    t.float   "lng",               null: false
    t.float   "gx",                null: false
    t.float   "gy",                null: false
    t.float   "gz",                null: false
    t.string  "vdo",   limit: 255
    t.string  "f_vdo", limit: 255
    t.string  "r_vdo", limit: 255
    t.string  "ado",   limit: 255
  end

  add_index "events", ["id"], name: "ix_event_0", unique: true, using: :btree

  create_table "expansion_code_items", force: :cascade do |t|
    t.integer "expansion_code_id"
    t.string  "name",              limit: 64,  null: false
    t.string  "description",       limit: 255, null: false
    t.integer "bind_index",                    null: false
    t.boolean "unique_flag"
    t.string  "ref_type",          limit: 20
    t.string  "ref_name",          limit: 64
    t.string  "col_type",          limit: 20,  null: false
    t.integer "col_size"
    t.boolean "nullable"
  end

  add_index "expansion_code_items", ["expansion_code_id", "name"], name: "ix_exp_code_item_0", unique: true, using: :btree

  create_table "expansion_codes", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",        limit: 64,  null: false
    t.string   "description", limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "expansion_codes", ["domain_id", "name"], name: "ix_exp_code_0", unique: true, using: :btree

  create_table "fleet_group_summaries", force: :cascade do |t|
    t.integer  "domain_id",                               null: false
    t.integer  "fleet_group_id"
    t.string   "sum_day",        limit: 10,               null: false
    t.string   "sum_year",       limit: 4,                null: false
    t.string   "sum_month",      limit: 2,                null: false
    t.string   "sum_week",       limit: 3,                null: false
    t.float    "velocity",                  default: 0.0
    t.float    "drive_dist",                default: 0.0
    t.float    "drive_time",                default: 0.0
    t.integer  "impact",                    default: 0
    t.integer  "geofence",                  default: 0
    t.integer  "emergency",                 default: 0
    t.integer  "overspeed",                 default: 0
    t.integer  "speed_off",                 default: 0
    t.integer  "speed_idle",                default: 0
    t.integer  "speed_slow",                default: 0
    t.integer  "speed_normal",              default: 0
    t.integer  "speed_high",                default: 0
    t.integer  "speed_over",                default: 0
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "fleet_group_summaries", ["domain_id", "fleet_group_id", "sum_day"], name: "ix_fleet_group_sum_0", unique: true, using: :btree
  add_index "fleet_group_summaries", ["domain_id", "fleet_group_id"], name: "ix_fleet_group_sum_1", using: :btree
  add_index "fleet_group_summaries", ["domain_id", "sum_day"], name: "ix_fleet_group_sum_2", using: :btree
  add_index "fleet_group_summaries", ["domain_id", "sum_year", "sum_month"], name: "ix_fleet_group_sum_3", using: :btree

  create_table "fleet_groups", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",        limit: 32,  null: false
    t.string   "description", limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "fleet_groups", ["domain_id", "name"], name: "ix_fleet_groups_0", unique: true, using: :btree

  create_table "fleet_summaries", force: :cascade do |t|
    t.integer  "domain_id",                             null: false
    t.integer  "fleet_id"
    t.integer  "driver_id"
    t.string   "sum_day",      limit: 10,               null: false
    t.string   "sum_year",     limit: 4,                null: false
    t.string   "sum_month",    limit: 2,                null: false
    t.string   "sum_week",     limit: 3,                null: false
    t.float    "velocity",                default: 0.0
    t.float    "drive_dist",              default: 0.0
    t.float    "drive_time",              default: 0.0
    t.integer  "impact",                  default: 0
    t.integer  "geofence",                default: 0
    t.integer  "emergency",               default: 0
    t.integer  "overspeed",               default: 0
    t.integer  "speed_off",               default: 0
    t.integer  "speed_idle",              default: 0
    t.integer  "speed_slow",              default: 0
    t.integer  "speed_normal",            default: 0
    t.integer  "speed_high",              default: 0
    t.integer  "speed_over",              default: 0
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "fleet_summaries", ["domain_id", "driver_id"], name: "ix_fleet_sum_4", using: :btree
  add_index "fleet_summaries", ["domain_id", "fleet_id", "sum_day"], name: "ix_fleet_sum_0", unique: true, using: :btree
  add_index "fleet_summaries", ["domain_id", "fleet_id"], name: "ix_fleet_sum_1", using: :btree
  add_index "fleet_summaries", ["domain_id", "sum_day"], name: "ix_fleet_sum_2", using: :btree
  add_index "fleet_summaries", ["domain_id", "sum_year", "sum_month"], name: "ix_fleet_sum_3", using: :btree

  create_table "fleets", force: :cascade do |t|
    t.integer  "domain_id",                  null: false
    t.string   "name",           limit: 32
    t.string   "device_name",    limit: 32
    t.string   "device_model",   limit: 32
    t.string   "driver_id",      limit: 32,  null: false
    t.string   "car_no",         limit: 32
    t.string   "car_model",      limit: 32
    t.string   "car_image",      limit: 255
    t.integer  "fleet_group_id"
    t.string   "purchase_date",  limit: 10
    t.string   "reg_date",       limit: 10
    t.float    "lat",                        null: false
    t.float    "lng",                        null: false
    t.string   "status",         limit: 255, null: false
    t.float    "velocity"
    t.string   "trip_id",        limit: 32
    t.string   "batch_id",       limit: 32
    t.string   "track_id",       limit: 32
    t.datetime "last_trip_time"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "fleets", ["domain_id", "fleet_group_id"], name: "ix_fleets_2", using: :btree
  add_index "fleets", ["domain_id", "name"], name: "ix_fleets_0", unique: true, using: :btree
  add_index "fleets", ["domain_id", "velocity"], name: "ix_fleets_3", using: :btree
  add_index "fleets", ["driver_id"], name: "ix_fleets_1", using: :btree

  create_table "geofence_groups", force: :cascade do |t|
    t.integer  "domain_id"
    t.integer  "fleet_group_id"
    t.integer  "geofence_id"
    t.string   "alarm_type",     limit: 10
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "geofence_groups", ["fleet_group_id", "geofence_id", "alarm_type"], name: "ix_geofence_groups_0", unique: true, using: :btree

  create_table "geofences", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",        limit: 32,  null: false
    t.string   "description", limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "geofences", ["domain_id", "name"], name: "ix_geofences_0", unique: true, using: :btree

  create_table "global_configs", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",       limit: 64,   null: false
    t.string   "value",      limit: 2000
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "creator_id"
    t.integer  "updater_id"
  end

  create_table "infographics", force: :cascade do |t|
    t.integer  "domain_id",                    null: false
    t.string   "name",             limit: 255, null: false
    t.string   "description",      limit: 255
    t.string   "infographic_type", limit: 255
    t.string   "printer_type",     limit: 255
    t.text     "diagram"
    t.text     "print_command"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "infographics", ["domain_id", "name"], name: "ix_infographics_0", unique: true, using: :btree

  create_table "menu_params", force: :cascade do |t|
    t.integer "menu_id"
    t.string  "name",        limit: 32,   null: false
    t.string  "description", limit: 255,  null: false
    t.string  "value",       limit: 4000, null: false
  end

  add_index "menu_params", ["menu_id", "name"], name: "ix_menu_params_0", unique: true, using: :btree

  create_table "menus", force: :cascade do |t|
    t.integer  "domain_id",                               null: false
    t.string   "name",        limit: 64,                  null: false
    t.string   "description", limit: 255
    t.integer  "parent_id"
    t.string   "template",    limit: 128
    t.string   "menu_type",   limit: 20
    t.string   "category",    limit: 64
    t.integer  "rank",                    default: 100
    t.string   "icon_path",   limit: 255
    t.boolean  "hidden_flag",             default: false
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "menus", ["domain_id", "menu_type"], name: "ix_menu_2", using: :btree
  add_index "menus", ["domain_id", "parent_id", "name"], name: "ix_menu_0", unique: true, using: :btree
  add_index "menus", ["parent_id"], name: "ix_menu_1", using: :btree

  create_table "movies", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "event_id",    limit: 32,  null: false
    t.integer  "total_size",              null: false
    t.integer  "start_byte",              null: false
    t.integer  "chunk_size",              null: false
    t.integer  "chunk_count",             null: false
    t.integer  "chunk_index",             null: false
    t.string   "file_path",   limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "movies", ["event_id"], name: "ix_movies_0", using: :btree

  create_table "permissions", force: :cascade do |t|
    t.integer  "role_id",                   null: false
    t.integer  "resource_id"
    t.string   "resource_type", limit: 255
    t.string   "action_name",   limit: 64
    t.string   "method_name",   limit: 64
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "permissions", ["resource_type", "resource_id", "role_id"], name: "ix_pmss_1", using: :btree
  add_index "permissions", ["role_id", "resource_type", "resource_id"], name: "ix_pmss_0", using: :btree

  create_table "polygons", force: :cascade do |t|
    t.integer "geofence_id"
    t.float   "lat",         null: false
    t.float   "lng",         null: false
  end

  add_index "polygons", ["geofence_id"], name: "ix_polygons_0", using: :btree

  create_table "properties", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",        limit: 64,  null: false
    t.string   "description", limit: 255
    t.string   "value",       limit: 255
    t.integer  "on_id"
    t.string   "on_type",     limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "properties", ["domain_id", "on_type", "on_id", "name"], name: "ix_property_0", unique: true, using: :btree

  create_table "rem_traces", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",        limit: 128
    t.integer  "entity_id"
    t.string   "entity_type", limit: 255
    t.text     "content"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "rem_traces", ["domain_id", "entity_type"], name: "ix_rem_trace_0", using: :btree
  add_index "rem_traces", ["domain_id", "updated_at"], name: "ix_rem_trace_1", using: :btree

  create_table "report_params", force: :cascade do |t|
    t.integer "report_id",                           null: false
    t.string  "name",        limit: 64,              null: false
    t.string  "description", limit: 255
    t.string  "input_type",  limit: 20,              null: false
    t.string  "ref_type",    limit: 20
    t.string  "ref_name",    limit: 64
    t.integer "rank",                    default: 0
  end

  add_index "report_params", ["report_id"], name: "ix_report_param_0", using: :btree

  create_table "reports", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",        limit: 255, null: false
    t.string   "description", limit: 255
    t.string   "template",    limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "reports", ["domain_id", "name"], name: "ix_reports_0", using: :btree

  create_table "roles", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",        limit: 64,  null: false
    t.string   "description", limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "roles", ["domain_id", "name"], name: "ix_role_0", unique: true, using: :btree

  create_table "service_in_params", force: :cascade do |t|
    t.integer "resource_id"
    t.string  "resource_type", limit: 255
    t.string  "name",          limit: 64
    t.string  "description",   limit: 255
    t.integer "rank"
  end

  add_index "service_in_params", ["resource_type", "resource_id"], name: "ix_svc_in_param_0", using: :btree

  create_table "service_out_params", force: :cascade do |t|
    t.integer "resource_id"
    t.string  "resource_type", limit: 255
    t.string  "name",          limit: 64
    t.string  "description",   limit: 255
    t.integer "rank"
  end

  add_index "service_out_params", ["resource_type", "resource_id"], name: "ix_svc_out_param_0", using: :btree

  create_table "settings", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.boolean  "global_flag"
    t.string   "name",        limit: 64,  null: false
    t.string   "description", limit: 255
    t.text     "value",                   null: false
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "settings", ["domain_id", "name"], name: "ix_settings_0", unique: true, using: :btree
  add_index "settings", ["domain_id", "updated_at"], name: "ix_settings_1", using: :btree

  create_table "shifts", force: :cascade do |t|
    t.integer "domain_id",                               null: false
    t.string  "name",             limit: 32
    t.boolean "default_flag"
    t.integer "total_shift",      limit: 2
    t.string  "shift1_start",     limit: 8
    t.string  "shift2_start",     limit: 8
    t.string  "shift3_start",     limit: 8
    t.string  "shift1_end",       limit: 8
    t.string  "shift2_end",       limit: 8
    t.string  "shift3_end",       limit: 8
    t.integer "shift1_start_add", limit: 2,  default: 0
    t.integer "shift1_end_add",   limit: 2,  default: 0
    t.integer "shift2_start_add", limit: 2,  default: 0
    t.integer "shift2_end_add",   limit: 2,  default: 0
    t.integer "shift3_start_add", limit: 2,  default: 0
    t.integer "shift3_end_add",   limit: 2,  default: 0
  end

  add_index "shifts", ["domain_id", "name"], name: "ix_shift_0", unique: true, using: :btree

  create_table "simulator_paths", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",        limit: 32,  null: false
    t.string   "description", limit: 255
    t.text     "paths"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "simulator_paths", ["domain_id", "name"], name: "ix_simulator_paths_0", unique: true, using: :btree

  create_table "simulators", force: :cascade do |t|
    t.integer  "domain_id",                      null: false
    t.string   "name",              limit: 32,   null: false
    t.string   "description",       limit: 255
    t.string   "type",              limit: 20,   null: false
    t.integer  "fleet_group_id"
    t.integer  "fleet_id"
    t.string   "fleet_ver",         limit: 20
    t.string   "url",               limit: 255,  null: false
    t.float    "lat"
    t.float    "lng"
    t.integer  "total_count"
    t.integer  "simulator_path_id"
    t.integer  "velocity"
    t.integer  "kick_counter"
    t.float    "gx"
    t.float    "gy"
    t.float    "gz"
    t.string   "event_type",        limit: 10
    t.string   "severity",          limit: 10
    t.integer  "stillcut_cycle"
    t.integer  "event_cycle"
    t.string   "stillcut_paths",    limit: 500
    t.float    "invoke_cycle",                   null: false
    t.string   "movie_paths",       limit: 1000
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "simulators", ["domain_id", "name"], name: "ix_simulators_0", unique: true, using: :btree

  create_table "terminologies", force: :cascade do |t|
    t.integer  "domain_id",                  null: false
    t.string   "name",          limit: 255,  null: false
    t.string   "description",   limit: 4000
    t.string   "locale",        limit: 15
    t.string   "category",      limit: 20
    t.string   "display",       limit: 1000
    t.string   "display_short", limit: 255
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "terminologies", ["domain_id", "locale", "category", "name"], name: "ix_terminologies_0", unique: true, using: :btree

  create_table "tracks", force: :cascade do |t|
    t.string  "dom",   limit: 32,  null: false
    t.string  "fid",   limit: 32,  null: false
    t.string  "fvr",   limit: 16,  null: false
    t.string  "tid",   limit: 32,  null: false
    t.string  "bid",   limit: 32,  null: false
    t.string  "did",   limit: 32,  null: false
    t.integer "kct",               null: false
    t.float   "vlc"
    t.float   "a_vlc"
    t.float   "dst"
    t.float   "lat",               null: false
    t.float   "lng",               null: false
    t.float   "p_lat"
    t.float   "p_lng"
    t.float   "gx",                null: false
    t.float   "gy",                null: false
    t.float   "gz",                null: false
    t.string  "f_img", limit: 255
    t.string  "r_img", limit: 255
    t.integer "stm",               null: false
    t.integer "ttm",               null: false
    t.integer "ctm",               null: false
  end

  add_index "tracks", ["id"], name: "ix_track_0", unique: true, using: :btree

  create_table "trips", force: :cascade do |t|
    t.string  "dom",   limit: 32, null: false
    t.string  "bid",   limit: 32, null: false
    t.string  "fid",   limit: 32, null: false
    t.string  "fvr",   limit: 32, null: false
    t.string  "did",   limit: 32, null: false
    t.string  "sts",   limit: 1,  null: false
    t.float   "s_lat",            null: false
    t.float   "s_lng",            null: false
    t.float   "lat"
    t.float   "lng"
    t.integer "c_off"
    t.integer "c_idl"
    t.integer "c_low"
    t.integer "c_nml"
    t.integer "c_hgh"
    t.integer "c_ovr"
    t.integer "stm",              null: false
    t.integer "etm",              null: false
    t.integer "utm",              null: false
  end

  add_index "trips", ["id"], name: "ix_trip_0", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "login",                  limit: 255,              null: false
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                      default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.string   "name",                   limit: 64
    t.string   "locale",                 limit: 10
    t.string   "timezone",               limit: 64
    t.boolean  "admin_flag"
    t.boolean  "operator_flag"
    t.boolean  "active_flag"
    t.string   "domain_id",              limit: 32
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "role_id", null: false
  end

  add_index "users_roles", ["role_id", "user_id"], name: "ix_user_role_1", using: :btree
  add_index "users_roles", ["user_id", "role_id"], name: "ix_user_role_0", unique: true, using: :btree

  create_table "variables", force: :cascade do |t|
    t.integer  "domain_id",               null: false
    t.string   "name",        limit: 255, null: false
    t.string   "description", limit: 255
    t.string   "category",    limit: 255
    t.text     "logic"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "variables", ["domain_id", "name"], name: "ix_variables_0", unique: true, using: :btree

end
