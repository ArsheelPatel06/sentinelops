from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False, unique=True, index=True)
    email = db.Column(db.String(100), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='Viewer')
    initials = db.Column(db.String(10))
    joined_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    status = db.Column(db.String(20), default='active')
    mfa_enabled = db.Column(db.Boolean, default=False)
    ssh_key = db.Column(db.Text)
    api_token = db.Column(db.String(255), unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    # Relationships
    projects = db.relationship('Project', backref='owner', lazy=True)
    assigned_vulns = db.relationship('Vuln', backref='assignee', lazy=True)
    assigned_tasks = db.relationship('Task', backref='assignee', lazy=True)
    reports = db.relationship('Report', backref='generator', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    audit_logs = db.relationship('AuditLog', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'initials': self.initials,
            'joined_at': self.joined_at.isoformat() if self.joined_at else None,
            'status': self.status,
            'mfa_enabled': bool(self.mfa_enabled),
            'ssh_key': self.ssh_key,
            'api_token': self.api_token
        }


class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    repo = db.Column(db.String(150), nullable=False)
    desc = db.Column(db.Text)
    envs = db.Column(db.String(255), nullable=False, default='dev')
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    language = db.Column(db.String(50))
    branch = db.Column(db.String(50), default='main')
    status = db.Column(db.String(50), default='healthy', index=True)
    deploys = db.Column(db.Integer, default=0)
    successRate = db.Column(db.Numeric(5, 2), default=100.00)
    lastDeploy = db.Column(db.BigInteger)
    createdAt = db.Column(db.BigInteger)

    # Relationships
    pipelines = db.relationship('Pipeline', backref='project', lazy=True, cascade='all, delete-orphan')
    vulns = db.relationship('Vuln', backref='project', lazy=True, cascade='all, delete-orphan')
    tasks = db.relationship('Task', backref='project', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'repo': self.repo,
            'desc': self.desc,
            'envs': self.envs,
            'owner_id': self.owner_id,
            'language': self.language,
            'branch': self.branch,
            'status': self.status,
            'deploys': self.deploys,
            'successRate': float(self.successRate) if self.successRate is not None else 100.0,
            'lastDeploy': self.lastDeploy,
            'createdAt': self.createdAt
        }


class Pipeline(db.Model):
    __tablename__ = 'pipelines'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    project_id = db.Column(db.String(50), db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False, index=True)
    branch = db.Column(db.String(50), default='main')
    trigger = db.Column(db.String(50), default='push')
    status = db.Column(db.String(50), default='pending', index=True)
    number = db.Column(db.String(50))
    commit = db.Column(db.String(50))
    author = db.Column(db.String(100))
    startTime = db.Column(db.BigInteger)
    duration = db.Column(db.String(50))

    # Relationships
    stages = db.relationship('PipelineStage', backref='pipeline', lazy=True, cascade='all, delete-orphan', order_by='PipelineStage.sort_order')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'project_id': self.project_id,
            'branch': self.branch,
            'trigger': self.trigger,
            'status': self.status,
            'number': self.number,
            'commit': self.commit,
            'author': self.author,
            'startTime': self.startTime,
            'duration': self.duration,
            'stages': [s.to_dict() for s in self.stages]
        }


class PipelineStage(db.Model):
    __tablename__ = 'pipeline_stages'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pipeline_id = db.Column(db.String(50), db.ForeignKey('pipelines.id', ondelete='CASCADE'), nullable=False)
    stage_name = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default='pending')
    duration = db.Column(db.String(50))
    sort_order = db.Column(db.Integer, nullable=False)

    __table_args__ = (
        db.UniqueConstraint('pipeline_id', 'stage_name', name='uniq_pipeline_stage'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'pipeline_id': self.pipeline_id,
            'stage_name': self.stage_name,
            'status': self.status,
            'duration': self.duration,
            'sort_order': self.sort_order
        }


class Vuln(db.Model):
    __tablename__ = 'vulns'
    
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    severity = db.Column(db.String(50), nullable=False, index=True)
    cve = db.Column(db.String(50), nullable=False)
    project_id = db.Column(db.String(50), db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False, index=True)
    component = db.Column(db.String(100))
    status = db.Column(db.String(50), default='open', index=True)
    assignee_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    detectedAt = db.Column(db.BigInteger)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'severity': self.severity,
            'cve': self.cve,
            'project_id': self.project_id,
            'component': self.component,
            'status': self.status,
            'assignee_id': self.assignee_id,
            'detectedAt': self.detectedAt
        }


