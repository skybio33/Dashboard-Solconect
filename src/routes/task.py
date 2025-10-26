from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.task import Task

task_bp = Blueprint('task', __name__)

@task_bp.route('/tasks', methods=['GET'])
def get_tasks():
    """Obter todas as tarefas"""
    try:
        tasks = Task.query.all()
        return jsonify([task.to_dict() for task in tasks]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@task_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Obter uma tarefa específica"""
    try:
        task = Task.query.get_or_404(task_id)
        return jsonify(task.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@task_bp.route('/tasks', methods=['POST'])
def create_task():
    """Criar uma nova tarefa"""
    try:
        data = request.get_json()
        task = Task.from_dict(data)
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Atualizar uma tarefa existente"""
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        # Atualizar campos
        if 'title' in data:
            task.title = data['title']
        if 'client' in data:
            task.client = data['client']
        if 'description' in data:
            task.description = data['description']
        if 'businessArea' in data:
            task.business_area = data['businessArea']
        if 'phase' in data:
            task.phase = data['phase']
        if 'responsible' in data:
            task.responsible = data['responsible']
        if 'deadline' in data:
            task.deadline = data['deadline']
        if 'purchasePrice' in data:
            task.purchase_price = float(data['purchasePrice'])
        if 'salePrice' in data:
            task.sale_price = float(data['salePrice'])
        if 'markupMargin' in data:
            task.markup_margin = float(data['markupMargin'])
        
        db.session.commit()
        return jsonify(task.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Excluir uma tarefa"""
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Tarefa excluída com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@task_bp.route('/tasks/bulk', methods=['POST'])
def bulk_create_tasks():
    """Criar múltiplas tarefas de uma vez"""
    try:
        data = request.get_json()
        tasks = data.get('tasks', [])
        
        created_tasks = []
        for task_data in tasks:
            task = Task.from_dict(task_data)
            db.session.add(task)
            created_tasks.append(task)
        
        db.session.commit()
        return jsonify([task.to_dict() for task in created_tasks]), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
