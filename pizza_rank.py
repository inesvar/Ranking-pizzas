from pizza import Pizza, RED, BOLD, RESET
import numpy as np
from json import load


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
    def __init__(
        self,
        pizzas_info_filename="pizzas.txt",
        parse_pizza_info=default_pizza_parser,
        ingredients_info_filename="ingredients.json",
    ):
        self.pizzas = []
        with open(pizzas_info_filename) as pizzas_file:
            pizza = parse_pizza_info(pizzas_file)
            while pizza:
                self.pizzas.append(pizza)
                pizza = parse_pizza_info(pizzas_file)
        self.ranking = map(lambda pizza: pizza.to_string(), self.pizzas)
        self.qualifier_of_ingredient = {}
        self.tagged_ingredients = {}
        with open(ingredients_info_filename) as ingredients_file:
            tagged_ingredients = load(ingredients_file)
        for p in self.pizzas:
            for i in p.ingredients:
                if i in tagged_ingredients.keys():
                    self.tagged_ingredients[i] = tagged_ingredients[i]
                else:
                    print(
                        RED + BOLD + "/!\ ",
                        i,
                        "n'est pas un ingrédient connu" + RESET,
                    )
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

        [print(i[0], end=" ") for i in self.ranking]
        print("\n\n\n")
        return self.ranking

    def get_tagged_ingredients(self) -> dict[str, str]:
        return self.tagged_ingredients
