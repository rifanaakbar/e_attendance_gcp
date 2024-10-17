from tests.common import BaseTestCase


class Test_Appointments(BaseTestCase):

    def test_getall_country(self):
            response = self.client().get("/psb/country")
            self.assertEqual(response.status_code, 200)