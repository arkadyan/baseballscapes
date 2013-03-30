require 'date'
require 'open-uri'
require 'nokogiri'
require 'pry'

module MLBGameData
  BASE_URL = 'http://gd2.mlb.com/components/game/mlb'
  TEAMS    = {
    ari: "Arizona Diamondbacks",
    atl: "Atlanta Braves",
    bal: "Baltimore Orioles",
    bos: "Boston Red Sox",
    chn: "Chicago Cubs",
    cha: "Chicago White Sox",
    cin: "Cincinnati Reds",
    cle: "Cleveland Indians",
    col: "Colorado Rockies",
    det: "Detroit Tigers",
    hou: "Houston Astros",
    kca: "Kansas City Royals",
    ana: "Los Angeles Angels",
    lan: "Los Angeles Dodgers",
    flo: "Miami Marlins",
    mil: "Milwaukee Brewers",
    min: "Minnesota Twins",
    nyn: "New York Mets",
    nya: "New York Yankees",
    oak: "Oakland Athletics",
    phi: "Philadelphia Phillies",
    pit: "Pittsburgh Pirates",
    sdn: "San Diego Padres",
    sfn: "San Francisco Giants",
    sea: "Seattle Mariners",
    sln: "St. Louis Cardinals",
    tba: "Tampa Bay Rays",
    tex: "Texas Rangers",
    tor: "Toronto Blue Jays",
    was: "Washington Nationals"
  }

  #useful files
  # /inning/inning_all.xml - a large file containing every pitch, etc

  # TODO: support double headers
  def fetch date, team, index=0
  end

  def self.compute_url date, team, index=0
    date = Date.parse date
    raise ArgumentError unless date.is_a? Date
    raise ArgumentError unless TEAMS.keys.include? team.to_sym
    dir_url = [
        BASE_URL,
        "/year_#{date.year}/month_#{date.strftime '%m'}/day_#{date.strftime '%d'}"
      ].join

    doc = Nokogiri::HTML(open(dir_url))
    game = doc.search('a').map{|a| a.attr("href")}.find{|a| a.match /_#{team.to_s.downcase}mlb_/}
    return [dir_url,game]*'/'
  end

end

date = '2012-07-13'

puts MLBGameData.compute_url('2012-07-13', 'lan')
