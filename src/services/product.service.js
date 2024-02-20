`use strict`
const { product, clothing, electronic, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');

// define factory class to create product

class ProductFactory {
    /**
     * type: 'Clothing'
     * payload 
     */
    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronics':
                return new Electronics(payload);
            case 'Clothing':
                return new Clothing(payload).createProduct();
            case 'Furniture':
                return new Furniture(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }
}

// define basic product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct(product_id) {
        return await product.create({...this, _id: product_id})
    }
}

class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError('Create new Clothing error');

        const newProduct  = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new product error');
    } 
}

class Electronics extends Product {
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw new BadRequestError('Create new Electronic error');

        const newProduct  = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new product error');

        return newProduct;
    } 
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newFurniture) throw new BadRequestError('Create new Furniture error');

        const newProduct  = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new product error');

        return newProduct;
    }
}

module.exports = ProductFactory