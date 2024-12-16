'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Para navegação após o envio
import { ToastContainer, toast } from 'react-toastify'; // Para notificações
import 'react-toastify/dist/ReactToastify.css';

export default function CriarVaga() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [bolsa, setBolsa] = useState(0); // 0: Sem Bolsa, 1: Com Bolsa
  const [bolsaValor, setBolsaValor] = useState('');
  const [tipo, setTipo] = useState(0); // 0: Pesquisa, 1: Extensão
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Configura o valor de bolsa_valor, considerando se há bolsa
    const bolsaValorFinal = bolsa === 0 ? null : Number(bolsaValor);


    try {
      // Envia os dados para o backend
      const response = await axios.post(
        'http://127.0.0.1:5000/PROFESSOR/CREATE/VAGA',
        {
          nome,
          descricao,
          bolsa,
          bolsa_valor: bolsaValorFinal,
          tipo,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, 
        }
      );

      // Caso o backend retorne sucesso, exibe notificação
      if (response.status === 201) {
        toast.success('Vaga criada com sucesso!');
        router.push('/professor'); // Redireciona para a página inicial do professor
      }
    } catch (error) {
      // Notifica em caso de erro
      toast.error('Erro ao criar a vaga!');
      console.error(error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Criar Vaga</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome da Vaga:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome da vaga"
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva a vaga"
            required
          />
        </div>
        <div>
          <label>Bolsa:</label>
          <select value={bolsa} onChange={(e) => setBolsa(Number(e.target.value))}>
            <option value={0}>Sem Bolsa</option>
            <option value={1}>Com Bolsa</option>
          </select>
        </div>
        {bolsa === 1 && (
          <div>
            <label>Valor da Bolsa:</label>
            <input
              type="number"
              value={bolsaValor}
              onChange={(e) => setBolsaValor(e.target.value)}
              placeholder="Digite o valor da bolsa"
              required
            />
          </div>
        )}
        <div>
          <label>Tipo da Vaga:</label>
          <select value={tipo} onChange={(e) => setTipo(Number(e.target.value))}>
            <option value={0}>Pesquisa</option>
            <option value={1}>Extensão</option>
          </select>
        </div>
        <button type="submit">Criar Vaga</button>
      </form>
    </div>
  );
}
