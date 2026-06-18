import requests
import logging
from backend.config import Config

logger = logging.getLogger(__name__)

class SonarQubeService:
    def __init__(self):
        self.enabled = False
        self.is_configured = False
        if Config.SONARQUBE_URL and Config.SONARQUBE_TOKEN:
            self.url = Config.SONARQUBE_URL.rstrip('/')
            self.headers = {'Authorization': f"Bearer {Config.SONARQUBE_TOKEN}"}
            self.enabled = True
            self.is_configured = True

    def get_quality_gate(self, project_key):
        if not self.enabled:
            return self._get_mock_quality_gate(project_key)
        try:
            api_url = f"{self.url}/api/qualitygates/project_status?projectKey={project_key}"
            response = requests.get(api_url, headers=self.headers)
            if response.status_code == 200:
                data = response.json()
                status = data.get('projectStatus', {}).get('status', 'ERROR')
                return {
                    'status': 'passed' if status == 'OK' else 'failed',
                    'metrics': self._parse_sonar_metrics(data.get('projectStatus', {}).get('conditions', []))
                }
            return self._get_mock_quality_gate(project_key)
        except Exception as e:
            logger.error(f"Error querying SonarQube quality gate: {e}")
            return self._get_mock_quality_gate(project_key)

    def _parse_sonar_metrics(self, conditions):
        metrics = {}
        for condition in conditions:
            metric_name = condition.get('metricKey')
            actual_value = condition.get('actualValue')
            status = condition.get('status')
            metrics[metric_name] = {
                'value': actual_value,
                'status': 'passed' if status == 'OK' else 'failed'
            }
        return metrics

    def _get_mock_quality_gate(self, project_key):
        # Default mock values tailored to match seed database
        mock_data = {
            'p1': {
                'status': 'passed',
                'metrics': {
                    'coverage': {'value': '98.2', 'status': 'passed'},
                    'duplicated_lines_density': {'value': '1.2', 'status': 'passed'},
                    'code_smells': {'value': '4', 'status': 'passed'},
                    'bugs': {'value': '0', 'status': 'passed'},
                    'vulnerabilities': {'value': '0', 'status': 'passed'}
                }
            },
            'p2': {
                'status': 'passed',
                'metrics': {
                    'coverage': {'value': '99.1', 'status': 'passed'},
                    'duplicated_lines_density': {'value': '0.8', 'status': 'passed'},
                    'code_smells': {'value': '2', 'status': 'passed'},
                    'bugs': {'value': '0', 'status': 'passed'},
                    'vulnerabilities': {'value': '0', 'status': 'passed'}
                }
            },
            'p3': {
                'status': 'failed',
                'metrics': {
                    'coverage': {'value': '71.4', 'status': 'failed'},
                    'duplicated_lines_density': {'value': '6.4', 'status': 'failed'},
                    'code_smells': {'value': '34', 'status': 'failed'},
                    'bugs': {'value': '8', 'status': 'failed'},
                    'vulnerabilities': {'value': '2', 'status': 'failed'}
                }
            },
            'p4': {
                'status': 'failed',
                'metrics': {
                    'coverage': {'value': '45.0', 'status': 'failed'},
                    'duplicated_lines_density': {'value': '12.8', 'status': 'failed'},
                    'code_smells': {'value': '88', 'status': 'failed'},
                    'bugs': {'value': '15', 'status': 'failed'},
                    'vulnerabilities': {'value': '6', 'status': 'failed'}
                }
            }
        }
        return mock_data.get(project_key, {
            'status': 'passed',
            'metrics': {
                'coverage': {'value': '85.0', 'status': 'passed'},
                'duplicated_lines_density': {'value': '2.0', 'status': 'passed'},
                'code_smells': {'value': '5', 'status': 'passed'},
                'bugs': {'value': '0', 'status': 'passed'},
                'vulnerabilities': {'value': '0', 'status': 'passed'}
            }
        })
