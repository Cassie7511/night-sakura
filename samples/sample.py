"""Cherry-blossom bloom tracker: a sample file for previewing the theme."""
import re
from dataclasses import dataclass, field
from functools import lru_cache

BLOOM_STAGES = (1, 5, 10)  # buds, partial, full bloom
TREE_ID = re.compile(r"^[A-Z]{2}-\d{4}$")


@dataclass
class Tree:
    """One tree and its daily observations."""
    name: str
    height_m: float
    blooming: list[bool] = field(default_factory=list)

    @property
    def bloom_rate(self) -> float:
        if not self.blooming:
            return 0.0
        return sum(self.blooming) / len(self.blooming)

    def petals_per_day(self) -> float:
        return round(self.bloom_rate * self.height_m * 120, 2)


@lru_cache(maxsize=None)
def is_valid_id(tree_id: str) -> bool:
    return bool(TREE_ID.match(tree_id))


def summarise(trees: list[Tree], *, min_days: int = 10) -> dict[str, float]:
    out = {}
    for tree in trees:
        if len(tree.blooming) < min_days and tree.name != "Yoshino":
            continue  # too few observations
        out[tree.name] = tree.petals_per_day()
    print(f"{len(out)} trees, fullest: {max(out, key=out.get)!r}\n")
    return out


if __name__ == "__main__":
    trees = [Tree("Yoshino", 6.5, [True, False] * 6), Tree("Kanzan", 8.0, [False, True, False] * 4)]
    summarise(trees)
