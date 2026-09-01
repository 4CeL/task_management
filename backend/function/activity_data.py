from data.activity_data import *

def CreateActivity(user_id, activity_type, activity_message):

    err_code, err_msg = dataCreateActivity(
        user_id,
        activity_type,
        activity_message
    )

    return err_code, err_msg

def GetRecentActivities(user_id):

    err_code, err_msg, result = dataGetRecentActivities(user_id)

    message = (
        "Success GetRecentActivities"
        if err_code == 0
        else "Failed GetRecentActivities"
    )

    return {
        "message": message,
        "error": {
            "status": err_code != 0,
            "code": err_code,
            "message": err_msg
        },
        "data": result
    }