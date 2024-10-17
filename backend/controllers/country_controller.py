import logging

from flask import jsonify, logging, make_response

import logging

from models.psb.attendance import Attendance
from models.psb.country import Country

# Set up logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

def get_all_countries():
    try:
        countries = (
            Attendance.query.with_entities(
                Attendance.country_name,
            )
            .filter(Attendance.country_name.isnot(None))  
            .distinct()
            .all()
        )
        countries_list = [
            {
                "country_name": country[0]
            }
            for country in countries
        ]
        return jsonify({"countries": countries_list})
    except Exception as e:
        log.info(f"Error fetching countries: {str(e)}")
        return make_response(
            jsonify({"message": "Error fetching countries"}), 500
        )
