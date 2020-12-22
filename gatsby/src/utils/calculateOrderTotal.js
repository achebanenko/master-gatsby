import calculatePizzaPrice from './calculatePizzaPrice';

export default function calculateOrderTotal(order, pizzas) {
  return order.reduce((runningTotal, singleOrder) => {
    const singlePizza = pizzas.find((pizza) => pizza.id === singleOrder.id);
    return (
      runningTotal + calculatePizzaPrice(singlePizza.price, singleOrder.size)
    );
  }, 0);
}
