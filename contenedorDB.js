
module.exports = class ContenedorDB {
    constructor(_knex, _tabla){
        this.knex = _knex;
        this.tabla = _tabla;
    }
    async getById(_id){
        const data = await this.knex(this.tabla)
                                .where("id", _id);

        return data[0];
    }
    async updateProductById(_elemento){
        const res = await this.knex(this.tabla)
                    .where("id", _elemento.id)
                    .update(_elemento);
        return res;
    }

    async save(_elemento){
        if(_elemento.id){
            delete _elemento.id
        }

        const res = await this.knex(this.tabla)
                    .insert(_elemento);
        return res;
    }

    async deleteById(_id){
        const res = await this.knex(this.tabla).
                                where("id", _id).
                                del();
        return res; 
    }

    async deleteAll(){
        const res = await this.knex(this.tabla)
                                .del();
        return res;
    }

    async getAll(){
        const data = await this.knex(this.tabla);
        return data;
    }
}
