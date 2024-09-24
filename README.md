# EmpreitaAeh - Frontend

Este é o frontend da aplicação **EmpreitAeh**, uma plataforma desenvolvida para otimizar a gestão de empreitadas. O objetivo é fornecer uma interface simples e eficaz para empreiteiros e donos de obras acompanharem o progresso das obras, facilitando a comunicação e o pagamento das etapas concluídas.

## Tecnologias Utilizadas

- **ReactJS**: Biblioteca para construção de interfaces de usuário.
- **Axios**: Cliente HTTP para realizar requisições à API backend.
- **Chakra UI**: Biblioteca de componentes acessíveis e altamente personalizáveis para React.
- **React Router**: Gerenciamento de rotas na aplicação.
- **Context API**: Gerenciamento de estado global da aplicação.

## Desenvolvedores

- [Alysson Pereira](https://github.com/AlyssonP)
- [Vivaldo Vítor](https://github.com/vivaldovitor)
- [Wedson Candido](https://github.com/wedson97)

## Instalação e Execução

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/seuUsuario/empreitAeh-front.git
2. **Instalar Dependências: No diretório do projeto, execute o comando abaixo para instalar todas as dependências necessárias:**:
   ```bash
   npm install
3. **Executar a Aplicação: Execute o servidor de desenvolvimento para rodar a aplicação:**
   ```bash
   npm start
## Configuração do Docker

1. **Construir a Imagem Docker: Construa a imagem Docker do projeto:**
   ```bash
   docker build -t "empreitaehfront" .

2. **Criar e Executar Container: Inicie a aplicação em um ambiente Docker utilizando o ```docker-compose```:**
   ```bash
   docker-compose up -d