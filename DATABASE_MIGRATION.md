# Database Migration Guide

## How to Transfer Your Local MySQL Data to Production

You have data in your local MySQL database (localhost) and need to move it to your production database (Railway/PlanetScale).

---

## Method 1: Export & Import (Recommended)

### Step 1: Export Local Database

Open Command Prompt and run:

```cmd
cd "c:\Users\hp\Downloads\JaiLikki\KothiLikki-main\KothiLikki-main"

mysqldump -u root -p nestbazaar > database_backup.sql
```

**Enter your password when prompted**: `Prasad!5002`

This creates a file `database_backup.sql` with all your data.

### Step 2: Import to Production Database

After you deploy to Railway, get your production database credentials:

```cmd
mysql -h <railway-host> -P <railway-port> -u <railway-user> -p <railway-database> < database_backup.sql
```

**Example:**
```cmd
mysql -h containers-us-west-123.railway.app -P 6543 -u root -p railway < database_backup.sql
```

---

## Method 2: Using MySQL Workbench (Visual Tool)

### Step 1: Export Local Data

1. Download **MySQL Workbench**: https://dev.mysql.com/downloads/workbench/
2. Open MySQL Workbench
3. Connect to your local database:
   - Host: `localhost`
   - Port: `3306`
   - User: `root`
   - Password: `Prasad!5002`
   - Database: `nestbazaar`

4. Go to **Server** → **Data Export**
5. Select database `nestbazaar`
6. Select all tables
7. Choose **Export to Self-Contained File**
8. Click **Start Export**
9. Save as `nestbazaar_backup.sql`

### Step 2: Import to Production

1. In MySQL Workbench, create new connection
2. Enter Railway database credentials:
   - Host: `<railway-host>`
   - Port: `<railway-port>`
   - User: `<railway-user>`
   - Password: `<railway-password>`
   - Database: `<railway-database>`

3. Go to **Server** → **Data Import**
4. Select **Import from Self-Contained File**
5. Choose your `nestbazaar_backup.sql` file
6. Click **Start Import**

Done! Your data is now in production.

---

## Method 3: Using Node.js Script (Automated)

Create this script to copy data programmatically:

### Create: `migrate-database.js`

```javascript
const mysql = require('mysql2/promise');

// Local Database
const localDB = {
  host: 'localhost',
  user: 'root',
  password: 'Prasad!5002',
  database: 'nestbazaar'
};

// Production Database (Update with Railway credentials)
const prodDB = {
  host: 'containers-us-west-xxx.railway.app',
  port: 6543,
  user: 'root',
  password: 'your-railway-password',
  database: 'railway'
};

async function migrateData() {
  try {
    // Connect to both databases
    const localConn = await mysql.createConnection(localDB);
    const prodConn = await mysql.createConnection(prodDB);

    console.log('✅ Connected to both databases');

    // Get list of all tables
    const [tables] = await localConn.query('SHOW TABLES');
    
    for (const tableObj of tables) {
      const tableName = Object.values(tableObj)[0];
      console.log(`\n📊 Migrating table: ${tableName}`);

      // Get data from local
      const [rows] = await localConn.query(`SELECT * FROM ${tableName}`);
      
      if (rows.length === 0) {
        console.log(`   ⚠️  No data in ${tableName}`);
        continue;
      }

      // Insert into production
      for (const row of rows) {
        const columns = Object.keys(row).join(', ');
        const placeholders = Object.keys(row).map(() => '?').join(', ');
        const values = Object.values(row);

        const query = `INSERT IGNORE INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        
        try {
          await prodConn.query(query, values);
        } catch (err) {
          console.log(`   ❌ Error inserting row:`, err.message);
        }
      }

      console.log(`   ✅ Migrated ${rows.length} rows`);
    }

    console.log('\n🎉 Migration complete!');

    await localConn.end();
    await prodConn.end();

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrateData();
```

### Run Migration:

```cmd
cd backend
node migrate-database.js
```

---

## Method 4: Direct Database Connection Switch

If you want to keep using your local database even after deploying:

### Option A: Keep Local Database
- Don't change anything
- Backend still connects to localhost
- ⚠️ **Issue**: Only works when your computer is running

### Option B: Expose Local Database (Not Recommended)
- Use ngrok or similar to expose local MySQL
- Security risk - not recommended

### Option C: Hybrid Approach
- Use Railway database for production
- Keep local database for development
- Maintain two separate databases

---

## Important Notes

### 1. Data Consistency
When migrating:
- ✅ Users will transfer
- ✅ Properties/Listings will transfer
- ✅ Bookings will transfer
- ✅ Transactions will transfer
- ⚠️ **Images**: Already on Cloudinary (will work automatically)
- ⚠️ **Passwords**: Already hashed (will work)

### 2. Auto-Increment IDs
After migration, make sure auto-increment continues correctly:

```sql
-- Check current max ID
SELECT MAX(id) FROM users;

