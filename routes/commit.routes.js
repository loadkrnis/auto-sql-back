module.exports = app => {
  const CommitController = require('../controllers/commit.controller');
  const CommitValidator = require('../validators/commitValidator');

  // 강의 목록 조회
  app.get('/lecture', CommitValidator.findAll, CommitController.findAll);

  // 강의 상세 조회
  app.get('/lecture/:lecture_id', CommitValidator.findOne, CommitController.findOne);

  // 강의 등록
  app.post('/instructor/:instructor_id/lecture', CommitValidator.create, CommitController.create);

  // 강의 수정
  app.put('/lecture/:lecture_id', CommitValidator.update, CommitController.update);

  // // 강의 오픈
  app.patch('/lecture/:lecture_id/open', CommitValidator.open, CommitController.open);

  // 강의 삭제
  app.delete('/lecture/:lecture_id', CommitValidator.remove, CommitController.remove);
};
