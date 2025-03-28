import React, { useState } from "react";

const estados = {
  inicio: {
    descricao: "Você está em uma floresta densa. Há uma trilha ao norte e um caminho ao sul.",
    imagem: "/images/floresta_inicio.jpg",
    transicoes: [
      { texto: "Seguir ao norte", proximo: "caverna", probabilidade: 0.6 },
      { texto: "Seguir ao sul", proximo: "rio", probabilidade: 0.4 }
    ]
  },
  caverna: {
    descricao: "Você encontra uma caverna escura. Algo se move lá dentro.",
    imagem: "/images/caverna.jpg",
    transicoes: [
      { texto: "Entrar na caverna", proximo: "monstro", probabilidade: 0.5 },
      { texto: "Contornar a caverna", proximo: "vilarejo", probabilidade: 0.5 }
    ]
  },
  rio: {
    descricao: "Você chegou a um rio com correnteza forte.",
    imagem: "/images/rio.jpg",
    transicoes: [
      { texto: "Tentar atravessar", proximo: "cachoeira", probabilidade: 0.3 },
      { texto: "Seguir a margem", proximo: "ponte", probabilidade: 0.7 }
    ]
  },
  cachoeira: {
    descricao: "Você é arrastado pela correnteza e cai de uma cachoeira!",
    imagem: "/images/cachoeira.jpg",
    transicoes: [
      { texto: "Tentar nadar para a margem", proximo: "floresta_densa", probabilidade: 0.7 },
      { texto: "Deixar a correnteza te levar", proximo: "vilarejo", probabilidade: 0.3 }
    ]
  },
  monstro: {
    descricao: "Um monstro aparece! Você tenta fugir.",
    imagem: "/images/monstro.png",
    transicoes: [
      { texto: "Lutar", proximo: "derrota", probabilidade: 0.7 },
      { texto: "Correr", proximo: "inicio", probabilidade: 0.3 }
    ]
  },
  vilarejo: {
    descricao: "Você encontrou um pequeno vilarejo com pessoas amigáveis.",
    imagem: "/images/vilarejo.png",
    transicoes: [
      { texto: "Explorar o vilarejo", proximo: "mercado", probabilidade: 0.6 },
      { texto: "Descansar na pousada", proximo: "descanso", probabilidade: 0.4 }
    ]
  },
  mercado: {
    descricao: "O mercado do vilarejo tem vários itens úteis para sua jornada.",
    imagem: "/images/mercado.jpg",
    transicoes: [
      { texto: "Comprar suprimentos", proximo: "suprimentos", probabilidade: 0.6 },
      { texto: "Desafio misterioso", proximo: "criatura", probabilidade: 0.4 }
    ]
  },
  suprimentos: {
    descricao: "Você conseguiu suprimentos essenciais para continuar sua aventura!",
    imagem: "/images/suprimentos.jpg",
    transicoes: [
      { texto: "Seguir viagem", proximo: "clareira", probabilidade: 0.6 },
      { texto: "Explorar o vilarejo", proximo: "criatura", probabilidade: 0.4 }
    ]
  },
  // Adicionando mais estados...
  ponte: {
    descricao: "Uma velha ponte de madeira cruza o rio. Parece frágil...",
    imagem: "/images/ponte.png",
    transicoes: [
      { texto: "Atravessar com cuidado", proximo: "floresta_densa", probabilidade: 0.7 },
      { texto: "Correr pela ponte", proximo: "ponte_quebra", probabilidade: 0.3 }
    ]
  },
  ponte_quebra: {
    descricao: "A ponte não aguenta o peso e quebra! Você cai na água gelada.",
    imagem: "/images/queda.png",
    transicoes: [
      { texto: "Tentar nadar para a margem", proximo: "floresta_densa", probabilidade: 0.6 },
      { texto: "Deixar a correnteza te levar", proximo: "cachoeira", probabilidade: 0.4 }
    ]
  },
  floresta_densa: {
    descricao: "A floresta fica cada vez mais fechada. Sons estranhos ecoam...",
    imagem: "/images/floresta_densa.jpg",
    transicoes: [
      { texto: "Seguir um barulho", proximo: "criatura", probabilidade: 0.5 },
      { texto: "Procurar um abrigo", proximo: "cabana", probabilidade: 0.5 }
    ]
  },
  criatura: {
    descricao: "Uma criatura sombria surge das sombras! Você congela de medo.",
    imagem: "/images/criatura.png",
    transicoes: [
      { texto: "Tentar fugir", proximo: "inicio", probabilidade: 0.6 },
      { texto: "Enfrentar a criatura", proximo: "derrota", probabilidade: 0.4 }
    ]
  },
  cabana: {
    descricao: "Você encontra uma cabana abandonada. Parece segura por enquanto...",
    imagem: "/images/cabana.jpg",
    transicoes: [
      { texto: "Procurar suprimentos", proximo: "suprimentos", probabilidade: 0.7 },
      { texto: "Continuar a jornada", proximo: "clareira", probabilidade: 0.3 }
    ]
  },
  // Estados finais
  derrota: {
    descricao: "Infelizmente sua jornada termina aqui...",
    imagem: "/images/gameover.png",
    transicoes: [
      { texto: "Reiniciar", proximo: "inicio", probabilidade: 1.0 }
    ]
  },
  descanso: {
    descricao: "Você descansou e recuperou energia para continuar sua jornada.",
    imagem: "/images/descanso.png",
    transicoes: [
      { texto: "Seguir viagem", proximo: "clareira", probabilidade: 0.6 },
      { texto: "Dormir mais um pouco", proximo: "criatura", probabilidade: 0.4 }
    ]
  },
  clareira: {
    descricao: "Você finalmente sai da floresta e encontra uma bela clareira! Parabéns!",
    imagem: "/images/vitoria.png",
    transicoes: [
      { texto: "Reiniciar", proximo: "inicio", probabilidade: 1.0 }
    ]
  }
};

const escolherProximoEstado = (transicoes) => {
  let random = Math.random(); // Gera um número entre 0 e 1
  let acumulado = 0;
  for (const transicao of transicoes) {
    acumulado += transicao.probabilidade;
    if (random <= acumulado) {
      return transicao.proximo;
    }
  }
  return transicoes[transicoes.length - 1].proximo; // Garantia de que sempre haverá um estado
};

const Aventura = () => {
  const [estadoAtual, setEstadoAtual] = useState("inicio");
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Aventura na Floresta</h1>
      <img src={estados[estadoAtual].imagem} alt="Cenário" style={{ width: "80%", maxWidth: "500px", borderRadius: "10px" }} />
      <p>{estados[estadoAtual].descricao}</p>
      {estados[estadoAtual].transicoes.map((transicao, index) => (
        <button key={index} onClick={() => setEstadoAtual(escolherProximoEstado(estados[estadoAtual].transicoes))} style={{ margin: "5px", padding: "10px 20px" }}>
          {transicao.texto}
        </button>
      ))}<button 
      onClick={() => setMostrarInfo(!mostrarInfo)}
      style={{ position: "absolute", top: "10px", right: "10px", padding: "5px 10px" }}>
      ℹ️
    </button>
    {mostrarInfo && (
      <div style={{ position: "absolute", top: "50px", right: "10px", background: "white", padding: "10px", border: "1px solid black", borderRadius: "5px" }}>
        <p>Este jogo foi criado usando React e JavaScript. Utilizamos um modelo de decisão baseado em probabilidades para determinar o fluxo da história.</p>
        <button onClick={() => setMostrarInfo(false)}>Fechar</button>
      </div>
    )}
    </div>
  );
};

export default Aventura;
