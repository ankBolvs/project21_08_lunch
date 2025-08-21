import { Injectable } from '@angular/core';

export interface Group {
  id?: string;
  group_id?: string;
  group_name?: string;
  description?: string;
  category?: string;
  created_by?: string;
  members?: Array<string>;
  expenses?: Array<string>;
}
