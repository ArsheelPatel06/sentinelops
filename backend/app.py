from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from backend.config import Config
from backend.models import db

# Initialize extensions
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='static')
    app.config.from_object(config_class)

    # Initialize CORS
    CORS(app)

    # Bind extensions
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)

    # Save socketio instance to extensions so blueprints can trigger broadcasts
    app.extensions['socketio'] = socketio

    # Register Blueprints
    from backend.routes.auth import auth_bp
    from backend.routes.dashboard import dashboard_bp
    from backend.routes.projects import projects_bp
    from backend.routes.pipelines import pipelines_bp
    from backend.routes.security import security_bp, security_center_bp
    from backend.routes.containers import containers_bp
    from backend.routes.resources import resources_bp
    from backend.routes.tasks import tasks_bp
    from backend.routes.reports import reports_bp
    from backend.routes.team import team_bp
    from backend.routes.notifications import notifications_bp
    from backend.routes.settings import settings_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(pipelines_bp, url_prefix='/api/pipelines')
    app.register_blueprint(security_bp, url_prefix='/api/vulns')
    app.register_blueprint(security_center_bp, url_prefix='/api/security')
    app.register_blueprint(containers_bp, url_prefix='/api/containers')
    app.register_blueprint(resources_bp, url_prefix='/api/resources')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(team_bp, url_prefix='/api/team')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')

    # Health Check API
    @app.route('/api/health', methods=['GET'])
    def health_check():
        try:
            # Check db connection
            db.session.execute(db.text('SELECT 1'))
            db_status = 'connected'
        except Exception as e:
            db_status = f'disconnected: {str(e)}'
            
        return jsonify({
            'status': 'healthy',
            'database': db_status
        }), 200

    return app

if __name__ == '__main__':
    app = create_app()
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)
