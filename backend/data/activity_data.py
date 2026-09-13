# from db import get_db_connection

# def dataCreateActivity(user_id, activity_type, activity_message):

#     errorCode = 0
#     errorMessage = ""

#     try:
#         db = get_db_connection()

#         if db.is_connected():
#             cursor = db.cursor()

#             query = """
#                 INSERT INTO task_activities (
#                     user_id,
#                     activity_type,
#                     activity_message
#                 )
#                 VALUES (%s, %s, %s)
#             """

#             params = (
#                 user_id,
#                 activity_type,
#                 activity_message
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

# def dataGetRecentActivities(user_id, limit=5):

#     errorCode = 0
#     errorMessage = ""
#     result = []

#     try:

#         db = get_db_connection()

#         if db.is_connected():

#             cursor = db.cursor(dictionary=True)

#             query = """
#                 SELECT
#                     activity_id,
#                     activity_type,
#                     activity_message,
#                     created_at
#                 FROM task_activities
#                 WHERE user_id = %s
#                 ORDER BY created_at DESC
#                 LIMIT %s
#             """

#             params = (
#                 user_id,
#                 limit
#             )

#             cursor.execute(query, params)

#             result = cursor.fetchall()

#             cursor.close()

#         db.close()

#     except Exception as e:

#         errorCode = 500
#         errorMessage = str(e)

#     return errorCode, errorMessage, result



from db import get_db_connection
from psycopg2.extras import RealDictCursor

def dataCreateActivity(user_id, activity_type, activity_message):

    errorCode = 0
    errorMessage = ""

    try:
        db = get_db_connection()

        if db and db.closed == 0:
            cursor = db.cursor()

            query = """
                INSERT INTO task_activities (
                    user_id,
                    activity_type,
                    activity_message
                )
                VALUES (%s, %s, %s)
            """

            params = (
                user_id,
                activity_type,
                activity_message
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

def dataGetRecentActivities(user_id, limit=5):

    errorCode = 0
    errorMessage = ""
    result = []

    try:

        db = get_db_connection()

        if db and db.closed == 0:

            cursor = db.cursor(cursor_factory=RealDictCursor)

            query = """
                SELECT
                    activity_id,
                    activity_type,
                    activity_message,
                    created_at
                FROM task_activities
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT %s
            """

            params = (
                user_id,
                limit
            )

            cursor.execute(query, params)

            result = cursor.fetchall()

            cursor.close()

        if db and db.closed == 0:
            db.close()

    except Exception as e:

        errorCode = 500
        errorMessage = str(e)

    return errorCode, errorMessage, result