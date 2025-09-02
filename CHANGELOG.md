# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-01-XX

### Adicionado
- Extensão Chrome para modificação de dados de cards de estatísticas
- Interface popup moderna e responsiva
- Suporte para múltiplas seções de dados:
  - Dados financeiros (Liberado, Faturamento, Total)
  - Vendas nacionais (Hoje, No mês, Total histórico)
  - Vendas internacionais (Hoje, No mês, Total histórico)
  - Top vendas (Top 1, Top 2, Top 3 com datas)
  - Projeções (Total, Média dia, Projeção com cores e setas)
  - Assinantes (Total, Ativos, Faturamento)
- Sistema de persistência de dados
- Validação robusta de dados
- Estados de loading com feedback visual
- Suporte a Shadow DOM
- Observação de mudanças no DOM
- Sistema de fallback para diferentes estruturas de página
- Documentação completa em português, inglês e espanhol
- Configuração de CI/CD com GitHub Actions
- Licença MIT

### Características Técnicas
- Manifest V3 (última versão do Chrome)
- JavaScript ES6+
- CSS3 com gradientes e animações
- Chrome Extensions API
- Sistema de armazenamento local
- Comunicação entre componentes via messaging
- Estratégias múltiplas de modificação DOM
- Sistema de validação de modificações
- Tratamento de erros robusto
- Logs detalhados para debugging

### Interface
- Design moderno com gradientes
- Interface responsiva
- Animações suaves
- Feedback visual em tempo real
- Validação de campos em tempo real
- Botões de ação intuitivos
- Status de operações
- Scrollbar personalizada

### Documentação
- README principal em português
- README em inglês (README-EN.md)
- README em espanhol (README-ES.md)
- Documentação técnica detalhada (TECHNICAL_DOCS.md)
- Changelog completo
- Licença MIT
- Configuração de CI/CD
- Package.json com scripts de build

## [0.1.0] - 2025-01-XX

### Adicionado
- Versão inicial da extensão
- Funcionalidade básica de modificação de dados
- Interface popup simples
- Suporte para dados financeiros básicos

---

## Tipos de Mudanças

- **Adicionado** para novas funcionalidades
- **Alterado** para mudanças em funcionalidades existentes
- **Depreciado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correções de bugs
- **Segurança** para vulnerabilidades corrigidas
