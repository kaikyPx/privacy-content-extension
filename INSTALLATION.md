# 📦 Guia de Instalação - Privacy Data Modifier Extension

## 🚀 Instalação Rápida

### Método 1: Instalação Manual (Recomendado)

1. **Baixe o projeto**
   ```bash
   git clone https://github.com/yourusername/privacy-data-modifier.git
   cd privacy-data-modifier
   ```

2. **Abra o Chrome**
   - Digite `chrome://extensions/` na barra de endereços
   - Ou vá em Menu → Mais ferramentas → Extensões

3. **Ative o Modo Desenvolvedor**
   - Clique no botão "Modo do desenvolvedor" no canto superior direito
   - O botão deve ficar azul quando ativado

4. **Carregue a extensão**
   - Clique em "Carregar sem compactação"
   - Selecione a pasta do projeto (`privacy-data-modifier`)
   - Clique em "Selecionar pasta"

5. **Verifique a instalação**
   - A extensão deve aparecer na lista
   - O ícone deve aparecer na barra de ferramentas

### Método 2: Download de Release

1. **Acesse a página de releases**
   - Vá para: https://github.com/yourusername/privacy-data-modifier/releases

2. **Baixe a versão mais recente**
   - Clique em "Assets"
   - Baixe o arquivo `.zip`

3. **Extraia o arquivo**
   - Extraia o arquivo baixado
   - Anote o caminho da pasta extraída

4. **Siga os passos 2-5 do Método 1**

## 🔧 Configuração Inicial

### 1. Verificar Permissões
- A extensão solicitará permissões para:
  - Armazenamento local
  - Acesso à aba ativa
  - Injeção de scripts

### 2. Testar a Extensão
1. Abra uma página com cards de estatísticas
2. Clique no ícone da extensão
3. Configure alguns dados
4. Clique em "Aplicar Modificações"
5. Verifique se os dados foram alterados

## 🐛 Solução de Problemas

### Extensão não aparece
- Verifique se o "Modo do desenvolvedor" está ativado
- Recarregue a página de extensões
- Verifique se não há erros no console

### Dados não são modificados
- Verifique se a página carregou completamente
- Abra o console do navegador (F12) para ver erros
- Tente recarregar a página

### Popup não abre
- Verifique se há erros no console
- Tente desinstalar e reinstalar a extensão
- Verifique se o arquivo `popup.html` existe

### Erro de permissões
- Verifique se todas as permissões foram concedidas
- Tente desinstalar e reinstalar a extensão

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Google Chrome (versão 88+)
- ✅ Microsoft Edge (versão 88+)
- ✅ Opera (versão 74+)
- ❌ Firefox (não suportado - usa sistema diferente)

### Sistemas Operacionais
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Debian, etc.)

## 🔄 Atualizações

### Atualização Manual
1. Baixe a nova versão do GitHub
2. Substitua os arquivos antigos
3. Recarregue a extensão em `chrome://extensions/`

### Atualização Automática (Futuro)
- Quando publicada na Chrome Web Store
- Atualizações automáticas via Chrome

## 🗑️ Desinstalação

### Método 1: Via Chrome
1. Vá para `chrome://extensions/`
2. Encontre a extensão "Privacy Data Modifier"
3. Clique em "Remover"
4. Confirme a remoção

### Método 2: Limpeza Completa
1. Desinstale via Chrome (Método 1)
2. Delete a pasta do projeto
3. Limpe o cache do Chrome se necessário

## 📞 Suporte

### Problemas Comuns
- **Extensão não carrega**: Verifique o modo desenvolvedor
- **Dados não persistem**: Verifique permissões de armazenamento
- **Interface não aparece**: Verifique se popup.html existe

### Contato
- **GitHub Issues**: [Reportar problema](https://github.com/yourusername/privacy-data-modifier/issues)
- **Email**: seuemail@exemplo.com

## 📚 Recursos Adicionais

### Documentação
- [README Principal](README.md)
- [Documentação Técnica](TECHNICAL_DOCS.md)
- [Changelog](CHANGELOG.md)

### Links Úteis
- [Chrome Extensions Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0.0
