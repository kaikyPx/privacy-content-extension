# 📚 Documentação Técnica - Privacy Data Modifier Extension

## 🏗️ Arquitetura da Extensão

### Estrutura de Componentes

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   popup.html    │    │   content.js    │    │  manifest.json  │
│   popup.js      │◄──►│                 │◄──►│                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interface     │    │   DOM           │    │   Permissões    │
│   do Usuário    │    │   Modificação   │    │   Chrome        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Componentes Principais

### 1. Manifest.json (Manifest V3)

```json
{
  "manifest_version": 3,
  "name": "Modificador de Dados do Site",
  "version": "1.0",
  "permissions": [
    "storage",      // Armazenamento local
    "activeTab",    // Acesso à aba ativa
    "scripting"     // Injeção de scripts
  ]
}
```

**Características:**
- **Manifest V3**: Última versão do sistema de extensões Chrome
- **Permissões Mínimas**: Apenas as necessárias para funcionamento
- **Content Scripts**: Execução automática em todas as páginas

### 2. Content Script (content.js)

**Responsabilidades:**
- Modificação do DOM da página
- Comunicação com o popup
- Persistência de dados
- Observação de mudanças no DOM

**Classes Principais:**

#### DataModifier
```javascript
class DataModifier {
  constructor() {
    this.statsData = { /* dados padrão */ };
    this.init();
  }
  
  async init() {
    await this.loadSavedData();
    await this.waitForPageLoad();
    this.applyModifications();
    this.observeDOM();
  }
}
```

**Métodos Principais:**
- `applyModifications()`: Aplica as modificações no DOM
- `modifyCardsInShadowDOM()`: Modifica elementos em Shadow DOM
- `modifyVendasCards()`: Modifica cards de vendas
- `modifyTopsCards()`: Modifica tops de vendas
- `observeDOM()`: Observa mudanças no DOM

### 3. Popup Interface (popup.html + popup.js)

**Responsabilidades:**
- Interface do usuário
- Coleta de dados
- Validação de entrada
- Comunicação com content script

**Classes Principais:**

#### PopupManager
```javascript
class PopupManager {
  constructor() {
    this.init();
  }
  
  async applyModifications() {
    const newData = this.collectFormData();
    await this.sendToContentScript(newData);
  }
}
```

## 🔄 Fluxo de Dados

### 1. Inicialização
```
Página Carrega → Content Script Executa → Dados Carregados → Modificações Aplicadas
```

### 2. Modificação via Popup
```
Usuário Abre Popup → Dados Coletados → Validação → Envio para Content Script → DOM Modificado
```

### 3. Persistência
```
Dados Modificados → Chrome Storage → Recarregamento → Dados Restaurados
```

## 🎯 Estratégias de Modificação DOM

### 1. Shadow DOM Detection
```javascript
const allElements = document.querySelectorAll('*');
allElements.forEach(element => {
  if (element.shadowRoot) {
    this.modifyCardsInShadowRoot(element.shadowRoot);
  }
});
```

### 2. Element Selection Strategies
- **Por Classes CSS**: `.stats-card`, `.stats-container`
- **Por Estrutura**: Hierarquia de elementos
- **Por Conteúdo**: Texto dos elementos
- **Por Índices**: Posição dos elementos

### 3. Fallback Mechanisms
```javascript
// Estratégia principal
this.modifyCardsInShadowDOM();

// Estratégia alternativa
this.modifyCardsInMainDOM();

// Estratégia de fallback
this.modifyCardsAlternative();
```

## 💾 Sistema de Armazenamento

### Chrome Storage API
```javascript
// Salvar dados
chrome.storage.local.set({ statsData: this.statsData });

// Carregar dados
const result = await chrome.storage.local.get(['statsData']);
```

