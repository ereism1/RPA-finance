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
    <div style={{ padding: '20px' }}>
      <h1>Sistema Financeiro</h1>

      <form onSubmit={cadastrarMovimentacao}>
        <div>
          <label>Data</label>
          <br />
          <input
            type="date"
            value={dataMovimento}
            onChange={(e) => setDataMovimento(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Descrição</label>
          <br />
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Valor</label>
          <br />
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Tipo</label>
          <br />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="RECEITA">Receita</option>
            <option value="DESPESA">Despesa</option>
          </select>
        </div>

        <br />

        

        <button type="submit">
          Cadastrar
        </button>

        <button onClick={executarConciliacao}>
          Conciliar
        </button>

      </form>
    
    <hr />

<h2>Movimentações</h2>

{movimentacoes.map((mov) => (
  <div
    key={mov.id}
    style={{
      border: '1px solid #ccc',
      padding: '10px',
      marginBottom: '10px'
    }}
  >
    <strong>{mov.descricao}</strong>

    <br />

    Valor: R$ {mov.valor}

    <br />

    Tipo: {mov.tipo}

    <br />

    <p>Status: {mov.status}</p>

    <br />

    Data: {new Date(mov.data_movimento).toLocaleDateString()}
  </div>
))}

    </div>

    

  );

  
}



export default App;