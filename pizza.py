from ingredients import *
import numpy as np

# PRINT
BLEU = "\033[94m"
VERT = "\033[92m"
JAUNE = "\033[93m"
ORANGE = "\033[38;5;172m"
ROUGE = "\033[91m"
GRAS = "\033[1m"
SOULIGNE = "\033[4m"
FIN = "\033[0m"
PAS_COULEUR = "\x1b[0m"

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
        print(ROUGE + GRAS + "/!\ ", nom, "n'est pas un ingredient connu" + FIN)
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
                string += ", ".join(
                    [ingredient.__str__() for ingredient in self.tags[tag]]
                )
                string += "     "
        return string + "\n"

    def to_string(self):
        return [
            self.nom,
            " ".join([ingredient.to_string() for ingredient in self.ingredients]),
        ]

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


def compute_best_pizzas(miam, bon, pabon, beurk):
    pizzas = load_pizza_file()
    scores = [pizza.get_score(miam, bon, pabon, beurk) for pizza in pizzas]
    ordre = np.argsort(scores)[::-1]
    ranked_pizzas = [pizzas[i].to_string() for i in ordre]

    [print(i) for i in ranked_pizzas]
    return ranked_pizzas[:7]
