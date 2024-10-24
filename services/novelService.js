const db = require("../db");

const createNovel = async (novelName, penName, group, type, tag, rate, desc, novel_propic, userId) => {
    try {
        console.log(novelName);
        const proPic = novel_propic.path;
        console.log(proPic);
        
        await db.query(
            'INSERT INTO novel (novel_name, pen_name, novel_group, type, tag_id, rate, novel_desc, novel_propic, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [novelName, penName, group, type, tag, rate, desc, proPic, userId]
        );

        return `Create Novel successful`;
    } catch (error) {
        console.error("Error creating novel:", error);
        throw new Error("Novel creation failed");
    }
};

module.exports = {
    createNovel
  };