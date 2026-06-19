from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Task, AuditLog
import time
import uuid

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('', methods=['GET'])
@jwt_required()
def list_tasks():
    tasks = Task.query.all()
    return jsonify([t.to_dict() for t in tasks]), 200

@tasks_bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    title = data.get('title')
    desc = data.get('desc', '')
    priority = data.get('priority', 'p4')
    project_id = data.get('project_id') or data.get('project')
    assignee_id = data.get('assignee_id') or data.get('assignee')
    tags_data = data.get('tags', '')
    if isinstance(tags_data, list):
        tags = ','.join(tags_data)
    else:
        tags = str(tags_data or '')
    column_name = data.get('column_name', 'backlog')
    due = data.get('due')

    if not title:
        return jsonify({'message': 'Task title is required'}), 400

    task_id = f"t-{uuid.uuid4().hex[:6]}"
    task = Task(
        id=task_id,
        title=title,
        desc=desc,
        priority=priority,
        project_id=project_id if project_id else None,
        assignee_id=int(assignee_id) if assignee_id else None,
        tags=tags,
        column_name=column_name,
        due=due,
        createdAt=int(time.time() * 1000)
    )
    
    db.session.add(task)
    
    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="task:create",
        details=f"Created task {title} ({task_id})",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    # Emit real-time update
    socketio = current_app.extensions.get('socketio')
    if socketio:
        socketio.emit('task_update', task.to_dict())

    return jsonify(task.to_dict()), 201

@tasks_bp.route('/<task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    current_user_id = get_jwt_identity()
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404

    data = request.get_json() or {}
    if 'title' in data:
        task.title = data['title']
    if 'desc' in data:
        task.desc = data['desc']
    if 'priority' in data:
        task.priority = data['priority']
    if 'column_name' in data:
        task.column_name = data['column_name']
    if 'assignee_id' in data or 'assignee' in data:
        val = data.get('assignee_id') or data.get('assignee')
        task.assignee_id = int(val) if val else None
    if 'project_id' in data or 'project' in data:
        val = data.get('project_id') or data.get('project')
        task.project_id = val if val else None
    if 'tags' in data:
        tags_data = data['tags']
        if isinstance(tags_data, list):
            task.tags = ','.join(tags_data)
        else:
            task.tags = str(tags_data or '')
    if 'due' in data:
        task.due = data['due']

    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="task:update",
        details=f"Updated task {task.title} ({task_id})",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    # Emit real-time update
    socketio = current_app.extensions.get('socketio')
    if socketio:
        socketio.emit('task_update', task.to_dict())

    return jsonify(task.to_dict()), 200

@tasks_bp.route('/<task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = get_jwt_identity()
    task = db.session.get(Task, task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404

    task_title = task.title
    db.session.delete(task)
    
    # Audit log
    audit = AuditLog(
        user_id=int(current_user_id),
        action="task:delete",
        details=f"Deleted task {task_title} ({task_id})",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    # Emit real-time update
    socketio = current_app.extensions.get('socketio')
    if socketio:
        socketio.emit('task_update', {'id': task_id, 'deleted': True})

    return jsonify({'message': f'Task "{task_title}" deleted successfully'}), 200