### Estrutura de Dados
```javascript
const statsData = {
  liberado: { value: 'R$ 320,08', description: 'Valor disponível para saque' },
  faturamento: { value: 'R$ 0,00', description: 'Hoje' },
  total: { value: 'R$ 320,08', description: 'Saldo liberado + a liberar' },
  vendas: {
    hoje: { value: 'R$ 0,00', description: 'Hoje' },
    noMes: { value: 'R$ 160,00', description: 'No mês' },
    totalHistorico: { value: 'R$ 86.776,12', description: 'Total faturamento histórico' }
  },
  // ... outros dados
};
```

## 🔍 Sistema de Validação

### Validação de Dados
```javascript
validateData(data) {
  // Validação de campos obrigatórios
  if (!data.liberado || !data.liberado.value) {
    return false;
  }
  
  // Validação de formato
  if (!this.isValidCurrency(data.liberado.value)) {
    return false;
  }
  
  return true;
}
```

### Validação de Modificações
```javascript
checkModificationsSuccess() {
  let successCount = 0;
  
  // Verificar se os elementos foram modificados
  const cards = document.querySelectorAll('.stats-card');
  cards.forEach(card => {
    if (this.isCardModified(card)) {
      successCount++;
    }
  });
  
  return successCount >= 15; // Mínimo de 15 cards modificados
}
```

## 🎨 Sistema de Interface

### CSS Moderno
```css
.section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  transition: all 0.3s ease;
}
```

### Responsividade
```css
body {
  width: 420px;
  min-height: 600px;
}

@media (max-width: 480px) {
  body {
    width: 100vw;
  }
}
```

## 🔧 APIs Utilizadas

### Chrome Extensions API
- **chrome.storage**: Armazenamento local
- **chrome.tabs**: Comunicação com abas
- **chrome.runtime**: Comunicação entre componentes
- **chrome.scripting**: Injeção de scripts

### Web APIs
- **MutationObserver**: Observação de mudanças no DOM
- **Shadow DOM**: Acesso a elementos encapsulados
- **Local Storage**: Persistência de dados

## 🚀 Otimizações

### Performance
- **Debouncing**: Evita múltiplas execuções
- **Lazy Loading**: Carregamento sob demanda
- **Caching**: Armazenamento de dados em memória

### Compatibilidade
- **Manifest V3**: Última versão do Chrome
- **ES6+**: JavaScript moderno
- **Fallbacks**: Estratégias alternativas

## 🐛 Debugging

### Console Logs
```javascript
console.log('🔄 Aplicando modificações...');
console.log('✅ Modificações aplicadas com sucesso!');
console.log('❌ Erro ao aplicar modificações:', error);
```

### Error Handling
```javascript
try {
  await this.applyModifications();
} catch (error) {
  console.error('Erro:', error);
  this.showErrorToUser(error);
}
```

## 📈 Métricas e Monitoramento

### Success Rate
```javascript
const successRate = (successfulModifications / totalAttempts) * 100;
```

### Performance Metrics
```javascript
const startTime = performance.now();
await this.applyModifications();
const endTime = performance.now();
const duration = endTime - startTime;
```

## 🔒 Segurança

### Permissões Mínimas
- Apenas `storage`, `activeTab` e `scripting`
- Sem acesso a dados sensíveis
- Execução apenas em páginas ativas

### Validação de Entrada
- Sanitização de dados
- Validação de tipos
- Prevenção de XSS

## 🧪 Testing

### Testes Manuais
- Diferentes tipos de páginas
- Múltiplos navegadores
- Diferentes resoluções

### Testes Automatizados
```javascript
// Exemplo de teste
describe('DataModifier', () => {
  it('should modify cards successfully', () => {
    const modifier = new DataModifier();
    expect(modifier.checkModificationsSuccess()).toBe(true);
  });
});
```

## 📚 Recursos Adicionais

### Documentação
- [Chrome Extensions Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/migrating/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

### Ferramentas
- Chrome DevTools
- Extension Developer Tools
- Lighthouse (Performance)

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0.0
