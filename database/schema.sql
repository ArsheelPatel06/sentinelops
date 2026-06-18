-- SentinelOps MySQL Database Schema (Production Ready)
-- Set up database tables, constraints, foreign keys, indexes, and initial admin credentials.

CREATE DATABASE IF NOT EXISTS sentinelops_db;
USE sentinelops_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Viewer', -- Admin, DevOps Engineer, Security Engineer, Viewer
  initials VARCHAR(10),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive
  mfa_enabled TINYINT(1) DEFAULT 0,
  ssh_key TEXT,
  api_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_username (username),
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  repo VARCHAR(150) NOT NULL,
  `desc` TEXT,
  envs VARCHAR(255) NOT NULL DEFAULT 'dev', -- Comma-separated: dev,staging,prod
  owner_id INT,
  language VARCHAR(50),
  branch VARCHAR(50) DEFAULT 'main',
  status VARCHAR(50) DEFAULT 'healthy', -- healthy, warning, failed
  deploys INT DEFAULT 0,
  successRate DECIMAL(5,2) DEFAULT 100.00,
  lastDeploy BIGINT,
  createdAt BIGINT,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_projects_status (status)
) ENGINE=InnoDB;

-- 3. Pipelines Table
CREATE TABLE IF NOT EXISTS pipelines (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  project_id VARCHAR(50) NOT NULL,
  branch VARCHAR(50) DEFAULT 'main',
  `trigger` VARCHAR(50) DEFAULT 'push', -- push, pr, manual, schedule
  status VARCHAR(50) DEFAULT 'pending', -- running, success, failed, cancelled, pending
  number VARCHAR(50),
  commit VARCHAR(50),
  author VARCHAR(100),
  startTime BIGINT,
  duration VARCHAR(50),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_pipelines_status (status),
  INDEX idx_pipelines_project_id (project_id)
) ENGINE=InnoDB;

-- 4. Pipeline Stages Table (For detailed progression)
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pipeline_id VARCHAR(50) NOT NULL,
  stage_name VARCHAR(50) NOT NULL, -- code, build, test, scan, docker, deploy
  status VARCHAR(50) DEFAULT 'pending', -- done, running, failed, pending
  duration VARCHAR(50),
  sort_order INT NOT NULL,
  FOREIGN KEY (pipeline_id) REFERENCES pipelines(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_pipeline_stage (pipeline_id, stage_name)
) ENGINE=InnoDB;

-- 5. Vulnerabilities Table
CREATE TABLE IF NOT EXISTS vulns (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  severity VARCHAR(50) NOT NULL, -- critical, high, medium, low
  cve VARCHAR(50) NOT NULL,
  project_id VARCHAR(50) NOT NULL,
  component VARCHAR(100),
  status VARCHAR(50) DEFAULT 'open', -- open, in_progress, fixed
  assignee_id INT,
  detectedAt BIGINT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_vulns_severity (severity),
  INDEX idx_vulns_status (status),
  INDEX idx_vulns_project (project_id)
) ENGINE=InnoDB;

-- 6. Containers Table
CREATE TABLE IF NOT EXISTS containers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'stopped', -- running, stopped, error
  cpu VARCHAR(50) DEFAULT '0%',
  memory VARCHAR(50) DEFAULT '0MB',
  ports VARCHAR(100),
  created_at BIGINT
) ENGINE=InnoDB;

-- 7. Cloud Resources Table
CREATE TABLE IF NOT EXISTS cloud_resources (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- ec2, rds, s3, subnet, loadbalancer
  status VARCHAR(50) NOT NULL, -- running, stopped, available, active
  region VARCHAR(50) NOT NULL,
  metadata TEXT, -- JSON configuration or other details
  launch_time VARCHAR(100)
) ENGINE=InnoDB;

