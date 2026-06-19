'use strict';

/* ================================================================
   DATA STORE  — source of truth, all mutations go through AppState
================================================================ */
const DB = {
  projects: [
    { id:'p1', name:'PaymentGateway-API', repo:'org/payment-api', desc:'Core payment processing API with Stripe and Razorpay integration.', envs:['prod','staging'], owner:'m1', language:'Node.js', branch:'main', status:'healthy', deploys:342, successRate:98.2, lastDeploy:Date.now()-2*60*1000, createdAt:Date.now()-30*86400*1000 },
    { id:'p2', name:'Auth-Service', repo:'org/auth-svc', desc:'OAuth2/OIDC identity provider with JWT token management.', envs:['prod','staging','dev'], owner:'m2', language:'Go', branch:'main', status:'healthy', deploys:218, successRate:99.1, lastDeploy:Date.now()-45*60*1000, createdAt:Date.now()-60*86400*1000 },
    { id:'p3', name:'Dashboard-UI', repo:'org/dashboard-ui', desc:'React-based analytics dashboard for internal teams.', envs:['staging','dev'], owner:'m3', language:'React/TS', branch:'develop', status:'warning', deploys:87, successRate:91.4, lastDeploy:Date.now()-3*3600*1000, createdAt:Date.now()-15*86400*1000 },
    { id:'p4', name:'ML-Inference-Engine', repo:'org/ml-engine', desc:'Real-time ML model serving with TensorFlow Serving.', envs:['staging'], owner:'m4', language:'Python', branch:'main', status:'failed', deploys:34, successRate:76.5, lastDeploy:Date.now()-6*3600*1000, createdAt:Date.now()-7*86400*1000 },
    { id:'p5', name:'Notification-Service', repo:'org/notif-svc', desc:'Multi-channel notification delivery (email, SMS, push).', envs:['prod','staging'], owner:'m1', language:'Python', branch:'main', status:'healthy', deploys:156, successRate:97.8, lastDeploy:Date.now()-30*60*1000, createdAt:Date.now()-45*86400*1000 },
    { id:'p6', name:'Data-Pipeline', repo:'org/data-pipeline', desc:'ETL pipeline for analytics data warehousing using Apache Spark.', envs:['prod'], owner:'m5', language:'Scala', branch:'main', status:'healthy', deploys:62, successRate:95.2, lastDeploy:Date.now()-2*3600*1000, createdAt:Date.now()-90*86400*1000 },
  ],
  pipelines: [
    { id:'pl1', name:'PaymentGateway-API · main', project:'p1', branch:'main', trigger:'push', status:'running', stages:['code','build','test','scan','docker','deploy'], stageStatus:['done','done','running','pending','pending','pending'], stageTimes:['2s','45s',null,null,null,null], number:'#143', commit:'a3f8d12', author:'Arjun S.', startTime:Date.now()-90*1000, duration:null },
    { id:'pl2', name:'Auth-Service · main', project:'p2', branch:'main', trigger:'push', status:'success', stages:['code','build','test','scan','docker','deploy'], stageStatus:['done','done','done','done','done','done'], stageTimes:['1s','38s','2m 11s','1m 4s','55s','23s'], number:'#89', commit:'b9e1234', author:'Priya M.', startTime:Date.now()-25*60*1000, duration:'5m 12s' },
    { id:'pl3', name:'Dashboard-UI · develop', project:'p3', branch:'develop', trigger:'pr', status:'failed', stages:['code','build','test','scan','docker','deploy'], stageStatus:['done','done','failed','pending','pending','pending'], stageTimes:['1s','1m 22s',null,null,null,null], number:'#32', commit:'c7d5678', author:'Rohan K.', startTime:Date.now()-3*3600*1000, duration:'1m 23s' },
    { id:'pl4', name:'ML-Inference-Engine · main', project:'p4', branch:'main', trigger:'manual', status:'failed', stages:['code','build','test','scan','docker','deploy'], stageStatus:['done','failed','pending','pending','pending','pending'], stageTimes:['1s',null,null,null,null,null], number:'#15', commit:'d2a9012', author:'Sona T.', startTime:Date.now()-6*3600*1000, duration:'48s' },
    { id:'pl5', name:'Notification-Service · main', project:'p5', branch:'main', trigger:'schedule', status:'success', stages:['code','build','test','scan','docker','deploy'], stageStatus:['done','done','done','done','done','done'], stageTimes:['1s','32s','1m 48s','44s','38s','19s'], number:'#61', commit:'e5c3456', author:'Amit R.', startTime:Date.now()-60*60*1000, duration:'4m 2s' },
  ],
  vulns: [
    { id:'v1', cve:'CVE-2024-3094', package:'xz-utils 5.6.0', severity:'critical', cvss:10.0, affected:'Auth-Service', status:'open', assignee:'m2', desc:'Supply-chain backdoor allowing unauthorized SSH access.', remediation:'Downgrade to xz-utils 5.4.6', discovered:Date.now()-2*86400*1000 },
    { id:'v2', cve:'CVE-2024-21626', package:'runc 1.1.11', severity:'high', cvss:8.6, affected:'PaymentGateway-API', status:'in_progress', assignee:'m1', desc:'Container escape via file descriptor leak.', remediation:'Update runc to 1.1.12+', discovered:Date.now()-4*86400*1000 },
    { id:'v3', cve:'CVE-2023-44487', package:'node:20-alpine', severity:'high', cvss:7.5, affected:'Dashboard-UI', status:'open', assignee:null, desc:'HTTP/2 Rapid Reset attack causing denial of service.', remediation:'Update base image to node:20.10-alpine or later.', discovered:Date.now()-10*86400*1000 },
    { id:'v4', cve:'CVE-2024-24790', package:'golang 1.21.5', severity:'medium', cvss:6.2, affected:'Auth-Service', status:'open', assignee:'m3', desc:'Incorrect handling of IPv6 addresses in net/http.', remediation:'Upgrade Go to 1.21.11 or 1.22.4', discovered:Date.now()-5*86400*1000 },
    { id:'v5', cve:'CVE-2024-29736', package:'spring-boot 3.2.4', severity:'medium', cvss:5.9, affected:'Notification-Service', status:'fixed', assignee:'m5', desc:'SSRF in spring-webflux.', remediation:'Upgrade to spring-boot 3.2.5', discovered:Date.now()-15*86400*1000 },
    { id:'v6', cve:'CVE-2024-22243', package:'spring-security 6.2.1', severity:'high', cvss:8.1, affected:'Auth-Service', status:'fixed', assignee:'m2', desc:'Open redirect vulnerability in UriComponentsBuilder.', remediation:'Upgrade to spring-security 6.2.2', discovered:Date.now()-20*86400*1000 },
    { id:'v7', cve:'CVE-2023-51767', package:'openssh 9.4p1', severity:'medium', cvss:5.3, affected:'Data-Pipeline', status:'open', assignee:null, desc:'Row hammer side channel attack.', remediation:'Apply OpenSSH 9.5p1 patch.', discovered:Date.now()-8*86400*1000 },
    { id:'v8', cve:'CVE-2024-28757', package:'libexpat 2.5.0', severity:'low', cvss:3.1, affected:'ML-Inference-Engine', status:'open', assignee:null, desc:'Integer overflow in XML parser.', remediation:'Update libexpat to 2.6.0', discovered:Date.now()-12*86400*1000 },
  ],
  containers: [
    { id:'c1', name:'payment-api', image:'org/payment-api:v2.4.1', status:'running', cpu:28, mem:512, memLimit:2048, restarts:0, ports:'8080:3000', uptime:Date.now()-3*86400*1000, node:'ip-10-0-1-42' },
    { id:'c2', name:'auth-service', image:'org/auth-svc:v1.8.3', status:'running', cpu:15, mem:256, memLimit:1024, restarts:1, ports:'8081:3001', uptime:Date.now()-7*86400*1000, node:'ip-10-0-1-42' },
    { id:'c3', name:'dashboard-ui', image:'org/dashboard-ui:v3.1.0', status:'running', cpu:5, mem:128, memLimit:512, restarts:0, ports:'80:80,443:443', uptime:Date.now()-1*86400*1000, node:'ip-10-0-1-45' },
    { id:'c4', name:'ml-inference', image:'org/ml-engine:v0.9.2', status:'stopped', cpu:0, mem:0, memLimit:8192, restarts:5, ports:'8082:5000', uptime:null, node:'ip-10-0-2-10' },
    { id:'c5', name:'notif-service', image:'org/notif-svc:v2.0.1', status:'running', cpu:8, mem:192, memLimit:512, restarts:0, ports:'8083:4000', uptime:Date.now()-2*86400*1000, node:'ip-10-0-1-45' },
    { id:'c6', name:'postgres-db', image:'postgres:16-alpine', status:'running', cpu:12, mem:768, memLimit:4096, restarts:0, ports:'5432:5432', uptime:Date.now()-30*86400*1000, node:'ip-10-0-1-42' },
    { id:'c7', name:'redis-cache', image:'redis:7-alpine', status:'running', cpu:3, mem:64, memLimit:256, restarts:0, ports:'6379:6379', uptime:Date.now()-30*86400*1000, node:'ip-10-0-1-45' },
    { id:'c8', name:'nginx-proxy', image:'nginx:1.25-alpine', status:'error', cpu:0, mem:32, memLimit:128, restarts:8, ports:'80:80,443:443', uptime:null, node:'ip-10-0-1-42' },
  ],
  ec2: [
    { id:'i-0a1b2c3d4e5f60001', name:'web-prod-1', type:'t3.medium', state:'running', zone:'ap-south-1a', ip:'13.234.56.78', privateIp:'10.0.1.42', cpu:62, uptime:'14d 3h', project:'p1' },
    { id:'i-0a1b2c3d4e5f60002', name:'web-prod-2', type:'t3.medium', state:'running', zone:'ap-south-1b', ip:'13.234.56.79', privateIp:'10.0.1.45', cpu:48, uptime:'14d 3h', project:'p1' },
    { id:'i-0a1b2c3d4e5f60003', name:'api-staging-1', type:'t3.small', state:'running', zone:'ap-south-1a', ip:'65.0.23.11', privateIp:'10.0.2.10', cpu:24, uptime:'3d 7h', project:'p2' },
    { id:'i-0a1b2c3d4e5f60004', name:'ml-worker-1', type:'g4dn.xlarge', state:'stopped', zone:'ap-south-1a', ip:null, privateIp:'10.0.3.5', cpu:0, uptime:null, project:'p4' },
    { id:'i-0a1b2c3d4e5f60005', name:'bastion-host', type:'t3.micro', state:'running', zone:'ap-south-1a', ip:'15.206.78.90', privateIp:'10.0.0.5', cpu:2, uptime:'90d 0h', project:null },
  ],
  rds: [
    { id:'sentinelops-prod', engine:'PostgreSQL 16.1', class:'db.t3.large', state:'available', storage:'100 GB', connections:28, zone:'ap-south-1a', endpoint:'sentinelops-prod.xyz.ap-south-1.rds.amazonaws.com' },
    { id:'sentinelops-replica', engine:'PostgreSQL 16.1', class:'db.t3.medium', state:'available', storage:'100 GB', connections:6, zone:'ap-south-1b', endpoint:'sentinelops-replica.xyz.ap-south-1.rds.amazonaws.com' },
    { id:'sentinelops-staging', engine:'MySQL 8.0.32', class:'db.t3.micro', state:'available', storage:'20 GB', connections:3, zone:'ap-south-1a', endpoint:'sentinelops-staging.xyz.ap-south-1.rds.amazonaws.com' },
  ],
  s3: [
    { id:'s3-sentinelops-backups', name:'sentinelops-backups-ap-south-1', region:'ap-south-1', state:'active', launch_time:'2025-10-12 09:30:00', metadata: { Versioning: 'Enabled' } }
  ],
  tasks: {
    backlog: [
      { id:'t1', title:'Implement Redis caching for session tokens', desc:'Reduce DB load by caching JWT session data in Redis with a 15-minute TTL.', priority:'p1', project:'p2', assignee:'m2', tags:['backend','performance'], due:Date.now()+3*86400*1000, createdAt:Date.now()-2*86400*1000 },
      { id:'t2', title:'Add rate limiting to /api/v1/payment endpoint', desc:'Implement sliding window rate limiting (100 req/min per IP).', priority:'p2', project:'p1', assignee:'m1', tags:['security','api'], due:Date.now()+5*86400*1000, createdAt:Date.now()-1*86400*1000 },
      { id:'t3', title:'Write load test for Auth-Service', desc:'k6 load test targeting 10k concurrent users for 5 minutes.', priority:'p3', project:'p2', assignee:null, tags:['testing'], due:Date.now()+7*86400*1000, createdAt:Date.now()-3*86400*1000 },
    ],
    inprogress: [
      { id:'t4', title:'Migrate PostgreSQL from v14 to v16', desc:'Zero-downtime migration using pg_logical replication.', priority:'p1', project:'p1', assignee:'m5', tags:['database','infra'], due:Date.now()+1*86400*1000, createdAt:Date.now()-5*86400*1000 },
      { id:'t5', title:'Configure CloudWatch alarms for RDS metrics', desc:'Set alarms for CPU > 80%, connections > 80% of limit.', priority:'p2', project:null, assignee:'m3', tags:['aws','monitoring'], due:Date.now()+2*86400*1000, createdAt:Date.now()-1*86400*1000 },
    ],
    review: [
      { id:'t6', title:'Security patch: update xz-utils across all images', desc:'Rebuild all Docker images with xz-utils 5.4.6.', priority:'p1', project:'p2', assignee:'m4', tags:['security','docker'], due:Date.now()-1*86400*1000, createdAt:Date.now()-4*86400*1000 },
    ],
    completed: [
      { id:'t7', title:'Set up GitHub Actions OIDC for AWS', desc:'Replace static IAM credentials with OIDC-based auth.', priority:'p2', project:null, assignee:'m1', tags:['ci-cd','security'], due:Date.now()-5*86400*1000, createdAt:Date.now()-10*86400*1000 },
      { id:'t8', title:'Deploy Nginx with SSL termination', desc:'Let\'s Encrypt certificates via Certbot.', priority:'p3', project:'p3', assignee:'m3', tags:['infra','networking'], due:Date.now()-3*86400*1000, createdAt:Date.now()-8*86400*1000 },
    ],
  },
  team: [
    { id:'m1', name:'Arjun Sharma', email:'arjun@sentinelops.io', role:'DevOps Lead', status:'active', joined:'Jan 2023', avatar:'bg1', initials:'AS', permissions:['admin'], dept:'Platform Engineering' },
    { id:'m2', name:'Priya Mehta', email:'priya@sentinelops.io', role:'Backend Engineer', status:'active', joined:'Mar 2023', avatar:'bg2', initials:'PM', permissions:['deploy','read'], dept:'Core Services' },
    { id:'m3', name:'Rohan Kumar', email:'rohan@sentinelops.io', role:'Frontend Engineer', status:'active', joined:'Jun 2023', avatar:'bg3', initials:'RK', permissions:['read'], dept:'Product' },
    { id:'m4', name:'Sona Thomas', email:'sona@sentinelops.io', role:'Security Engineer', status:'active', joined:'Feb 2023', avatar:'bg4', initials:'ST', permissions:['security','read'], dept:'Security' },
    { id:'m5', name:'Amit Rao', email:'amit@sentinelops.io', role:'Data Engineer', status:'active', joined:'Aug 2023', avatar:'bg5', initials:'AR', permissions:['read'], dept:'Data Platform' },
    { id:'m6', name:'Divya Nair', email:'divya@sentinelops.io', role:'SRE', status:'inactive', joined:'Nov 2023', avatar:'bg6', initials:'DN', permissions:['read','monitor'], dept:'Platform Engineering' },
  ],
  alerts: [
    { id:'al1', name:'High CPU on web-prod-1', severity:'critical', resource:'i-0a1b2c3d4e5f60001', value:'91%', threshold:'80%', since:Date.now()-15*60*1000, acknowledged:false },
    { id:'al2', name:'RDS connections near limit', severity:'warning', resource:'sentinelops-prod', value:'28/30', threshold:'25/30', since:Date.now()-45*60*1000, acknowledged:false },
    { id:'al3', name:'Pipeline failure rate elevated', severity:'warning', resource:'Dashboard-UI', value:'35%', threshold:'10%', since:Date.now()-3*3600*1000, acknowledged:true },
    { id:'al4', name:'nginx-proxy container OOMKilled', severity:'critical', resource:'nginx-proxy', value:'128MB/128MB', threshold:'90%', since:Date.now()-2*3600*1000, acknowledged:false },
  ],
  settings: {
    app: { name:'SentinelOps', domain:'sentinelops.io', timezone:'Asia/Kolkata', defaultEnv:'production' },
    smtp: { host:'smtp.gmail.com', port:587, user:'ops@sentinelops.io', from:'SentinelOps <ops@sentinelops.io>', tls:true },
    db: { host:'sentinelops-prod.c123456789.us-east-1.rds.amazonaws.com', port:3306, name:'sentinelops_db', user:'admin', pool:20 },
    security: { mfa:true, ssoEnabled:false, sessionTimeout:480, ipWhitelist:false, auditLog:true },
    notifications: { pipelineFail:true, securityAlert:true, deploySuccess:false, weeklyReport:true },
    backup: { enabled:true, frequency:'daily', retention:30, s3Bucket:'sentinelops-backups-ap-south-1', lastRun:Date.now()-86400*1000 },
  },
  activityLog: [],
};

// Generate initial activity
(function initActivity() {
  const events = [
    { icon:'🚀', cls:'blue', text:'<strong>Arjun S.</strong> triggered deployment of <strong>PaymentGateway-API #143</strong>' },
    { icon:'🔐', cls:'green', text:'<strong>Security scan</strong> completed on <strong>Auth-Service</strong> — 0 critical issues' },
    { icon:'⚠️', cls:'yellow', text:'<strong>Pipeline #32</strong> failed at <strong>test</strong> stage on Dashboard-UI' },
    { icon:'👤', cls:'purple', text:'<strong>Priya M.</strong> assigned CVE-2024-21626 to herself' },
    { icon:'✅', cls:'green', text:'<strong>Auth-Service #89</strong> deployed to <strong>production</strong> successfully' },
    { icon:'🐳', cls:'blue', text:'<strong>payment-api:v2.4.1</strong> Docker image built and pushed to registry' },
    { icon:'🔔', cls:'red', text:'<strong>Alert:</strong> High CPU on <strong>web-prod-1</strong> — 91% for 15 minutes' },
    { icon:'📊', cls:'green', text:'<strong>Sona T.</strong> ran vulnerability scan — 2 new CVEs detected' },
  ];
  const now = Date.now();
  events.forEach((e,i) => {
    DB.activityLog.push({ ...e, id:'act'+i, time:now - i*7*60*1000 });
  });
})();

