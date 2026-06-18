from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from backend.models import db, Project, Pipeline, Vuln, Container, CloudResource
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('', methods=['GET'])
@jwt_required()
def get_dashboard_metrics():
    # 1. Gather counts
    project_count = Project.query.count()
    vuln_critical_count = Vuln.query.filter(
        Vuln.severity == 'critical', 
        Vuln.status == 'open'
    ).count()
    
    # 2. Gather deployment metrics
    total_deploys = db.session.query(func.sum(Project.deploys)).scalar() or 0
    
    # Calculate average success rate
    success_rate_avg = db.session.query(func.avg(Project.successRate)).scalar() or 100.00
    
    # 3. Running pipelines
    running_pipelines = Pipeline.query.filter(Pipeline.status == 'running').count()
    
    # 4. Recent pipelines list (limit to 5)
    recent_pipelines = Pipeline.query.order_by(Pipeline.startTime.desc()).limit(5).all()
    
    # 5. Chart Data: Mocking time-series trends since the database seed is static.
    # We provide structured data that frontend charts can render.
    deployment_activity = {
        'labels': ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        'datasets': [
            {
                'label': "PaymentGateway-API",
                'data': [12, 19, 15, 25, 22, 10, 14],
                'borderColor': "#3B82F6"
            },
            {
                'label': "Auth-Service",
                'data': [8, 12, 10, 18, 14, 8, 11],
                'borderColor': "#10B981"
            }
        ]
    }
    
    vuln_distribution = {
        'critical': Vuln.query.filter_by(severity='critical', status='open').count(),
        'high': Vuln.query.filter_by(severity='high', status='open').count(),
        'medium': Vuln.query.filter_by(severity='medium', status='open').count(),
        'low': Vuln.query.filter_by(severity='low', status='open').count()
    }

    return jsonify({
        'metrics': {
            'project_count': project_count,
            'critical_vulnerabilities': vuln_critical_count,
            'total_deployments': int(total_deploys),
            'success_rate': round(float(success_rate_avg), 1),
            'running_pipelines': running_pipelines
        },
        'recent_pipelines': [p.to_dict() for p in recent_pipelines],
        'charts': {
            'deployment_activity': deployment_activity,
            'vuln_distribution': vuln_distribution
        }
    }), 200
