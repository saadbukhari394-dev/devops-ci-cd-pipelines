import unittest

from app import app


class PortfolioTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_homepage_renders_portfolio(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Saad", response.data)
        self.assertIn(b"Pipeline in a box", response.data)

    def test_health_endpoint_returns_service_status(self):
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["status"], "ok")


if __name__ == "__main__":
    unittest.main()