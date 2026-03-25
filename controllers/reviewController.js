const db = require('../config/db');

// ─── GET all reviews for a doctor ────────────────────────────────────────────
exports.getReviewsByDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `SELECT * FROM doctor_reviews WHERE doctor_id = ?`;
    const params = [doctor_id];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    // Total count for pagination
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM doctor_reviews WHERE doctor_id = ?${status ? ' AND status = ?' : ''}`,
      status ? [doctor_id, status] : [doctor_id]
    );

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [reviews] = await db.query(query, params);

    return res.status(200).json({
      success: true,
      total: countRows[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: reviews,
    });
  } catch (err) {
    console.error('getReviewsByDoctor error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── GET single review ────────────────────────────────────────────────────────
exports.getReviewById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctor_reviews WHERE review_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Review not found' });
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── POST create review ───────────────────────────────────────────────────────
exports.createReview = async (req, res) => {
  try {
    const { doctor_id, patient_id, patient_name, rating, review_text, review_date, status } = req.body;

    const [result] = await db.query(
      `INSERT INTO doctor_reviews
         (doctor_id, patient_id, patient_name, rating, review_text, review_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        doctor_id,
        patient_id,
        patient_name,
        rating,
        review_text || null,
        review_date || new Date().toISOString().slice(0, 10),
        status || 'Visible',
      ]
    );

    const [newReview] = await db.query('SELECT * FROM doctor_reviews WHERE review_id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: newReview[0],
    });
  } catch (err) {
    console.error('createReview error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── PUT update review ────────────────────────────────────────────────────────
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_name, rating, review_text, status } = req.body;

    const [existing] = await db.query('SELECT * FROM doctor_reviews WHERE review_id = ?', [id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Review not found' });

    await db.query(
      `UPDATE doctor_reviews
       SET patient_name = ?, rating = ?, review_text = ?, status = ?
       WHERE review_id = ?`,
      [
        patient_name ?? existing[0].patient_name,
        rating       ?? existing[0].rating,
        review_text  !== undefined ? review_text : existing[0].review_text,
        status       ?? existing[0].status,
        id,
      ]
    );

    const [updated] = await db.query('SELECT * FROM doctor_reviews WHERE review_id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Review updated successfully', data: updated[0] });
  } catch (err) {
    console.error('updateReview error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─── DELETE review ────────────────────────────────────────────────────────────
exports.deleteReview = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM doctor_reviews WHERE review_id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ success: false, message: 'Review not found' });

    await db.query('DELETE FROM doctor_reviews WHERE review_id = ?', [req.params.id]);
    return res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
