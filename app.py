
import os
import pandas as pd
from flask import jsonify
from flask import *
from sklearn.cluster import KMeans
from sklearn import manifold
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
import numpy as np
import random
from sklearn import preprocessing
from sklearn.metrics import pairwise_distances
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

df = pd.read_csv("pollution.csv")
df['yr']=[d.split('-')[0] for d in df['Date Local']]
df['Month']=[d.split('-')[1] for d in df['Date Local']]
df['Day']=[d.split('-')[2] for d in df['Date Local']]
filter = ['State', 'NO2 Mean', 'O3 Mean', 'SO2 Mean', 'CO Mean', 'yr', 'Month', 'Day']
data = df[filter]
d1 = data.groupby(['State', 'yr', 'Month'])[['NO2 Mean', 'O3 Mean', 'SO2 Mean', 'CO Mean']].mean()
d1 = d1.reset_index()
# print (d1)
deaths_data1 = pd.read_csv("USCS_TrendChart.csv")
deaths_data_US = deaths_data1[["Area", "Year", "DeathCount", "Population"]]
death_states = pd.read_csv("USCS_TrendMap_states.csv")
deaths_data_states = death_states[["Area", "Year", "DeathCount", "Population"]]


data_csv = pd.read_csv('pollution.csv', nrows=1000)
ftrs = ['NO2 Mean', 'NO2 AQI', 'O3 Mean', 'O3 AQI', 'SO2 Mean', 'SO2 AQI', 'CO Mean', 'CO AQI']
data_csv = data_csv[ftrs]
data_csv = data_csv.dropna()
data_csv_original = data_csv
scaler = StandardScaler()
data_csv[ftrs] = scaler.fit_transform(data_csv[ftrs])
samplesize = 200
imp_ftrs = []
adaptive_samples = []

print ("Started: Welcome")

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/us_map', methods=["POST"])
def us_map():
    response = request.get_json()
    try:
        temp = df[df["year"] == int(response["year"])].groupby("State")[response["pollutant"]+ " AQI"].mean()
    except: temp = df.groupby("State")[response["pollutant"]+ " AQI"].mean()
    temp = temp.reset_index()
    temp.to_dict()
    temp = temp.to_json()
    return jsonify(temp)

@app.route('/parallel')
def parallel():
    state = request.args.get("state")
    if state=='none':
        df_state = d1
    else:
        df_state = d1[d1["State"] == state]
    print(df_state)
    return df_state.to_json(orient="records")

@app.route('/deaths_state')
def deaths_state():
    state = request.args.get("state")
    deaths_US = deaths_data_states.rename({"Area": "State"}, axis="columns")
    deaths_US = deaths_US.rename({"Year": "yr"}, axis="columns")
    deaths_US = deaths_US.rename({"DeathCount": "deathcount"}, axis="columns")
    print(deaths_US)
    if state=='none':
        df_state = deaths_US
    else:
        df_state = deaths_US[deaths_US["State"] == state]

    df_state = df_state[["yr", "deathcount"]]
    # df_state = deaths_US.reset_index()
    print(df_state)
    return df_state.to_json(orient="records")


@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response


@app.route('/overview_bar_chart')
def overview_bar_chart():
    pollutant = request.args.get("pollutant")
    #bar_chart = aqi_data_yearwise[aqi_data_yearwise.State == state][["Year", pollutant + " AQI"]]
    bar_chart = df.groupby("year")[pollutant+ " AQI"].mean()
    bar_chart = bar_chart.reset_index()
    return bar_chart.to_json(orient="records")


