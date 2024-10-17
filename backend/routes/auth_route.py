from flask import Blueprint

from controllers.auth_controller import decode_and_validate_specific_token

jwt_routes = Blueprint("jwt", __name__)


@jwt_routes.route("/jwt", methods=["POST"])
def get_jwt_route():
    return decode_and_validate_specific_token()
