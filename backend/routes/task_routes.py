from flask import jsonify
from app import app
from flask import request
from helpers.response import *
from helpers.validation import *

from function.task_function import *
from function.auth_function import *
from function.activity_data import *
from middleware.jwt_middleware import *

@app.route("/get-all-tasks", methods=["GET"])
@jwt_required
def get_all_tasks():

    # User login dari JWT
    user_id = request.user["user_id"]

    search = request.args.get("search", "")
    status = request.args.get("status", "")

    result = GetAllTasks(
        user_id,
        search,
        status
    )

    return jsonify(result)

@app.route("/tasks/<int:task_id>", methods=["GET"])
@jwt_required
def get_task_by_id(task_id):

    # Ambil user login dari JWT
    user_id = request.user["user_id"]

    result = GetTaskById(
        task_id,
        user_id
    )

    return jsonify(result)

@app.route("/insert-tasks", methods=["POST"])
@jwt_required
def insert_task():

    body = request.get_json()
    user_id = request.user["user_id"]
    due_date = body.get("due_date")
    priority = body.get("priority", "Medium")

    required_keys = [
        "title",
        "description",
        "status"
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

    title = body["title"]
    description = body["description"]
    status = body["status"]

    if not validate_task_status(status):
        return response(
            "Invalid status",
            True,
            400,
            "Status must be Todo, In Progress, or Done"
        )
    
    if not validate_task_priority(priority):
        return response(
            "Invalid priority",
            True,
            400,
            "Priority must be Low, Medium, or High"
        )

    result = InsertTask(
        title,
        description,
        status,
        due_date,
        priority,
        user_id
    )

    return jsonify(result)

@app.route("/delete-task", methods=["POST"])
@jwt_required
def delete_task():

    body = request.get_json()
    user_id = request.user["user_id"]

    required_keys = [
        "task_id"
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

    task_id = body["task_id"]

    result = DeleteTask(task_id, user_id)

    return jsonify(result)

@app.route("/update-tasks/<int:task_id>", methods=["PUT"])
@jwt_required
def update_task(task_id):

    body = request.get_json()
    due_date = body.get("due_date")
    priority = body.get("priority", "Medium")

    required_keys = [
        "title",
        "description",
        "status"
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

    title = body["title"]
    description = body["description"]
    status = body["status"]

    # Ambil user login dari JWT
    user_id = request.user["user_id"]

    result = UpdateTask(
        task_id,
        title,
        description,
        status,
        due_date,
        priority,
        user_id
    )

    return jsonify(result)

@app.route("/update-username", methods=["PUT"])
@jwt_required
def update_username():

    body = request.get_json()

    required_keys = ["username"]

    error_message = check_route_keys(required_keys, body)

    if error_message != "":
        return response(error_message, True, 400, error_message)

    user_id = request.user["user_id"]
    username = body["username"]

    result = UpdateUsername(user_id, username)

    return jsonify(result)

@app.route("/recent-activities", methods=["GET"])
@jwt_required
def recent_activities():

    user_id = request.user["user_id"]

    result = GetRecentActivities(user_id)

    return jsonify(result)