-- Set auto-increment higher
ALTER TABLE users AUTO_INCREMENT = 1001;
```

### 3. Foreign Keys
If you get foreign key errors during import:
```sql
-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS=0;

-- Import data here

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;
```

---

## Recommended Workflow

### For First Deployment:

1. ✅ **Export local database** (Method 1 or 2)
2. ✅ **Deploy backend to Render** (with Railway database)
3. ✅ **Import data to Railway**
4. ✅ **Test production app**
5. ✅ **Keep local database for development**

### For Ongoing Development:

- **Local**: Use local MySQL for testing
- **Production**: Use Railway MySQL for live users
- **Sync**: Manually sync when needed, or keep separate

---

## Quick Command Reference

### Export Local Database
```cmd
mysqldump -u root -pPrasad!5002 nestbazaar > backup.sql
```

### Import to Production
```cmd
mysql -h <host> -P <port> -u <user> -p <database> < backup.sql
```

### Export Specific Tables Only
```cmd
mysqldump -u root -pPrasad!5002 nestbazaar users properties listings > partial_backup.sql
```

### Check Database Size
```cmd
mysql -u root -pPrasad!5002 -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema='nestbazaar';"
```

---

## Troubleshooting

### Issue: "Access denied for user"
**Solution**: Check username and password

### Issue: "Unknown database"
**Solution**: Database must exist before importing. Create it first:
```sql
CREATE DATABASE railway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Issue: "Table already exists"
**Solution**: Drop existing tables or use `--force` flag
```cmd
mysql -h <host> -u <user> -p --force <database> < backup.sql
```

### Issue: Import is too slow
**Solution**: Increase packet size
```cmd
mysql -h <host> -u <user> -p --max_allowed_packet=512M <database> < backup.sql
```

### Issue: Character encoding problems
**Solution**: Specify charset
```cmd
mysql -h <host> -u <user> -p --default-character-set=utf8mb4 <database> < backup.sql
```

---

## Security Tips

1. ✅ **Never commit** database backups to Git
2. ✅ **Encrypt backups** if they contain sensitive data
3. ✅ **Delete backup files** after migration
4. ✅ **Use different passwords** for local and production
5. ✅ **Backup regularly** - Railway has auto-backup features

---

## After Migration Checklist

- [ ] All tables exist in production
- [ ] Row counts match (local vs production)
- [ ] Test user login
- [ ] Test creating new records
- [ ] Test file uploads (Cloudinary)
- [ ] Test payments (Razorpay)
- [ ] Check admin access
- [ ] Verify foreign key relationships
- [ ] Test all major features

---

## Need to Rollback?

If something goes wrong:

```sql
-- Drop all tables
DROP DATABASE railway;

-- Recreate database
CREATE DATABASE railway;

-- Try import again
```

---

Your data will be accessible in production just like it is locally! 🎉
