from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, Notification

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('', methods=['GET'])
@jwt_required()
def list_notifications():
    current_user_id = get_jwt_identity()
    # List notifications for current user (or generic notification broadcast if user_id is null/matches)
    notifs = Notification.query.filter(
        (Notification.user_id == int(current_user_id)) | (Notification.user_id.is_(None))
    ).order_by(Notification.time.desc()).all()
    return jsonify([n.to_dict() for n in notifs]), 200

@notifications_bp.route('/<int:notif_id>/read', methods=['POST'])
@jwt_required()
def mark_read(notif_id):
    current_user_id = get_jwt_identity()
    notif = db.session.get(Notification, notif_id)
    if not notif:
        return jsonify({'message': 'Notification not found'}), 404

    # Verify ownership
    if notif.user_id and notif.user_id != int(current_user_id):
        return jsonify({'message': 'Unauthorized'}), 403

    notif.unread = False
    db.session.commit()

    return jsonify(notif.to_dict()), 200

@notifications_bp.route('/mark-all-read', methods=['POST'])
@jwt_required()
def mark_all_read():
    current_user_id = get_jwt_identity()
    unread_notifs = Notification.query.filter_by(
        user_id=int(current_user_id), 
        unread=True
    ).all()
    
    for notif in unread_notifs:
        notif.unread = False
        
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read', 'count': len(unread_notifs)}), 200
