# Tarefa - Sistema de Gerenciamento de Tarefas

## Descrição

O projeto **Tarefa** é um sistema simples de gerenciamento de tarefas, implementado com uma API RESTful e uma interface gráfica interativa. Ele permite ao usuário adicionar, atualizar, excluir e visualizar tarefas. A aplicação foi desenvolvida utilizando o padrão de arquitetura **MVC** (Model-View-Controller), garantindo uma estrutura organizada e escalável. Os dados das tarefas são persistidos no banco de dados durante a execução da aplicação.

## Funcionalidades

- **Criar Tarefa**: Adicionar uma nova tarefa ao sistema.
- **Atualizar Tarefa**: Alterar título, descrição ou status (pendente/concluída) de uma tarefa existente.
- **Excluir Tarefa**: Remover uma tarefa do sistema.
- **Visualizar Tarefa**: Consultar informações detalhadas de uma tarefa específica.
- **Listar Tarefas**: Exibir todas as tarefas cadastradas, com filtro por nome e descrição.
- **Contar Tarefas**: Obter a quantidade de tarefas que correspondem a um critério de busca.

## Requisitos

1. **Model**: A tarefa deve conter:
   - `Título`
   - `Descrição`
   - `Status` (pendente ou concluída)
2. **View**: Interface simples que permita ao usuário:
   - Adicionar, atualizar e excluir tarefas.
   - Visualizar a lista de tarefas com opções de busca e ordenação.
3. **Controller**: Responsável pela implementação das operações CRUD (Criar, Atualizar, Excluir) nas tarefas.

## Endpoints da API

- **POST** `/tarefas`: Cria uma nova tarefa.
- **POST** `/tarefas/list`: Lista as tarefas com filtro, paginação e ordenação.
- **POST** `/tarefas/count`: Retorna a quantidade total de tarefas com base no filtro aplicado.
- **POST** `/tarefas/select`: Retorna uma lista com os identificadores e nomes de todas as tarefas.
- **GET** `/tarefas/:id`: Retorna os detalhes de uma tarefa específica.
- **PUT** `/tarefas`: Atualiza uma tarefa existente.
- **DELETE** `/tarefas/:id`: Exclui uma tarefa específica.


## Tecnologias Utilizadas

- **Backend**:
  - Node.js
  - Express.js
  - TypeORM
  - PostgreSQL (Banco de Dados)
  - TypeScript
- **Frontend**:
  - React
  - Material UI
  - Axios (para comunicação com a API)
  - TypeScript
- **Outros**:
  - Git para controle de versão
  - Docker (para facilitar a execução em diferentes ambientes)

## Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- PostgreSQL
- Git

### Instalação e Execução

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/tarefa.git
cd tarefa
