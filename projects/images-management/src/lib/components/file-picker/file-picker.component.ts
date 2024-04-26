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
  @Input() compress: boolean = false;
  @Input() accept: string = 'image/*';

  @Input() imagesModel: Array<Record<string, any>> = [];

  @Input() path: string = '';

  @Input() public buttonText: string = '';
  @Input() public color: string = 'primary';
  @Input() public forceOrientation:
    | undefined
    | Array<'portrait' | 'landscape' | 'square'> = undefined;

  @Output() onImagesChange: EventEmitter<
    Array<Record<string, any>> | Record<string, any>
  > = new EventEmitter();

  @Output() onError: EventEmitter<string> = new EventEmitter();

  protected capacitor = Capacitor;
  public isLoading = false;
  public message: string | undefined;

  constructor(
    public filepickerService: FilepickerService,
    public platform: Platform
  ) {}

  ngOnInit() {}

  async compressFile() {
    this.message = undefined;
    this.onError.emit('');

    this.isLoading = true;

    try {
      const storedImages = await this.filepickerService.compressFile(
        this.path,
        this.compress,
        this.accept,
        this.forceOrientation
      );

      if (storedImages) {
        const imagesCp = [...this.imagesModel];
        imagesCp.push(storedImages);

        this.onImagesChange.emit(imagesCp);
      }
    } catch (error: any) {
      console.log(error);
      this.message = error;
      this.onError.emit(error);
      this.isLoading = false;
    }
    this.isLoading = false;
  }
}
