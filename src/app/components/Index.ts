import { __XtnDefRefComponent } from './__defref/defref';
import { NavbarComponent } from './navbar/navbar.component'
import { XtnApiItem } from './apiitem/apiitem'
import { RuleItem } from './rule/ruleitem'
import { RuleInfo } from './rule/RuleInfo'
import { XtnModel } from './model/Core';
import { MapComponent } from './Map/Index';

export const CommonComponent = [
  NavbarComponent, __XtnDefRefComponent, RuleItem, RuleInfo, XtnApiItem, XtnModel,
  MapComponent
];
