import jwt
import os

from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")

def jwt_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        token = None

        # Ambil token dari header
        auth_header = request.headers.get("Authorization")

        if auth_header:

            parts = auth_header.split(" ")

            if len(parts) == 2:
                token = parts[1]

        # Token tidak ada
        if not token:

            return jsonify({
                "message": "Token is missing",
                "error": {
                    "status": True,
                    "code": 401,
                    "message": "Unauthorized"
                }
            }), 401

        try:

            # Decode token
            decoded = jwt.decode(
                token,
                JWT_SECRET,
                algorithms=[JWT_ALGORITHM]
            )

            # Simpan user ke request
            request.user = decoded

        except jwt.ExpiredSignatureError:

            return jsonify({
                "message": "Token expired",
                "error": {
                    "status": True,
                    "code": 401,
                    "message": "Token has expired"
                }
            }), 401

        except jwt.InvalidTokenError:

            return jsonify({
                "message": "Invalid token",
                "error": {
                    "status": True,
                    "code": 401,
                    "message": "Invalid token"
                }
            }), 401

        return f(*args, **kwargs)

    return decorated