@app.route('/overview_line_chart')
def overview_line_chart():
    state = request.args.get("state")
    pollutant = request.args.get("pollutant")
    if state=='none':
        df_state = df
    else:
        df_state = df[df["State"]==state]
    # if pollutant=='none':
    #     sel_cols = ["year", "O3 AQI", "SO2 AQI", "NO2 AQI", "CO AQI"]
    #     df_state = df_state[sel_cols]
    #     df_state = df_state.groupby("year").mean().mean(axis=1)
    # else:
    # df_state['month_year'] = pd.to_datetime(df_state['Date Local']).dt.to_period('M')

    # import pdb; pdb.set_trace()
    
    # df_state = df_state[["year", pollutant + " AQI"]]
    df_state = df_state[["year","Date Local", pollutant + " AQI"]]
    df_state['DATE'] = df_state['Date Local']
    df_state = df_state.drop(columns=['Date Local'])
    
    df_state_c = df_state.copy()
    
    df_state_c['month_year'] = pd.to_datetime(df_state_c['DATE']).dt.strftime('%Y/%m')
    df_state['DATE']= pd.to_datetime(df_state['DATE']).dt.strftime('%Y/%m/%d')
    
    df_state_c['DATE'] = df_state_c['month_year']
    df_state_c = df_state_c.drop(columns=['month_year'])
    
    df_state1 = df_state.groupby("DATE")[pollutant+ " AQI"].mean()
    df_state2 = df_state_c.groupby("DATE")[pollutant+ " AQI"].mean()
    
    # df_state3 = df_state.groupby("year")[pollutant+ " AQI"].mean()
    
    df_state1 = df_state1.reset_index()
    df_state2 = df_state2.reset_index()
    # df_state3 = df_state3.reset_index()
    
    # return df_state3.to_json(orient="records")
    # import pdb; pdb.set_trace()
    
    md = dict()
    md['dd'] =  df_state1.to_json(orient="records")
    md['md'] =  df_state2.to_json(orient="records")
    # md['yd'] =  df_state3.to_json(orient="records")
    import json
    md = json.dumps(md)
    return md

@app.route('/popn_US_map')
def popn_US_map():
    year = request.args.get("year")
    popn_US = deaths_data_states[deaths_data_states["Year"] == int(year)]
    popn_US = popn_US[["Area", "Population"]]
    popn_US = popn_US.rename({"Area": "State"}, axis="columns")
    popn_US = popn_US.reset_index()
    popn_US = popn_US[["State", "Population"]]
    print(popn_US)
    popn_US.to_dict()
    popn_US = popn_US.to_json()
    return jsonify(popn_US)


@app.route('/population_pollution_US_line_chart')
def population_pollution_US_line_chart():
    pollutant = request.args.get("pollutant")
    df_polln_US = df.groupby("year").mean().reset_index()
    df_polln_US = df_polln_US[["year", pollutant + " AQI"]]
    death1_yearwise = deaths_data_US[["Year", "Population"]]
    line_chart = pd.merge(df_polln_US, death1_yearwise, left_on="year", right_on="Year")
    print("line chart ********************************************")
    print(line_chart)
    return line_chart.to_json(orient="records")


@app.route('/deaths_pollution_US_line_chart')
def deaths_pollution_US_line_chart():
    pollutant = request.args.get("pollutant")
    df_polln_US = df.groupby("year").mean().reset_index()
    df_polln_US = df_polln_US[["year", pollutant + " AQI"]]
    death1_yearwise = deaths_data_US[["Year", "DeathCount"]]
    line_chart = pd.merge(df_polln_US, death1_yearwise, left_on="year", right_on="Year")
    print("line chart ********************************************")
    print(line_chart)
    return line_chart.to_json(orient="records")



@app.route('/deaths_US_map')
def deaths_US_map():
    year = request.args.get("year")
    deaths_US = deaths_data_states[deaths_data_states["Year"] == int(year)]
    deaths_US = deaths_US[["Area", "DeathCount"]]
    deaths_US = deaths_US.rename({"Area": "State"}, axis="columns")
    deaths_US = deaths_US.reset_index()
    deaths_US = deaths_US[["State", "DeathCount"]]
    print(deaths_US)
    deaths_US.to_dict()
    deaths_US = deaths_US.to_json()
    return jsonify(deaths_US)


@app.route('/population_pollution_states_line_chart')
def population_pollution_states_line_chart():
    state = request.args.get("state")
    pollutant = request.args.get("pollutant")
    df_state = df[df["State"] == state]
    df_state = df_state.groupby("year").mean().reset_index()
    df_state = df_state[["year", pollutant + " AQI"]]
    death_state = death_states[death_states["Area"] == state]
    death_state = death_state[["Year", "Population"]]
    line_chart = pd.merge(df_state, death_state, left_on="year", right_on="Year")
    print(death_state)
    print("line chart ********************************************")
    print(state)
    print(line_chart)
    return line_chart.to_json(orient="records")


