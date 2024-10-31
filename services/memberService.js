const db = require("../db");
const dayjs = require('dayjs');
const addMember = async (userId, memberType) => {};

const checkMember = async (userId, memberType, period) => {
  try {
    const checkMember = await db.query(`
      SELECT u.member_id, m.* 
      FROM users u
      JOIN member m ON m.member_id = u.member_id
      WHERE user_id = ?
    `, [userId]);

    if (checkMember.rows.length > 0) {
      const member = checkMember.rows[0];
      if (member.member_type === memberType) {
        let expiredDate = dayjs(member.end_date);
        switch (period) {
          case '1M':
            expiredDate = expiredDate.add(1, 'month');
            break;
          case '3M':
            expiredDate = expiredDate.add(3, 'months');
            break;
          case '6M':
            expiredDate = expiredDate.add(6, 'months');
            break;
          case '1Y':
            expiredDate = expiredDate.add(1, 'year');
            break;
          default:
            throw new Error("Invalid period specified");
        }

        return expiredDate.format('YYYY-MM-DD');
      } else {
        throw new Error("Member type does not match");
      }
    } else {
      throw new Error("Member not found");
    }
  } catch (error) {
    console.error("Error in checkMember:", error.message);
    throw error;
  }
};




module.exports = {
  addMember,
  checkMember
};
