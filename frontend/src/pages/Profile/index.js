import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg'; 

export default function Profile(){
    
    const [incidents, setIncidents] = useState([]);

    //Pega-se o valor armazenado globalmente pelo navegador
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    const history = useHistory();

    //Dispara uma função em um determinado momento do componente
    //1 parametro: função a ser executada.
    //2 parametro: array de dependencia em que quando um das informações
    //presentes for mudada, a função será executada de novo.
    //Se o array for deixado vazio a função só será executada uma vez.
    useEffect(() => {
        api.get('/profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

    async function handleDeleteIncident(id){
        try{
            await api.delete(`incidents/${id}`,{
                headers: {
                    Authorization: ongId,
                }
            });
            /*Filtra a lista de incidents mantendo apenas aqueles
            com id diferente do com id deletado*/
            setIncidents(incidents.filter(incident => incident.id !== id));
        }catch(Err){
            alert('Erro ao deletar caso.')
        }
    }

    function handleLogout(){
        //Limpa o localStorage
        localStorage.clear();
        //Redireciona a home
        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero"/>
                <span>Bem-vinda, {ongName} </span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
                {/*Percorre todos os incidentes e retorna algo*/}
                {/*Ao usar uma repetição é necessário colorcar uma key
                no primeiro elemento que vem no map com uma valor único para cada 
                (neste caso, o li) para que os itens sejam indentificados para 
                possíveis deleções, alterações, troca de posições, etc.*/}
                {incidents.map(incident => (
                <li key={incident.id}>
                    <strong>CASO:</strong>
                    <p>{incident.title}</p>

                    <strong>DESCRIÇÃO:</strong>
                    <p>{incident.description}</p>

                    <strong>VALOR:</strong>
                    <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>
                    
                    {/* Não se pode passar a função handleDeleteIncident(incident.id)
                    diretamente, pois ela seria executada assim que cada componente for mostrado,
                    ou seja, todos os incidents seriam excluídos.
                    Dessa forma, convertemos em uma arrow function para termos uma
                    função como parâmetro ao invés do retorno de uma.*/}
                    <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
                ))}
            </ul>

        </div>
    );
}
