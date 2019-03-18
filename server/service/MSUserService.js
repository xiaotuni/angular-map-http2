import { Utility, MySqlHelper, DealBusinessService } from ".";

export default class MSUserService {
  async init() {
    return {};
  }

  /**
   *  处理
   *
   * @param {*} args
   * @returns
   * @memberof MSUserService
   */
  async process(args) {
    const { options, cmd, method } = args;
    const ruleContent = await DealBusinessService.getRule(cmd, method);

    const result = await DealBusinessService.processRule(options, ruleContent);
    return result;
  }

}