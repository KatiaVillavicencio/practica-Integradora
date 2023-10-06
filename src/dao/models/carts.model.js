import mongoose from 'mongoose';

const cartCollection = 'Carts';

const cartSchema = new mongoose.Schema({

            description: {type: String, required: true},
            quantity:{type: Number, required:true},
            total: { type: Number, required: true}
     
});

export const cartModel = mongoose.model(cartCollection, cartSchema)

