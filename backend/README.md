# Fun Drawing Room Backend

Install dependencies
```
npm ci
```

Create `.env.development`
```
ENV=development
PORT=5050
DOMAIN_FRONT=http://localhost:5173
DOMAIN_BACK=http://localhost:5050
ALLOW_DOMAINS=http://localhost:5173,http://localhost:5174

LOG_DIR="logs"
LOG_DAYS=14

TOKEN_SECRET=its-secret

DB_USER=XXXXXX
DB_PASS=XXXXXX
DB_NAME="fun_drawing_room"
DB_HOST="localhost"
DB_PORT=3306

REDIS_HOST="localhost"
REDIS_PORT=6379

NODEMAILER_GMAIL_USER=XXXXXX
NODEMAILER_GMAIL_PASS=XXXXXX
```

Run
```
npm run dev
```
