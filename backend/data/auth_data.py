from db import get_db_connection

def dataRegisterUser(
    username,
    email,
    hashed_password
):

    errorCode = 0
    errorMessage = ""

    try:

        db = get_db_connection()

        if db.is_connected():

            cursor = db.cursor()

            query = """
                INSERT INTO users (
                    username,
                    email,
                    password
                )
                VALUES (
                    %s,
                    %s,
                    %s
                )
            """

            params = (
                username,
                email,
                hashed_password
            )

            cursor.execute(query, params)

            db.commit()

            cursor.close()

        db.close()

    except Exception as e:

        db.rollback()

        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage

def dataCheckEmailExists(email):

    errorCode = 0
    errorMessage = ""
    result = None

    try:

        db = get_db_connection()

        if db.is_connected():

            cursor = db.cursor(dictionary=True)

            query = """
                SELECT user_id
                FROM users
                WHERE email = %s
            """

            cursor.execute(query, (email,))

            result = cursor.fetchone()

            cursor.close()

        db.close()

    except Exception as e:

        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage, result

def dataCheckUsernameExists(username):

    errorCode = 0
    errorMessage = ""
    result = None

    try:

        db = get_db_connection()

        if db.is_connected():

            cursor = db.cursor(dictionary=True)

            query = """
                SELECT user_id
                FROM users
                WHERE username = %s
            """

            cursor.execute(query, (username,))

            result = cursor.fetchone()

            cursor.close()

        db.close()

    except Exception as e:

        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage, result

def dataLoginUser(email):

    errorCode = 0
    errorMessage = ""
    result = None

    try:

        db = get_db_connection()

        if db.is_connected():

            cursor = db.cursor(dictionary=True)

            query = """
                SELECT *
                FROM users
                WHERE email = %s
            """

            cursor.execute(query, (email,))

            result = cursor.fetchone()

            cursor.close()

        db.close()

    except Exception as e:

        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage, result

def dataGetUserByEmail(email):

    errorCode = 0
    errorMessage = ""
    result = None

    try:
        db = get_db_connection()

        if db.is_connected():
            cursor = db.cursor(dictionary=True)

            query = """
                SELECT *
                FROM users
                WHERE email = %s
                LIMIT 1
            """

            cursor.execute(query, (email,))
            result = cursor.fetchone()

            cursor.close()

        db.close()

    except Exception as e:
        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage, result

def dataInsertGoogleUser(username, email):

    errorCode = 0
    errorMessage = ""
    result = None

    try:
        db = get_db_connection()

        if db.is_connected():
            cursor = db.cursor(dictionary=True)

            query = """
                INSERT INTO users (
                    username,
                    email,
                    password
                )
                VALUES (%s, %s, NULL)
            """

            cursor.execute(query, (username, email))
            db.commit()

            user_id = cursor.lastrowid

            result = {
                "user_id": user_id,
                "username": username,
                "email": email
            }

            cursor.close()

        db.close()

    except Exception as e:
        db.rollback()
        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage, result