@app.route('/deaths_pollution_states_line_chart')
def deaths_pollution_states_line_chart():
    state = request.args.get("state")
    pollutant = request.args.get("pollutant")
    df_state = df[df["State"] == state]
    df_state = df_state.groupby("year").mean().reset_index()
    df_state = df_state[["year", pollutant + " AQI"]]
    death_state = death_states[death_states["Area"] == state]
    death_state = death_state[["Year", "DeathCount"]]
    line_chart = pd.merge(df_state, death_state, left_on="year", right_on="Year")
    print(death_state)
    print("line chart ********************************************")
    print(state)
    print(line_chart)
    return line_chart.to_json(orient="records")


@app.route('/brush_chart')
def brush_chart():
    year = request.args.get("year")
    #pollutant = request.args.get("pollutant")
    # import pdb; pdb.set_trace()
    temp1=deaths_data_states[deaths_data_states['Year']==int(year)]
    temp1 = temp1.rename(columns={'Area': 'State'})
    temp = df[df["year"] == int(year)].groupby("State")["O3 AQI","NO2 AQI","CO AQI","SO2 AQI"].mean()
    df_merge_col = pd.merge(temp, temp1, on='State')
    df_merge_col = df_merge_col[['State', 'O3 AQI', 'NO2 AQI', 'CO AQI', 'SO2 AQI', 'DeathCount']]
    df_merge_col['DeathCount'] = round(df_merge_col['DeathCount']*30)/df_merge_col['DeathCount'].max()
    df_merge_col.set_index('State')
    # 
    # df_merge_col = df_merge_col.reset_index()
    df_merge_col = df_merge_col.reset_index()
    print(df_merge_col)
    return df_merge_col.to_json(orient="records")


@app.route('/pca_scree_plot')
def pca_scree_plot():
    with open('sample.txt', 'r') as myfile:
        data = myfile.read()
    print (data)
    return data
    
# @app.route('/pca_scree_plot')
# def pca_scree_plot():
#     df_pca = df[["NO2 Mean", "NO2 AQI", "O3 Mean", "O3 AQI", "SO2 Mean", "SO2 AQI", "CO Mean", "CO AQI"]]
#     df_pca['O3 Mean'] = df_pca['O3 Mean'].apply(lambda x: x * 1000)
#     df_pca['CO Mean'] = df_pca['CO Mean'].apply(lambda x: x * 1000)
#
#     pca = PCA()
#     # print(normalize(df_pca))
#     # pca.fit(normalize(df_pca))
#     a = 3
#     min_max_scaler = preprocessing.MinMaxScaler()
#     df_pca = min_max_scaler.fit_transform(df_pca)
#     print(df_pca)
#     pca.fit(df_pca)
#     scree_plot_data = [np.cumsum(pca.explained_variance_ratio_), pca.explained_variance_ratio_]
#     labels = np.array([[1, 2, 3, 4, 5, 6, 7, 8]])
#     scree_plot_data = np.concatenate((labels.T, np.array(scree_plot_data).T.tolist()), axis=1)
#     return str(np.array(scree_plot_data).tolist())

def clustering():
    features = data_csv[ftrs]
    k = 3
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(features)
    kmeans_centres = kmeans.cluster_centers_
    labels = kmeans.labels_
    data_csv['kcluster'] = pd.Series(labels)

def adaptive_sampling():
    global data_csv
    global adaptive_samples
    kcluster0 = data_csv_original[data_csv_original['kcluster'] == 0]
    kcluster1 = data_csv_original[data_csv_original['kcluster'] == 1]
    kcluster2 = data_csv_original[data_csv_original['kcluster'] == 2]
    size_kcluster0 = len(kcluster0) * samplesize / len(data_csv)
    size_kcluster1 = len(kcluster1) * samplesize / len(data_csv)
    size_kcluster2 = len(kcluster2) * samplesize / len(data_csv)
    sample_cluster0 = kcluster0.loc[random.sample(list(kcluster0.index), int(size_kcluster0))]
    sample_cluster1 = kcluster1.loc[random.sample(list(kcluster1.index), int(size_kcluster1))]
    sample_cluster2 = kcluster2.loc[random.sample(list(kcluster2.index), int(size_kcluster2))]
    adaptive_samples = pd.concat([sample_cluster0, sample_cluster1,sample_cluster2])


@app.route('/get_pca')
def getpca():
    pca = pd.read_csv("export_pca.csv")
    return pca.to_json(orient='columns')


