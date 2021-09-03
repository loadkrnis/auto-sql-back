class CommitService {
  constructor(CommitModel) {
    this.CommitModel = CommitModel;
  }

  async create(commit) {
    const result = await this.CommitModel.create(commit);

    return result;
  }
}
module.exports = { CommitService };
