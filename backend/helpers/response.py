def response(message, error_status, code, error_message, data=None):

    return {
        "message": message,
        "error": {
            "status": error_status,
            "code": code,
            "message": error_message
        },
        "data": data
    }