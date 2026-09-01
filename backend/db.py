import mysql.connector
from dotenv import load_dotenv
import os

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
def get_db_connection():
    return mysql.connector.connect(**conn)