const RedisPubSubService = require('../services/redisPubSub.service')
 
class ProductServiceTest {
    purchaseProduct(productId, quantity) {
        const order = {
            productId, quantity
        }
        console.log(`Test publish::: ${productId} with quantity: ${quantity}`);
        RedisPubSubService.publish('purchase_events', JSON.stringify(order));
    }
}

module.exports = new ProductServiceTest();