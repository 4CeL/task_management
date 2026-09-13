# from db import get_db_connection

# def dataGetAllTasks(
#     user_id,
#     search="",
#     status=""
# ):

#     errorCode = 0
#     errorMessage = ""
#     result = []

#     try:

#         db = get_db_connection()

#         if db.is_connected():

#             cursor = db.cursor(dictionary=True)

#             query = """
#                 SELECT *
#                 FROM tasks
#                 WHERE user_id = %s
#             """

#             # user_id wajib pertama
#             params = [user_id]

#             # Search
#             if search != "":

#                 query += """
#                     AND (
#                         title LIKE %s
#                         OR description LIKE %s
#                     )
#                 """

#                 params.extend([
#                     f"%{search}%",
#                     f"%{search}%"
#                 ])

#             # Filter status
#             if status != "":

#                 query += """
#                     AND status = %s
#                 """

#                 params.append(status)

#             query += """
#                 ORDER BY task_id DESC
#             """

#             cursor.execute(query, params)

#             result = cursor.fetchall()

#             cursor.close()

#         db.close()

#     except Exception as e:

#         errorCode = 500
#         errorMessage = str(e)

#     return errorCode, errorMessage, result

# def dataGetTaskById(
#     task_id,
#     user_id
# ):

#     errorCode = 0
#     errorMessage = ""
#     result = None

#     try:

#         db = get_db_connection()

#         if db.is_connected():

#             cursor = db.cursor(dictionary=True)

#             query = """
#                 SELECT *
#                 FROM tasks
#                 WHERE task_id = %s
#                 AND user_id = %s
#                 LIMIT 1
#             """

#             params = (
#                 task_id,
#                 user_id
#             )

#             cursor.execute(query, params)

#             result = cursor.fetchone()

#             cursor.close()

#         db.close()

#     except Exception as e:

#         errorCode = 500
#         errorMessage = str(e)

#     return errorCode, errorMessage, result

# def dataInsertTask(title, description, status, due_date, priority, user_id):

    
#     errorCode = 0
#     errorMessage = ""
#     result = []

#     try:

#         db = get_db_connection()

#         if db.is_connected():

#             cursor = db.cursor(dictionary=True)

#             query = """
#                 INSERT INTO tasks (title, description, status, due_date, priority, user_id)
#                 VALUES (%s, %s, %s, %s, %s, %s)
#             """
#             params = [title, description, status, due_date, priority, user_id]
#             cursor.execute(query, params)

#             db.commit()

#             cursor.close()

#         db.close()

#     except Exception as e:

#         errorCode = 500
#         errorMessage = str(e)

#     return errorCode, errorMessage, result

# from db import get_db_connection

# def dataUpdateTask(
#     task_id,
#     title,
#     description,
#     status,
#     due_date,
#     priority,
#     user_id
# ):

#     errorCode = 0
#     errorMessage = ""

#     try:

#         db = get_db_connection()

#         if db.is_connected():

#             cursor = db.cursor()

#             query = """
#                 UPDATE tasks
#                 SET
#                     title = %s,
#                     description = %s,
#                     status = %s,
#                     due_date = %s,
#                     priority = %s
#                 WHERE task_id = %s AND user_id = %s
#             """

#             params = (
#                 title,
#                 description,
#                 status,
#                 due_date,
#                 priority,
#                 task_id,
#                 user_id
#             )

#             cursor.execute(query, params)

#             db.commit()

#             cursor.close()

#         db.close()

#     except Exception as e:

#         db.rollback()

#         errorCode = 500
#         errorMessage = str(e)

#     return errorCode, errorMessage

# def dataDeleteTask(task_id, user_id):

#     errorCode = 0
#     errorMessage = ""
#     result = []

#     try:

#         db = get_db_connection()

#         if db.is_connected():

#             cursor = db.cursor(dictionary=True)

#             query = """
#                 DELETE FROM tasks
#                 WHERE task_id = %s AND user_id = %s
#             """
#             params = [task_id, user_id]
#             cursor.execute(query, params)

#             db.commit()

#             cursor.close()

#         db.close()

#     except Exception as e:

#         errorCode = 500
#         errorMessage = str(e)

#     return errorCode, errorMessage, result

# def dataUpdateUsername(user_id, username):

#     errorCode = 0
#     errorMessage = ""

#     try:
#         db = get_db_connection()

#         if db.is_connected():
#             cursor = db.cursor()

#             query = """
#                 UPDATE users
#                 SET username = %s
#                 WHERE user_id = %s
#             """

