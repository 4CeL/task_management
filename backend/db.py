import mysql.connector
from dotenv import load_dotenv
import os
import psycopg2

# Load .env
load_dotenv()

# Database configuration
conn = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

# Function koneksi database
# def get_db_connection():
#     return mysql.connector.connect(**conn)

def get_db_connection():
    # Ambil DATABASE_URL dari file .env
    # Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
    database_url = os.getenv("DATABASE_URL")
    
    conn = psycopg2.connect(database_url)
    return conn