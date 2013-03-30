require 'date'
require 'open-uri'
require 'nokogiri'
require 'pry'




class MLBGameData
  BASE_URL = 'http://gd2.mlb.com/components/game/mlb'
  DATA_VERSION = '001'
  CACHE_PATH = File.join(File.dirname(__FILE__), '..', 'data_cache', DATA_VERSION)
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

  attr_reader :date, :team, :index

  # TODO: support double headers
  def initialize date, team, index=0
    @date = Date.parse date
    @team = team.to_s.downcase
    @index = index
  end

  #useful files
  # /inning/inning_all.xml - a large file containing every pitch, etc

  def data file = 'inning/inning_all.xml'
    prefetched_data(file) || fetch_file(file)
  end

  def fetch_file file
    puts "--- fetching remote #{compute_url+file}"
    remote_data = open(compute_url + file).read
    file_path = compute_url.split('/').last + file.gsub('/', '-')


    open(File.join(CACHE_PATH)+'/'+file_path, 'wb') do |file|
        begin
          puts "--- writing #{File.join(CACHE_PATH)+file_path}"
          file << remote_data
        rescue
          puts "ERROR: #{compute_url}"
        end
      end
     Nokogiri::XML remote_data
  end

  def prefetched_data file
    regex = /#{date.to_s.gsub(/-/,'_')}.*_#{team}mlb_.*#{file.sub(/\//, '-')}/
    Dir.foreach(File.join(CACHE_PATH)) do |f|
      if f.match regex
        puts "--- cache hit #{f}"
        return Nokogiri::XML(open([File.join(CACHE_PATH), f].join('/')))
      end
    end
    puts "--- cache miss #{date} / #{team} / #{file}"
    nil
  end

  def compute_url
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
