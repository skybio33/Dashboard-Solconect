#!/usr/bin/env python3
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.main import app, db
from src.models.user import User

def init_users():
    with app.app_context():
        # Verificar se já existem usuários
        if User.query.count() > 0:
            print("Usuários já existem no banco de dados.")
            return
        
        # Criar usuários padrão
        users_data = [
            {'username': 'Renato', 'password': 'renato123', 'role': 'admin', 'email': 'renato@solconect.com'},
            {'username': 'Victor', 'password': 'victor123', 'role': 'editor', 'email': 'victor@solconect.com'},
            {'username': 'Fabriciano', 'password': 'fabriciano123', 'role': 'admin', 'email': 'fabriciano@solconect.com'}
        ]
        
        for user_data in users_data:
            user = User(
                username=user_data['username'],
                email=user_data['email'],
                role=user_data['role']
            )
            user.set_password(user_data['password'])
            db.session.add(user)
            print(f"Usuário criado: {user_data['username']} (senha: {user_data['password']})")
        
        db.session.commit()
        print("\nUsuários inicializados com sucesso!")
        print("\nCredenciais padrão:")
        print("- Renato (Admin): renato123")
        print("- Victor (Editor): victor123")
        print("- Fabriciano (Admin): fabriciano123")

if __name__ == '__main__':
    init_users()

