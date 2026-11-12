const express = require('express');
const {
  createComplaint,
  getComplaints,
  getComplaint,
  toggleUpvote,
  updateStatus,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getComplaints);
router.post('/', protect, upload.single('image'), createComplaint);
router.get('/:id', getComplaint);
router.put('/:id/upvote', protect, toggleUpvote);
router.patch('/:id/status', protect, authorize('admin'), updateStatus);

module.exports = router;