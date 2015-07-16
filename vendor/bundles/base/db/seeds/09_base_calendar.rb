#encoding: utf-8 

data = {
  name: 'Work'
}

1.upto(7) do |idx|
  data["day#{idx}_off_flag"] = false
  data["day#{idx}_workhour"] = 24
end

Calendar.create(data).build_calendar({
  year: Date.today.year,
  start_month: '1',
  end_month: '12'
})
