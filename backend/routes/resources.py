from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from backend.models import db, CloudResource
from backend.services.aws_service import AWSService
import json
import logging

logger = logging.getLogger(__name__)
resources_bp = Blueprint('resources', __name__)
aws_svc = AWSService()

@resources_bp.route('', methods=['GET'])
@jwt_required()
def list_resources():
    if aws_svc.is_configured and aws_svc.enabled:
        try:
            aws_resources = aws_svc.list_all_resources()
            if aws_resources:
                # Sync with the database
                for res in aws_resources:
                    try:
                        db_res = CloudResource.query.filter_by(id=res['id']).first()
                        if not db_res:
                            db_res = CloudResource(id=res['id'])
                            db.session.add(db_res)
                        db_res.name = res['name']
                        db_res.type = res['type']
                        db_res.status = res['status']
                        db_res.region = res['region']
                        db_res.launch_time = res.get('launch_time')
                        
                        meta = res.get('metadata', {})
                        if 'cpu' in res:
                            meta['cpu'] = res['cpu']
                        if 'connections' in res:
                            meta['connections'] = res['connections']
                        db_res.meta_data = json.dumps(meta)
                    except Exception as sync_item_err:
                        logger.warning(f"Could not sync resource item {res.get('id')}: {sync_item_err}")
                
                db.session.commit()
                return jsonify(aws_resources), 200
        except Exception as e:
            db.session.rollback()
            logger.warning(f"Failed to fetch and sync live AWS resources, falling back to DB: {e}")
            
    # Fallback to database
    try:
        db_resources = CloudResource.query.all()
        if db_resources:
            resources_list = []
            for r in db_resources:
                d = r.to_dict()
                if 'cpu' in d['metadata']:
                    d['cpu'] = d['metadata']['cpu']
                if 'connections' in d['metadata']:
                    d['connections'] = d['metadata']['connections']
                resources_list.append(d)
            return jsonify(resources_list), 200
    except Exception as db_err:
        logger.error(f"Failed to query cloud_resources from DB: {db_err}")

    # Final fallback to mock resources from service
    mock_resources = aws_svc._get_mock_ec2() + aws_svc._get_mock_rds() + aws_svc._get_mock_s3()
    return jsonify(mock_resources), 200

@resources_bp.route('/<resource_id>/cpu', methods=['GET'])
@jwt_required()
def get_resource_cpu(resource_id):
    # Call CloudWatch metrics
    namespace = 'AWS/EC2' if 'i-' in resource_id else 'AWS/RDS'
    metric = 'CPUUtilization'
    dimensions = [{'Name': 'InstanceId' if 'i-' in resource_id else 'DBInstanceIdentifier', 'Value': resource_id}]
    
    cpu = aws_svc.get_metric(namespace, metric, dimensions)
    return jsonify({'resource_id': resource_id, 'cpu': cpu}), 200
