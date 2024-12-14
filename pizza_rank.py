from pizza import Pizza, RED, BOLD, RESET
from ingredients import tagged_ingredients
import numpy as np


def is_known_ingredient(name: str) -> bool:
    if name in tagged_ingredients.keys():
        return True
    else:
        print(
            RED + BOLD + "/!\ ",
            name,
            "n'est pas un ingrédient connu" + RESET,
        )
        return False


def default_pizza_parser(file) -> Pizza:
    nom = file.readline().strip().lower()
    if nom == "":
        return None
    file.readline()
    ingredients = file.readline().strip().lower().split(", ")
    file.readline()
    file.readline()  # price here
    file.readline()
    file.readline()

    return Pizza(nom, ingredients)


class PizzaRank:
    def __init__(self, filename="pizzas.txt", parse_pizza_info=default_pizza_parser):
        self.pizzas = []
        with open(filename) as file:
            pizza = parse_pizza_info(file)
            while pizza:
                self.pizzas.append(pizza)
                pizza = parse_pizza_info(file)
        self.ranking = map(lambda pizza: pizza.to_string(), self.pizzas)
        self.qualifier_of_ingredient = {}
        self.tagged_ingredients = {}
        for p in self.pizzas:
            for i in p.ingredients:
                if is_known_ingredient(i):
                    self.tagged_ingredients[i] = tagged_ingredients[i]
                else:
                    self.tagged_ingredients[i] = "inconnu"

    def get_best_pizzas(
        self, ingredients_of_qualifier: dict[str, list[str]]
    ) -> list[tuple[str, str]]:
        self.qualifier_of_ingredient = {
            ingredient: qualifier
            for qualifier, ingredients in ingredients_of_qualifier.items()
            if qualifier != "4"
            for ingredient in ingredients
        }
        print("qualifiers of ingredients", self.qualifier_of_ingredient)
        scores = [
            pizza.get_score(self.qualifier_of_ingredient) for pizza in self.pizzas
        ]
        order = np.argsort(scores)[::-1]
        self.ranking = [self.pizzas[i].to_string() for i in order]

        [print(i) for i in self.ranking]
        return self.ranking

    def get_tagged_ingredients(self) -> dict[str, str]:
        return self.tagged_ingredients
