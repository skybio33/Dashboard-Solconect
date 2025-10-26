import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.task import task_bp
from src.routes.auth import auth_bp



# Criar aplicação Flask
app = Flask(__name__, static_folder='static')

# Configuração CORS
CORS(app)

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(task_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')



# Configuração do banco de dados
# Suporte para múltiplas plataformas: Railway, Locaweb, etc.
database_url = os.environ.get('DATABASE_URL')

if database_url:
    if database_url.startswith('postgres://'):
        # Railway usa postgres://, mas SQLAlchemy precisa de postgresql://
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
        print("✅ Usando PostgreSQL em produção")
    elif database_url.startswith('mysql://'):
        # Para Locaweb MySQL, converter para mysql+pymysql://
        database_url = database_url.replace('mysql://', 'mysql+pymysql://', 1)
        print("✅ Usando MySQL em produção")
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Fallback para SQLite em desenvolvimento
    db_path = os.path.join(os.path.dirname(__file__), 'database', 'app.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
    print(f"⚠️  Usando SQLite em desenvolvimento: {db_path}")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar banco de dados
db.init_app(app)

# Configuração de segurança
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')

def create_tables():
    """Criar tabelas e dados iniciais"""
    # Criar diretório do banco se não existir
    os.makedirs(os.path.join(os.path.dirname(__file__), 'database'), exist_ok=True)
    
    # Criar todas as tabelas
    db.create_all()
    print("✅ Tabelas do banco de dados criadas/verificadas")
    
    # Criar usuários padrão se não existirem
    from src.models.user import User
    
    users_data = [
        {'username': 'Renato', 'password': 'renato123', 'role': 'admin'},
        {'username': 'Victor', 'password': 'victor123', 'role': 'admin'},
        {'username': 'Fabriciano', 'password': 'fabriciano123', 'role': 'admin'},
        {'username': 'commercial@solconect.com.br', 'password': 'solconect2024', 'role': 'admin'}
    ]
    
    for user_data in users_data:
        existing_user = User.query.filter_by(username=user_data['username']).first()
        if not existing_user:
            user = User(
                username=user_data['username'],
                role=user_data['role']
            )
            user.set_password(user_data['password'])
            db.session.add(user)
            print(f"✅ Usuário '{user_data['username']}' criado")
        else:
            print(f"⚠️  Usuário '{user_data['username']}' já existe")
    
    db.session.commit()
    print("✅ Usuários padrão verificados/criados")

    # Criar tarefas de exemplo se o banco estiver vazio
    from src.models.task import Task
    if Task.query.count() == 0:
        import json
        from datetime import datetime
        
        # Carregar tarefas do JSON
        tasks_json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'tasks_exemplo_solconect.json')
        if os.path.exists(tasks_json_path):
            with open(tasks_json_path, 'r', encoding='utf-8') as f:
                tasks_data = json.load(f)
            
            for task_data in tasks_data:
                # Converter deadline para objeto datetime
                task_data['deadline'] = datetime.strptime(task_data['deadline'], '%Y-%m-%d')
                
                task = Task(**task_data)
                db.session.add(task)
            
            db.session.commit()
            print(f"✅ {len(tasks_data)} tarefas de exemplo criadas a partir do mapa mental")
        else:
            print("⚠️ Arquivo de tarefas de exemplo não encontrado. Banco de dados vazio.")
    


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    """Servir arquivos estáticos"""
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/health')
def health_check():
    """Endpoint de verificação de saúde"""
    return {
        'status': 'healthy',
        'database': 'connected' if database_url else 'sqlite',

    }

# Inicializar aplicação
with app.app_context():
    create_tables()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
