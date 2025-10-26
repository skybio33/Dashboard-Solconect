// API de Autenticação
const authAPI = {
    async login(username, password) {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao fazer login');
        }
        
        return await response.json();
    },
    
    async getUsers() {
        const response = await fetch('/api/auth/users');
        
        if (!response.ok) {
            throw new Error('Erro ao buscar usuários');
        }
        
        return await response.json();
    },
    
    async createUser(userData) {
        const response = await fetch('/api/auth/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar usuário');
        }
        
        return await response.json();
    },
    
    async updateUser(userId, userData) {
        const response = await fetch(`/api/auth/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao atualizar usuário');
        }
        
        return await response.json();
    },
    
    async deleteUser(userId) {
        const response = await fetch(`/api/auth/users/${userId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao excluir usuário');
        }
        
        return await response.json();
    }
};

