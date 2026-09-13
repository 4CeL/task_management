from flask import Flask
from flask_cors import CORS
import os

app = Flask(__name__)

# Enable CORS
CORS(
    app,
    origins=[
        "https://task-workflow-app.vercel.app/",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# Import routes
from routes.task_routes import *
from routes.auth_routes import *

# Run app
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )