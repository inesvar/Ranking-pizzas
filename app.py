import numpy as np
from flask import Flask, jsonify, render_template, request

known_ingredients = ["artichaut", "boeuf haché", "champignon", "chèvre",
                     "chorizo", "crème fraîche", "gorgonzola", "jambon",
                     "jambon de pays",
                     "jambon de parme", "lardon", "merguez", "miel", "mozzarella", "œuf",
                     "oignon", "oignon confit", "olive", "poivron",
                     "pomme de terre", "poulet", "reblochon", "roquette", "thon", "tomate",
                     "fromage", "viande hachée", "jambon blanc", "bacon", "basilic frais",
                     "persillade", "épinards", "poireaux", "carotte", "ciboulette", "dés de tomate",
                     "base sauce tomate", "anchois", "tomate fraîche", "câpres", "salade verte", "kebab",
                     "gésiers", "magret", "courgette", "poivron", "origan", "asperge", "camembert",
                     "base crème fraîche", "ananas", "andouille", "rillaud", "salade",
                     "base crème moutardée", "crevette", "sauce kebab", "aneth",
                     "viande kebab", "base crème", "coppa", "fenouil", "cocktail de fruits de mer",
                     "saumon fumé", "parmesan", "sauce marocaine", "sauce barbecue", "raclette",
                     "fromage de chèvre", "poireau", "saint-jacques", "taleggio"]

ingredient_tags = ["légume", "viande",
                   "poisson", "fromage", "calorie", "assaisonnement"]

tag_of_ingredient = {"artichaut": "légume", "boeuf haché": "viande", "champignon": "légume",
                     "chèvre": "fromage", "chorizo": "viande", "crème fraîche": "calorie",
                     "gorgonzola": "fromage", "jambon": "viande",
                     "jambon de pays": "viande",
                     "jambon de parme": "viande", "lardon": "viande", "merguez": "viande", "miel": "calorie",
                     "mozzarella": "fromage", "œuf": "calorie",
                     "oignon": "légume", "oignon confit": "légume", "olive": "légume",
                     "poivron": "légume",
                     "pomme de terre": "calorie", "poulet": "viande", "reblochon": "fromage",
                     "roquette": "légume", "thon": "poisson", "tomate": "légume", "fromage": "calorie",
                     "viande hachée": "viande", "jambon blanc": "viande", "bacon": "viande",
                     "basilic frais": "assaisonnement", "persillade": "assaisonnement", "épinards": "légume",
                     "poireaux": "légume", "carotte": "légume", "ciboulette": "assaisonnement",
                     "dés de tomate": "légume", "base sauce tomate": "légume", "anchois": "poisson",
                     "tomate fraîche": "légume", "salade verte": "légume", "kebab": "viande", "câpres": "assaisonnement",
                     "gésiers": "légume", "magret": "légume", "courgette": "légume", "poivron": "légume",
                     "origan": "assaisonnement", "asperge": "légume", "camembert": "fromage",
                     "base crème fraîche": "assaisonnement", "ananas": "assaisonnement", "salade": "légume",
                     "rillaud": "viande", "andouille": "viande", "base crème moutardée": "assaisonnement",
                     "crevette": "poisson", "sauce kebab": "assaisonnement", "aneth": "assaisonnement",
                     "viande kebab": "viande", "coppa": "viande", "base crème": "assaisonnement",
                     "fenouil": "légume", "cocktail de fruits de mer": "poisson", "saumon fumé": "poisson",
                     "parmesan": "fromage", "sauce marocaine": "assaisonnement", "sauce barbecue": "assaisonnement",
                     "raclette": "calorie", "poireau": "légume", "saint-jacques": "poisson",
                     "fromage de chèvre": "fromage", "taleggio": "fromage"
                     }

# PRINT
BLEU = '\033[94m'
VERT = '\033[92m'
JAUNE = '\033[93m'
ORANGE = '\033[38;5;172m'
ROUGE = '\033[91m'
GRAS = '\033[1m'
SOULIGNE = '\033[4m'
FIN = '\033[0m'
PAS_COULEUR = '\x1b[0m'

