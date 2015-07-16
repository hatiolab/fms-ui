# Date 클래스에 iso_year 를 추가한다.
Date.class_eval do
  def iso_year
    if self >= ::Date.new(year, 12, 20) && cweek < 10
      return year + 1
    elsif self <= ::Date.new(year, 1, 10) && cweek > 50
      return year - 1
    end
    year
  end
end