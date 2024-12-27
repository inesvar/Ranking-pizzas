from pizza import Pizza, RED, BOLD, RESET
from stupidlogger import debug, warn, info
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
        ingredient_occurences = {}
        for p in self.pizzas:
            for i in p.ingredients:
                if i in ingredient_occurences:
                    ingredient_occurences[i] += 1
                else:
                    ingredient_occurences[i] = 0
                if i in tagged_ingredients.keys():
                    self.tagged_ingredients[i] = tagged_ingredients[i]
                else:
                    warn("/!\ ", i, "n'est pas un ingrédient connu")
                    self.tagged_ingredients[i] = ""
        self.tagged_ingredients = dict(
            {
                k: self.tagged_ingredients[k]
                for (k, _) in sorted(
                    ingredient_occurences.items(), key=lambda item: -item[1]
                )
            }
        )

    def get_best_pizzas(
        self, ingredients_of_qualifier: dict[str, list[str]]
    ) -> list[tuple[str, str]]:
        self.qualifier_of_ingredient = {
            ingredient: qualifier
            for qualifier, ingredients in ingredients_of_qualifier.items()
            if qualifier != "4"
            for ingredient in ingredients
        }
        info("qualifiers of ingredients", self.qualifier_of_ingredient)
        negative_scores = [
            -pizza.get_score(self.qualifier_of_ingredient) for pizza in self.pizzas
        ]
        descending_order = np.argsort(negative_scores)
        self.ranking = [self.pizzas[i].to_string() for i in descending_order]

        [debug(i[0], end=" ") for i in self.ranking]
        debug("\n\n\n")
        return self.ranking

    def get_tagged_ingredients(self) -> dict[str, str]:
        return self.tagged_ingredients
