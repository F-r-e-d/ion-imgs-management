import { Platform } from '@ionic/angular';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { FilepickerService } from '../../services/filepickerService/filepicker.service';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss'],
})
export class FilePickerComponent implements OnInit {
  @Input() compress: boolean = true;

  @Input() imagesModel: Array<Record<string, any>> = [];
  @Output() imagesModelChange: EventEmitter<Array<Record<string, any>>> = new EventEmitter();

  // @Input() multiple: boolean = false;
  @Input() image: Record<string, any> = {};
  @Output() imageChange: EventEmitter<Record<string, any>> = new EventEmitter();


  @Input() buttonText: string = '';
  @Input() color: string = 'primary';

  @Output() onImagesChange: EventEmitter<
    Array<Record<string, any>> | Record<string, any>
  > = new EventEmitter();

  capacitor = Capacitor;
  isLoading = false;

  constructor(
    public filepickerService: FilepickerService,
    public platform: Platform
  ) {}

  ngOnInit() {}

  async compressFile() {

    this.isLoading = true;

    const storedImages = await this.filepickerService.compressFile(this.compress);

    if (storedImages) {

      const imagesCp = [...this.imagesModel];
      imagesCp.push(storedImages);
      this.imagesModelChange.emit(imagesCp);

      this.onImagesChange.emit(storedImages);

    }
    this.isLoading = false;
  }
}