-- 8. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  `desc` TEXT,
  priority VARCHAR(50) DEFAULT 'p4', -- p1, p2, p3, p4
  project_id VARCHAR(50),
  assignee_id INT,
  tags VARCHAR(255), -- Comma-separated tags
  column_name VARCHAR(50) DEFAULT 'backlog', -- backlog, inprogress, review, completed
  due BIGINT,
  createdAt BIGINT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tasks_column (column_name)
) ENGINE=InnoDB;

-- 9. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- deployment, security, compliance, cost
  file_path VARCHAR(255) NOT NULL,
  generated_by INT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  unread TINYINT(1) DEFAULT 1,
  icon VARCHAR(10),
  cls VARCHAR(50) DEFAULT 'neutral', -- danger, success, warning, blue, neutral
  text TEXT NOT NULL,
  time BIGINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_unread (unread)
) ENGINE=InnoDB;

-- 11. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL, -- user:login, project:create, task:move, settings:save, etc.
  details TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_logs_action (action)
) ENGINE=InnoDB;

-- 12. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  app_name VARCHAR(100) DEFAULT 'SentinelOps',
  app_domain VARCHAR(100) DEFAULT 'sentinelops.io',
  app_timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  app_defaultEnv VARCHAR(50) DEFAULT 'production',
  smtp_host VARCHAR(100) DEFAULT 'smtp.gmail.com',
  smtp_port INT DEFAULT 587,
  smtp_user VARCHAR(100) DEFAULT 'ops@sentinelops.io',
  smtp_from VARCHAR(100) DEFAULT 'SentinelOps <ops@sentinelops.io>',
  smtp_tls TINYINT(1) DEFAULT 1,
  db_host VARCHAR(255) DEFAULT 'localhost',
  db_port INT DEFAULT 3306,
  db_name VARCHAR(100) DEFAULT 'sentinelops_db',
  db_user VARCHAR(100) DEFAULT 'root',
  db_pool INT DEFAULT 20,
  security_mfa TINYINT(1) DEFAULT 1,
  security_ssoEnabled TINYINT(1) DEFAULT 0,
  security_sessionTimeout INT DEFAULT 480,
  security_ipWhitelist TINYINT(1) DEFAULT 0,
  security_auditLog TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

-- Seed Default Settings
INSERT INTO settings (id, app_name, app_domain, app_timezone, app_defaultEnv)
VALUES (1, 'SentinelOps', 'sentinelops.io', 'Asia/Kolkata', 'production')
ON DUPLICATE KEY UPDATE app_name=app_name;

