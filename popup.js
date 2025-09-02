// Script do popup para gerenciar as modificações
class PopupManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadCurrentData();
    this.bindEvents();
  }

  async loadCurrentData() {
    try {
      // Obter dados atuais da página ativa
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getData' });
        if (response && response.data) {
          this.populateFields(response.data);
        }
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  }

  populateFields(data) {
    // Preencher campos com dados atuais
    if (data.liberado) {
      document.getElementById('liberado-value').value = data.liberado.value;
      document.getElementById('liberado-desc').value = data.liberado.description;
    }
    
    if (data.faturamento) {
      document.getElementById('faturamento-value').value = data.faturamento.value;
      document.getElementById('faturamento-desc').value = data.faturamento.description;
    }
    
    if (data.total) {
      document.getElementById('total-value').value = data.total.value;
      document.getElementById('total-desc').value = data.total.description;
    }

    // Preencher campos de vendas
    if (data.vendas) {
      if (data.vendas.hoje) {
        document.getElementById('vendas-hoje-value').value = data.vendas.hoje.value;
        document.getElementById('vendas-hoje-desc').value = data.vendas.hoje.description;
      }
      if (data.vendas.noMes) {
        document.getElementById('vendas-mes-value').value = data.vendas.noMes.value;
        document.getElementById('vendas-mes-desc').value = data.vendas.noMes.description;
      }
      if (data.vendas.totalHistorico) {
        document.getElementById('vendas-total-value').value = data.vendas.totalHistorico.value;
        document.getElementById('vendas-total-desc').value = data.vendas.totalHistorico.description;
      }
    }

    // Preencher campos de vendas internacionais
    if (data.vendasInternacionais) {
      if (data.vendasInternacionais.hoje) {
        document.getElementById('vendas-int-hoje-value').value = data.vendasInternacionais.hoje.value;
        document.getElementById('vendas-int-hoje-desc').value = data.vendasInternacionais.hoje.description;
      }
      if (data.vendasInternacionais.noMes) {
        document.getElementById('vendas-int-mes-value').value = data.vendasInternacionais.noMes.value;
        document.getElementById('vendas-int-mes-desc').value = data.vendasInternacionais.noMes.description;
      }
      if (data.vendasInternacionais.totalHistorico) {
        document.getElementById('vendas-int-total-value').value = data.vendasInternacionais.totalHistorico.value;
        document.getElementById('vendas-int-total-desc').value = data.vendasInternacionais.totalHistorico.description;
      }
    }

    // Preencher campos dos tops
    if (data.tops) {
      if (data.tops.top1) {
        document.getElementById('top1-value').value = data.tops.top1.value;
        document.getElementById('top1-desc').value = data.tops.top1.description;
        if (data.tops.top1.date) {
          document.getElementById('top1-date').value = data.tops.top1.date;
        }
      }
      if (data.tops.top2) {
        document.getElementById('top2-value').value = data.tops.top2.value;
        document.getElementById('top2-desc').value = data.tops.top2.description;
        if (data.tops.top2.date) {
          document.getElementById('top2-date').value = data.tops.top2.date;
        }
      }
      if (data.tops.top3) {
        document.getElementById('top3-value').value = data.tops.top3.value;
        document.getElementById('top3-desc').value = data.tops.top3.description;
        if (data.tops.top3.date) {
          document.getElementById('top3-date').value = data.tops.top3.date;
        }
      }
    }

    // Preencher campos das projeções
    if (data.projecoes) {
      if (data.projecoes.projecao1) {
        document.getElementById('projecao1-value').value = data.projecoes.projecao1.value;
      }
      if (data.projecoes.projecao2) {
        document.getElementById('projecao2-value').value = data.projecoes.projecao2.value;
      }
      if (data.projecoes.projecao3) {
        document.getElementById('projecao3-value').value = data.projecoes.projecao3.value;
        document.getElementById('projecao3-porcentagem').value = data.projecoes.projecao3.porcentagem;
        document.getElementById('projecao3-cor').value = data.projecoes.projecao3.cor;
        document.getElementById('projecao3-seta').value = data.projecoes.projecao3.setaParaCima.toString();
      }
    }

    // Preencher campos dos assinantes
    if (data.assinantes) {
      if (data.assinantes.total) {
        document.getElementById('assinantes-total-value').value = data.assinantes.total.value;
        document.getElementById('assinantes-total-desc').value = data.assinantes.total.description;
      }
      if (data.assinantes.ativos) {
        document.getElementById('assinantes-ativos-value').value = data.assinantes.ativos.value;
        document.getElementById('assinantes-ativos-desc').value = data.assinantes.ativos.description;
      }
      if (data.assinantes.faturamento) {
        document.getElementById('assinantes-faturamento-value').value = data.assinantes.faturamento.value;
        document.getElementById('assinantes-faturamento-desc').value = data.assinantes.faturamento.description;
      }
    }
  }

  bindEvents() {
    // Botão aplicar modificações
    document.getElementById('apply-btn').addEventListener('click', () => {
      this.applyModifications();
    });

    // Botão restaurar padrão
    document.getElementById('reset-btn').addEventListener('click', () => {
      this.resetToDefault();
    });

    // Enter nos campos para aplicar
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.applyModifications();
        }
      });
    });
  }

  async applyModifications() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        this.showStatus('Erro: Aba não encontrada', 'error');
        return;
      }

      // Mostrar status de carregamento
      this.showStatus('🔄 Aplicando modificações...', 'success');

      // Mostrar loading na página
      await this.showPageLoading();

      // Coletar dados dos campos
      const newData = {
        liberado: {
          value: document.getElementById('liberado-value').value,
          description: document.getElementById('liberado-desc').value
        },
        faturamento: {
          value: document.getElementById('faturamento-value').value,
          description: document.getElementById('faturamento-desc').value
        },
        total: {
          value: document.getElementById('total-value').value,
          description: document.getElementById('total-desc').value
        },
        vendas: {
          hoje: {
            value: document.getElementById('vendas-hoje-value').value,
            description: document.getElementById('vendas-hoje-desc').value
          },
          noMes: {
            value: document.getElementById('vendas-mes-value').value,
            description: document.getElementById('vendas-mes-desc').value
          },
          totalHistorico: {
            value: document.getElementById('vendas-total-value').value,
            description: document.getElementById('vendas-total-desc').value
          }
        },
        vendasInternacionais: {
          hoje: {
            value: document.getElementById('vendas-int-hoje-value').value,
            description: document.getElementById('vendas-int-hoje-desc').value
          },
          noMes: {
            value: document.getElementById('vendas-int-mes-value').value,
            description: document.getElementById('vendas-int-mes-desc').value
          },
          totalHistorico: {
            value: document.getElementById('vendas-int-total-value').value,
            description: document.getElementById('vendas-int-total-desc').value
          }
        },
        tops: {
          top1: {
            value: document.getElementById('top1-value').value,
            description: document.getElementById('top1-desc').value,
            date: document.getElementById('top1-date').value
          },
          top2: {
            value: document.getElementById('top2-value').value,
            description: document.getElementById('top2-desc').value,
            date: document.getElementById('top2-date').value
          },
          top3: {
            value: document.getElementById('top3-value').value,
            description: document.getElementById('top3-desc').value,
            date: document.getElementById('top3-date').value
          }
        },
        projecoes: {
          projecao1: {
            value: document.getElementById('projecao1-value').value,
            description: 'Total',
            porcentagem: '',
            cor: 'black',
            setaParaCima: true
          },
          projecao2: {
            value: document.getElementById('projecao2-value').value,
            description: 'Média Dia',
            porcentagem: '',
            cor: 'black',
            setaParaCima: true
          },
          projecao3: {
            value: document.getElementById('projecao3-value').value,
            description: 'Projeção',
            porcentagem: document.getElementById('projecao3-porcentagem').value,
            cor: document.getElementById('projecao3-cor').value,
            setaParaCima: document.getElementById('projecao3-seta').value === 'true'
          }
        },
        assinantes: {
          total: {
            value: document.getElementById('assinantes-total-value').value,
            description: document.getElementById('assinantes-total-desc').value
          },
          ativos: {
            value: document.getElementById('assinantes-ativos-value').value,
            description: document.getElementById('assinantes-ativos-desc').value
          },
          faturamento: {
            value: document.getElementById('assinantes-faturamento-value').value,
            description: document.getElementById('assinantes-faturamento-desc').value
          }
        }
      };

      console.log('Dados coletados dos campos:', newData);

      // Validar dados
      if (!this.validateData(newData)) {
        this.showStatus('Erro: Dados inválidos', 'error');
        return;
      }

      // Enviar dados para a página
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'updateData',
        data: newData
      });

      if (response && response.success) {
        this.showStatus('✅ Dados aplicados com sucesso!', 'success');
        
        // Salvar no storage local também
        chrome.storage.local.set({ statsData: newData });
        
        // Aguardar o loading terminar antes de fechar o popup
        setTimeout(() => {
          this.showStatus('✅ Modificações concluídas! Fechando...', 'success');
          
          // Fechar popup após mais 1 segundo
          setTimeout(() => {
            window.close();
          }, 1000);
        }, 2000);
      } else {
        this.showStatus('Erro ao aplicar modificações', 'error');
      }

    } catch (error) {
      console.log('Erro ao aplicar modificações:', error);
      this.showStatus('Erro: Verifique se a página está carregada', 'error');
      
      // Ocultar loading em caso de erro
      await this.hidePageLoading();
    }
  }

  validateData(data) {
    console.log('Validando dados:', data);
    
    // Validar dados financeiros
    if (!data.liberado || !data.liberado.value || !data.liberado.description) {
      console.log('Erro: dados liberado inválidos:', data.liberado);
      return false;
    }
    
    if (!data.faturamento || !data.faturamento.value || !data.faturamento.description) {
      console.log('Erro: dados faturamento inválidos:', data.faturamento);
      return false;
    }
    
    if (!data.total || !data.total.value || !data.total.description) {
      console.log('Erro: dados total inválidos:', data.total);
      return false;
    }
    
    // Validar dados de vendas
    if (!data.vendas) {
      console.log('Erro: dados vendas não encontrados');
      return false;
    }
    
    if (!data.vendas.hoje || !data.vendas.hoje.value || !data.vendas.hoje.description) {
      console.log('Erro: dados vendas hoje inválidos:', data.vendas.hoje);
      return false;
    }
    
    if (!data.vendas.noMes || !data.vendas.noMes.value || !data.vendas.noMes.description) {
      console.log('Erro: dados vendas no mês inválidos:', data.vendas.noMes);
      return false;
    }
    
    if (!data.vendas.totalHistorico || !data.vendas.totalHistorico.value || !data.vendas.totalHistorico.description) {
      console.log('Erro: dados vendas total histórico inválidos:', data.vendas.totalHistorico);
      return false;
    }

    // Validar dados de vendas internacionais
    if (!data.vendasInternacionais) {
      console.log('Erro: dados vendas internacionais não encontrados');
      return false;
    }
    
    if (!data.vendasInternacionais.hoje || !data.vendasInternacionais.hoje.value || !data.vendasInternacionais.hoje.description) {
      console.log('Erro: dados vendas internacionais hoje inválidos:', data.vendasInternacionais.hoje);
      return false;
    }
    
    if (!data.vendasInternacionais.noMes || !data.vendasInternacionais.noMes.value || !data.vendasInternacionais.noMes.description) {
      console.log('Erro: dados vendas internacionais no mês inválidos:', data.vendasInternacionais.noMes);
      return false;
    }
    
    if (!data.vendasInternacionais.totalHistorico || !data.vendasInternacionais.totalHistorico.value || !data.vendasInternacionais.totalHistorico.description) {
      console.log('Erro: dados vendas internacionais total histórico inválidos:', data.vendasInternacionais.totalHistorico);
      return false;
    }

    // Validar dados dos tops
    if (!data.tops) {
      console.log('Erro: dados tops não encontrados');
      return false;
    }
    
    if (!data.tops.top1 || !data.tops.top1.value || !data.tops.top1.description || !data.tops.top1.date) {
      console.log('Erro: dados top 1 inválidos:', data.tops.top1);
      return false;
    }
    
    if (!data.tops.top2 || !data.tops.top2.value || !data.tops.top2.description || !data.tops.top2.date) {
      console.log('Erro: dados top 2 inválidos:', data.tops.top2);
      return false;
    }
    
    if (!data.tops.top3 || !data.tops.top3.value || !data.tops.top3.description || !data.tops.top3.date) {
      console.log('Erro: dados top 3 inválidos:', data.tops.top3);
      return false;
    }

    // Validar dados das projeções
    if (!data.projecoes) {
      console.log('Erro: dados projeções não encontrados');
      return false;
    }
    
    if (!data.projecoes.projecao1 || !data.projecoes.projecao1.value || !data.projecoes.projecao1.description) {
      console.log('Erro: dados projeção 1 inválidos:', data.projecoes.projecao1);
      return false;
    }
    
    if (!data.projecoes.projecao2 || !data.projecoes.projecao2.value || !data.projecoes.projecao2.description) {
      console.log('Erro: dados projeção 2 inválidos:', data.projecoes.projecao2);
      return false;
    }
    
    if (!data.projecoes.projecao3 || !data.projecoes.projecao3.value || !data.projecoes.projecao3.porcentagem || !data.projecoes.projecao3.cor || data.projecoes.projecao3.setaParaCima === undefined) {
      console.log('Erro: dados projeção 3 inválidos:', data.projecoes.projecao3);
      return false;
    }

    // Validar dados dos assinantes
    if (!data.assinantes) {
      console.log('Erro: dados assinantes não encontrados');
      return false;
    }
    
    if (!data.assinantes.total || !data.assinantes.total.value || !data.assinantes.total.description) {
      console.log('Erro: dados assinantes total inválidos:', data.assinantes.total);
      return false;
    }
    
    if (!data.assinantes.ativos || !data.assinantes.ativos.value || !data.assinantes.ativos.description) {
      console.log('Erro: dados assinantes ativos inválidos:', data.assinantes.ativos);
      return false;
    }
    
    if (!data.assinantes.faturamento || !data.assinantes.faturamento.value || !data.assinantes.faturamento.description) {
      console.log('Erro: dados assinantes faturamento inválidos:', data.assinantes.faturamento);
      return false;
    }
    
    console.log('✅ Todos os dados são válidos');
    return true;
  }

  resetToDefault() {
    const defaultData = {
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

    this.populateFields(defaultData);
    this.showStatus('🔄 Valores restaurados ao padrão', 'success');
  }

  showStatus(message, type = 'success') {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    
    // Limpar status após 3 segundos
    setTimeout(() => {
      statusElement.textContent = '';
      statusElement.className = 'status';
    }, 3000);
  }

  // Função para mostrar loading na página
  async showPageLoading() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.tabs.sendMessage(tab.id, { action: 'showLoading' });
      }
    } catch (error) {
      console.log('Erro ao mostrar loading:', error);
    }
  }

  // Função para ocultar loading na página
  async hidePageLoading() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.tabs.sendMessage(tab.id, { action: 'hideLoading' });
      }
    } catch (error) {
      console.log('Erro ao ocultar loading:', error);
    }
  }
}

// Inicializar o gerenciador quando o popup carregar
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
