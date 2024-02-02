// apikey sử dụng để lưu trữ token từ ngày này quá tháng nọ
`usse strict`

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    // Đây là key sẽ gen ra
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: String,
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: [String],
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// define product type = Clothing

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String
}, {
    collection: 'electornics',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('clothes', clothingSchema),
    electronic: model('electronics', electronicSchema)
}
