from flask import Flask, jsonify, render_template, request
from pizza_rank import PizzaRank
from stupidlogger import setLogLevel, LogLevels, debug
import json

app = Flask(__name__, static_url_path="/static")
pizza_rank = PizzaRank()


@app.route("/")
def index():
    return render_template(
        "index.html", ingredients=pizza_rank.get_tagged_ingredients()
    )


@app.route("/receive_data", methods=["POST"])
def receive_data():
    data = request.json
    debug("Received data:", data, type(data))
    best_pizzas = pizza_rank.get_best_pizzas(data)
    result = {"status": "success", "message": best_pizzas}
    return jsonify(result)


@app.route("/save_file", methods=["POST"])
def save_file():
    data = request.json
    debug(f"Saving to file {data["filename"]}:", data["content"])
    with open("static/dumps/" + data["filename"], "w", encoding="utf-8") as f:
        json.dump(data["content"], f)
    result = {"status": "success"}
    return jsonify(result)


if __name__ == "__main__":
    setLogLevel(LogLevels.INFO)
    app.run(debug=True)
