require 'date'
require 'open-uri'
require 'nokogiri'
require "active_support/core_ext"
# require 'pry'

class MLBGameData
  BASE_URL = 'http://gd2.mlb.com/components/game/mlb'
  DATA_VERSION = '001'
  CACHE_PATH = File.join(File.dirname(__FILE__), '..', 'data_cache', DATA_VERSION)
  TEAMS    = {
    ari: {name: "Arizona Diamondbacks",  color: '#FFEFD5'},
    atl: {name: "Atlanta Braves",        color: '#FFDAB9'},
    bal: {name: "Baltimore Orioles",     color: '#CD853F'},
    bos: {name: "Boston Red Sox",        color: '#FFC0CB'},
    chn: {name: "Chicago Cubs",          color: '#DDA0DD'},
    cha: {name: "Chicago White Sox",     color: '#B0E0E6'},
    cin: {name: "Cincinnati Reds",       color: '#800080'},
    cle: {name: "Cleveland Indians",     color: '#FF0000'},
    col: {name: "Colorado Rockies",      color: '#BC8F8F'},
    det: {name: "Detroit Tigers",        color: '#4169E1'},
    hou: {name: "Houston Astros",        color: '#8B4513'},
    kca: {name: "Kansas City Royals",    color: '#FA8072'},
    ana: {name: "Los Angeles Angels",    color: '#F4A460'},
    lan: {name: "Los Angeles Dodgers",   color: '#2E8B57'},
    flo: {name: "Miami Marlins",         color: '#FFF5EE'},
    mil: {name: "Milwaukee Brewers",     color: '#A0522D'},
    min: {name: "Minnesota Twins",       color: '#C0C0C0'},
    nyn: {name: "New York Mets",         color: '#87CEEB'},
    nya: {name: "New York Yankees",      color: '#6A5ACD'},
    oak: {name: "Oakland Athletics",     color: '#708090'},
    phi: {name: "Philadelphia Phillies", color: '#00FF7F'},
    pit: {name: "Pittsburgh Pirates",    color: '#4682B4'},
    sdn: {name: "San Diego Padres",      color: '#D2B48C'},
    sfn: {name: "San Francisco Giants",  color: '#008080'},
    sea: {name: "Seattle Mariners",      color: '#D8BFD8'},
    sln: {name: "St. Louis Cardinals",   color: '#FF6347'},
    tba: {name: "Tampa Bay Rays",        color: '#40E0D0'},
    tex: {name: "Texas Rangers",         color: '#EE82EE'},
    tor: {name: "Toronto Blue Jays",     color: '#F5DEB3'},
    was: {name: "Washington Nationals",  color: '#FFFF00'}
  }

  attr_reader :date, :team, :index

  def cache?
    !ENV['RACK_ENV'].present? || ENV['RACK_ENV'] != 'production'
  end

  # TODO: support double headers
  def initialize date, team, index=0
    @date = Date.parse date
    @team = team.to_s.downcase
    @index = index
  end

  #useful files
  # /inning/inning_all.xml - a large file containing every pitch, etc

  def data file
    prefetched_data(file) || fetch_file(file)
  end

  def box_score
    @_box_score ||= data('boxscore.json')['data']['boxscore']
  end

  def innings_all
    @_innings_all ||= data('inning/inning_all.xml')
  end

  def fetch_file file
    puts "--- fetching remote #{compute_url+file}"
    remote_data = open(compute_url + file).read
    file_path = compute_url.split('/').last + file.gsub('/', '-')

    if cache?
      open(File.join(CACHE_PATH)+'/'+file_path, 'wb') do |file|
        begin
          puts "--- writing #{File.join(CACHE_PATH)+file_path}"
          file << remote_data
        rescue
          puts "ERROR: #{compute_url}"
        end
      end
    end
    outfile(remote_data, file)
  end

  def outfile remote_data, file_name
    if file_name.match(/\.xml/)
      Nokogiri::XML remote_data
    elsif file_name.match(/\.json/)
      JSON.parse remote_data
    else
      remote_data
    end
  end

  def prefetched_data file
    if cache?
      regex = /#{date.to_s.gsub(/-/,'_')}.*_#{team}mlb_.*#{file.sub(/\//, '-')}/
      Dir.foreach(File.join(CACHE_PATH)) do |f|
        if f.match regex
          puts "--- cache hit #{f}"
          return outfile(open([File.join(CACHE_PATH), f].join('/')).read, file)
        end
      end
    end
    puts "--- cache miss #{date} / #{team} / #{file}"
    nil
  end

  def home_team
    MLBGameData::TEAMS[innings.first.home_team.to_sym]
  end

  def away_team
    MLBGameData::TEAMS[innings.first.away_team.to_sym]
  end

  def innings
    @_innings ||= innings_all.search('inning').map{|i| Inning.new(i)}
  end

  def at_bats
    innings.map(&:at_bats).flatten
  end

  def pitches
    at_bats.map(&:pitches).flatten
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

  class Node
    attr_reader :doc, :attributes, :children
    def initialize doc
      @children =[]
      @doc = doc
      @attributes = {}
      populate_attributes
      transform if respond_to?(:transform)
    end

    def populate_attributes
      @doc.attributes.each do |k,v|
        attributes[k.to_sym] = v.value
      end
    end

    def to_json
      out = attributes
      children.each do |ch|
        out[ch.to_sym] = send(ch).map(&:to_json)
      end
      out.to_json
    end

    def method_missing attribute
      attributes[attribute.to_sym] || super
    end
  end

  class Inning < Node
    attr_reader :at_bats
    def transform
      @children << :at_bats
      @at_bats = doc.search('atbat').map{|ab| AtBat.new ab}
    end
  end

  class AtBat < Node
    attr_reader :pitches
    def transform
      @children << :pitches
      @pitches = doc.search('pitch').map{|p| Pitch.new p}
    end
  end

  class Pitch < Node
  end
end

# params = {:date => '2012-07-13', :team => 'lan'}
# d = MLBGameData.new(params[:date], params[:team])
# a = d.box_score
# binding.pry
