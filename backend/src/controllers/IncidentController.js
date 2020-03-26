const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        //Busca parâmetro page. Se não existir, recebe 1.
        const { page = 1 } = request.query;

        //retorna o número de registros na tabela incidents 
        const [count] = await connection('incidents').count();

        //Limit: limita em 5 o numero de páginas a receber
        //offSet: ula em 5 no bd
        const incidents = await connection('incidents')
                            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
                            .limit(5)
                            .offset((page - 1) * 5)
                            //Pega todos os dados de incidentes e seleciona os de ongs.
                            .select([
                                'incidents.*',
                                'ongs.name',
                                'ongs.email',
                                'ongs.whatsapp',
                                'ongs.city',
                                'ongs.uf'
                            ]);
        
        //Retornando o número de linhas para o front no cabeçalho
        //da resposta.
        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response){
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        //O insert retornará um array.
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id });
    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
                        .where('id', id)
                        .select('ong_id')
                        .first();
        
        //Se a ong do incidente for diferente da ong que quer deletar
        //Envia-se status de não autorizado.
        if(incident.ong_id !== ong_id){
            return response.status(401).json({error: "Operation not permitted"});
        }

        await connection('incidents').where('id', id).delete();

        //Status 204: Resposta sem conteúdo, mas com sucesso
        //send: mandar reposta sem corpo, vazia.
        return response.status(204).send();
    }
};