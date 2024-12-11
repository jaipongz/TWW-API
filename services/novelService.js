const { log } = require("console");
const db = require("../db");
const fs = require("fs");
const path = require("path");

const createNovel = async (
  novelName,
  penName,
  group,
  type,
  mainGroup,
  subGroup1,
  subGroup2,
  tag,
  rate,
  desc,
  novel_propic,
  userId,
  status
) => {
  try {
    const proPic = novel_propic.path;
    await db.query(
      "INSERT INTO novel (novel_name, pen_name, novel_group, type,main_group,sub_group1,sub_group2, tag, rate, novel_desc, novel_propic, user_id, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        novelName,
        penName,
        group,
        type,
        mainGroup,
        subGroup1,
        subGroup2,
        tag,
        rate,
        desc,
        proPic,
        userId,
        status,
      ]
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
  type,
  mainGroup,
  subGroup1,
  subGroup2,
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
        ? `${process.env.DOMAIN}/storage/novelPropic/${novel.novel_propic.split("\\").pop()}`
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
const destroyNovel = async (novelId, userId) => {
  try {
    const sqlGet = `SELECT novel_id, type, novel_propic FROM novel WHERE novel_id = ? AND user_id = ?`;
    const [result] = await db.query(sqlGet, [novelId, userId]);

    if (!result.length) {
      console.error("Novel not found");
      return { status: "fail", message: `Not found novel: ${novelId} it's created by UserId: ${userId}` };
    }

    const novel = result[0];
    // let table;

    // if (novel.type === "DES") {
    //   table = "chapter";
    // } else {
    //   console.error("Invalid novel type");
    //   throw new Error("Invalid novel type");
    // }

    const sqlChapters = `DELETE FROM chapter WHERE novel_id = ?`;
    await db.query(sqlChapters, [novelId]);

    const sqlNovel = `DELETE FROM novel WHERE novel_id = ?`;
    await db.query(sqlNovel, [novelId]);

    const imagePath = novel.novel_propic;
    const fullPath = path.resolve(
      __dirname,
      "../src/storage/novelPropic",
      imagePath.split("\\").pop()
    ); // Adjust path as necessary

    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Failed to delete image file: ${fullPath}`, err);
      } else {
        console.log(`Image file deleted successfully: ${fullPath}`);
      }
    });

    return { status: "success", message: "Novel deleted successfully" };
  } catch (error) {
    console.error("Error deleting novel:", error);
    // throw new Error("Novel deletion failed");
    return {status: 'fail',message:error}
  }
};
const getNovelDetail = async (novelId) => {
  try {
    const novelQuery = `
      SELECT novel_id, novel_name, pen_name, novel_group, type,
             main_group, sub_group1, sub_group2, tag, novel_desc, rate, 
             novel_propic, published, end,
             created_at,
             updated_at
      FROM novel WHERE novel_id = ?
    `;
    const result = await db.query(novelQuery, [novelId]);

    if (!result || result.length === 0) {
      return { status: false, message: "Novel not found" };
    }

    const novel = result[0];
    
    
    novel[0].novel_propic = novel[0]
    ? `${process.env.DOMAIN}/storage/novelPropic/${
      novel[0].novel_propic.replace(/\\/g, '/').split('/').pop()
      }`
    : null;
    
    return { status: true, data: novel[0] };
  } catch (error) {
    console.error("Error fetching novel details:", error);
    return { status: false, message: "Failed to fetch novel details" };
  }
};

const createChatChapter = async (novelId, chapterName) => {
  try {
    // console.log(novelId);

    const [result] = await db.query(
      "INSERT INTO chapter (novel_id, chapter_name, type) VALUES (?, ?, ?)",
      [novelId, chapterName, "CHAT"]
    );
    return { chapterId: result.insertId };
  } catch (error) {
    console.error("Error create chat:", error);
    throw new Error("Novel create chat failed");
  }
};
const createDescChapter = async (
  novelId,
  chapterName,
  content,
  writerMsg,
  comment
) => {
  try {
    // Ensure writerMsg is null if it's empty, undefined, or only spaces
    const fromWriter = !writerMsg || writerMsg.trim() === "" ? null : writerMsg;

    const [result] = await db.query(
      "INSERT INTO chapter (novel_id, chapter_name, type, content, message_writer, comment) VALUES (?, ?, ?, ?, ?, ?)",
      [novelId, chapterName, "DESC", content, fromWriter, comment]
    );

    return { chapterId: result.insertId };
  } catch (error) {
    console.error("Error creating chapter:", error);
    throw new Error("Novel create chapter failed");
  }
};
const getDescChapter = async (chapterId) => {
  try {
    const select =
      "SELECT chapter_id,chapter_name,content,comment,message_writer,updated_at FROM chapter WHERE chapter_id = ?";
    const [result] = await db.query(select, [chapterId]);
    return result;
  } catch (error) {
    console.error("Error create chat:", error);
    throw new Error("Novel create chapter failed");
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
const updateChar = async (characterId, name, role, charPic) => {
  try {
    let sql = `UPDATE characters SET name = ?, role = ?`;
    const params = [name, role];
    if (charPic) {
      sql += `, image_path = ?`;
      params.push(charPic.path);
    }
    sql += ` WHERE id = ?`;
    params.push(characterId);
    const [result] = await db.query(sql, params);
    return { affectedRows: result.affectedRows };
  } catch (error) {
    console.error("Error updating character:", error);
    throw new Error("Character update failed");
  }
};
const deleteChar = async (characterId) => {
  try {
    console.log("Attempting to delete character with ID:", characterId);
    const [character] = await db.query(
      "SELECT image_path FROM characters WHERE id = ?",
      [characterId]
    );
    if (!character || character.length === 0) {
      throw new Error("Character not found");
    }
    const imagePath = character[0].image_path;
    const fullPath = path.resolve(
      __dirname,
      "../src/storage/charactor",
      imagePath.split("\\").pop()
    ); // Adjust path as necessary
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Failed to delete image file: ${fullPath}`, err);
      } else {
        console.log(`Image file deleted successfully: ${fullPath}`);
      }
    });
    const [result] = await db.query("DELETE FROM characters WHERE id = ?", [
      characterId,
    ]);
    // console.log("Deletion result:", result);
    return { affectedRows: result.affectedRows };
  } catch (error) {
    console.error("Error deleting character:", error);
    throw new Error("Character deletion failed");
  }
};
const getCharById = async (characterId) => {
  try {
    const sql = `SELECT * FROM characters WHERE id = ?`;
    const [result] = await db.query(sql, [characterId]);

    if (result.length > 0) {
      const character = result[0];
      character.image_path = character.image_path
        ? `${process.env.DOMAIN}/storage/charactor/${character.image_path.split("\\").pop()}`
        : null;
      return character;
    } else {
      throw new Error("Character not found");
    }
  } catch (error) {
    console.error("Error retrieving character:", error);
    throw new Error("Character retrieval failed");
  }
};
const getAllChar = async (novelId) => {
  try {
    const sql = `SELECT * FROM characters WHERE novel_id = ?`;
    const [characters] = await db.query(sql, [novelId]);

    if (characters.length > 0) {
      const mappedCharacters = characters.map((character) => ({
        ...character,
        image_path: character.image_path
          ? `${process.env.DOMAIN}/storage/charactor/${character.image_path.split("\\").pop()}`
          : null,
      }));
      return {
        status: "success",
        data: mappedCharacters,
      };
    } else {
      return {
        status: "fail",
        message: "No characters found for the given novel ID",
      };
    }
  } catch (error) {
    console.error("Error retrieving characters:", error);
    throw new Error("Character retrieval failed");
  }
};
const createMessage = async (chapterId, sender, content, timestamp) => {
  try {
    const [result] = await db.query(
      "INSERT INTO message_draft (chapter_id, sender, message_type, content, timestamp) VALUES (?, ?, ?, ?, ?)",
      [chapterId, sender, "text", content, timestamp]
    );
    return { messageId: result.insertId };
  } catch (error) {
    console.error("Error create chat:", error);
    throw new Error("Novel create chat failed");
  }
};
const updateMessage = async (messageId, sender, content, timestamp) => {
  try {
    const sql = `UPDATE message_draft SET sender = ?,content = ?,timestamp = ? WHERE draft_id = ?`;
    const [result] = await db.query(sql, [
      sender,
      content,
      timestamp,
      messageId,
    ]);
    return { messageId: result.insertId };
  } catch (error) {
    console.error("Error create chat:", error);
    throw new Error("Novel create chat failed");
  }
};
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
const addMedia = async (chapterId, sender, media, timestamp) => {
  try {
    const mediaPath = media.path;
    const [result] = await db.query(
      "INSERT INTO message_draft (chapter_id, sender, message_type, content, timestamp) VALUES (?, ?, ?, ?, ?)",
      [chapterId, sender, "media", mediaPath, timestamp]
    );
    return { messageId: result.insertId };
  } catch (error) {
    console.error("Error create chat:", error);
    throw new Error("Novel create chat failed");
  }
};

