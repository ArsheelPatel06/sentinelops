from flask import Blueprint, jsonify, request, send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Report, Pipeline, Vuln, User, AuditLog
from backend.services.report_service import ReportService
import os

reports_bp = Blueprint('reports', __name__)
report_svc = ReportService()

@reports_bp.route('', methods=['GET'])
@jwt_required()
def list_reports():
    reports = Report.query.order_by(Report.generated_at.desc()).all()
    return jsonify([r.to_dict() for r in reports]), 200

@reports_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_report():
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    report_type = data.get('type') # security, deployment, compliance, cost
    title = data.get('title')

    if not report_type:
        return jsonify({'message': 'Report type is required'}), 400

    if not title:
        title = f"{report_type.capitalize()} Status Summary"

    # Assemble dataset based on type
    dataset = {}
    if report_type == 'security':
        vulns = Vuln.query.all()
        dataset['vulnerabilities'] = [v.to_dict() for v in vulns]
    elif report_type == 'deployment':
        pipelines = Pipeline.query.all()
        dataset['pipelines'] = [p.to_dict() for p in pipelines]
    elif report_type == 'compliance':
        # Simulated controls list as per service design
        pass
    else: # Cost
        # Simulated cost list as per service design
        pass

    try:
        # Generate the PDF file
        relative_path = report_svc.generate_pdf_report(report_type, dataset)
        
        # Save to Database
        report = Report(
            title=title,
            type=report_type,
            file_path=relative_path,
            generated_by=int(current_user_id)
        )
        db.session.add(report)
        
        # Audit log
        audit = AuditLog(
            user_id=int(current_user_id),
            action="report:generate",
            details=f"Generated PDF report: {title} ({report_type})",
            ip_address=request.remote_addr
        )
        db.session.add(audit)
        db.session.commit()
        
        return jsonify(report.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to generate report: {str(e)}'}), 500

@reports_bp.route('/download/<path:filename>', methods=['GET'])
@jwt_required()
def download_report_file(filename):
    # Safe directory download serving
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    reports_dir = os.path.join(base_dir, 'static', 'reports')
    return send_from_directory(reports_dir, filename, as_attachment=True)
