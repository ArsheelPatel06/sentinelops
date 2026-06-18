import os
import uuid
from dotenv import load_dotenv

# Load .env file from project root
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, '.env'))

class Config:
    # Flask Secrets
    SECRET_KEY = os.environ.get('SECRET_KEY', str(uuid.uuid4()))
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', os.environ.get('SECRET_KEY', 'sentinelops-jwt-secret-key-13579'))
    JWT_ACCESS_TOKEN_EXPIRES = 3600 * 8  # 8 hours
    JWT_REFRESH_TOKEN_EXPIRES = 3600 * 24 * 7  # 7 days

    # Database Settings
    DB_USER = os.environ.get('DB_USER', 'root')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', 'root')
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT', '3306')
    DB_NAME = os.environ.get('DB_NAME', 'sentinelops_db')
    
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': int(os.environ.get('DB_POOL_SIZE', '20')),
        'pool_recycle': 280,
        'pool_pre_ping': True
    }

    # Third Party Integrations Configs
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID', '')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', '')
    AWS_DEFAULT_REGION = os.environ.get('AWS_DEFAULT_REGION', 'ap-south-1')

    GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')
    
    JENKINS_URL = os.environ.get('JENKINS_URL', 'http://localhost:8080')
    JENKINS_USER = os.environ.get('JENKINS_USER', '')
    JENKINS_TOKEN = os.environ.get('JENKINS_TOKEN', '')

    SONARQUBE_URL = os.environ.get('SONARQUBE_URL', 'http://localhost:9000')
    SONARQUBE_TOKEN = os.environ.get('SONARQUBE_TOKEN', '')
