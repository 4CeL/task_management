import bcrypt

from data.auth_data import *
from helpers.validation import *
from helpers.jwt_helper import *

import os
from google.oauth2 import id_token
from google.auth.transport import requests

def RegisterUser(
    username,
    email,
    password
):

    # Validate email format
    if not validate_email_format(email):

        return {
            "message": "Invalid email format",
            "error": {
                "status": True,
                "code": 400,
                "message": "Email format is invalid"
            }
        }

    # Validate password length
    if not validate_password_length(password):

        return {
            "message": "Password too short",
            "error": {
                "status": True,
                "code": 400,
                "message": "Password minimum length is 6"
            }
        }

    # Check email exists
    err_code, err_msg, email_result = dataCheckEmailExists(email)

    if email_result is not None:

        return {
            "message": "Email already exists",
            "error": {
                "status": True,
                "code": 400,
                "message": "Email already registered"
            }
        }

    # Check username exists
    err_code, err_msg, username_result = dataCheckUsernameExists(username)

    if username_result is not None:

        return {
            "message": "Username already exists",
            "error": {
                "status": True,
                "code": 400,
                "message": "Username already registered"
            }
        }

    # Hash password
    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    err_code, err_msg = dataRegisterUser(
        username,
        email,
        hashed_password
    )

    message = (
        "Success RegisterUser"
        if err_code == 0
        else "Failed RegisterUser"
    )

    return {
        "message": message,
        "error": {
            "status": err_code != 0,
            "code": err_code,
            "message": err_msg
        }
    }

def LoginUser(
    email,
    password
):

    err_code, err_msg, user = dataLoginUser(email)

    # User tidak ditemukan
    if user is None:

        return {
            "message": "Email not found",
            "error": {
                "status": True,
                "code": 400,
                "message": "Email is not registered"
            }
        }

    # Check password
    password_match = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    )

    if not password_match:

        return {
            "message": "Wrong password",
            "error": {
                "status": True,
                "code": 400,
                "message": "Password is incorrect"
            }
        }

    # Generate JWT token
    token = generate_token(user)

    return {
        "message": "Success LoginUser",
        "error": {
            "status": False,
            "code": 0,
            "message": ""
        },
        "data": {
            "token": token,
            "user": {
                "user_id": user["user_id"],
                "username": user["username"],
                "email": user["email"]
            }
        }
    }

def LoginWithGoogle(credential):

    try:
        idinfo = id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )

        email = idinfo.get("email")
        username = idinfo.get("name")

        if not email:
            return {
                "message": "Invalid Google account",
                "error": {
                    "status": True,
                    "code": 400,
                    "message": "Email not found from Google account"
                }
            }

        err_code, err_msg, user = dataGetUserByEmail(email)

        if err_code != 0:
            return {
                "message": "Failed LoginWithGoogle",
                "error": {
                    "status": True,
                    "code": err_code,
                    "message": err_msg
                }
            }

        if user is None:
            err_code, err_msg, user = dataInsertGoogleUser(username, email)

            if err_code != 0:
                return {
                    "message": "Failed LoginWithGoogle",
                    "error": {
                        "status": True,
                        "code": err_code,
                        "message": err_msg
                    }
                }

        token = generate_token(user)

        return {
            "message": "Success LoginWithGoogle",
            "error": {
                "status": False,
                "code": 0,
                "message": ""
            },
            "data": {
                "token": token,
                "user": {
                    "user_id": user["user_id"],
                    "username": user["username"],
                    "email": user["email"]
                }
            }
        }

    except Exception as e:
        return {
            "message": "Invalid Google token",
            "error": {
                "status": True,
                "code": 401,
                "message": str(e)
            }
        }