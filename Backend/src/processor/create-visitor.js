import Visitor from '../models/Visitor.js';

const getUserDetails = async(data)=>{
    try{
        const visitor = await Visitor.create(data)
        return visitor;
    }catch(error){
        throw error;
    }
};

export default getUserDetails