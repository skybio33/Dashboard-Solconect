#!/usr/bin/env python3
"""
Script para inicializar o banco de dados com usuários padrão
Útil para reset ou configuração inicial
"""
import os
import sys

# Adicionar o diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.main import app, db
from src.models.user import User

def init_database():
    """Inicializa o banco de dados com usuários padrão"""
    with app.app_context():
        # Criar todas as tabelas
        db.create_all()
        print("✅ Tabelas criadas/verificadas")
        
        # Usuários padrão
        default_users = [
            {'username': 'Renato', 'password': 'renato123', 'role': 'admin'},
            {'username': 'Victor', 'password': 'victor123', 'role': 'admin'},
            {'username': 'Fabriciano', 'password': 'fabriciano123', 'role': 'admin'}
        ]
        
        for user_data in default_users:
            existing_user = User.query.filter_by(username=user_data['username']).first()
            if not existing_user:
                new_user = User(
                    username=user_data['username'],
                    role=user_data['role']
                )
                new_user.set_password(user_data['password'])
                db.session.add(new_user)
                print(f"✅ Usuário criado: {user_data['username']}")
            else:
                print(f"ℹ️  Usuário já existe: {user_data['username']}")
        
        db.session.commit()
        print("✅ Inicialização concluída!")

if __name__ == '__main__':
    init_database()

