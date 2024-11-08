const db = require("../db");
const fs = require('fs');
const path = require('path');

const createNovel = async (
  novelName,
  penName,
  group,
  type,mainGroup,subGroup1,subGroup2,
  tag,
  rate,
  desc,
  novel_propic,
  userId
) => {
  try {
    const proPic = novel_propic.path;
    await db.query(
      "INSERT INTO novel (novel_name, pen_name, novel_group, type,main_group,sub_group1,sub_group2, tag, rate, novel_desc, novel_propic, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [novelName, penName, group, type,mainGroup,subGroup1,subGroup2, tag, rate, desc, proPic, userId]
    );
    return `Create Novel successful`;
  } catch (error) {
    console.error("Error creating novel:", error);
    console.error("Novel creation failed");
  }
};
const updateNovel = async (
  novelId,
  novelName,
  penName,
  group,
  type,mainGroup,subGroup1,subGroup2,
  tag,
  rate,
  desc,
  novel_propic,
  userId
) => {
  try {
    const proPic = novel_propic ? novel_propic.path : null;

    const updateFields = [];
    const updateValues = [];

    if (novelName) {
      updateFields.push("novel_name = ?");
      updateValues.push(novelName);
    }
    if (penName) {
      updateFields.push("pen_name = ?");
      updateValues.push(penName);
    }
    if (group) {
      updateFields.push("novel_group = ?");
      updateValues.push(group);
    }
    if (type) {
      updateFields.push("type = ?");
      updateValues.push(type);
    }
    if (mainGroup) {
      updateFields.push("main_group = ?");
      updateValues.push(mainGroup);
    }
    if (subGroup1) {
      updateFields.push("sub_group1 = ?");
      updateValues.push(subGroup1);
    }
    if (subGroup2) {
      updateFields.push("sub_group2 = ?");
      updateValues.push(subGroup2);
    }
    if (tag) {
      updateFields.push("tag = ?");
      updateValues.push(tag);
    }
    if (rate) {
      updateFields.push("rate = ?");
      updateValues.push(rate);
    }
    if (desc) {
      updateFields.push("novel_desc = ?");
      updateValues.push(desc);
    }
    if (proPic) {
      updateFields.push("novel_propic = ?");
      updateValues.push(proPic);
    }
    if (userId) {
      updateFields.push("user_id = ?");
      updateValues.push(userId);
    }

    if (updateFields.length === 0) {
      console.error("No fields to update");
    }

    const query = `UPDATE novel SET ${updateFields.join(
      ", "
    )} WHERE novel_id = ?`;
    updateValues.push(novelId);

    await db.query(query, updateValues);

    return `Novel updated successfully`;
  } catch (error) {
    console.error("Error updating novel:", error);
    console.error("Novel update failed");
  }
};
const getNovels = async (keyword, start = 0, limit = 10) => {
  try {
    let sql = `SELECT * FROM novel `;
    const params = [];
    if (keyword) {
      sql += `WHERE novel_name LIKE ? `;
      params.push(`%${keyword}%`);
    }

    sql += `ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(start));

    const [novels] = await db.query(sql, params);

    let countSql = `SELECT COUNT(*) AS total FROM novel `;
    const countParams = [];

    if (keyword) {
      countSql += `WHERE novel_name LIKE ?`;
      countParams.push(`%${keyword}%`);
    }

    const [totalResult] = await db.query(countSql, countParams);
    const total = totalResult[0].total;
    const nowPage = Math.floor(start / limit) + 1;

    const mappedNovels = novels.map((novel) => ({
      ...novel,
      novel_propic: novel.novel_propic
        ? `http://${process.env.DOMAIN}:${
            process.env.PORT
          }/storage/novelPropic/${novel.novel_propic.split("\\").pop()}`
        : null,
    }));

    return {
      status: "success",
      data: mappedNovels,
      total: total,
      perPage: limit,
      nowPage: nowPage,
    };
  } catch (error) {
    console.error("Error fetching novels:", error);
    console.error("Novel fetching failed");
  }
};
const destroyNovel = async (novelId) => {
  try {
    const sqlGet = `SELECT novel_id, type, novel_propic FROM novel WHERE novel_id = ?`;
    const [result] = await db.query(sqlGet, [novelId]);

    if (!result.length) {
      console.error('Novel not found');
      throw new Error('Novel not found');
    }

    const novel = result[0];
    let table;

    if (novel.type === 'DES') {
      table = 'chapter_descript';
    } else {
      console.error('Invalid novel type');
      throw new Error('Invalid novel type');
    }

    const sqlChapters = `DELETE FROM ${table} WHERE novel_id = ?`;
    await db.query(sqlChapters, [novelId]);

    const sqlNovel = `DELETE FROM novel WHERE novel_id = ?`;
    await db.query(sqlNovel, [novelId]);

    const imagePath = novel.novel_propic;
    const fullPath = path.resolve(__dirname, '../src/storage/novelPropic', imagePath.split('\\').pop()); // Adjust path as necessary

    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Failed to delete image file: ${fullPath}`, err);
      } else {
        console.log(`Image file deleted successfully: ${fullPath}`);
      }
    });

    return { status: 'success', message: 'Novel deleted successfully' };
  } catch (error) {
    console.error("Error deleting novel:", error);
    throw new Error("Novel deletion failed");
  }
};
const getNovelDetail = async (novelId, start = 0, limit = 10) => {
  try {
    const offset = parseInt(start, 10);
    const rowsLimit = parseInt(limit, 10);

    const novelQuery = `SELECT * FROM novel WHERE novel_id = ?`;
    const [novels] = await db.query(novelQuery, [novelId]);
    const novel = novels[0];

    if (!novel) {
      console.error("Novel not found");
    }

    const chapterTable = novel.type === 'DES' ? 'chapter_descript' : 'chapter_other'; // Adjust "chapter_other" as needed
    const chapterQuery = `SELECT * FROM ${chapterTable} WHERE novel_id = ? ORDER BY created_at DESC LIMIT ?, ?`;
    
    const [novelChapters] = await db.query(chapterQuery, [novel.novel_id, offset, rowsLimit]);

    const countQuery = `SELECT COUNT(*) AS total FROM ${chapterTable} WHERE novel_id = ?`;
    const [[{ total }]] = await db.query(countQuery, [novel.novel_id]);

    const mappedTags = novel.tag;

    const mappedNovel = {
      novel_id: novel.novel_id,
      novel_name: novel.novel_name,
      novel_desc: novel.novel_desc,
      pen_name: novel.pen_name,
      tag: mappedTags,
      novel_propic: novel.novel_propic
        ? `http://${process.env.DOMAIN}:${process.env.PORT}/storage/novelPropic/${novel.novel_propic.split("\\").pop()}`
        : null,
      chapters: novelChapters,
      pagination: {
        totalChapters: total,
        perPage: rowsLimit,
        currentPage: Math.floor(offset / rowsLimit) + 1,
        totalPages: Math.ceil(total / rowsLimit),
      },
    };

    return mappedNovel;
  } catch (error) {
    console.error("Error fetching novel details:", error);
    console.error("Novel detail fetching failed");
  }
};
const createChatChapter = async (novelId,chapterName,order) =>{
  try {
    console.log(novelId);
    
    const [result] = await db.query('INSERT INTO chapter_chat (novel_id, chapter_name, `order`) VALUES (?, ?, ?)', [novelId, chapterName, order]);
    return { chapterId: result.insertId };
  } catch (error) {
    console.error("Error create chat:", error);
    throw new Error("Novel create chat failed");
  }
}
const createMessage = async (chapterId ,sender,type,content,timestamp) =>{
  try {
    const [result] = await db.query('INSERT INTO message_draft (chapter_id, sender, message_type, content, timestamp) VALUES (?, ?, ?, ?, ?)', [chapterId, sender, type, content, timestamp]);
    return { messageId: result.insertId };
  } catch (error) {
    console.error("Error create chat:", error);
    throw new Error("Novel create chat failed");
  }
}
const updateMessage = async (messageId ,sender,content,timestamp) =>{
  try {
    const sql = `UPDATE message_draft SET sender = ?,content = ?,timestamp = ? WHERE draft_id = ?`;
    const [result] = await db.query(sql, [sender,content, timestamp,messageId ]);
    return { messageId: result.insertId };
  } catch (error) {
    console.error("Error create chat:", error);
    throw new Error("Novel create chat failed");
  }
}
const deleteMessage = async (messageId) => {
  try {
    const sql = `DELETE FROM message_draft WHERE draft_id = ?`;
    const [result] = await db.query(sql, [messageId]);
    return { messageId };
  } catch (error) {
    console.error("Error deleting message:", error);
    throw new Error("Message deletion failed");
  }
};

const createChar = async (novel_id, name, role, charPic) => {
  try {
    const imagePath = charPic.path; 
    const sql = `INSERT INTO characters (novel_id, name, role, image_path) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [novel_id, name, role, imagePath]);
    
    return { characterId: result.insertId };
  } catch (error) {
    console.error("Error inserting character:", error);
    throw new Error("Character creation failed");
  }
};

module.exports = {
  createNovel,
  getNovels,
  updateNovel,
  getNovelDetail,
  destroyNovel,
  createChatChapter,
  createMessage,
  updateMessage,
  deleteMessage,
  createChar
};
