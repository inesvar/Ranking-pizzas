from flask import Flask, jsonify, render_template, request
from pizza_rank import PizzaRank
from stupidlogger import setLogLevel, LogLevels, debug

app = Flask(__name__, static_url_path="/static")
pizza_rank = PizzaRank()


@app.route("/")
def index():
    return render_template(
        "index.html", ingredients=pizza_rank.get_tagged_ingredients()
    )


@app.route("/receive_data", methods=["POST"])
def receive_data():
    data = request.json  # Assuming data is sent in JSON format
    debug("data", data, type(data))
    best_pizzas = pizza_rank.get_best_pizzas(data)
    result = {"status": "success", "message": best_pizzas}
    return jsonify(result)


if __name__ == "__main__":
    setLogLevel(LogLevels.DEBUG)
    app.run(debug=True)
