// Script de conteúdo para modificar os dados dos cards
class DataModifier {
  constructor() {
    this.statsData = {
      liberado: { value: 'R$ 320,08', description: 'Valor disponível para saque' },
      faturamento: { value: 'R$ 0,00', description: 'Hoje' },
      total: { value: 'R$ 320,08', description: 'Saldo liberado + a liberar' },
      vendas: {
        hoje: { value: 'R$ 0,00', description: 'Hoje' },
        noMes: { value: 'R$ 160,00', description: 'No mês' },
        totalHistorico: { value: 'R$ 86.776,12', description: 'Total faturamento histórico' }
      },
      vendasInternacionais: {
        hoje: { value: 'R$ 0,00', description: 'Hoje' },
        noMes: { value: 'R$ 0,00', description: 'No mês' },
        totalHistorico: { value: 'R$ 0,00', description: 'Total faturamento histórico' }
      },
      tops: {
        top1: { value: 'R$ 1.229,92', description: 'Top 1', date: '02/01/2025' },
        top2: { value: 'R$ 1.170,00', description: 'Top 2', date: '08/06/2025' },
        top3: { value: 'R$ 1.098,48', description: 'Top 3', date: '05/03/2025' }
      },
      projecoes: {
        projecao1: { 
          value: 'R$ 500,00', 
          description: 'Total',
          porcentagem: '',
          cor: 'black',
          setaParaCima: true
        },
        projecao2: { 
          value: 'R$ 750,00', 
          description: 'Média Dia',
          porcentagem: '',
          cor: 'black',
          setaParaCima: true
        },
        projecao3: { 
          value: 'R$ 1.200,00', 
          description: 'Projeção',
          porcentagem: '+8,2%',
          cor: 'green',
          setaParaCima: true
        }
      },
      assinantes: {
        total: { value: '5.000', description: 'Total' },
        ativos: { value: '50', description: 'Ativos' },
        faturamento: { value: '99,9 %', description: 'Faturamento' }
      }
    };
    
    // Criar overlay preto imediatamente
    this.createLoadingOverlay();
    
    this.init();
  }

