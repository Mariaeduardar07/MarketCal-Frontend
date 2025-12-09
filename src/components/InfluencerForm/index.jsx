import React, { useState, useEffect } from 'react';
import styles from './InfluencerForm.module.css';

const platforms = [
  { value: 'Instagram', label: 'Instagram', icon: '📷' },
  { value: 'YouTube', label: 'YouTube', icon: '🎥' },
  { value: 'TikTok', label: 'TikTok', icon: '🎵' },
  { value: 'LinkedIn', label: 'LinkedIn', icon: '💼' },
  { value: 'Twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'Facebook', label: 'Facebook', icon: '👥' },
];

export default function InfluencerForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        platform: initialData.platform || 'Instagram',
        handle: initialData.handle || '',
        avatar: initialData.avatar || '',
      };
    }
    return {
      name: '',
      platform: 'Instagram',
      handle: '',
      avatar: '',
    };
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(initialData?.avatar || null);
  const [avatarChanged, setAvatarChanged] = useState(false); // Nova flag para rastrear mudança

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'O nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.platform) {
      newErrors.platform = 'Selecione uma plataforma';
    }

    if (!formData.handle.trim()) {
      newErrors.handle = 'O handle/usuário é obrigatório';
    } else if (formData.handle.trim().length < 2) {
      newErrors.handle = 'O handle deve ter pelo menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Por favor, selecione apenas arquivos de imagem'
        }));
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: 'A imagem deve ter no máximo 5MB'
        }));
        return;
      }

      // Limpar erro se houver
      if (errors.avatar) {
        setErrors(prev => ({
          ...prev,
          avatar: ''
        }));
      }

      // Comprimir e redimensionar a imagem antes de converter para Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Criar canvas para redimensionar
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Definir tamanho máximo (300x300 é suficiente para avatar)
          const maxSize = 300;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Desenhar imagem redimensionada
          ctx.drawImage(img, 0, 0, width, height);
          
          // Converter para Base64 com qualidade reduzida (0.7 = 70%)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          
          console.log('📸 Imagem original:', Math.round(file.size / 1024), 'KB');
          console.log('📸 Imagem comprimida:', Math.round(compressedBase64.length / 1024), 'KB');
          
          setPreviewImage(compressedBase64);
          setAvatarChanged(true); // Marcar que o avatar foi alterado
          setFormData(prev => ({
            ...prev,
            avatar: compressedBase64
          }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setAvatarChanged(true); // Marcar que o avatar foi alterado (removido)
    setFormData(prev => ({
      ...prev,
      avatar: ''
    }));
    // Limpar o input file
    const fileInput = document.getElementById('avatar');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Se estamos editando e o avatar não mudou, não enviar avatar
      const dataToSubmit = { ...formData };
      if (initialData && !avatarChanged) {
        console.log('⚠️ Avatar não foi alterado, não enviando no update');
        delete dataToSubmit.avatar;
      }
      
      console.log('📋 Dados do formulário sendo enviados:', {
        ...dataToSubmit,
        avatar: dataToSubmit.avatar ? `[Base64: ${Math.round(dataToSubmit.avatar.length / 1024)}KB]` : 'não incluído'
      });
      onSubmit(dataToSubmit);
    } else {
      console.warn('⚠️ Formulário com erros:', errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Nome da Conta / Influenciador
          <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          placeholder="Ex: Maria Silva, Conta Empresa..."
          disabled={isLoading}
        />
        {errors.name && (
          <span className={styles.errorMessage}>{errors.name}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="platform" className={styles.label}>
          Plataforma Principal
          <span className={styles.required}>*</span>
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className={`${styles.select} ${errors.platform ? styles.inputError : ''}`}
            disabled={isLoading}
          >
            {platforms.map(platform => (
              <option key={platform.value} value={platform.value}>
                {platform.icon} {platform.label}
              </option>
            ))}
          </select>
        </div>
        {errors.platform && (
          <span className={styles.errorMessage}>{errors.platform}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="handle" className={styles.label}>
          Handle / Usuário
          <span className={styles.required}>*</span>
        </label>
        <div className={styles.inputWithPrefix}>
          <span className={styles.prefix}>@</span>
          <input
            type="text"
            id="handle"
            name="handle"
            value={formData.handle}
            onChange={handleChange}
            className={`${styles.input} ${styles.inputWithPrefixField} ${errors.handle ? styles.inputError : ''}`}
            placeholder="usuario_exemplo"
            disabled={isLoading}
          />
        </div>
        {errors.handle && (
          <span className={styles.errorMessage}>{errors.handle}</span>
        )}
      </div>

      {/* Campo de Upload de Foto */}
      <div className={styles.formGroup}>
        <label htmlFor="avatar" className={styles.label}>
          Foto de Perfil
        </label>
        
        {previewImage ? (
          <div className={styles.imagePreviewContainer}>
            <div className={styles.imagePreview}>
              <img 
                src={previewImage} 
                alt="Preview" 
                className={styles.previewImg}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className={styles.removeImageButton}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => document.getElementById('avatar').click()}
              className={styles.changeImageButton}
              disabled={isLoading}
            >
              📷 Trocar Foto
            </button>
          </div>
        ) : (
          <div className={styles.uploadContainer}>
            <label htmlFor="avatar" className={styles.uploadLabel}>
              <div className={styles.uploadIcon}>📷</div>
              <div className={styles.uploadText}>
                <span className={styles.uploadTitle}>Clique para adicionar uma foto</span>
                <span className={styles.uploadSubtitle}>PNG, JPG ou JPEG (máx. 5MB)</span>
              </div>
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
              disabled={isLoading}
            />
          </div>
        )}
        
        {errors.avatar && (
          <span className={styles.errorMessage}>{errors.avatar}</span>
        )}
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              Salvando...
            </>
          ) : (
            initialData ? 'Atualizar' : 'Cadastrar'
          )}
        </button>
      </div>
    </form>
  );
}
