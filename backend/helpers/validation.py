import re

def check_route_keys(required_keys, body):

    for key in required_keys:

        if key not in body:
            return f"{key} is required"

    return ""

def validate_task_status(status):

    allowed_status = [
        "Todo",
        "In Progress",
        "Done"
    ]

    if status not in allowed_status:
        return False

    return True

def validate_email_format(email):

    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'

    return re.match(pattern, email)

def validate_password_length(password):

    return len(password) >= 6

def validate_task_priority(priority):

    allowed_priority = [
        "Low",
        "Medium",
        "High"
    ]

    if priority not in allowed_priority:
        return False

    return True