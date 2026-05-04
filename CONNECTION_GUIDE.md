# Pet Care App - Connection Guide

This guide explains how to connect your **Razorpay Payment Gateway** and your **Database**.

---

## 💳 Razorpay Payment Integration

To use Razorpay, you need to provide your API keys in two places.

### 1. Backend Configuration
Open `backend/.env` and update these lines with your keys from the Razorpay Dashboard:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 2. Frontend Configuration
Open `frontend/.env` and update this line:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### How it works:
- When a user clicks "Pay", the **Frontend** uses `VITE_RAZORPAY_KEY_ID` to open the Razorpay modal.
- Once payment is done, the **Backend** uses `RAZORPAY_KEY_SECRET` to securely verify the payment signature.

---

## 🗄️ Database Connection

The application is currently configured to use **SQLite**, which is a file-based database. This is the easiest way to run the app locally as it requires zero setup.

### Current Settings
- **Location**: `backend/data/petcare.db`
- **Configuration**: `backend/src/config/database.js`

### Switching to MySQL (Optional)
If you want to use MySQL instead:
1. Open `backend/src/config/database.js`.
2. Change the `dialect` to `mysql`.
3. Update the connection options (host, port, username, password).
4. Install the mysql2 driver: `npm install mysql2`.

---

## 🔍 Verifying Connections

### Test Database
You can run the included test script to verify your database is responding:
```powershell
cd backend
node db-test.js
```

### Test Razorpay
1. Start the app.
2. Go to the **Appointments** section.
3. Try to book an appointment.
4. If the Razorpay modal pops up, your **Frontend Key ID** is connected!
5. If the payment completes and shows "Success" on the dashboard, your **Backend Key Secret** is also connected!

---

> [!TIP]
> Always restart your backend server (`npm start`) after changing any `.env` files for the changes to take effect.