# CATEGORIES
AVEC = 0
BIEN = 1
PAS_BIEN = 2
SANS = 3


def est_ingredient_connu(nom):
    if nom in known_ingredients:
        return True, nom
    elif nom[:-1] in known_ingredients:
        return True, nom[:-1]
    else:
        print("/!\ ", nom, "n'est pas un ingredient connu")
        return False, nom


class ingredient:
    def __init__(self, nom):
        self.nom = nom
        self.couleur = PAS_COULEUR

    def categorise(self, categorie):
        if categorie == AVEC or categorie == BIEN:
            self.couleur = VERT
        elif categorie == SANS:
            self.couleur == ROUGE
        else:
            self.couleur = ORANGE

    def __str__(self):
        return self.couleur + self.nom + PAS_COULEUR

    def to_string(self):
        return self.nom


class pizza:
    def __init__(self, nom, ingredients):
        self.nom = nom
        self.score = [0, 0]
        self.ingredients = []
        self.tags = {tag: [] for tag in ingredient_tags}
        for i in ingredients:
            ok, i2 = est_ingredient_connu(i)
            if ok:
                i3 = ingredient(i2)
                self.ingredients.append(i3)
                self.tags[tag_of_ingredient[i2]].append(i3)
            else:
                i3 = ingredient(i2)
                self.ingredients.append(i3)
                if not self.tags.keys().__contains__("autre"):
                    self.tags["autre"] = [i3]
                else:
                    self.tags["autre"].append(i3)

    def __str__(self):
        string = "Pizza : " + SOULIGNE + self.nom + FIN + "\n"

        for tag in self.tags.keys():
            if self.tags[tag]:
                string += "#" + tag + " : "
                string += ", ".join([ingredient.__str__()
                                    for ingredient in self.tags[tag]])
                string += "     "
        return string + "\n"

    def to_string(self):
        return [self.nom, " ".join([ingredient.to_string()
                                    for ingredient in self.ingredients])]

    def contient(self, nom):
        for i in self.ingredients:
            if i.nom == nom:
                return i
        return None

    def get_score(self, oui, bien, pas_bien, non):
        for i in oui:
            i2 = self.contient(i)
            if i2:
                self.score[0] += 1
                i2.categorise(AVEC)

        for i in non:
            i2 = self.contient(i)
            if i2:
                self.score[0] -= 1
                i2.categorise(SANS)

        for i in bien:
            i2 = self.contient(i)
            if i2:
                self.score[1] += 1
                i2.categorise(BIEN)

        for i in pas_bien:
            i2 = self.contient(i)
            if i2:
                self.score[1] -= 1
                i2.categorise(PAS_BIEN)

        return self.score[0] * 1000 + self.score[1]


def load_pizza_file():
    pizzas = []
    file = open("pizzas.txt")
    while True:
        nom = file.readline().strip().lower()
        if nom == "":
            break
        file.readline()
        ingredients = file.readline().strip().lower().split(", ")
        file.readline()
        file.readline()
        file.readline()
        file.readline()

        pizzas.append(pizza(nom, ingredients))

    return pizzas


def main():
    pass


def compute(miam, bon, pabon, beurk):
    pizzas = load_pizza_file()
    scores = [pizza.get_score(miam, bon, pabon, beurk) for pizza in pizzas]
    ordre = np.argsort(scores)[::-1]
    ranked_pizzas = [pizzas[i].to_string()
                     for i in ordre]

    [print(i) for i in ranked_pizzas]
    return ranked_pizzas[:7]


app = Flask(__name__, static_url_path='/static')


@app.route('/')
def index():
    return render_template('index.html', ingredients=tag_of_ingredient)


@app.route('/receive_data', methods=['POST'])
def receive_data():
    data = request.json  # Assuming data is sent in JSON format
    print("data", data)
    best_pizzas = compute(data["3"], data["2"], data["1"], data["0"])
    result = {'status': 'success', 'message': best_pizzas}
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
