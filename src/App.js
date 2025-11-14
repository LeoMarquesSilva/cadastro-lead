import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    solicitante: '',
    email: '',
    cadastrado_por: '',
    due_diligence: '',
    prazo_reuniao_due: '',
    horario_due: '',
    razao_social_cnpj: [{ razao_social: '', cnpj: '' }],
    areas_analise: [],
    local_reuniao: '',
    data_reuniao: '',
    horario_reuniao: '',
    tipo_de_lead: '',
    indicacao: '',
    nome_indicacao: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para formatar data para o formato brasileiro
  const formatarDataBrasileira = (dataISO) => {
    if (!dataISO || dataISO === 'A definir') {
      return dataISO;
    }
    const data = new Date(dataISO + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
  };

  // Função para enviar webhook
  const enviarWebhook = async (dados) => {
    const webhook_urls = [
      "http://212.85.2.227/webhook/cadastro-lead2",
      "http://212.85.2.227:3000/webhook/cadastro-lead2",
      "https://ia-n8n.a8fvaf.easypanel.host/webhook/cadastro-lead2"
    ];

    console.log("=== TENTATIVA WEBHOOK (SSL com problema) ===");
    
    for (const url of webhook_urls) {
      try {
        console.log(`Tentando: ${url}`);
        
        const response = await axios.post(url, dados, {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'React-Webhook-Client/1.0'
          }
        });
        
        console.log(`✅ Webhook sucesso com: ${url}`);
        return true;
      } catch (error) {
        console.log(`❌ Falhou ${url}:`, error.message);
      }
    }
    
    console.log("❌ Todos os webhooks falharam - problema no servidor N8N");
    return false;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'areas_analise') {
        setFormData(prev => ({
          ...prev,
          areas_analise: checked 
            ? [...prev.areas_analise, value]
            : prev.areas_analise.filter(area => area !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRazaoSocialChange = (index, field, value) => {
    const newRazaoSocial = [...formData.razao_social_cnpj];
    newRazaoSocial[index][field] = value;
    setFormData(prev => ({
      ...prev,
      razao_social_cnpj: newRazaoSocial
    }));
  };

  const addRazaoSocial = () => {
    setFormData(prev => ({
      ...prev,
      razao_social_cnpj: [...prev.razao_social_cnpj, { razao_social: '', cnpj: '' }]
    }));
  };

  const removeRazaoSocial = (index) => {
    if (formData.razao_social_cnpj.length > 1) {
      const newRazaoSocial = formData.razao_social_cnpj.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        razao_social_cnpj: newRazaoSocial
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Prepara os dados para envio
      const dadosParaEnvio = {
        id: Date.now().toString(), // ID único baseado em timestamp
        solicitante: formData.solicitante,
        email: formData.email,
        cadastrado_por: formData.cadastrado_por,
        razao_social_cnpj: formData.razao_social_cnpj,
        prazo_reuniao_due: formData.prazo_reuniao_due ? formatarDataBrasileira(formData.prazo_reuniao_due) : 'A definir',
        horario_due: formData.horario_due || 'A definir',
        data_reuniao: formData.data_reuniao ? formatarDataBrasileira(formData.data_reuniao) : 'A definir',
        horario_reuniao: formData.horario_reuniao || 'A definir',
        local_reuniao: formData.local_reuniao,
        indicacao: formData.indicacao,
        nome_indicacao: formData.nome_indicacao,
        tipo_de_lead: formData.tipo_de_lead,
        areas_analise: formData.areas_analise,
        due_diligence: formData.due_diligence,
        timestamp: new Date().toLocaleString('pt-BR')
      };

      // Salva no localStorage como backup
      const dadosExistentes = JSON.parse(localStorage.getItem('leads') || '[]');
      dadosExistentes.push(dadosParaEnvio);
      localStorage.setItem('leads', JSON.stringify(dadosExistentes));

      // Tenta enviar para o webhook
      const webhookSucesso = await enviarWebhook(dadosParaEnvio);

      if (webhookSucesso) {
        setMessage('Lead cadastrado com sucesso e enviado para o webhook!');
        setMessageType('success');
      } else {
        setMessage('Lead cadastrado com sucesso, mas houve problema no envio para o webhook. Dados salvos localmente.');
        setMessageType('success');
      }

      // Limpa o formulário
      setFormData({
        solicitante: '',
        email: '',
        cadastrado_por: '',
        due_diligence: '',
        prazo_reuniao_due: '',
        horario_due: '',
        razao_social_cnpj: [{ razao_social: '', cnpj: '' }],
        areas_analise: [],
        local_reuniao: '',
        data_reuniao: '',
        horario_reuniao: '',
        tipo_de_lead: '',
        indicacao: '',
        nome_indicacao: ''
      });

    } catch (error) {
      console.error('Erro no processamento:', error);
      setMessage('Ocorreu um erro ao cadastrar o lead. Tente novamente.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>Sistema de Cadastro de Leads</h1>
        </div>
      </header>

      <main>
        <section className="section-padding">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="subtitle text-center mb-5">
                  <h2>Cadastro de Lead</h2>
                  <p>Preencha o formulário abaixo para cadastrar um novo Lead.</p>
                </div>

                {message && (
                  <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="row">
                    {/* Solicitante */}
                    <div className="col-md-12 mb-4">
                      <div className="form-group">
                        <label className="form-label">Solicitante</label>
                        <input
                          type="text"
                          name="solicitante"
                          className="form-control"
                          value={formData.solicitante}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* E-mail */}
                    <div className="col-md-12 mb-4">
                      <div className="form-group">
                        <label className="form-label">E-mail do Solicitante</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Cadastrado por */}
                    <div className="col-md-12 mb-4">
                      <div className="form-group">
                        <label className="form-label">Cadastro realizado por (e-mail)</label>
                        <input
                          type="email"
                          name="cadastrado_por"
                          className="form-control"
                          value={formData.cadastrado_por}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Due Diligence */}
                    <div className="col-md-12 mb-4">
                      <label className="form-label">Haverá Due Diligence?</label>
                      <div className="radio-group">
                        <label>
                          <input
                            type="radio"
                            name="due_diligence"
                            value="Sim"
                            checked={formData.due_diligence === 'Sim'}
                            onChange={handleInputChange}
                            required
                          />
                          Sim
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="due_diligence"
                            value="Não"
                            checked={formData.due_diligence === 'Não'}
                            onChange={handleInputChange}
                          />
                          Não
                        </label>
                      </div>
                    </div>

                    {/* Campos condicionais para Due Diligence */}
                    <div className={`reuniao-fields ${formData.due_diligence === 'Sim' ? 'show' : ''}`}>
                      <div className="col-md-12 mb-4">
                        <div className="form-group">
                          <label className="form-label">Prazo de Entrega da Due</label>
                          <input
                            type="date"
                            name="prazo_reuniao_due"
                            className="form-control"
                            value={formData.prazo_reuniao_due}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 mb-4">
                        <div className="form-group">
                          <label className="form-label">Horário de Entrega da Due</label>
                          <input
                            type="time"
                            name="horario_due"
                            className="form-control"
                            value={formData.horario_due}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Razão Social e CNPJ/CPF */}
                    <div className="col-md-12 mb-4">
                      <label className="form-label">Razão Social / Nome Completo e CNPJ/CPF</label>
                      {formData.razao_social_cnpj.map((item, index) => (
                        <div key={index} className="razao-cnpj-group">
                          <div className="form-group">
                            <label className="form-label">Razão Social / Nome Completo</label>
                            <input
                              type="text"
                              className="form-control"
                              value={item.razao_social}
                              onChange={(e) => handleRazaoSocialChange(index, 'razao_social', e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">CNPJ/CPF</label>
                            <input
                              type="text"
                              className="form-control"
                              value={item.cnpj}
                              onChange={(e) => handleRazaoSocialChange(index, 'cnpj', e.target.value)}
                              required
                            />
                          </div>
                          {formData.razao_social_cnpj.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => removeRazaoSocial(index)}
                            >
                              Remover
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addRazaoSocial}
                      >
                        Adicionar Razão Social/Nome Completo e CNPJ/CPF
                      </button>
                    </div>

                    {/* Áreas de Análise */}
                    <div className="col-md-12 mb-4">
                      <label className="form-label">Áreas Envolvidas</label>
                      <div className="checkbox-group">
                        {['Cível', 'Reestruturação', 'Tributário', 'Trabalhista', 'Distressed Deals', 'Societário e Contratos'].map(area => (
                          <label key={area}>
                            <input
                              type="checkbox"
                              name="areas_analise"
                              value={area}
                              checked={formData.areas_analise.includes(area)}
                              onChange={handleInputChange}
                            />
                            {area}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Local da Reunião */}
                    <div className="col-md-12 mb-4">
                      <div className="form-group">
                        <label className="form-label">Local da Reunião</label>
                        <input
                          type="text"
                          name="local_reuniao"
                          className="form-control"
                          value={formData.local_reuniao}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Data da Reunião */}
                    <div className="col-md-12 mb-4">
                      <div className="form-group">
                        <label className="form-label">Data da Reunião</label>
                        <input
                          type="date"
                          name="data_reuniao"
                          className="form-control"
                          value={formData.data_reuniao}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Horário da Reunião */}
                    <div className="col-md-12 mb-4">
                      <div className="form-group">
                        <label className="form-label">Horário da Reunião</label>
                        <input
                          type="time"
                          name="horario_reuniao"
                          className="form-control"
                          value={formData.horario_reuniao}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Tipo de Lead */}
                    <div className="col-md-12 mb-4">
                      <div className="form-group">
                        <label className="form-label">Tipo de Lead</label>
                        <select
                          name="tipo_de_lead"
                          className="form-control"
                          value={formData.tipo_de_lead}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione uma opção</option>
                          <option value="Indicação">Indicação</option>
                          <option value="Lead Ativa">Lead Ativa</option>
                          <option value="Lead Digital">Lead Digital</option>
                          <option value="Lead Passiva">Lead Passiva</option>
                        </select>
                      </div>
                    </div>

                    {/* Campos condicionais para Indicação */}
                    <div className={`indicacao-field ${formData.tipo_de_lead === 'Indicação' ? 'show' : ''}`}>
                      <div className="col-md-6 mb-4">
                        <div className="form-group">
                          <label className="form-label">Indicação</label>
                          <select
                            name="indicacao"
                            className="form-control"
                            value={formData.indicacao}
                            onChange={handleInputChange}
                            required={formData.tipo_de_lead === 'Indicação'}
                          >
                            <option value="">Selecione uma opção</option>
                            <option value="Fundo">Fundo</option>
                            <option value="Consultor">Consultor</option>
                            <option value="Cliente">Cliente</option>
                            <option value="Contador">Contador</option>
                            <option value="Sindicatos">Sindicatos</option>
                            <option value="Conselhos profissionais">Conselhos profissionais</option>
                            <option value="Colaborador">Colaborador</option>
                            <option value="Outros parceiros">Outros parceiros</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="form-group">
                          <label className="form-label">Nome da Indicação</label>
                          <input
                            type="text"
                            name="nome_indicacao"
                            className="form-control"
                            value={formData.nome_indicacao}
                            onChange={handleInputChange}
                            required={formData.tipo_de_lead === 'Indicação'}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Botão de Submit */}
                    <div className="col-md-12 mb-4">
                      <button
                        type="submit"
                        className="btn btn-submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Enviando...' : 'Cadastrar'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;