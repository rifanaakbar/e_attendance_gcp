from datetime import datetime, timezone
import logging
import secrets
from flask import jsonify, request
import jwt
import requests
from functools import wraps

from config.db import initialize_db



log = logging.getLogger("psb_academy_logger")

token_storage = {}


# Commenting this out in case we need it later on
# def generate_jwt():
#     try:
#         data = request.get_json()
#         enrollment_id = data.get("enrolment_id")
#         token = data.get("token")

#         secret_value = get_secrets()
#         JWT_URL = f"{secret_value['JWT_URL']}"
#         get_params = {"enrolment_id": enrollment_id, "token": token}

#         response = requests.get(JWT_URL, params=get_params)
#         response_code = response.status_code

#         if response_code == 200:
#             jwt_secret = secret_value.get('JWT_SECRET')
#             if not jwt_secret:
#                 jwt_secret = secrets.token_urlsafe(32)
#                 log.warning("JWT_SECRET not found in secrets. Generated a random secret.")

#             jwt_expiration = secret_value.get('JWT_EXPIRATION', '3600')

#             try:
#                 jwt_expiration = int(jwt_expiration)
#             except ValueError:
#                 jwt_expiration = 3600

#             payload = {
#                 'sub': enrollment_id,
#                 'iat': datetime.datetime.utcnow(),
#                 'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=jwt_expiration),
#                 'jti': secrets.token_hex(16)
#             }

#             jwt_token = jwt.encode(payload, jwt_secret, algorithm='HS256')

#             token_storage[enrollment_id] = jwt_token

#             return jsonify({'jwt_token': jwt_token}), 200
#         else:
#             return jsonify({'error': 'Failed to generate JWT'}), response_code

#     except Exception as e:
#         log.error("Exception occurred %s", str(e))
#         return jsonify({'error': 'Internal server error'}), 500


def verify_jwt(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({"message": "Token is missing or invalid"}), 401

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            secret_value = initialize_db()
            jwt_secret = secret_value.get("JWT_SECRET")
            if not jwt_secret:
                return jsonify({"message": "JWT_SECRET is not set"}), 500

            data = jwt.decode(token, jwt_secret, algorithms=["HS256"])

            stored_token = token_storage.get(data["sub"])
            if not stored_token or stored_token != token:
                return (
                    jsonify(
                        {"message": "Token is not valid or has been revoked"}
                    ),
                    401,
                )

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated


def decode_and_validate_specific_token():
    try:
        data = request.get_json()
        token = data.get("token")

        if not token:
            return {"error": "No token provided"}, 400

        secret_value = initialize_db()
        jwt_secret = secret_value.get("JWT_SECRET")

        if not jwt_secret:
            return {"error": "JWT_SECRET is not set"}, 500

        log.info("jwt_secret %s", jwt_secret)
        decoded_token = jwt.decode(
            token,
            jwt_secret,
            algorithms=["HS256"],
            options={"verify_exp": True, "verify_iat": True},
        )
        log.info("decoded_token %s", decoded_token)

        return {
            "sub": decoded_token.get("sub"),
            "jti": decoded_token.get("jti"),
            "iat": decoded_token.get("iat"),
            "exp": decoded_token.get("exp"),
            "username": decoded_token.get("username"),
            "user_email": decoded_token.get("user_email"),
            "enquiryId": decoded_token.get("enquiryId"),
            "roles": decoded_token.get("roles"),
            "tenant": decoded_token.get("tenant"),
            "userId": decoded_token.get("userId"),
            "enquiryName": decoded_token.get("enquiryName"),
            "emailId": decoded_token.get("emailId"),
            "mobileNumber": decoded_token.get("mobileNumber"),
            "studentCodes": decoded_token.get("studentCodes"),
        }, 200

    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}, 401
    except jwt.InvalidTokenError as e:
        return {"error": f"Invalid token: {str(e)}"}, 401
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}, 500
