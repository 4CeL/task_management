from data.task_data import *
from function.auth_function import *
from function.activity_data import *

def GetAllTasks(user_id, search="", status=""):

    err_code, err_msg, result = dataGetAllTasks(
        user_id,
        search,
        status
    )

    message = (
        "Success GetAllTasks"
        if err_code == 0
        else "Failed GetAllTasks"
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

def GetTaskById(
    task_id,
    user_id
):

    err_code, err_msg, result = dataGetTaskById(
        task_id,
        user_id
    )

    # Task tidak ditemukan
    if result is None:

        return {
            "message": "Task not found",
            "error": {
                "status": True,
                "code": 404,
                "message": "Task not found"
            }
        }

    message = (
        "Success GetTaskById"
        if err_code == 0
        else "Failed GetTaskById"
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

def InsertTask(title, description, status, due_date, priority, user_id):

    err_code, err_msg, result = dataInsertTask(
        title,
        description,
        status,
        due_date,
        priority,
        user_id
    )

    if err_code == 0:
        CreateActivity(
            user_id,
            "CREATE_TASK",
            f'Created task "{title}"'
        )

    message = (
        "Success InsertTask"
        if err_code == 0
        else "Failed InsertTask"
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

def UpdateTask(
    task_id,
    title,
    description,
    status,
    due_date,
    priority,
    user_id
):

    err_code, err_msg = dataUpdateTask(
        task_id,
        title,
        description,
        status,
        due_date,
        priority,
        user_id
    )

    if err_code == 0:
        CreateActivity(
            user_id,
            "UPDATE_TASK",
            f'Updated task "{title}"'
        )

    message = (
        "Success UpdateTask"
        if err_code == 0
        else "Failed UpdateTask"
    )

    return {
        "message": message,
        "error": {
            "status": err_code != 0,
            "code": err_code,
            "message": err_msg
        }
    }

def DeleteTask(task_id, user_id):

    # GET TASK FIRST
    _, _, task = dataGetTaskById(task_id, user_id)

    err_code, err_msg, result = dataDeleteTask(task_id, user_id)

    if err_code == 0 and task is not None:

        CreateActivity(
            user_id,
            "DELETE_TASK",
            f'Deleted task "{task["title"]}"'
        )

    message = (
        "Success DeleteTask"
        if err_code == 0
        else "Failed DeleteTask"
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

def UpdateUsername(user_id, username):

    if username.strip() == "":
        return {
            "message": "Username is required",
            "error": {
                "status": True,
                "code": 400,
                "message": "Username cannot be empty"
            }
        }

    err_code, err_msg, existing_user = dataCheckUsernameExists(username)

    if existing_user is not None and existing_user["user_id"] != user_id:
        return {
            "message": "Username already exists",
            "error": {
                "status": True,
                "code": 400,
                "message": "Username already registered"
            }
        }

    err_code, err_msg = dataUpdateUsername(user_id, username)

    message = (
        "Success UpdateUsername"
        if err_code == 0
        else "Failed UpdateUsername"
    )

    return {
        "message": message,
        "error": {
            "status": err_code != 0,
            "code": err_code,
            "message": err_msg
        },
        "data": {
            "username": username
        }
    }