-- Seed Default Team Users
-- Password for all seed users: Admin123! (hash generated via Werkzeug security pbkdf2:sha256)
INSERT INTO users (id, username, email, password_hash, role, initials, status, joined_at, mfa_enabled, ssh_key, api_token) VALUES
(1, 'arjun', 'arjun@sentinelops.io', 'scrypt:32768:8:1$03QGFLnKVAaxaWLd$a63444bf66b9df0dc2b082787d414dec20f3efd28195bf8d6b63a12a54de4e7cf5b20750737a4ecc5f38334747b374ef19171479d139dc50c571f5324c1946f9', 'Admin', 'AS', 'active', CURRENT_TIMESTAMP, 1, 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3fW+t76jLhGvV1iL0o8P5p1ZlYkvh68RNDeQjQh6p5948fH2pS0sJvXm781pM02bNmP921iL83dM98a4eN182b...', 'so_live_8f7b9c2a1d4e6f8a'),
(2, 'priya', 'priya@sentinelops.io', 'scrypt:32768:8:1$03QGFLnKVAaxaWLd$a63444bf66b9df0dc2b082787d414dec20f3efd28195bf8d6b63a12a54de4e7cf5b20750737a4ecc5f38334747b374ef19171479d139dc50c571f5324c1946f9', 'DevOps Engineer', 'PM', 'active', CURRENT_TIMESTAMP, 0, NULL, 'so_live_b9e1234a1d4e6f8b'),
(3, 'rohan', 'rohan@sentinelops.io', 'scrypt:32768:8:1$03QGFLnKVAaxaWLd$a63444bf66b9df0dc2b082787d414dec20f3efd28195bf8d6b63a12a54de4e7cf5b20750737a4ecc5f38334747b374ef19171479d139dc50c571f5324c1946f9', 'Viewer', 'RK', 'active', CURRENT_TIMESTAMP, 0, NULL, 'so_live_c7d5678a1d4e6f8c'),
(4, 'sona', 'sona@sentinelops.io', 'scrypt:32768:8:1$03QGFLnKVAaxaWLd$a63444bf66b9df0dc2b082787d414dec20f3efd28195bf8d6b63a12a54de4e7cf5b20750737a4ecc5f38334747b374ef19171479d139dc50c571f5324c1946f9', 'Security Engineer', 'ST', 'active', CURRENT_TIMESTAMP, 1, NULL, 'so_live_d2a9012a1d4e6f8d');

-- Seed Projects
INSERT INTO projects (id, name, repo, `desc`, envs, owner_id, language, branch, status, deploys, successRate, lastDeploy, createdAt) VALUES
('p1', 'PaymentGateway-API', 'org/payment-api', 'Core payment processing API with Stripe and Razorpay integration.', 'prod,staging', 1, 'Node.js', 'main', 'healthy', 342, 98.2, 1781800000000, 1781700000000),
('p2', 'Auth-Service', 'org/auth-svc', 'OAuth2/OIDC identity provider with JWT token management.', 'prod,staging,dev', 2, 'Go', 'main', 'healthy', 218, 99.1, 1781800000000, 1781700000000),
('p3', 'Dashboard-UI', 'org/dashboard-ui', 'React-based analytics dashboard for internal teams.', 'staging,dev', 3, 'React/TS', 'develop', 'warning', 87, 91.4, 1781800000000, 1781700000000),
('p4', 'ML-Inference-Engine', 'org/ml-engine', 'Real-time ML model serving with TensorFlow Serving.', 'staging', 4, 'Python', 'main', 'failed', 34, 76.5, 1781800000000, 1781700000000);

-- Seed Pipelines
INSERT INTO pipelines (id, name, project_id, branch, `trigger`, status, number, commit, author, startTime, duration) VALUES
('pl1', 'PaymentGateway-API · main', 'p1', 'main', 'push', 'running', '#143', 'a3f8d12', 'Arjun S.', 1781800000000, NULL),
('pl2', 'Auth-Service · main', 'p2', 'main', 'push', 'success', '#89', 'b9e1234', 'Priya M.', 1781800000000, '5m 12s'),
('pl3', 'Dashboard-UI · develop', 'p3', 'develop', 'pr', 'failed', '#32', 'c7d5678', 'Rohan K.', 1781800000000, '1m 23s');

-- Seed Pipeline Stages
INSERT INTO pipeline_stages (pipeline_id, stage_name, status, duration, sort_order) VALUES
('pl1', 'code', 'done', '2s', 1),
('pl1', 'build', 'done', '45s', 2),
('pl1', 'test', 'running', NULL, 3),
('pl1', 'scan', 'pending', NULL, 4),
('pl1', 'docker', 'pending', NULL, 5),
('pl1', 'deploy', 'pending', NULL, 6),
('pl2', 'code', 'done', '1s', 1),
('pl2', 'build', 'done', '38s', 2),
('pl2', 'test', 'done', '2m 11s', 3),
('pl2', 'scan', 'done', '1m 4s', 4),
('pl2', 'docker', 'done', '55s', 5),
('pl2', 'deploy', 'done', '23s', 6),
('pl3', 'code', 'done', '1s', 1),
('pl3', 'build', 'done', '1m 22s', 2),
('pl3', 'test', 'failed', NULL, 3),
('pl3', 'scan', 'pending', NULL, 4),
('pl3', 'docker', 'pending', NULL, 5),
('pl3', 'deploy', 'pending', NULL, 6);

-- Seed Vulnerabilities
INSERT INTO vulns (id, title, severity, cve, project_id, component, status, assignee_id, detectedAt) VALUES
('v1', 'Remote Code Execution in Apache Log4j2', 'critical', 'CVE-2021-44228', 'p1', 'log4j-core-2.14.1.jar', 'open', 4, 1781700000000),
('v2', 'Prototype Pollution in lodash', 'high', 'CVE-2020-8203', 'p1', 'lodash-4.17.15.js', 'open', NULL, 1781700000000),
('v3', 'SQL Injection in Hibernate ORM', 'critical', 'CVE-2022-25857', 'p2', 'hibernate-core-5.6.0.jar', 'fixed', 4, 1781700000000);

-- Seed Containers
INSERT INTO containers (id, name, image, status, cpu, memory, ports, created_at) VALUES
('c1', 'payment-api-prod', 'sentinelops/payment-api:v2.4.1', 'running', '12%', '142MB', '8080:8080', 1781700000000),
('c2', 'auth-svc-prod', 'sentinelops/auth-svc:v1.8.3', 'running', '4%', '88MB', '8081:8081', 1781700000000),
('c3', 'dashboard-ui-staging', 'sentinelops/dashboard-ui:develop', 'stopped', '0%', '0MB', '3000:80', 1781700000000);

-- Seed Cloud Resources
INSERT INTO cloud_resources (id, name, type, status, region, metadata, launch_time) VALUES
('i-0a1b2c3d4e5f60001', 'web-prod-1', 'ec2', 'running', 'ap-south-1a', '{"InstanceType":"t3.large","PublicIp":"13.233.12.98","PrivateIp":"172.31.10.4"}', '2025-10-12 08:30:22'),
('db-sentinelops-prod', 'sentinelops-prod', 'rds', 'available', 'ap-south-1a', '{"Engine":"PostgreSQL 16.1","Class":"db.t3.large","Storage":"100 GB"}', '2025-10-12 09:00:15'),
('s3-sentinelops-backups', 'sentinelops-backups-ap-south-1', 's3', 'active', 'ap-south-1', '{"Versioning":"Enabled","Region":"ap-south-1"}', NULL);

-- Seed Tasks
INSERT INTO tasks (id, title, `desc`, priority, project_id, assignee_id, tags, column_name, due, createdAt) VALUES
('t1', 'Implement Redis caching for session tokens', 'Reduce DB load by caching JWT session data in Redis with a 15-minute TTL.', 'p1', 'p2', 2, 'backend,performance', 'backlog', 1782000000000, 1781700000000),
('t2', 'Add rate limiting to /api/v1/payment endpoint', 'Implement sliding window rate limiting (100 req/min per IP).', 'p2', 'p1', 1, 'security,api', 'backlog', 1782100000000, 1781700000000),
('t3', 'Write load test for Auth-Service', 'k6 load test targeting 10k concurrent users for 5 minutes.', 'p3', 'p2', NULL, 'testing', 'backlog', 1782200000000, 1781700000000),
('t4', 'Migrate PostgreSQL from v14 to v16', 'Zero-downtime migration using pg_logical replication.', 'p1', 'p1', NULL, 'database,infra', 'inprogress', 1781900000000, 1781700000000),
('t5', 'Configure CloudWatch alarms for RDS metrics', 'Set alarms for CPU > 80%, connections > 80% of limit.', 'p2', NULL, 3, 'aws,monitoring', 'inprogress', 1782000000000, 1781700000000);

-- Seed Notifications
INSERT INTO notifications (user_id, unread, icon, cls, text, time) VALUES
(1, 1, '🔴', 'danger', '<strong>Critical:</strong> CVE-2024-3094 detected in Auth-Service', 1781800000000),
(1, 1, '🚀', 'blue', '<strong>Deploy success:</strong> Auth-Service v1.8.3 is live', 1781800000000),
(1, 0, '⚠️', 'warning', '<strong>Pipeline failed:</strong> Dashboard-UI #32 test stage', 1781800000000),
(1, 0, '✅', 'green', '<strong>Scan complete:</strong> No new vulnerabilities found', 1781800000000);
