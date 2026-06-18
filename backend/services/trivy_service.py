import json
import logging
import os

logger = logging.getLogger(__name__)

class TrivyService:
    def __init__(self):
        self.is_configured = True

    def parse_trivy_report(self, file_path):
        """
        Parses a local Trivy JSON output file if it exists, otherwise falls back to mocks.
        """
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                
                vulns = []
                results = data.get('Results', [])
                for result in results:
                    target = result.get('Target', '')
                    for v in result.get('Vulnerabilities', []):
                        vulns.append({
                            'id': f"v-{v.get('VulnerabilityID')}",
                            'title': v.get('Title', 'No description available'),
                            'severity': v.get('Severity', 'MEDIUM').lower(),
                            'cve': v.get('VulnerabilityID'),
                            'component': f"{v.get('PkgName')}@{v.get('InstalledVersion')}",
                            'status': 'open',
                            'detectedAt': None
                        })
                return vulns
            except Exception as e:
                logger.error(f"Error parsing Trivy report at {file_path}: {e}")
                
        return self._get_mock_vulnerabilities()

    def _get_mock_vulnerabilities(self):
        return [
            {
                'id': 'v1',
                'title': 'Remote Code Execution in Apache Log4j2',
                'severity': 'critical',
                'cve': 'CVE-2021-44228',
                'component': 'log4j-core-2.14.1.jar',
                'status': 'open',
                'detectedAt': 1781700000000
            },
            {
                'id': 'v2',
                'title': 'Prototype Pollution in lodash',
                'severity': 'high',
                'cve': 'CVE-2020-8203',
                'component': 'lodash-4.17.15.js',
                'status': 'open',
                'detectedAt': 1781700000000
            },
            {
                'id': 'v3',
                'title': 'SQL Injection in Hibernate ORM',
                'severity': 'critical',
                'cve': 'CVE-2022-25857',
                'component': 'hibernate-core-5.6.0.jar',
                'status': 'fixed',
                'detectedAt': 1781700000000
            }
        ]
