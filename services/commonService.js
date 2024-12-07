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
    const [rows] = await db.query(`SELECT * FROM comments WHERE chapter_id = ?`, [chapterId]);
    return rows;
  } catch (rows) {
    throw new Error("Failed to get comment");

  }
};
const mainGroup = async () => {
  try {
    const [rows] = await db.query(`SELECT * FROM main_group`);
    return rows;
  } catch (rows) {
    throw new Error("Failed to get comment");

  }
};
const subGroup = async () => {
  try {
    const [rows] = await db.query(`SELECT * FROM sub_group`);
    return rows;
  } catch (rows) {
    throw new Error("Failed to get comment");
  }
};
const recTag = async () => {
  try {
    // const [rows] = await db.query(`SELECT * FROM sub_group`);
    const rows = [
      {
        "tag":"มาเฟีย"
      },
      {
        "tag":"โอ้วเธอ"
      },
      {
        "tag":"พี่แฉะ"
      },
      {
        "tag":"พ่อไข่ย้อยทูโทน"
      },
      {
        "tag":"แม่มาแล้ว"
      },
      {
        "tag":"นาทอส"
      },
      {
        "tag":"โจร"
      },
      {
        "tag":"แบดบอย"
      },
    ];
    return rows;
  } catch (rows) {
    throw new Error("Failed to get comment");
  }
};

const addLike = async (novelId, chapterId, userId) => {
  try {
    if (!userId || !novelId) {
      throw new Error('Missing required parameters: userId or novelId');
    }

    console.log('Inserting like with:', { userId, novelId, chapterId });

    return await db.query(
      `INSERT INTO likes (user_id, novel_id, chapter_id) VALUES (?, ?, ?)`,
      [userId, novelId, chapterId || null]
    );
  } catch (error) {
    console.error('Error in addLike:', error.message);
    throw error; // Propagate the error to the controller for proper handling
  }
};

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
  updateComment,
  mainGroup,
  subGroup,
  addLike,
  recTag
};
