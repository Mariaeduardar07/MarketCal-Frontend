import api from '@/config/api';

/**
 * Serviço para gerenciar contas sociais (influenciadores)
 * Usando Axios para todas as requisições
 */

/**
 * Buscar todas as contas sociais
 */
export async function getAllSocialAccounts() {
  try {
    const response = await api.get('/social-accounts');
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar contas sociais:', error);
    throw error.response?.data || error;
  }
}

/**
 * Buscar uma conta social por ID
 */
export async function getSocialAccountById(id) {
  try {
    const response = await api.get(`/social-accounts/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar conta social:', error);
    throw error.response?.data || error;
  }
}

/**
 * Criar nova conta social
 * @param {Object} data - { name, platform, handle, avatar, userId }
 */
export async function createSocialAccount(data) {
  try {
    console.log('📤 Criando conta social:', {
      ...data,
      avatar: data.avatar ? `[Base64: ${Math.round(data.avatar.length / 1024)}KB]` : 'sem avatar'
    });
    
    const response = await api.post('/social-accounts', data);
    
    console.log('✅ Conta criada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar conta social:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar conta';
    throw new Error(errorMessage);
  }
}

/**
 * Atualizar conta social existente
 * @param {number} id - ID da conta social
 * @param {Object} data - { name, platform, handle, avatar }
 */
export async function updateSocialAccount(id, data) {
  try {
    // Log detalhado dos dados sendo enviados
    console.log(`📤 Atualizando conta social ID ${id}:`, {
      ...data,
      avatar: data.avatar ? `[Base64: ${Math.round(data.avatar.length / 1024)}KB]` : 'sem avatar'
    });
    
    const response = await api.put(`/social-accounts/${id}`, data);
    
    console.log('✅ Conta atualizada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar conta social:', {
      id,
      message: error.message,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      sentData: {
        ...data,
        avatar: data.avatar ? `[${data.avatar.substring(0, 50)}...]` : 'sem avatar'
      }
    });
    const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar conta';
    throw new Error(errorMessage);
  }
}

/**
 * Deletar conta social
 * @param {number} id - ID da conta social
 */
export async function deleteSocialAccount(id) {
  try {
    console.log(`🗑️ Deletando conta social ID ${id}`);
    
    const response = await api.delete(`/social-accounts/${id}`);
    
    console.log('✅ Conta deletada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao deletar conta social:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Erro ao deletar conta';
    throw new Error(errorMessage);
  }
}

