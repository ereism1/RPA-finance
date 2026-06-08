import { useEffect,useState } from 'react';
import api from './services/api';

function App() {

  const [dataMovimento, setDataMovimento] = useState([]);
  const [descricao, setDescricao] = useState([]);
  const [valor, setValor] = useState([]);
  const [tipo, setTipo] = useState('RECEITA');
  const [movimentacoes, setMovimentacoes] = useState([]);

  const cadastrarMovimentacao = async (e) => {

  e.preventDefault();

  try {

    await api.post('/movimentacoes', {
      data_movimento: dataMovimento,
      descricao,
      valor,
      tipo
    });


    await carregarMovimentacoes();


    alert('Movimentação cadastrada!');

    setDataMovimento('');
    setDescricao('');
    setValor('');
    setTipo('RECEITA');

  } catch (error) {

    console.error(error);

    alert('Erro ao cadastrar');

  }

};

const carregarMovimentacoes = async () => {

  try {

    const response = await api.get('/movimentacoes');

    setMovimentacoes(response.data);

  } catch (error) {

    console.error(error);

  }

};

useEffect(() => {
  carregarMovimentacoes();
}, []);


   const executarConciliacao = async () => {

  try {

    await api.post('/conciliar');

    await carregarMovimentacoes();

    alert('Conciliação concluída');

  } catch (error) {

    console.error(error);

    alert('Erro ao conciliar');

  }

};


return (
  <div
    style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      fontFamily: 'Arial, sans-serif'
    }}
  >
    <div
      style={{
        background: '#1f2937',
        color: 'white',
        padding: '20px 40px'
      }}
    >
      <h1 style={{ margin: 0 }}>
        💰 RPA Financeiro
      </h1>

      <p
        style={{
          marginTop: '5px',
          opacity: 0.8
        }}
      >
        Automação de Conciliação Bancária
      </p>
    </div>

    <div
      style={{
        maxWidth: '1200px',
        margin: '30px auto',
        padding: '0 20px'
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}
      >
        <h2>Nova Movimentação</h2>

        <form onSubmit={cadastrarMovimentacao}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}
          >
            <div>
              <label>Data</label>

              <input
                type="date"
                value={dataMovimento}
                onChange={(e) => setDataMovimento(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  marginTop: '5px'
                }}
              />
            </div>

            <div>
              <label>Descrição</label>

              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  marginTop: '5px'
                }}
              />
            </div>

            <div>
              <label>Valor</label>

              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  marginTop: '5px'
                }}
              />
            </div>

            <div>
              <label>Tipo</label>

              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  marginTop: '5px'
                }}
              >
                <option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px'
            }}
          >
            <button
              type="submit"
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cadastrar
            </button>

            <button
              type="button"
              onClick={executarConciliacao}
              style={{
                background: '#059669',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Conciliar
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <h2>Movimentações</h2>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#f3f4f6'
              }}
            >
              <th style={{ padding: '12px', textAlign: 'left' }}>
                Data
              </th>

              <th style={{ padding: '12px', textAlign: 'left' }}>
                Descrição
              </th>

              <th style={{ padding: '12px', textAlign: 'left' }}>
                Valor
              </th>

              <th style={{ padding: '12px', textAlign: 'left' }}>
                Tipo
              </th>

              <th style={{ padding: '12px', textAlign: 'left' }}>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {movimentacoes.map((mov) => (
              <tr
                key={mov.id}
                style={{
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                <td style={{ padding: '12px' }}>
                  {new Date(
                    mov.data_movimento
                  ).toLocaleDateString()}
                </td>

                <td style={{ padding: '12px' }}>
                  {mov.descricao}
                </td>

                <td style={{ padding: '12px' }}>
                  {Number(mov.valor).toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL'
                    }
                  )}
                </td>

                <td style={{ padding: '12px' }}>
                  {mov.tipo}
                </td>

                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      color: 'white',
                      fontWeight: 'bold',
                      backgroundColor:
                        mov.status === 'CONCILIADO'
                          ? '#16a34a'
                          : mov.status === 'DIVERGENTE'
                          ? '#dc2626'
                          : '#ca8a04'
                    }}
                  >
                    {mov.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
export default App;