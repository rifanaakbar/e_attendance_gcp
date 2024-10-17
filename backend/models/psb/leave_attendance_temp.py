from datetime import datetime
from config.db import db


class LeaveAttendanceTemp(db.Model):
    __table_args__ = {"schema": "dbo"}
    __tablename__ = "leave_attendance_temp"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(255))
    student_name = db.Column(db.String(255))
    leave_date = db.Column(db.String(255))
    leave_reason = db.Column(db.String(255))
    leave_status = db.Column(db.String(255))
    last_modified_by = db.Column(db.String(255))
    last_modified_at = db.Column(
        db.DateTime, default=datetime.now, onupdate=datetime.now
    )
    created_at = db.Column(db.DateTime, default=datetime.now)

    def json(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "student_name": self.student_name,
            "leave_date": self.leave_date,
            "leave_reason": self.leave_reason,
            "leave_status": self.leave_status,
            "last_modified_by": self.last_modified_by,
            "last_modified_at": (
                self.last_modified_at.isoformat() if self.last_modified_at else None
            ),
            "created_at": (self.created_at.isoformat() if self.created_at else None),
        }