const deleteAllDrftByChaapterId = async (chapterId) => {
  try {
    const sql = `DELETE FROM message_draft WHERE chapter_id = ?`;
    const [result] = await db.query(sql, [chapterId]);
    return { deletedCount: result.affectedRows };
  } catch (error) {
    console.error("Error deleting drafts:", error);
    throw new Error("Draft deletion failed");
  }
};

const saveDraftToMainMessage = async (chapterId) => {
  try {
    const selectSql = `SELECT * FROM message_draft WHERE chapter_id = ?`;
    const [draftMessages] = await db.query(selectSql, [chapterId]);

    if (draftMessages.length === 0) {
      throw new Error("No drafts found for this chapter");
    }

    const insertSql = `INSERT INTO messages (chapter_id, sender, message_type, content, timestamp) VALUES ?`;
    const values = draftMessages.map((msg) => [
      msg.chapter_id,
      msg.sender,
      msg.message_type,
      msg.content,
      msg.timestamp,
    ]);
    await db.query(insertSql, [values]);

    const deleteSql = `DELETE FROM message_draft WHERE chapter_id = ?`;
    await db.query(deleteSql, [chapterId]);

    return {
      status: "success",
      message: "Drafts saved and cleared successfully",
    };
  } catch (error) {
    console.error("Error saving drafts to main message:", error);
    throw new Error("Failed to save drafts to main message");
  }
};
const getMyNovels = async (
  keyword,
  startIndex,
  limitIndex,
  userId,
  sortBy,
  where
) => {
  try {
    const limit = Number(limitIndex) || 10;
    const start = ((Number(startIndex) || 1) - 1) * limit;
    const datetimeProd = 'DATE_ADD(n.updated_at, INTERVAL 7 HOUR) AS updated_at,'
    let sql = `
      SELECT 
        n.novel_id, 
        n.novel_name, 
        n.novel_group, 
        n.type, 
        n.novel_propic, 
        n.updated_at,
        n.published, 
        n.tag,
        COUNT(c.chapter_id) AS total_chapter
      FROM novel n
      LEFT JOIN chapter c ON c.novel_id = n.novel_id
      WHERE n.user_id = ?
      GROUP BY n.novel_id
    `;
    let order = `ORDER BY n.updated_at `;
    let sort = "DESC";

    if (sortBy) {
      sort = sortBy;
    }

    const params = [userId];

    if (keyword) {
      sql += `AND n.novel_name LIKE ? `;
      params.push(`%${keyword}%`);
    }

    if (where) {
      sql += `AND ${where} `;
    }

    sql += `${order} ${sort} LIMIT ? OFFSET ?`;
    params.push(limit, start);

    const [novels] = await db.query(sql, params);

    const countSql = `
      SELECT COUNT(DISTINCT n.novel_id) AS total 
      FROM novel n 
      LEFT JOIN chapter c ON c.novel_id = n.novel_id
      WHERE n.user_id = ?
      ${keyword ? "AND n.novel_name LIKE ?" : ""}
      ${where ? `AND ${where}` : ""}
    `;
    const countParams = [userId, ...(keyword ? [`%${keyword}%`] : [])];
    const [totalResult] = await db.query(countSql, countParams);

    const total = totalResult[0]?.total || 0;

    const nowPage = Math.ceil((start + 1) / limit);

    const mappedNovels = novels.map((novel) => ({
      ...novel,
      novel_propic: novel.novel_propic
        ? `${process.env.DOMAIN}/storage/novelPropic/${novel.novel_propic.replace(/\\/g, '/').split('/').pop()}`
        : null,
    }));

    return {
      status: "success",
      data: mappedNovels,
      total,
      perPage: limit,
      nowPage,
    };
  } catch (error) {
    console.error("Error fetching novels:", error.message);
    throw new Error("Novel fetching failed");
  }
};

