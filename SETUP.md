# EventHub - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### 1. Database Setup
```bash
# Start MySQL
sudo systemctl start mysql

# Create database and tables
mysql -u root -p < database/schema.sql
```

### 2. Configure Database (Optional)
If your MySQL password is not "root", edit:
```
src/main/java/com/eventhub/util/DatabaseConnection.java
```
Change line 9:
```java
private static final String PASSWORD = "your_mysql_password";
```

### 3. Build Application
```bash
mvn clean package
```

### 4. Deploy to Tomcat 9
```bash
# Copy WAR file
cp target/eventhub.war /path/to/tomcat/webapps/

# Start Tomcat
/path/to/tomcat/bin/startup.sh
```

### 5. Access Application
Open browser:
```
http://localhost:8080/eventhub/
```

## ✅ Verify Installation

1. **Check Database:**
   ```bash
   mysql -u root -p -e "USE eventhub_db; SELECT COUNT(*) FROM events;"
   ```
   Should show: 8 events

2. **Check API:**
   ```bash
   curl http://localhost:8080/eventhub/api/events
   ```
   Should return JSON array of events

3. **Test Frontend:**
   - Open http://localhost:8080/eventhub/
   - Events should load automatically
   - Try filtering by category
   - Click "Register Now" on any event
   - Fill form and submit

## 📧 EmailJS Setup (Contact Form)

1. Go to https://www.emailjs.com/ and sign up
2. Create email service (Gmail/Outlook)
3. Create email template with variables:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{message}}`
4. Get your:
   - Public Key
   - Service ID
   - Template ID
5. Add to `src/main/webapp/index.html` before `</body>`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   <script>
     emailjs.init('YOUR_PUBLIC_KEY');
   </script>
   ```
6. Uncomment EmailJS code in `src/main/webapp/script.js` (line ~385)
7. Replace:
   - `YOUR_SERVICE_ID`
   - `YOUR_TEMPLATE_ID`

## 🔍 Common Issues

**MySQL Connection Failed:**
```bash
# Check MySQL is running
systemctl status mysql

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

**Tomcat Not Starting:**
```bash
# Check Tomcat logs
tail -f /path/to/tomcat/logs/catalina.out
```

**Events Not Loading:**
- Open browser console (F12)
- Check for API errors
- Verify URL: http://localhost:8080/eventhub/api/events

## 📁 Project Structure
```
eventhub/
├── src/main/
│   ├── java/com/eventhub/     # Backend code
│   └── webapp/                # Frontend files
├── database/schema.sql        # Database setup
├── pom.xml                    # Maven config
└── target/eventhub.war       # Built application
```

## 🎯 What's Working

✅ Event browsing with filters
✅ Real-time seat availability
✅ Event registration with validation
✅ MySQL database integration
✅ Responsive design
✅ Dark/Light theme
✅ Registration success notifications

## 📝 What to Configure

⏳ EmailJS for contact form (placeholder ready)
⏳ Production database credentials
⏳ Email notifications for registrations (optional)

## 🆘 Need Help?

Check the full README.md for detailed documentation!
