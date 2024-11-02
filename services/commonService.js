const db = require("../db");

const postComment = async (novelId, chapterId, userId, content) => {
  try {
    const result = await db.query(
      `INSERT INTO comments (novel_id, chapter_id, user_id, content) VALUES (?, ?, ?, ?)`,
      [novelId, chapterId || null, userId, content]
    );
    return result;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw new Error("Failed to post comment");
  }
};

const updateComment = async (commentId, content) => {
  try {
    const result = await db.query(
      `UPDATE comments SET content = ?, updated_date = NOW() WHERE comment_id = ?`,
      [content, commentId]
    );
    return result;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw new Error("Failed to update comment");
  }
};

const deleteComment = async (commentId) => {
  try {
    const result = await db.query(`DELETE FROM comments WHERE comment_id = ?`, [
      commentId,
    ]);
    return result;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw new Error("Failed to delete comment");
  }
};

const getCommentsByNovel = async (novelId) => {
  try {
    const [rows] = await db.query(`SELECT * FROM comments WHERE novel_id = ?`, [novelId]);
    return rows;
  } catch (error) {
    throw new Error("Failed to get comment");
  }
};

const getCommentsByChapter = async (chapterId) => {
  try {
    const [rows] = await db.query(`SELECT * FROM comments WHERE chapter_id = ?`, [ chapterId]);
    return rows;
  } catch (rows) {
    throw new Error("Failed to get comment");
    
  }
};

// async addLike(novelId, chapterId, userId) {
//   return await db.query(
//     `INSERT INTO likes (user_id, novel_id, chapter_id) VALUES (?, ?, ?)`,
//     [userId, novelId, chapterId || null]
//   );
// },

// async removeLike(novelId, chapterId, userId) {
//   return await db.query(
//     `DELETE FROM likes WHERE user_id = ? AND novel_id = ? AND chapter_id = ?`,
//     [userId, novelId, chapterId || null]
//   );
// },
// async getLikeCountByNovel(novelId) {
//   return await db.query(
//     `SELECT COUNT(*) AS likeCount FROM likes WHERE novel_id = ?`,
//     [novelId]
//   );
// },

// async getLikeCountByChapter(chapterId) {
//   return await db.query(
//     `SELECT COUNT(*) AS likeCount FROM likes WHERE chapter_id = ?`,
//     [chapterId]
//   );
// },
// async shareNovelOrChapter(novelId, chapterId, userId) {
//   return await db.query(
//     `INSERT INTO shares (user_id, novel_id, chapter_id) VALUES (?, ?, ?)`,
//     [userId, novelId, chapterId || null]
//   );
// },

// async getShareCountByNovel(novelId) {
//   return await db.query(
//     `SELECT COUNT(*) AS shareCount FROM shares WHERE novel_id = ?`,
//     [novelId]
//   );
// },
// async getShareCountByChapter(chapterId) {
//   return await db.query(
//     `SELECT COUNT(*) AS shareCount FROM shares WHERE chapter_id = ?`,
//     [chapterId]
//   );
// },

module.exports = { 
  postComment, 
  deleteComment,
  getCommentsByNovel,
  getCommentsByChapter,
  updateComment
};
