// Arquivo de configuração central para chamadas de API.

// Configuração da instância do Axios ou de uma função fetch wrapper.
// O Axios é uma boa opção porque simplifica o tratamento de erros e a configuração de headers.
// Por simplicidade, vamos usar fetch, mas com uma função wrapper para centralizar a lógica.

const api = {
    // Adiciona o prefixo /api a todas as chamadas e configura o header de autorização
    async request(endpoint, options = {}) {
        const url = `/api${endpoint}`; // <--- CORREÇÃO: Adiciona o prefixo /api
        
        const token = localStorage.getItem('token');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        const response = await fetch(url, config);

        // Se a resposta não for ok, tenta extrair o corpo do erro
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { error: 'Ocorreu um erro inesperado no servidor.' };
            }
            // Lança um objeto de erro que inclui os dados da resposta
            const error = new Error(errorData.error || 'Erro na requisição');
            error.response = { data: errorData };
            throw error;
        }

        // Se a resposta for 204 No Content, não há corpo para ler
        if (response.status === 204) {
            return null;
        }
        
        return response.json();
    },

    get(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint, body, options) {
        return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
    },

    put(endpoint, body, options) {
        return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
    },

    delete(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    },
};

export default api;
