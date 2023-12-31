import numpy as np
from flask import Flask, render_template

known_ingredients = ["artichaut", "boeuf haché", "champignon", "chèvre",
                     "chorizo", "crème fraîche", "gorgonzola", "jambon",
                     "jambon de pays", "lardon", "merguez", "miel", "mozzarella", "oeuf",
                     "oignon", "oignon confit", "olive", "poivron",
                     "pomme de terre", "poulet", "reblochon", "roquette", "thon", "tomate"]

ingredient_tags = ["légume", "viande",
                   "poisson", "fromage", "calorie"]

tag_of_ingredient = {"artichaut": "légume", "boeuf haché": "viande", "champignon": "légume",
                     "chèvre": "fromage", "chorizo": "viande", "crème fraîche": "calorie",
                     "gorgonzola": "fromage", "jambon": "viande",
                     "jambon de pays": "viande", "lardon": "viande", "merguez": "viande", "miel": "calorie",
                     "mozzarella": "fromage", "oeuf": "calorie",
                     "oignon": "légume", "oignon confit": "légume", "olive": "légume",
                     "poivron": "légume",
                     "pomme de terre": "calorie", "poulet": "viande", "reblochon": "fromage",
                     "roquette": "légume", "thon": "poisson", "tomate": "légume"}

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def index():
    return render_template('index.html', ingredients=known_ingredients)


if __name__ == '__main__':
    app.run(debug=True)

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

        ingredients = [i.replace("s ", " ") for i in ingredients]
        pizzas.append(pizza(nom, ingredients))

    return pizzas


def main():
    pizzas = load_pizza_file()
    #  + [i.nom for i in pizza.tags["viande"]]
    scores = [pizza.get_score([], [], ["champignon", "oeuf", "lardon",
                              "artichaut", "olive", "poivron"], []) for pizza in pizzas]
    print("Scores : ", scores)
    ordre = np.argsort(scores)
    print("Ordre : ", ordre)
    ranked_pizzas = [pizzas[i] for i in ordre]
    [print(i) for i in ranked_pizzas]

    print(known_ingredients)
