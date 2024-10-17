import asyncio
from datetime import datetime
import logging
from controllers.auth_controller import verify_jwt
from controllers.batch_job_controller import (
    get_all_batch_list,
    get_batchjob_by_date,
)
from flask import Blueprint, current_app, jsonify, request

from utils.batch_job.jobs_main import load_batchjob_data

batch_job = Blueprint("batch_job", __name__)

log = logging.getLogger("psb_academy_logger")


async def async_load_batchjob_data(job_type=None):
    try:
        result = load_batchjob_data(job_type)
        log.info(f"Batch job of type {job_type} completed at {datetime.now()}")
        return result
    except Exception as e:
        current_app.logger.error(
            f"An error occurred in {job_type} load_data: {str(e)}"
        )
        raise


@batch_job.route("/batch_job", methods=["POST"])
# @verify_jwt
def get_all_batch_job_route():
    job_type = request.args.get("job_type")

    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(async_load_batchjob_data(job_type))
        return result
    except Exception as e:
        current_app.logger.error(f"Error in batch job route: {str(e)}")
        return current_app.response_class(
            response={"error": "An error occurred"},
            status=500,
            mimetype="application/json",
        )
    finally:
        loop.close()


@batch_job.route("/batchjob_id", methods=["POST"])
def get_batchjob_by_date_route():
    return get_batchjob_by_date()


@batch_job.route("/all_batch", methods=["GET"])
def get_all_batch_list_route():
    return get_all_batch_list()
