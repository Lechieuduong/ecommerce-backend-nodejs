// apikey sử dụng để lưu trữ token từ ngày này quá tháng nọ
`usse strict`

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';

const apiKeySchema = new Schema({
    // Đây là key sẽ gen ra
    key: {
        type: String,
        required: true,
        unique: true
    },
    // Đây là trạng thái của key có hoạt động hay không
    status: {
        type: Boolean,
        default: true
    },
    // 
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, apiKeySchema);
