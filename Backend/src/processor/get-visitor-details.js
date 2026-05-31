import Visitor from '../models/Visitor.js';

const getVisitorDetails = async({findBy, projection})=>{
    try{
        const data = await Visitor.findOne(findBy,projection)
        return data;
    }catch(error){
        throw error;
    }
};

export default getVisitorDetails;