/* ================================================================
   APP STATE
================================================================ */
const AppState = {
  page: 'dashboard',
  user: {
    name: 'Arsheelpatel',
    role: 'Admin',
    email: 'arsheel@sentinelops.com',
    avatar: 'AP',
    mfa: true,
    sshKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3fW+t76jLhGvV1iL0o8P5p1ZlYkvh68RNDeQjQh6p5948fH2pS0sJvXm781pM02bNmP921iL83dM98a4eN182b...',
    apiToken: 'so_live_8f7b9c2a1d4e6f8a'
  },
  apiUrl: 'http://localhost:3000',
  backendActive: false,
  theme: localStorage.getItem('sentinel-theme') || 'dark',
  projects: JSON.parse(JSON.stringify(DB.projects)),
  pipelines: JSON.parse(JSON.stringify(DB.pipelines)),
  vulns: JSON.parse(JSON.stringify(DB.vulns)),
  containers: JSON.parse(JSON.stringify(DB.containers)),
  ec2: JSON.parse(JSON.stringify(DB.ec2)),
  rds: JSON.parse(JSON.stringify(DB.rds)),
  s3: JSON.parse(JSON.stringify(DB.s3 || [])),
  tasks: JSON.parse(JSON.stringify(DB.tasks)),
  team: JSON.parse(JSON.stringify(DB.team)),
  alerts: JSON.parse(JSON.stringify(DB.alerts)),
  settings: JSON.parse(JSON.stringify(DB.settings)),
  activityLog: JSON.parse(JSON.stringify(DB.activityLog)),
  charts: {},
  intervals: [],
  notifications: [
    { id:'n1', unread:true, icon:'🔴', cls:'danger', text:'<strong>Critical:</strong> CVE-2024-3094 detected in Auth-Service', time:Date.now()-5*60*1000 },
    { id:'n2', unread:true, icon:'🚀', cls:'blue', text:'<strong>Deploy success:</strong> Auth-Service v1.8.3 is live', time:Date.now()-25*60*1000 },
    { id:'n3', unread:false, icon:'⚠️', cls:'warning', text:'<strong>Pipeline failed:</strong> Dashboard-UI #32 test stage', time:Date.now()-3*3600*1000 },
    { id:'n4', unread:false, icon:'✅', cls:'green', text:'<strong>Scan complete:</strong> No new vulnerabilities found', time:Date.now()-6*3600*1000 },
  ],
  // Filters per page
  filters: {
    projects: { search:'', status:'all', view:'cards' },
    pipelines: { search:'', status:'all', sort:'newest' },
    security: { search:'', severity:'all', status:'all' },
    containers: { search:'', status:'all' },
    team: { search:'', role:'all', status:'all' },
    tasks: { priority:'all', assignee:'all' },
  },
  modal: null, // current modal config
  dragging: null, // kanban drag state
  settingsTab: 'app',
  reportTab: 'deployment',
  scanProgress: 0,
  scanRunning: false,

  /* CRUD helpers */
  addProject(p) {
    if (this.backendActive) {
      authFetch(`${this.apiUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      })
      .then(r => r.json())
      .then(newP => {
        const idx = this.projects.findIndex(x => x.id === p.id);
        if (idx > -1) this.projects[idx] = newP;
        else this.projects.push(newP);
        updateSidebarBadges();
        if (AppState.page === 'projects') renderProjects();
      })
      .catch(err => console.error('API Error:', err));
    } else {
      this.projects.push(p);
      updateSidebarBadges();
    }
  },
  updateProject(id, upd) {
    const i=this.projects.findIndex(p=>p.id===id);
    if(i>-1) {
      Object.assign(this.projects[i],upd);
      updateSidebarBadges();
      if (this.backendActive) {
        authFetch(`${this.apiUrl}/api/projects/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(upd)
        }).catch(err => console.error('API Error:', err));
      }
    }
  },
  deleteProject(id) {
    this.projects=this.projects.filter(p=>p.id!==id);
    updateSidebarBadges();
    if (this.backendActive) {
      authFetch(`${this.apiUrl}/api/projects/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error('API Error:', err));
    }
  },
  addTask(col, t) {
    t.column_name = col;
    if (this.backendActive) {
      authFetch(`${this.apiUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      })
      .then(r => r.json())
      .then(newT => {
        const list = this.tasks[col];
        const idx = list.findIndex(x => x.id === t.id);
        if (idx > -1) list[idx] = newT;
        else list.push(newT);
        updateSidebarBadges();
        if (AppState.page === 'tasks') renderTasks();
      })
      .catch(err => console.error('API Error:', err));
    } else {
      this.tasks[col].push(t);
      updateSidebarBadges();
    }
  },
  updateTask(id, upd) {
    for(const col of Object.keys(this.tasks)){
      const i=this.tasks[col].findIndex(t=>t.id===id);
      if(i>-1){
        Object.assign(this.tasks[col][i],upd);
        updateSidebarBadges();
        if (this.backendActive) {
          authFetch(`${this.apiUrl}/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(upd)
          }).catch(err => console.error('API Error:', err));
        }
        return;
      }
    }
  },
  deleteTask(id) {
    for(const col of Object.keys(this.tasks)){
      this.tasks[col]=this.tasks[col].filter(t=>t.id!==id);
    }
    updateSidebarBadges();
    if (this.backendActive) {
      authFetch(`${this.apiUrl}/api/tasks/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error('API Error:', err));
    }
  },
  moveTask(id, toCol) {
    let task;
    for(const col of Object.keys(this.tasks)){
      const i=this.tasks[col].findIndex(t=>t.id===id);
      if(i>-1){
        [task]=this.tasks[col].splice(i,1);
        break;
      }
    }
    if(task) {
      this.tasks[toCol].push(task);
      updateSidebarBadges();
      if (this.backendActive) {
        authFetch(`${this.apiUrl}/api/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ column_name: toCol })
        }).catch(err => console.error('API Error:', err));
      }
    }
  },
  addTeamMember(m) {
    if (this.backendActive) {
      authFetch(`${this.apiUrl}/api/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(m)
      })
      .then(r => {
        if (!r.ok) return r.json().then(e => { throw new Error(e.message || 'Failed') });
        return r.json();
      })
      .then(newM => {
        this.team.push(newM);
        updateSidebarBadges();
        if (AppState.page === 'team') renderTeam();
      })
      .catch(err => {
        console.error('API Error:', err);
        toast('danger', 'Error', err.message || 'Failed to add team member.');
      });
    } else {
      this.team.push(m);
      updateSidebarBadges();
    }
  },
  updateTeamMember(id, upd) {
    const i=this.team.findIndex(m=>m.id===id);
    if(i>-1) {
      Object.assign(this.team[i],upd);
      updateSidebarBadges();
      if (this.backendActive) {
        authFetch(`${this.apiUrl}/api/team/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(upd)
        }).catch(err => console.error('API Error:', err));
      }
    }
  },
  removeTeamMember(id) {
    this.team=this.team.filter(m=>m.id!==id);
    updateSidebarBadges();
    if (this.backendActive) {
      authFetch(`${this.apiUrl}/api/team/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error('API Error:', err));
    }
  },
  updateVuln(id, upd) {
    const i=this.vulns.findIndex(v=>v.id===id);
    if(i>-1) {
      Object.assign(this.vulns[i],upd);
      updateSidebarBadges();
      if (this.backendActive) {
        authFetch(`${this.apiUrl}/api/vulns/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(upd)
        }).catch(err => console.error('API Error:', err));
      }
    }
  },
  acknowledgeAlert(id) {
    const al=this.alerts.find(a=>a.id===id);
    if(al) {
      al.acknowledged=true;
      updateSidebarBadges();
    }
  },
  addPipeline(pl) {
    if (this.backendActive) {
      authFetch(`${this.apiUrl}/api/pipelines/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: pl.project, branch: pl.branch })
      })
      .then(r => r.json())
      .then(newPl => {
        const stages = (newPl.stages || []).map(s => s.stage_name);
        const stageStatus = (newPl.stages || []).map(s => s.status);
        const stageTimes = (newPl.stages || []).map(s => s.duration);
        const formatted = { ...newPl, stages, stageStatus, stageTimes };
        
        const idx = this.pipelines.findIndex(x => x.id === pl.id);
        if (idx > -1) this.pipelines[idx] = formatted;
        else this.pipelines.unshift(formatted);
        
        updateSidebarBadges();
        if (AppState.page === 'pipelines') renderPipelines();
        toast('success', 'Pipeline Triggered', 'Build queue updated.');
      })
      .catch(err => console.error('API Error:', err));
    } else {
      this.pipelines.unshift(pl);
      updateSidebarBadges();
    }
  },
  logActivity(entry) { this.activityLog.unshift({...entry,id:'act'+Date.now(),time:Date.now()}); if(this.activityLog.length>20) this.activityLog.pop(); },
  clearIntervals() { this.intervals.forEach(id=>clearInterval(id)); this.intervals=[]; },
  destroyCharts() { Object.values(this.charts).forEach(c=>{try{c.destroy();}catch(e){}}); this.charts={}; },
};

