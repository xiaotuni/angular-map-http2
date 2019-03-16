import { MySqlHelper, Utility, DealBusinessService } from ".";

export default class ManagerService {

  async List({ cmd, Options = {} }) {
    const sql = Utility.format(`select * from xtn_sys_rule t where t.status = 1 and t.PathName = '{0}' and t.Method = '{1}'`, '/webapi/manager/api/list', 'get')
    const info = await MySqlHelper.QueryOne(sql)
    const { Content } = info;
    const { rules = [] } = JSON.parse(Content);
    // Utility.printLog(rules);
    // const data = {};
    if (!Options.Result) {
      Options.Result = {};
    }
    for (let i = 0; i < rules.length; i += 1) {
      Utility.printLog('处理第', i + 1);
      const row = rules[i];
      const { id, sql, type, isRows, name } = row;
      const result = await DealBusinessService[type](row)
      Options.Result[i] = result;
    }
    return Object.values(Options.Result[0]);
  }
}