const db = require("../db");

const createNovel = async (
  novelName,
  penName,
  group,
  type,
  tag,
  rate,
  desc,
  novel_propic,
  userId
) => {
  try {
    console.log(novelName);
    const proPic = novel_propic.path;
    console.log(proPic);

    await db.query(
      "INSERT INTO novel (novel_name, pen_name, novel_group, type, tag_id, rate, novel_desc, novel_propic, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [novelName, penName, group, type, tag, rate, desc, proPic, userId]
    );

    return `Create Novel successful`;
  } catch (error) {
    console.error("Error creating novel:", error);
    throw new Error("Novel creation failed");
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
    params.push(Number(limit), Number(start)); // Convert to numbers

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
    throw new Error("Novel fetching failed");
  }
};

module.exports = {
  createNovel,
  getNovels,
};
