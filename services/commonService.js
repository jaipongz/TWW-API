// commonService.js
import db from "../db"; // Adjust the path as necessary

const commonService = {
  async postComment(novelId, chapterId, userId, content) {
    return await db.query(
      `INSERT INTO comments (novel_id, chapter_id, user_id, content) VALUES (?, ?, ?, ?)`,
      [novelId, chapterId || null, userId, content]
    );
  },

  async deleteComment(commentId) {
    return await db.query(`DELETE FROM comments WHERE comment_id = ?`, [
      commentId,
    ]);
  },

  async getCommentsByNovel(novelId) {
    return await db.query(`SELECT * FROM comments WHERE novel_id = ?`, [
      novelId,
    ]);
  },

  async getCommentsByChapter(chapterId) {
    return await db.query(`SELECT * FROM comments WHERE chapter_id = ?`, [
      chapterId,
    ]);
  },

  async addLike(novelId, chapterId, userId) {
    return await db.query(
      `INSERT INTO likes (user_id, novel_id, chapter_id) VALUES (?, ?, ?)`,
      [userId, novelId, chapterId || null]
    );
  },

  async removeLike(novelId, chapterId, userId) {
    return await db.query(
      `DELETE FROM likes WHERE user_id = ? AND novel_id = ? AND chapter_id = ?`,
      [userId, novelId, chapterId || null]
    );
  },
  async getLikeCountByNovel(novelId) {
    return await db.query(
      `SELECT COUNT(*) AS likeCount FROM likes WHERE novel_id = ?`,
      [novelId]
    );
  },

  async getLikeCountByChapter(chapterId) {
    return await db.query(
      `SELECT COUNT(*) AS likeCount FROM likes WHERE chapter_id = ?`,
      [chapterId]
    );
  },
  async shareNovelOrChapter(novelId, chapterId, userId) {
    return await db.query(
      `INSERT INTO shares (user_id, novel_id, chapter_id) VALUES (?, ?, ?)`,
      [userId, novelId, chapterId || null]
    );
  },

  async getShareCountByNovel(novelId) {
    return await db.query(
      `SELECT COUNT(*) AS shareCount FROM shares WHERE novel_id = ?`,
      [novelId]
    );
  },
  async getShareCountByChapter(chapterId) {
    return await db.query(
      `SELECT COUNT(*) AS shareCount FROM shares WHERE chapter_id = ?`,
      [chapterId]
    );
  },
};

module.exports = commonService;
