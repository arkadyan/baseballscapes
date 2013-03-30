require 'date'
require 'open-uri'
require 'nokogiri'
require "active_support/core_ext"

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

  def data file = 'inning/inning_all.xml'
    @_data ||= (prefetched_data(file) || fetch_file(file))
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
    Nokogiri::XML remote_data
  end

  def prefetched_data file
    if cache?
      regex = /#{date.to_s.gsub(/-/,'_')}.*_#{team}mlb_.*#{file.sub(/\//, '-')}/
      Dir.foreach(File.join(CACHE_PATH)) do |f|
        if f.match regex
          puts "--- cache hit #{f}"
          return Nokogiri::XML(open([File.join(CACHE_PATH), f].join('/')))
        end
      end
    end
    puts "--- cache miss #{date} / #{team} / #{file}"
    nil
  end

  def innings
    @_innings ||= data.search('inning').map{|i| Inning.new(i)}
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
# a = d.at_bats.last
# binding.pry
