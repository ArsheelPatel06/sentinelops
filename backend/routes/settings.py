from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Settings, User, AuditLog

settings_bp = Blueprint('settings', __name__)

@settings_bp.route('', methods=['GET'])
@jwt_required()
def get_settings():
    settings = db.session.get(Settings, 1)
    if not settings:
        # Fallback to create default setting row if missing
        settings = Settings(id=1)
        db.session.add(settings)
        db.session.commit()
    return jsonify(settings.to_dict()), 200

@settings_bp.route('', methods=['POST', 'PUT'])
@jwt_required()
def update_settings():
    current_user_id = get_jwt_identity()
    
    # Check admin privileges
    current_user = db.session.get(User, int(current_user_id))
    if not current_user or current_user.role != 'Admin':
        return jsonify({'message': 'Only administrators can update global settings'}), 403

    settings = db.session.get(Settings, 1)
    if not settings:
        settings = Settings(id=1)
        db.session.add(settings)

    data = request.get_json() or {}
    
    # General app settings
    app_data = data.get('app', {})
    if 'name' in app_data: settings.app_name = app_data['name']
    if 'domain' in app_data: settings.app_domain = app_data['domain']
    if 'timezone' in app_data: settings.app_timezone = app_data['timezone']
    if 'defaultEnv' in app_data: settings.app_defaultEnv = app_data['defaultEnv']
    
    # Mail settings
    smtp_data = data.get('smtp', {})
    if 'host' in smtp_data: settings.smtp_host = smtp_data['host']
    if 'port' in smtp_data: settings.smtp_port = int(smtp_data['port'])
    if 'user' in smtp_data: settings.smtp_user = smtp_data['user']
    if 'from' in smtp_data: settings.smtp_from = smtp_data['from']
    if 'tls' in smtp_data: settings.smtp_tls = bool(smtp_data['tls'])
    
    # DB settings
    db_data = data.get('db', {})
    if 'host' in db_data: settings.db_host = db_data['host']
    if 'port' in db_data: settings.db_port = int(db_data['port'])
    if 'name' in db_data: settings.db_name = db_data['name']
    if 'user' in db_data: settings.db_user = db_data['user']
    if 'pool' in db_data: settings.db_pool = int(db_data['pool'])
    
    # Security settings
    sec_data = data.get('security', {})
    if 'mfa' in sec_data: settings.security_mfa = bool(sec_data['mfa'])
    if 'ssoEnabled' in sec_data: settings.security_ssoEnabled = bool(sec_data['ssoEnabled'])
    if 'sessionTimeout' in sec_data: settings.security_sessionTimeout = int(sec_data['sessionTimeout'])
    if 'ipWhitelist' in sec_data: settings.security_ipWhitelist = bool(sec_data['ipWhitelist'])
    if 'auditLog' in sec_data: settings.security_auditLog = bool(sec_data['auditLog'])

    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="settings:save",
        details="Updated global application settings variables",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(settings.to_dict()), 200
