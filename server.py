
#from flask import Flask
from flask import Flask, request, render_template, jsonify

import pickle
import json

import pandas as pd
import requests


app = Flask(__name__, static_folder='public', template_folder='views')

@app.route("/")
def hello():
  return render_template('index.html')


df = pd.read_csv('movie_top_features.csv')
df = df.set_index('Unnamed: 0')
similarity = json.load(open('similarity.json', 'r'))
dma_movies = json.load(open('dma_movies.json', 'r'))
demo_data = json.load(open('demo_outcomes.json', 'r'))
brand_movies = json.load(open('brand_movies.json', 'r'))
ad_media_movies = json.load(open('ad_media_movies.json', 'r'))
concepts = json.load(open('concepts.json', 'r'))

map_apostrophe = {i.replace("'", ''): i for i in list(df.index.values)}
state_map = requests.get('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json').json()


@app.route('/get_film_list', methods=['get'])
def film_list():
  
  return jsonify([i.replace("'", '') for i in list(df.index.values)])


@app.route('/concepts', methods=['get'])
def get_concepts():
  if 'movie' in request.args:
    movie = map_apostrophe[request.args['movie']]
  
  return list(concepts[movie])

@app.route('/brands', methods=['get'])
def get_brand():
  if 'movie' in request.args:
    movie = map_apostrophe[request.args['movie']]
  if 'brand_cat' in request.args:
    brand_cat = request.args['brand_cat']

  return jsonify({'b_list': brand_movies[movie][brand_cat], 'cat': brand_cat})
    
  
  
@app.route('/ad_media', methods=['get'])
def get_ad_media():
  response = {'chart_type': 'scatterPlot'}
  if 'movie' in request.args:
    movie = map_apostrophe[request.args['movie']]
  if 'brand_cat' in request.args:
    brand_cat = request.args['brand_cat']
    
  data_cut = ad_media_movies[movie][brand_cat]
  data_params = {"title": brand_cat,
                "xlabel": f'Fans of {movie} agreement level over non-fans',
                "ylabel": "Overall agreement"}
  data = {'data': [{'id': ci, 'x': d[list(d)[0]][0], 'y': d[list(d)[0]][1], 'label': list(d)[0].split('--')[0].split('(')[0].split('/')[0].strip()} for ci, d in enumerate(list(data_cut)) if not 'None ' in list(d)[0] and not 'Other' in list(d)[0] and not ' know' in list(d)[0]],
                    'data_params': data_params}
  response['chart_data'] = data
  response['params'] = {"slice": ('ad_med'+movie+brand_cat).replace(' ', '_').replace("'", ''),
                       'show_axis': 1,
                       'pad_range': 1,
                       'title_y': -30,
                        'title_x': 80,
}

  return jsonify(response)#{'b_list': ad_media_movies[movie][brand_cat], 'cat': brand_cat})


demo_title_map = {'ed': 'EDUCATION',
                 'age': 'AGE',
                 'gender': 'GENDER',
                 'income': 'INCOME'}

@app.route('/demo', methods=['get'])
def get_demo():
  if 'movie' in request.args:
    movie = map_apostrophe[request.args['movie']]
  if 'demo_type' in request.args:
    demo_type = request.args['demo_type']
    
  response = {'chart_type': 'dotPlot'}
  gender = 'hi'
  data_params = {}
  data_params['xlabel'] = f'Percent of {movie} fans'
  data_params['ylabel'] = f'Relative {movie} fans'
  data_params['group_name'] = f'Fans of {movie}'
  data_params['other_name'] = f'Fans of {movie}'
  data_params['tt_category_words'] = 'monthly disposable income:'

  data_params['title'] = demo_title_map[demo_type]
  #print(list(demo_data[demo_type]))
  data = {'data': {'only_data': demo_data[demo_type][movie]},
         'data_params': data_params}
  
  response['chart_data'] = data
  response['params'] = {'num_type': 'percent',
                        'hide_y_axis': True,
                        'hide_x_axis': True,
                        'legend_width': 90,
                        'legend_x_anchor': 10,
                        'legend_y_anchor': -50,
                        'title_y': -30,
                        'title_x': 80,
                        'point_size': 5,
                        'color_list': ["#6c9dc6",
                          "#de5454",
                          "#7A71E7",
                          "#F97D7D",
                          "#56CCF2",
                          "#3B50DA",
                           "#EA6A0D",
                          "#8B003A",
                        ],
                        'width': 500,
                        'height': 40*len(demo_data[demo_type][movie]) + 100,
                        'font_size': 14,
                        'grid_color': '#ecf0f4',
                        'grid_width': 2,
                        'font_color': '#4F4F4F',
                        'sort_by': 'brand',
                        'xy_orientation': 'horizontal',
                        'button_x': 700,
                        'button_y': -370,
                        'tooltip': 1
                        } 
  return jsonify(response)





@app.route('/map', methods=['get'])
def get_map():
  
  if 'movie' in request.args:
    movie = map_apostrophe[request.args['movie']]

  
  response = {'chart_type': 'chloropleth'}
  
  # format: {"500": {"value": 5.249782479514175, "DMA Code": "500", "Designated Market Area (DMA)": "Portland - Auburn", "value": 0}
  
  
  
  
  response['chart_data'] = {'data': dma_movies[movie],
                           'data_params': {'title': '',
                                          'dataGeo': json.load(open('nielsentopo.json', 'r')),
                                          'state_map': state_map
                        }}
  response['params'] = { 
                        'width': 900,
                        'height': 700,
                        'title_y': 50,
                        'title_x': 400,
                        'font_color': '#4F4F4F',

                      }
  
  
  return jsonify(response)
  
@app.route('/attitudes', methods=['get'])
def get_attitudes():
  if 'movie' in request.args:
    movie = map_apostrophe[request.args['movie']]
  
  cluster_id = df.loc[movie]['cluster']
  #similar_movies = similarity[movie]['movies']
  
  data = {}
  data['similar_movies'] = similarity[movie]
  
  attitude_cols = [i for i in list(df) if i!='cluster']
  
  attitudes = df.loc[movie][attitude_cols].sort_values()
  
  top_attitudes = [{'a': i, 'v': j} for i,j in zip(attitudes.index[::-1][:5], attitudes.values[::-1][:5]) if j > 0]
  bot_attitudes = [{'a': i, 'v': j} for i,j in zip(attitudes.index[:5], attitudes.values[:5]) if j < 0]

  data['single_attitudes'] = {'top': top_attitudes,
                             'bot': bot_attitudes}
  
  group_attitudes = df[df['cluster'] == cluster_id].mean()[attitude_cols].sort_values()
  top_group_attitudes = [{'a': i, 'v': j} for i,j in zip(group_attitudes.index[::-1][:5], group_attitudes.values[::-1][:5]) if j > 0]
  bot_group_attitudes = [{'a': i, 'v': j} for i,j in zip(group_attitudes.index[:5], group_attitudes.values[:5]) if j < 0]

  data['group_attitudes'] = {'top': top_group_attitudes,
                             'bot': bot_group_attitudes}

  data['concepts'] = [i for i in concepts[movie] if len(i[list(i)[0]]['words']) > 3 and 
                      list(i)[0] != 'qualifiers' and
                     i[list(i)[0]]['cluster_in_num_films'] > 3]
  
  
  
  return jsonify(data)
  
if __name__ == "__main__":
  app.run()

  
  