from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Container, AuditLog

containers_bp = Blueprint('containers', __name__)

@containers_bp.route('', methods=['GET'])
@jwt_required()
def list_containers():
    containers = Container.query.all()
    return jsonify([c.to_dict() for c in containers]), 200

@containers_bp.route('/<container_id>/start', methods=['POST'])
@jwt_required()
def start_container(container_id):
    current_user_id = get_jwt_identity()
    container = db.session.get(Container, container_id)
    if not container:
        return jsonify({'message': 'Container not found'}), 404

    container.status = 'running'
    container.cpu = '5%'  # Simulated startup load
    container.memory = '92MB'

    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="container:start",
        details=f"Started docker container {container.name} ({container_id})",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(container.to_dict()), 200

@containers_bp.route('/<container_id>/stop', methods=['POST'])
@jwt_required()
def stop_container(container_id):
    current_user_id = get_jwt_identity()
    container = db.session.get(Container, container_id)
    if not container:
        return jsonify({'message': 'Container not found'}), 404

    container.status = 'stopped'
    container.cpu = '0%'
    container.memory = '0MB'

    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="container:stop",
        details=f"Stopped docker container {container.name} ({container_id})",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(container.to_dict()), 200
