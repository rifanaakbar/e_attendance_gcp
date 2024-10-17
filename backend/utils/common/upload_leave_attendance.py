from flask import request, jsonify
from models.psb.leave_attendance_temp import LeaveAttendanceTemp
from config.db import db
import pandas


def upload_leave_attendance():
    try:
        if "file" not in request.files:
            return jsonify(error="No file part in the request"), 400

        file = request.files["file"]

        df = pandas.read_excel(file)

        required_columns = ["attendance_date", "reason", "student_id", "student_name"]
        if all(column in df.columns for column in required_columns):
            pass  # All required columns are present
        else:
            missing_columns = [
                column for column in required_columns if column not in df.columns
            ]
            return (
                jsonify(
                    error=f"Missing columns in the uploaded file: {', '.join(missing_columns)}"
                ),
                400,
            )

        leave_entries = []
        for _, row in df.iterrows():
            student_id = row["student_id"]
            student_name = row["student_name"]
            reason = row["reason"]
            attendance_date = row["attendance_date"]

            # Check if an entry with the same student_id, student_name, and attendance_date already exists
            existing_entry = LeaveAttendanceTemp.query.filter_by(
                student_id=student_id,
                student_name=student_name,
                leave_date=attendance_date
            ).first()

            if not existing_entry:
                leave_entry = LeaveAttendanceTemp(
                    student_id=student_id,
                    student_name=student_name,
                    leave_date=attendance_date,
                    leave_reason=reason,
                    leave_status="Leave",
                )
                leave_entries.append(leave_entry)

        if leave_entries:
            db.session.bulk_save_objects(leave_entries)
            db.session.commit()

        return jsonify(message="File uploaded successfully"), 200

    except Exception as e:
        return jsonify(error=f"An error occurred: {e}"), 500
