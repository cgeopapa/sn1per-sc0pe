import { Component, OnInit } from '@angular/core';
import { Constants } from '../constants';

@Component({
  selector: 'app-new-scan',
  templateUrl: './new-scan.component.html',
  styleUrls: ['./new-scan.component.scss']
})
export class NewScanComponent implements OnInit {
  public readonly scanTypes: any[] = [];

  public selectedScanType: string | null = null;
  public ipDomain: string | null = null;
  public scanName: string | null = null;
  
  constructor() { 
    const consts = new Constants();
    this.scanTypes = consts.scanTypes;
  }
    
  ngOnInit(): void {
  }

}