const getAllDescChapter = async (novelId, startIndex, limitIndex) => {
  try {
    const limit = Number(limitIndex) || 10;
    const start = ((Number(startIndex) || 1) - 1) * limit;
    const sql = `
      SELECT 
        chapter_id, 
        chapter_name, 
        comment, 
        updated_at 
      FROM chapter 
      WHERE novel_id = ? 
      ORDER BY updated_at DESC 
      LIMIT ? OFFSET ?
    `;
    const params = [novelId, limit, start];
    const [chapters] = await db.query(sql, params);
    const countSql = `
      SELECT COUNT(*) AS total 
      FROM chapter 
      WHERE novel_id = ?
    `;
    const [totalResult] = await db.query(countSql, [novelId]);
    const total = totalResult[0]?.total || 0;
    const nowPage = Math.ceil((start + 1) / limit);
    return {
      status: "success",
      data: chapters,
      total,
      perPage: limit,
      nowPage,
    };
  } catch (error) {
    console.error("Error fetching chapters:", error.message);
    throw new Error("Chapter fetching failed");
  }
};
const updateStatus = async (userId, novelId, command, status) => {
  try {
    const validCommands = ['end', 'published', 'approved'];
    if (!validCommands.includes(command)) {
      return { status: false, message: 'Invalid command' };
    }

    if (!['T', 'F'].includes(status)) {
      return { status: false, message: 'Invalid status value' };
    }

    const updateQuery = `UPDATE novel SET ${command} = ? WHERE user_id = ? AND novel_id = ?`;
    const rs = await db.query(updateQuery, [status, userId, novelId]);

    if (!rs) {
      return { status: false, message: 'Failed to update novel, no rows affected' };
    }

    return { status: true, message: 'Update successful' };
  } catch (error) {
    console.error('Error updating novel status:', error);
    return { status: false, message: 'Database query failed' };
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
  addMedia,
  createChar,
  updateChar,
  deleteChar,
  getCharById,
  getAllChar,
  saveDraftToMainMessage,
  deleteAllDrftByChaapterId,
  getMyNovels,
  createDescChapter,
  getDescChapter,
  getAllDescChapter,
  updateStatus,
};
