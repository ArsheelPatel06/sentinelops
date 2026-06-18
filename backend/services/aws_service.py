import boto3
from botocore.exceptions import NoCredentialsError, ClientError
import logging
from backend.config import Config

logger = logging.getLogger(__name__)

class AWSService:
    def __init__(self):
        self.enabled = False
        self.is_configured = False
        if Config.AWS_ACCESS_KEY_ID and Config.AWS_SECRET_ACCESS_KEY:
            try:
                self.session = boto3.Session(
                    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
                    region_name=Config.AWS_DEFAULT_REGION
                )
                self.ec2 = self.session.client('ec2')
                self.rds = self.session.client('rds')
                self.s3 = self.session.client('s3')
                self.cloudwatch = self.session.client('cloudwatch')
                self.enabled = True
                self.is_configured = True
            except Exception as e:
                logger.warning(f"AWS initialization failed, running in mock mode: {e}")

    def list_ec2_instances(self):
        if not self.enabled:
            return self._get_mock_ec2()
        try:
            response = self.ec2.describe_instances()
            instances = []
            for reservation in response.get('Reservations', []):
                for instance in reservation.get('Instances', []):
                    instance_id = instance['InstanceId']
                    name = ""
                    for tag in instance.get('Tags', []):
                        if tag['Key'] == 'Name':
                            name = tag['Value']
                    
                    cpu_metric = 0.0
                    if self.enabled:
                        try:
                            cpu_metric = self.get_metric('AWS/EC2', 'CPUUtilization', [{'Name': 'InstanceId', 'Value': instance_id}])
                        except Exception as ex:
                            logger.warning(f"Failed to fetch CPU metric for {instance_id}: {ex}")

                    instances.append({
                        'id': instance_id,
                        'name': name or instance_id,
                        'type': 'ec2',
                        'status': instance['State']['Name'],
                        'region': instance['Placement']['AvailabilityZone'],
                        'cpu': cpu_metric,
                        'metadata': {
                            'InstanceType': instance['InstanceType'],
                            'PublicIp': instance.get('PublicIpAddress', 'N/A'),
                            'PrivateIp': instance.get('PrivateIpAddress', 'N/A')
                        },
                        'launch_time': instance['LaunchTime'].strftime("%Y-%m-%d %H:%M:%S") if 'LaunchTime' in instance else None
                    })
            return instances
        except Exception as e:
            logger.error(f"Error querying EC2: {e}")
            return self._get_mock_ec2()

    def list_rds_instances(self):
        if not self.enabled:
            return self._get_mock_rds()
        try:
            response = self.rds.describe_db_instances()
            instances = []
            for db in response.get('DBInstances', []):
                db_id = db['DBInstanceIdentifier']
                cpu_metric = 0.0
                connections_metric = 0
                if self.enabled:
                    try:
                        cpu_metric = self.get_metric('AWS/RDS', 'CPUUtilization', [{'Name': 'DBInstanceIdentifier', 'Value': db_id}])
                        connections_metric = int(self.get_metric('AWS/RDS', 'DatabaseConnections', [{'Name': 'DBInstanceIdentifier', 'Value': db_id}]))
                    except Exception as ex:
                        logger.warning(f"Failed to fetch RDS metrics for {db_id}: {ex}")

                instances.append({
                    'id': db_id,
                    'name': db_id,
                    'type': 'rds',
                    'status': db['DBInstanceStatus'],
                    'region': db['AvailabilityZone'],
                    'cpu': cpu_metric,
                    'connections': connections_metric,
                    'metadata': {
                        'Engine': f"{db['Engine']} {db['EngineVersion']}",
                        'Class': db['DBInstanceClass'],
                        'Storage': f"{db['AllocatedStorage']} GB",
                        'Endpoint': db.get('Endpoint', {}).get('Address', f"{db_id}.rds.amazonaws.com")
                    },
                    'launch_time': db['InstanceCreateTime'].strftime("%Y-%m-%d %H:%M:%S") if 'InstanceCreateTime' in db else None
                })
            return instances
        except Exception as e:
            logger.error(f"Error querying RDS: {e}")
            return self._get_mock_rds()

    def list_s3_buckets(self):
        if not self.enabled:
            return self._get_mock_s3()
        try:
            response = self.s3.list_buckets()
            buckets = []
            for bucket in response.get('Buckets', []):
                bucket_name = bucket['Name']
                bucket_region = Config.AWS_DEFAULT_REGION or 'ap-south-1'
                versioning_status = 'Suspended'
                
                try:
                    loc = self.s3.get_bucket_location(Bucket=bucket_name)
                    loc_constraint = loc.get('LocationConstraint')
                    if loc_constraint:
                        if loc_constraint == 'EU':
                            bucket_region = 'eu-west-1'
                        else:
                            bucket_region = loc_constraint
                    else:
                        bucket_region = 'us-east-1'
                except Exception as ex:
                    logger.warning(f"Could not get bucket location for {bucket_name}: {ex}")
                
                try:
                    ver = self.s3.get_bucket_versioning(Bucket=bucket_name)
                    versioning_status = ver.get('Status', 'Suspended')
                except Exception as ex:
                    logger.warning(f"Could not get bucket versioning for {bucket_name}: {ex}")

                buckets.append({
                    'id': bucket_name,
                    'name': bucket_name,
                    'type': 's3',
                    'status': 'active',
                    'region': bucket_region,
                    'metadata': {
                        'Versioning': versioning_status,
                        'Region': bucket_region
                    },
                    'launch_time': bucket['CreationDate'].strftime("%Y-%m-%d %H:%M:%S") if 'CreationDate' in bucket else None
                })
            return buckets
        except Exception as e:
            logger.error(f"Error querying S3: {e}")
            return self._get_mock_s3()

    def list_all_resources(self):
        return self.list_ec2_instances() + self.list_rds_instances() + self.list_s3_buckets()

    def get_metric(self, namespace, metric_name, dimensions):
        if not self.enabled:
            import random
            return round(random.uniform(5.0, 45.0), 1)
        try:
            # Simple wrapper to get CPU utilization or metrics from CloudWatch
            from datetime import datetime, timedelta
            end_time = datetime.utcnow()
            start_time = end_time - timedelta(minutes=10)
            response = self.cloudwatch.get_metric_statistics(
                Namespace=namespace,
                MetricName=metric_name,
                Dimensions=dimensions,
                StartTime=start_time,
                EndTime=end_time,
                Period=300,
                Statistics=['Average']
            )
            datapoints = response.get('Datapoints', [])
            if datapoints:
                return round(datapoints[-1]['Average'], 1)
            return 0.0
        except Exception as e:
            logger.error(f"Error fetching CloudWatch metrics: {e}")
            import random
            return round(random.uniform(5.0, 45.0), 1)

    def _get_mock_ec2(self):
        return [{
            'id': 'i-0a1b2c3d4e5f60001',
            'name': 'web-prod-1',
            'type': 'ec2',
            'status': 'running',
            'region': 'ap-south-1a',
            'metadata': {
                'InstanceType': 't3.large',
                'PublicIp': '13.233.12.98',
                'PrivateIp': '172.31.10.4'
            },
            'launch_time': '2025-10-12 08:30:22'
        }]

    def _get_mock_rds(self):
        return [{
            'id': 'db-sentinelops-prod',
            'name': 'sentinelops-prod',
            'type': 'rds',
            'status': 'available',
            'region': 'ap-south-1a',
            'metadata': {
                'Engine': 'PostgreSQL 16.1',
                'Class': 'db.t3.large',
                'Storage': '100 GB'
            },
            'launch_time': '2025-10-12 09:00:15'
        }]

    def _get_mock_s3(self):
        return [{
            'id': 's3-sentinelops-backups',
            'name': 'sentinelops-backups-ap-south-1',
            'type': 's3',
            'status': 'active',
            'region': 'ap-south-1',
            'metadata': {
                'Versioning': 'Enabled',
                'Region': 'ap-south-1'
            },
            'launch_time': '2025-10-12 09:30:00'
        }]
