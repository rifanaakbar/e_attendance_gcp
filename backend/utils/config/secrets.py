import json
import os

import boto3
import pyodbc
from botocore.exceptions import ClientError


def get_driver_version():
    drivers = [
        driver
        for driver in pyodbc.drivers()
        if driver.startswith("ODBC Driver")
    ]
    if "ODBC Driver 18 for SQL Server" in drivers:
        return "ODBC+Driver+18+for+SQL+Server"
    elif "ODBC Driver 17 for SQL Server" in drivers:
        return "ODBC+Driver+17+for+SQL+Server"
    else:
        raise Exception("No suitable ODBC Driver found")
