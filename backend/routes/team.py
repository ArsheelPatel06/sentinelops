from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, User, AuditLog
import logging

team_bp = Blueprint('team', __name__)
logger = logging.getLogger(__name__)

@team_bp.route('', methods=['GET'])
@jwt_required()
def list_team():
    users = User.query.order_by(User.joined_at.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200

@team_bp.route('', methods=['POST'])
@jwt_required()
def create_member():
    current_user_id = get_jwt_identity()
    
    # Check permissions (only Admins can add team members)
    current_user = db.session.get(User, int(current_user_id))
    if not current_user or current_user.role != 'Admin':
        return jsonify({'message': 'Only administrators can create team members'}), 403

    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password', 'Admin123!') # default password
    role = data.get('role', 'Viewer')
    status = data.get('status', 'active')

    if not username or not email:
        return jsonify({'message': 'Username and email are required'}), 400

    # Check existence
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'message': 'Username or email already exists'}), 400

    # Calculate initials
    initials = "".join([part[0].upper() for part in username.split() if part][:2])
    if not initials:
        initials = username[:2].upper()

    user = User(
        username=username,
        email=email,
        role=role,
        initials=initials,
        status=status,
        mfa_enabled=False
    )
    user.set_password(password)
    db.session.add(user)
    
    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="team:member_add",
        details=f"Added team member {username} with role {role}",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(user.to_dict()), 201

@team_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_member(user_id):
    current_user_id = get_jwt_identity()
    
    # Check permissions (only Admins can modify team members, or the user themselves)
    current_user = db.session.get(User, int(current_user_id))
    if not current_user:
        return jsonify({'message': 'Unauthorized'}), 401
        
    if current_user.role != 'Admin' and current_user.id != user_id:
        return jsonify({'message': 'Access denied'}), 403

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'message': 'Team member not found'}), 404

    data = request.get_json() or {}
    
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'role' in data and current_user.role == 'Admin': # only admins can change roles
        user.role = data['role']
    if 'status' in data and current_user.role == 'Admin': # only admins can change status
        user.status = data['status']
    if 'ssh_key' in data:
        user.ssh_key = data['ssh_key']
    if 'mfa_enabled' in data:
        user.mfa_enabled = bool(data['mfa_enabled'])
    if 'password' in data:
        user.set_password(data['password'])

    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="team:member_update",
        details=f"Updated team member {user.username} settings",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(user.to_dict()), 200
