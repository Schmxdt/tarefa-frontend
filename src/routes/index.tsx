// routes/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TarefaList from 'pages/tarefa/tarefa/list';
import TarefaForm from 'pages/tarefa/tarefa/form';

const RoutesComponent: React.FC = () => (
  <Routes>
    <Route path="/" element={<TarefaList />} />  
    <Route path="/tarefas" element={<TarefaList />} />  
    <Route path="/tarefas/new" element={<TarefaForm />} />
    <Route path="/tarefas/edit/:id" element={<TarefaForm />} />
  </Routes>
);

export default RoutesComponent;
