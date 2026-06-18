from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Pipeline, PipelineStage, Project, AuditLog
from backend.services.jenkins_service import JenkinsService
import time
import uuid
import threading

pipelines_bp = Blueprint('pipelines', __name__)
jenkins_svc = JenkinsService()

@pipelines_bp.route('', methods=['GET'])
@jwt_required()
def list_pipelines():
    pipelines = Pipeline.query.order_by(Pipeline.startTime.desc()).all()
    return jsonify([p.to_dict() for p in pipelines]), 200

@pipelines_bp.route('/<pipeline_id>', methods=['GET'])
@jwt_required()
def get_pipeline(pipeline_id):
    pipeline = db.session.get(Pipeline, pipeline_id)
    if not pipeline:
        return jsonify({'message': 'Pipeline not found'}), 404
    return jsonify(pipeline.to_dict()), 200

@pipelines_bp.route('/<pipeline_id>/log', methods=['GET'])
@jwt_required()
def get_pipeline_log(pipeline_id):
    pipeline = db.session.get(Pipeline, pipeline_id)
    if not pipeline:
        return jsonify({'message': 'Pipeline not found'}), 404
    
    log_content = jenkins_svc.get_build_log(pipeline.project_id, pipeline.number)
    return jsonify({'log': log_content}), 200

@pipelines_bp.route('/trigger', methods=['POST'])
@jwt_required()
def trigger_new_pipeline():
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    project_id = data.get('project_id')
    branch = data.get('branch', 'main')

    if not project_id:
        return jsonify({'message': 'Project ID is required'}), 400

    project = db.session.get(Project, project_id)
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    # Determine build number based on total deploys
    project.deploys += 1
    build_num = f"#{project.deploys}"
    
    pipeline_id = f"pl-{uuid.uuid4().hex[:6]}"
    pipeline = Pipeline(
        id=pipeline_id,
        name=f"{project.name} · {branch}",
        project_id=project_id,
        branch=branch,
        trigger='manual',
        status='running',
        number=build_num,
        commit=uuid.uuid4().hex[:7],
        author='API Operator',
        startTime=int(time.time() * 1000),
        duration=None
    )
    
    db.session.add(pipeline)
    
    stages_list = ['code', 'build', 'test', 'scan', 'docker', 'deploy']
    for idx, stage_name in enumerate(stages_list):
        stage = PipelineStage(
            pipeline_id=pipeline_id,
            stage_name=stage_name,
            status='running' if idx == 0 else 'pending',
            duration=None,
            sort_order=idx + 1
        )
        db.session.add(stage)
        
    audit = AuditLog(
        user_id=int(current_user_id),
        action="pipeline:trigger",
        details=f"Triggered pipeline {pipeline.name} {build_num}",
        ip_address=request.remote_addr
    )
    db.session.add(audit)
    db.session.commit()

    # Launch background thread to simulate pipeline progression via Socket.IO
    # We pass the app context to ensure SQLAlchemy updates work inside the thread
    app_context = current_app._get_current_object()
    threading.Thread(
        target=simulate_pipeline_run,
        args=(app_context, pipeline_id)
    ).start()

    return jsonify(pipeline.to_dict()), 201


def simulate_pipeline_run(app, pipeline_id):
    """
    Simulates stage updates step-by-step and notifies clients via socketio.
    """
    time.sleep(2)
    
    stages_list = ['code', 'build', 'test', 'scan', 'docker', 'deploy']
    durations = ['2s', '45s', '1m 15s', '50s', '35s', '20s']
    
    socketio = app.extensions.get('socketio')
    
    with app.app_context():
        pipeline = db.session.get(Pipeline, pipeline_id)
        if not pipeline:
            return
            
        project = db.session.get(Project, pipeline.project_id)
        
        # Decide if pipeline will succeed or fail (ML project always fails for demo, or 10% chance)
        will_succeed = True
        if project and project.status == 'failed':
            will_succeed = False
            
        failed_stage_idx = 2 if not will_succeed else -1 # fail at test stage for demo
        
        for idx, stage_name in enumerate(stages_list):
            stage = PipelineStage.query.filter_by(pipeline_id=pipeline_id, stage_name=stage_name).first()
            if not stage:
                continue
                
            # Transition previous stages to done
            if idx > 0:
                prev_stage = PipelineStage.query.filter_by(pipeline_id=pipeline_id, stage_name=stages_list[idx-1]).first()
                if prev_stage and prev_stage.status == 'running':
                    prev_stage.status = 'done'
                    prev_stage.duration = durations[idx-1]
            
            # Check if this stage should fail
            if idx == failed_stage_idx:
                stage.status = 'failed'
                stage.duration = durations[idx]
                pipeline.status = 'failed'
                pipeline.duration = f"{idx * 1}m {sum([int(d.replace('s','')) for d in durations[:idx] if 's' in d])}s"
                
                if project:
                    project.status = 'failed'
                    project.successRate = max(0.0, float(project.successRate) * 0.95)
                
                db.session.commit()
                if socketio:
                    socketio.emit('pipeline_update', pipeline.to_dict())
                break
                
            # Set current stage to running
            stage.status = 'running'
            db.session.commit()
            
            if socketio:
                socketio.emit('pipeline_update', pipeline.to_dict())
                
            time.sleep(3) # Wait between stages
            
        else:
            # If all loops finished without breaking (success)
            last_stage = PipelineStage.query.filter_by(pipeline_id=pipeline_id, stage_name=stages_list[-1]).first()
            if last_stage:
                last_stage.status = 'done'
                last_stage.duration = durations[-1]
            pipeline.status = 'success'
            pipeline.duration = "3m 47s"
            
            if project:
                project.status = 'healthy'
                project.successRate = min(100.0, float(project.successRate) * 1.02)
                project.lastDeploy = int(time.time() * 1000)
                
            db.session.commit()
            if socketio:
                socketio.emit('pipeline_update', pipeline.to_dict())
