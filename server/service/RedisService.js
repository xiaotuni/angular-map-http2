
import Redis from '../common/redis'

/**
 * 操作Redis的一个类
 *
 * @export
 * @class RedisService
 */
export default class RedisService {

  /**
   * 设置值
   *
   * @param {*} key
   * @param {*} value
   * @param {*} expire
   * @returns
   * @memberof RedisService
   */
  async SetValue(key, value, expire) {
    const result = await Redis.Client.setAsync(key, value);
    if (expire) {
      await Redis.Client.expireAsync(key, expire);
    }
    return result;
  }

  /**
   * 设置过期时间
   *
   * @param {*} key
   * @param {*} expire 秒
   * @returns
   * @memberof RedisService
   */
  async SetExpire(key, expire) {
    if (expire) {
      await Redis.Client.expireAsync(key, expire);
    }
    return 1;
  }

  /**
   * 获取值
   *
   * @param {*} key
   * @returns
   * @memberof RedisService
   */
  async GetValue(key) {
    // const client = await Redis.Client();
    return Redis.Client.getAsync(key);
  }

  /**
   * 设置对象
   *
   * @param {*} key
   * @param {*} data
   * @param {*} expire
   * @returns
   * @memberof RedisService
   */
  async SetObject(key, data, expire) {
    return this.SetValue(key, JSON.stringify(data), expire);
  }

  /**
   * 获取对象
   *
   * @param {*} key
   * @returns
   * @memberof RedisService
   */
  async GetObject(key) {
    const data = await this.GetValue(key);
    const result = JSON.parse(data || {});
    return result;
  }

  /**
   * 是否存在
   *
   * @param {*} key
   * @returns
   * @memberof RedisService
   */
  async Exists(key) {
    const result = await Redis.Client.existsAsync(key);
    return result;
  }

  /**
   * 删除
   *
   * @param {*} key
   * @returns
   * @memberof RedisService
   */
  async Delete(key) {
    const result = await Redis.Client.delAsync(key);
    return result;
  }
}