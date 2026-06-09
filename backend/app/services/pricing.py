from app.config import BASE_PRICES, BULK_DISCOUNT_TIERS


def get_bulk_discount(quantity: int) -> float:
    """Get discount percentage based on quantity tier."""
    for tier in BULK_DISCOUNT_TIERS:
        if tier["max_qty"] is None and quantity >= tier["min_qty"]:
            return tier["discount"]
        elif tier["max_qty"] and tier["min_qty"] <= quantity <= tier["max_qty"]:
            return tier["discount"]
    return 0.0


def calculate_price(bottle_size: str, quantity: int) -> dict:
    """Calculate total price with bulk discount."""
    base_price = BASE_PRICES.get(bottle_size, 20.0)
    discount = get_bulk_discount(quantity)
    unit_price = round(base_price * (1 - discount), 2)
    total_price = round(unit_price * quantity, 2)

    return {
        "bottle_size": bottle_size,
        "quantity": quantity,
        "base_price": base_price,
        "discount_percent": discount * 100,
        "unit_price": unit_price,
        "total_price": total_price,
    }
