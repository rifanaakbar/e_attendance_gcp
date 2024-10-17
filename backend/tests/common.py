from backend.models.country import Country
from models import db
import unittest
from app import app
from sqlalchemy import text


class BaseTestCase(unittest.TestCase):
    def setUp(self):
        # Setup test database and context
        self.app_context = app.app_context()
        self.app_context.push()
        db.session.execute(text('CREATE SCHEMA IF NOT exists psb'))
        
        db.session.commit()
        db.create_all()

        self.test_country = Country(
            form_type="India",
            form_sequence=1,
            created_by="test",
            last_modified_by="test",
            
        )
        db.session.add(self.test_country)
        db.session.commit()