class Container(db.Model):
    __tablename__ = 'containers'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default='stopped')
    cpu = db.Column(db.String(50), default='0%')
    memory = db.Column(db.String(50), default='0MB')
    ports = db.Column(db.String(100))
    created_at = db.Column(db.BigInteger)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'image': self.image,
            'status': self.status,
            'cpu': self.cpu,
            'memory': self.memory,
            'ports': self.ports,
            'created_at': self.created_at
        }


class CloudResource(db.Model):
    __tablename__ = 'cloud_resources'
    
    id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    region = db.Column(db.String(50), nullable=False)
    meta_data = db.Column('metadata', db.Text)
    launch_time = db.Column(db.String(100))

    def to_dict(self):
        meta_dict = {}
        if self.meta_data:
            try:
                meta_dict = json.loads(self.meta_data)
            except Exception:
                meta_dict = {'raw': self.meta_data}
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'status': self.status,
            'region': self.region,
            'metadata': meta_dict,
            'launch_time': self.launch_time
        }


class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    desc = db.Column(db.Text)
    priority = db.Column(db.String(50), default='p4')
    project_id = db.Column(db.String(50), db.ForeignKey('projects.id', ondelete='SET NULL'))
    assignee_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    tags = db.Column(db.String(255))
    column_name = db.Column(db.String(50), default='backlog', index=True)
    due = db.Column(db.BigInteger)
    createdAt = db.Column(db.BigInteger)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'desc': self.desc,
            'priority': self.priority,
            'project_id': self.project_id,
            'assignee_id': self.assignee_id,
            'tags': self.tags,
            'column_name': self.column_name,
            'due': self.due,
            'createdAt': self.createdAt
        }


class Report(db.Model):
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    generated_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    generated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'file_path': self.file_path,
            'generated_by': self.generated_by,
            'generated_at': self.generated_at.isoformat() if self.generated_at else None
        }


class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    unread = db.Column(db.Boolean, default=True, index=True)
    icon = db.Column(db.String(10))
    cls = db.Column(db.String(50), default='neutral')
    text = db.Column(db.Text, nullable=False)
    time = db.Column(db.BigInteger, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'unread': bool(self.unread),
            'icon': self.icon,
            'cls': self.cls,
            'text': self.text,
            'time': self.time
        }


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))
    action = db.Column(db.String(100), nullable=False, index=True)
    details = db.Column(db.Text)
    ip_address = db.Column(db.String(45))
    timestamp = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'action': self.action,
            'details': self.details,
            'ip_address': self.ip_address,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }


class Settings(db.Model):
    __tablename__ = 'settings'
    
    id = db.Column(db.Integer, primary_key=True, default=1)
    app_name = db.Column(db.String(100), default='SentinelOps')
    app_domain = db.Column(db.String(100), default='sentinelops.io')
    app_timezone = db.Column(db.String(50), default='Asia/Kolkata')
    app_defaultEnv = db.Column(db.String(50), default='production')
    smtp_host = db.Column(db.String(100), default='smtp.gmail.com')
    smtp_port = db.Column(db.Integer, default=587)
    smtp_user = db.Column(db.String(100), default='ops@sentinelops.io')
    smtp_from = db.Column(db.String(100), default='SentinelOps <ops@sentinelops.io>')
    smtp_tls = db.Column(db.Boolean, default=True)
    db_host = db.Column(db.String(255), default='localhost')
    db_port = db.Column(db.Integer, default=3306)
    db_name = db.Column(db.String(100), default='sentinelops_db')
    db_user = db.Column(db.String(100), default='root')
    db_pool = db.Column(db.Integer, default=20)
    security_mfa = db.Column(db.Boolean, default=True)
    security_ssoEnabled = db.Column(db.Boolean, default=False)
    security_sessionTimeout = db.Column(db.Integer, default=480)
    security_ipWhitelist = db.Column(db.Boolean, default=False)
    security_auditLog = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'app': {
                'name': self.app_name,
                'domain': self.app_domain,
                'timezone': self.app_timezone,
                'defaultEnv': self.app_defaultEnv
            },
            'smtp': {
                'host': self.smtp_host,
                'port': self.smtp_port,
                'user': self.smtp_user,
                'from': self.smtp_from,
                'tls': bool(self.smtp_tls)
            },
            'db': {
                'host': self.db_host,
                'port': self.db_port,
                'name': self.db_name,
                'user': self.db_user,
                'pool': self.db_pool
            },
            'security': {
                'mfa': bool(self.security_mfa),
                'ssoEnabled': bool(self.security_ssoEnabled),
                'sessionTimeout': self.security_sessionTimeout,
                'ipWhitelist': bool(self.security_ipWhitelist),
                'auditLog': bool(self.security_auditLog)
            }
        }
