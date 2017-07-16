export { Utility } from '../Common/Utility';

import { __DefRefComponent } from './__defref/defref';
import { NavbarComponent } from './navbar/navbar.component'
import { ApiItemComponent } from './apiitem/apiitem'

export const CommonComponent = [ApiItemComponent, NavbarComponent, __DefRefComponent];