#             params = (
#                 username,
#                 user_id
#             )

#             cursor.execute(query, params)
#             db.commit()
#             cursor.close()

#         db.close()

#     except Exception as e:
#         db.rollback()
#         errorCode = 500
#         errorMessage = str(e)

#     return errorCode, errorMessage

from db import get_db_connection
from psycopg2.extras import RealDictCursor

def dataGetAllTasks(
    user_id,
    search="",
    status=""
):

    errorCode = 0
    errorMessage = ""
    result = []

    try:

        db = get_db_connection()

        if db and db.closed == 0:

            cursor = db.cursor(cursor_factory=RealDictCursor)

            query = """
                SELECT *
                FROM tasks
                WHERE user_id = %s
            """

            # user_id wajib pertama
            params = [user_id]

            # Search
            if search != "":

                query += """
                    AND (
                        title LIKE %s
                        OR description LIKE %s
                    )
                """

                params.extend([
                    f"%{search}%",
                    f"%{search}%"
                ])

            # Filter status
            if status != "":

                query += """
                    AND status = %s
                """

                params.append(status)

            query += """
                ORDER BY task_id DESC
            """

            cursor.execute(query, params)

            result = cursor.fetchall()

            cursor.close()

        if db and db.closed == 0:
            db.close()

    except Exception as e:

        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage, result

def dataGetTaskById(
    task_id,
    user_id
):

    errorCode = 0
    errorMessage = ""
    result = None

    try:

        db = get_db_connection()

        if db and db.closed == 0:

            cursor = db.cursor(cursor_factory=RealDictCursor)

            query = """
                SELECT *
                FROM tasks
                WHERE task_id = %s
                AND user_id = %s
                LIMIT 1
            """

            params = (
                task_id,
                user_id
            )

            cursor.execute(query, params)

            result = cursor.fetchone()

            cursor.close()

        if db and db.closed == 0:
            db.close()

    except Exception as e:

        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage, result

def dataInsertTask(title, description, status, due_date, priority, user_id):

    errorCode = 0
    errorMessage = ""
    result = []
    db = None

    try:

        db = get_db_connection()

        if db and db.closed == 0:

            cursor = db.cursor(cursor_factory=RealDictCursor)

            query = """
                INSERT INTO tasks (title, description, status, due_date, priority, user_id)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            params = [title, description, status, due_date, priority, user_id]
            cursor.execute(query, params)

            db.commit()

            cursor.close()

        if db and db.closed == 0:
            db.close()

    except Exception as e:

        if db:
            db.rollback()

        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage, result

def dataUpdateTask(
    task_id,
    title,
    description,
    status,
    due_date,
    priority,
    user_id
):

    errorCode = 0
    errorMessage = ""
    db = None

    try:

        db = get_db_connection()

        if db and db.closed == 0:

            cursor = db.cursor()

            query = """
                UPDATE tasks
                SET
                    title = %s,
                    description = %s,
                    status = %s,
                    due_date = %s,
                    priority = %s
                WHERE task_id = %s AND user_id = %s
            """

            params = (
                title,
                description,
                status,
                due_date,
                priority,
                task_id,
                user_id
            )

            cursor.execute(query, params)

            db.commit()

            cursor.close()

        if db and db.closed == 0:
            db.close()

    except Exception as e:

        if db:
            db.rollback()

        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage

def dataDeleteTask(task_id, user_id):

    errorCode = 0
    errorMessage = ""
    result = []
    db = None

    try:

        db = get_db_connection()

        if db and db.closed == 0:

            cursor = db.cursor(cursor_factory=RealDictCursor)

            query = """
                DELETE FROM tasks
                WHERE task_id = %s AND user_id = %s
            """
            params = [task_id, user_id]
            cursor.execute(query, params)

            db.commit()

            cursor.close()

        if db and db.closed == 0:
            db.close()

    except Exception as e:

        if db:
            db.rollback()

        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage, result

def dataUpdateUsername(user_id, username):

    errorCode = 0
    errorMessage = ""
    db = None

    try:
        db = get_db_connection()

        if db and db.closed == 0:
            cursor = db.cursor()

            query = """
                UPDATE users
                SET username = %s
                WHERE user_id = %s
            """

            params = (
                username,
                user_id
            )

            cursor.execute(query, params)
            db.commit()
            cursor.close()

        if db and db.closed == 0:
            db.close()

    except Exception as e:
        if db:
            db.rollback()
        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage