const db = require("../db");

const addMember = async (userId, memberType) => {
    
};

const checkMember = async (userId, memberType) => {
 try {
    const checkMenber = db.query(`select u.member_id from users u
        join member m on m.member_id = u.member_id
        where user_id = ?`
        ,[userId]
    );
    if(checkMenber){
          
    }else{

    }
 } catch (error) {
    
 }
};




module.exports = {
  addMember,
  checkMember
};
