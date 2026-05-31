# EventHub - Event Registration System

A modern event registration web application built with Java Servlets, JSP, JDBC, and MySQL for Tomcat 9 deployment.

## Features

- 🎯 Event browsing with category filters (Tech, Cultural, Sports, Workshop)
- ✅ Real-time event registration with seat management
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- 💾 MySQL database integration
- 🎨 Modern UI with gradient backgrounds and animations
- 📧 EmailJS integration ready for contact form

## Tech Stack

### Backend
- **Java 11+**
- **Servlets** (Java EE)
- **JDBC** for database connectivity
- **MySQL 8.0+** database
- **Gson** for JSON processing
- **Apache Tomcat 9**

### Frontend
- **HTML5** with semantic markup
- **CSS3** with custom properties
- **Vanilla JavaScript** (ES6+)
- **Bootstrap**-inspired responsive grid

## Project Structure

```
eventhub/
├── src/
│   └── main/
│       ├── java/com/eventhub/
│       │   ├── servlets/
│       │   │   ├── EventsServlet.java      # GET /api/events
│       │   │   └── RegisterServlet.java    # POST /api/register
│       │   ├── dao/
│       │   │   ├── EventDAO.java           # Event database operations
│       │   │   └── RegistrationDAO.java    # Registration database operations
│       │   ├── models/
│       │   │   ├── Event.java              # Event model
│       │   │   └── Registration.java       # Registration model
│       │   └── util/
│       │       └── DatabaseConnection.java # JDBC connection utility
│       └── webapp/
│           ├── WEB-INF/
│           │   └── web.xml                 # Servlet mappings
│           ├── index.html                  # Main HTML file
│           ├── style.css                   # Styles
│           └── script.js                   # Frontend logic
├── database/
│   └── schema.sql                          # Database schema & sample data
├── pom.xml                                 # Maven configuration
└── README.md
```

## Setup Instructions

### Prerequisites
- Java JDK 11 or higher
- Apache Tomcat 9
- MySQL 8.0 or higher
- Maven 3.6+

### Step 1: Database Setup

1. Start MySQL server:
   ```bash
   # On Linux/Mac
   sudo systemctl start mysql
   
   # On Windows
   net start MySQL80
   ```

2. Login to MySQL:
   ```bash
   mysql -u root -p
   ```

3. Run the schema file:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

   Or from MySQL prompt:
   ```sql
   source /path/to/database/schema.sql;
   ```

4. Verify database creation:
   ```sql
   USE eventhub_db;
   SHOW TABLES;
   SELECT * FROM events;
   ```

### Step 2: Configure Database Connection

Edit `src/main/java/com/eventhub/util/DatabaseConnection.java` if needed:

```java
private static final String URL = "jdbc:mysql://localhost:3306/eventhub_db?useSSL=false&serverTimezone=UTC";
private static final String USER = "root";
private static final String PASSWORD = "root";  // Change this to your MySQL password
```

### Step 3: Build the Application

```bash
# Clean and build
mvn clean package

# This creates: target/eventhub.war
```

### Step 4: Deploy to Tomcat

**Option A: Manual Deployment**
1. Copy the WAR file to Tomcat's webapps directory:
   ```bash
   cp target/eventhub.war /path/to/tomcat/webapps/
   ```

2. Start Tomcat:
   ```bash
   # On Linux/Mac
   /path/to/tomcat/bin/startup.sh
   
   # On Windows
   C:path	o	omcatbinstartup.bat
   ```

**Option B: Tomcat Manager**
1. Access Tomcat Manager: `http://localhost:8080/manager`
2. Upload `target/eventhub.war` using the web interface

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:8080/eventhub/
```

## API Endpoints

### 1. Get All Events
```http
GET /eventhub/api/events
```

**Response:**
```json
[
  {
    "id": "eh-01",
    "name": "IndiaDev Summit 2026",
    "category": "tech",
    "date": "Mar 14, 2026",
    "location": "Bengaluru, IN",
    "seats": 312,
    "icon": "code",
    "gradient": ["#00e5ff", "#5b8bff"]
  }
]
```

### 2. Register for Event
```http
POST /eventhub/api/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "eventId": "eh-01",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "org": "ABC University",
  "tickets": 2
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful"
}
```

**Response (Error):**
```json
{
  "error": "Not enough seats available"
}
```

## EmailJS Integration (Contact Form)

The contact form is ready for EmailJS integration. Follow these steps:

1. **Sign up** at [EmailJS.com](https://www.emailjs.com/)

2. **Create an email service** (Gmail, Outlook, etc.)

3. **Create an email template** with variables:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{message}}`

4. **Add EmailJS SDK** to `index.html` (before closing `</body>` tag):
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   <script>
     emailjs.init('YOUR_PUBLIC_KEY');
   </script>
   ```

5. **Update `script.js`** - Replace the TODO section in the contact form handler with your EmailJS credentials:
   ```javascript
   emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
     .then(() => {
       // Success handling
     })
     .catch((error) => {
       // Error handling
     });
   ```

## Database Schema

### Events Table
```sql
CREATE TABLE events (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    seats INT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    gradient JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Registrations Table
```sql
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(20) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    organization VARCHAR(150) NOT NULL,
    tickets INT NOT NULL DEFAULT 1,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

## Development

### Building for Development
```bash
mvn clean compile
```

### Running Tests (if you add them)
```bash
mvn test
```

### Viewing Logs
Tomcat logs are located at:
```
/path/to/tomcat/logs/catalina.out
```

## Troubleshooting

### Issue: Database Connection Failed
- Verify MySQL is running: `systemctl status mysql`
- Check credentials in `DatabaseConnection.java`
- Ensure database exists: `SHOW DATABASES;`

### Issue: 404 Error
- Verify WAR file deployed correctly in `webapps/`
- Check Tomcat logs for deployment errors
- Ensure context path is `/eventhub`

### Issue: Servlets Not Loading
- Check `web.xml` servlet mappings
- Verify Java version (should be 11+)
- Clean Tomcat work directory: `rm -rf work/*`

### Issue: CORS Errors
- Servlets include CORS headers by default
- If issues persist, check browser console for specific errors

## Production Considerations

1. **Security:**
   - Change default MySQL credentials
   - Use environment variables for sensitive data
   - Enable HTTPS/SSL
   - Add input sanitization
   - Implement rate limiting

2. **Performance:**
   - Use connection pooling (Apache DBCP, HikariCP)
   - Add caching layer (Redis, Memcached)
   - Enable Tomcat compression
   - Optimize database indexes

3. **Monitoring:**
   - Add logging framework (Log4j, SLF4J)
   - Set up application monitoring
   - Configure error tracking

## License

This project is open-source and available for educational purposes.

## Support

For issues or questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for EventHub**
