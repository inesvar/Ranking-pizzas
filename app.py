from flask import Flask, jsonify, render_template, request
from ingredients import tag_of_ingredient
from pizza import compute_best_pizzas

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def index():
    return render_template('index.html', ingredients=tag_of_ingredient)


@app.route('/receive_data', methods=['POST'])
def receive_data():
    data = request.json  # Assuming data is sent in JSON format
    print("data", data)
    best_pizzas = compute_best_pizzas(data["3"], data["2"], data["1"], data["0"])
    result = {'status': 'success', 'message': best_pizzas}
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
