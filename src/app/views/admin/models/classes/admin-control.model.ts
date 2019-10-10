import { AdminControlType } from '../admin-control-type.enum';
import { GenericListItem } from 'src/app/shared/models/interfaces/generic-list-item.model';

export default class AdminControl implements GenericListItem{
  name: string;
  
  constructor(controlType: AdminControlType){
    this.name = AdminControlType[controlType]
  }

}