# 🔐 Login Guide - City Linkers

## ✅ Login is Now Fixed!

The application is now configured to work **without backend** using mock authentication.

## 🌐 Access the Application

1. **Open your browser**
2. **Go to:** `http://localhost:5173`
3. **You should see:** Welcome page with portal selection

## 👤 User Portal Login

### Step 1: Select User Portal
Click on the **"User Portal"** card on the welcome page.

### Step 2: Sign In
Use these credentials:

**Option 1 - Email:**
```
Email: john@example.com
Password: password123
```

**Option 2 - Email:**
```
Email: jane@example.com
Password: password123
```

**Option 3 - Phone:**
```
Phone: +919876543211
Password: password123
```

### Step 3: Or Sign Up
Click **"Sign Up"** button and create a new account:
- Enter your name
- Enter email or phone
- Create a password
- Click "Sign Up"

## 🔐 Admin Portal Login

### Step 1: Select Admin Portal
Click on the **"Admin Portal"** card on the welcome page.

### Step 2: Sign In
Use these credentials:

**Option 1 - Email:**
```
Email: admin@citylinkers.com
Password: admin123
```

**Option 2 - Phone:**
```
Phone: +919876543210
Password: admin123
```

## 🐛 If Login Still Doesn't Work

### 1. Clear Browser Cache
- **Chrome/Edge**: Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- **Firefox**: Press `Ctrl+Shift+Delete`
- **Safari**: Press `Cmd+Option+E`

### 2. Hard Refresh the Page
- **Windows**: `Ctrl+Shift+R` or `Ctrl+F5`
- **Mac**: `Cmd+Shift+R`

### 3. Check Browser Console
1. Press `F12` to open Developer Tools
2. Click on **Console** tab
3. Look for any red error messages
4. Share the errors if you see any

### 4. Verify Server is Running
Open a new terminal and check:
```bash
lsof -i :5173
```

Should show Python server running.

### 5. Try Different Browser
- Chrome
- Firefox
- Safari
- Edge

## 📝 What Happens After Login

### User Portal:
After successful login, you'll be redirected to:
- **Home Page** (`#/home`)
- Can access: Live Tracking, E-Ticketing
- Can view routes and buses
- Can purchase tickets (mock)

### Admin Portal:
After successful login, you'll be redirected to:
- **Dashboard** (`#/dashboard`)
- Can view analytics
- Can see all tickets
- Can view feedback

## 🔄 How to Logout

Click the **"Logout"** button in the top navigation bar.

## ⚙️ Current Configuration

The app is running in **MOCK MODE**:
- ✅ No backend required
- ✅ No database required
- ✅ No blockchain required
- ✅ All data is simulated
- ✅ Login works with predefined users

## 🚀 To Enable Backend (Optional)

If you want real authentication with database:

1. **Setup PostgreSQL** (see QUICK_START.md)
2. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
3. **Update Configuration**:
   - Edit `js/pages/userLogin.js`
   - Change `const USE_BACKEND = false` to `true`
   - Edit `js/pages/adminLogin.js`
   - Change `const USE_BACKEND = false` to `true`

## 📊 Test Checklist

- [ ] Server running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can see welcome page
- [ ] Can click "User Portal"
- [ ] Can see login form
- [ ] Can enter credentials
- [ ] Can click "Sign In"
- [ ] Gets redirected to home page
- [ ] Can see navigation menu
- [ ] Can logout

## 🎯 Quick Test

1. Open: `http://localhost:5173`
2. Click: **User Portal**
3. Enter: `john@example.com`
4. Password: `password123`
5. Click: **Sign In**
6. ✅ Should redirect to Home page

## 📞 Still Having Issues?

If login still doesn't work:

1. **Restart the server:**
   ```bash
   # Press Ctrl+C in terminal
   # Then restart:
   python3 -m http.server 5173
   ```

2. **Check file exists:**
   ```bash
   ls -la js/pages/userLogin.js
   ls -la js/pages/adminLogin.js
   ```

3. **View server logs:**
   Check the terminal where Python server is running for any errors.

4. **Test with curl:**
   ```bash
   curl http://localhost:5173
   ```

## ✅ Success Indicators

When login works, you should see:
- ✅ Toast notification: "Welcome John Doe!" (or your name)
- ✅ URL changes to `#/home` or `#/dashboard`
- ✅ Navigation menu appears
- ✅ Logout button visible
- ✅ User-specific content loads

---

**Your login should now work! Try it at: http://localhost:5173** 🎉
