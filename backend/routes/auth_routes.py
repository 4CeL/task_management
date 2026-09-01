from flask import request, jsonify

from app import app

from helpers.response import *
from helpers.validation import *

from function.auth_function import *

@app.route("/register", methods=["POST"])
def register_user():

    body = request.get_json()

    required_keys = [
        "username",
        "email",
        "password"
    ]

    error_message = check_route_keys(
        required_keys,
        body
    )

    if error_message != "":

        return response(
            error_message,
            True,
            400,
            error_message
        )

    username = body["username"]
    email = body["email"]
    password = body["password"]

    result = RegisterUser(
        username,
        email,
        password
    )

    return jsonify(result)

@app.route("/login", methods=["POST"])
def login_user():

    body = request.get_json()

    required_keys = [
        "email",
        "password"
    ]

    error_message = check_route_keys(
        required_keys,
        body
    )

    if error_message != "":

        return response(
            error_message,
            True,
            400,
            error_message
        )

    email = body["email"]
    password = body["password"]

    result = LoginUser(
        email,
        password
    )

    return jsonify(result)

@app.route("/login-google", methods=["POST", "OPTIONS"])
def login_google():

    if request.method == "OPTIONS":
        return jsonify({}), 200

    body = request.get_json()

    required_keys = ["credential"]

    error_message = check_route_keys(required_keys, body)

    if error_message != "":
        return response(error_message, True, 400, error_message)

    credential = body["credential"]

    result = LoginWithGoogle(credential)

    return jsonify(result)