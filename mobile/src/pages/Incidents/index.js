//useEffect: carrega uma informação assim que o objeto entra em tela
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
//Touchable opacity: torna qualquer coisa clicável
//e diminui sua opacidade ao clique.
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';

import api from '../../services/api';

//Importa automaticamente a logo no melhor formato
//de acordo com a tela.
import logoImg from '../../assets/logo.png'; 

import styles from './styles';

export default function Incidents(){
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    //Inicia na página 1
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    
    //Similar ao useHistory do web.
    const navigation = useNavigation();

    //Se recebe parametro, pode enviá-lo a pagina destino (detail).
    function navigateToDetail(incident){
        navigation.navigate('Detail', { incident });
    }

    async function loadIncidents(){
        //Evitar que o usuário mande requisição mais de uma vez
        if(loading){
            return;
        }

        //Se o total já tiver carregado e a lista de incidents
        //for igual ao total não precisa buscar mais incidents
        if(total > 0 && incidents.length == total){
            return;
        }

        setLoading(true);
        
        //ou  const response = await api.get(`incidents?page=${page}`);
        const response = await api.get('incidents', {
            params: { page }
        });
        
        //Anexa dois vetores
        setIncidents([... incidents, ... response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false);
    }
    //Função que dispara toda vez que as variáveis nos colchetes mudam
    useEffect(() => {
        loadIncidents();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}> {total} casos </Text>.
                </Text>
            </View>

            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>
            
            {/* Usado sempre (no lugar da view) que se trabalha com listagem de dados */}
            
            <FlatList
                //Array de dados vai montar a lista.
                data={incidents}
                style={styles.incidentList} 
                //Informação única de cada item (necessário que seja string).
                keyExtractor={incident => String(incident.id)}
                //Retira o scroll sem desabilitar a rolagem.
                showsVerticalScrollIndicator={false}
                //Função disparada quando o usuario chega ao final da lista.
                onEndReached={loadIncidents}
                //Indica a quantos porcentos do final da lista o usuario precisa estar
                //para que carregue novos intens.
                //0.2 (20%) - 0.3 (30%) - etc 
                onEndReachedThreshold={0.2}
                //Função responsável por renderizar cada item.
                //item: incident - troca o nome da variavel item por incident.
                renderItem={({item: incident}) => (
                    <View style={styles.incident}>
                        <Text style={styles.incidentProperty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentProperty}>CASO:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={styles.incidentProperty}>VALOR:</Text>
                        <Text style={styles.incidentValue}>
                            {Intl.NumberFormat('pt-BR', { 
                            style:'currency', 
                            currency: 'BRL' })
                            .format(incident.value)}
                        </Text>
                    
                        <TouchableOpacity 
                        style={styles.detailsButton} 
                        //Usa-se arrow function para não chamar imediatamente 
                        onPress={() => navigateToDetail(incident)}
                        >
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name='arrow-right' size={16} color='#E02041' />
                        </TouchableOpacity>
                    </View>
                )}
            />

        </View>   

    );
}