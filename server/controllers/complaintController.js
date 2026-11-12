const Complaint = require('../models/Complaint');

// POST /api/complaints
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, latitude, longitude, address } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ success: false, message: 'Latitude and longitude are required' });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)], // longitude first!
        address,
      },
      createdBy: req.user._id, // from the token, never from the client
    });

    res.status(201).json({ success: true, complaint });
  } catch (err) {
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// GET /api/complaints?category=road&status=pending
const getComplaints = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/complaints/:id
const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('createdBy', 'name');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    const status = err.name === 'CastError' ? 400 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// PUT /api/complaints/:id/upvote  (toggle)
const toggleUpvote = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const userId = req.user._id.toString();
    const index = complaint.upvotes.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      complaint.upvotes.push(req.user._id); // add vote
    } else {
      complaint.upvotes.splice(index, 1); // remove vote
    }

    await complaint.save();

    res.json({
      success: true,
      upvoted: index === -1,
      upvoteCount: complaint.upvotes.length,
    });
  } catch (err) {
    const status = err.name === 'CastError' ? 400 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// PATCH /api/complaints/:id/status  (admin)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'in-progress', 'resolved'];

    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, complaint });
  } catch (err) {
    const status = err.name === 'CastError' ? 400 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaint,
  toggleUpvote,
  updateStatus,
};