 <h1 align="center">Hi 👋, I'm Mob</h1>
<h3 align="center">Join the Cryptocurrency Market, make money from Airdrop - Retroactive with me</h3>

- <p align="left"> <img src="https://komarev.com/ghpvc/?username=mobonchain&label=Profile%20views&color=0e75b6&style=flat" alt="mobonchain" /> <a href="https://github.com/mobonchain"> <img src="https://img.shields.io/github/followers/mobonchain?label=Follow&style=social" alt="Follow" /> </a> </p>

- [![TopAME | Bullish - Cheerful](https://img.shields.io/badge/TopAME%20|%20Bullish-Cheerful-blue?logo=telegram&style=flat)](https://t.me/xTopAME)

# Hướng Dẫn Cài Đặt Auto Mint NFT ED3 - Farm Points
- **Chức năng:** Auto Mint NFT ( ID 1 - 4 ) trên ED3 và Upload data nhận Points

---

## Yêu cầu

- Ví có sẵn **$EDU** mạng **EDU Chain** làm fee
- Đăng ký **[ED3](https://t.me/xTopAME/2119)**
  -  Làm hết tất cả hướng dẫn trong bài đăng
  -  F12 lên vào Console gõ `localStorage.getItem('token');` lấy token
  -  Trường hợp **không hiện token** thì vào mint NFT rồi F12 lấy lại token
- **Cài Node.js nếu chưa có ( Windows ): https://t.me/ToolboxforAirdrop/4**

---

## Cấu Trúc File Dữ Liệu

1. **proxy.txt**:
   - Mỗi dòng chứa một proxy theo định dạng:
     ```
     https://username1:pass@host:port
     https://username2:pass@host:port
     ```

2. **wallet.txt**:
   - Mỗi dòng chứa một private key của ví Ethereum (không cần kèm địa chỉ ví).
   - Định dạng:
     ```
     PrivateKey1
     PrivateKey2
     ```

3. **token.txt**:
   - Mỗi dòng chứa một token theo định dạng:
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6Ik............
     eyJhbGciOiJIUzI1NiIsInR5cCI6Ik............
     ```

---

## Cài Đặt Trên Windows

### Bước 1: Tải và Giải Nén File

1. Nhấn vào nút **<> Code"** màu xanh lá cây, sau đó chọn **Download ZIP**.
2. Giải nén file ZIP vào thư mục mà bạn muốn lưu trữ.

### Bước 2: Cấu Hình Proxy, Wallet và Token

1. Mở file `proxy.txt` và nhâp vào danh sách `Proxy` theo cấu trúc dữ liệu phía trên
2. Mở file `wallet.txt` và nhập vào `Private Key` của các ví Ethereum bạn muốn sử dụng
3. Mở file `token.txt` và nhập vào `Token` đã lấy được theo cấu trúc dữ liệu phía trên

### Bước 3: Cài Đặt Module

1. Mở **Command Prompt (CMD)** hoặc **PowerShell** trong thư mục chứa mã nguồn.
2. Cài đặt các module yêu cầu bằng lệnh:
   ```bash
   npm install
   ```

### Bước 4: Chạy Tool

1. Chạy chương trình bằng lệnh:
   ```bash
   node main.js
   ```
2. Tool sẽ bắt đầu xử lý các ví và proxy theo thứ tự.

---

## Cài Đặt Trên Linux (VPS)

### Bước 1: Tạo Phiên `screen`

1. Đăng nhập vào VPS của bạn qua SSH.

2. Tạo một phiên `screen` mới để chạy công cụ **ED3** mà không bị gián đoạn khi bạn rời khỏi terminal:

   ```bash
   screen -S ED3
   ```

### Bước 2: Git Clone Dự Án

   ```bash
   git clone https://github.com/mobonchain/ED3.git
   cd ED3
   ```

### Bước 3: Cài Đặt Node.js và NPM

1. Kiểm tra xem Node.js và npm đã được cài đặt chưa:

   ```bash
   node -v
   npm -v
   ```

   Nếu chưa cài đặt, bạn có thể cài Node.js và npm bằng các lệnh sau (cho **Ubuntu/Debian**):

   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

   Đối với các hệ điều hành khác, hãy tham khảo tài liệu chính thức của **[Node.js](https://nodejs.org/en/)**.

### Bước 4: Cài Đặt Các Module

1. Sau khi clone về, chạy lệnh sau để cài đặt các module yêu cầu:

   ```bash
   npm install
   ```

### Bước 5: Cấu Hình Proxy, Wallet và Token

1. Mở file `proxy.txt` và nhâp vào danh sách `Proxy` theo cấu trúc dữ liệu phía trên
```bash
   nano proxy.txt
```
2. Mở file `wallet.txt` và nhập vào `Private Key` của các ví Ethereum bạn muốn sử dụng
```bash
   nano wallet.txt
```
3. Mở file `token.txt` và nhập vào `Token` đã lấy được theo cấu trúc dữ liệu phía trên
```bash
   nano token.txt
```

3. Lưu file bằng tổ hợp phím **Ctrl + O**, sau đó thoát bằng **Ctrl + X**

### Bước 6: Chạy Ứng Dụng

1. Sau khi cài đặt xong các module và cấu hình, chạy ứng dụng bằng lệnh:

   ```bash
   node main.js
   ```

### Bước 8: Để Ứng Dụng Chạy Tiếp Tục Sau Khi Đăng Xuất

Khi bạn muốn để ứng dụng chạy trong nền và không bị gián đoạn khi đăng xuất khỏi phiên SSH, bạn có thể tách khỏi phiên `screen` bằng cách nhấn `Ctrl + A` rồi nhấn `D`.

Để quay lại phiên `screen` đã tạo, bạn chỉ cần chạy lệnh:

```bash
screen -r ED3
```

---

## Nếu gặp phải bất kỳ vấn đề nào có thể hỏi thêm tại **[TopAME | Chat - Supports](https://t.me/yTopAME)**
