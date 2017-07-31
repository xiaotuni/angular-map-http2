import { __DefRefComponent } from './__defref/defref';
import { NavbarComponent } from './navbar/navbar.component'
import { ApiItem } from './apiitem/apiitem'
import { RuleItem } from './rule/ruleitem'
import { RuleInfo } from './rule/RuleInfo'
import { XtnModel } from './model/Core';
import { MapComponent } from './Map/Core';

export const CommonComponent = [
  NavbarComponent, __DefRefComponent, RuleItem, RuleInfo, ApiItem, XtnModel,
  MapComponent
];
