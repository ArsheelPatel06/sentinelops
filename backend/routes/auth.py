from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token, 
    jwt_required, get_jwt_identity
)
from backend.models import db, User, AuditLog
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username/email and password are required'}), 400

    # Query user by username or email
    user = User.query.filter(
        (User.username == username) | (User.email == username)
    ).first()

    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid username or password'}), 401

    if user.status != 'active':
        return jsonify({'message': 'User account is inactive'}), 403

    # Generate tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    # Log audit event
    audit = AuditLog(
        user_id=user.id,
        action="user:login",
        details=f"Successful login for user {user.username}",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    return jsonify({'access_token': new_access_token}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user.to_dict()), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required(optional=True)
def logout():
    # In stateless JWT, logout can be handled client-side by purging tokens.
    # We can audit log this if the user is authenticated.
    user_id = get_jwt_identity()
    if user_id:
        user = db.session.get(User, int(user_id))
        if user:
            audit = AuditLog(
                user_id=user.id,
                action="user:logout",
                details=f"User {user.username} logged out",
                ip_address=request.remote_addr
            )
            db.session.add(audit)
            db.session.commit()
    return jsonify({'message': 'Logged out successfully'}), 200
