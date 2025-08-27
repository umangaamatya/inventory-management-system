"""
Composite Product
Calculates cost of composite products using recursive approach
"""

class CompositeProduct:
    def __init__(self, name, components):
        self.name = name
        self.components = components  # List of [product_id, quantity] or nested CompositeProducts
    
    def calculate_cost(self, inventory_manager):
        """Recursively calculate the cost of a composite product"""
        total_cost = 0.0
        
        for component in self.components:
            if isinstance(component, CompositeProduct):
                # Recursive case: component is another composite product
                total_cost += component.calculate_cost(inventory_manager)
            else:
                # Base case: component is a simple product [product_id, quantity]
                product_id, quantity = component
                product = inventory_manager.get_product_by_id(product_id)
                if product:
                    total_cost += product[2] * quantity
        
        return total_cost

def create_sample_composite():
    """Create a sample composite product for testing"""
    # Computer bundle: Laptop + Mouse + Keyboard
    components = [
        [1, 1],  # 1 Laptop
        [2, 1],  # 1 Mouse
        [3, 1]   # 1 Keyboard
    ]
    return CompositeProduct("Computer Bundle", components)