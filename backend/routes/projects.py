from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Project, User, AuditLog
import time
import uuid

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('', methods=['GET'])
@jwt_required()
def list_projects():
    projects = Project.query.all()
    return jsonify([p.to_dict() for p in projects]), 200

@projects_bp.route('', methods=['POST'])
@jwt_required()
def create_project():
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    name = data.get('name')
    repo = data.get('repo')
    desc = data.get('desc', '')
    envs = data.get('envs', 'dev')
    language = data.get('language', 'JavaScript')
    branch = data.get('branch', 'main')

    if not name or not repo:
        return jsonify({'message': 'Project name and repository are required'}), 400

    # Ensure unique project name
    if Project.query.filter_by(name=name).first():
        return jsonify({'message': f'Project with name "{name}" already exists'}), 400

    # Generate incremental/unique ID
    project_id = f"p{uuid.uuid4().hex[:6]}"
    
    project = Project(
        id=project_id,
        name=name,
        repo=repo,
        desc=desc,
        envs=envs,
        owner_id=int(current_user_id),
        language=language,
        branch=branch,
        status='healthy',
        deploys=0,
        successRate=100.00,
        createdAt=int(time.time() * 1000)
    )
    
    db.session.add(project)
    
    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="project:create",
        details=f"Created project {name} ({project_id})",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(project.to_dict()), 201

@projects_bp.route('/<project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    current_user_id = get_jwt_identity()
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    data = request.get_json() or {}
    if 'name' in data:
        project.name = data['name']
    if 'repo' in data:
        project.repo = data['repo']
    if 'desc' in data:
        project.desc = data['desc']
    if 'envs' in data:
        project.envs = data['envs']
    if 'language' in data:
        project.language = data['language']
    if 'branch' in data:
        project.branch = data['branch']
    if 'status' in data:
        project.status = data['status']

    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="project:update",
        details=f"Updated project {project.name} ({project_id})",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify(project.to_dict()), 200

@projects_bp.route('/<project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    current_user_id = get_jwt_identity()
    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    project_name = project.name
    db.session.delete(project)
    
    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="project:delete",
        details=f"Deleted project {project_name} ({project_id})",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify({'message': f'Project "{project_name}" deleted successfully'}), 200
