const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
    //Lista dados de todas as ongs.
    //O async informa que a funão é assincrona.
    async index(request, response){
        const ongs = await connection('ongs').select("*");
        
        return response.json(ongs);
    },
    //Cria nova ong.
    async create(request, response) {
        //const data = request.body;
        const { name, email, whatsapp, city, uf } = request.body;
    
        const id = crypto.randomBytes(4).toString('HEX');
    
        //So continua quando este trecho finalizar.
        await connection('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf,
        })
    
        return response.json({ id });
    }
};