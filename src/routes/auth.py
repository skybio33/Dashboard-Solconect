from flask import Blueprint, request, jsonify
from src.models.user import User, db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if user and user.check_password(password):
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@auth_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    role = data.get('role', 'editor')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    # Verificar se usuário já existe
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    user = User(username=username, email=email, role=role)
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'role' in data:
        user.role = data['role']
    if 'password' in data:
        user.set_password(data['password'])
    
    db.session.commit()
    return jsonify(user.to_dict()), 200

@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

