from enum import Enum

BLUE = "\033[94m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
ORANGE = "\033[38;5;172m"
RED = "\033[91m"
BOLD = "\033[1m"
UNDERLINE = "\033[4m"
RESET = "\033[0m"


class IngredientQualifier(Enum):
    WITHOUT = "0"
    BAD = "1"
    GOOD = "2"
    WITH = "3"

    def get_print_color(self) -> str:
        match (self):
            case IngredientQualifier.WITH | IngredientQualifier.GOOD:
                return GREEN
            case IngredientQualifier.BAD:
                return ORANGE
            case IngredientQualifier.WITHOUT:
                return RED

    def get_score(self) -> int:
        match (self):
            case IngredientQualifier.WITH:
                return 1000
            case IngredientQualifier.GOOD:
                return 1
            case IngredientQualifier.BAD:
                return -1
            case IngredientQualifier.WITHOUT:
                return -1000


class Pizza:
    def __init__(self, name: str, ingredients: list[str]):
        self.name = name
        self.ingredients = ingredients

    def to_string(self) -> str:
        return (self.name, ", ".join(self.ingredients))

    def contains(self, name: str) -> bool:
        return name in self.ingredients

    def get_score(self, qualifier_of_ingredient: dict[str, str]) -> int:
        score = 0
        print(self.name, end=":")
        for i in self.ingredients:
            if i not in qualifier_of_ingredient:
                continue
            ingredient_qualifier = IngredientQualifier(qualifier_of_ingredient[i])
            score += ingredient_qualifier.get_score()
            print(ingredient_qualifier.get_print_color() + i + RESET, end=" ")
        print()

        return score
