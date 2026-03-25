const db = require('../config/db');

// ─── GET all doctors with avg rating ─────────────────────────────────────────
exports.getAllDoctors = async (req, res) => {
  try {
    const { search, min_rating, specialty } = req.query;

    let query = `
      SELECT
        d.*,
        ROUND(AVG(r.rating), 1)  AS avg_rating,
        COUNT(r.review_id)       AS total_reviews
      FROM doctors d
      LEFT JOIN doctor_reviews r
        ON d.doctor_id = r.doctor_id AND r.status = 'Visible'
    `;

    const params = [];
    const where = [];

    if (search)    { where.push(`(d.name LIKE ? OR d.specialty LIKE ?)`); params.push(`%${search}%`, `%${search}%`); }
    if (specialty) { where.push(`d.specialty = ?`);                        params.push(specialty); }

    if (where.length) query += ` WHERE ${where.join(' AND ')}`;
    query += ` GROUP BY d.doctor_id`;

    if (min_rating) {
      query += ` HAVING avg_rating >= ?`;
      params.push(parseFloat(min_rating));
    }

    query += ` ORDER BY avg_rating DESC`;

    const [doctors] = await db.query(query, params);
    return res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    console.error('getAllDoctors error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── GET single doctor ────────────────────────────────────────────────────────
exports.getDoctorById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         d.*,
         ROUND(AVG(r.rating), 1) AS avg_rating,
         COUNT(r.review_id)      AS total_reviews
       FROM doctors d
       LEFT JOIN doctor_reviews r
         ON d.doctor_id = r.doctor_id AND r.status = 'Visible'
       WHERE d.doctor_id = ?
       GROUP BY d.doctor_id`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Doctor not found' });
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