# @app.route('/get_pca')
# def getpca():
#     global sq_loadings
#     global adaptive_samples
#     global imp_ftrs
#     clustering()
#     adaptive_sampling()
#     pc_loadings()
#     print (adaptive_samples)
#     print (adaptive_samples[ftrs])
#     X = adaptive_samples[ftrs]
#     imp_ftrs = sorted(range(len(sq_loadings)), key=lambda k: sq_loadings[k], reverse=True)
#     data_columns = []
#     pca_data = PCA(n_components=2)
#     pca_data.fit(X)
#     X = pca_data.transform(X)
#     data_columns = pd.DataFrame(X)
#     for i in range(0, 2):
#         data_columns[ftrs[imp_ftrs[i]]] = data_csv_original[ftrs[imp_ftrs[i]]][:samplesize]
#
#     data_columns['clusterid'] = data_csv['kcluster'][:samplesize]
#
#     print ("get_pca\n", data_columns)
#     return data_columns.to_json(orient='columns')

def pc_loadings():
    global sq_loadings
    df_pca1 = df[["NO2 Mean", "NO2 AQI", "O3 Mean", "O3 AQI", "SO2 Mean", "SO2 AQI", "CO Mean", "CO AQI"]]
    df_pca1['O3 Mean'] = df_pca1['O3 Mean'].apply(lambda x: x * 1000)
    df_pca1['CO Mean'] = df_pca1['CO Mean'].apply(lambda x: x * 1000)

    pca = PCA()
    # print(normalize(df_pca))
    # pca.fit(normalize(df_pca))

    min_max_scaler = preprocessing.MinMaxScaler()
    df_pca1_norm = min_max_scaler.fit_transform(df_pca1)
    pca.fit(df_pca1_norm)
    sq_loadings = np.sqrt(np.add(np.square(pca.components_[0]), np.square(pca.components_[1], np.square(pca.components_[2]))))


@app.route('/pca_loadings')
def pca_loadings():
    global squared_loadings
    df_pca = df[["NO2 Mean", "NO2 AQI", "O3 Mean", "O3 AQI", "SO2 Mean", "SO2 AQI", "CO Mean", "CO AQI"]]
    df_pca['O3 Mean'] = df_pca['O3 Mean'].apply(lambda x: x * 1000)
    df_pca['CO Mean'] = df_pca['CO Mean'].apply(lambda x: x * 1000)

    pca = PCA()
    # print(normalize(df_pca))
    # pca.fit(normalize(df_pca))

    min_max_scaler = preprocessing.MinMaxScaler()
    df_pca_norm = min_max_scaler.fit_transform(df_pca)
    pca.fit(df_pca_norm)
    squared_loadings = np.sqrt(np.add(np.square(pca.components_[0]), np.square(pca.components_[1], np.square(pca.components_[2]))))

    print("Hi-2:\n", squared_loadings)

    table = pd.DataFrame(np.append(np.array(df_pca.columns).reshape(8, 1), squared_loadings.reshape(8, 1), axis=1),
                 columns=["Attribute names", "Squared PCA loadings"])
    table = table.sort_values(by="Squared PCA loadings", ascending=False)
    table_html = table.to_html(classes=["table-bordered", "table-striped", "table-hover"])
    return table_html

@app.route('/get_mds')
def get_mds():
    mds = pd.read_csv("export_mds.csv")
    return mds.to_json(orient='columns')
    
# @app.route('/get_mds')
# def get_mds():
#     global imp_ftrs
#     global adaptive_samples
#     clustering()
#     adaptive_sampling()
#     input_data = adaptive_samples[ftrs]
#     mds_data = manifold.MDS(n_components=2, dissimilarity='precomputed')
#     similarity = pairwise_distances(input_data, metric='euclidean')
#     X = mds_data.fit_transform(similarity)
#     data_columns = pd.DataFrame(X)
#     for i in range(0, 3):
#         data_columns[ftrs[imp_ftrs[i]]] = data_csv_original[ftrs[imp_ftrs[i]]][:samplesize]
#
#     data_columns['clusterid'] = np.nan
#     x = 0
#     for index, row in adaptive_samples.iterrows():
#         data_columns['clusterid'][x] = row['kcluster']
#         x = x + 1
#     print("MDS:\n", data_columns)
#     return data_columns.to_json(orient='columns')

if __name__ == "__main__":
    app.run(debug=True)

