import User from '../models/User.js';

const getUserDetails = async({findBy, projection})=>{
    try{
        const data = await User.findOne(findBy,projection)
        return data;
    }catch(error){
        throw error;
    }
};

export default getUserDetails