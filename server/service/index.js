import Utility from '../lib/Utility';
import ManagerService1 from './ManagerService'
import DealBusinessService1 from './DealBusinessService';
import MySqlHelper1 from './MySqlService';
import RedisService1 from './RedisService';

const ManagerService = new ManagerService1();
const DealBusinessService = new DealBusinessService1();
const MySqlHelper = new MySqlHelper1();
const RedisService = new RedisService1();

export {
  Utility, ManagerService, DealBusinessService, MySqlHelper, RedisService
}