# morgan là 1 thư viện để in ra các log của chúng ta khi 1 người dùng chạy 1 cái restrict
```js
const morgan = require('morgan'); 
```
Helmet

Helmet là package npm: gồm 14 middleware nhỏ ở trong giúp xử lý, lọc các HTTP header độc hại (nhằm khai thác lỗ hổng XSS hay clickjacking, …)
# tương tự với morgan là 1 middleware
# Sử dụng để bảo vệ các thông tin riêng tư của chúng ta, ngăn chặn các trang web đọc 
# cookie của chúng ta rất nhiều 
```js
const { default: helmet } = require('helmet');
```
# middleware có 5 chế độ
// Nó sẽ đi theo tiêu chuẩn apache, khi sử dụng production thì sử dụng mode này
// morgan('combined');
// Gần giống combined nhưng không biết được resource
// morgan('common');
// Là thông báo mặc định ngắn hơn bao gồm thời gian phản hồi mà thôi
// morgan('short');
// Chỉ bao gồm phương thức , status và thời gian phản hồi
// morgan('tiny');

# Vì sao nên dùng .env? Không dùng có sao không?
- Sử dụng env dễ dàng code hơn mà không ảnh hưởng đến người khác
- Có thể không cần file env cũng được, khi mà không cần phải giấu đi những thành phần bí mật
- File env dùng để lưu những mã db, hoặc những thông tin nhạy cảm
# Phân biệt env với config
Config
- Các tệp config được dùng để lưu những thông tin, những tệp cài đặt ở trong code
- Tệp config lưu được ở nhiều định dạng: json, xml,...
- Tệp config không được dùng để lưu những thông tin nhạy cảm
- Config dùng để kiểm soát, lưu trữ những cài đặt ứng dụng của chúng ta để kiểm soát được code và thông báo
Env
- Nếu ta muốn lưu trữ những thông tin nhạy cảm, thì nên sử dụng env