'use client'

import Link from 'next/link'
import React from 'react';
import { useRouter } from "next/navigation";

const LandingPage = () => {

  const router = useRouter();

  const scrollToAbout = () => {
    // Seleciona a seção "Sobre"
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      // Rola suavemente para a seção "Sobre"
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    // Seleciona a seção "Contato"
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      // Rola suavemente para a seção "Contato"
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gray-50">
      <header className="w-full bg-white text-stone-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/Logo_PI.png" alt="Logo" className="h-20" width={80} height={80} />
            <h1 className="text-2xl font-semibold">Portal Pesquisa e Extensão</h1>
          </div>
          <nav className="space-x-4 flex items-center">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/sobre" className="hover:text-gray-300">Sobre</Link>
            <button
              onClick={scrollToContact} 
              className="hover:text-gray-300"
            >
              Contato
            </button>
            <button
              type="button"
              className="text-sm font-semibold text-slate-200 bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      <section className="bg-cover bg-center text-white h-screen" style={{ backgroundImage: "url('/images/aluno estudando.jpeg')" }}>
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
          <div className="text-center">
            <h2 className="text-5xl font-extrabold mb-4">Encontre Oportunidades de Pesquisa e Extensão</h2>
            <p className="text-xl mb-6">Conectando alunos a projetos acadêmicos de pesquisa e extensão nas melhores universidades!</p>
            <button
              onClick={scrollToAbout}  
              className="bg-blue-500 py-2 px-6 text-xl rounded-full hover:bg-yellow-600 transition duration-300"
            >
              Saiba Mais
            </button>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-10">Sobre a Plataforma</h2>
          <p className="text-xl leading-relaxed">
            A busca por oportunidades de projetos de pesquisa e extensão pode ser desafiadora para muitos alunos universitários. Com a grande quantidade de informações espalhadas por diferentes departamentos e universidades, encontrar uma vaga que se alinhe com os interesses acadêmicos e profissionais de cada aluno pode ser uma tarefa difícil e demorada. 
            <br /><br />
            Pensando nisso, criamos o <strong>PPE</strong>, uma plataforma única que reúne em um só lugar as vagas de pesquisa e extensão de diversas universidades. Nosso objetivo é facilitar o acesso dos alunos a essas oportunidades, promover a interação entre alunos e professores e ampliar as possibilidades de desenvolvimento acadêmico e profissional.
          </p>
        </div>
      </section>

      <section id="benefits" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-10">Benefícios para Alunos</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <img src="/images/benefit-1.png" alt="Benefício 1" width={100} height={100} className="mx-auto mb-4"/>
              <h3 className="text-xl font-semibold">Centralização das Vagas</h3>
              <p className="text-lg mt-2">Encontre todas as vagas de pesquisa e extensão em um único lugar, sem precisar visitar dezenas de sites ou entrar em contato com vários departamentos.</p>
            </div>
            <div className="text-center">
              <img src="/images/benefit-2.png" alt="Benefício 2" width={100} height={100} className="mx-auto mb-4"/>
              <h3 className="text-xl font-semibold">Acesso Facilitado</h3>
              <p className="text-lg mt-2">A plataforma é intuitiva e fácil de navegar, permitindo que você filtre e busque oportunidades de acordo com seu curso, área de interesse e disponibilidade.</p>
            </div>
            <div className="text-center">
              <img src="/images/benefit-3.png" alt="Benefício 3" width={100} height={100} className="mx-auto mb-4"/>
              <h3 className="text-xl font-semibold">Oportunidades Diversas</h3>
              <p className="text-lg mt-2">Desde projetos de pesquisa científica até ações de extensão, você encontrará uma ampla gama de oportunidades para desenvolver sua carreira acadêmica e profissional.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-10">Entre em Contato</h2>
          <p className="text-xl text-center mb-6">
            Está interessado em saber mais ou precisa de ajuda para se inscrever em um projeto? Fale conosco e vamos ajudar você a encontrar a melhor oportunidade!
          </p>
          <div className="flex justify-center">
            <a href="mailto:contato@projetovagas.com" className="bg-blue-800 text-white py-3 px-8 rounded-lg text-xl hover:bg-blue-700">Envie um E-mail</a>
          </div>
        </div>
      </section>

      <footer className="bg-blue-800 text-white text-center py-6">
        <p>&copy; 2025 PPE - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
