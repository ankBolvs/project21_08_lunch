import { Injectable } from '@angular/core';

@Injectable()
export class Expense {
  public expense_id?: string;
  public group_id?: string;
  public description?: string;
  public amount?: number;
  public paid_by?: string;
  public date?: string;
  public users?: Array<string>;
}
