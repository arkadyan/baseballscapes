require 'compass'
require 'sinatra'
require './lib/mlb_game_data'

get '/' do
  erb :index
end

get '/game/:date/:team' do
  @data = MLBGameData.new(params[:date], params[:team]).data
  erb :index
end