  createLoadingOverlay() {
    // Remover overlay existente se houver
    const existingOverlay = document.getElementById('loading-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // Criar overlay preto
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.id = 'loading-overlay';
    this.loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #000000;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 18px;
    `;
    
    // Overlay completamente limpo - apenas tela preta
    this.loadingOverlay.innerHTML = '';
    
    // CSS não é mais necessário sem o spinner
    
    // Inserir overlay no início do body
    if (document.body) {
      document.body.insertBefore(this.loadingOverlay, document.body.firstChild);
    } else {
      // Se body não existir ainda, aguardar
      document.addEventListener('DOMContentLoaded', () => {
        document.body.insertBefore(this.loadingOverlay, document.body.firstChild);
      });
    }
  }

  hideLoadingOverlay() {
    if (this.loadingOverlay) {
      // Fade out suave
      this.loadingOverlay.style.transition = 'opacity 0.5s ease-out';
      this.loadingOverlay.style.opacity = '0';
      
      setTimeout(() => {
        if (this.loadingOverlay && this.loadingOverlay.parentNode) {
          this.loadingOverlay.remove();
        }
      }, 500);
    }
  }

  async init() {
    // Carregar dados salvos
    await this.loadSavedData();
    
    // Aguardar o carregamento completo da página
    await this.waitForPageLoad();
    
    // Aplicar modificações uma única vez após o carregamento completo
    this.applyModifications();
    
    // Verificar se as modificações foram aplicadas com sucesso
    if (this.checkModificationsSuccess()) {
      this.hideLoadingOverlay();
    } else {
      // Se não foi bem-sucedido, tentar novamente com um pequeno delay
      setTimeout(() => {
        this.applyModifications();
        if (this.checkModificationsSuccess()) {
          this.hideLoadingOverlay();
                 } else {
           // Timeout de segurança - remover overlay após 4 segundos
           setTimeout(() => {
             if (this.loadingOverlay && this.loadingOverlay.parentNode) {
               console.log('Timeout de segurança: removendo overlay');
               this.hideLoadingOverlay();
             }
           }, 4000);
         }
      }, 300);
    }
    
    // Observar mudanças no DOM para aplicar modificações em novos elementos
    this.observeDOM();
  }

  async waitForPageLoad() {
    return new Promise((resolve) => {
      // Se a página já carregou completamente
      if (document.readyState === 'complete') {
        // Aguardar 1.2 segundos para garantir que todos os componentes foram renderizados
        setTimeout(resolve, 1200);
        return;
      }
      
      // Aguardar o carregamento completo da página
      window.addEventListener('load', () => {
        // Aguardar 1.2 segundos para garantir que todos os componentes foram renderizados
        setTimeout(resolve, 1200);
      });
      
      // Timeout de segurança
      setTimeout(resolve, 3000);
    });
  }

  checkModificationsSuccess() {
    // Verificar se pelo menos um card foi modificado com sucesso
    let successCount = 0;
    
    // Verificar no DOM principal
    const mainCards = document.querySelectorAll('.stats-card');
    mainCards.forEach(card => {
      const titulo = card.querySelector('.stats-card-title')?.innerText || '';
      const valorEl = card.querySelector('.stats-card-value');
      
      if (titulo.includes('Liberado') && valorEl && valorEl.innerText === this.statsData.liberado.value) {
        successCount++;
      } else if (titulo.includes('Faturamento') && valorEl && valorEl.innerText === this.statsData.faturamento.value) {
        successCount++;
      } else if (titulo.includes('Total') && valorEl && valorEl.innerText === this.statsData.total.value) {
        successCount++;
      }
    });
    
    // Verificar em shadowRoots
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      if (element.shadowRoot) {
        const shadowCards = element.shadowRoot.querySelectorAll('.stats-card');
        shadowCards.forEach(card => {
          const titulo = card.querySelector('.stats-card-title')?.innerText || '';
          const valorEl = card.querySelector('.stats-card-value');
          
          if (titulo.includes('Liberado') && valorEl && valorEl.innerText === this.statsData.liberado.value) {
            successCount++;
          } else if (titulo.includes('Faturamento') && valorEl && valorEl.innerText === this.statsData.faturamento.value) {
            successCount++;
          } else if (titulo.includes('Total') && valorEl && valorEl.innerText === this.statsData.total.value) {
            successCount++;
          }
        });
      }
    });
    
    // Verificar cards de vendas usando a estratégia que funciona
    const comp = document.querySelector("privacy-web-myprivacy");
    if (comp && comp.shadowRoot) {
      const shadow = comp.shadowRoot;
      const stats = shadow.querySelectorAll(".stats-container");
      
      if (stats.length === 6) {
        stats.forEach((stat, index) => {
          const label = stat.querySelector(".text-sm")?.innerText || "";
          const valueEl = stat.querySelector("h6");
          
          if (valueEl) {
            if (index < 3) {
              // Cards 0-2: Vendas
              if (label.includes('Hoje') && valueEl.innerText === this.statsData.vendas.hoje.value) {
                successCount++;
              } else if (label.includes('No mês') && valueEl.innerText === this.statsData.vendas.noMes.value) {
                successCount++;
              } else if (label.includes('Total faturamento histórico') && valueEl.innerText === this.statsData.vendas.totalHistorico.value) {
                successCount++;
              }
            } else {
              // Cards 3-5: Vendas Internacionais
              if (label.includes('Hoje') && valueEl.innerText === this.statsData.vendasInternacionais.hoje.value) {
                successCount++;
              } else if (label.includes('No mês') && valueEl.innerText === this.statsData.vendasInternacionais.noMes.value) {
                successCount++;
              } else if (label.includes('Total faturamento histórico') && valueEl.innerText === this.statsData.vendasInternacionais.totalHistorico.value) {
                successCount++;
              }
            }
          }
        });
      }
      
      // Verificar tops de vendas
      const topsContainers = shadow.querySelectorAll(".best-sales-container");
      if (topsContainers.length === 3) {
        topsContainers.forEach((container, index) => {
          const h6 = container.querySelector("h6");
          const dateElement = container.querySelector(".text-xs");
          
          if (index === 0 && h6 && h6.innerText === this.statsData.tops.top1.value && 
              dateElement && dateElement.innerText === this.statsData.tops.top1.date) {
            successCount++;
          } else if (index === 1 && h6 && h6.innerText === this.statsData.tops.top2.value && 
                     dateElement && dateElement.innerText === this.statsData.tops.top2.date) {
            successCount++;
          } else if (index === 2 && h6 && h6.innerText === this.statsData.tops.top3.value && 
                     dateElement && dateElement.innerText === this.statsData.tops.top3.date) {
            successCount++;
          }
        });
      }
      
      // Verificar projeções
      const projecoes = shadow.querySelectorAll(".stats-line-container h6");
      if (projecoes.length >= 3) {
        projecoes.forEach((h6, index) => {
          if (index >= 3) return; // só as 3 primeiras
          
          const container = h6.closest(".stats-line-container");
          const label = container.querySelector(".text-sm")?.innerText || "";
          
          if (label.includes("Projeção") || label.includes("Total") || label.includes("Média Dia")) {
            if (index === 0) {
              // primeiro h6: só valor
              const span = h6.querySelector("span") || h6;
              if (span.innerText === this.statsData.projecoes.projecao1.value) {
                successCount++;
              }
            } else if (index === 1) {
              // segundo h6: só valor
              const span = h6.querySelector("span") || h6;
              if (span.innerText === this.statsData.projecoes.projecao2.value) {
                successCount++;
              }
            } else if (index === 2) {
              // terceiro h6: valor, cor, porcentagem e seta
              const span = h6.querySelector("span") || h6;
              if (span.innerText === this.statsData.projecoes.projecao3.value) {
                successCount++;
              }
            }
          }
        });
      }
      
      // Verificar assinantes
      const assinantesH6 = Array.from(shadow.querySelectorAll(".stats-line-container h6"));
      if (assinantesH6.length >= 3) {
        const ultimos3 = assinantesH6.slice(-3);
        ultimos3.forEach((h6, index) => {
          const label = h6.closest(".stats-line-container").querySelector(".text-sm")?.innerText || "";
          
          if (label.includes("Total") && h6.innerText === this.statsData.assinantes.total.value) {
            successCount++;
          } else if (label.includes("Ativos") && h6.innerText === this.statsData.assinantes.ativos.value) {
            successCount++;
          } else if (label.includes("Faturamento") && h6.innerText === this.statsData.assinantes.faturamento.value) {
            successCount++;
          }
        });
      }
    }
    
    // Verificar também usando a estratégia alternativa
    const titles = ['Liberado', 'Faturamento', 'Total'];
    titles.forEach(title => {
      const elements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.includes(title)
      );
      
      if (elements.length > 0) {
        elements.forEach(element => {
          const cardContainer = this.findCardContainerByStructure(element);
          if (cardContainer) {
            const valueElement = cardContainer.querySelector('strong') || 
                               cardContainer.querySelector('b') ||
                               cardContainer.querySelector('[class*="value"]');
            
            if (valueElement) {
              let expectedValue = '';
              switch(title) {
                case 'Liberado':
                  expectedValue = this.statsData.liberado.value;
                  break;
                case 'Faturamento':
                  expectedValue = this.statsData.faturamento.value;
                  break;
                case 'Total':
                  expectedValue = this.statsData.total.value;
                  break;
              }
              
              if (valueElement.innerText === expectedValue) {
                successCount++;
              }
            }
          }
        });
      }
    });
    
    console.log(`Verificação de sucesso: ${successCount} cards modificados`);
    
    // Considerar sucesso se pelo menos 15 cards foram modificados (incluindo vendas + vendas internacionais + tops + projeções + assinantes)
    return successCount >= 15;
  }

  async loadSavedData() {
    try {
      const result = await chrome.storage.local.get(['statsData']);
      if (result.statsData) {
        this.statsData = { ...this.statsData, ...result.statsData };
        console.log('Dados carregados:', this.statsData);
      }
    } catch (error) {
      console.log('Erro ao carregar dados salvos:', error);
    }
  }

  applyModifications() {
    console.log('Aplicando modificações...');
    
    // Estratégia que funciona: procurar por shadowRoot e usar classes CSS específicas
    this.modifyCardsInShadowDOM();
    
    // Também tentar no DOM principal simultaneamente
    this.modifyCardsInMainDOM();
    
    // Modificar cards de vendas
    this.modifyVendasCards();
    
    // Modificar tops de vendas
    this.modifyTopsCards();

    // Modificar projeções
    this.modifyProjecoesCards();

    // Modificar assinantes
    this.modifyAssinantesCards();
  }

  modifyCardsInShadowDOM() {
    // Procurar por todos os elementos que podem ter shadowRoot
    const allElements = document.querySelectorAll('*');
    let cardsFound = 0;
    
    allElements.forEach(element => {
      if (element.shadowRoot) {
        // Procurar por cards dentro do shadowRoot
        const cards = element.shadowRoot.querySelectorAll('.stats-card');
        if (cards.length > 0) {
          console.log(`Encontrados ${cards.length} cards no shadowRoot`);
          this.modifyCardsInShadowRoot(element.shadowRoot);
          cardsFound += cards.length;
        }
      }
    });
    
    if (cardsFound === 0) {
      console.log('Nenhum card encontrado em shadowRoot');
    }
  }

  modifyCardsInShadowRoot(shadowRoot) {
    const cards = shadowRoot.querySelectorAll('.stats-card');
    
    cards.forEach((card, index) => {
      const titulo = card.querySelector('.stats-card-title')?.innerText || '';
      const valorEl = card.querySelector('.stats-card-value');
      const descEl = card.querySelector('.stats-card-description');
      
      if (titulo.includes('Liberado')) {
        if (valorEl) {
          valorEl.innerText = this.statsData.liberado.value;
          console.log(`Shadow DOM: Valor do Liberado modificado para: ${this.statsData.liberado.value}`);
        }
        if (descEl && this.statsData.liberado.description !== 'Hoje') {
          descEl.innerText = this.statsData.liberado.description;
        }
      } else if (titulo.includes('Faturamento')) {
        if (valorEl) {
          valorEl.innerText = this.statsData.faturamento.value;
          console.log(`Shadow DOM: Valor do Faturamento modificado para: ${this.statsData.faturamento.value}`);
        }
        if (descEl && this.statsData.faturamento.description !== 'Hoje') {
          descEl.innerText = this.statsData.faturamento.description;
        }
      } else if (titulo.includes('Total')) {
        if (valorEl) {
          valorEl.innerText = this.statsData.total.value;
          console.log(`Shadow DOM: Valor do Total modificado para: ${this.statsData.total.value}`);
        }
        if (descEl && this.statsData.total.description !== 'Hoje') {
          descEl.innerText = this.statsData.total.description;
        }
      }
    });
  }

  modifyCardsInMainDOM() {
    // Procurar por cards usando as classes CSS específicas
    const cards = document.querySelectorAll('.stats-card');
    
    if (cards.length > 0) {
      console.log(`Encontrados ${cards.length} cards no DOM principal`);
      this.modifyCardsInMainDOMHelper(cards);
    } else {
      // Tentar estratégia alternativa
      this.modifyCardsAlternative();
    }
  }

  modifyCardsInMainDOMHelper(cards) {
    cards.forEach((card, index) => {
      const titulo = card.querySelector('.stats-card-title')?.innerText || '';
      const valorEl = card.querySelector('.stats-card-value');
      const descEl = card.querySelector('.stats-card-description');
      
      if (titulo.includes('Liberado')) {
        if (valorEl) {
          valorEl.innerText = this.statsData.liberado.value;
          console.log(`DOM Principal: Valor do Liberado modificado para: ${this.statsData.liberado.value}`);
        }
        if (descEl && this.statsData.liberado.description !== 'Hoje') {
          descEl.innerText = this.statsData.liberado.description;
        }
      } else if (titulo.includes('Faturamento')) {
        if (valorEl) {
          valorEl.innerText = this.statsData.faturamento.value;
          console.log(`DOM Principal: Valor do Faturamento modificado para: ${this.statsData.faturamento.value}`);
        }
        if (descEl && this.statsData.faturamento.description !== 'Hoje') {
          descEl.innerText = this.statsData.faturamento.description;
        }
      } else if (titulo.includes('Total')) {
        if (valorEl) {
          valorEl.innerText = this.statsData.total.value;
          console.log(`DOM Principal: Valor do Total modificado para: ${this.statsData.total.value}`);
        }
        if (descEl && this.statsData.total.description !== 'Hoje') {
          descEl.innerText = this.statsData.total.description;
        }
      }
    });
  }

  modifyCardsAlternative() {
    // Estratégia alternativa: procurar por elementos que contenham os títulos
    const titles = ['Liberado', 'Faturamento', 'Total'];
    
    titles.forEach(title => {
      // Procurar por elementos que contenham o título
      const elements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.includes(title)
      );
      
      if (elements.length > 0) {
        console.log(`Estratégia alternativa: Encontrados ${elements.length} elementos para "${title}"`);
        
        elements.forEach((element, index) => {
          // Encontrar o container pai que contém o card completo
          const cardContainer = this.findCardContainerByStructure(element);
          if (cardContainer) {
            this.modifyCardAlternative(cardContainer, title);
          }
        });
      }
    });
  }

  modifyCardAlternative(cardContainer, title) {
    // Mapear título para os dados
    let data;
    switch(title) {
      case 'Liberado':
        data = this.statsData.liberado;
        break;
      case 'Faturamento':
        data = this.statsData.faturamento;
        break;
      case 'Total':
        data = this.statsData.total;
        break;
      default:
        return;
    }
    
    // Procurar pelo valor
    let valueElement = cardContainer.querySelector('strong') || 
                      cardContainer.querySelector('b') ||
                      cardContainer.querySelector('[class*="value"]');
    
    if (valueElement) {
      valueElement.innerText = data.value;
      console.log(`Estratégia alternativa: Valor de ${title} modificado para: ${data.value}`);
    }
    
    // Procurar pela descrição
    let descElement = cardContainer.querySelector('span') ||
                      cardContainer.querySelector('[class*="description"]');
    
    if (descElement && data.description !== 'Hoje') {
      descElement.innerText = data.description;
    }
  }

  modifyVendasCards() {
    console.log('🛒 Modificando cards de vendas...');
    console.log('🛒 Dados de vendas atuais:', this.statsData.vendas);
    console.log('🛒 Dados de vendas internacionais atuais:', this.statsData.vendasInternacionais);
    
    // Estratégia que funciona: usar privacy-web-myprivacy e shadowRoot
    const comp = document.querySelector("privacy-web-myprivacy");
    if (comp && comp.shadowRoot) {
      const shadow = comp.shadowRoot;
      const stats = shadow.querySelectorAll(".stats-container");
      
      console.log(`🛒 Encontrados ${stats.length} cards de vendas no shadowRoot`);
      
      if (stats.length === 6) {
        // Mapear os 6 cards: 0-2 = vendas, 3-5 = vendas internacionais
        stats.forEach((stat, index) => {
          const label = stat.querySelector(".text-sm")?.innerText || "";
          const valueEl = stat.querySelector("h6");
          
          console.log(`🛒 Card ${index}: Label = "${label}", Valor atual = "${valueEl?.innerText || ""}"`);
          
          if (valueEl) {
            if (index < 3) {
              // Cards 0-2: Vendas
              if (label.includes('Hoje')) {
                valueEl.innerText = this.statsData.vendas.hoje.value;
                console.log(`✅ Vendas Hoje (${index}) modificado para: ${this.statsData.vendas.hoje.value}`);
              } else if (label.includes('No mês')) {
                valueEl.innerText = this.statsData.vendas.noMes.value;
                console.log(`✅ Vendas No mês (${index}) modificado para: ${this.statsData.vendas.noMes.value}`);
              } else if (label.includes('Total faturamento histórico')) {
                valueEl.innerText = this.statsData.vendas.totalHistorico.value;
                console.log(`✅ Vendas Total histórico (${index}) modificado para: ${this.statsData.vendas.totalHistorico.value}`);
              }
            } else {
              // Cards 3-5: Vendas Internacionais
              if (label.includes('Hoje')) {
                valueEl.innerText = this.statsData.vendasInternacionais.hoje.value;
                console.log(`✅ Vendas Internacionais Hoje (${index}) modificado para: ${this.statsData.vendasInternacionais.hoje.value}`);
              } else if (label.includes('No mês')) {
                valueEl.innerText = this.statsData.vendasInternacionais.noMes.value;
                console.log(`✅ Vendas Internacionais No mês (${index}) modificado para: ${this.statsData.vendasInternacionais.noMes.value}`);
              } else if (label.includes('Total faturamento histórico')) {
                valueEl.innerText = this.statsData.vendasInternacionais.totalHistorico.value;
                console.log(`✅ Vendas Internacionais Total histórico (${index}) modificado para: ${this.statsData.vendasInternacionais.totalHistorico.value}`);
              }
            }
          }
        });
      } else {
        console.log(`⚠️ Número inesperado de cards: ${stats.length} (esperado: 6)`);
      }
    } else {
      console.log('❌ Elemento privacy-web-myprivacy ou shadowRoot não encontrado');
      // Fallback para estratégia alternativa
      this.modifyVendasAlternative();
    }
  }

  modifyTopsCards() {
    console.log('🏆 Modificando tops de vendas...');
    console.log('🏆 Dados dos tops atuais:', this.statsData.tops);
    
    // Estratégia que funciona: usar privacy-web-myprivacy e shadowRoot
    const comp = document.querySelector("privacy-web-myprivacy");
    if (comp && comp.shadowRoot) {
      const shadow = comp.shadowRoot;
      const topsContainers = shadow.querySelectorAll(".best-sales-container");
      
      console.log(`🏆 Encontrados ${topsContainers.length} containers de tops no shadowRoot`);
      
      if (topsContainers.length === 3) {
        // Mapear os 3 tops: 0 = Top 1, 1 = Top 2, 2 = Top 3
        topsContainers.forEach((container, index) => {
          const h6 = container.querySelector("h6");
          const dateElement = container.querySelector(".text-xs");
          
          console.log(`🏆 Top ${index + 1}: Valor atual = "${h6?.innerText || ''}", Data atual = "${dateElement?.innerText || ''}"`);
          
          if (index === 0) {
            if (h6) {
              h6.innerText = this.statsData.tops.top1.value;
              console.log(`✅ Top 1 valor modificado para: ${this.statsData.tops.top1.value}`);
            }
            if (dateElement) {
              dateElement.innerText = this.statsData.tops.top1.date;
              console.log(`✅ Top 1 data modificada para: ${this.statsData.tops.top1.date}`);
            }
          } else if (index === 1) {
            if (h6) {
              h6.innerText = this.statsData.tops.top2.value;
              console.log(`✅ Top 2 valor modificado para: ${this.statsData.tops.top2.value}`);
            }
            if (dateElement) {
              dateElement.innerText = this.statsData.tops.top2.date;
              console.log(`✅ Top 2 data modificada para: ${this.statsData.tops.top2.date}`);
            }
          } else if (index === 2) {
            if (h6) {
              h6.innerText = this.statsData.tops.top3.value;
              console.log(`✅ Top 3 valor modificado para: ${this.statsData.tops.top3.value}`);
            }
            if (dateElement) {
              dateElement.innerText = this.statsData.tops.top3.date;
              console.log(`✅ Top 3 data modificada para: ${this.statsData.tops.top3.date}`);
            }
          }
        });
      } else {
        console.log(`⚠️ Número inesperado de containers de tops: ${topsContainers.length} (esperado: 3)`);
      }
    } else {
      console.log('❌ Elemento privacy-web-myprivacy ou shadowRoot não encontrado para tops');
    }
  }

  modifyProjecoesCards() {
    console.log('📊 Modificando projeções...');
    console.log('📊 Dados das projeções atuais:', this.statsData.projecoes);
    
    // Estratégia que funciona: usar privacy-web-myprivacy e shadowRoot
    const comp = document.querySelector("privacy-web-myprivacy");
    if (comp && comp.shadowRoot) {
      const shadow = comp.shadowRoot;
      const projecoes = shadow.querySelectorAll(".stats-line-container h6");
      
      console.log(`📊 Encontradas ${projecoes.length} projeções no shadowRoot`);
      
      if (projecoes.length >= 3) {
        // Mapear as 3 primeiras projeções: 0 = Projeção 1, 1 = Projeção 2, 2 = Projeção 3
        projecoes.forEach((h6, index) => {
          if (index >= 3) return; // só as 3 primeiras
          
          const container = h6.closest(".stats-line-container");
          const label = container.querySelector(".text-sm")?.innerText || "";
          
          if (label.includes("Projeção") || label.includes("Total") || label.includes("Média Dia")) {
            if (index === 0) {
              // primeiro h6: só valor
              const span = h6.querySelector("span") || h6;
              span.innerText = this.statsData.projecoes.projecao1.value;
              console.log(`✅ Projeção 1 (Total) modificada para: ${this.statsData.projecoes.projecao1.value}`);
            } else if (index === 1) {
              // segundo h6: só valor
              const span = h6.querySelector("span") || h6;
              span.innerText = this.statsData.projecoes.projecao2.value;
              console.log(`✅ Projeção 2 (Média Dia) modificada para: ${this.statsData.projecoes.projecao2.value}`);
            } else if (index === 2) {
              // terceiro h6: valor, cor, porcentagem e seta
              const span = h6.querySelector("span") || h6;
              span.innerText = this.statsData.projecoes.projecao3.value;
              span.style.setProperty("color", this.statsData.projecoes.projecao3.cor, "important");
              
              const iconDiv = h6.querySelector(".icon");
              if (iconDiv) {
                // remover text nodes antigos
                Array.from(iconDiv.childNodes).forEach(node => {
                  if (node.nodeType === Node.TEXT_NODE) node.remove();
                });
                
                // criar novo text node com porcentagem
                iconDiv.prepend(document.createTextNode(this.statsData.projecoes.projecao3.porcentagem + " "));
                
                // alterar a seta baseado na direção
                const svg = iconDiv.querySelector("svg");
                if (svg) {
                  if (this.statsData.projecoes.projecao3.setaParaCima) {
                    // seta para cima
                    svg.innerHTML = `<path fill="currentColor" d="M180.7 36.7c6.2-6.2 16.4-6.2 22.6 0l176 176c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L208 86.6 208 464c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-377.4L27.3 235.3c-6.2-6.2-6.2-16.4 0-22.6l176-176z"></path>`;
                  } else {
                    // seta para baixo
                    svg.innerHTML = `<path fill="currentColor" d="M180.7 36.7c6.2-6.2 16.4-6.2 22.6 0l176 176c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L208 86.6 208 464c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-377.4L27.3 235.3c-6.2-6.2-6.2-16.4 0-22.6l176-176z"></path>`;
                  }
                  svg.style.setProperty("color", this.statsData.projecoes.projecao3.cor, "important");
                }
              }
              console.log(`✅ Projeção 3 modificada para: ${this.statsData.projecoes.projecao3.value}, cor: ${this.statsData.projecoes.projecao3.cor}, seta: ${this.statsData.projecoes.projecao3.setaParaCima ? 'cima' : 'baixo'}`);
            }
          }
        });
      } else {
        console.log(`⚠️ Número inesperado de projeções: ${projecoes.length} (esperado: >=3)`);
      }
    } else {
      console.log('❌ Elemento privacy-web-myprivacy ou shadowRoot não encontrado');
    }
  }

  modifyAssinantesCards() {
    console.log('👥 Modificando assinantes...');
    console.log('👥 Dados dos assinantes atuais:', this.statsData.assinantes);
    
    // Estratégia que funciona: usar privacy-web-myprivacy e shadowRoot
    const comp = document.querySelector("privacy-web-myprivacy");
    if (comp && comp.shadowRoot) {
      const shadow = comp.shadowRoot;
      
      // seleciona todos os h6 da seção "Assinantes"
      const assinantesH6 = Array.from(shadow.querySelectorAll(".stats-line-container h6"));
      
      console.log(`👥 Encontrados ${assinantesH6.length} cards de assinantes no shadowRoot`);
      
      if (assinantesH6.length >= 3) {
        // pega os 3 últimos
        const ultimos3 = assinantesH6.slice(-3);
        
        ultimos3.forEach((h6, index) => {
          const label = h6.closest(".stats-line-container").querySelector(".text-sm")?.innerText || "";
          
          if (label.includes("Total")) {
            h6.innerText = this.statsData.assinantes.total.value;
            console.log(`✅ Assinantes Total modificado para: ${this.statsData.assinantes.total.value}`);
          } else if (label.includes("Ativos")) {
            h6.innerText = this.statsData.assinantes.ativos.value;
            console.log(`✅ Assinantes Ativos modificado para: ${this.statsData.assinantes.ativos.value}`);
          } else if (label.includes("Faturamento")) {
            h6.innerText = this.statsData.assinantes.faturamento.value;
            console.log(`✅ Assinantes Faturamento modificado para: ${this.statsData.assinantes.faturamento.value}`);
          }
        });
      } else {
        console.log(`⚠️ Número inesperado de cards de assinantes: ${assinantesH6.length} (esperado: >=3)`);
      }
    } else {
      console.log('❌ Elemento privacy-web-myprivacy ou shadowRoot não encontrado');
    }
  }

  modifyVendasAlternative() {
    console.log('🛒 Estratégia alternativa para vendas...');
    
    // Procurar por elementos que contenham os títulos das vendas
    const vendasTitles = ['Hoje', 'No mês', 'Total faturamento histórico'];
    
    vendasTitles.forEach(title => {
      console.log(`🛒 Procurando por título: "${title}"`);
      
      // Estratégia 1: Procurar por texto exato
      const elements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.includes(title)
      );
      
      console.log(`🛒 Encontrados ${elements.length} elementos para "${title}"`);
      
      if (elements.length > 0) {
        elements.forEach((element, index) => {
          console.log(`🛒 Elemento ${index} para "${title}":`, element);
          
          // Encontrar o container pai que contém o card completo
          const cardContainer = this.findVendasCardContainer(element);
          if (cardContainer) {
            console.log(`🛒 Container encontrado para "${title}":`, cardContainer);
            this.modifyVendasCardAlternative(cardContainer, title);
          } else {
            console.log(`🛒 Container não encontrado para "${title}"`);
          }
        });
      }
    });
    
    // Estratégia 2: Procurar por elementos que contenham valores monetários
    console.log('🛒 Estratégia 2: Procurando por elementos com valores R$...');
    const valueElements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent && el.textContent.includes('R$') && 
      (el.textContent.includes('Hoje') || el.textContent.includes('No mês') || el.textContent.includes('Total'))
    );
    
    console.log(`🛒 Encontrados ${valueElements.length} elementos com valores R$ e títulos de vendas`);
    
    valueElements.forEach((element, index) => {
      console.log(`🛒 Elemento com valor ${index}:`, element);
      this.modifyVendasCardAlternative(element.parentElement || element, 'auto');
    });
  }

  modifyVendasCardAlternative(cardContainer, title) {
    console.log(`🛒 Modificando card alternativo: "${title}" em:`, cardContainer);
    
    // Mapear título para os dados de vendas
    let data;
    let detectedTitle = title;
    
    if (title === 'auto') {
      // Detectar automaticamente o tipo baseado no conteúdo
      const text = cardContainer.textContent || '';
      if (text.includes('Hoje')) {
        detectedTitle = 'Hoje';
        data = this.statsData.vendas.hoje;
      } else if (text.includes('No mês')) {
        detectedTitle = 'No mês';
        data = this.statsData.vendas.noMes;
      } else if (text.includes('Total faturamento histórico')) {
        detectedTitle = 'Total faturamento histórico';
        data = this.statsData.vendas.totalHistorico;
      } else {
        console.log(`🛒 Não foi possível detectar o tipo de venda para:`, text);
        return;
      }
    } else {
      switch(title) {
        case 'Hoje':
          data = this.statsData.vendas.hoje;
          break;
        case 'No mês':
          data = this.statsData.vendas.noMes;
          break;
        case 'Total faturamento histórico':
          data = this.statsData.vendas.totalHistorico;
          break;
        default:
          console.log(`🛒 Título desconhecido: ${title}`);
          return;
      }
    }
    
    console.log(`🛒 Dados para "${detectedTitle}":`, data);
    
    // Procurar pelo valor (h6, strong, ou qualquer elemento que contenha R$)
    let valueElement = cardContainer.querySelector('h6') ||
                      cardContainer.querySelector('strong') || 
                      cardContainer.querySelector('b') ||
                      cardContainer.querySelector('[class*="value"]') ||
                      Array.from(cardContainer.querySelectorAll('*')).find(el => 
                        el.textContent && el.textContent.includes('R$')
                      );
    
    if (valueElement) {
      console.log(`🛒 Elemento de valor encontrado:`, valueElement);
      console.log(`🛒 Valor anterior: "${valueElement.innerText}"`);
      
      valueElement.innerText = data.value;
      console.log(`✅ Estratégia alternativa vendas: Valor de ${detectedTitle} modificado para: ${data.value}`);
    } else {
      console.log(`🛒 Elemento de valor não encontrado em:`, cardContainer);
      
      // Tentar modificar o próprio elemento se ele contiver R$
      if (cardContainer.textContent && cardContainer.textContent.includes('R$')) {
        console.log(`🛒 Tentando modificar o próprio container...`);
        // Procurar por qualquer texto que contenha R$ e substituir
        const textNodes = [];
        this.findTextNodes(cardContainer, textNodes);
        
        textNodes.forEach(node => {
          if (node.textContent && node.textContent.includes('R$')) {
            console.log(`🛒 Texto encontrado: "${node.textContent}"`);
            // Substituir apenas a parte do valor, mantendo o resto
            const newText = node.textContent.replace(/R\$\s*[\d.,]+/, data.value);
            if (newText !== node.textContent) {
              node.textContent = newText;
              console.log(`✅ Texto modificado para: "${newText}"`);
            }
          }
        });
      }
    }
  }
  
  findTextNodes(element, textNodes) {
    if (element.nodeType === Node.TEXT_NODE) {
      textNodes.push(element);
    } else {
      element.childNodes.forEach(child => {
        this.findTextNodes(child, textNodes);
      });
    }
  }

  modifyVendasInShadowDOM() {
    // Procurar por todos os elementos que podem ter shadowRoot
    const allElements = document.querySelectorAll('*');
    let cardsFound = 0;
    
    allElements.forEach(element => {
      if (element.shadowRoot) {
        // Procurar por cards dentro do shadowRoot
        const cards = element.shadowRoot.querySelectorAll('.stats-card');
        if (cards.length > 0) {
          console.log(`Encontrados ${cards.length} cards no shadowRoot para vendas`);
          this.modifyVendasInShadowRoot(element.shadowRoot);
          cardsFound += cards.length;
        }
      }
    });
    
    if (cardsFound === 0) {
      console.log('Nenhum card encontrado em shadowRoot para vendas');
    }
  }

  modifyVendasInShadowRoot(shadowRoot) {
    const cards = shadowRoot.querySelectorAll('.stats-card');
    
    cards.forEach((card, index) => {
      const titulo = card.querySelector('.stats-card-title')?.innerText || '';
      const valorEl = card.querySelector('.stats-card-value');
      const descEl = card.querySelector('.stats-card-description');
      
      if (titulo.includes('Hoje')) {
        if (valorEl) {
          valorEl.innerText = this.statsData.vendas.hoje.value;
          console.log(`Shadow DOM Vendas: Valor do Hoje modificado para: ${this.statsData.vendas.hoje.value}`);
        }
        if (descEl && this.statsData.vendas.hoje.description !== 'Hoje') {
          descEl.innerText = this.statsData.vendas.hoje.description;
        }
      } else if (titulo.includes('No mês')) {
        if (valorEl) {
          valorEl.innerText = this.statsData.vendas.noMes.value;
          console.log(`Shadow DOM Vendas: Valor do No mês modificado para: ${this.statsData.vendas.noMes.value}`);
        }
        if (descEl && this.statsData.vendas.noMes.description !== 'Hoje') {
          descEl.innerText = this.statsData.vendas.noMes.description;
        }
      } else if (titulo.includes('Total faturamento histórico')) {
        if (valorEl) {
          valorEl.innerText = this.statsData.vendas.totalHistorico.value;
          console.log(`Shadow DOM Vendas: Valor do Total histórico modificado para: ${this.statsData.vendas.totalHistorico.value}`);
        }
        if (descEl && this.statsData.vendas.totalHistorico.description !== 'Hoje') {
          descEl.innerText = this.statsData.vendas.totalHistorico.description;
        }
      }
    });
  }

  findCardContainerByStructure(element) {
    // Procurar pelo container do card subindo na hierarquia do DOM
    let current = element;
    let depth = 0;
    const maxDepth = 20;
    
    while (current && current !== document.body && depth < maxDepth) {
      // Verificar se é um container de card baseado na estrutura
      if (this.isCardContainer(current)) {
        return current;
      }
      
      current = current.parentElement;
      depth++;
    }
    
    // Se não encontrar um container específico, retornar o elemento pai mais próximo
    return element.parentElement;
  }

  isCardContainer(element) {
    // Verificar se é um container de card baseado na estrutura, não nas classes
    if (!element || !element.children) return false;
    
    // Verificar se tem múltiplos elementos filhos (indicando um card)
    const childCount = element.children.length;
    
    // Verificar se contém elementos de texto e valores
    const hasTextElements = Array.from(element.children).some(child => 
      child.textContent && child.textContent.trim().length > 0
    );
    
    // Verificar se tem uma estrutura que sugere um card (múltiplos elementos)
    const isLikelyCard = childCount >= 2 && hasTextElements;
    
    // Verificar se não é um container muito grande (evitar pegar toda a página)
    const isReasonableSize = element.children.length <= 10;
    
    return isLikelyCard && isReasonableSize;
  }

  findVendasCardContainer(element) {
    // Procurar pelo container do card de vendas subindo na hierarquia do DOM
    let current = element;
    let depth = 0;
    const maxDepth = 15;
    
    while (current && current !== document.body && depth < maxDepth) {
      // Verificar se é um container de card de vendas baseado na estrutura
      if (this.isVendasCardContainer(current)) {
        return current;
      }
      
      current = current.parentElement;
      depth++;
    }
    
    // Se não encontrar um container específico, retornar o elemento pai mais próximo
    return element.parentElement;
  }

  isVendasCardContainer(element) {
    // Verificar se é um container de card de vendas baseado na estrutura
    if (!element || !element.children) return false;
    
    // Verificar se tem elementos de texto que sugerem um card de vendas
    const hasVendasText = Array.from(element.children).some(child => 
      child.textContent && (
        child.textContent.includes('Hoje') ||
        child.textContent.includes('No mês') ||
        child.textContent.includes('Total faturamento histórico') ||
        child.textContent.includes('R$')
      )
    );
    
    // Verificar se tem uma estrutura que sugere um card (múltiplos elementos)
    const childCount = element.children.length;
    const isLikelyCard = childCount >= 2 && hasVendasText;
    
    // Verificar se não é um container muito grande
    const isReasonableSize = element.children.length <= 8;
    
    return isLikelyCard && isReasonableSize;
  }

  observeDOM() {
    // Observar mudanças no DOM para aplicar modificações em novos elementos
    let applyTimeout = null;
    
    const observer = new MutationObserver((mutations) => {
      let shouldApply = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Verificar se algum dos novos nós contém os títulos dos cards
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const text = node.textContent || '';
              if (text.includes('Liberado') || text.includes('Faturamento') || text.includes('Total') ||
                  text.includes('Hoje') || text.includes('No mês') || text.includes('Total faturamento histórico')) {
                shouldApply = true;
              }
            }
          });
        }
      });
      
      if (shouldApply) {
        // Debounce para evitar múltiplas aplicações em sequência
        if (applyTimeout) {
          clearTimeout(applyTimeout);
        }
        
        applyTimeout = setTimeout(() => {
          console.log('Novos cards detectados, aplicando modificações...');
          this.applyModifications();
        }, 200); // Delay otimizado para garantir que o DOM foi renderizado
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Método para atualizar dados em tempo real
  updateData(newData) {
    console.log('🔄 UPDATE DATA - Dados recebidos:', newData);
    console.log('🔄 UPDATE DATA - Dados atuais:', this.statsData);
    
    // Atualizar os dados
    this.statsData = { ...this.statsData, ...newData };
    console.log('🔄 UPDATE DATA - Dados atualizados:', this.statsData);
    
    // Salvar no storage
    try {
      chrome.storage.local.set({ statsData: this.statsData });
      console.log('🔄 UPDATE DATA - Dados salvos no storage');
    } catch (error) {
      console.error('❌ Erro ao salvar no storage:', error);
    }
    
    // Aplicar modificações uma única vez
    console.log('🔄 UPDATE DATA - Aplicando modificações...');
    this.applyModifications();
    
    // Verificar se as modificações foram aplicadas com sucesso
    setTimeout(() => {
      const success = this.checkModificationsSuccess();
      console.log('🔄 UPDATE DATA - Verificação de sucesso:', success);
      
      if (success) {
        console.log('✅ UPDATE DATA - Modificações aplicadas com sucesso!');
      } else {
        console.log('⚠️ UPDATE DATA - Algumas modificações podem não ter sido aplicadas');
        // Tentar aplicar novamente se não foi bem-sucedido
        this.applyModifications();
      }
    }, 300);
    
    console.log('✅ UPDATE DATA - Processo concluído');
  }
}

// Inicializar o modificador de forma otimizada
let dataModifierInstance = null;

function initializeDataModifier() {
  if (!dataModifierInstance) {
    console.log('Inicializando DataModifier...');
    dataModifierInstance = new DataModifier();
    window.dataModifier = dataModifierInstance;
  }
}

// Estratégia de inicialização otimizada
if (document.readyState === 'loading') {
  // Se a página ainda está carregando, aguardar o evento DOMContentLoaded
  document.addEventListener('DOMContentLoaded', initializeDataModifier);
} else if (document.readyState === 'interactive') {
  // Se o DOM está interativo mas não completo, aguardar um pouco
  setTimeout(initializeDataModifier, 100);
} else {
  // Se a página já carregou, inicializar imediatamente
  initializeDataModifier();
}

// Garantir que window.dataModifier esteja sempre disponível
if (!window.dataModifier) {
  console.log('Criando instância de fallback...');
  window.dataModifier = new DataModifier();
}

console.log('✅ DataModifier inicializado:', window.dataModifier);

// Função para criar/remover overlay de loading
function createLoadingOverlay() {
  // Remover overlay existente se houver
  const existingOverlay = document.getElementById('data-modifier-loading-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Criar overlay
  const overlay = document.createElement('div');
  overlay.id = 'data-modifier-loading-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    backdrop-filter: blur(5px);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  `;

  // Conteúdo do loading
  overlay.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    ">
      <div style="
        width: 60px;
        height: 60px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      "></div>
      <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">🔄 Aplicando Modificações</h2>
      <p style="margin: 0; opacity: 0.9; font-size: 16px;">Aguarde enquanto os dados são atualizados...</p>
    </div>
  `;

  // Adicionar CSS para animação
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // Adicionar ao body
  document.body.appendChild(overlay);
  
  return overlay;
}

function removeLoadingOverlay() {
  const overlay = document.getElementById('data-modifier-loading-overlay');
  if (overlay) {
    // Adicionar fade out
    overlay.style.transition = 'opacity 0.5s ease-out';
    overlay.style.opacity = '0';
    
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 500);
  }
}

// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('=== MENSAGEM RECEBIDA NO CONTENT SCRIPT ===');
  console.log('Request:', request);
  console.log('Sender:', sender);
  
  if (request.action === 'updateData') {
    console.log('🔄 Atualizando dados com:', request.data);
    
    // Mostrar overlay de loading
    const loadingOverlay = createLoadingOverlay();
    
    try {
      window.dataModifier.updateData(request.data);
      console.log('✅ Dados atualizados com sucesso');
      
      // Aguardar um pouco antes de remover o loading para garantir que as modificações foram aplicadas
      setTimeout(() => {
        removeLoadingOverlay();
        sendResponse({ success: true, message: 'Dados atualizados' });
      }, 2000);
      
    } catch (error) {
      console.error('❌ Erro ao atualizar dados:', error);
      removeLoadingOverlay();
      sendResponse({ success: false, error: error.message });
    }
  } else if (request.action === 'getData') {
    console.log('📤 Enviando dados para popup:', window.dataModifier.statsData);
    sendResponse({ data: window.dataModifier.statsData });
  } else if (request.action === 'showLoading') {
    console.log('🔄 Mostrando overlay de loading');
    createLoadingOverlay();
    sendResponse({ success: true });
  } else if (request.action === 'hideLoading') {
    console.log('✅ Ocultando overlay de loading');
    removeLoadingOverlay();
    sendResponse({ success: true });
  } else {
    console.log('❓ Ação desconhecida:', request.action);
    sendResponse({ success: false, error: 'Ação desconhecida' });
  }
  
  console.log('=== FIM DA MENSAGEM ===');
  return true; // Manter a conexão aberta para resposta assíncrona
});
