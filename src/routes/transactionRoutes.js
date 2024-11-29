const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');


router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    // 총 문서 수 계산
    const total = await Transaction.countDocuments();
    const totalPages = Math.ceil(total / parsedLimit);

    // 요청한 페이지가 총 페이지 수보다 큰 경우 처리
    if (parsedPage > totalPages) {
      return res.status(200).json({
        total,
        page: totalPages, // 마지막 유효 페이지 반환
        totalPages,
        transactions: [], // 빈 배열 반환
        message: 'No more data available',
      });
    }

    // 데이터 가져오기
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    res.status(200).json({
      total,
      page: parsedPage,
      totalPages,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
