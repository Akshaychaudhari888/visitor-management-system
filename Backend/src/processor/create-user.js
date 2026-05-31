import User from '../models/User.js';

const getUserDetails = async({data})=>{
    try{
        const user = await User.create(data)
        return user;
    }catch(error){
        throw error;
    }
};

export default getUserDetails