/* ================================================================
   UTILITIES
================================================================ */
function uid() { return Date.now().toString(36)+Math.random().toString(36).substr(2,5); }
function timeAgo(ts) {
  const d=(Date.now()-ts)/1000;
  if(d<60) return 'just now'; if(d<3600) return Math.floor(d/60)+'m ago';
  if(d<86400) return Math.floor(d/3600)+'h ago'; return Math.floor(d/86400)+'d ago';
}
function fmtDate(ts) { return new Date(ts).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
function fmtDuration(ms) {
  const s=Math.floor(ms/1000); if(s<60) return s+'s';
  const m=Math.floor(s/60),rs=s%60; if(m<60) return m+'m '+rs+'s';
  return Math.floor(m/60)+'h '+m%60+'m';
}
function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
function lerp(a,b,t){ return a+(b-a)*t; }
function randBetween(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function getMember(id) { return AppState.team.find(m=>m.id===id)||null; }
function getProject(id) { return AppState.projects.find(p=>p.id===id)||null; }
function avatarBg(cls) {
  const map={bg1:'linear-gradient(135deg,#4F46E5,#818CF8)',bg2:'linear-gradient(135deg,#10B981,#34d399)',bg3:'linear-gradient(135deg,#F59E0B,#fbbf24)',bg4:'linear-gradient(135deg,#EF4444,#f87171)',bg5:'linear-gradient(135deg,#38BDF8,#7dd3fc)',bg6:'linear-gradient(135deg,#A78BFA,#c4b5fd)'};
  return map[cls]||'linear-gradient(135deg,#4F46E5,#818CF8)';
}
function severityBadge(s) {
  const m={critical:'danger',high:'danger',medium:'warning',low:'info'}; return `<span class="badge badge-${m[s]||'neutral'}">${s}</span>`;
}
function statusBadge(s) {
  const m={healthy:'success',running:'success',success:'success',done:'success',warning:'warning',failed:'danger',error:'danger',stopped:'neutral',open:'danger',in_progress:'warning',fixed:'success',pending:'neutral',available:'success',active:'success',inactive:'neutral'};
  return `<span class="badge badge-${m[s]||'neutral'}">${s.replace(/_/g,' ')}</span>`;
}
function priorityBadge(p) {
  return `<span class="badge priority-${p}">${p.toUpperCase()}</span>`;
}
function escHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function csvDownload(rows, filename) {
  const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; a.click();
}
function debounce(fn,ms){let t;return function(...a){clearTimeout(t);t=setTimeout(()=>fn.apply(this,a),ms);};}

/* ================================================================
   TOAST SYSTEM
================================================================ */
let toastContainer;
function initToast() {
  // Use existing container from HTML if present, else create one
  toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}
function toast(type,title,msg,dur=4000) {
  const icons={success:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',error:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',warning:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',info:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'};
  const el=document.createElement('div'); el.className=`toast ${type}`;
  el.innerHTML=`<div class="toast-icon">${icons[type]||icons.info}</div><div class="toast-body"><div class="toast-title">${escHtml(title)}</div>${msg?`<div class="toast-msg">${escHtml(msg)}</div>`:''}</div><button class="toast-close" onclick="this.closest('.toast').remove()">×</button>`;
  toastContainer.prepend(el);
  const remove=()=>{ el.classList.add('out'); setTimeout(()=>el.remove(),300); };
  setTimeout(remove,dur);
}

/* ================================================================
   MODAL SYSTEM
================================================================ */
const modalRoot = () => document.getElementById('modal-root');
function showModal(config) {
  AppState.modal=config;
  const el=modalRoot(); el.innerHTML='';
  const size=config.size||''; // wide, narrow, ''
  el.innerHTML=`
  <div class="modal-box ${size}" id="modal-box">
    <div class="modal-header">
      <div class="modal-header-text">
        <div class="modal-title" id="modal-title">${escHtml(config.title||'')}</div>
        ${config.subtitle?`<div class="modal-subtitle">${escHtml(config.subtitle)}</div>`:''}
      </div>
      <button class="modal-close" id="modal-close-btn" aria-label="Close modal">×</button>
    </div>
    <div class="modal-body" id="modal-body">${config.body||''}</div>
    <div class="modal-footer" id="modal-footer">
      <button class="btn-secondary btn-sm" id="modal-cancel-btn">${escHtml(config.cancelLabel||'Cancel')}</button>
      ${config.onSave!==false?`<button class="btn-primary btn-sm ${config.saveClass||''}" id="modal-save-btn">${escHtml(config.saveLabel||'Save')}</button>`:''}
    </div>
  </div>`;
  el.classList.remove('hidden');
  // Focus first input
  const firstInput=el.querySelector('input:not([type="hidden"]),select,textarea');
  if(firstInput) setTimeout(()=>firstInput.focus(),50);
  // Bind close
  document.getElementById('modal-close-btn')?.addEventListener('click',hideModal);
  document.getElementById('modal-cancel-btn')?.addEventListener('click',hideModal);
  el.addEventListener('click',e=>{ if(e.target===el) hideModal(); });
  // Save handler
  if(config.onSave) {
    document.getElementById('modal-save-btn')?.addEventListener('click',()=>{ config.onSave(); });
  }
  // Post-render callback
  if(config.onRender) setTimeout(config.onRender,30);
}
function hideModal() {
  const el=modalRoot(); if(!el) return;
  el.classList.add('hidden'); el.innerHTML=''; AppState.modal=null;
}

/* ================================================================
   CONFIRM DIALOG
================================================================ */
const confirmRoot=()=>document.getElementById('confirm-root');
function showConfirm(config) {
  const el=confirmRoot(); el.innerHTML='';
  const icon=config.type==='danger'?`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>`
    :`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>`;
  el.innerHTML=`
  <div class="confirm-box">
    <div class="confirm-header">
      <div class="confirm-icon ${config.type||'danger'}">${icon}</div>
      <div><div class="confirm-title">${escHtml(config.title||'Are you sure?')}</div><div class="confirm-msg">${escHtml(config.msg||'This action cannot be undone.')}</div></div>
    </div>
    <div class="confirm-footer">
      <button class="btn-secondary btn-sm" id="confirm-cancel">Cancel</button>
      <button class="btn-danger btn-sm" id="confirm-ok">${escHtml(config.okLabel||'Confirm')}</button>
    </div>
  </div>`;
  el.classList.remove('hidden');
  el.addEventListener('click',e=>{ if(e.target===el) el.classList.add('hidden'); });
  document.getElementById('confirm-cancel').onclick=()=>el.classList.add('hidden');
  document.getElementById('confirm-ok').onclick=()=>{ el.classList.add('hidden'); config.onConfirm?.(); };
}

/* ================================================================
   DRAWER SYSTEM
================================================================ */
const drawerRoot=()=>document.getElementById('drawer-root');
function showDrawer(config) {
  const el=drawerRoot(); el.innerHTML='';
  el.innerHTML=`
  <div class="drawer-backdrop" id="drawer-backdrop"></div>
  <div class="drawer-panel">
    <div class="drawer-header">
      <span class="drawer-title">${escHtml(config.title||'')}</span>
      <button class="modal-close" id="drawer-close">×</button>
    </div>
    <div class="drawer-body" id="drawer-body">${config.body||''}</div>
    ${config.footer?`<div class="drawer-footer">${config.footer}</div>`:''}
  </div>`;
  el.classList.remove('hidden');
  document.getElementById('drawer-close')?.addEventListener('click',hideDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click',hideDrawer);
  if(config.onRender) setTimeout(config.onRender,30);
}
function hideDrawer() { const el=drawerRoot(); el.classList.add('hidden'); el.innerHTML=''; }

/* ================================================================
   CHART DEFAULTS
================================================================ */
const chartDefaults = {
  color: { grid:'rgba(255,255,255,0.04)', text:'#6B7280', primary:'#4F46E5', success:'#10B981', warning:'#F59E0B', danger:'#EF4444', info:'#38BDF8' },
  baseOpts() {
    return {
      responsive:true, maintainAspectRatio:false, animation:{duration:600,easing:'easeInOutQuart'},
      plugins:{legend:{display:false},tooltip:{backgroundColor:'#1F2937',borderColor:'#374151',borderWidth:1,padding:12,titleColor:'#F9FAFB',bodyColor:'#9CA3AF',cornerRadius:8,displayColors:true,boxPadding:4}},
      scales:{x:{grid:{color:this.color.grid},ticks:{color:this.color.text,font:{family:'Inter',size:11}}},y:{grid:{color:this.color.grid},ticks:{color:this.color.text,font:{family:'Inter',size:11}},border:{dash:[4,4]}}},
    };
  },
  gradient(ctx,color1,color2) {
    const g=ctx.createLinearGradient(0,0,0,ctx.canvas.offsetHeight||220);
    g.addColorStop(0,color1); g.addColorStop(1,color2); return g;
  }
};
function newChart(id,type,data,opts={}) {
  const canvas=document.getElementById(id); if(!canvas) return null;
  if(AppState.charts[id]) { AppState.charts[id].destroy(); delete AppState.charts[id]; }
  const chart=new Chart(canvas,{type,data,options:{...chartDefaults.baseOpts(),...opts}});
  AppState.charts[id]=chart; return chart;
}

/* ================================================================
   ROUTER
================================================================ */
function navigate(page) {
  // Cleanup
  AppState.clearIntervals();
  AppState.destroyCharts();
  hideModal(); hideDrawer();
  // Update nav
  AppState.page=page;
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
  updateSidebarBadges();
  // Render
  const content=document.getElementById('page-content');
  content.innerHTML=skeleton();
  setTimeout(()=>{
    content.innerHTML='';
    const renderMap={
      dashboard:renderDashboard, projects:renderProjects, pipelines:renderPipelines,
      security:renderSecurity, containers:renderContainers, cloud:renderCloud,
      monitoring:renderMonitoring, tasks:renderTasks, reports:renderReports,
      team:renderTeam, settings:renderSettings, profile:renderProfile,
    };
    (renderMap[page]||renderDashboard)();
  },220);
}
function skeleton() {
  return `<div style="padding:4px">
    <div class="skeleton" style="height:32px;width:260px;margin-bottom:24px"></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">${Array(4).fill('<div class="skeleton" style="height:100px"></div>').join('')}</div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px">${Array(2).fill('<div class="skeleton" style="height:280px"></div>').join('')}</div>
  </div>`;
}

/* ================================================================
   LANDING PAGE
================================================================ */
/* Landing page global aliases (called via onclick="" in HTML) */
function checkAuthAndLaunch(targetPage = 'dashboard') {
  if (AppState.backendActive && !localStorage.getItem('token')) {
    showLoginModal();
  } else {
    launchDashboard();
    if (targetPage !== 'dashboard') {
      setTimeout(() => navigate(targetPage), 350);
    }
  }
}

function launchApp() { checkAuthAndLaunch('dashboard'); }
function launchAppPipelines() { checkAuthAndLaunch('pipelines'); }

function initLanding() {
  // Also wire any button that might have id-based listeners
  document.getElementById('launch-dashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    checkAuthAndLaunch('dashboard');
  });
  document.getElementById('view-pipeline')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    checkAuthAndLaunch('pipelines');
  });
}
function animateCounter(id,target,decimals,dur,suffix='') {
  const el=document.getElementById(id); if(!el) return;
  const start=performance.now();
  const step=now=>{ const t=Math.min((now-start)/dur,1); const v=lerp(0,target,t*(2-t)); el.textContent=v.toFixed(decimals)+(suffix||''); if(t<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function launchDashboard() {
  document.getElementById('landing-page').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  navigate('dashboard');
}

/* ================================================================
   PAGE: DASHBOARD
================================================================ */
function renderDashboard() {
  const content=document.getElementById('page-content');
  const running=AppState.pipelines.filter(p=>p.status==='running').length;
  const failed=AppState.pipelines.filter(p=>p.status==='failed').length;
  const critical=AppState.vulns.filter(v=>v.severity==='critical'&&v.status!=='fixed').length;
  const openAlerts=AppState.alerts.filter(a=>!a.acknowledged).length;
  const totalDeploys=AppState.projects.reduce((s,p)=>s+p.deploys,0);
  const avgSuccess=(AppState.projects.reduce((s,p)=>s+p.successRate,0)/AppState.projects.length).toFixed(1);

  content.innerHTML=`
  <div class="page-header">
    <div><h1 class="page-title">Command Center</h1><p class="page-subtitle">Real-time overview of your DevSecOps infrastructure</p></div>
    <div class="page-actions">
      <button class="btn-secondary btn-sm" data-action="dashboard:refresh"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>Refresh</button>
      <button class="btn-primary btn-sm" data-action="pipeline:trigger-new"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><polygon points="5 3 19 12 5 21 5 3"/></svg>Run Pipeline</button>
    </div>
  </div>
  <!-- KPIs -->
  <div class="kpi-grid">
    <div class="kpi-card blue" data-action="navigate" data-page="pipelines">
      <div class="kpi-header"><div class="kpi-icon blue"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg></div><span class="kpi-trend up">▲ 12</span></div>
      <div class="kpi-value" id="kpi-deploys">${totalDeploys}</div><div class="kpi-label">Total Deployments</div>
    </div>
    <div class="kpi-card green" data-action="navigate" data-page="pipelines">
      <div class="kpi-header"><div class="kpi-icon green"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><span class="kpi-trend up">▲ 2.1%</span></div>
      <div class="kpi-value">${avgSuccess}%</div><div class="kpi-label">Success Rate</div>
    </div>
    <div class="kpi-card ${running>0?'blue':'neutral'}" data-action="navigate" data-page="pipelines">
      <div class="kpi-header"><div class="kpi-icon blue"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><span class="kpi-trend neutral">Live</span></div>
      <div class="kpi-value">${running}</div><div class="kpi-label">Running Pipelines</div>
    </div>
    <div class="kpi-card ${failed>0?'red':'green'}" data-action="navigate" data-page="pipelines">
      <div class="kpi-header"><div class="kpi-icon red"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div><span class="kpi-trend ${failed>0?'down':'up'}">${failed>0?'▼ '+failed:'✓ Clear'}</span></div>
      <div class="kpi-value">${failed}</div><div class="kpi-label">Failed Pipelines</div>
    </div>
    <div class="kpi-card ${critical>0?'red':'green'}" data-action="navigate" data-page="security">
      <div class="kpi-header"><div class="kpi-icon red"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><span class="kpi-trend ${critical>0?'down':'up'}">${critical} critical</span></div>
      <div class="kpi-value">${AppState.vulns.filter(v=>v.status!=='fixed').length}</div><div class="kpi-label">Open Vulnerabilities</div>
    </div>
    <div class="kpi-card ${openAlerts>0?'yellow':'green'}" data-action="navigate" data-page="monitoring">
      <div class="kpi-header"><div class="kpi-icon yellow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div><span class="kpi-trend ${openAlerts>0?'down':'up'}">${openAlerts} active</span></div>
      <div class="kpi-value">${openAlerts}</div><div class="kpi-label">Active Alerts</div>
    </div>
  </div>
  <!-- Charts Row -->
  <div class="charts-grid">
    <div class="chart-card"><div class="card-header"><span class="card-title">Deployment Activity (7 days)</span><span class="text-xs text-muted">Deploys per day</span></div><div class="chart-wrapper"><canvas id="chart-deploys"></canvas></div></div>
    <div class="chart-card"><div class="card-header"><span class="card-title">Pipeline Success Rate</span><span class="text-xs text-muted">Last 4 weeks</span></div><div class="chart-wrapper"><canvas id="chart-success"></canvas></div></div>
  </div>
  <div class="row">
    <!-- Pipeline Health -->
    <div class="col-2 card">
      <div class="card-header"><span class="card-title">Pipeline Health</span>${statusBadge('running')}</div>
      ${AppState.pipelines.slice(0,4).map(pl=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
        <div><div class="text-sm" style="font-weight:600;color:var(--text-primary)">${escHtml(pl.name)}</div><div class="text-xs text-muted">${pl.number} · ${escHtml(pl.author)} · ${timeAgo(pl.startTime)}</div></div>
        ${statusBadge(pl.status)}
      </div>`).join('')}
    </div>
    <!-- Activity Feed -->
    <div class="col-1 card">
      <div class="card-header"><span class="card-title">Activity Feed</span><span class="badge badge-info" style="font-size:0.625rem">Live</span></div>
      <div class="activity-feed" id="activity-feed">${renderActivityItems(5)}</div>
    </div>
  </div>`;

  // Charts
  setTimeout(initDashboardCharts, 50);
  // Live activity
  const interval = setInterval(()=>{
    const msgs=[
      {icon:'🚀',cls:'blue',text:`<strong>Auto-deploy:</strong> PaymentGateway-API monitoring check passed`},
      {icon:'🔐',cls:'green',text:`<strong>Scan</strong> completed on Notification-Service — 0 critical`},
      {icon:'📦',cls:'purple',text:`<strong>Container</strong> payment-api resource usage within normal range`},
      {icon:'✅',cls:'green',text:`<strong>Health check</strong> passed for all ${AppState.ec2.filter(e=>e.state==='running').length} EC2 instances`},
    ];
    const m=msgs[Math.floor(Math.random()*msgs.length)];
    AppState.logActivity(m);
    const feed=document.getElementById('activity-feed');
    if(feed) feed.innerHTML=renderActivityItems(5);
  }, 7000);
  AppState.intervals.push(interval);
}

function renderActivityItems(count) {
  return AppState.activityLog.slice(0,count).map(a=>`
  <div class="activity-item">
    <div class="activity-icon" style="background:var(--${a.cls==='blue'?'primary-glow':a.cls==='green'?'success-bg':a.cls==='yellow'?'warning-bg':a.cls==='red'?'danger-bg':'purple-bg'})">${a.icon}</div>
    <div class="activity-content"><div class="activity-text">${a.text}</div><div class="activity-time">${timeAgo(a.time)}</div></div>
  </div>`).join('');
}

function initDashboardCharts() {
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const deploys=[18,24,32,28,41,15,22];
  const failures=[2,1,4,3,2,0,1];
  const canvas1=document.getElementById('chart-deploys');
  if(canvas1) {
    const ctx=canvas1.getContext('2d');
    newChart('chart-deploys','bar',{
      labels:days,
      datasets:[
        {label:'Success',data:deploys,backgroundColor:'rgba(79,70,229,0.7)',borderRadius:4,borderSkipped:false},
        {label:'Failed',data:failures,backgroundColor:'rgba(239,68,68,0.6)',borderRadius:4,borderSkipped:false},
      ]
    },{plugins:{legend:{display:true,position:'bottom',labels:{color:'#6B7280',usePointStyle:true,padding:16,font:{size:11}}}}});
  }
  const weeks=['Week 1','Week 2','Week 3','Week 4'];
  newChart('chart-success','line',{
    labels:weeks,
    datasets:[{
      label:'Success Rate %', data:[94.2,97.1,95.8,98.2],
      borderColor:'#10B981',borderWidth:2,pointBackgroundColor:'#10B981',pointRadius:4,
      tension:0.4,fill:true,backgroundColor:'rgba(16,185,129,0.08)',
    }]
  },{scales:{y:{min:88,max:100,ticks:{callback:v=>v+'%'}}}});
}

/* ================================================================
   PAGE: PROJECTS — Full CRUD
================================================================ */
function renderProjects() {
  const content=document.getElementById('page-content');
  const {search,status,view}=AppState.filters.projects;
  let projects=AppState.projects.filter(p=>{
    if(search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.repo.toLowerCase().includes(search.toLowerCase())) return false;
    if(status!=='all' && p.status!==status) return false;
    return true;
  });

  content.innerHTML=`
  <div class="page-header">
    <div><h1 class="page-title">Projects</h1><p class="page-subtitle">${AppState.projects.length} projects · ${AppState.projects.filter(p=>p.status==='healthy').length} healthy</p></div>
    <div class="page-actions">
      <button class="btn-secondary btn-sm" id="proj-view-toggle" data-action="projects:toggle-view">${view==='cards'?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> Table':'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Cards'}</button>
      <button class="btn-primary btn-sm" data-action="projects:create"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>New Project</button>
    </div>
  </div>
  <div class="filter-bar">
    <div class="search-input-wrap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="search-input" id="proj-search" placeholder="Search projects…" value="${escHtml(search)}"></div>
    <div class="filter-pills">
      ${['all','healthy','warning','failed'].map(s=>`<button class="filter-pill ${status===s?'active':''}" data-action="projects:filter-status" data-val="${s}">${s==='all'?'All':s.charAt(0).toUpperCase()+s.slice(1)}</button>`).join('')}
    </div>
  </div>
  ${projects.length===0?`<div class="empty-state"><div class="empty-state-icon">📁</div><h3>No projects found</h3><p>Try adjusting your search or filters, or create a new project.</p><button class="btn-primary btn-sm" data-action="projects:create" style="margin-top:8px">New Project</button></div>`:
    view==='cards'?renderProjectCards(projects):renderProjectTable(projects)}`;

  document.getElementById('proj-search')?.addEventListener('input', debounce(e=>{
    AppState.filters.projects.search=e.target.value; renderProjects();
  },300));
}

function renderProjectCards(projects) {
  const langIcons={['Node.js']:'🟩',['Go']:'🔵',['React/TS']:'⚛️',['Python']:'🐍',['Scala']:'⬡'};
  return `<div class="project-cards-grid">${projects.map(p=>`
  <div class="project-card">
    <div class="project-card-header">
      <div class="project-icon" style="background:var(--primary-glow);font-size:1.125rem">${langIcons[p.language]||'📦'}</div>
      ${statusBadge(p.status)}
    </div>
    <div class="project-name">${escHtml(p.name)}</div>
    <div class="project-repo">${escHtml(p.repo)}</div>
    <div class="project-stats">
      <div class="project-stat"><div class="project-stat-val">${p.deploys}</div><div class="project-stat-label">Deploys</div></div>
      <div class="project-stat"><div class="project-stat-val">${p.successRate}%</div><div class="project-stat-label">Success</div></div>
    </div>
    <div style="display:flex;gap:5px;margin-bottom:14px">${p.envs.map(e=>`<span class="env-tag env-${e}">${e}</span>`).join('')}</div>
    <div class="project-footer">
      <span class="text-xs text-muted">Last deploy: ${timeAgo(p.lastDeploy)}</span>
      <div style="display:flex;gap:6px">
        <button class="btn-table btn-xs" data-action="projects:edit" data-id="${p.id}">Edit</button>
        <button class="btn-table primary btn-xs" data-action="projects:deploy" data-id="${p.id}">Deploy</button>
        <button class="btn-table danger btn-xs" data-action="projects:delete" data-id="${p.id}">×</button>
      </div>
    </div>
  </div>`).join('')}</div>`;
}

function renderProjectTable(projects) {
  return `<div class="table-card"><div class="table-wrapper"><table>
  <thead><tr><th>Project</th><th>Status</th><th>Environments</th><th>Owner</th><th>Deploys</th><th>Success Rate</th><th>Last Deploy</th><th>Actions</th></tr></thead>
  <tbody>${projects.map(p=>{const owner=getMember(p.owner);return`
  <tr>
    <td class="td-primary"><div>${escHtml(p.name)}</div><div class="text-xs text-muted font-mono">${escHtml(p.repo)}</div></td>
    <td>${statusBadge(p.status)}</td>
    <td>${p.envs.map(e=>`<span class="env-tag env-${e}" style="margin-right:3px">${e}</span>`).join('')}</td>
    <td>${owner?`<div style="display:flex;align-items:center;gap:6px"><div class="assignee-avatar" style="background:${avatarBg(owner.avatar)}">${owner.initials}</div><span class="text-sm">${owner.name}</span></div>`:'—'}</td>
    <td>${p.deploys}</td>
    <td><span style="color:${p.successRate>=95?'var(--success)':p.successRate>=80?'var(--warning)':'var(--danger)'}">${p.successRate}%</span></td>
    <td class="text-sm">${timeAgo(p.lastDeploy)}</td>
    <td><div class="td-actions">
      <button class="btn-table btn-xs" data-action="projects:edit" data-id="${p.id}">Edit</button>
      <button class="btn-table primary btn-xs" data-action="projects:deploy" data-id="${p.id}">Deploy</button>
      <button class="btn-table danger btn-xs" data-action="projects:delete" data-id="${p.id}">Delete</button>
    </div></td>
  </tr>`}).join('')}</tbody></table></div></div>`;
}

function projectFormHTML(p={}) {
  const memberOpts=AppState.team.map(m=>`<option value="${m.id}" ${p.owner===m.id?'selected':''}>${m.name}</option>`).join('');
  return `
  <div class="form-grid-2">
    <div class="form-group"><label class="form-label">Project Name <span class="req">*</span></label><input class="form-input" id="pf-name" placeholder="my-service-api" value="${escHtml(p.name||'')}"><div class="form-error">Name is required</div></div>
    <div class="form-group"><label class="form-label">Language / Stack</label><select class="form-select" id="pf-lang"><option value="">Select…</option>${['Node.js','Go','Python','React/TS','Scala','Java','Rust','Ruby'].map(l=>`<option ${p.language===l?'selected':''}>${l}</option>`).join('')}</select></div>
  </div>
  <div class="form-grid-2">
    <div class="form-group"><label class="form-label">Repository <span class="req">*</span></label><input class="form-input" id="pf-repo" placeholder="org/repo-name" value="${escHtml(p.repo||'')}"><div class="form-error">Repository is required</div></div>
    <div class="form-group"><label class="form-label">Default Branch</label><input class="form-input" id="pf-branch" placeholder="main" value="${escHtml(p.branch||'main')}"></div>
  </div>
  <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="pf-desc" placeholder="What does this project do?">${escHtml(p.desc||'')}</textarea></div>
  <div class="form-grid-2">
    <div class="form-group"><label class="form-label">Owner</label><select class="form-select" id="pf-owner"><option value="">Unassigned</option>${memberOpts}</select></div>
    <div class="form-group"><label class="form-label">Status</label><select class="form-select" id="pf-status">${['healthy','warning','failed'].map(s=>`<option ${(p.status||'healthy')===s?'selected':''}>${s}</option>`).join('')}</select></div>
  </div>
  <div class="form-group"><label class="form-label">Environments</label><div class="checkbox-group">${['prod','staging','dev'].map(e=>`<label class="checkbox-item"><input type="checkbox" class="pf-env" value="${e}" ${(p.envs||[]).includes(e)?'checked':''}><span class="checkbox-label">${e}</span></label>`).join('')}</div></div>`;
}

function openCreateProject() {
  showModal({ title:'New Project', subtitle:'Add a new project to SentinelOps', body:projectFormHTML(), saveLabel:'Create Project',
    onSave() {
      const name=document.getElementById('pf-name')?.value.trim();
      const repo=document.getElementById('pf-repo')?.value.trim();
      const nameGrp=document.getElementById('pf-name')?.closest('.form-group');
      const repoGrp=document.getElementById('pf-repo')?.closest('.form-group');
      nameGrp?.classList.toggle('has-error',!name);
      repoGrp?.classList.toggle('has-error',!repo);
      if(!name||!repo) return;
      const envs=[...document.querySelectorAll('.pf-env:checked')].map(c=>c.value);
      const proj={ id:'p'+uid(), name, repo, desc:document.getElementById('pf-desc').value, envs:envs.length?envs:['dev'], owner:document.getElementById('pf-owner').value||null, language:document.getElementById('pf-lang').value||'Node.js', branch:document.getElementById('pf-branch').value||'main', status:document.getElementById('pf-status').value, deploys:0, successRate:0, lastDeploy:null, createdAt:Date.now() };
      AppState.addProject(proj);
      AppState.logActivity({icon:'📁',cls:'blue',text:`<strong>${proj.name}</strong> project created`});
      hideModal(); renderProjects();
      toast('success','Project Created',`${name} has been added to SentinelOps`);
    }
  });
}

function openEditProject(id) {
  const p=getProject(id); if(!p) return;
  showModal({ title:'Edit Project', subtitle:`Editing ${p.name}`, body:projectFormHTML(p), saveLabel:'Save Changes',
    onSave() {
      const name=document.getElementById('pf-name')?.value.trim();
      const repo=document.getElementById('pf-repo')?.value.trim();
      if(!name||!repo) { toast('error','Validation Error','Name and repository are required'); return; }
      const envs=[...document.querySelectorAll('.pf-env:checked')].map(c=>c.value);
      AppState.updateProject(id,{ name, repo, desc:document.getElementById('pf-desc').value, envs:envs.length?envs:['dev'], owner:document.getElementById('pf-owner').value||null, language:document.getElementById('pf-lang').value, branch:document.getElementById('pf-branch').value, status:document.getElementById('pf-status').value });
      hideModal(); renderProjects();
      toast('success','Project Updated',`${name} has been updated`);
    }
  });
}

function deployProject(id) {
  const p=getProject(id); if(!p) return;
  showModal({ title:'Trigger Deployment', subtitle:`Run pipeline for ${p.name}`, size:'narrow',
    body:`
    <div class="form-group"><label class="form-label">Branch</label><input class="form-input" id="dep-branch" value="${escHtml(p.branch||'main')}"></div>
    <div class="form-group"><label class="form-label">Environment</label><select class="form-select" id="dep-env">${p.envs.map(e=>`<option>${e}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Deployment Message</label><input class="form-input" id="dep-msg" placeholder="Deploying latest changes…"></div>
    <div class="inline-alert info"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>This will trigger a full CI/CD pipeline run.</div>`,
    saveLabel:'Deploy Now', saveClass:'',
    onSave() {
      const env=document.getElementById('dep-env').value;
      const branch=document.getElementById('dep-branch').value;
      const pl={ id:'pl'+uid(), name:`${p.name} · ${branch}`, project:id, branch, trigger:'manual', status:'running', stages:['code','build','test','scan','docker','deploy'], stageStatus:['running','pending','pending','pending','pending','pending'], stageTimes:[null,null,null,null,null,null], number:`#${p.deploys+1}`, commit:Math.random().toString(36).substr(2,7), author:'You', startTime:Date.now(), duration:null };
      AppState.addPipeline(pl);
      AppState.updateProject(id,{deploys:p.deploys+1, lastDeploy:Date.now()});
      AppState.logActivity({icon:'🚀',cls:'blue',text:`<strong>You</strong> triggered deployment of <strong>${p.name} #${pl.number}</strong> to ${env}`});
      hideModal();
      simulatePipeline(pl.id);
      toast('success','Pipeline Started',`${p.name} deployment is running`);
      setTimeout(()=>navigate('pipelines'),800);
    }
  });
}

/* ================================================================
   PAGE: PIPELINES
================================================================ */
function renderPipelines() {
  const content=document.getElementById('page-content');
  const {search,status}=AppState.filters.pipelines;
  let pls=AppState.pipelines.filter(pl=>{
    if(search && !pl.name.toLowerCase().includes(search.toLowerCase())) return false;
    if(status!=='all' && pl.status!==status) return false;
    return true;
  });

  content.innerHTML=`
  <div class="page-header">
    <div><h1 class="page-title">Pipelines</h1><p class="page-subtitle">${AppState.pipelines.filter(p=>p.status==='running').length} running · ${AppState.pipelines.filter(p=>p.status==='failed').length} failed</p></div>
    <div class="page-actions">
      <button class="btn-primary btn-sm" data-action="pipeline:trigger-new"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><polygon points="5 3 19 12 5 21 5 3"/></svg>Run Pipeline</button>
    </div>
  </div>
  <div class="filter-bar">
    <div class="search-input-wrap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="search-input" id="pl-search" placeholder="Search pipelines…" value="${escHtml(search)}"></div>
    <div class="filter-pills">${['all','running','success','failed'].map(s=>`<button class="filter-pill ${status===s?'active':''}" data-action="pipelines:filter-status" data-val="${s}">${s==='all'?'All':s.charAt(0).toUpperCase()+s.slice(1)}</button>`).join('')}</div>
  </div>
  <div id="pipeline-list">
  ${pls.length===0?`<div class="empty-state"><div class="empty-state-icon">⚡</div><h3>No pipelines match</h3><p>Try adjusting your filters or run a new pipeline.</p></div>`:
    pls.map(pl=>renderPipelineRow(pl)).join('')}
  </div>`;

  document.getElementById('pl-search')?.addEventListener('input',debounce(e=>{
    AppState.filters.pipelines.search=e.target.value; renderPipelines();
  },300));

  // Simulate running pipelines
  AppState.pipelines.filter(pl=>pl.status==='running').forEach(pl=>simulatePipeline(pl.id));
}

function renderPipelineRow(pl) {
  const stageIcons=['</>', '🔨', '🧪', '🔐', '🐳', '🚀'];
  const stageNames=['Code','Build','Test','Scan','Docker','Deploy'];
  return `
  <div class="pipeline-row" id="plrow-${pl.id}">
    <div class="pipeline-row-header">
      <div>
        <div class="pipeline-name">${escHtml(pl.name)} <span class="text-muted text-xs">${pl.number}</span></div>
        <div class="pipeline-meta">${escHtml(pl.commit)} · ${escHtml(pl.author)} · ${pl.trigger} · ${timeAgo(pl.startTime)} ${pl.duration?`· ${pl.duration}`:''}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        ${statusBadge(pl.status)}
        ${pl.status==='running'?`<button class="btn-table danger btn-xs" data-action="pipeline:cancel" data-id="${pl.id}">Cancel</button>`:''}
        ${pl.status==='failed'?`<button class="btn-table primary btn-xs" data-action="pipeline:retry" data-id="${pl.id}">Retry</button>`:''}
        <button class="btn-table btn-xs" data-action="pipeline:logs" data-id="${pl.id}">Logs</button>
      </div>
    </div>
    <div class="pipeline-stages">
      ${pl.stages.map((s,i)=>`
      <div class="stage-item" style="animation-delay:${i*0.04}s">
        <div class="stage-dot ${pl.stageStatus[i]}">${pl.stageStatus[i]==='done'?'✓':pl.stageStatus[i]==='failed'?'✗':pl.stageStatus[i]==='running'?'…':String(i+1)}</div>
        <div class="stage-label">${stageNames[i]}</div>
        ${pl.stageTimes[i]?`<div class="stage-time">${pl.stageTimes[i]}</div>`:'<div class="stage-time">—</div>'}
      </div>`).join('')}
    </div>
  </div>`;
}

function simulatePipeline(id) {
  const pl=AppState.pipelines.find(p=>p.id===id); if(!pl||pl.status!=='running') return;
  const stageDurations=[500,3000,5000,3500,2500,2000]; // ms
  let currentStage=pl.stageStatus.indexOf('running');
  if(currentStage===-1) { pl.stageStatus[0]='running'; currentStage=0; }

  const advance=()=>{
    if(currentStage>=pl.stages.length) return;
    const thisPl=AppState.pipelines.find(p=>p.id===id); if(!thisPl||thisPl.status==='cancelled') return;
    const dur=stageDurations[currentStage]+randBetween(-500,1000);
    const t=setTimeout(()=>{
      const p=AppState.pipelines.find(x=>x.id===id); if(!p||p.status==='cancelled') return;
      // Complete this stage
      p.stageStatus[currentStage]='done';
      p.stageTimes[currentStage]=fmtDuration(dur);
      currentStage++;
      if(currentStage<p.stages.length) {
        p.stageStatus[currentStage]='running';
        // Re-render row
        const row=document.getElementById('plrow-'+id);
        if(row) row.outerHTML=renderPipelineRow(p);
        advance();
      } else {
        p.status='success'; p.duration=fmtDuration(Date.now()-p.startTime);
        const row=document.getElementById('plrow-'+id);
        if(row) row.outerHTML=renderPipelineRow(p);
        AppState.logActivity({icon:'✅',cls:'green',text:`<strong>${p.name}</strong> deployed successfully`});
        toast('success','Deploy Successful',`${p.name} completed in ${p.duration}`);
      }
    }, dur);
    AppState.intervals.push(t);
  };
  advance();
}

function openTriggerPipelineModal() {
  const projOpts=AppState.projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  showModal({ title:'Run Pipeline', subtitle:'Configure and trigger a new pipeline run', size:'narrow',
    body:`
    <div class="form-group"><label class="form-label">Project <span class="req">*</span></label><select class="form-select" id="tpl-proj"><option value="">Select project…</option>${projOpts}</select></div>
    <div class="form-group"><label class="form-label">Branch</label><input class="form-input" id="tpl-branch" value="main"></div>
    <div class="form-group"><label class="form-label">Trigger Type</label><select class="form-select" id="tpl-trigger"><option value="manual">Manual</option><option value="push">Push</option><option value="pr">Pull Request</option></select></div>`,
    saveLabel:'Trigger Pipeline',
    onSave() {
      const projId=document.getElementById('tpl-proj').value;
      if(!projId) { toast('error','Select a project','Please select a project'); return; }
      const proj=getProject(projId);
      const branch=document.getElementById('tpl-branch').value||'main';
      const trigger=document.getElementById('tpl-trigger').value;
      const pl={ id:'pl'+uid(), name:`${proj.name} · ${branch}`, project:projId, branch, trigger, status:'running', stages:['code','build','test','scan','docker','deploy'], stageStatus:['running','pending','pending','pending','pending','pending'], stageTimes:[null,null,null,null,null,null], number:`#${proj.deploys+1}`, commit:Math.random().toString(36).substr(2,7), author:'You', startTime:Date.now(), duration:null };
      AppState.addPipeline(pl);
      AppState.updateProject(projId,{deploys:proj.deploys+1, lastDeploy:Date.now()});
      hideModal(); renderPipelines();
      simulatePipeline(pl.id);
      toast('info','Pipeline Triggered',`${proj.name} pipeline is starting…`);
    }
  });
}

function viewPipelineLogs(id) {
  const pl=AppState.pipelines.find(p=>p.id===id); if(!pl) return;
  const logs=generateFakeLogs(pl);
  showDrawer({ title:`Logs — ${pl.name} ${pl.number}`,
    body:`<div class="terminal" style="height:100%;border:none;border-radius:0">
      <div class="terminal-header"><div class="terminal-dots"><div class="terminal-dot"></div><div class="terminal-dot"></div><div class="terminal-dot"></div></div><span class="terminal-title">${escHtml(pl.name)} ${pl.number} • ${pl.trigger}</span><button class="btn-table btn-xs" style="margin-left:auto" onclick="navigator.clipboard.writeText(document.getElementById('log-body').innerText);window.toast('success','Copied','Logs copied to clipboard')">Copy</button></div>
      <div class="terminal-body" id="log-body" style="height:calc(100vh - 160px)">${logs.map(l=>`<div class="log-line"><span class="log-time">${l.time}</span><span class="log-${l.type}">${escHtml(l.msg)}</span></div>`).join('')}</div>
    </div>`,
  });
}

function generateFakeLogs(pl) {
  const lines=[];
  const t=(ms)=>{ const d=new Date(pl.startTime+ms); return d.toTimeString().substr(0,8); };
  lines.push({time:t(0),type:'info',msg:'Pipeline started by '+pl.author});
  lines.push({time:t(100),type:'info',msg:'Cloning repository '+pl.name.split(' · ')[0]+'...'});
  lines.push({time:t(1200),type:'success',msg:'✓ Repository cloned (HEAD commit: '+pl.commit+')'});
  if(pl.stageStatus[1]!=='pending') {
    lines.push({time:t(2000),type:'info',msg:'Starting build stage...'});
    lines.push({time:t(2500),type:'info',msg:'Running: npm install'});
    lines.push({time:t(8000),type:'info',msg:'Running: npm run build'});
  }
  if(pl.stageStatus[2]==='done') lines.push({time:t(10000),type:'success',msg:'✓ Build completed — 247 modules bundled'});
  if(pl.stageStatus[2]==='failed') lines.push({time:t(10000),type:'error',msg:'✗ Test failed: Expected 200 but received 500 on /api/health'});
  if(pl.stageStatus[3]==='done') { lines.push({time:t(15000),type:'info',msg:'Running Trivy vulnerability scan...'}); lines.push({time:t(18000),type:'success',msg:'✓ Scan complete: 0 critical, 1 high, 3 medium'}); }
  if(pl.stageStatus[4]==='done') { lines.push({time:t(20000),type:'info',msg:'Building Docker image...'}); lines.push({time:t(23000),type:'success',msg:'✓ Image pushed: registry.io/'+pl.name.split(' · ')[0].toLowerCase()+':'+pl.commit.substr(0,8)}); }
  if(pl.stageStatus[5]==='done') { lines.push({time:t(25000),type:'info',msg:'Deploying to production...'}); lines.push({time:t(26000),type:'success',msg:'✓ Deployment complete. 3/3 replicas healthy.'}); }
  if(pl.status==='failed') lines.push({time:t(15000),type:'error',msg:'Pipeline failed at stage: '+pl.stages[pl.stageStatus.indexOf('failed')]});
  return lines;
}

/* ================================================================
   PAGE: SECURITY CENTER
================================================================ */
function renderSecurity() {
  const content=document.getElementById('page-content');
  const {search,severity,status}=AppState.filters.security;
  let vulns=AppState.vulns.filter(v=>{
    if(search && !v.cve.toLowerCase().includes(search.toLowerCase()) && !v.package.toLowerCase().includes(search.toLowerCase()) && !v.affected.toLowerCase().includes(search.toLowerCase())) return false;
    if(severity!=='all' && v.severity!==severity) return false;
    if(status!=='all' && v.status!==status) return false;
    return true;
  });
  const openV=AppState.vulns.filter(v=>v.status!=='fixed');
  const critical=openV.filter(v=>v.severity==='critical').length;
  const high=openV.filter(v=>v.severity==='high').length;
  const medium=openV.filter(v=>v.severity==='medium').length;
  const riskScore=Math.round(Math.min(100,(critical*25+high*10+medium*4)));

  content.innerHTML=`
  <div class="page-header">
    <div><h1 class="page-title">Security Center</h1><p class="page-subtitle">${openV.length} open vulnerabilities · Risk score: <strong>${riskScore}/100</strong></p></div>
    <div class="page-actions">
      <button class="btn-secondary btn-sm" data-action="security:scan"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Run Scan</button>
    </div>
  </div>
  <!-- Security KPIs -->
  <div class="kpi-grid">
    <div class="kpi-card red"><div class="kpi-header"><div class="kpi-icon red">🔴</div></div><div class="kpi-value">${critical}</div><div class="kpi-label">Critical</div></div>
    <div class="kpi-card red"><div class="kpi-header"><div class="kpi-icon red">🟠</div></div><div class="kpi-value">${high}</div><div class="kpi-label">High</div></div>
    <div class="kpi-card yellow"><div class="kpi-header"><div class="kpi-icon yellow">🟡</div></div><div class="kpi-value">${medium}</div><div class="kpi-label">Medium</div></div>
    <div class="kpi-card green"><div class="kpi-header"><div class="kpi-icon green">✅</div></div><div class="kpi-value">${AppState.vulns.filter(v=>v.status==='fixed').length}</div><div class="kpi-label">Fixed</div></div>
    <div class="kpi-card blue"><div class="kpi-header"><div class="kpi-icon blue">📊</div></div><div class="kpi-value">${riskScore}</div><div class="kpi-label">Risk Score</div></div>
  </div>
  <!-- Scan Progress (if running) -->
  <div id="scan-progress-wrap" class="${AppState.scanRunning?'':'hidden'}" style="margin-bottom:20px">
    <div class="card"><div class="card-header"><span class="card-title">🔍 Security Scan Running…</span><span class="text-xs text-muted" id="scan-pct">0%</span></div>
    <div class="progress-bar"><div class="progress-fill blue" id="scan-fill" style="width:${AppState.scanProgress}%"></div></div></div>
  </div>
  <!-- Filter -->
  <div class="filter-bar">
    <div class="search-input-wrap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="search-input" id="sec-search" placeholder="Search by CVE, package, service…" value="${escHtml(search)}"></div>
    <select class="filter-select" id="sec-sev-filter"><option value="all">All Severities</option>${['critical','high','medium','low'].map(s=>`<option ${severity===s?'selected':''}>${s}</option>`).join('')}</select>
    <select class="filter-select" id="sec-status-filter"><option value="all">All Statuses</option>${['open','in_progress','fixed'].map(s=>`<option value="${s}" ${status===s?'selected':''}>${s.replace('_',' ')}</option>`).join('')}</select>
  </div>
  <!-- Vuln Table -->
  <div class="table-card">
  <div class="table-wrapper"><table>
    <thead><tr><th>CVE ID</th><th>Package</th><th>Severity</th><th>CVSS</th><th>Service</th><th>Status</th><th>Assignee</th><th>Discovered</th><th>Actions</th></tr></thead>
    <tbody>${vulns.length?vulns.map(v=>{
      const assignee=v.assignee?getMember(v.assignee):null;
      return `<tr>
        <td class="td-primary font-mono text-xs">${escHtml(v.cve)}</td>
        <td class="text-sm font-mono">${escHtml(v.package)}</td>
        <td>${severityBadge(v.severity)}</td>
        <td><span style="color:${v.cvss>=9?'var(--danger)':v.cvss>=7?'var(--warning)':'var(--success)'};font-weight:700">${v.cvss.toFixed(1)}</span></td>
        <td class="text-sm">${escHtml(v.affected)}</td>
        <td>${statusBadge(v.status)}</td>
        <td>${assignee?`<div style="display:flex;align-items:center;gap:6px"><div class="assignee-avatar" style="background:${avatarBg(assignee.avatar)}">${assignee.initials}</div><span class="text-xs">${assignee.name}</span></div>`:`<button class="btn-table btn-xs" data-action="security:assign" data-id="${v.id}">Assign</button>`}</td>
        <td class="text-xs text-muted">${timeAgo(v.discovered)}</td>
        <td><div class="td-actions">
          <button class="btn-table btn-xs" data-action="security:view" data-id="${v.id}">Details</button>
          ${v.status!=='fixed'?`<button class="btn-table success btn-xs" data-action="security:fix" data-id="${v.id}">Mark Fixed</button>`:''}
          ${v.status==='open'?`<button class="btn-table primary btn-xs" data-action="security:in-progress" data-id="${v.id}">In Progress</button>`:''}
        </div></td>
      </tr>`;
    }).join(''):
    `<tr><td colspan="9"><div class="empty-state" style="padding:30px"><div class="empty-state-icon">🛡️</div><h3>No vulnerabilities found</h3><p>Adjust filters or run a new scan.</p></div></td></tr>`}
    </tbody>
  </table></div></div>`;

  document.getElementById('sec-search')?.addEventListener('input',debounce(e=>{AppState.filters.security.search=e.target.value;renderSecurity();},300));
  document.getElementById('sec-sev-filter')?.addEventListener('change',e=>{AppState.filters.security.severity=e.target.value;renderSecurity();});
  document.getElementById('sec-status-filter')?.addEventListener('change',e=>{AppState.filters.security.status=e.target.value;renderSecurity();});
}

function runSecurityScan() {
  if(AppState.scanRunning) return;
  AppState.scanRunning=true; AppState.scanProgress=0;
  toast('info','Scan Started','Running Trivy vulnerability scan across all images…');
  const wrap=document.getElementById('scan-progress-wrap');
  if(wrap) wrap.classList.remove('hidden');
  const iv=setInterval(()=>{
    AppState.scanProgress=Math.min(100,AppState.scanProgress+randBetween(3,9));
    const fill=document.getElementById('scan-fill'); const pct=document.getElementById('scan-pct');
    if(fill) fill.style.width=AppState.scanProgress+'%';
    if(pct) pct.textContent=AppState.scanProgress+'%';
    if(AppState.scanProgress>=100) {
      clearInterval(iv);
      AppState.scanRunning=false;
      // Add a random new vuln occasionally
      if(Math.random()>0.5) {
        const newVuln={ id:'v'+uid(), cve:'CVE-2024-'+randBetween(10000,99999), package:'lodash 4.17.21', severity:['low','medium'][Math.floor(Math.random()*2)], cvss:parseFloat((Math.random()*4+2).toFixed(1)), affected:AppState.projects[randBetween(0,AppState.projects.length-1)].name, status:'open', assignee:null, desc:'Prototype pollution vulnerability.', remediation:'Upgrade to lodash 4.17.22', discovered:Date.now() };
        AppState.vulns.push(newVuln);
        toast('warning','New Vulnerability Found',`${newVuln.cve} detected in ${newVuln.affected}`);
      } else {
        toast('success','Scan Complete','No new vulnerabilities detected');
      }
      if(wrap) wrap.classList.add('hidden');
      renderSecurity();
    }
  },180);
  AppState.intervals.push(iv);
}

function viewVulnDetails(id) {
  const v=AppState.vulns.find(x=>x.id===id); if(!v) return;
  const memberOpts=AppState.team.map(m=>`<option value="${m.id}" ${v.assignee===m.id?'selected':''}>${m.name}</option>`).join('');
  showModal({ title:v.cve, subtitle:`${v.package} · CVSS ${v.cvss}`, size:'wide', onSave:false,
    body:`
    <div class="form-grid-2" style="margin-bottom:16px">
      <div>${severityBadge(v.severity)}</div>
      <div>${statusBadge(v.status)}</div>
    </div>
    <div class="form-group"><label class="form-label">Affected Service</label><div class="form-input" style="background:var(--bg)">${escHtml(v.affected)}</div></div>
    <div class="form-group"><label class="form-label">Package</label><div class="form-input font-mono text-sm" style="background:var(--bg)">${escHtml(v.package)}</div></div>
    <div class="form-group"><label class="form-label">Description</label><div style="padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);font-size:0.875rem;color:var(--text-secondary)">${escHtml(v.desc)}</div></div>
    <div class="form-group"><label class="form-label">Remediation</label><div style="padding:10px;background:var(--success-bg);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius);font-size:0.875rem;color:var(--success)">${escHtml(v.remediation)}</div></div>
    <div class="form-group"><label class="form-label">Assign To</label><select class="form-select" id="vuln-assign-sel"><option value="">Unassigned</option>${memberOpts}</select></div>
    <div style="display:flex;gap:8px;margin-top:4px">
      ${v.status!=='fixed'?`<button class="btn-success btn-sm" data-action="security:fix" data-id="${id}">Mark as Fixed</button>`:''}
      ${v.status==='open'?`<button class="btn-primary btn-sm" data-action="security:in-progress" data-id="${id}">Mark In Progress</button>`:''}
      <button class="btn-secondary btn-sm" onclick="const sel=document.getElementById('vuln-assign-sel');if(!sel.value)return;AppState.updateVuln('${id}',{assignee:sel.value});window.hideModal();window.renderSecurity();window.toast('success','Assigned','Vulnerability assigned successfully')">Save Assignee</button>
    </div>`,
    cancelLabel:'Close',
  });
}

/* ================================================================
   PAGE: CONTAINERS
================================================================ */
function renderContainers() {
  const content=document.getElementById('page-content');
  const {search,status}=AppState.filters.containers;
  const filtered=AppState.containers.filter(c=>{
    if(search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.image.toLowerCase().includes(search.toLowerCase())) return false;
    if(status!=='all' && c.status!==status) return false;
    return true;
  });
  const running=AppState.containers.filter(c=>c.status==='running').length;

  content.innerHTML=`
  <div class="page-header">
    <div><h1 class="page-title">Containers</h1><p class="page-subtitle">${running} running · ${AppState.containers.length-running} stopped/error</p></div>
    <div class="page-actions">
      <button class="btn-secondary btn-sm" data-action="containers:pull-image"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Pull Image</button>
    </div>
  </div>
  <!-- Live Stats -->
  <div class="kpi-grid" style="margin-bottom:20px">
    <div class="kpi-card green"><div class="kpi-header"><div class="kpi-icon green">🟢</div></div><div class="kpi-value">${running}</div><div class="kpi-label">Running</div></div>
    <div class="kpi-card neutral"><div class="kpi-header"><div class="kpi-icon neutral">⚫</div></div><div class="kpi-value">${AppState.containers.filter(c=>c.status==='stopped').length}</div><div class="kpi-label">Stopped</div></div>
    <div class="kpi-card red"><div class="kpi-header"><div class="kpi-icon red">🔴</div></div><div class="kpi-value">${AppState.containers.filter(c=>c.status==='error').length}</div><div class="kpi-label">Error</div></div>
    <div class="kpi-card blue"><div class="kpi-header"><div class="kpi-icon blue">💾</div></div><div class="kpi-value">${(AppState.containers.reduce((s,c)=>s+c.mem,0)/1024).toFixed(1)} GB</div><div class="kpi-label">Memory Used</div></div>
  </div>
  <div class="filter-bar">
    <div class="search-input-wrap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="search-input" id="ct-search" placeholder="Search containers…" value="${escHtml(search)}"></div>
    <div class="filter-pills">${['all','running','stopped','error'].map(s=>`<button class="filter-pill ${status===s?'active':''}" data-action="containers:filter-status" data-val="${s}">${s==='all'?'All':s.charAt(0).toUpperCase()+s.slice(1)}</button>`).join('')}</div>
  </div>
  <div class="table-card"><div class="table-wrapper"><table>
    <thead><tr><th>Container</th><th>Image</th><th>Status</th><th>CPU %</th><th>Memory</th><th>Restarts</th><th>Uptime</th><th>Node</th><th>Actions</th></tr></thead>
    <tbody id="container-tbody">
      ${renderContainerRows(filtered)}
    </tbody>
  </table></div></div>`;

  document.getElementById('ct-search')?.addEventListener('input',debounce(e=>{AppState.filters.containers.search=e.target.value;renderContainers();},300));

  // Live CPU/RAM simulation
  const iv=setInterval(()=>{
    AppState.containers.forEach(c=>{
      if(c.status==='running') {
        c.cpu=clamp(c.cpu+randBetween(-5,6),1,90);
        c.mem=clamp(c.mem+randBetween(-20,25),64,c.memLimit*0.9);
      }
    });
    const tbody=document.getElementById('container-tbody');
    if(tbody) { const f=AppState.containers.filter(c=>{const s=AppState.filters.containers.search;const st=AppState.filters.containers.status;if(s&&!c.name.toLowerCase().includes(s.toLowerCase()))return false;if(st!=='all'&&c.status!==st)return false;return true;}); tbody.innerHTML=renderContainerRows(f); }
  },2500);
  AppState.intervals.push(iv);
}

function renderContainerRows(containers) {
  return containers.map(c=>`
  <tr>
    <td class="td-primary"><div style="display:flex;align-items:center;gap:8px"><div class="container-status-dot ${c.status}"></div>${escHtml(c.name)}</div></td>
    <td class="text-xs font-mono text-muted">${escHtml(c.image)}</td>
    <td>${statusBadge(c.status)}</td>
    <td><div style="min-width:100px">
      <div style="display:flex;justify-content:space-between;font-size:0.6875rem;color:var(--text-muted);margin-bottom:3px"><span>${c.cpu}%</span></div>
      <div class="progress-bar"><div class="progress-fill ${c.cpu>75?'red':c.cpu>50?'yellow':'blue'}" style="width:${c.cpu}%"></div></div>
    </div></td>
    <td><div style="min-width:120px">
      <div style="display:flex;justify-content:space-between;font-size:0.6875rem;color:var(--text-muted);margin-bottom:3px"><span>${c.mem} MB / ${c.memLimit} MB</span></div>
      <div class="progress-bar"><div class="progress-fill ${(c.mem/c.memLimit)>0.8?'red':(c.mem/c.memLimit)>0.6?'yellow':'green'}" style="width:${Math.min(100,(c.mem/c.memLimit)*100).toFixed(0)}%"></div></div>
    </div></td>
    <td><span style="color:${c.restarts>3?'var(--danger)':c.restarts>0?'var(--warning)':'var(--text-secondary)'}">${c.restarts}</span></td>
    <td class="text-xs text-muted">${c.uptime?timeAgo(c.uptime):'—'}</td>
    <td class="text-xs font-mono text-muted">${escHtml(c.node)}</td>
    <td><div class="td-actions">
      <button class="btn-table btn-xs" data-action="containers:logs" data-id="${c.id}">Logs</button>
      ${c.status==='running'?`<button class="btn-table danger btn-xs" data-action="containers:stop" data-id="${c.id}">Stop</button><button class="btn-table btn-xs" data-action="containers:restart" data-id="${c.id}">Restart</button>`:`<button class="btn-table success btn-xs" data-action="containers:start" data-id="${c.id}">Start</button>`}
    </div></td>
  </tr>`).join('');
}

function containerAction(id, action) {
  const c=AppState.containers.find(x=>x.id===id); if(!c) return;
  if(action==='stop') { c.status='stopped'; c.cpu=0; c.mem=0; c.uptime=null; toast('info','Container Stopped',`${c.name} has been stopped`); }
  else if(action==='start') { c.status='running'; c.cpu=randBetween(5,25); c.mem=randBetween(64,256); c.uptime=Date.now(); c.restarts=0; toast('success','Container Started',`${c.name} is now running`); }
  else if(action==='restart') { c.restarts+=1; c.uptime=Date.now(); toast('info','Container Restarted',`${c.name} restarted`); }
  AppState.logActivity({icon:'🐳',cls:'blue',text:`<strong>${c.name}</strong> container ${action}ped`});
  renderContainers();
}

function viewContainerLogs(id) {
  const c=AppState.containers.find(x=>x.id===id); if(!c) return;
  const lines=[];
  if(c.status==='running') {
    for(let i=0;i<25;i++) {
      const t=new Date(Date.now()-i*5000).toISOString();
      const msgs=['GET /health 200 2ms','Processing request queue','Memory usage within limits','Connection pool: 8/20 active','Background job completed','Heartbeat sent to orchestrator'];
      lines.push({time:t.substr(11,8),type:i%7===0?'warn':i%13===0?'error':'info',msg:msgs[Math.floor(Math.random()*msgs.length)]});
    }
  }
  showDrawer({ title:`Logs — ${c.name}`,
    body:`<div class="terminal" style="height:100%;border:none;border-radius:0">
      <div class="terminal-header"><div class="terminal-dots"><div class="terminal-dot"></div><div class="terminal-dot"></div><div class="terminal-dot"></div></div><span class="terminal-title">${c.name} · ${c.image}</span></div>
      <div class="terminal-body" style="height:calc(100vh - 130px)">${c.status!=='running'?'<div class="log-line"><span class="log-warn">Container is not running. No logs available.</span></div>':lines.map(l=>`<div class="log-line"><span class="log-time">${l.time}</span><span class="log-${l.type}">${escHtml(l.msg)}</span></div>`).join('')}</div>
    </div>`,
  });
}

function openPullImageModal() {
  showModal({ title:'Pull Docker Image', size:'narrow',
    body:`
    <div class="form-group"><label class="form-label">Registry</label><select class="form-select" id="pi-reg"><option>Docker Hub</option><option>AWS ECR</option><option>GitHub Container Registry</option><option>Custom Registry</option></select></div>
    <div class="form-group"><label class="form-label">Image Name <span class="req">*</span></label><input class="form-input" id="pi-img" placeholder="nginx"></div>
    <div class="form-group"><label class="form-label">Tag</label><input class="form-input" id="pi-tag" placeholder="latest" value="latest"></div>`,
    saveLabel:'Pull Image',
    onSave() {
      const img=document.getElementById('pi-img').value.trim();
      if(!img) { toast('error','Image name required','Please enter an image name'); return; }
      const tag=document.getElementById('pi-tag').value||'latest';
      hideModal();
      toast('info','Pulling Image',`Downloading ${img}:${tag}…`);
      setTimeout(()=>toast('success','Image Ready',`${img}:${tag} is available`),3000);
    }
  });
}

/* ================================================================
   PAGE: CLOUD RESOURCES
================================================================ */
function renderCloud() {
  const content=document.getElementById('page-content');
  const runningEC2=AppState.ec2.filter(e=>e.state==='running').length;
  const totalCost=1284.52;
  const s3Count=(AppState.s3 || []).length;

  content.innerHTML=`
  <div class="page-header">
    <div><h1 class="page-title">Cloud Resources</h1><p class="page-subtitle">AWS ap-south-1 · ${runningEC2} EC2 running</p></div>
    <div class="page-actions">
      <button class="btn-secondary btn-sm" data-action="cloud:sync"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>Sync AWS</button>
    </div>
  </div>
  <div class="kpi-grid">
    <div class="kpi-card blue"><div class="kpi-header"><div class="kpi-icon blue">🖥️</div></div><div class="kpi-value">${runningEC2}/${AppState.ec2.length}</div><div class="kpi-label">EC2 Running</div></div>
    <div class="kpi-card green"><div class="kpi-header"><div class="kpi-icon green">🗄️</div></div><div class="kpi-value">${AppState.rds.length}</div><div class="kpi-label">RDS Instances</div></div>
    <div class="kpi-card purple"><div class="kpi-header"><div class="kpi-icon purple">🪣</div></div><div class="kpi-value">${s3Count}</div><div class="kpi-label">S3 Buckets</div></div>
    <div class="kpi-card yellow"><div class="kpi-header"><div class="kpi-icon yellow">💰</div></div><div class="kpi-value">$${totalCost}</div><div class="kpi-label">Monthly Cost</div></div>
  </div>
  <!-- EC2 -->
  <div class="card" style="margin-bottom:20px">
    <div class="card-header"><span class="card-title">EC2 Instances</span></div>
    <div class="table-wrapper"><table>
      <thead><tr><th>Instance ID</th><th>Name</th><th>Type</th><th>State</th><th>Zone</th><th>Public IP</th><th>CPU</th><th>Uptime</th><th>Actions</th></tr></thead>
      <tbody id="ec2-tbody">${renderEC2Rows()}</tbody>
    </table></div>
  </div>
  <!-- RDS -->
  <div class="card" style="margin-bottom:20px">
    <div class="card-header"><span class="card-title">RDS Instances</span></div>
    <div class="table-wrapper"><table>
      <thead><tr><th>Identifier</th><th>Engine</th><th>Class</th><th>State</th><th>Connections</th><th>Storage</th><th>Endpoint</th></tr></thead>
      <tbody>${AppState.rds.map(r=>`<tr>
        <td class="td-primary font-mono text-xs">${escHtml(r.id)}</td>
        <td class="text-sm">${escHtml(r.engine)}</td>
        <td class="text-xs font-mono">${escHtml(r.class)}</td>
        <td>${statusBadge(r.state)}</td>
        <td><span style="color:${r.connections>25?'var(--danger)':r.connections>15?'var(--warning)':'var(--success)'}">${r.connections}</span></td>
        <td class="text-sm">${escHtml(r.storage)}</td>
        <td class="text-xs font-mono text-muted" style="max-width:200px;overflow:hidden;text-overflow:ellipsis">${escHtml(r.endpoint)}</td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>
  <!-- S3 Buckets -->
  <div class="card">
    <div class="card-header"><span class="card-title">S3 Buckets</span></div>
    <div class="table-wrapper"><table>
      <thead><tr><th>Bucket Name</th><th>Region</th><th>State</th><th>Created At</th><th>Versioning</th></tr></thead>
      <tbody>${(AppState.s3 || []).map(s=>`<tr>
        <td class="td-primary font-mono text-xs">${escHtml(s.name || s.id)}</td>
        <td class="text-xs font-mono">${escHtml(s.region || '—')}</td>
        <td>${statusBadge(s.state || s.status || 'active')}</td>
        <td class="text-xs text-muted">${escHtml(s.launch_time || '—')}</td>
        <td><span class="badge badge-info" style="font-size:0.75rem">${escHtml(s.metadata?.Versioning || 'Enabled')}</span></td>
      </tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

function renderEC2Rows() {
  return AppState.ec2.map(e=>`<tr>
    <td class="font-mono text-xs text-muted">${escHtml(e.id.substr(-8))}</td>
    <td class="td-primary">${escHtml(e.name)}</td>
    <td class="text-xs font-mono">${escHtml(e.type)}</td>
    <td>${statusBadge(e.state)}</td>
    <td class="text-xs text-muted">${escHtml(e.zone)}</td>
    <td class="text-xs font-mono">${e.ip||'—'}</td>
    <td><div style="min-width:80px">
      <div class="progress-bar"><div class="progress-fill ${e.cpu>80?'red':e.cpu>60?'yellow':'blue'}" style="width:${e.cpu}%"></div></div>
      <div style="font-size:0.6875rem;color:var(--text-muted);margin-top:2px">${e.cpu}%</div>
    </div></td>
    <td class="text-xs text-muted">${e.uptime||'—'}</td>
    <td><div class="td-actions">
      ${e.state==='running'?`<button class="btn-table danger btn-xs" data-action="cloud:ec2-stop" data-id="${e.id}">Stop</button>`:`<button class="btn-table success btn-xs" data-action="cloud:ec2-start" data-id="${e.id}">Start</button>`}
      <button class="btn-table btn-xs" data-action="cloud:ec2-connect" data-id="${e.id}">Connect</button>
    </div></td>
  </tr>`).join('');
}

function ec2Action(id, action) {
  const e=AppState.ec2.find(x=>x.id===id); if(!e) return;
  if(action==='stop') { e.state='stopped'; e.ip=null; e.cpu=0; e.uptime=null; toast('warning','EC2 Stopping',`${e.name} is shutting down`); }
  else if(action==='start') { e.state='running'; e.ip=`13.${randBetween(0,255)}.${randBetween(0,255)}.${randBetween(0,255)}`; e.cpu=randBetween(10,50); e.uptime='0h'; toast('success','EC2 Starting',`${e.name} is booting up`); }
  else if(action==='connect') { toast('info','Connecting',`Opening SSH session to ${e.name}…`); }
  const tbody=document.getElementById('ec2-tbody'); if(tbody) tbody.innerHTML=renderEC2Rows();
}

/* ================================================================
   PAGE: MONITORING
================================================================ */
function renderMonitoring() {
  const content=document.getElementById('page-content');
  const unackedAlerts=AppState.alerts.filter(a=>!a.acknowledged);

  content.innerHTML=`
  <div class="page-header">
    <div><h1 class="page-title">Monitoring</h1><p class="page-subtitle">${unackedAlerts.length} active alerts</p></div>
    <div class="page-actions">
      <button class="btn-secondary btn-sm" data-action="monitoring:add-rule">+ Alert Rule</button>
    </div>
  </div>
  <!-- Metric Cards -->
  <div class="monitoring-grid">
    <div class="metric-card"><div class="metric-card-label">Request Rate</div><div class="metric-card-value" id="mon-rps" style="color:var(--info)">1,247</div><div class="metric-card-sub">req/sec · avg</div></div>
    <div class="metric-card"><div class="metric-card-label">Error Rate</div><div class="metric-card-value" id="mon-err" style="color:var(--danger)">0.12%</div><div class="metric-card-sub">5xx errors</div></div>
    <div class="metric-card"><div class="metric-card-label">P99 Latency</div><div class="metric-card-value" id="mon-lat" style="color:var(--warning)">142ms</div><div class="metric-card-sub">across all services</div></div>
    <div class="metric-card"><div class="metric-card-label">CPU (avg)</div><div class="metric-card-value" id="mon-cpu" style="color:var(--success)">38%</div><div class="metric-card-sub">all EC2 instances</div></div>
  </div>
  <!-- Charts -->
  <div class="charts-grid" style="margin-bottom:24px">
    <div class="chart-card"><div class="card-header"><span class="card-title">Request Rate (live)</span><span class="badge badge-success" style="font-size:0.6rem">Live</span></div><div class="chart-wrapper"><canvas id="mon-chart-rps"></canvas></div></div>
    <div class="chart-card"><div class="card-header"><span class="card-title">CPU Utilization (live)</span><span class="badge badge-success" style="font-size:0.6rem">Live</span></div><div class="chart-wrapper"><canvas id="mon-chart-cpu"></canvas></div></div>
  </div>
  <!-- Alerts -->
  <div class="card">
    <div class="card-header"><span class="card-title">Active Alerts</span>${unackedAlerts.length>0?`<span class="badge badge-danger">${unackedAlerts.length} unacknowledged</span>`:''}</div>
    <div id="alerts-list">${renderAlertsList()}</div>
  </div>`;

  setTimeout(initMonitoringCharts,50);
  startMonitoringSimulation();
}

function renderAlertsList() {
  const all=AppState.alerts;
  if(!all.length) return `<div class="empty-state" style="padding:30px"><div class="empty-state-icon">✅</div><h3>No alerts</h3><p>All systems are healthy.</p></div>`;
  return all.map(al=>`
  <div class="activity-item" id="alert-${al.id}" style="padding:14px 0;opacity:${al.acknowledged?0.5:1}">
    <div class="activity-icon" style="background:var(--${al.severity==='critical'?'danger-bg':'warning-bg'})">${al.severity==='critical'?'🔴':'⚠️'}</div>
    <div class="activity-content">
      <div class="activity-text"><strong>${escHtml(al.name)}</strong> — ${escHtml(al.resource)}: <strong>${escHtml(al.value)}</strong> (threshold: ${escHtml(al.threshold)})</div>
      <div class="activity-time">${al.acknowledged?'✓ Acknowledged · ':''}${timeAgo(al.since)}</div>
    </div>
    ${!al.acknowledged?`<button class="btn-table btn-xs" data-action="monitoring:ack" data-id="${al.id}">Acknowledge</button>`:'<span class="text-xs text-muted">Acked</span>'}
  </div>`).join('');
}

function initMonitoringCharts() {
  const labels=Array.from({length:20},(_,i)=>{ const d=new Date(Date.now()-((19-i)*15000)); return d.toTimeString().substr(3,5); });
  const rpsData=Array.from({length:20},()=>randBetween(900,1500));
  const cpuData=Array.from({length:20},()=>randBetween(25,70));

  newChart('mon-chart-rps','line',{ labels, datasets:[{ label:'req/s', data:rpsData, borderColor:'#38BDF8', borderWidth:2, pointRadius:0, tension:0.4, fill:true, backgroundColor:'rgba(56,189,248,0.08)' }] });
  newChart('mon-chart-cpu','line',{ labels, datasets:[{ label:'CPU %', data:cpuData, borderColor:'#10B981', borderWidth:2, pointRadius:0, tension:0.4, fill:true, backgroundColor:'rgba(16,185,129,0.08)' }] });
}

function startMonitoringSimulation() {
  let rpsVal=1247, errVal=0.12, latVal=142, cpuVal=38;
  const iv=setInterval(()=>{
    rpsVal=clamp(rpsVal+randBetween(-50,60),800,2000);
    errVal=parseFloat((clamp(errVal+randBetween(-2,2)/10,0,2)).toFixed(2));
    latVal=clamp(latVal+randBetween(-10,12),80,300);
    cpuVal=clamp(cpuVal+randBetween(-3,4),10,95);
    const rpsEl=document.getElementById('mon-rps'); if(rpsEl) rpsEl.textContent=rpsVal.toLocaleString();
    const errEl=document.getElementById('mon-err'); if(errEl) errEl.textContent=errVal+'%';
    const latEl=document.getElementById('mon-lat'); if(latEl) latEl.textContent=latVal+'ms';
    const cpuEl=document.getElementById('mon-cpu'); if(cpuEl) cpuEl.textContent=cpuVal+'%';
    // Update charts
    ['mon-chart-rps','mon-chart-cpu'].forEach(id=>{
      const chart=AppState.charts[id]; if(!chart) return;
      const val=id.includes('rps')?rpsVal:cpuVal;
      const now=new Date().toTimeString().substr(3,5);
      chart.data.labels.push(now); chart.data.labels.shift();
      chart.data.datasets[0].data.push(val); chart.data.datasets[0].data.shift();
      chart.update('none');
    });
  },3000);
  AppState.intervals.push(iv);
}

function acknowledgeAlert(id) {
  AppState.acknowledgeAlert(id);
  const alertEl=document.getElementById('alert-'+id);
  if(alertEl) { alertEl.style.opacity='0.5'; alertEl.querySelector('button')?.replaceWith(Object.assign(document.createElement('span'),{textContent:'Acked',className:'text-xs text-muted'})); }
  const alerts=document.getElementById('alerts-list'); if(alerts) alerts.innerHTML=renderAlertsList();
  toast('success','Alert Acknowledged',`Alert has been marked as acknowledged`);
}

function openAlertRuleModal() {
  showModal({ title:'Create Alert Rule', size:'narrow',
    body:`
    <div class="form-group"><label class="form-label">Rule Name <span class="req">*</span></label><input class="form-input" id="ar-name" placeholder="High CPU Alert"></div>
    <div class="form-group"><label class="form-label">Resource</label><select class="form-select" id="ar-res"><option>EC2 Instance</option><option>RDS</option><option>Container</option><option>Application</option></select></div>
    <div class="form-grid-2">
      <div class="form-group"><label class="form-label">Metric</label><select class="form-select"><option>CPU %</option><option>Memory %</option><option>Error Rate</option><option>Latency P99</option></select></div>
      <div class="form-group"><label class="form-label">Threshold</label><input class="form-input" placeholder="80"></div>
    </div>
    <div class="form-group"><label class="form-label">Severity</label><select class="form-select"><option>critical</option><option>warning</option><option>info</option></select></div>`,
    saveLabel:'Create Rule',
    onSave() {
      const name=document.getElementById('ar-name').value.trim();
      if(!name) { toast('error','Name required','Please enter a rule name'); return; }
      hideModal(); toast('success','Alert Rule Created',`${name} is now active`);
    }
  });
}

/* ================================================================
   PAGE: TASKS (Kanban)
================================================================ */
function renderTasks() {
  const content=document.getElementById('page-content');
  const {priority,assignee}=AppState.filters.tasks;
  const memberOpts=`<option value="all">All Members</option>${AppState.team.map(m=>`<option value="${m.id}">${m.name}</option>`).join('')}`;

  content.innerHTML=`
  <div class="page-header">
    <div><h1 class="page-title">Tasks</h1><p class="page-subtitle">${Object.values(AppState.tasks).flat().length} total tasks</p></div>
    <div class="page-actions">
      <select class="filter-select" id="task-priority-filter" style="font-size:0.8125rem"><option value="all">All Priorities</option>${['p1','p2','p3','p4'].map(p=>`<option value="${p}" ${priority===p?'selected':''}>${p.toUpperCase()}</option>`).join('')}</select>
      <select class="filter-select" id="task-assignee-filter" style="font-size:0.8125rem">${memberOpts}</select>
      <button class="btn-primary btn-sm" data-action="tasks:add"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>New Task</button>
    </div>
  </div>
  <div class="kanban-board" id="kanban-board">
    ${renderKanbanColumn('backlog','Backlog','#6B7280',priority,assignee)}
    ${renderKanbanColumn('inprogress','In Progress','#4F46E5',priority,assignee)}
    ${renderKanbanColumn('review','In Review','#F59E0B',priority,assignee)}
    ${renderKanbanColumn('completed','Completed','#10B981',priority,assignee)}
  </div>`;

  initKanbanDnd();
  document.getElementById('task-priority-filter')?.addEventListener('change',e=>{AppState.filters.tasks.priority=e.target.value;renderTasks();});
  document.getElementById('task-assignee-filter')?.addEventListener('change',e=>{AppState.filters.tasks.assignee=e.target.value;renderTasks();});
}

function renderKanbanColumn(col, title, color, priority, assignee) {
  let tasks=AppState.tasks[col];
  if(priority!=='all') tasks=tasks.filter(t=>t.priority===priority);
  if(assignee!=='all') tasks=tasks.filter(t=>t.assignee===assignee);
  return `<div class="kanban-col">
    <div class="kanban-col-header">
      <div class="kanban-col-title"><div class="kanban-col-indicator" style="background:${color}"></div>${title}</div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="kanban-col-count">${tasks.length}</span>
        <button class="btn-icon-sm" data-action="tasks:add-to-col" data-col="${col}" title="Add task" style="border:none;font-size:16px;line-height:1">+</button>
      </div>
    </div>
    <div class="kanban-cards" data-col="${col}">
      ${tasks.map(t=>renderKanbanCard(t,col)).join('')}
      ${tasks.length===0?`<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.8125rem">Drop tasks here</div>`:''}
    </div>
  </div>`;
}

function renderKanbanCard(t, col) {
  const assignee=t.assignee?getMember(t.assignee):null;
  const isOverdue=t.due&&Date.now()>t.due&&col!=='completed';
  const proj=t.project?getProject(t.project):null;
  return `<div class="kanban-card" draggable="true" data-task-id="${t.id}" data-col="${col}">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
      ${priorityBadge(t.priority)}
      <div class="kanban-card-actions">
        <button class="btn-icon-sm" data-action="tasks:edit" data-id="${t.id}" title="Edit" style="border:none;font-size:14px">✏️</button>
        <button class="btn-icon-sm" data-action="tasks:delete" data-id="${t.id}" title="Delete" style="border:none;font-size:14px">🗑️</button>
      </div>
    </div>
    <div class="kanban-card-title">${escHtml(t.title)}</div>
    ${proj?`<div class="text-xs text-muted" style="margin-bottom:6px">📁 ${escHtml(proj.name)}</div>`:''}
    ${(() => {
      const tagsList = typeof t.tags === 'string' ? t.tags.split(',').map(s=>s.trim()).filter(Boolean) : (Array.isArray(t.tags) ? t.tags : []);
      return tagsList.length ? `<div class="kanban-card-tags">${tagsList.map(tag=>`<span class="badge badge-neutral" style="font-size:0.625rem">${escHtml(tag)}</span>`).join('')}</div>` : '';
    })()}
    <div class="kanban-card-footer">
      ${assignee?`<div style="display:flex;align-items:center;gap:5px"><div class="assignee-avatar" style="background:${avatarBg(assignee.avatar)};width:22px;height:22px;font-size:0.5625rem">${assignee.initials}</div><span class="text-xs text-muted">${assignee.name.split(' ')[0]}</span></div>`:`<span class="text-xs text-muted">Unassigned</span>`}
      ${t.due?`<span class="due-date ${isOverdue?'overdue':''}">${isOverdue?'⚠️ ':''} ${fmtDate(t.due)}</span>`:''} 
    </div>
  </div>`;
}

function initKanbanDnd() {
  const cards=document.querySelectorAll('.kanban-card[draggable]');
  const cols=document.querySelectorAll('.kanban-cards[data-col]');
  cards.forEach(card=>{
    card.addEventListener('dragstart',e=>{ AppState.dragging={id:card.dataset.taskId,fromCol:card.dataset.col}; card.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
    card.addEventListener('dragend',()=>{ card.classList.remove('dragging'); cols.forEach(c=>c.classList.remove('drag-over')); AppState.dragging=null; });
  });
  cols.forEach(col=>{
    col.addEventListener('dragover',e=>{ e.preventDefault(); col.classList.add('drag-over'); });
    col.addEventListener('dragleave',()=>col.classList.remove('drag-over'));
    col.addEventListener('drop',e=>{ e.preventDefault(); col.classList.remove('drag-over'); if(!AppState.dragging) return; const toCol=col.dataset.col; if(AppState.dragging.fromCol!==toCol){ AppState.moveTask(AppState.dragging.id,toCol); AppState.logActivity({icon:'📋',cls:'blue',text:`Task moved to <strong>${toCol.replace('inprogress','In Progress')}</strong>`}); renderTasks(); } });
  });
}

function taskFormHTML(t={}) {
  const projOpts=`<option value="">No project</option>${AppState.projects.map(p=>`<option value="${p.id}" ${t.project===p.id?'selected':''}>${p.name}</option>`).join('')}`;
  const memberOpts=`<option value="">Unassigned</option>${AppState.team.map(m=>`<option value="${m.id}" ${t.assignee===m.id?'selected':''}>${m.name}</option>`).join('')}`;
  const dueVal=t.due?new Date(t.due).toISOString().split('T')[0]:'';
  return `
  <div class="form-group"><label class="form-label">Title <span class="req">*</span></label><input class="form-input" id="tf-title" placeholder="Task title" value="${escHtml(t.title||'')}"><div class="form-error">Title is required</div></div>
  <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="tf-desc" placeholder="Describe the task…">${escHtml(t.desc||'')}</textarea></div>
  <div class="form-grid-2">
    <div class="form-group"><label class="form-label">Priority</label><select class="form-select" id="tf-priority">${['p1','p2','p3','p4'].map(p=>`<option value="${p}" ${(t.priority||'p3')===p?'selected':''}>Priority ${p.toUpperCase()}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Due Date</label><input class="form-input" type="date" id="tf-due" value="${dueVal}"></div>
  </div>
  <div class="form-grid-2">
    <div class="form-group"><label class="form-label">Assignee</label><select class="form-select" id="tf-assignee">${memberOpts}</select></div>
    <div class="form-group"><label class="form-label">Project</label><select class="form-select" id="tf-project">${projOpts}</select></div>
  </div>
  <div class="form-group"><label class="form-label">Tags <span class="form-hint">(comma-separated)</span></label><input class="form-input" id="tf-tags" placeholder="backend, security" value="${(() => {
    const tagsList = typeof t.tags === 'string' ? t.tags.split(',').map(s=>s.trim()).filter(Boolean) : (Array.isArray(t.tags) ? t.tags : []);
    return escHtml(tagsList.join(', '));
  })()}"></div>`;
}

function openAddTaskModal(col='backlog') {
  showModal({ title:'New Task', subtitle:'Add a task to the board', body:taskFormHTML(), saveLabel:'Create Task',
    onSave() {
      const title=document.getElementById('tf-title').value.trim();
      if(!title) { document.getElementById('tf-title').closest('.form-group').classList.add('has-error'); return; }
      const tags=document.getElementById('tf-tags').value.split(',').map(s=>s.trim()).filter(Boolean);
      const dueVal=document.getElementById('tf-due').value;
      const task={ id:'t'+uid(), title, desc:document.getElementById('tf-desc').value, priority:document.getElementById('tf-priority').value, assignee:document.getElementById('tf-assignee').value||null, project:document.getElementById('tf-project').value||null, tags, due:dueVal?new Date(dueVal).getTime():null, createdAt:Date.now() };
      AppState.addTask(col,task);
      hideModal(); renderTasks();
      toast('success','Task Created',title);
    }
  });
}

function openEditTaskModal(id) {
  let task; for(const col of Object.keys(AppState.tasks)){ task=AppState.tasks[col].find(t=>t.id===id); if(task) break; }
  if(!task) return;
  showModal({ title:'Edit Task', body:taskFormHTML(task), saveLabel:'Save Changes',
    onSave() {
      const title=document.getElementById('tf-title').value.trim();
      if(!title) { document.getElementById('tf-title').closest('.form-group').classList.add('has-error'); return; }
      const tags=document.getElementById('tf-tags').value.split(',').map(s=>s.trim()).filter(Boolean);
      const dueVal=document.getElementById('tf-due').value;
      AppState.updateTask(id,{ title, desc:document.getElementById('tf-desc').value, priority:document.getElementById('tf-priority').value, assignee:document.getElementById('tf-assignee').value||null, project:document.getElementById('tf-project').value||null, tags, due:dueVal?new Date(dueVal).getTime():null });
      hideModal(); renderTasks();
      toast('success','Task Updated',title);
    }
  });
}

/* ================================================================
   PAGE: REPORTS
================================================================ */
function renderReports() {
  const content=document.getElementById('page-content');
  const tab=AppState.reportTab;

  content.innerHTML=`
  <div class="page-header">
    <div><h1 class="page-title">Reports</h1><p class="page-subtitle">Analytics and compliance reporting</p></div>
    <div class="page-actions">
      <button class="btn-secondary btn-sm" data-action="reports:print"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Print</button>
    </div>
  </div>
  <div class="report-tabs">
    ${[['deployment','Deployments'],['security','Security'],['compliance','Compliance'],['cost','Cost Analysis']].map(([id,label])=>`<button class="report-tab ${tab===id?'active':''}" data-action="reports:tab" data-tab="${id}">${label}</button>`).join('')}
  </div>
  <div id="report-content">${renderReportContent(tab)}</div>`;
}

function renderReportContent(tab) {
  const exportBar=`<div class="export-bar"><button class="export-btn" data-action="reports:export-csv" data-tab="${tab}">⬇️ Export CSV</button><button class="export-btn" data-action="reports:print">🖨️ Print Report</button></div>`;
  if(tab==='deployment') {
    const rows=AppState.projects.map(p=>[p.name,p.deploys,p.successRate+'%',p.status,timeAgo(p.lastDeploy)]);
    return `${exportBar}
    <div class="charts-grid" style="margin-bottom:24px"><div class="chart-card"><div class="card-header"><span class="card-title">Deploy Frequency (30 days)</span></div><div class="chart-wrapper"><canvas id="rep-chart-1"></canvas></div></div><div class="chart-card"><div class="card-header"><span class="card-title">Success Rate Trend</span></div><div class="chart-wrapper"><canvas id="rep-chart-2"></canvas></div></div></div>
    <div class="table-card"><div class="table-wrapper"><table><thead><tr><th>Project</th><th>Total Deploys</th><th>Success Rate</th><th>Status</th><th>Last Deploy</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td ${i===0?'class="td-primary"':''}>${i===3?statusBadge(c):escHtml(String(c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  }
  if(tab==='security') {
    const rows=AppState.vulns.map(v=>[v.cve,v.package,v.severity,v.cvss.toFixed(1),v.affected,v.status]);
    return `${exportBar}
    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card red"><div class="kpi-header"><div class="kpi-icon red">🔴</div></div><div class="kpi-value">${AppState.vulns.filter(v=>v.severity==='critical').length}</div><div class="kpi-label">Critical CVEs</div></div>
      <div class="kpi-card yellow"><div class="kpi-header"><div class="kpi-icon yellow">⚠️</div></div><div class="kpi-value">${AppState.vulns.filter(v=>v.status!=='fixed').length}</div><div class="kpi-label">Open Issues</div></div>
      <div class="kpi-card green"><div class="kpi-header"><div class="kpi-icon green">✅</div></div><div class="kpi-value">${AppState.vulns.filter(v=>v.status==='fixed').length}</div><div class="kpi-label">Remediated</div></div>
    </div>
    <div class="table-card"><div class="table-wrapper"><table><thead><tr><th>CVE ID</th><th>Package</th><th>Severity</th><th>CVSS</th><th>Service</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td ${i===0?'class="td-primary font-mono text-xs"':''}>${i===2?severityBadge(c):i===5?statusBadge(c):escHtml(String(c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  }
  if(tab==='compliance') {
    const checks=[
      {name:'SOC 2 Type II',status:'passed',score:'94%',last:'2024-06-01'},{name:'ISO 27001',status:'passed',score:'88%',last:'2024-05-15'},
      {name:'PCI DSS',status:'warning',score:'72%',last:'2024-06-10'},{name:'GDPR Readiness',status:'passed',score:'91%',last:'2024-06-01'},
      {name:'OWASP Top 10',status:'passed',score:'86%',last:'2024-06-15'},{name:'CIS Benchmarks',status:'warning',score:'78%',last:'2024-06-12'},
    ];
    return `${exportBar}<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">${checks.map(c=>`
    <div class="card"><div class="card-header"><span class="card-title">${escHtml(c.name)}</span>${statusBadge(c.status)}</div>
    <div class="kpi-value" style="font-size:1.5rem;margin-bottom:4px">${c.score}</div>
    <div class="progress-bar" style="margin-bottom:8px"><div class="progress-fill ${c.status==='passed'?'green':'yellow'}" style="width:${c.score}"></div></div>
    <div class="text-xs text-muted">Last audited: ${c.last}</div></div>`).join('')}</div>`;
  }
  if(tab==='cost') {
    const breakdown=[{name:'EC2',cost:642.30,pct:50},{name:'RDS',cost:384.20,pct:30},{name:'S3',cost:51.10,pct:4},{name:'CloudFront',cost:102.80,pct:8},{name:'Other',cost:103.12,pct:8}];
    return `${exportBar}
    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card yellow"><div class="kpi-header"><div class="kpi-icon yellow">💰</div></div><div class="kpi-value">$1,283</div><div class="kpi-label">This Month</div></div>
      <div class="kpi-card green"><div class="kpi-header"><div class="kpi-icon green">📈</div></div><div class="kpi-value">$1,197</div><div class="kpi-label">Last Month</div></div>
      <div class="kpi-card red"><div class="kpi-header"><div class="kpi-icon red">▲</div></div><div class="kpi-value">+7.2%</div><div class="kpi-label">MoM Change</div></div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Cost Breakdown</span></div>
    ${breakdown.map(b=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
      <span style="width:100px;font-size:0.875rem;color:var(--text-primary);font-weight:500">${b.name}</span>
      <div class="progress-bar-wrap"><div class="progress-bar"><div class="progress-fill blue" style="width:${b.pct}%"></div></div></div>
      <span style="width:80px;text-align:right;font-size:0.875rem;color:var(--text-primary);font-weight:600">$${b.cost.toFixed(2)}</span>
    </div>`).join('')}
    </div>`;
  }
  return '';
}

function initReportCharts() {
  const months=['Jan','Feb','Mar','Apr','May','Jun'];
  newChart('rep-chart-1','bar',{labels:months,datasets:[{label:'Deployments',data:[89,104,120,98,134,142],backgroundColor:'rgba(79,70,229,0.7)',borderRadius:4}]});
  newChart('rep-chart-2','line',{labels:months,datasets:[{label:'Success %',data:[93,94.2,96.1,95.5,97.2,98.2],borderColor:'#10B981',borderWidth:2,pointRadius:4,tension:0.4,fill:true,backgroundColor:'rgba(16,185,129,0.08)'}]},{scales:{y:{min:88,max:100,ticks:{callback:v=>v+'%'}}}});
}

function exportReportCSV(tab) {
  const data={
    deployment:[['Project','Deploys','Success Rate','Status','Last Deploy'],...AppState.projects.map(p=>[p.name,p.deploys,p.successRate+'%',p.status,timeAgo(p.lastDeploy)])],
    security:[['CVE ID','Package','Severity','CVSS','Service','Status'],...AppState.vulns.map(v=>[v.cve,v.package,v.severity,v.cvss,v.affected,v.status])],
    compliance:[['Control','Status','Score'],['SOC 2 Type II','Passed','94%'],['ISO 27001','Passed','88%'],['PCI DSS','Warning','72%'],['GDPR','Passed','91%']],
    cost:[['Service','Cost','%'],['EC2','$642.30','50%'],['RDS','$384.20','30%'],['S3','$51.10','4%'],['CloudFront','$102.80','8%'],['Other','$103.12','8%']],
  };
  csvDownload(data[tab]||data.deployment,`sentinelops-${tab}-report-${new Date().toISOString().split('T')[0]}.csv`);
  toast('success','Report Exported',`${tab} report downloaded as CSV`);
}

/* ================================================================
   PAGE: TEAM
================================================================ */
function renderTeam() {
  const content=document.getElementById('page-content');
  const {search,role,status}=AppState.filters.team;
  let members=AppState.team.filter(m=>{
    if(search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    if(role!=='all' && !m.role.toLowerCase().includes(role.toLowerCase())) return false;
    if(status!=='all' && m.status!==status) return false;
    return true;
  });

  content.innerHTML=`
  <div class="page-header">
    <div><h1 class="page-title">Team</h1><p class="page-subtitle">${AppState.team.filter(m=>m.status==='active').length} active members</p></div>
    <div class="page-actions">
      <button class="btn-primary btn-sm" data-action="team:invite"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>Invite Member</button>
    </div>
  </div>
  <div class="filter-bar">
    <div class="search-input-wrap"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="search-input" id="team-search" placeholder="Search by name or email…" value="${escHtml(search)}"></div>
    <select class="filter-select" id="team-role-filter"><option value="all">All Roles</option>${['DevOps Lead','Backend Engineer','Frontend Engineer','Security Engineer','Data Engineer','SRE'].map(r=>`<option ${role===r?'selected':''}>${r}</option>`).join('')}</select>
    <div class="filter-pills">${['all','active','inactive'].map(s=>`<button class="filter-pill ${status===s?'active':''}" data-action="team:filter-status" data-val="${s}">${s==='all'?'All':s.charAt(0).toUpperCase()+s.slice(1)}</button>`).join('')}</div>
  </div>
  ${members.length===0?`<div class="empty-state"><div class="empty-state-icon">👥</div><h3>No members found</h3><p>Adjust your search or invite a new member.</p></div>`:
  `<div class="team-grid">${members.map(m=>`
  <div class="team-card">
    <div class="team-avatar" style="background:${avatarBg(m.avatar)}">${m.initials}</div>
    <div class="team-name">${escHtml(m.name)}</div>
    <div class="team-email">${escHtml(m.email)}</div>
    <div>${statusBadge(m.status)}</div>
    <div class="text-xs text-muted">${escHtml(m.role)} · ${escHtml(m.dept)}</div>
    <div class="team-card-footer">
      <span class="text-xs text-muted">Since ${escHtml(m.joined)}</span>
      <div style="display:flex;gap:6px">
        <button class="btn-table btn-xs" data-action="team:edit" data-id="${m.id}">Edit</button>
        <button class="btn-table danger btn-xs" data-action="team:remove" data-id="${m.id}">Remove</button>
      </div>
    </div>
  </div>`).join('')}</div>`}`;

  document.getElementById('team-search')?.addEventListener('input',debounce(e=>{AppState.filters.team.search=e.target.value;renderTeam();},300));
  document.getElementById('team-role-filter')?.addEventListener('change',e=>{AppState.filters.team.role=e.target.value;renderTeam();});
}

function memberFormHTML(m={}) {
  const roles=['DevOps Lead','Backend Engineer','Frontend Engineer','Security Engineer','Data Engineer','SRE','Product Manager','QA Engineer'];
  const depts=['Platform Engineering','Core Services','Product','Security','Data Platform','QA'];
  return `
  <div class="form-grid-2">
    <div class="form-group"><label class="form-label">Full Name <span class="req">*</span></label><input class="form-input" id="mf-name" placeholder="John Doe" value="${escHtml(m.name||'')}"><div class="form-error">Name is required</div></div>
    <div class="form-group"><label class="form-label">Email <span class="req">*</span></label><input class="form-input" type="email" id="mf-email" placeholder="user@company.com" value="${escHtml(m.email||'')}"><div class="form-error">Valid email required</div></div>
  </div>
  <div class="form-grid-2">
    <div class="form-group"><label class="form-label">Role</label><select class="form-select" id="mf-role">${roles.map(r=>`<option ${(m.role||''===r)?'selected':''}>${r}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Department</label><select class="form-select" id="mf-dept">${depts.map(d=>`<option ${(m.dept||'')===d?'selected':''}>${d}</option>`).join('')}</select></div>
  </div>
  <div class="form-group"><label class="form-label">Status</label><select class="form-select" id="mf-status"><option value="active" ${(m.status||'active')==='active'?'selected':''}>Active</option><option value="inactive" ${m.status==='inactive'?'selected':''}>Inactive</option></select></div>`;
}

function openInviteModal() {
  showModal({ title:'Invite Team Member', subtitle:'Send an invitation to join SentinelOps', body:memberFormHTML(),
    saveLabel:'Send Invite',
    onSave() {
      const name=document.getElementById('mf-name').value.trim();
      const email=document.getElementById('mf-email').value.trim();
      const nameGrp=document.getElementById('mf-name').closest('.form-group');
      const emailGrp=document.getElementById('mf-email').closest('.form-group');
      nameGrp.classList.toggle('has-error',!name);
      emailGrp.classList.toggle('has-error',!email||!email.includes('@'));
      if(!name||!email||!email.includes('@')) return;
      const initials=name.split(' ').map(n=>n[0]).join('').substr(0,2).toUpperCase();
      const bgs=['bg1','bg2','bg3','bg4','bg5','bg6'];
      const member={ id:'m'+uid(), name, email, role:document.getElementById('mf-role').value, dept:document.getElementById('mf-dept').value, status:'active', joined:new Date().toLocaleDateString('en-US',{month:'short',year:'numeric'}), avatar:bgs[Math.floor(Math.random()*bgs.length)], initials, permissions:['read'] };
      AppState.addTeamMember(member);
      AppState.logActivity({icon:'👤',cls:'purple',text:`<strong>${name}</strong> was invited to join SentinelOps`});
      hideModal(); renderTeam();
      toast('success','Invite Sent',`${name} has been invited to ${email}`);
    }
  });
}

function openEditMemberModal(id) {
  const m=AppState.team.find(x=>x.id===id); if(!m) return;
  showModal({ title:'Edit Member', subtitle:`Editing ${m.name}`, body:memberFormHTML(m), saveLabel:'Save Changes',
    onSave() {
      const name=document.getElementById('mf-name').value.trim();
      const email=document.getElementById('mf-email').value.trim();
      if(!name||!email) { toast('error','Validation Error','Name and email are required'); return; }
      AppState.updateTeamMember(id,{ name, email, role:document.getElementById('mf-role').value, dept:document.getElementById('mf-dept').value, status:document.getElementById('mf-status').value, initials:name.split(' ').map(n=>n[0]).join('').substr(0,2).toUpperCase() });
      hideModal(); renderTeam();
      toast('success','Member Updated',`${name}'s profile has been updated`);
    }
  });
}

/* ================================================================
   PAGE: PROFILE
================================================================ */
function renderProfile() {
  const content = document.getElementById('page-content');
  const u = AppState.user;

  content.innerHTML = `
  <div class="page-header">
    <div>
      <h1 class="page-title">User Profile</h1>
      <p class="page-subtitle">Manage your personal details, credentials, and settings</p>
    </div>
  </div>
  
  <div class="row">
    <div class="col-2">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><span class="card-title">Personal Details</span></div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Full Name <span class="req">*</span></label>
            <input class="form-input" id="p-name" value="${escHtml(u.name)}">
          </div>
          <div class="form-group">
            <label class="form-label">Email Address <span class="req">*</span></label>
            <input class="form-input" type="email" id="p-email" value="${escHtml(u.email)}">
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Role</label>
            <input class="form-input" value="${escHtml(u.role)}" disabled style="opacity: 0.6; cursor: not-allowed;">
          </div>
          <div class="form-group">
            <label class="form-label">Avatar Initials</label>
            <input class="form-input" value="${escHtml(u.avatar)}" disabled style="opacity: 0.6; cursor: not-allowed;">
          </div>
        </div>
        <div style="margin-top:16px;display:flex;gap:8px">
          <button class="btn-primary btn-sm" data-action="profile:save">Save Changes</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">SSH Keys & API Tokens</span></div>
        <div class="form-group">
          <label class="form-label">Authorized SSH Public Keys</label>
          <textarea class="form-input font-mono" id="p-ssh-key" style="min-height: 80px; font-size: 11px;">${escHtml(u.sshKey || '')}</textarea>
          <span class="form-hint">Used for secure deployments and instance terminal access.</span>
        </div>
        <div class="form-group" style="margin-top: 16px;">
          <label class="form-label">API Access Token</label>
          <div style="display:flex; gap:8px;">
            <input class="form-input font-mono" type="password" id="p-api-token" value="${escHtml(u.apiToken)}" readonly style="font-size: 12px; flex: 1;">
            <button class="btn-secondary btn-sm" id="btn-toggle-token" onclick="const t = document.getElementById('p-api-token'); t.type = t.type === 'password' ? 'text' : 'password'; this.textContent = t.type === 'password' ? 'Show' : 'Hide';">Show</button>
            <button class="btn-secondary btn-sm" onclick="navigator.clipboard.writeText(document.getElementById('p-api-token').value); toast('success','Copied','API key copied to clipboard');">Copy</button>
          </div>
          <span class="form-hint">Use this token to authenticate with the SentinelOps CLI and HTTP API.</span>
        </div>
      </div>
    </div>

    <div class="col-1">
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><span class="card-title">Security Settings</span></div>
        <div class="form-row-toggle">
          <div class="form-row-toggle-info">
            <div class="form-row-toggle-label">Multi-Factor Auth (MFA)</div>
            <div class="form-row-toggle-hint">Protect account with verification codes</div>
          </div>
          <div class="toggle-switch ${u.mfa ? 'on' : ''}" id="p-mfa-toggle"></div>
        </div>
        <div class="form-group" style="margin-top:16px;">
          <label class="form-label">Active Session Details</label>
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:var(--radius); padding:10px; font-size:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span class="text-muted">IP Address</span>
              <span>192.168.1.104</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span class="text-muted">Location</span>
              <span>Mumbai, India</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span class="text-muted">Browser</span>
              <span>Chrome / macOS</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Session Action</span></div>
        <button class="btn-danger w-full justify-center" data-action="profile:sign-out" style="display:flex; justify-content:center;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out of Platform
        </button>
      </div>
    </div>
  </div>`;

  // Wire MFA toggle
  document.getElementById('p-mfa-toggle')?.addEventListener('click', function() {
    this.classList.toggle('on');
    AppState.user.mfa = this.classList.contains('on');
    toast('info', 'MFA Updated', `Multi-factor authentication has been ${AppState.user.mfa ? 'enabled' : 'disabled'}`);
  });
}

function updateTopbarUser() {
  const nameEl = document.querySelector('#user-menu .user-name');
  const roleEl = document.querySelector('#user-menu .user-role');
  const avatarEl = document.querySelector('#user-menu .user-avatar');
  if (nameEl) nameEl.textContent = AppState.user.name;
  if (roleEl) roleEl.textContent = AppState.user.role;
  if (avatarEl) avatarEl.textContent = AppState.user.avatar;
}

function updateSidebarBadges() {
  const projectsCountEl = document.querySelector('.nav-item[data-page="projects"] .nav-badge');
  if (projectsCountEl) {
    projectsCountEl.textContent = AppState.projects.length;
  }
  const pipelinesCountEl = document.querySelector('.nav-item[data-page="pipelines"] .nav-badge');
  if (pipelinesCountEl) {
    const runningCount = AppState.pipelines.filter(p => p.status === 'running').length;
    pipelinesCountEl.textContent = runningCount;
    pipelinesCountEl.style.display = runningCount > 0 ? '' : 'none';
  }
  const securityCountEl = document.querySelector('.nav-item[data-page="security"] .nav-badge');
  if (securityCountEl) {
    const criticalCount = AppState.vulns.filter(v => v.severity === 'critical' && v.status !== 'fixed').length;
    securityCountEl.textContent = criticalCount;
    securityCountEl.style.display = criticalCount > 0 ? '' : 'none';
  }
  const tasksCountEl = document.querySelector('.nav-item[data-page="tasks"] .nav-badge');
  if (tasksCountEl) {
    const totalTasks = Object.values(AppState.tasks).reduce((sum, list) => sum + list.length, 0);
    tasksCountEl.textContent = totalTasks;
  }
}

async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = options.headers || {};
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  let res = await fetch(url, options);
  
  // Try refreshing JWT access token if expired (401 status)
  if (res.status === 401 && localStorage.getItem('refreshToken')) {
    try {
      const refreshRes = await fetch(`${AppState.apiUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
        }
      });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        localStorage.setItem('token', refreshData.access_token);
        
        // Retry original request
        options.headers['Authorization'] = `Bearer ${refreshData.access_token}`;
        res = await fetch(url, options);
      } else {
        signOut();
      }
    } catch (e) {
      console.error('Auth refresh failure:', e);
      signOut();
    }
  }
  return res;
}

let socket;
function initSocketConnection() {
  if (typeof io === 'undefined') return;
  const socketUrl = AppState.apiUrl || window.location.origin;
  socket = io(socketUrl);
  
  socket.on('connect', () => {
    console.log('⚡ Connected to real-time Socket.IO event stream');
  });
  
  socket.on('pipeline_update', (pipelineData) => {
    console.log('🔄 Live Pipeline Update:', pipelineData);
    const idx = AppState.pipelines.findIndex(p => p.id === pipelineData.id);
    
    // Map stage dicts back to arrays expected by frontend
    const stages = (pipelineData.stages || []).map(s => s.stage_name);
    const stageStatus = (pipelineData.stages || []).map(s => s.status);
    const stageTimes = (pipelineData.stages || []).map(s => s.duration);
    
    const formatted = {
      ...pipelineData,
      stages,
      stageStatus,
      stageTimes
    };

    if (idx > -1) {
      AppState.pipelines[idx] = formatted;
    } else {
      AppState.pipelines.unshift(formatted);
    }
    
    updateSidebarBadges();
    if (AppState.page === 'pipelines') renderPipelines();
    else if (AppState.page === 'dashboard') renderDashboard();
  });
  
  socket.on('notification_new', (notif) => {
    console.log('🔔 Live Notification Alert:', notif);
    AppState.notifications.unshift(notif);
    toast(notif.cls || 'info', 'System Notice', notif.text);
    updateSidebarBadges();
  });

  socket.on('task_update', async (taskData) => {
    console.log('🔄 Live Task Update received:', taskData);
    await loadAllDataFromAPI();
    if (AppState.page === 'tasks') renderTasks();
    else if (AppState.page === 'dashboard') renderDashboard();
  });

  socket.on('vuln_update', async (vulnData) => {
    console.log('🛡️ Live Vulnerability Update received:', vulnData);
    await loadAllDataFromAPI();
    if (AppState.page === 'security') renderSecurity();
    else if (AppState.page === 'dashboard') renderDashboard();
  });

  socket.on('project_update', async (projData) => {
    console.log('📁 Live Project Update received:', projData);
    await loadAllDataFromAPI();
    if (AppState.page === 'projects') renderProjects();
    else if (AppState.page === 'dashboard') renderDashboard();
  });
}

function showLoginModal() {
  showModal({
    title: 'Sign In to SentinelOps',
    subtitle: 'Enterprise DevSecOps Command Center',
    size: 'narrow',
    cancelLabel: 'Offline Mode',
    saveLabel: 'Sign In',
    body: `
      <div class="form-group" style="margin-bottom:12px;">
        <label class="form-label">Username or Email</label>
        <input type="text" class="form-input" id="login-username" placeholder="arjun" value="arjun">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" class="form-input" id="login-password" placeholder="••••••••" value="Admin123!">
      </div>
    `,
    onSave() {
      const username = document.getElementById('login-username')?.value.trim();
      const password = document.getElementById('login-password')?.value.trim();
      if (!username || !password) {
        toast('danger', 'Validation Error', 'Username/Email and Password are required.');
        return;
      }
      
      const saveBtn = document.getElementById('modal-save-btn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Signing In...';
      }
      
      fetch(`${AppState.apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then(res => {
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
      })
      .then(data => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        AppState.user.id = data.user.id;
        AppState.user.name = data.user.username;
        AppState.user.role = data.user.role;
        AppState.user.email = data.user.email;
        AppState.user.avatar = data.user.initials || 'AS';
        AppState.user.sshKey = data.user.ssh_key;
        AppState.user.apiToken = data.user.api_token;
        
        updateTopbarUser();
        toast('success', 'Logged In', `Successfully signed in as ${data.user.username}`);
        hideModal();
        
        loadAllDataFromAPI().then(() => {
          initSocketConnection();
          launchDashboard();
        });
      })
      .catch(err => {
        console.error('Authentication failure:', err);
        toast('danger', 'Access Denied', 'Invalid username/email or password.');
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Sign In';
        }
      });
    },
    onRender() {
      const cancelBtn = document.getElementById('modal-cancel-btn');
      if (cancelBtn) {
        cancelBtn.onclick = (e) => {
          e.stopPropagation();
          hideModal();
          launchDashboard();
          toast('info', 'Offline Mode', 'Running with mock local data.');
        };
      }
      const closeBtn = document.getElementById('modal-close-btn');
      if (closeBtn) closeBtn.style.display = 'none';
    }
  });
}

async function initBackendConnection() {
  AppState.apiUrl = (window.location.protocol === 'file:' || (window.location.port !== '' && window.location.port !== '80' && window.location.port !== '443')) ? 'http://localhost:5001' : '';
  
  try {
    const res = await fetch(`${AppState.apiUrl}/api/health`);
    if (res.ok) {
      AppState.backendActive = true;
      console.log('🔗 Connected to SentinelOps Flask REST API');
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const meRes = await fetch(`${AppState.apiUrl}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (meRes.ok) {
            const meData = await meRes.ok ? await meRes.json() : null;
            if (meData) {
              AppState.user.id = meData.id;
              AppState.user.name = meData.username;
              AppState.user.role = meData.role;
              AppState.user.email = meData.email;
              AppState.user.avatar = meData.initials || 'AS';
              AppState.user.sshKey = meData.ssh_key;
              AppState.user.apiToken = meData.api_token;
              
              updateTopbarUser();
              await loadAllDataFromAPI();
              initSocketConnection();
              launchDashboard();
              return;
            }
          }
        } catch (e) {
          console.log('Session restore failed, prompting login.');
        }
      }
      
      if (!document.getElementById('app-shell').classList.contains('hidden')) {
        showLoginModal();
      }
    }
  } catch (e) {
    AppState.backendActive = false;
    console.log('⚠️ Running in static offline mode (no backend api found)');
  }
}

async function loadAllDataFromAPI() {
  try {
    const [projects, pipelines, tasks, team, vulns, settings, containers, resources, notifications] = await Promise.all([
      authFetch(`${AppState.apiUrl}/api/projects`).then(r => r.json()),
      authFetch(`${AppState.apiUrl}/api/pipelines`).then(r => r.json()),
      authFetch(`${AppState.apiUrl}/api/tasks`).then(r => r.json()),
      authFetch(`${AppState.apiUrl}/api/team`).then(r => r.json()),
      authFetch(`${AppState.apiUrl}/api/vulns`).then(r => r.json()),
      authFetch(`${AppState.apiUrl}/api/settings`).then(r => r.json()),
      authFetch(`${AppState.apiUrl}/api/containers`).then(r => r.json()),
      authFetch(`${AppState.apiUrl}/api/resources`).then(r => r.json()),
      authFetch(`${AppState.apiUrl}/api/notifications`).then(r => r.json())
    ]);
    
    if (projects) AppState.projects = projects;
    if (pipelines) {
      // Map stage lists from backend format back to UI arrays
      AppState.pipelines = pipelines.map(p => {
        const stages = (p.stages || []).map(s => s.stage_name);
        const stageStatus = (p.stages || []).map(s => s.status);
        const stageTimes = (p.stages || []).map(s => s.duration);
        return {
          ...p,
          stages,
          stageStatus,
          stageTimes
        };
      });
    }
    if (tasks) {
      const grouped = { backlog: [], inprogress: [], review: [], completed: [] };
      tasks.forEach(t => {
        if (grouped[t.column_name]) {
          grouped[t.column_name].push(t);
        }
      });
      AppState.tasks = grouped;
    }
    if (team) AppState.team = team;
    if (vulns) AppState.vulns = vulns;
    if (settings) AppState.settings = settings;
    if (containers) AppState.containers = containers;
    if (resources) {
      // Normalize EC2 instances
      AppState.ec2 = resources.filter(r => r.type === 'ec2').map(r => ({
        id: r.id,
        name: r.name,
        type: r.metadata?.InstanceType || 't3.micro',
        state: r.status,
        zone: r.region,
        ip: r.metadata?.PublicIp || null,
        privateIp: r.metadata?.PrivateIp || null,
        cpu: r.cpu || r.metadata?.cpu || Math.floor(Math.random() * 40) + 5,
        uptime: r.launch_time ? r.launch_time : null
      }));
      
      // Normalize RDS instances
      AppState.rds = resources.filter(r => r.type === 'rds').map(r => ({
        id: r.id,
        engine: r.metadata?.Engine || 'PostgreSQL 16.1',
        class: r.metadata?.Class || 'db.t3.large',
        state: r.status,
        connections: r.connections || r.metadata?.connections || r.metadata?.Connections || Math.floor(Math.random() * 20) + 5,
        storage: r.metadata?.Storage || '100 GB',
        zone: r.region,
        endpoint: r.metadata?.Endpoint || `${r.id}.rds.amazonaws.com`
      }));
      
      // Normalize S3 Buckets
      AppState.s3 = resources.filter(r => r.type === 's3').map(r => ({
        id: r.id,
        name: r.name,
        region: r.region,
        state: r.status,
        launch_time: r.launch_time,
        metadata: r.metadata
      }));
    }
    if (notifications) AppState.notifications = notifications;
    
    updateSidebarBadges();
  } catch (err) {
    console.error('Failed to load data from MySQL backend:', err);
  }
}

function saveProfile() {
  const name = document.getElementById('p-name')?.value.trim();
  const email = document.getElementById('p-email')?.value.trim();
  const sshKey = document.getElementById('p-ssh-key')?.value.trim();
  
  if (!name || !email) {
    toast('danger', 'Validation Error', 'Name and Email are required.');
    return;
  }
  
  const payload = {
    username: name,
    email: email,
    ssh_key: sshKey,
    mfa_enabled: AppState.user.mfa
  };
  
  if (AppState.backendActive && AppState.user.id) {
    authFetch(`${AppState.apiUrl}/api/team/${AppState.user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => {
      if (!r.ok) throw new Error('API failed');
      return r.json();
    })
    .then(data => {
      AppState.user.name = data.username;
      AppState.user.email = data.email;
      AppState.user.sshKey = data.ssh_key;
      AppState.user.mfa = data.mfa_enabled;
      
      const words = data.username.split(/\s+/);
      let initials = '';
      if (words.length > 0) initials += words[0].charAt(0).toUpperCase();
      if (words.length > 1) initials += words[1].charAt(0).toUpperCase();
      if (initials) AppState.user.avatar = initials;
      
      updateTopbarUser();
      toast('success', 'Profile Saved', 'Your profile changes have been saved successfully.');
      renderProfile();
    })
    .catch(err => {
      console.error('Failed to save profile:', err);
      toast('danger', 'Error', 'Failed to update profile details on the backend.');
    });
  } else {
    AppState.user.name = name;
    AppState.user.email = email;
    AppState.user.sshKey = sshKey;
    
    const words = name.split(/\s+/);
    let initials = '';
    if (words.length > 0) initials += words[0].charAt(0).toUpperCase();
    if (words.length > 1) initials += words[1].charAt(0).toUpperCase();
    if (initials) AppState.user.avatar = initials;
    
    updateTopbarUser();
    toast('success', 'Profile Saved', 'Your profile changes have been saved successfully (Offline Mode).');
    renderProfile();
  }
}

function signOut() {
  if (AppState.backendActive) {
    fetch(`${AppState.apiUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).catch(err => console.error('Signout audit log failed:', err));
  }
  
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('landing-page').classList.remove('hidden');
  toast('info', 'Signed Out', 'You have been successfully signed out.');
}

/* ================================================================
   PAGE: SETTINGS
================================================================ */
function renderSettings() {
  const content=document.getElementById('page-content');
  const tab=AppState.settingsTab;

  content.innerHTML=`
  <div class="page-header"><div><h1 class="page-title">Settings</h1><p class="page-subtitle">Application configuration and preferences</p></div></div>
  <div class="settings-layout">
    <nav class="settings-nav">
      ${[['app','Application'],['smtp','Email / SMTP'],['db','Database'],['security','Security'],['notifications','Notifications'],['backup','Backup & DR']].map(([id,label])=>`<button class="settings-nav-item ${tab===id?'active':''}" data-action="settings:tab" data-tab="${id}">${label}</button>`).join('')}
    </nav>
    <div class="settings-section" id="settings-content">${renderSettingsTab(tab)}</div>
  </div>`;
}

function renderSettingsTab(tab) {
  const s=AppState.settings;
  if(tab==='app') return `
    <div class="card"><div class="card-header"><span class="card-title">Application Settings</span></div>
    <div class="form-group"><label class="form-label">Application Name</label><input class="form-input" id="s-app-name" value="${escHtml(s.app.name)}"></div>
    <div class="form-group"><label class="form-label">Domain</label><input class="form-input" id="s-app-domain" value="${escHtml(s.app.domain)}"></div>
    <div class="form-group"><label class="form-label">Timezone</label><select class="form-select" id="s-app-tz">${['Asia/Kolkata','UTC','America/New_York','Europe/London'].map(tz=>`<option ${s.app.timezone===tz?'selected':''}>${tz}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Default Environment</label><select class="form-select" id="s-app-env">${['production','staging','development'].map(e=>`<option ${s.app.defaultEnv===e?'selected':''}>${e}</option>`).join('')}</select></div>
    <div style="margin-top:16px;display:flex;gap:8px">
      <button class="btn-primary btn-sm" data-action="settings:save-app">Save Changes</button>
      <button class="btn-ghost btn-sm" data-action="settings:reset-app">Reset Defaults</button>
    </div></div>`;

  if(tab==='smtp') return `
    <div class="card"><div class="card-header"><span class="card-title">SMTP Configuration</span></div>
    <div class="form-grid-2"><div class="form-group"><label class="form-label">SMTP Host</label><input class="form-input" id="s-smtp-host" value="${escHtml(s.smtp.host)}"></div><div class="form-group"><label class="form-label">Port</label><input class="form-input" type="number" id="s-smtp-port" value="${s.smtp.port}"></div></div>
    <div class="form-group"><label class="form-label">Username</label><input class="form-input" id="s-smtp-user" value="${escHtml(s.smtp.user)}"></div>
    <div class="form-group"><label class="form-label">Password</label><input class="form-input" type="password" id="s-smtp-pass" placeholder="••••••••••••"></div>
    <div class="form-group"><label class="form-label">From Address</label><input class="form-input" id="s-smtp-from" value="${escHtml(s.smtp.from)}"></div>
    <div class="form-row-toggle"><div class="form-row-toggle-info"><div class="form-row-toggle-label">TLS / STARTTLS</div><div class="form-row-toggle-hint">Use encrypted connection</div></div><div class="toggle-switch ${s.smtp.tls?'on':''}" data-action="settings:toggle" data-key="smtp.tls"></div></div>
    <div style="margin-top:16px;display:flex;gap:8px">
      <button class="btn-primary btn-sm" data-action="settings:save-smtp">Save</button>
      <button class="btn-secondary btn-sm" data-action="settings:test-smtp">Test SMTP</button>
    </div></div>`;

  if(tab==='db') return `
    <div class="card"><div class="card-header"><span class="card-title">Database Connection</span></div>
    <div class="form-group"><label class="form-label">Host</label><input class="form-input" id="s-db-host" value="${escHtml(s.db.host)}"></div>
    <div class="form-grid-3">
      <div class="form-group"><label class="form-label">Port</label><input class="form-input" type="number" id="s-db-port" value="${s.db.port}"></div>
      <div class="form-group"><label class="form-label">Database Name</label><input class="form-input" id="s-db-name" value="${escHtml(s.db.name)}"></div>
      <div class="form-group"><label class="form-label">Username</label><input class="form-input" id="s-db-user" value="${escHtml(s.db.user || '')}"></div>
    </div>
    <div class="form-group"><label class="form-label">Password</label><input class="form-input" type="password" placeholder="••••••••••••"></div>
    <div class="form-group"><label class="form-label">Connection Pool Size</label><input class="form-input" type="number" id="s-db-pool" value="${s.db.pool}" min="1" max="100"></div>
    <div style="margin-top:16px;display:flex;gap:8px">
      <button class="btn-primary btn-sm" data-action="settings:save-db">Save</button>
      <button class="btn-secondary btn-sm" data-action="settings:test-db">Test Connection</button>
    </div></div>`;

  if(tab==='security') return `
    <div class="card"><div class="card-header"><span class="card-title">Security Settings</span></div>
    <div class="settings-section">
      <div class="form-row-toggle"><div class="form-row-toggle-info"><div class="form-row-toggle-label">Multi-Factor Authentication</div><div class="form-row-toggle-hint">Require MFA for all team members</div></div><div class="toggle-switch ${s.security.mfa?'on':''}" data-action="settings:toggle" data-key="security.mfa"></div></div>
      <div class="form-row-toggle"><div class="form-row-toggle-info"><div class="form-row-toggle-label">SSO / SAML</div><div class="form-row-toggle-hint">Enable Single Sign-On with your identity provider</div></div><div class="toggle-switch ${s.security.ssoEnabled?'on':''}" data-action="settings:toggle" data-key="security.ssoEnabled"></div></div>
      <div class="form-row-toggle"><div class="form-row-toggle-info"><div class="form-row-toggle-label">IP Whitelisting</div><div class="form-row-toggle-hint">Restrict access to specific IP ranges</div></div><div class="toggle-switch ${s.security.ipWhitelist?'on':''}" data-action="settings:toggle" data-key="security.ipWhitelist"></div></div>
      <div class="form-row-toggle"><div class="form-row-toggle-info"><div class="form-row-toggle-label">Audit Logging</div><div class="form-row-toggle-hint">Log all user actions to S3</div></div><div class="toggle-switch ${s.security.auditLog?'on':''}" data-action="settings:toggle" data-key="security.auditLog"></div></div>
    </div>
    <div class="form-group" style="margin-top:16px"><label class="form-label">Session Timeout (minutes)</label><input class="form-input" type="number" value="${s.security.sessionTimeout}"></div>
    <div style="margin-top:16px"><button class="btn-primary btn-sm" data-action="settings:save-security">Save Security Settings</button></div></div>`;

  if(tab==='notifications') return `
    <div class="card"><div class="card-header"><span class="card-title">Notification Preferences</span></div>
    <div class="settings-section">
      <div class="form-row-toggle"><div class="form-row-toggle-info"><div class="form-row-toggle-label">Pipeline Failures</div><div class="form-row-toggle-hint">Email alert when a pipeline fails</div></div><div class="toggle-switch ${s.notifications.pipelineFail?'on':''}" data-action="settings:toggle" data-key="notifications.pipelineFail"></div></div>
      <div class="form-row-toggle"><div class="form-row-toggle-info"><div class="form-row-toggle-label">Security Alerts</div><div class="form-row-toggle-hint">Immediate alert for critical CVEs</div></div><div class="toggle-switch ${s.notifications.securityAlert?'on':''}" data-action="settings:toggle" data-key="notifications.securityAlert"></div></div>
      <div class="form-row-toggle"><div class="form-row-toggle-info"><div class="form-row-toggle-label">Successful Deployments</div><div class="form-row-toggle-hint">Notification when deploy succeeds</div></div><div class="toggle-switch ${s.notifications.deploySuccess?'on':''}" data-action="settings:toggle" data-key="notifications.deploySuccess"></div></div>
      <div class="form-row-toggle"><div class="form-row-toggle-info"><div class="form-row-toggle-label">Weekly Report</div><div class="form-row-toggle-hint">Sunday digest of platform metrics</div></div><div class="toggle-switch ${s.notifications.weeklyReport?'on':''}" data-action="settings:toggle" data-key="notifications.weeklyReport"></div></div>
    </div>
    <div style="margin-top:16px"><button class="btn-primary btn-sm" data-action="settings:save-notif">Save Preferences</button></div></div>`;

  if(tab==='backup') return `
    <div class="card"><div class="card-header"><span class="card-title">Backup & Disaster Recovery</span></div>
    <div class="form-row-toggle"><div class="form-row-toggle-info"><div class="form-row-toggle-label">Automated Backups</div><div class="form-row-toggle-hint">Automatic database and config backups</div></div><div class="toggle-switch ${s.backup.enabled?'on':''}" data-action="settings:toggle" data-key="backup.enabled"></div></div>
    <div class="form-grid-2" style="margin-top:16px">
      <div class="form-group"><label class="form-label">Frequency</label><select class="form-select"><option>hourly</option><option ${s.backup.frequency==='daily'?'selected':''}>daily</option><option>weekly</option></select></div>
      <div class="form-group"><label class="form-label">Retention (days)</label><input class="form-input" type="number" value="${s.backup.retention}"></div>
    </div>
    <div class="form-group"><label class="form-label">S3 Bucket</label><input class="form-input" value="${escHtml(s.backup.s3Bucket)}"></div>
    <div class="inline-alert success" style="margin-top:12px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>Last backup: ${timeAgo(s.backup.lastRun)} · Status: Success</div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-primary btn-sm" data-action="settings:save-backup">Save</button>
      <button class="btn-secondary btn-sm" data-action="settings:run-backup">Run Backup Now</button>
    </div></div>`;

  return '';
}

function settingsToggle(key) {
  const keys=key.split('.');
  let obj=AppState.settings;
  for(let i=0;i<keys.length-1;i++) obj=obj[keys[i]];
  obj[keys[keys.length-1]]=!obj[keys[keys.length-1]];
  renderSettings();
}

function saveSettingsSection(section, msg) {
  const s=AppState.settings;
  if(section==='app') { s.app.name=document.getElementById('s-app-name')?.value||s.app.name; s.app.domain=document.getElementById('s-app-domain')?.value||s.app.domain; s.app.timezone=document.getElementById('s-app-tz')?.value||s.app.timezone; s.app.defaultEnv=document.getElementById('s-app-env')?.value||s.app.defaultEnv; }
  if(section==='smtp') { s.smtp.host=document.getElementById('s-smtp-host')?.value||s.smtp.host; s.smtp.port=parseInt(document.getElementById('s-smtp-port')?.value)||s.smtp.port; s.smtp.user=document.getElementById('s-smtp-user')?.value||s.smtp.user; s.smtp.from=document.getElementById('s-smtp-from')?.value||s.smtp.from; }
  if(section==='db') { s.db.host=document.getElementById('s-db-host')?.value||s.db.host; s.db.port=parseInt(document.getElementById('s-db-port')?.value)||s.db.port; s.db.name=document.getElementById('s-db-name')?.value||s.db.name; s.db.user=document.getElementById('s-db-user')?.value||s.db.user; s.db.pool=parseInt(document.getElementById('s-db-pool')?.value)||s.db.pool; }
  
  if (AppState.backendActive) {
    authFetch(`${AppState.apiUrl}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s)
    })
    .then(r => {
      if (!r.ok) throw new Error('API failed');
      return r.json();
    })
    .then(data => {
      AppState.settings = data;
      toast('success', 'Settings Saved', msg || 'Configuration has been updated');
    })
    .catch(err => {
      console.error('Failed to save settings:', err);
      toast('danger', 'Error', 'Failed to save settings to backend.');
    });
  } else {
    toast('success', 'Settings Saved', msg || 'Configuration has been updated');
  }
}

/* ================================================================
   COMMAND PALETTE
================================================================ */
const commandPalette = {
  el: null, input: null, results: null, items: [], selectedIdx: -1,
  init() {
    this.el=document.getElementById('command-palette');
    this.input=document.getElementById('cp-input');
    this.results=document.getElementById('cp-results');
    this.buildItems();
    if(this.input) this.input.addEventListener('input',()=>this.render(this.input.value));
    if(this.el) this.el.querySelector('.cp-backdrop')?.addEventListener('click',()=>this.close());
  },
  buildItems() {
    this.items=[
      {group:'Navigate',icon:'🏠',name:'Dashboard',desc:'Overview & metrics',action:()=>navigate('dashboard')},
      {group:'Navigate',icon:'📁',name:'Projects',desc:'Manage projects',action:()=>navigate('projects')},
      {group:'Navigate',icon:'⚡',name:'Pipelines',desc:'CI/CD pipeline status',action:()=>navigate('pipelines')},
      {group:'Navigate',icon:'🔐',name:'Security Center',desc:'Vulnerability management',action:()=>navigate('security')},
      {group:'Navigate',icon:'🐳',name:'Containers',desc:'Docker container management',action:()=>navigate('containers')},
      {group:'Navigate',icon:'☁️',name:'Cloud Resources',desc:'AWS infrastructure',action:()=>navigate('cloud')},
      {group:'Navigate',icon:'📊',name:'Monitoring',desc:'Metrics & alerts',action:()=>navigate('monitoring')},
      {group:'Navigate',icon:'📋',name:'Tasks',desc:'Kanban board',action:()=>navigate('tasks')},
      {group:'Navigate',icon:'📈',name:'Reports',desc:'Analytics & exports',action:()=>navigate('reports')},
      {group:'Navigate',icon:'👥',name:'Team',desc:'Team management',action:()=>navigate('team')},
      {group:'Navigate',icon:'⚙️',name:'Settings',desc:'Application settings',action:()=>navigate('settings')},
      {group:'Actions',icon:'➕',name:'New Project',desc:'Create a new project',action:()=>{navigate('projects');setTimeout(openCreateProject,400);}},
      {group:'Actions',icon:'🚀',name:'Run Pipeline',desc:'Trigger a pipeline run',action:()=>{navigate('pipelines');setTimeout(openTriggerPipelineModal,400);}},
      {group:'Actions',icon:'📋',name:'New Task',desc:'Add a task to the board',action:()=>{navigate('tasks');setTimeout(()=>openAddTaskModal(),400);}},
      {group:'Actions',icon:'👤',name:'Invite Member',desc:'Invite a team member',action:()=>{navigate('team');setTimeout(openInviteModal,400);}},
      {group:'Actions',icon:'🔍',name:'Run Security Scan',desc:'Scan for vulnerabilities',action:()=>{navigate('security');setTimeout(runSecurityScan,400);}},
    ];
  },
  open() { if(!this.el) return; this.el.classList.remove('hidden'); this.input?.focus(); this.render(''); },
  close() { if(!this.el) return; this.el.classList.add('hidden'); if(this.input) this.input.value=''; this.selectedIdx=-1; },
  render(query) {
    if(!this.results) return;
    const q=query.toLowerCase().trim();
    const filtered=q?this.items.filter(i=>i.name.toLowerCase().includes(q)||i.desc.toLowerCase().includes(q)):this.items;
    const groups=[...new Set(filtered.map(i=>i.group))];
    this.results.innerHTML=groups.map(g=>`<div class="cp-group-label">${g}</div>${filtered.filter(i=>i.group===g).map((i,idx)=>`<div class="cp-item" data-idx="${idx}" onclick="commandPalette.execute(${this.items.indexOf(i)})"><div class="cp-item-icon">${i.icon}</div><div><div class="cp-item-name">${escHtml(i.name)}</div><div class="cp-item-desc">${escHtml(i.desc)}</div></div></div>`).join('')}`).join('');
  },
  execute(idx) { const item=this.items[idx]; this.close(); item?.action?.(); },
  moveSelection(dir) {
    const items=this.results?.querySelectorAll('.cp-item')||[]; if(!items.length) return;
    items[this.selectedIdx]?.classList.remove('selected');
    this.selectedIdx=(this.selectedIdx+dir+items.length)%items.length;
    items[this.selectedIdx]?.classList.add('selected');
    items[this.selectedIdx]?.scrollIntoView({block:'nearest'});
  },
};

/* ================================================================
   NOTIFICATIONS
================================================================ */
function toggleNotifPanel() {
  const panel=document.getElementById('notif-panel'); if(!panel) return;
  panel.classList.toggle('hidden');
  // Update dot
  AppState.notifications.forEach(n=>n.unread=false);
  document.querySelector('.notif-dot')?.remove();
}
function markAllRead() { AppState.notifications.forEach(n=>n.unread=false); const panel=document.getElementById('notif-panel'); if(panel) panel.innerHTML=buildNotifPanel(); toast('info','Notifications','All marked as read'); }
function buildNotifPanel() {
  return `<div class="notif-panel-header">Notifications<button onclick="markAllRead()">Mark all read</button></div>
  <div class="notif-list">${AppState.notifications.map(n=>`
  <div class="notif-item ${n.unread?'unread':''}">
    <div class="notif-item-icon" style="background:var(--${n.cls==='danger'?'danger-bg':n.cls==='blue'?'primary-glow':n.cls==='warning'?'warning-bg':'success-bg'})">${n.icon}</div>
    <div style="flex:1"><div class="notif-item-text">${n.text}</div><div class="notif-item-time">${timeAgo(n.time)}</div></div>
    ${n.unread?'<div class="notif-unread-dot"></div>':''}
  </div>`).join('')}</div>`;
}

/* ================================================================
   GLOBAL EVENT DELEGATION
================================================================ */
document.addEventListener('click', function(e) {
  // Action-based delegation
  const btn=e.target.closest('[data-action]');
  if(!btn) {
    // Close notifications if click outside
    const panel=document.getElementById('notif-panel');
    if(panel && !panel.classList.contains('hidden') && !e.target.closest('#notif-panel') && !e.target.closest('[data-action="notif:toggle"]')) panel.classList.add('hidden');
    return;
  }
  const action=btn.dataset.action;
  const id=btn.dataset.id||'';
  const val=btn.dataset.val||'';
  const tab=btn.dataset.tab||'';
  const page=btn.dataset.page||'';
  const col=btn.dataset.col||'backlog';

  switch(action) {
    // Navigation
    case 'navigate': navigate(page); break;
    case 'go-to-app': {
      checkAuthAndLaunch('dashboard');
    } break;
    case 'profile:save': saveProfile(); break;
    case 'profile:sign-out': signOut(); break;

    // Projects
    case 'projects:create': openCreateProject(); break;
    case 'projects:edit': openEditProject(id); break;
    case 'projects:delete': showConfirm({title:'Delete Project',msg:`Are you sure you want to delete this project? All associated data will be removed.`,type:'danger',okLabel:'Delete Project',onConfirm(){AppState.deleteProject(id);renderProjects();toast('success','Project Deleted','Project has been removed');}}); break;
    case 'projects:deploy': deployProject(id); break;
    case 'projects:toggle-view': AppState.filters.projects.view=AppState.filters.projects.view==='cards'?'table':'cards'; renderProjects(); break;
    case 'projects:filter-status': AppState.filters.projects.status=val; renderProjects(); break;

    // Pipelines
    case 'pipeline:trigger-new': openTriggerPipelineModal(); break;
    case 'pipeline:cancel': {
      const pl=AppState.pipelines.find(p=>p.id===id);
      if(pl){pl.status='cancelled';pl.stageStatus=pl.stageStatus.map(s=>s==='running'?'pending':s);}
      renderPipelines(); toast('warning','Pipeline Cancelled',`Pipeline has been stopped`);
    } break;
    case 'pipeline:retry': {
      const pl=AppState.pipelines.find(p=>p.id===id);
      if(pl){pl.status='running';pl.stageStatus=['running','pending','pending','pending','pending','pending'];pl.startTime=Date.now();}
      renderPipelines(); simulatePipeline(id);
      toast('info','Pipeline Restarting','Pipeline has been queued for retry');
    } break;
    case 'pipeline:logs': viewPipelineLogs(id); break;
    case 'pipelines:filter-status': AppState.filters.pipelines.status=val; renderPipelines(); break;

    // Security
    case 'security:scan': runSecurityScan(); break;
    case 'security:view': viewVulnDetails(id); break;
    case 'security:fix': AppState.updateVuln(id,{status:'fixed'}); hideModal(); renderSecurity(); toast('success','Vulnerability Fixed','Marked as remediated'); break;
    case 'security:in-progress': AppState.updateVuln(id,{status:'in_progress'}); hideModal(); renderSecurity(); toast('info','In Progress','Vulnerability marked as in progress'); break;
    case 'security:assign': viewVulnDetails(id); break;

    // Containers
    case 'containers:stop': containerAction(id,'stop'); break;
    case 'containers:start': containerAction(id,'start'); break;
    case 'containers:restart': containerAction(id,'restart'); break;
    case 'containers:logs': viewContainerLogs(id); break;
    case 'containers:pull-image': openPullImageModal(); break;
    case 'containers:filter-status': AppState.filters.containers.status=val; renderContainers(); break;

    // Cloud
    case 'cloud:sync': toast('info','Syncing','Fetching latest resource data from AWS…'); setTimeout(()=>toast('success','Sync Complete','All resources are up to date'),2500); break;
    case 'cloud:ec2-stop': ec2Action(id,'stop'); break;
    case 'cloud:ec2-start': ec2Action(id,'start'); break;
    case 'cloud:ec2-connect': ec2Action(id,'connect'); break;

    // Monitoring
    case 'monitoring:ack': acknowledgeAlert(id); break;
    case 'monitoring:add-rule': openAlertRuleModal(); break;

    // Tasks
    case 'tasks:add': case 'tasks:add-to-col': openAddTaskModal(col); break;
    case 'tasks:edit': openEditTaskModal(id); break;
    case 'tasks:delete': showConfirm({title:'Delete Task',msg:'Delete this task permanently?',type:'danger',okLabel:'Delete',onConfirm(){AppState.deleteTask(id);renderTasks();toast('success','Task Deleted','Task removed from board');}}); break;

    // Reports
    case 'reports:tab': AppState.reportTab=tab; renderReports(); setTimeout(()=>{if(['deployment'].includes(tab)) initReportCharts();},50); break;
    case 'reports:export-csv': exportReportCSV(AppState.reportTab); break;
    case 'reports:print': window.print(); break;

    // Team
    case 'team:invite': openInviteModal(); break;
    case 'team:edit': openEditMemberModal(id); break;
    case 'team:remove': showConfirm({title:'Remove Member',msg:`Are you sure you want to remove this team member? They will lose access to SentinelOps.`,type:'danger',okLabel:'Remove',onConfirm(){AppState.removeTeamMember(id);renderTeam();toast('success','Member Removed','Team member has been removed');}}); break;
    case 'team:filter-status': AppState.filters.team.status=val; renderTeam(); break;

    // Settings
    case 'settings:tab': AppState.settingsTab=tab; renderSettings(); break;
    case 'settings:toggle': settingsToggle(btn.dataset.key); break;
    case 'settings:save-app': saveSettingsSection('app','Application settings saved'); break;
    case 'settings:save-smtp': saveSettingsSection('smtp','SMTP configuration saved'); break;
    case 'settings:save-db': saveSettingsSection('db','Database settings saved'); break;
    case 'settings:save-security': saveSettingsSection('security','Security settings saved'); break;
    case 'settings:save-notif': saveSettingsSection('notif','Notification preferences saved'); break;
    case 'settings:save-backup': saveSettingsSection('backup','Backup settings saved'); break;
    case 'settings:reset-app': toast('info','Reset','Application settings reset to defaults'); break;
    case 'settings:test-smtp': toast('info','Testing SMTP…','Sending test email to '+AppState.settings.smtp.user); setTimeout(()=>toast('success','SMTP OK','Test email delivered successfully'),2000); break;
    case 'settings:test-db': toast('info','Testing DB…','Connecting to '+AppState.settings.db.host); setTimeout(()=>toast('success','DB Connected','Connection successful — latency 4ms'),1500); break;
    case 'settings:run-backup': toast('info','Backup Started','Running full database backup…'); setTimeout(()=>{AppState.settings.backup.lastRun=Date.now();toast('success','Backup Complete','Backup uploaded to S3 successfully');renderSettings();},3500); break;

    // Dashboard
    case 'dashboard:refresh': toast('info','Refreshing','Fetching latest data…'); setTimeout(()=>{ navigate('dashboard'); toast('success','Refreshed','Dashboard data updated'); },800); break;

    // Notifications
    case 'notif:toggle': {
      const panel=document.getElementById('notif-panel');
      if(panel.classList.contains('hidden')){ panel.innerHTML=buildNotifPanel(); panel.classList.remove('hidden'); } else panel.classList.add('hidden');
    } break;

    // Theme
    case 'theme:toggle': {
      AppState.theme=AppState.theme==='dark'?'light':'dark';
      document.documentElement.setAttribute('data-theme',AppState.theme);
      localStorage.setItem('sentinel-theme',AppState.theme);
      const btn2=document.getElementById('theme-btn');
      if(btn2) btn2.innerHTML=AppState.theme==='dark'?'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>':'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    } break;

    // Sidebar collapse
    case 'sidebar:toggle': document.querySelector('.sidebar')?.classList.toggle('collapsed'); break;

    // Command palette
    case 'cp:open': commandPalette.open(); break;
  }
});

/* ================================================================
   KEYBOARD SHORTCUTS
================================================================ */
document.addEventListener('keydown', function(e) {
  const cpEl=document.getElementById('command-palette');
  const cpOpen=cpEl&&!cpEl.classList.contains('hidden');

  // Command Palette
  if((e.metaKey||e.ctrlKey)&&e.key==='k') { e.preventDefault(); cpOpen?commandPalette.close():commandPalette.open(); return; }
  if(cpOpen) {
    if(e.key==='Escape') { commandPalette.close(); return; }
    if(e.key==='ArrowDown') { e.preventDefault(); commandPalette.moveSelection(1); return; }
    if(e.key==='ArrowUp') { e.preventDefault(); commandPalette.moveSelection(-1); return; }
    if(e.key==='Enter') {
      const sel=commandPalette.results?.querySelector('.selected');
      if(sel) sel.click();
      return;
    }
    return; // Don't process other keys when palette is open
  }

  // Close modals on Escape
  if(e.key==='Escape') {
    const confirmEl=document.getElementById('confirm-root');
    if(confirmEl&&!confirmEl.classList.contains('hidden')){ confirmEl.classList.add('hidden'); return; }
    const drawerEl=document.getElementById('drawer-root');
    if(drawerEl&&!drawerEl.classList.contains('hidden')){ hideDrawer(); return; }
    const modalEl=document.getElementById('modal-root');
    if(modalEl&&!modalEl.classList.contains('hidden')){ hideModal(); return; }
  }

  // Only page shortcuts when not in input
  const tag=document.activeElement?.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT') return;

  const pageKeys={'1':'dashboard','2':'projects','3':'pipelines','4':'security','5':'containers','6':'cloud','7':'monitoring','8':'tasks','9':'reports','0':'team'};
  if(pageKeys[e.key]) { navigate(pageKeys[e.key]); }
  if(e.key==='n') { openTriggerPipelineModal(); }
});

/* ================================================================
   TOPBAR SEARCH (open command palette)
================================================================ */
document.addEventListener('click', e=>{
  if(e.target.closest('.topbar-search')) commandPalette.open();
});

/* ================================================================
   SIDEBAR NAV ITEMS — prevent default <a> scroll, use navigate()
================================================================ */
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navigate(item.dataset.page);
  });
});

/* ================================================================
   INIT
================================================================ */
window.addEventListener('DOMContentLoaded', function() {
  /* --- Apply saved theme --- */
  document.documentElement.setAttribute('data-theme', AppState.theme);
  updateThemeIcon();

  /* --- Init subsystems --- */
  initToast();
  commandPalette.init();
  initLanding();
  updateTopbarUser();
  updateSidebarBadges();
  initBackendConnection();

  /* --- Wire topbar buttons (they have IDs, not data-action) --- */

  // Hamburger / mobile menu → toggles sidebar collapse
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    if (!sb) return;
    // On mobile: toggle mobile-open class; on desktop: toggle collapsed
    if (window.innerWidth <= 900) {
      sb.classList.toggle('mobile-open');
    } else {
      sb.classList.toggle('collapsed');
    }
  });

  // Sidebar inner toggle button (the ≡ inside sidebar header)
  document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    const sb = document.getElementById('sidebar');
    if (!sb) return;
    if (window.innerWidth <= 900) {
      sb.classList.toggle('mobile-open');
    } else {
      sb.classList.toggle('collapsed');
    }
  });

  // Notifications bell
  document.getElementById('notif-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = document.getElementById('notif-panel');
    if (!panel) return;
    if (panel.classList.contains('hidden')) {
      panel.innerHTML = buildNotifPanel();
      panel.classList.remove('hidden');
      // Mark unread count dot
      document.querySelector('#notif-btn .notif-dot')?.remove();
    } else {
      panel.classList.add('hidden');
    }
  });

  // Theme toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', AppState.theme);
    localStorage.setItem('sentinel-theme', AppState.theme);
    updateThemeIcon();
    toast('info', AppState.theme === 'light' ? 'Light Mode' : 'Dark Mode', 'Theme switched');
  });

  // Command palette topbar button
  document.getElementById('cmd-palette-btn')?.addEventListener('click', () => commandPalette.open());

  // Global search trigger (topbar search bar)
  document.getElementById('global-search-trigger')?.addEventListener('click', () => commandPalette.open());

  // Close sidebar overlay on mobile when clicking outside
  document.addEventListener('click', (e) => {
    const sb = document.getElementById('sidebar');
    if (sb && sb.classList.contains('mobile-open') && !sb.contains(e.target) && e.target.id !== 'mobile-menu-btn') {
      sb.classList.remove('mobile-open');
    }
  });

  /* --- Notification dot --- */
  const unread = AppState.notifications.filter(n => n.unread).length;
  if (unread > 0) {
    const dot = document.createElement('span');
    dot.className = 'notif-dot';
    dot.id = 'notif-unread-indicator';
    document.getElementById('notif-btn')?.appendChild(dot);
  }

  /* --- Expose globals for inline HTML onclicks --- */
  window.launchApp = launchApp;
  window.launchAppPipelines = launchAppPipelines;
  window.hideModal = hideModal;
  window.hideDrawer = hideDrawer;
  window.toast = toast;
  window.markAllRead = markAllRead;
  window.commandPalette = commandPalette;
  window.navigate = navigate;
  window.AppState = AppState;

  console.log('%c🛡️ SentinelOps v2.0 Loaded', 'color:#4F46E5;font-size:14px;font-weight:bold;');
  console.log('%cShortcuts: ⌘K = Command Palette · 1-9 = Pages · ESC = Close', 'color:#6B7280');
});

function updateThemeIcon() {
  const dark = document.getElementById('theme-icon-dark');
  const light = document.getElementById('theme-icon-light');
  if (!dark || !light) return;
  if (AppState.theme === 'dark') {
    dark.style.display = 'block'; // show sun (to switch to light)
    light.style.display = 'none';
  } else {
    dark.style.display = 'none';
    light.style.display = 'block'; // show moon (to switch to dark)
  }
}
